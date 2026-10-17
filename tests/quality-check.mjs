import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
assert.ok(scripts.length > 0, 'Expected application JavaScript');
const appScript = scripts.join('\n');
assert.doesNotThrow(() => new Function(appScript), 'Application JavaScript must parse');

const requiredIds = [
  'sampleBoard', 'board', 'checkBtn', 'guideCheckBtn', 'guideNextBtn',
  'reportStars', 'reportAttempts', 'reportAccuracy', 'skillReport', 'exportReportBtn'
];
for (const id of requiredIds) {
  assert.ok(html.includes('id="' + id + '"'), 'Missing required UI element: ' + id);
}
for (const feature of ['makeLevelQuestion', 'renderParentReport', 'updateGuide', 'kidsLearningProgress.v1']) {
  assert.ok(appScript.includes(feature), 'Missing required feature: ' + feature);
}

const match = appScript.match(/const activityData=([\s\S]*?)\nlet activeActivity=/);
assert.ok(match, 'Expected the learning activity question bank');
const activities = new Function('return (' + match[1].trim().replace(/;\s*$/, '') + ')')();
assert.deepEqual(Object.keys(activities).sort(), ['count', 'letters', 'math', 'pattern', 'shapes']);
let questionCount = 0;
for (const [skill, questions] of Object.entries(activities)) {
  assert.ok(questions.length >= 6, skill + ' should have at least six starter questions');
  for (const question of questions) {
    questionCount++;
    assert.ok(question.options.includes(question.answer), skill + ': answer must be present in choices');
    assert.equal(new Set(question.options).size, question.options.length, skill + ': choices should be unique');
  }
}
assert.ok(questionCount >= 30, 'Expected at least 30 starter questions');

const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
assert.match(sw, /kids-coloring-game-v\d+/, 'Service worker cache must be versioned');
console.log('Quality checks passed: JavaScript syntax, required UI, 5 activity types, ' + questionCount + ' questions, answer choices, and cache version.');
