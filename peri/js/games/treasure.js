import {pick,shuffle,fa} from '../data.js';
import {level,record,addStar,renderHeader,speak} from '../core.js';
const things=[['پروانه','🦋'],['گل','🌸'],['کفشدوزک','🐞'],['قارچ','🍄'],['زنبور','🐝'],['خرگوش','🐇'],['آفتابگردان','🌻'],['جوجه‌تیغی','🦔']];
export function start(){
  const lv=level('treasure'),target=pick(things),n=lv+Math.floor(Math.random()*4),total=12,others=things.filter(x=>x!==target);
  const grid=Array.from({length:total},(_,i)=>i<n?target:pick(others));
  for(let i=grid.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[grid[i],grid[j]]=[grid[j],grid[i]]}
  let found=0,misses=0,finished=false,mistakeRecorded=false;
  const root=document.querySelector('#app'),bubble=document.querySelector('#bubble');bubble.textContent='با دقت بگرد و گنج‌ها را لمس کن!';
  root.innerHTML='<section class="panel"><div class="question">'+target[1]+' '+target[0]+'ها را پیدا کن؛ باید '+fa(n)+' تا جمع کنی.</div><p id="treasureCount" class="question">پیداشده: ۰ از '+fa(n)+'</p><div id="treasureGrid" class="cards"></div><p id="treasureFeedback" class="question">هر '+target[0]+' را لمس کن؛ بقیه را نزن.</p><div class="actions"><button id="homeTreasure" class="primary">🏠 خانه</button></div></section>';
  const board=root.querySelector('#treasureGrid'),counter=root.querySelector('#treasureCount'),feedback=root.querySelector('#treasureFeedback');
  root.querySelector('#homeTreasure').onclick=()=>document.dispatchEvent(new Event('peri:home'));
  function complete(){if(finished)return;finished=true;record('treasure',true);const reward=addStar();renderHeader();feedback.textContent=reward.evolved?'آفرین! پری بزرگ‌تر شد! '+reward.stage.e:'همه‌ی گنج‌ها را پیدا کردی! ⭐';speak(feedback.textContent);board.querySelectorAll('button').forEach(b=>b.disabled=true);const next=document.createElement('button');next.className='primary';next.textContent='گنج بعدی 🔍';next.onclick=start;root.querySelector('.actions').append(next)}
  grid.forEach((item,i)=>{const b=document.createElement('button');b.className='option';b.style.cssText='min-height:76px;font-size:32px;padding:8px';b.textContent=item[1];b.setAttribute('aria-label','شیء شماره '+fa(i+1));b.onclick=()=>{if(finished||b.disabled)return;if(item===target){b.disabled=true;b.style.background='#c7f5df';b.textContent='✅';found++;counter.textContent='پیداشده: '+fa(found)+' از '+fa(n);feedback.textContent='آفرین! یکی پیدا شد.';if(found===n)complete()}else{misses++;if(!mistakeRecorded){record('treasure',false);mistakeRecorded=true}b.disabled=true;b.style.opacity='.45';feedback.textContent='این گنج نیست؛ دوباره با دقت نگاه کن.';if(misses%2===0)speak('دنبال '+target[0]+' بگرد')}};board.append(b)});
}