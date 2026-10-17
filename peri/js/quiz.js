import {record,addStar,speak,fireworks,renderHeader} from './core.js';
const praise=['آفرین! ✨','عالی بود! 🌟','چه باهوشی! 🦋','درست گفتی! 🎉'];
let pendingNext=null;
export function quiz(game,next,instruction,visual,options,isCorrect,classes='',replay=null){
  if(pendingNext!==null){clearTimeout(pendingNext);pendingNext=null}
  const root=document.querySelector('#app'),bubble=document.querySelector('#bubble');
  bubble.textContent=instruction;speak(instruction);
  root.innerHTML='<section class="panel"><div class="question"></div><div class="picture"></div><div class="options"></div><div class="actions"><button id="hear" aria-label="شنیدن دوباره">🔊 شنیدن دوباره</button><button id="home" class="primary">🏠 خانه</button></div></section>';
  root.querySelector('.question').textContent=instruction;
  root.querySelector('.picture').innerHTML=visual;
  root.querySelector('#hear').onclick=()=>{speak(instruction);if(typeof replay==='function')replay()};
  root.querySelector('#home').onclick=()=>{if(pendingNext!==null)clearTimeout(pendingNext);pendingNext=null;document.dispatchEvent(new Event('peri:home'))};
  const box=root.querySelector('.options');let solved=false;const tried=new Set();
  options.forEach((op,i)=>{
    const b=document.createElement('button');b.className='option '+classes;b.innerHTML=op.html;b.dataset.option=String(i);
    b.onclick=()=>{
      if(solved||tried.has(i)||b.disabled)return;
      tried.add(i);
      if(isCorrect(op.value)){
        solved=true;Array.from(box.children).forEach(el=>{el.disabled=true;el.classList.remove('hint')});b.classList.add('correct');
        record(game,true);const reward=addStar();renderHeader();
        bubble.textContent=reward.evolved?'هورا! پری بزرگ‌تر شد! '+reward.stage.e+' '+praise[Math.floor(Math.random()*praise.length)]:praise[Math.floor(Math.random()*praise.length)];
        speak(bubble.textContent);pendingNext=setTimeout(()=>{pendingNext=null;next()},1800);
      }else{
        b.disabled=true;record(game,false);b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');
        bubble.textContent='اشکال ندارد، دوباره امتحان کن 💛';
        if(tried.size>=2){const target=[...box.children].find((el,j)=>isCorrect(options[j].value));target?.classList.add('hint')}
        speak(bubble.textContent);
      }
    };
    box.append(b);
  });
}
export function homeButton(){if(pendingNext!==null)clearTimeout(pendingNext);pendingNext=null;document.dispatchEvent(new Event('peri:home'))}

document.addEventListener('peri:home',()=>{if(pendingNext!==null)clearTimeout(pendingNext);pendingNext=null});
