import {quiz} from '../quiz.js';
import {LETTERS,shuffle} from '../data.js';
import {level} from '../core.js';
export function start(){
  const lv=level('letters'),pool=LETTERS.slice(0,[10,20,30][lv-1]),target=pool[Math.floor(Math.random()*pool.length)];
  const mode=Math.random()<.5;
  const distractors=shuffle(pool.filter(x=>x!==target)).slice(0,lv+1);
  const options=shuffle([target,...distractors]).map(x=>({value:mode?x[1]:x[0],html:mode?x[2]+'<br><strong>'+x[1]+'</strong>':'<span style="font-size:30px">'+x[2]+'</span><br><strong>'+x[1]+'</strong>'}));
  quiz('letters',start,mode?'کدام کلمه با حرف «'+target[0]+'» شروع می‌شود؟':'کدام تصویر با حرف «'+target[0]+'» شروع می‌شود؟','<div class="big-number">'+target[0]+'</div>',options,v=>v===(mode?target[1]:target[0]));
}