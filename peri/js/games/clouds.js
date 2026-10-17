import {quiz} from '../quiz.js';
import {fa,shuffle} from '../data.js';
import {level} from '../core.js';
export function start(){
  const lv=level('clouds');
  let step=1,n;
  if(lv===1)n=3+Math.floor(Math.random()*6);
  else if(lv===2)n=3+Math.floor(Math.random()*18);
  else {step=[2,5,10][Math.floor(Math.random()*3)];n=(3+Math.floor(Math.random()*6))*step;}
  const answer=n+step;
  const pool=new Set([answer,answer-step,answer+step,answer+2*step,answer+3*step]);
  while(pool.size<3)pool.add(answer+pool.size*step);
  const choices=shuffle([...pool]).slice(0,3);
  if(!choices.includes(answer))choices[0]=answer;
  const sequence=[n-2*step,n-step,n,'❓'].map(x=>typeof x==='number'?'<span class="tile">☁️<br><small>'+fa(x)+'</small></span>':'<span class="tile">☁️<br><small>؟</small></span>').join('');
  quiz('clouds',start,lv===1?'عدد بعدی در دنباله چیست؟':('هر بار '+fa(step)+' تا اضافه می‌شود؛ عدد بعدی چیست?'),'<div class="fairy-row" style="direction:ltr"><span>🧚</span>'+sequence+'</div>',choices.map(x=>({value:x,html:'☁️ '+fa(x)})),v=>v===answer);
}