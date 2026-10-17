import {quiz} from '../quiz.js';
import {FRUITS,fa,shuffle,NUMBER_WORDS} from '../data.js';
import {level} from '../core.js';
export function start(){
  const lv=level('cafe'),max=lv===1?5:lv===2?9:8;
  const n=lv===3?2+Math.floor(Math.random()*7):1+Math.floor(Math.random()*max);
  const fruit=FRUITS[Math.floor(Math.random()*FRUITS.length)];
  const values=[n,Math.max(1,n-1),Math.min(max+1,n+1)];
  const choices=shuffle([...new Set(values)]).map(value=>({value,html:'🍽️ '+fa(value)+' تا'}));
  const picture='<div class="fairy-row"><span>🐻</span><span style="font-size:42px">'+Array(n).fill(fruit[1]).join(' ')+'</span></div><p>سفارش: '+fa(n)+' تا '+fruit[0]+'</p>';
  quiz('cafe',start,'برای خرس مهربان '+fa(n)+' تا '+fruit[0]+' آماده کن.',picture,choices,v=>v===n);
}