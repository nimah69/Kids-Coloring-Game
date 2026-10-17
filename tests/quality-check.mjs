import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const html = read('../index.html');
const js = read('../app.js');
const css = read('../style.css');
const sw = read('../sw.js');
const manifest = JSON.parse(read('../manifest.webmanifest'));

assert.doesNotThrow(() => new Function(js), 'app.js must parse');
for (const id of ['sampleBoard', 'board', 'checkBtn', 'guideCheckBtn', 'guideNextBtn',
  'reportStars', 'reportAttempts', 'reportAccuracy', 'skillReport', 'exportReportBtn',
  'childProfile', 'resetProgressBtn']) {
  assert.ok(html.includes('id="' + id + '"'), 'Missing required UI element: ' + id);
}
assert.ok(html.includes('href="./style.css"') && html.includes('src="./app.js"'));
assert.ok(!html.includes('\\n<section class="guide-panel"'), 'Raw \\n before guide panel');
assert.ok(!css.includes('\\n.guide-panel'), 'Raw \\n before guide CSS');
assert.ok(js.includes('kidsColoringGame.v2:') && js.includes('migrateLegacyDrawing'), 'Versioned drawing storage and migration required');
assert.ok(js.includes('pointerdown') && js.includes('pointermove') && js.includes('pointerup') && js.includes('pointercancel') && js.includes('lostpointercapture'), 'Pointer painting and cancellation handling required');
assert.match(js,/if\(!currentMask\[i\]\)continue/, 'Drawing score must count only cells inside the shape');
assert.ok(!js.includes("v<.5?'#b8a1ff'"), 'Pattern target colors must exist in the palette');
assert.ok(js.includes('getVoices()') && js.includes("startsWith('fa')") && js.includes('Extended_Pictographic'), 'Persian voice detection and emoji cleanup required');
assert.ok(js.includes('kidsLearningProgress.v2:') && js.includes('kidsColoringProfile.v1'), 'Independent child profiles required');
assert.ok(js.includes("toLocaleString('fa-IR')"), 'Persian number formatting required');
assert.ok(js.includes('function shuffleOptions(arr){const out=arr.slice();for('), 'Fisher-Yates shuffle required');

for (const path of ['favicon.svg', 'apple-touch-icon.svg', 'icon-maskable.svg']) {
  assert.ok(existsSync(new URL('../' + path, import.meta.url)), 'Missing PWA icon: ' + path);
}
assert.ok(manifest.icons.length >= 2, 'Manifest icons required');
assert.ok(sw.includes('./app.js') && sw.includes('./style.css'), 'Cache must include split assets');
assert.match(sw, /kids-coloring-game-v\d+/, 'Versioned cache required');
assert.match(sw, /key\.startsWith\('kids-coloring-game-'\)/, 'Only this app cache family should be removed');

assert.match(sw, /event\.request\.mode === 'navigate'/, 'Offline HTML fallback must be limited to navigations');
assert.match(sw, /throw error/, 'Missing offline assets must not be answered with HTML');

const patternMatch = js.match(/const patterns=\{([\s\S]*?)\n\};/);
assert.ok(patternMatch, 'Pattern definitions required');
const patterns = new Function('return ({' + patternMatch[1] + '})')();
for (const name of ['heart', 'fish', 'butterfly']) {
  const rows = patterns[name];
  assert.ok(rows.every(row => row.length === rows[0].length), name + ': rows must have equal width');
  for (const row of rows) assert.equal(row, [...row].reverse().join(''), name + ': rows must be symmetrical');
}

const bankMatch = js.match(/const activityData=([\s\S]*?)\nlet activeActivity=/);
assert.ok(bankMatch, 'Learning question bank required');
const bank = new Function('return (' + bankMatch[1].trim().replace(/;\s*$/, '') + ')')();
assert.deepEqual(Object.keys(bank).sort(), ['count', 'letters', 'math', 'pattern', 'shapes']);
let total = 0;
for (const [skill, questions] of Object.entries(bank)) {
  assert.ok(questions.length >= 15, skill + ': expected at least 15 questions');
  if(skill==='pattern'||skill==='shapes')assert.equal(new Set(questions.map(q=>q.visual)).size,questions.length,skill+': repeated visuals');
  for (const question of questions) {
    total++;
    assert.ok(question.options.includes(question.answer), skill + ': answer must be in options');
    assert.equal(new Set(question.options).size, question.options.length, skill + ': duplicate options');
  }
}
const mathFunction = js.match(/function makeLevelQuestion\([\s\S]*?\nfunction renderActivity/);
assert.ok(mathFunction && !/options=[^;]*\.map\(String\)/.test(mathFunction[0]), 'Generated number options should use Persian formatting');
assert.ok(html.includes('Content-Security-Policy'), 'CSP meta tag required');
assert.equal((html.match(/id="sampleBoard"[^>]*aria-label=/g)||[]).length,1,'sample board must have one aria-label');
assert.equal((html.match(/id="board"[^>]*aria-label=/g)||[]).length,1,'drawing board must have one aria-label');
assert.ok(css.includes('font-family:"Vazirmatn"'), 'Vazirmatn font family should be configured');
const fontSizes = [...css.matchAll(/font-size:([0-9]+([.][0-9]+)?)px/g)].map(match => Number(match[1]));
assert.ok(fontSizes.every(size => size >= 12), 'All explicit font sizes must be at least 12px');
console.log('Quality checks passed: JavaScript syntax, a11y elements, storage migration, pointer painting, 3 symmetric patterns, 75+ questions, PWA assets, and CSP.');
