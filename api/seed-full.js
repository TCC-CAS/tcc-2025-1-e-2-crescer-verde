require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const CourseContent = require('./src/models/CourseContent');

// ─── JOGOS EXISTENTES (reaproveitados do seed.js) ──────────────────────────────

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
<div id="done"><div style="font-size:64px">🏆</div><h3>Parabéns!</h3><p id="done-score"></p><p style="color:#2e7d32;margin-top:8px;font-size:.95rem">Você ajudou o planeta! 🌍</p></div>
<script>
const items=[{e:'📰',b:'azul',n:'Jornal'},{e:'🧴',b:'vermelho',n:'Frasco de shampoo'},{e:'🍶',b:'verde',n:'Garrafa de vidro'},{e:'🍌',b:'marrom',n:'Casca de banana'},{e:'🥫',b:'amarelo',n:'Lata de alumínio'},{e:'📦',b:'azul',n:'Caixa de papelão'},{e:'🧃',b:'vermelho',n:'Caixinha de suco'},{e:'🍷',b:'verde',n:'Garrafa de vinho'},{e:'🥚',b:'marrom',n:'Casca de ovo'},{e:'🪣',b:'amarelo',n:'Balde metálico'}];
let idx=0,score=0,blocked=false;
function show(){if(idx>=items.length){document.getElementById('game').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-score').textContent='Pontuação: '+score+'/'+items.length;window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:score,total:items.length},'*');return;}document.getElementById('item-box').textContent=items[idx].e;document.getElementById('item-name').textContent=items[idx].n;document.getElementById('feedback').textContent='';document.getElementById('progress').textContent='Item '+(idx+1)+' de '+items.length;blocked=false;}
function answer(bin){if(blocked)return;blocked=true;if(bin===items[idx].b){score++;document.getElementById('feedback').style.color='#2e7d32';document.getElementById('feedback').textContent='✅ Correto!';}else{document.getElementById('feedback').style.color='#c62828';document.getElementById('feedback').textContent='❌ Era '+items[idx].b+'!';}idx++;setTimeout(show,800);}
show();
</script></body></html>`;

const GAME_AGUA = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#e3f2fd;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px}
h2{color:#0d47a1;font-size:1.4rem;margin-bottom:4px}
#info{color:#555;font-size:.9rem;margin-bottom:8px}
#stats{display:flex;gap:24px;margin-bottom:12px;font-weight:bold}
.stat{text-align:center}.stat span{display:block;font-size:1.5rem;color:#0d47a1}
#grid{display:grid;grid-template-columns:repeat(6,52px);gap:8px;margin-bottom:16px}
.faucet{width:52px;height:52px;font-size:32px;border:none;border-radius:10px;cursor:pointer;background:#bbdefb;transition:background .15s}
.faucet.off{background:#c8e6c9;cursor:default}
#msg{font-size:1rem;font-weight:bold;color:#0d47a1;text-align:center;min-height:28px}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#0d47a1;font-size:1.5rem}
</style></head><body>
<h2>💧 Economize Água</h2>
<p id="info">Feche todas as torneiras antes de desperdiçar 200 litros!</p>
<div id="stats"><div class="stat"><span id="t-timer">30</span>seg</div><div class="stat"><span id="t-water">0</span>litros</div><div class="stat"><span id="t-closed">0</span>fechadas</div></div>
<div id="grid"></div><p id="msg"></p>
<div id="done"><div style="font-size:64px">💧</div><h3 id="done-title"></h3><p id="done-msg"></p></div>
<script>
const total=15;let closed=0,water=0,timer=30,interval;
const grid=document.getElementById('grid');
for(let i=0;i<total;i++){const b=document.createElement('button');b.className='faucet';b.textContent='🚿';b.onclick=function(){if(this.classList.contains('off'))return;this.classList.add('off');this.textContent='✅';closed++;document.getElementById('t-closed').textContent=closed;if(closed===total)finish(true);};grid.appendChild(b);}
interval=setInterval(()=>{if(closed<total){water+=2;document.getElementById('t-water').textContent=water;}timer--;document.getElementById('t-timer').textContent=timer;if(water>=200)finish(false);if(timer<=0)finish(closed===total);},1000);
function finish(win){clearInterval(interval);document.getElementById('grid').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-title').textContent=win?'Missão Cumprida! 🎉':'Muito desperdício! 😢';document.getElementById('done-msg').textContent=win?'Você fechou todas as torneiras e economizou água!':'Tente fechar as torneiras mais rápido!';window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:win?15:closed,total:15},'*');}
</script></body></html>`;

const GAME_ARVORES = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f1f8e9;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px}
h2{color:#1b5e20;font-size:1.4rem;margin-bottom:4px}
#info{color:#555;font-size:.9rem;margin-bottom:8px;text-align:center}
#stats{font-weight:bold;color:#2e7d32;margin-bottom:12px;font-size:1.1rem}
#grid{display:grid;grid-template-columns:repeat(5,64px);gap:8px;margin-bottom:16px}
.cell{width:64px;height:64px;font-size:36px;border:2px dashed #a5d6a7;border-radius:10px;cursor:pointer;background:#fff;display:flex;align-items:center;justify-content:center;transition:background .15s}
.cell.planted{background:#c8e6c9;cursor:default;border:2px solid #66bb6a}
#msg{font-size:1rem;font-weight:bold;color:#1b5e20;text-align:center;min-height:28px}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#1b5e20;font-size:1.5rem}
</style></head><body>
<h2>🌳 Plante Árvores na Cidade</h2>
<p id="info">Clique nos espaços vazios para plantar árvores! Meta: 10 árvores.</p>
<p id="stats">🌱 Plantadas: <span id="count">0</span>/10</p>
<div id="grid"></div><p id="msg"></p>
<div id="done"><div style="font-size:64px">🌳</div><h3>Cidade Verde!</h3><p id="done-msg"></p></div>
<script>
const trees=['🌳','🌲','🌴','🌵','🎋'];let planted=0;
const grid=document.getElementById('grid');
for(let i=0;i<15;i++){const c=document.createElement('div');c.className='cell';c.textContent='🏗️';c.onclick=function(){if(this.classList.contains('planted'))return;this.classList.add('planted');this.textContent=trees[Math.floor(Math.random()*trees.length)];planted++;document.getElementById('count').textContent=planted;if(planted===10){document.getElementById('grid').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-msg').textContent='Você plantou 10 árvores e transformou a cidade!';window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:10,total:10},'*');}};grid.appendChild(c);}
</script></body></html>`;

const GAME_QUIZ_ESG = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f3e5f5;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#4a148c;font-size:1.3rem;margin-bottom:4px}
#info{color:#666;font-size:.9rem;margin-bottom:12px}
#question-box{background:#fff;border-radius:14px;padding:20px;max-width:480px;width:100%;box-shadow:0 2px 8px rgba(0,0,0,.1);margin-bottom:12px}
#q-text{font-size:1.05rem;font-weight:bold;color:#333;margin-bottom:14px}
.opt{display:block;width:100%;padding:10px 14px;margin:6px 0;border-radius:8px;border:2px solid #ce93d8;background:#fff;cursor:pointer;font-size:.95rem;text-align:left;transition:background .15s}
.opt:hover{background:#f3e5f5}
.opt.correct{background:#c8e6c9;border-color:#66bb6a}
.opt.wrong{background:#ffcdd2;border-color:#ef9a9a}
#feedback{min-height:28px;font-size:.95rem;font-weight:bold;text-align:center;padding:4px;color:#4a148c}
#progress{color:#888;font-size:.85rem;text-align:center;margin-top:4px}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#4a148c;font-size:1.5rem}
</style></head><body>
<h2>📊 Quiz ESG</h2>
<p id="info">Teste seus conhecimentos sobre sustentabilidade!</p>
<div id="question-box"><p id="q-text"></p><div id="options"></div></div>
<p id="feedback"></p><p id="progress"></p>
<div id="done"><div style="font-size:64px">🏆</div><h3>Quiz Concluído!</h3><p id="done-score"></p></div>
<script>
const qs=[{q:'O que significa o "R" de Reduzir nos 3Rs?',opts:['Reduzir o consumo','Reusar objetos','Reciclar materiais','Recuperar energia'],a:0},{q:'Qual fonte de energia é considerada renovável?',opts:['Carvão mineral','Petróleo','Energia solar','Gás natural'],a:2},{q:'Quanto tempo leva para uma sacola plástica comum se decompor?',opts:['10 anos','100 anos','400 anos','1 ano'],a:2},{q:'O que é o efeito estufa?',opts:['Cultivo em estufas','Retenção de calor na atmosfera','Aquecimento de edifícios','Produção de energia solar'],a:1},{q:'Qual atitude economiza mais água no banho?',opts:['Banho de 20 min','Banho de 5 min','Usar banheira','Deixar torneira aberta'],a:1},{q:'ESG significa:',opts:['Energia Solar Global','Ambiental, Social e Governança','Eficiência, Sustentabilidade e Gestão','Ecossistema, Solo e Geologia'],a:1}];
let idx=0,score=0,blocked=false;
function show(){if(idx>=qs.length){document.getElementById('question-box').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-score').textContent='Acertos: '+score+'/'+qs.length;window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:score,total:qs.length},'*');return;}const q=qs[idx];document.getElementById('q-text').textContent=(idx+1)+'. '+q.q;const opts=document.getElementById('options');opts.innerHTML='';q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt';b.textContent=o;b.onclick=()=>answer(i,b);opts.appendChild(b);});document.getElementById('feedback').textContent='';document.getElementById('progress').textContent='Pergunta '+(idx+1)+' de '+qs.length;blocked=false;}
function answer(i,btn){if(blocked)return;blocked=true;const correct=qs[idx].a;document.querySelectorAll('.opt').forEach((b,j)=>{if(j===correct)b.classList.add('correct');else if(j===i&&i!==correct)b.classList.add('wrong');});if(i===correct){score++;document.getElementById('feedback').textContent='✅ Correto!';}else{document.getElementById('feedback').textContent='❌ Incorreto!';}idx++;setTimeout(show,1200);}
show();
</script></body></html>`;

const GAME_CIDADE = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#e8f5e9;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px}
h2{color:#1b5e20;font-size:1.3rem;margin-bottom:4px}
#info{color:#555;font-size:.9rem;margin-bottom:8px;text-align:center}
#current{font-size:1rem;font-weight:bold;color:#2e7d32;margin-bottom:10px;min-height:24px}
#grid{display:grid;grid-template-columns:repeat(4,72px);gap:8px;margin-bottom:12px}
.slot{width:72px;height:72px;font-size:40px;border:2px dashed #a5d6a7;border-radius:12px;cursor:pointer;background:#fff;display:flex;align-items:center;justify-content:center;transition:background .2s}
.slot.built{background:#c8e6c9;cursor:default;border:2px solid #66bb6a}
#stats{font-weight:bold;color:#1b5e20;margin-bottom:8px}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#1b5e20;font-size:1.5rem}
</style></head><body>
<h2>🏙️ Cidade Sustentável</h2>
<p id="info">Construa estruturas ecológicas! Clique nos lotes vazios.</p>
<p id="current">Próxima: <span id="next-item"></span></p>
<p id="stats">🏗️ Construídas: <span id="count">0</span>/12</p>
<div id="grid"></div>
<div id="done"><div style="font-size:64px">🌆</div><h3>Cidade Ecológica!</h3><p style="color:#333;margin-top:8px">Sua cidade é um modelo de sustentabilidade! 🌱</p></div>
<script>
const structures=['☀️ Painel Solar','💨 Turbina Eólica','🌳 Parque Verde','🏠 Casa Ecológica','♻️ Centro de Reciclagem','🚲 Ciclovia','🌿 Telhado Verde','💧 Captação de Chuva','🚌 Ponto de Ônibus','🌻 Horta Urbana','🔋 Banco de Energia','🌊 Tratamento de Água'];
let built=0,current=0;
const grid=document.getElementById('grid');
for(let i=0;i<12;i++){const s=document.createElement('div');s.className='slot';s.textContent='🏗️';s.onclick=function(){if(this.classList.contains('built'))return;this.classList.add('built');this.textContent=structures[current].split(' ')[0];built++;current++;document.getElementById('count').textContent=built;if(current<structures.length)document.getElementById('next-item').textContent=structures[current];if(built===12){document.getElementById('grid').style.display='none';document.getElementById('done').style.display='block';document.getElementById('current').style.display='none';window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:12,total:12},'*');}};grid.appendChild(s);}
document.getElementById('next-item').textContent=structures[0];
</script></body></html>`;

// ─── NOVOS JOGOS ───────────────────────────────────────────────────────────────

const GAME_ENERGIA = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fffde7;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#e65100;font-size:1.3rem;margin-bottom:4px}
#info{color:#555;font-size:.9rem;margin-bottom:10px;text-align:center}
#timer-bar{width:100%;max-width:420px;height:10px;background:#ffe082;border-radius:5px;margin-bottom:10px;overflow:hidden}
#timer-fill{height:100%;background:#ff6f00;transition:width 1s linear}
#items{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px;max-width:420px}
.item-btn{padding:8px 12px;font-size:1.2rem;border:2px solid #ffcc02;border-radius:10px;background:#fff;cursor:pointer;transition:transform .1s}
.item-btn:hover{transform:scale(1.08)}
.bins{display:flex;gap:16px;justify-content:center;margin-bottom:10px}
.bin{min-width:140px;padding:12px;border-radius:14px;border:3px solid;text-align:center;cursor:pointer}
.bin-renov{border-color:#2e7d32;background:#e8f5e9}
.bin-nao{border-color:#c62828;background:#ffebee}
.bin h3{font-size:1rem;font-weight:900;margin-bottom:4px}
.bin-items{min-height:32px;font-size:1.3rem;flex-wrap:wrap;display:flex;gap:4px;justify-content:center}
#feedback{min-height:28px;font-weight:bold;text-align:center;font-size:1rem;color:#e65100}
#score{color:#888;font-size:.9rem;text-align:center}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#e65100;font-size:1.5rem}
</style></head><body>
<h2>⚡ Energia Limpa</h2>
<p id="info">Classifique as fontes de energia! Arraste ou clique e depois clique no bin correto.</p>
<div id="timer-bar"><div id="timer-fill" style="width:100%"></div></div>
<div id="items"></div>
<div class="bins">
  <div class="bin bin-renov" id="bin-r" onclick="dropTo('renovavel')"><h3>♻️ Renovável</h3><div class="bin-items" id="r-items"></div></div>
  <div class="bin bin-nao" id="bin-n" onclick="dropTo('nao')"><h3>💀 Não Renovável</h3><div class="bin-items" id="n-items"></div></div>
</div>
<p id="feedback"></p><p id="score">Acertos: <span id="hits">0</span>/10</p>
<div id="done"><div style="font-size:64px">⚡</div><h3>Boa trabalho!</h3><p id="done-score"></p><p style="color:#2e7d32;margin-top:8px">Energia limpa é o futuro! 🌍</p></div>
<script>
const sources=[{e:'☀️',n:'Energia Solar',t:'renovavel'},{e:'💨',n:'Energia Eólica',t:'renovavel'},{e:'💧',n:'Hidrelétrica',t:'renovavel'},{e:'🌿',n:'Biomassa',t:'renovavel'},{e:'🌋',n:'Geotérmica',t:'renovavel'},{e:'⚫',n:'Carvão',t:'nao'},{e:'🛢️',n:'Petróleo',t:'nao'},{e:'💨',n:'Gás Natural',t:'nao'},{e:'☢️',n:'Nuclear',t:'nao'},{e:'🚛',n:'Diesel',t:'nao'}];
let selected=null,hits=0,total=sources.length,remaining=[...sources],timer=40,interval;
function render(){const c=document.getElementById('items');c.innerHTML='';remaining.forEach((s,i)=>{const b=document.createElement('button');b.className='item-btn';b.textContent=s.e+' '+s.n;b.title=s.n;b.onclick=()=>select(i,b);if(selected===i)b.style.background='#ffe082';c.appendChild(b);});}
function select(i,btn){selected=i;render();document.getElementById('feedback').textContent='Agora clique no bin correto!';}
function dropTo(bin){if(selected===null)return;const s=remaining[selected];if(s.t===bin){hits++;document.getElementById('r-items').textContent+=(bin==='renovavel'?s.e:'');document.getElementById('n-items').textContent+=(bin==='nao'?s.e:'');document.getElementById('hits').textContent=hits;document.getElementById('feedback').textContent='✅ Correto! '+s.n+' é '+( bin==='renovavel'?'renovável':'não renovável')+'.';}else{document.getElementById('feedback').textContent='❌ '+s.n+' é '+(s.t==='renovavel'?'renovável':'não renovável')+'!';}remaining.splice(selected,1);selected=null;if(remaining.length===0)finish();else render();}
function finish(){clearInterval(interval);document.getElementById('items').style.display='none';document.querySelector('.bins').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-score').textContent='Acertos: '+hits+'/'+total;window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:hits,total:total},'*');}
interval=setInterval(()=>{timer--;document.getElementById('timer-fill').style.width=(timer/40*100)+'%';if(timer<=0)finish();},1000);
render();
</script></body></html>`;

const GAME_MOBILIDADE = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#e8eaf6;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#283593;font-size:1.3rem;margin-bottom:4px}
#info{color:#555;font-size:.9rem;margin-bottom:12px;text-align:center}
#scenario-box{background:#fff;border-radius:14px;padding:18px;max-width:460px;width:100%;box-shadow:0 2px 8px rgba(0,0,0,.1);margin-bottom:12px}
#scenario-text{font-size:1.05rem;font-weight:bold;color:#1a237e;margin-bottom:14px;text-align:center}
.options{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.opt-btn{padding:12px 8px;border-radius:10px;border:2px solid #9fa8da;background:#fff;cursor:pointer;font-size:1.1rem;text-align:center;transition:background .15s}
.opt-btn:hover{background:#e8eaf6}
.opt-btn.correct{background:#c8e6c9;border-color:#66bb6a}
.opt-btn.wrong{background:#ffcdd2;border-color:#ef9a9a}
#feedback{min-height:28px;font-weight:bold;text-align:center;color:#283593;font-size:.95rem;padding:4px}
#progress{color:#888;font-size:.85rem;text-align:center}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#283593;font-size:1.5rem}
</style></head><body>
<h2>🚲 Mobilidade Verde</h2>
<p id="info">Escolha a opção de transporte mais sustentável para cada cenário!</p>
<div id="scenario-box"><p id="scenario-text"></p><div class="options" id="options"></div></div>
<p id="feedback"></p><p id="progress"></p>
<div id="done"><div style="font-size:64px">🌿</div><h3>Transporte Sustentável!</h3><p id="done-score"></p><p style="color:#2e7d32;margin-top:8px">Pequenas escolhas fazem grande diferença! 🚲</p></div>
<script>
const scenarios=[
{s:'Precisa ir 1km ao mercado. Qual escolher?',opts:['🚗 Carro','🚲 Bicicleta','✈️ Avião','🛵 Moto'],a:1,exp:'A bicicleta não emite CO₂ e ainda faz bem à saúde!'},
{s:'Você vai ao trabalho, 10km, todo dia. Melhor opção?',opts:['🚗 Carro sozinho','🚌 Ônibus público','🚁 Helicóptero','💨 Nenhuma'],a:1,exp:'O ônibus público transporta muitas pessoas com menos emissão por passageiro!'},
{s:'Viagem de 500km entre cidades. O que escolher?',opts:['🚂 Trem/ônibus','✈️ Avião','🚗 Carro','🛥️ Barco a motor'],a:0,exp:'Trem e ônibus têm as menores emissões por passageiro em viagens médias!'},
{s:'Entregar documentos a 300m do escritório?',opts:['🛵 Moto','🚗 Carro','🚶 A pé','🚁 Helicóptero'],a:2,exp:'Curtas distâncias a pé são a opção mais sustentável — e gratuita!'},
{s:'Levar crianças à escola a 2km. Melhor forma?',opts:['🚗 Carro','🛣️ Caminhão','🚲 Bicicleta com carona','✈️ Avião'],a:2,exp:'Bike com reboque é sustentável, saudável e divertida para as crianças!'}
];
let idx=0,score=0,blocked=false;
function show(){if(idx>=scenarios.length){document.getElementById('scenario-box').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-score').textContent='Acertos: '+score+'/'+scenarios.length;window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:score,total:scenarios.length},'*');return;}const sc=scenarios[idx];document.getElementById('scenario-text').textContent=sc.s;const opts=document.getElementById('options');opts.innerHTML='';sc.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt-btn';b.textContent=o;b.onclick=()=>answer(i,b);opts.appendChild(b);});document.getElementById('feedback').textContent='';document.getElementById('progress').textContent='Cenário '+(idx+1)+' de '+scenarios.length;blocked=false;}
function answer(i,btn){if(blocked)return;blocked=true;const sc=scenarios[idx];document.querySelectorAll('.opt-btn').forEach((b,j)=>{if(j===sc.a)b.classList.add('correct');else if(j===i&&i!==sc.a)b.classList.add('wrong');});if(i===sc.a){score++;document.getElementById('feedback').textContent='✅ '+sc.exp;}else{document.getElementById('feedback').textContent='❌ '+sc.exp;}idx++;setTimeout(show,1800);}
show();
</script></body></html>`;

const GAME_BIODIVERSIDADE = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#e0f2f1;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:12px;min-height:100vh}
h2{color:#004d40;font-size:1.3rem;margin-bottom:4px}
#info{color:#555;font-size:.85rem;margin-bottom:8px;text-align:center}
#timer-bar{width:100%;max-width:480px;height:10px;background:#b2dfdb;border-radius:5px;margin-bottom:10px;overflow:hidden}
#timer-fill{height:100%;background:#00796b;transition:width 1s linear}
#animals{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:12px;max-width:480px}
.animal-btn{padding:8px 10px;font-size:1.1rem;border:2px solid #80cbc4;border-radius:10px;background:#fff;cursor:pointer;transition:background .1s}
.animal-btn.selected{background:#b2ebf2;border-color:#00acc1}
.animal-btn.placed{opacity:.4;cursor:default}
.biomes{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:480px;width:100%;margin-bottom:10px}
.biome{padding:10px;border-radius:12px;border:2px solid;cursor:pointer;min-height:70px}
.biome h4{font-size:.85rem;font-weight:900;margin-bottom:4px}
.biome-animals{font-size:1.2rem;min-height:24px;flex-wrap:wrap;display:flex;gap:2px}
#feedback{min-height:24px;font-weight:bold;text-align:center;font-size:.9rem;color:#004d40}
#score{color:#888;font-size:.85rem;text-align:center}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#004d40;font-size:1.4rem}
</style></head><body>
<h2>🦋 Biodiversidade</h2>
<p id="info">Selecione o animal e clique no bioma correto! Timer: 60s</p>
<div id="timer-bar"><div id="timer-fill" style="width:100%"></div></div>
<div id="animals"></div>
<div class="biomes" id="biomes"></div>
<p id="feedback"></p><p id="score">Acertos: <span id="hits">0</span>/8</p>
<div id="done"><div style="font-size:64px">🦋</div><h3>Biodiversidade Preservada!</h3><p id="done-score"></p><p style="color:#00695c;margin-top:8px">Cada espécie é essencial para o equilíbrio! 🌍</p></div>
<script>
const animals=[{e:'🐆',n:'Onça-pintada',b:'amazonia'},{e:'🦜',n:'Arara-azul',b:'cerrado'},{e:'🐟',n:'Peixe-boi',b:'pantanal'},{e:'🐺',n:'Lobo-guará',b:'cerrado'},{e:'🐢',n:'Tartaruga-marinha',b:'matatlantica'},{e:'🦛',n:'Capivara',b:'pantanal'},{e:'🦜',n:'Tucano',b:'amazonia'},{e:'🐬',n:'Boto-cor-de-rosa',b:'amazonia'}];
const biomes=[{id:'amazonia',n:'🌳 Amazônia',c:'#e8f5e9',bc:'#388e3c'},{id:'cerrado',n:'🌾 Cerrado',c:'#fff8e1',bc:'#f9a825'},{id:'pantanal',n:'💧 Pantanal',c:'#e3f2fd',bc:'#1976d2'},{id:'matatlantica',n:'🌿 Mata Atlântica',c:'#f3e5f5',bc:'#7b1fa2'}];
let selected=null,hits=0,timer=60,interval,remaining=[...animals];
const biomesDiv=document.getElementById('biomes');
biomes.forEach(b=>{const d=document.createElement('div');d.className='biome';d.style.background=b.c;d.style.borderColor=b.bc;d.innerHTML='<h4>'+b.n+'</h4><div class="biome-animals" id="ba-'+b.id+'"></div>';d.onclick=()=>dropTo(b.id);biomesDiv.appendChild(d);});
function renderAnimals(){const c=document.getElementById('animals');c.innerHTML='';remaining.forEach((a,i)=>{const b=document.createElement('button');b.className='animal-btn'+(selected===i?' selected':'');b.textContent=a.e+' '+a.n;b.onclick=()=>{selected=i;renderAnimals();document.getElementById('feedback').textContent='Clique no bioma correto!';};c.appendChild(b);});}
function dropTo(biomeId){if(selected===null)return;const a=remaining[selected];if(a.b===biomeId){hits++;document.getElementById('ba-'+biomeId).textContent+=a.e;document.getElementById('hits').textContent=hits;document.getElementById('feedback').textContent='✅ Correto! '+a.n+' vive '+biomes.find(b=>b.id===biomeId).n+'.';}else{document.getElementById('feedback').textContent='❌ '+a.n+' não vive nesse bioma!';}remaining.splice(selected,1);selected=null;if(remaining.length===0)finish();else renderAnimals();}
function finish(){clearInterval(interval);document.getElementById('animals').style.display='none';document.getElementById('biomes').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-score').textContent='Acertos: '+hits+'/8';window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:hits,total:8},'*');}
interval=setInterval(()=>{timer--;document.getElementById('timer-fill').style.width=(timer/60*100)+'%';if(timer<=0)finish();},1000);
renderAnimals();
</script></body></html>`;

const GAME_CLIMA = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fff3e0;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#bf360c;font-size:1.3rem;margin-bottom:4px}
#info{color:#666;font-size:.9rem;margin-bottom:12px;text-align:center}
.fact-badge{background:#e64a19;color:#fff;border-radius:8px;padding:4px 10px;font-size:.8rem;font-weight:bold;margin-bottom:10px;display:inline-block}
#question-box{background:#fff;border-radius:14px;padding:20px;max-width:480px;width:100%;box-shadow:0 2px 8px rgba(0,0,0,.1);margin-bottom:12px}
#q-text{font-size:1.05rem;font-weight:bold;color:#333;margin-bottom:14px}
#q-fact{font-size:.82rem;color:#777;margin-bottom:10px;font-style:italic}
.opt{display:block;width:100%;padding:10px 14px;margin:6px 0;border-radius:8px;border:2px solid #ffccbc;background:#fff;cursor:pointer;font-size:.95rem;text-align:left;transition:background .15s}
.opt:hover{background:#fff3e0}
.opt.correct{background:#c8e6c9;border-color:#66bb6a}
.opt.wrong{background:#ffcdd2;border-color:#ef9a9a}
#feedback{min-height:44px;font-size:.9rem;font-weight:bold;text-align:center;padding:4px;color:#bf360c}
#progress{color:#888;font-size:.85rem;text-align:center}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#bf360c;font-size:1.5rem}
</style></head><body>
<h2>🌡️ Mudanças Climáticas</h2>
<p id="info">Quiz com dados reais do IPCC e INPE. Nível avançado.</p>
<span class="fact-badge">🔬 Dados Científicos</span>
<div id="question-box"><p id="q-fact"></p><p id="q-text"></p><div id="options"></div></div>
<p id="feedback"></p><p id="progress"></p>
<div id="done"><div style="font-size:64px">🌍</div><h3>Parabéns, Cientista!</h3><p id="done-score"></p><p style="color:#bf360c;margin-top:8px;font-size:.9rem">Conhecimento é o primeiro passo para a ação climática!</p></div>
<script>
const qs=[
{f:'IPCC 2023: a temperatura global aumentou +1,1°C desde a era pré-industrial.',q:'Qual o limite de aquecimento acordado no Acordo de Paris (2015)?',opts:['0,5°C','1,5°C','3,0°C','5,0°C'],a:1,exp:'O Acordo de Paris estabelece o limite de 1,5°C para evitar efeitos climáticos irreversíveis.'},
{f:'Segundo o INPE, o Brasil perdeu 11.568 km² de floresta amazônica em 2022.',q:'Qual é o principal gás responsável pelo aquecimento global?',opts:['Oxigênio (O₂)','Dióxido de Carbono (CO₂)','Nitrogênio (N₂)','Hidrogênio (H₂)'],a:1,exp:'O CO₂, principalmente de queima de combustíveis fósseis, é o principal gás de efeito estufa.'},
{f:'O nível do mar subiu ~20cm no século XX e pode subir mais 1m até 2100.',q:'O derretimento das calotas polares afeta diretamente:',opts:['Temperatura do sol','Nível dos oceanos','Velocidade do vento','Quantidade de estrelas'],a:1,exp:'O derretimento do gelo nas calotas polares e geleiras aumenta o nível do mar.'},
{f:'1/3 das emissões de CO₂ do Brasil vêm do desmatamento.',q:'Qual setor é o maior emissor global de gases de efeito estufa?',opts:['Transporte','Agropecuária','Energia (queima de combustíveis)','Turismo'],a:2,exp:'A produção de energia por combustíveis fósseis responde por ~73% das emissões globais.'},
{f:'Corais estão branqueando em massa — o recife da Barreira da Austrália perdeu 50% dos corais desde 1995.',q:'O que é "acidificação dos oceanos"?',opts:['Aumento da temperatura da água','Absorção de CO₂ que reduz o pH da água','Poluição por lixo plástico','Aumento de algas no oceano'],a:1,exp:'Os oceanos absorvem ~30% do CO₂ humano, tornando-se mais ácidos e prejudicando a vida marinha.'}
];
let idx=0,score=0,blocked=false;
function show(){if(idx>=qs.length){document.getElementById('question-box').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-score').textContent='Acertos: '+score+'/'+qs.length;window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:score,total:qs.length},'*');return;}const q=qs[idx];document.getElementById('q-fact').textContent='📊 '+q.f;document.getElementById('q-text').textContent=(idx+1)+'. '+q.q;const opts=document.getElementById('options');opts.innerHTML='';q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt';b.textContent=o;b.onclick=()=>answer(i);opts.appendChild(b);});document.getElementById('feedback').textContent='';document.getElementById('progress').textContent='Pergunta '+(idx+1)+' de '+qs.length;blocked=false;}
function answer(i){if(blocked)return;blocked=true;const q=qs[idx];document.querySelectorAll('.opt').forEach((b,j)=>{if(j===q.a)b.classList.add('correct');else if(j===i&&i!==q.a)b.classList.add('wrong');});if(i===q.a){score++;document.getElementById('feedback').textContent='✅ '+q.exp;}else{document.getElementById('feedback').textContent='❌ '+q.exp;}idx++;setTimeout(show,2000);}
show();
</script></body></html>`;

const GAME_ESG = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#e8eaf6;font-family:Arial,sans-serif;display:flex;flex-direction:column;align-items:center;padding:16px;min-height:100vh}
h2{color:#1a237e;font-size:1.3rem;margin-bottom:4px}
#info{color:#666;font-size:.9rem;margin-bottom:12px;text-align:center}
.badge-esg{background:#283593;color:#fff;border-radius:8px;padding:4px 10px;font-size:.8rem;font-weight:bold;margin-bottom:10px;display:inline-block}
#question-box{background:#fff;border-radius:14px;padding:20px;max-width:480px;width:100%;box-shadow:0 2px 8px rgba(0,0,0,.1);margin-bottom:12px}
#q-context{font-size:.83rem;color:#5c6bc0;margin-bottom:8px;font-style:italic;background:#e8eaf6;padding:8px;border-radius:8px}
#q-text{font-size:1.05rem;font-weight:bold;color:#1a237e;margin-bottom:14px}
.opt{display:block;width:100%;padding:10px 14px;margin:6px 0;border-radius:8px;border:2px solid #9fa8da;background:#fff;cursor:pointer;font-size:.93rem;text-align:left;transition:background .15s}
.opt:hover{background:#e8eaf6}
.opt.correct{background:#c8e6c9;border-color:#66bb6a}
.opt.wrong{background:#ffcdd2;border-color:#ef9a9a}
#feedback{min-height:40px;font-size:.9rem;font-weight:bold;text-align:center;padding:4px;color:#1a237e}
#progress{color:#888;font-size:.85rem;text-align:center}
#done{display:none;text-align:center;padding:20px}
#done h3{color:#1a237e;font-size:1.5rem}
</style></head><body>
<h2>🤝 ESG na Prática</h2>
<p id="info">Quiz empresarial sobre ESG, ODS e sustentabilidade corporativa.</p>
<span class="badge-esg">🏢 Nível Corporativo</span>
<div id="question-box"><p id="q-context"></p><p id="q-text"></p><div id="options"></div></div>
<p id="feedback"></p><p id="progress"></p>
<div id="done"><div style="font-size:64px">🏆</div><h3>ESG Expert!</h3><p id="done-score"></p><p style="color:#283593;margin-top:8px;font-size:.9rem">Empresas sustentáveis constroem o futuro que queremos!</p></div>
<script>
const qs=[
{c:'Uma empresa divulga relatórios sobre emissões de carbono, práticas trabalhistas e composição do conselho.',q:'Essa empresa está reportando indicadores de:',opts:['Marketing Digital','ESG (Ambiental, Social e Governança)','Contabilidade Fiscal','Gestão de Estoque'],a:1,exp:'ESG reúne indicadores Ambientais, Sociais e de Governança — cada vez mais exigidos por investidores.'},
{c:'A empresa X afirma ser "100% verde" mas não divulga dados de emissões nem certificações.',q:'Esse comportamento é chamado de:',opts:['Greenwashing','Benchmarking','Compliance','Due Diligence'],a:0,exp:'Greenwashing é quando empresas exageram ou fabricam afirmações sustentáveis sem evidências concretas.'},
{c:'Os 17 Objetivos de Desenvolvimento Sustentável foram criados pela ONU em 2015.',q:'Qual ODS trata especificamente de "Ação Climática"?',opts:['ODS 1','ODS 13','ODS 8','ODS 17'],a:1,exp:'O ODS 13 (Ação Climática) pede medidas urgentes para combater as mudanças climáticas e seus impactos.'},
{c:'Uma startup quer demonstrar seu compromisso ambiental para atrair investimentos ESG.',q:'Qual certificação atesta práticas sustentáveis de empresas no Brasil?',opts:['ISO 9001','Certificação B Corp','Certificado de Meritocracia','Registro CNPJ Verde'],a:1,exp:'A Certificação B Corp atesta que a empresa equilibra lucro com impacto positivo para pessoas e planeta.'},
{c:'A cadeia de fornecimento de uma empresa envolve mineração, transporte, produção e descarte.',q:'O que é "economia circular" nesse contexto?',opts:['Ciclo financeiro anual','Modelo que elimina resíduos reintegrando materiais ao ciclo produtivo','Rotação de funcionários','Sistema de metas trimestrais'],a:1,exp:'Economia circular substitui o modelo linear "usar e descartar" por ciclos fechados onde resíduos viram insumos.'}
];
let idx=0,score=0,blocked=false;
function show(){if(idx>=qs.length){document.getElementById('question-box').style.display='none';document.getElementById('done').style.display='block';document.getElementById('done-score').textContent='Acertos: '+score+'/'+qs.length;window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:score,total:qs.length},'*');return;}const q=qs[idx];document.getElementById('q-context').textContent='📋 Contexto: '+q.c;document.getElementById('q-text').textContent=(idx+1)+'. '+q.q;const opts=document.getElementById('options');opts.innerHTML='';q.opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt';b.textContent=o;b.onclick=()=>answer(i);opts.appendChild(b);});document.getElementById('feedback').textContent='';document.getElementById('progress').textContent='Pergunta '+(idx+1)+' de '+qs.length;blocked=false;}
function answer(i){if(blocked)return;blocked=true;const q=qs[idx];document.querySelectorAll('.opt').forEach((b,j)=>{if(j===q.a)b.classList.add('correct');else if(j===i&&i!==q.a)b.classList.add('wrong');});if(i===q.a){score++;document.getElementById('feedback').textContent='✅ '+q.exp;}else{document.getElementById('feedback').textContent='❌ '+q.exp;}idx++;setTimeout(show,2200);}
show();
</script></body></html>`;

// ─── DEFINIÇÃO DAS 10 TRILHAS ──────────────────────────────────────────────────

const TRAILS = [
  {
    course: { title: 'Coleta Seletiva', description: 'Aprenda a separar corretamente o lixo nas lixeiras coloridas e ajude o planeta a reciclar mais!', coverImage: 'https://crescerverde.vercel.app/Imagens/MiniGame1-new.png', difficulty: 'iniciante', minPlan: 'free', emoji: '♻️', estimatedMinutes: 10, order: 1, category: 'reciclagem', tags: ['reciclagem','lixo','meio ambiente'] },
    content: { title: 'Jogo: Coleta Seletiva', type: 'game', content: GAME_COLETA, order: 1 }
  },
  {
    course: { title: 'Economize Água', description: 'A água é um recurso precioso! Feche as torneiras e evite o desperdício antes que seja tarde demais.', coverImage: 'https://images.unsplash.com/photo-1542601098-8fc114e148e2?w=400&q=80', difficulty: 'iniciante', minPlan: 'free', emoji: '💧', estimatedMinutes: 10, order: 2, category: 'agua', tags: ['água','economia','sustentabilidade'] },
    content: { title: 'Jogo: Economize Água', type: 'game', content: GAME_AGUA, order: 1 }
  },
  {
    course: { title: 'Plante Árvores na Cidade', description: 'Transforme uma cidade poluída em um paraíso verde! Plante árvores e veja a cidade reviver.', coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80', difficulty: 'iniciante', minPlan: 'free', emoji: '🌳', estimatedMinutes: 10, order: 3, category: 'arvores', tags: ['árvores','reflorestamento','cidade verde'] },
    content: { title: 'Jogo: Plante Árvores', type: 'game', content: GAME_ARVORES, order: 1 }
  },
  {
    course: { title: 'Quiz ESG', description: 'Teste seus conhecimentos sobre sustentabilidade, reciclagem, energia e meio ambiente!', coverImage: 'https://crescerverde.vercel.app/Imagens/cidade-verde.png', difficulty: 'iniciante', minPlan: 'familia', emoji: '📊', estimatedMinutes: 12, order: 4, category: 'quiz', tags: ['quiz','esg','sustentabilidade'] },
    content: { title: 'Quiz: Sustentabilidade', type: 'game', content: GAME_QUIZ_ESG, order: 1 }
  },
  {
    course: { title: 'Cidade Sustentável', description: 'Construa do zero uma cidade ecológica! Escolha estruturas verdes e crie um modelo de desenvolvimento sustentável.', coverImage: 'https://crescerverde.vercel.app/Imagens/banner3.png', difficulty: 'intermediario', minPlan: 'familia', emoji: '🏙️', estimatedMinutes: 15, order: 5, category: 'urbanismo', tags: ['cidade','urbanismo','construção verde'] },
    content: { title: 'Jogo: Construa a Cidade', type: 'game', content: GAME_CIDADE, order: 1 }
  },
  {
    course: { title: 'Energia Limpa', description: 'Descubra a diferença entre fontes de energia renováveis e não renováveis. O futuro é verde!', coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&q=80', difficulty: 'iniciante', minPlan: 'familia', emoji: '⚡', estimatedMinutes: 12, order: 6, category: 'energia', tags: ['energia','renovável','solar','eólica'] },
    content: { title: 'Jogo: Classifique as Energias', type: 'game', content: GAME_ENERGIA, order: 1 }
  },
  {
    course: { title: 'Mobilidade Verde', description: 'Cada deslocamento tem um impacto no meio ambiente. Aprenda a escolher o transporte mais sustentável!', coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', difficulty: 'intermediario', minPlan: 'familia', emoji: '🚲', estimatedMinutes: 12, order: 7, category: 'transporte', tags: ['mobilidade','transporte','bicicleta','emissões'] },
    content: { title: 'Jogo: Escolha o Transporte', type: 'game', content: GAME_MOBILIDADE, order: 1 }
  },
  {
    course: { title: 'Biodiversidade', description: 'Conheça os biomas brasileiros e os animais que os habitam. A diversidade da vida depende de cada um de nós!', coverImage: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80', difficulty: 'intermediario', minPlan: 'familia', emoji: '🦋', estimatedMinutes: 15, order: 8, category: 'biodiversidade', tags: ['animais','biomas','amazônia','cerrado'] },
    content: { title: 'Jogo: Biomas Brasileiros', type: 'game', content: GAME_BIODIVERSIDADE, order: 1 }
  },
  {
    course: { title: 'Mudanças Climáticas', description: 'Explore os dados científicos sobre a crise climática global. Conhecimento é o primeiro passo para a ação!', coverImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&q=80', difficulty: 'avancado', minPlan: 'escola', emoji: '🌡️', estimatedMinutes: 20, order: 9, category: 'clima', tags: ['clima','IPCC','aquecimento global','CO2'] },
    content: { title: 'Quiz: Crise Climática', type: 'game', content: GAME_CLIMA, order: 1 }
  },
  {
    course: { title: 'ESG na Prática', description: 'Entenda como empresas aplicam critérios ambientais, sociais e de governança. O futuro dos negócios é sustentável!', coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80', difficulty: 'avancado', minPlan: 'escola', emoji: '🤝', estimatedMinutes: 20, order: 10, category: 'esg', tags: ['ESG','ODS','negócios','sustentabilidade corporativa'] },
    content: { title: 'Quiz: ESG Corporativo', type: 'game', content: GAME_ESG, order: 1 }
  }
];

// ─── SEED ──────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Conectado ao MongoDB');

  for (const { course: courseData, content: contentData } of TRAILS) {
    // Apaga trilha existente com mesmo título (idempotente)
    const existing = await Course.findOne({ title: courseData.title });
    if (existing) {
      await CourseContent.deleteMany({ courseId: existing._id });
      await Course.deleteOne({ _id: existing._id });
      console.log(`🗑️  Removido: ${courseData.title}`);
    }

    const course = await Course.create(courseData);
    await CourseContent.create({ ...contentData, courseId: course._id });
    console.log(`✅ Criado: ${courseData.emoji} ${courseData.title} [${courseData.minPlan}/${courseData.difficulty}]`);
  }

  console.log('\n🎉 Seed completo! 10 trilhas criadas.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err.message);
  process.exit(1);
});
