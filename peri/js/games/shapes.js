import {quiz} from '../quiz.js';
import {SHAPES,pick,shuffle} from '../data.js';
import {level} from '../core.js';
const objects={'دایره':['⚽','🏀','🕐'],'مربع':['📦','🎁','🪟'],'مثلث':['⛺','🍕','🎄'],'ستاره':['⭐','🌟','✨'],'قلب':['💗','💖','❤️'],'لوزی':['🔶','💠','🔷']};
export function start(){
  const lv=level('shapes'),pool=SHAPES.slice(0,lv===1?4:6),target=pick(pool),isObject=lv===3&&Math.random()<.5;
  let choices;
  if(isObject){
    const all=Object.entries(objects).map(([name,icons])=>({value:name,html:icons.join('　')}));
    const distractors=shuffle(all.filter(x=>x.value!==target[0])).slice(0,lv+1);
    choices=shuffle([{value:target[0],html:objects[target[0]].join('　')},...distractors]);
  }else{
    choices=shuffle([target,...shuffle(pool.filter(x=>x!==target)).slice(0,lv+1)].map(x=>({value:x[0],html:x[1]+'<br><small>'+x[0]+'</small>'})));
  }
  quiz('shapes',start,isObject?'کدام چیزها شبیه '+target[0]+' هستند؟':'این شکل چه نام دارد؟','<div class="big-number">'+target[1]+'</div>',choices,v=>v===target[0]);
}