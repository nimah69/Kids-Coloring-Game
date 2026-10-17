import {FRUITS,fa} from '../data.js';
import {level,record,addStar,renderHeader,speak} from '../core.js';
function win(){
  record('cafe',true);const reward=addStar();renderHeader();
  const bubble=document.querySelector('#bubble');bubble.textContent=reward.evolved?'آفرین! پری بزرگ‌تر شد! '+reward.stage.e:'سفارش کامل شد! آفرین آشپز کوچولو! ⭐';speak(bubble.textContent);
  const root=document.querySelector('#app');root.querySelectorAll('button').forEach(b=>b.disabled=true);
  const next=document.createElement('button');next.className='primary';next.textContent='سفارش بعدی 🍓';next.disabled=false;next.onclick=start;root.querySelector('.actions').append(next);
}
export function start(){
  const lv=level('cafe'),max=lv===1?4:lv===2?7:9,n=1+Math.floor(Math.random()*max),fruit=FRUITS[Math.floor(Math.random()*FRUITS.length)];
  let served=0,wrongCount=0;
  const root=document.querySelector('#app'),bubble=document.querySelector('#bubble');
  bubble.textContent='بیا با هم سفارش مشتری را آماده کنیم!';
  root.innerHTML='<section class="panel"><div class="question">برای خرس مهربان '+fa(n)+' تا '+fruit[0]+' آماده کن.</div><div class="picture">🐻</div><p style="text-align:center">سفارش: '+fruit[1]+' × '+fa(n)+'</p><div id="plate" class="cards" style="grid-template-columns:repeat(3,minmax(0,1fr));min-height:90px"></div><p id="cafeFeedback" class="question">میوه‌ی درست را لمس کن تا به بشقاب اضافه شود.</p><div id="fruitChoices" class="cards"></div><div class="actions"><button id="homeCafe" class="primary">🏠 خانه</button></div></section>';
  const plate=root.querySelector('#plate'),feedback=root.querySelector('#cafeFeedback'),choices=root.querySelector('#fruitChoices');
  root.querySelector('#homeCafe').onclick=()=>document.dispatchEvent(new Event('peri:home'));
  function update(){plate.innerHTML='';for(let i=0;i<served;i++){const item=document.createElement('div');item.className='panel';item.style.cssText='font-size:30px;text-align:center;padding:8px;margin:0';item.textContent=fruit[1];plate.append(item)}feedback.textContent='در بشقاب: '+fa(served)+' از '+fa(n);if(served===n){feedback.textContent='سفارش کامل شد! ⭐';win()}}
  FRUITS.forEach(item=>{const b=document.createElement('button');b.className='option';b.innerHTML='<span style="font-size:30px">'+item[1]+'</span><br>'+item[0];b.onclick=()=>{if(served>=n)return;if(item===fruit){served++;update()}else{wrongCount++;record('cafe',false);feedback.textContent='این میوه در سفارش نیست. دنبال '+fruit[0]+' بگرد! 💛';if(wrongCount%2===0)speak('دنبال '+fruit[0]+' بگرد')}};choices.append(b)});
}