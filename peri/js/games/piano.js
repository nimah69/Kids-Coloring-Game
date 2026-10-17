import {quiz} from '../quiz.js';
import {shuffle} from '../data.js';
import {level,beep} from '../core.js';
const keys=[['قرمز','#e53935',262],['زرد','#fdd835',330],['سبز','#43a047',392],['آبی','#1e88e5',523],['بنفش','#8e24aa',659]];
function play(sequence){sequence.forEach((key,i)=>setTimeout(()=>beep(key[2]),i*360))}
function keyHtml(sequence){return sequence.map(k=>'<span class="color-dot" title="'+k[0]+'" style="background:'+k[1]+'"></span>').join(' ')}
export function start(){
  const lv=level('piano'),pool=keys.slice(0,lv+2),length=lv===1?2:lv===2?3:4;
  const target=Array.from({length},()=>pool[Math.floor(Math.random()*pool.length)]);
  const signature=s=>s.map(k=>k[0]).join('|');
  const sequences=[target],seen=new Set([signature(target)]);
  while(sequences.length<Math.min(3,lv+1)){
    const candidate=Array.from({length},()=>pool[Math.floor(Math.random()*pool.length)]);
    if(!seen.has(signature(candidate))){seen.add(signature(candidate));sequences.push(candidate)}
  }
  const choices=shuffle(sequences).map((s,i)=>({value:signature(s),html:keyHtml(s)}));
  play(target);
  quiz('piano',start,'به آهنگ گوش کن و همان ترتیب رنگ‌ها را انتخاب کن.', '<div class="fairy-row"><span style="font-size:54px">🎹</span><p>🔊 '+length+' نت</p></div>',choices,v=>v===signature(target),'',()=>play(target));
}