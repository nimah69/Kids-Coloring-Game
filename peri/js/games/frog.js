import {quiz} from '../quiz.js';
import {fa,shuffle} from '../data.js';
import {level} from '../core.js';
export function start(){
  const lv=level('frog'),max=lv===1?5:lv===2?20:99;
  let a=1+Math.floor(Math.random()*max),b=1+Math.floor(Math.random()*max);
  while(a===b)b=1+Math.floor(Math.random()*max);
  const greater=Math.random()<.5,answer=greater?Math.max(a,b):Math.min(a,b);
  const distractor=greater?Math.max(a,b)+1:Math.max(1,Math.min(a,b)-1);
  const values=[...new Set([a,b,distractor])];
  const choices=shuffle(values).map(x=>({value:x,html:lv===1?'🐸 '+('🍎 '.repeat(x)):'🐸 '+fa(x)}));
  const visual='<div class="fairy-row"><div class="panel"><strong>گروه اول</strong><p style="font-size:24px">'+(lv===1?'🍎 '.repeat(a):fa(a))+'</p></div><div class="panel"><strong>گروه دوم</strong><p style="font-size:24px">'+(lv===1?'🍎 '.repeat(b):fa(b))+'</p></div></div>';
  quiz('frog',start,lv===1?(greater?'کدام گروه سیب بیشتری دارد؟':'کدام گروه سیب کمتری دارد؟'):(greater?'کدام عدد بزرگ‌تر است؟':'کدام عدد کوچک‌تر است؟'),visual,choices,v=>v===answer);
}