import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const required = ['index.html','css/style.css','js/app.js','js/core.js','js/quiz.js','js/data.js','manifest.webmanifest','sw.js','icons/icon.svg','icons/favicon.svg',...['cafe','letters','clouds','frog','piano','treasure','shapes','colors'].map(x=>'js/games/'+x+'.js')];
for (const p of required) assert.ok(existsSync(new URL(p,root)), 'missing '+p);
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.lang,'fa');
const data=read('js/data.js');
const letters=(data.match(/\['[^']+','[^']+','[^']+'\]/g)||[]).length;
assert.equal(letters,30,'expected 30 letters');
assert.equal((data.match(/\['[^']+','#?[0-9a-fA-F]{6}'\]/g)||[]).length,17,'expected 17 colors');
assert.equal((data.match(/\['[^']+','[^']+'\]/g)||[]).length>=17,true,'expected at least 17 fruit entries');
const app=read('js/app.js');
for(const g of ['cafe','letters','clouds','frog','piano','treasure','shapes','colors']) assert.ok(app.includes("['"+g+"'"),'game not registered: '+g);
for(const p of required){const text=read(p);assert.ok(!text.includes('\\\\n'),'raw newline escape found in '+p)}
console.log('Peri quality checks passed.');
