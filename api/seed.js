require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const CourseContent = require('./src/models/CourseContent');

// ─── HTML GAMES ────────────────────────────────────────────────────────────────

const GAME_COLETA = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#e8f5e9;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#1b5e20;font-size:1.4rem;margin-bottom:4px}
#subtitle{color:#555;font-size:.9rem;margin-bottom:12px}
#item-box{font-size:72px;text-align:center;margin:8px 0;min-height:90px;line-height:90px}
#item-name{font-size:1rem;color:#333;text-align:center;margin-bottom:10px;font-weight:bold}
.bins{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:10px}
.bin{width:82px;height:92px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;border:none;transition:transform .12s;gap:2px}
.bin:hover{transform:scale(1.08)}
.bin span.label{font-size:11px;font-weight:900;color:#fff;text-align:center;line-height:1.1}
.bin span.icon{font-size:26px}
#feedback{min-height:32px;font-size:1rem;font-weight:bold;text-align:center;padding:4px}
#progress{color:#888;font-size:.85rem;margin-top:4px}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#1b5e20;font-size:1.6rem}
#done p{color:#333;margin-top:8px}
</style></head><body>
<h2>♻️ Coleta Seletiva</h2>
<p id="subtitle">Onde vai este resíduo?</p>
<div id="game">
  <div id="item-box">🍶</div>
  <div id="item-name"></div>
  <p id="feedback"></p>
  <div class="bins">
    <button class="bin" style="background:#1565c0" onclick="answer('azul')"><span class="icon">📄</span><span class="label">AZUL<br>Papel</span></button>
    <button class="bin" style="background:#c62828" onclick="answer('vermelho')"><span class="icon">🧴</span><span class="label">VERM.<br>Plástico</span></button>
    <button class="bin" style="background:#2e7d32" onclick="answer('verde')"><span class="icon">🍶</span><span class="label">VERDE<br>Vidro</span></button>
    <button class="bin" style="background:#e65100" onclick="answer('marrom')"><span class="icon">🍂</span><span class="label">MARROM<br>Orgânico</span></button>
    <button class="bin" style="background:#f57f17;color:#000" onclick="answer('amarelo')"><span class="icon">🥫</span><span class="label" style="color:#000">AMAR.<br>Metal</span></button>
  </div>
  <p id="progress"></p>
</div>
<div id="done">
  <div style="font-size:64px">🏆</div>
  <h3>Parabéns!</h3>
  <p id="done-score"></p>
  <p style="color:#2e7d32;margin-top:8px;font-size:.95rem">Você ajudou o planeta! 🌍</p>
</div>
<script>
const items=[
  {e:'📰',b:'azul',n:'Jornal'},
  {e:'🧴',b:'vermelho',n:'Frasco de shampoo'},
  {e:'🍶',b:'verde',n:'Garrafa de vidro'},
  {e:'🍌',b:'marrom',n:'Casca de banana'},
  {e:'🥫',b:'amarelo',n:'Lata de alumínio'},
  {e:'📦',b:'azul',n:'Caixa de papelão'},
  {e:'🧃',b:'vermelho',n:'Caixinha de suco'},
  {e:'🍷',b:'verde',n:'Garrafa de vinho'},
  {e:'🥚',b:'marrom',n:'Casca de ovo'},
  {e:'🪣',b:'amarelo',n:'Balde metálico'}
];
let idx=0,score=0,blocked=false;
function show(){
  if(idx>=items.length){finish();return;}
  document.getElementById('item-box').textContent=items[idx].e;
  document.getElementById('item-name').textContent=items[idx].n;
  document.getElementById('feedback').textContent='';
  document.getElementById('progress').textContent='Item '+(idx+1)+' de '+items.length+' | Acertos: '+score;
}
function answer(bin){
  if(blocked)return;blocked=true;
  const fb=document.getElementById('feedback');
  if(bin===items[idx].b){score++;fb.style.color='#2e7d32';fb.textContent='✅ Correto!';}
  else{fb.style.color='#c62828';fb.textContent='❌ Vai no lixo '+items[idx].b.toUpperCase()+'!';}
  idx++;setTimeout(()=>{blocked=false;show();},900);
}
function finish(){
  document.getElementById('game').style.display='none';
  const d=document.getElementById('done');d.style.display='block';
  document.getElementById('done-score').textContent='Você acertou '+score+' de '+items.length+' itens!';
  window.parent.postMessage('GAME_COMPLETED','*');
}
show();
</script></body></html>`;

// ─────────────────────────────────────────────────────────────────────────────

const GAME_AGUA = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(160deg,#e3f2fd,#b3e5fc);font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#01579b;margin-bottom:4px;font-size:1.4rem}
#subtitle{color:#555;font-size:.9rem;margin-bottom:12px}
#hud{display:flex;gap:20px;margin-bottom:10px;font-weight:bold;color:#01579b}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:300px}
.faucet{width:90px;height:90px;border-radius:16px;font-size:48px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:3px solid transparent;transition:transform .1s;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.1)}
.faucet.drip{background:#fff3e0;border-color:#fb8c00;animation:shake .4s infinite}
.faucet.closed{background:#e8f5e9;border-color:#43a047;cursor:default}
@keyframes shake{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
#bar-wrap{width:280px;height:18px;background:#e0e0e0;border-radius:9px;overflow:hidden;margin-bottom:6px}
#bar{height:100%;width:100%;background:#42a5f5;border-radius:9px;transition:width .5s}
#msg{font-size:.95rem;color:#555;min-height:22px;text-align:center}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#01579b;font-size:1.5rem}
</style></head><body>
<h2>💧 Economize Água</h2>
<p id="subtitle">Feche as torneiras que estão pingando!</p>
<div id="hud"><span>⏱ <span id="timer">30</span>s</span><span>✅ <span id="closed">0</span>/15</span><span>💧 -<span id="wasted">0</span>L</span></div>
<div id="bar-wrap"><div id="bar"></div></div>
<p id="msg">Clique nas torneiras que estão pingando! 💦</p>
<div class="grid" id="grid"></div>
<div id="done"><div style="font-size:64px" id="done-emoji">🌊</div><h3 id="done-title"></h3><p id="done-msg"></p></div>
<script>
const grid=document.getElementById('grid');
let states=Array(9).fill('off'),wasted=0,closed=0,timeLeft=30,interval,dripInterval,target=15,done=false;
function render(){
  grid.innerHTML='';
  states.forEach((s,i)=>{
    const d=document.createElement('div');
    d.className='faucet '+(s==='drip'?'drip':s==='closed'?'closed':'');
    d.textContent=s==='drip'?'💦':s==='closed'?'✅':'🚿';
    if(s==='drip')d.onclick=()=>close(i);
    grid.appendChild(d);
  });
}
function close(i){
  if(states[i]!=='drip')return;
  states[i]='closed';closed++;
  document.getElementById('closed').textContent=closed;
  render();
  if(closed>=target)finish(true);
}
function addDrip(){
  const off=states.map((s,i)=>s==='off'?i:-1).filter(i=>i>=0);
  if(off.length===0)return;
  const i=off[Math.floor(Math.random()*off.length)];
  states[i]='drip';render();
}
function tick(){
  timeLeft--;
  document.getElementById('timer').textContent=timeLeft;
  // count dripping faucets → waste water
  const dripping=states.filter(s=>s==='drip').length;
  wasted+=dripping*2;
  document.getElementById('wasted').textContent=wasted;
  // update bar
  document.getElementById('bar').style.width=Math.max(0,(1-wasted/200)*100)+'%';
  if(wasted>=200){finish(false);return;}
  if(timeLeft<=0){finish(closed>=Math.floor(target*0.6));return;}
}
function finish(win){
  if(done)return;done=true;
  clearInterval(interval);clearInterval(dripInterval);
  document.getElementById('grid').style.display='none';
  document.getElementById('hud').style.display='none';
  document.getElementById('bar-wrap').style.display='none';
  document.getElementById('msg').style.display='none';
  const d=document.getElementById('done');d.style.display='block';
  if(win){
    document.getElementById('done-emoji').textContent='🏆';
    document.getElementById('done-title').textContent='Você economizou água!';
    document.getElementById('done-msg').textContent='Fechou '+closed+' torneiras e evitou o desperdício!';
  } else {
    document.getElementById('done-emoji').textContent='💧';
    document.getElementById('done-title').textContent='Boa tentativa!';
    document.getElementById('done-msg').textContent='Fechou '+closed+' torneiras. Cada gota conta!';
  }
  window.parent.postMessage('GAME_COMPLETED','*');
}
// start
for(let i=0;i<3;i++)addDrip();
render();
dripInterval=setInterval(()=>{if(!done)addDrip();},3000);
interval=setInterval(()=>{if(!done)tick();},1000);
</script></body></html>`;

// ─────────────────────────────────────────────────────────────────────────────

const GAME_ARVORES = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(160deg,#efebe9,#d7ccc8);font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#3e2723;font-size:1.4rem;margin-bottom:4px}
#subtitle{color:#555;font-size:.9rem;margin-bottom:10px;text-align:center}
#hud{display:flex;gap:16px;margin-bottom:10px;font-weight:bold}
.bar-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;width:300px}
.bar-label{font-size:.85rem;width:80px;color:#555}
.bar-wrap{flex:1;height:16px;background:#e0e0e0;border-radius:8px;overflow:hidden}
.bar-fill{height:100%;border-radius:8px;transition:width .4s}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:310px}
.cell{width:56px;height:56px;border-radius:10px;font-size:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .15s;border:2px solid transparent}
.cell:hover{transform:scale(1.1)}
.cell.polluted{background:#b0bec5}
.cell.empty{background:#d7ccc8;border-color:#bcaaa4}
.cell.planted{background:#c8e6c9;border-color:#81c784;cursor:default}
#msg{font-size:.9rem;color:#555;margin-top:8px;text-align:center;min-height:20px}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#1b5e20;font-size:1.5rem}
</style></head><body>
<h2>🌱 Plante Árvores na Cidade</h2>
<p id="subtitle">Plante árvores nos terrenos e reduza a poluição!</p>
<div class="bar-row"><span class="bar-label">🌿 Verde</span><div class="bar-wrap"><div class="bar-fill" id="green-bar" style="background:#66bb6a;width:0%"></div></div></div>
<div class="bar-row"><span class="bar-label">🏭 Poluição</span><div class="bar-wrap"><div class="bar-fill" id="poll-bar" style="background:#78909c;width:100%"></div></div></div>
<p id="msg">Clique nos terrenos para plantar árvores! 🌳</p>
<div class="grid" id="grid"></div>
<div id="done"><div style="font-size:64px">🌳</div><h3>Cidade Verde!</h3><p id="done-msg"></p><p style="color:#2e7d32;margin-top:8px">Você ajudou o meio ambiente! 🌍</p></div>
<script>
const SIZE=15,TARGET=10;
let cells=Array(SIZE).fill(null).map(()=>Math.random()<0.4?'polluted':'empty');
let planted=0;
function render(){
  const g=document.getElementById('grid');g.innerHTML='';
  cells.forEach((s,i)=>{
    const d=document.createElement('div');
    d.className='cell '+s;
    d.textContent=s==='planted'?'🌳':s==='polluted'?'🏭':'🟫';
    if(s!=='planted')d.onclick=()=>plant(i);
    g.appendChild(d);
  });
  const pct=planted/TARGET;
  document.getElementById('green-bar').style.width=(pct*100)+'%';
  document.getElementById('poll-bar').style.width=Math.max(0,(1-pct)*100)+'%';
  document.getElementById('msg').textContent='Árvores plantadas: '+planted+'/'+TARGET;
}
function plant(i){
  if(cells[i]==='planted')return;
  cells[i]='planted';planted++;render();
  if(planted>=TARGET)setTimeout(finish,400);
}
function finish(){
  document.getElementById('grid').style.display='none';
  document.getElementById('msg').style.display='none';
  const d=document.getElementById('done');d.style.display='block';
  document.getElementById('done-msg').textContent='Você plantou '+planted+' árvores e transformou a cidade!';
  window.parent.postMessage('GAME_COMPLETED','*');
}
render();
</script></body></html>`;

// ─────────────────────────────────────────────────────────────────────────────

const GAME_QUIZ = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(135deg,#1b5e20,#27ae60);font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;min-height:100vh}
#card{background:#fff;border-radius:20px;padding:24px;max-width:460px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.2)}
#qnum{font-size:.85rem;color:#888;margin-bottom:6px}
#qtxt{font-size:1.1rem;font-weight:bold;color:#1b5e20;margin-bottom:16px;line-height:1.4}
.opt{display:block;width:100%;padding:12px 16px;margin-bottom:8px;border:2px solid #e0e0e0;border-radius:12px;background:#fafafa;font-size:.95rem;cursor:pointer;text-align:left;transition:border-color .15s,background .15s}
.opt:hover{border-color:#66bb6a;background:#f1f8e9}
.opt.correct{border-color:#2e7d32;background:#e8f5e9;color:#1b5e20;font-weight:bold}
.opt.wrong{border-color:#c62828;background:#ffebee;color:#b71c1c}
#feedback{min-height:28px;font-size:.9rem;font-weight:bold;margin:6px 0;text-align:center}
#next-btn{display:none;width:100%;padding:12px;background:#2e7d32;color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:bold;cursor:pointer;margin-top:8px}
#result{display:none;text-align:center}
#result h3{font-size:1.5rem;color:#1b5e20;margin-bottom:8px}
#prog{width:100%;height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;margin-bottom:16px}
#prog-fill{height:100%;background:#66bb6a;border-radius:3px;transition:width .4s}
</style></head><body>
<div id="card">
  <div id="prog"><div id="prog-fill" style="width:0%"></div></div>
  <div id="quiz-area">
    <p id="qnum"></p>
    <p id="qtxt"></p>
    <div id="opts"></div>
    <p id="feedback"></p>
    <button id="next-btn" onclick="next()">Próxima ➡</button>
  </div>
  <div id="result">
    <div id="res-emoji" style="font-size:56px;margin-bottom:8px"></div>
    <h3 id="res-title"></h3>
    <p id="res-score" style="color:#555;margin-bottom:12px"></p>
    <p id="res-msg" style="font-size:.9rem;color:#388e3c"></p>
  </div>
</div>
<script>
const qs=[
  {q:"O que é a regra dos 3 R's da sustentabilidade?",opts:["Reciclar, Reutilizar, Reduzir","Recolher, Reformar, Revender","Recusar, Retornar, Relançar","Reter, Recortar, Reembalar"],c:0,exp:"Reduzir o consumo, Reutilizar produtos e Reciclar materiais são os pilares da sustentabilidade!"},
  {q:"Qual energia é considerada 100% limpa e renovável?",opts:["Carvão mineral","Gás natural","Energia solar","Energia nuclear"],c:2,exp:"A energia solar não produz emissões e é inesgotável — vem direto do Sol!"},
  {q:"Quanto tempo leva para uma garrafa PET se decompor na natureza?",opts:["10 anos","50 anos","400 anos","1 ano"],c:2,exp:"Uma garrafa PET demora até 400 anos para se decompor! Por isso reciclar é tão importante."},
  {q:"O que é o efeito estufa?",opts:["Um tipo de jardim","Acúmulo de gases que aquece a Terra","Chuva ácida nas cidades","Desmatamento da Amazônia"],c:1,exp:"Gases como CO₂ retêm calor na atmosfera, elevando a temperatura global — o chamado efeito estufa."},
  {q:"Qual atitude economiza mais água no banho?",opts:["Banho de 20 minutos","Usar banheira","Fechar o chuveiro ao se ensaboar","Deixar a torneira aberta"],c:2,exp:"Fechar o chuveiro ao se ensaboar pode economizar até 90 litros por banho!"},
  {q:"O que é ESG?",opts:["Tipo de investimento em ações","Ambiental, Social e Governança","Empresa de energia","Sistema de gestão empresarial"],c:1,exp:"ESG significa Environmental (Ambiental), Social e Governance (Governança) — três pilares de responsabilidade corporativa."}
];
let idx=0,score=0,answered=false;
function show(){
  const q=qs[idx];
  document.getElementById('qnum').textContent='Pergunta '+(idx+1)+' de '+qs.length;
  document.getElementById('qtxt').textContent=q.q;
  document.getElementById('prog-fill').style.width=((idx/qs.length)*100)+'%';
  document.getElementById('feedback').textContent='';
  document.getElementById('next-btn').style.display='none';
  answered=false;
  const o=document.getElementById('opts');o.innerHTML='';
  q.opts.forEach((opt,i)=>{
    const b=document.createElement('button');b.className='opt';b.textContent=opt;
    b.onclick=()=>answer(i);o.appendChild(b);
  });
}
function answer(i){
  if(answered)return;answered=true;
  const q=qs[idx];const btns=document.querySelectorAll('.opt');
  btns[q.c].classList.add('correct');
  if(i!==q.c)btns[i].classList.add('wrong');
  else score++;
  const fb=document.getElementById('feedback');
  fb.style.color=i===q.c?'#2e7d32':'#c62828';
  fb.textContent=(i===q.c?'✅ ':' 💡 ')+q.exp;
  btns.forEach(b=>b.onclick=null);
  document.getElementById('next-btn').style.display='block';
}
function next(){
  idx++;
  if(idx>=qs.length)result();
  else show();
}
function result(){
  document.getElementById('quiz-area').style.display='none';
  document.getElementById('result').style.display='block';
  document.getElementById('prog-fill').style.width='100%';
  const pct=Math.round(score/qs.length*100);
  const emojis=['🌱','💧','🌳','🌍','🏆','🏆'];
  document.getElementById('res-emoji').textContent=emojis[score];
  document.getElementById('res-title').textContent=score>=5?'Especialista em ESG!':score>=3?'Muito bem!':'Continue aprendendo!';
  document.getElementById('res-score').textContent='Você acertou '+score+' de '+qs.length+' questões ('+pct+'%)';
  document.getElementById('res-msg').textContent=score>=5?'Incrível! Você conhece muito sobre sustentabilidade!':score>=3?'Bom trabalho! Continue explorando o tema.':'Não desanime — cada aprendizado conta para o planeta!';
  window.parent.postMessage('GAME_COMPLETED','*');
}
show();
</script></body></html>`;

// ─────────────────────────────────────────────────────────────────────────────

const GAME_CIDADE = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(160deg,#e8f5e9,#c8e6c9);font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#1b5e20;font-size:1.4rem;margin-bottom:4px}
#subtitle{color:#555;font-size:.9rem;margin-bottom:8px;text-align:center}
#score-bar{display:flex;gap:16px;margin-bottom:10px;font-weight:bold;color:#2e7d32;font-size:.95rem}
.legend{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:10px}
.leg-item{font-size:.78rem;background:#fff;border-radius:8px;padding:4px 8px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:320px}
.plot{width:70px;height:70px;border-radius:12px;font-size:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid #a5d6a7;background:#fff;transition:transform .12s;box-shadow:0 2px 6px rgba(0,0,0,.08)}
.plot:hover{transform:scale(1.08)}
.plot.built{cursor:default;background:#f1f8e9;border-color:#66bb6a}
#msg{font-size:.9rem;color:#555;margin-top:8px;text-align:center;min-height:20px}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#1b5e20;font-size:1.5rem}
</style></head><body>
<h2>🏙️ Cidade Sustentável</h2>
<p id="subtitle">Construa estruturas ecológicas na cidade!</p>
<div id="score-bar"><span>🏗️ Construídas: <span id="built-count">0</span>/12</span></div>
<div class="legend">
  <span class="leg-item">☀️ Painel Solar</span>
  <span class="leg-item">💨 Turbina Eólica</span>
  <span class="leg-item">🌳 Parque Verde</span>
  <span class="leg-item">🏠 Casa Eco</span>
  <span class="leg-item">♻️ Centro Reciclagem</span>
  <span class="leg-item">🌻 Jardim</span>
</div>
<p id="msg">Clique nos terrenos para construir!</p>
<div class="grid" id="grid"></div>
<div id="done"><div style="font-size:64px">🌆</div><h3>Cidade Sustentável!</h3><p id="done-msg"></p><p style="color:#2e7d32;margin-top:8px;font-size:.9rem">Sua cidade agora é um exemplo para o mundo! 🌍</p></div>
<script>
const structs=['☀️','💨','🌳','🏠','♻️','🌻','🌱','💧','🚲','🌞','🍃','🌲'];
let cells=Array(12).fill(null),built=0;
function render(){
  const g=document.getElementById('grid');g.innerHTML='';
  cells.forEach((s,i)=>{
    const d=document.createElement('div');
    d.className='plot'+(s?' built':'');
    d.textContent=s||'🟫';
    if(!s)d.onclick=()=>build(i);
    g.appendChild(d);
  });
  document.getElementById('built-count').textContent=built;
}
function build(i){
  if(cells[i])return;
  cells[i]=structs[built%structs.length];built++;
  document.getElementById('msg').textContent='Construída: '+cells[i]+' — '+built+'/12';
  render();
  if(built>=12)setTimeout(finish,500);
}
function finish(){
  document.getElementById('grid').style.display='none';
  document.getElementById('msg').style.display='none';
  const d=document.getElementById('done');d.style.display='block';
  document.getElementById('done-msg').textContent='Você construiu 12 estruturas ecológicas!';
  window.parent.postMessage('GAME_COMPLETED','*');
}
render();
</script></body></html>`;

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const SEED = [
  {
    course: {
      title: 'Coleta Seletiva',
      description: 'Aprenda a separar corretamente o lixo nas lixeiras coloridas. Cada resíduo tem seu lugar certo para ser reciclado ou descartado!',
      coverImage: 'https://crescerverde.vercel.app/Imagens/MiniGame1-new.png',
      videoUrl: '',
    },
    contents: [
      { title: 'Jogo: Separe o Lixo', type: 'game', content: GAME_COLETA, order: 0 },
    ],
  },
  {
    course: {
      title: 'Economize Água',
      description: 'A água é um recurso precioso! Neste jogo você vai fechar torneiras que estão pingando antes que o desperdício tome conta da cidade.',
      coverImage: 'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=80',
      videoUrl: '',
    },
    contents: [
      { title: 'Jogo: Feche as Torneiras', type: 'game', content: GAME_AGUA, order: 0 },
    ],
  },
  {
    course: {
      title: 'Plante Árvores na Cidade',
      description: 'Transforme uma cidade poluída em um paraíso verde! Plante árvores nos terrenos vazios e veja a poluição diminuir.',
      coverImage: 'https://images.unsplash.com/photo-1542601906897-ecd709f3e538?w=600&q=80',
      videoUrl: '',
    },
    contents: [
      { title: 'Jogo: Plante e Transforme', type: 'game', content: GAME_ARVORES, order: 0 },
    ],
  },
  {
    course: {
      title: 'Quiz ESG',
      description: 'Teste seus conhecimentos sobre sustentabilidade, meio ambiente e responsabilidade social. 6 perguntas sobre os temas mais importantes do planeta!',
      coverImage: 'https://crescerverde.vercel.app/Imagens/cidade-verde.png',
      videoUrl: '',
    },
    contents: [
      { title: 'Quiz de Sustentabilidade', type: 'game', content: GAME_QUIZ, order: 0 },
    ],
  },
  {
    course: {
      title: 'Cidade Sustentável',
      description: 'Construa do zero uma cidade ecológica! Adicione painéis solares, turbinas eólicas, parques e centros de reciclagem para transformar a cidade.',
      coverImage: 'https://crescerverde.vercel.app/Imagens/banner3.png',
      videoUrl: '',
    },
    contents: [
      { title: 'Jogo: Construa sua Cidade', type: 'game', content: GAME_CIDADE, order: 0 },
    ],
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Conectando ao MongoDB...');
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('Conectado!\n');

  for (const { course, contents } of SEED) {
    const existing = await Course.findOne({ title: course.title });
    if (existing) {
      console.log(`⏭  Já existe: "${course.title}" — pulando.`);
      continue;
    }

    const created = await Course.create(course);
    console.log(`✅ Criado curso: "${created.title}" (${created._id})`);

    for (const c of contents) {
      await CourseContent.create({ ...c, courseId: created._id });
      console.log(`   📄 Conteúdo: "${c.title}" [${c.type}]`);
    }
  }

  console.log('\n🌍 Seed concluído!');
  await mongoose.disconnect();
}

main().catch(err => { console.error('Erro:', err.message); process.exit(1); });
