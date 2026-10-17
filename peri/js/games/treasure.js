import {quiz} from '../quiz.js';
import {pick,shuffle,fa,NUMBER_WORDS} from '../data.js';
import {level} from '../core.js';
const things=[['پروانه','🦋'],['گل','🌸'],['کفشدوزک','🐞'],['قارچ','🍄'],['زنبور','🐝'],['خرگوش','🐇'],['آفتابگردان','🌻'],['جوجه‌تیغی','🦔']];
export function start(){
  const lv=level('treasure'),target=pick(things),n=lv+Math.floor(Math.random()*4),total=12;
  const otherThings=things.filter(x=>x!==target);
  const grid=Array.from({length:total},(_,i)=>i<n?target:pick(otherThings));
  for(let i=grid.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[grid[i],grid[j]]=[grid[j],grid[i]]}
  const values=[...new Set([n,Math.max(1,n-1),n+1])];
  const options=shuffle(values).map(x=>({value:x,html:'🔢 '+fa(x)+' تا'}));
  const picture='<div class="cards">'+grid.map(x=>'<div class="panel" style="text-align:center;font-size:30px;padding:8px">'+x[1]+'</div>').join('')+'</div>';
  quiz('treasure',start,NUMBER_WORDS[Math.min(n,10)]+' ('+fa(n)+') تا '+target[0]+' پیدا کن و بشمار.',picture,options,v=>v===n);
}