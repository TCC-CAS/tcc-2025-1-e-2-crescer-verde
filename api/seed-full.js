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

// ─── 5 NOVOS JOGOS ARCADE ─────────────────────────────────────────────────────

const GAME_COBRA = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#0d1f0d;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;padding:12px;user-select:none}h1{color:#7CFC00;font-size:1.2rem;margin-bottom:6px}#hud{color:#a5d6a7;font-size:.9rem;margin-bottom:8px;display:flex;gap:20px}#hud b{color:#fff}canvas{border:3px solid #27ae60;border-radius:10px;background:#0d1f0d;display:block;touch-action:none}#dpad{display:grid;grid-template-columns:repeat(3,52px);gap:4px;margin-top:14px}.db{width:52px;height:52px;background:rgba(39,174,96,.25);border:2px solid #27ae60;border-radius:10px;color:#fff;font-size:1.4rem;cursor:pointer;display:flex;align-items:center;justify-content:center}.db:active{background:rgba(39,174,96,.7)}#ov{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:24px;z-index:9}#ov h2{font-size:1.8rem;color:#7CFC00;margin-bottom:12px}#ov p{color:#a5d6a7;margin-bottom:20px;line-height:1.5}.btn{background:#27ae60;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:1.1rem;font-weight:700;cursor:pointer}</style></head><body><h1>🐍 Cobrinha Verde</h1><div id="hud"><span>♻️ <b id="sc">0</b></span><span>🏆 Recorde: <b id="be">0</b></span></div><canvas id="cv" width="360" height="360"></canvas><div id="dpad"><div></div><button class="db" id="pu">▲</button><div></div><button class="db" id="pl">◀</button><div></div><button class="db" id="pr">▶</button><div></div><button class="db" id="pd">▼</button><div></div></div><div id="ov"><h2>🌿 Cobrinha Verde</h2><p>Colete os itens recicláveis!<br>Use setas, WASD ou o controle.<br>Evite as paredes e a si mesmo.</p><button class="btn" onclick="startGame()">Jogar!</button></div><script>var cv=document.getElementById('cv'),ctx=cv.getContext('2d');var C=18,N=20,best=0,snake,dir,nd,food,sc,loop;var IT=['🥤','📰','🥫','🍾','📦','🧴'];function startGame(){document.getElementById('ov').style.display='none';snake=[{x:10,y:10},{x:9,y:10},{x:8,y:10}];dir={x:1,y:0};nd={x:1,y:0};sc=0;placeFood();clearInterval(loop);loop=setInterval(tick,160);}function placeFood(){do{food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N),i:IT[Math.floor(Math.random()*IT.length)]}}while(snake.some(function(s){return s.x==food.x&&s.y==food.y}));}function tick(){dir=nd;var h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.x>=N||h.y<0||h.y>=N||snake.some(function(s){return s.x==h.x&&s.y==h.y})){clearInterval(loop);if(sc>best){best=sc;document.getElementById('be').textContent=best;}endScreen();return;}snake.unshift(h);if(h.x==food.x&&h.y==food.y){sc++;document.getElementById('sc').textContent=sc;placeFood();if(sc%5==0){clearInterval(loop);loop=setInterval(tick,Math.max(70,160-sc*4));}}else snake.pop();draw();}function draw(){ctx.fillStyle='#0d1f0d';ctx.fillRect(0,0,cv.width,cv.height);ctx.strokeStyle='rgba(39,174,96,.08)';ctx.lineWidth=1;for(var i=0;i<N;i++){ctx.beginPath();ctx.moveTo(i*C,0);ctx.lineTo(i*C,cv.height);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*C);ctx.lineTo(cv.width,i*C);ctx.stroke();}ctx.font=(C-2)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(food.i,food.x*C+C/2,food.y*C+C/2);snake.forEach(function(s,i){var g=ctx.createRadialGradient(s.x*C+C/2,s.y*C+C/2,1,s.x*C+C/2,s.y*C+C/2,C/2);g.addColorStop(0,i==0?'#b0ff50':'#4caf50');g.addColorStop(1,i==0?'#27ae60':'#1a5c2a');ctx.fillStyle=g;ctx.beginPath();if(ctx.roundRect){ctx.roundRect(s.x*C+1,s.y*C+1,C-2,C-2,4);}else{ctx.rect(s.x*C+1,s.y*C+1,C-2,C-2);}ctx.fill();if(i==0){ctx.font='10px serif';ctx.fillText('👀',s.x*C+C/2,s.y*C+C/2);}});}function endScreen(){var o=document.getElementById('ov');o.style.display='flex';o.innerHTML='<h2>💀 Game Over!</h2><p>Você reciclou <b>'+sc+'</b> itens!<br>Recorde: <b>'+best+'</b></p><button class="btn" onclick="startGame()">Jogar Novamente</button>';}function setDir(x,y){if(!(dir.x==-x&&dir.y==-y))nd={x:x,y:y};}document.addEventListener('keydown',function(e){if(e.key=='ArrowUp'||e.key=='w')setDir(0,-1);if(e.key=='ArrowDown'||e.key=='s')setDir(0,1);if(e.key=='ArrowLeft'||e.key=='a')setDir(-1,0);if(e.key=='ArrowRight'||e.key=='d')setDir(1,0);});document.getElementById('pu').addEventListener('click',function(){setDir(0,-1);});document.getElementById('pd').addEventListener('click',function(){setDir(0,1);});document.getElementById('pl').addEventListener('click',function(){setDir(-1,0);});document.getElementById('pr').addEventListener('click',function(){setDir(1,0);});var tx=0,ty=0;cv.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});cv.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>Math.abs(dy)){setDir(dx>0?1:-1,0);}else{setDir(0,dy>0?1:-1);}},{passive:true});<\/script></body></html>`;

const GAME_COLETOR = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#1a2634;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;padding:12px;user-select:none}#hud{display:flex;gap:20px;margin-bottom:8px;font-weight:700;font-size:.95rem;color:#a5d6a7}#hud b{color:#fff}canvas{display:block;border-radius:14px;border:2px solid #27ae60;touch-action:none}#ctrl{display:flex;gap:12px;margin-top:14px;width:360px;max-width:100%}.cbtn{flex:1;height:54px;background:rgba(27,94,32,.8);border:2px solid #27ae60;border-radius:14px;font-size:1.8rem;color:#fff;cursor:pointer}.cbtn:active{background:#1b5e20;transform:scale(.95)}#ov{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:24px;z-index:9}#ov h2{font-size:1.8rem;color:#7CFC00;margin-bottom:12px}#ov p{color:#a5d6a7;margin-bottom:20px;line-height:1.5}.btn{background:#27ae60;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:1.1rem;font-weight:700;cursor:pointer}</style></head><body><div id="hud"><span>⭐ <b id="sc">0</b></span><span>⏱ <b id="tm">60</b>s</span><span id="hp">❤️❤️❤️</span></div><canvas id="cv" width="360" height="460"></canvas><div id="ctrl"><button class="cbtn" onpointerdown="keys.l=true" onpointerup="keys.l=false" onpointerleave="keys.l=false">◀</button><button class="cbtn" onpointerdown="keys.r=true" onpointerup="keys.r=false" onpointerleave="keys.r=false">▶</button></div><div id="ov"><h2>🚛 Caminhão Coletor</h2><p>Colete fontes de energia limpa!<br>☀️ Solar &nbsp;💨 Eólica &nbsp;💧 Hídrica<br>Evite poluentes: 🪨 🛢️ 🏭</p><button class="btn" onclick="startGame()">Dirigir!</button></div><script>var cv=document.getElementById('cv'),ctx=cv.getContext('2d');var W=360,H=460,GY=H-50;var keys={l:false,r:false};var truck,items,sc,lives,tm,running,spT,cdT;var GOOD=['☀️','💨','💧','⚡','🌿','🔋'];var BAD=['🪨','🛢️','🏭','☁️'];function startGame(){document.getElementById('ov').style.display='none';truck={x:W/2-28,w:56,spd:6};items=[];sc=0;lives=3;tm=60;running=true;spT=0;document.getElementById('sc').textContent=0;document.getElementById('tm').textContent=60;document.getElementById('hp').textContent='❤️❤️❤️';clearInterval(cdT);cdT=setInterval(countdown,1000);requestAnimationFrame(loop);}function countdown(){if(!running)return;tm--;document.getElementById('tm').textContent=tm;if(tm<=0)endGame(true);}var lt=0;function loop(ts){if(!running)return;var dt=Math.min((ts-lt)/1000,.05);lt=ts;update(dt);draw();requestAnimationFrame(loop);}function update(dt){if(keys.l)truck.x=Math.max(0,truck.x-truck.spd);if(keys.r)truck.x=Math.min(W-truck.w,truck.x+truck.spd);spT+=dt;var rate=Math.max(.4,1.1-sc*.015);if(spT>=rate){spT=0;var g=Math.random()<.6;var p=g?GOOD:BAD;items.push({x:20+Math.random()*(W-40),y:-30,e:p[Math.floor(Math.random()*p.length)],good:g,spd:100+Math.random()*80+sc*1.5});}for(var i=items.length-1;i>=0;i--){items[i].y+=items[i].spd*dt;if(items[i].y>H+40){items.splice(i,1);continue;}if(items[i].y+18>=GY-30&&items[i].x>=truck.x-12&&items[i].x<=truck.x+truck.w+12){if(items[i].good){sc+=10;document.getElementById('sc').textContent=sc;}else{lives--;var h='';for(var j=0;j<lives;j++)h+='❤️';document.getElementById('hp').textContent=h||'💔';if(lives<=0){endGame(false);return;}}items.splice(i,1);}}}function draw(){var sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#1a2634');sky.addColorStop(1,'#2d4a6e');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.4)';[[50,30],[130,55],[230,20],[310,48]].forEach(function(s){ctx.fillRect(s[0],s[1],2,2);});ctx.fillStyle='#3d5a3d';ctx.fillRect(0,GY-20,W,H-GY+20);ctx.fillStyle='#2d4a2d';ctx.fillRect(0,GY-22,W,6);ctx.fillStyle='rgba(255,255,255,.35)';for(var x=0;x<W;x+=60)ctx.fillRect(x,GY+2,30,4);ctx.font='26px serif';ctx.textAlign='center';ctx.textBaseline='middle';items.forEach(function(it){ctx.shadowColor='rgba(255,255,255,.3)';ctx.shadowBlur=8;ctx.fillText(it.e,it.x,it.y);ctx.shadowBlur=0;});var tx=truck.x,tw=truck.w;ctx.fillStyle='#1b5e20';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(tx,GY-38,tw,32,6);else ctx.rect(tx,GY-38,tw,32);ctx.fill();ctx.fillStyle='#2e7d32';ctx.fillRect(tx+4,GY-34,tw-8,24);ctx.fillStyle='#0d3d0d';if(ctx.roundRect)ctx.roundRect(tx+tw-22,GY-50,22,20,4);else ctx.rect(tx+tw-22,GY-50,22,20);ctx.fill();ctx.fillStyle='rgba(135,206,235,.8)';ctx.fillRect(tx+tw-19,GY-47,16,12);ctx.fillStyle='#333';[[tx+10,GY],[tx+tw-10,GY]].forEach(function(w){ctx.beginPath();ctx.arc(w[0],w[1],9,0,6.28);ctx.fill();ctx.fillStyle='#666';ctx.beginPath();ctx.arc(w[0],w[1],5,0,6.28);ctx.fill();ctx.fillStyle='#333';});ctx.font='16px serif';ctx.fillText('♻️',tx+tw/2-10,GY-22);}function endGame(win){running=false;clearInterval(cdT);var o=document.getElementById('ov');o.style.display='flex';o.innerHTML='<h2>'+(win?'⏰ Tempo Esgotado!':'💥 Fim de Jogo!')+'</h2><p>'+(win?'Você coletou <b>'+sc+'</b> pontos de energia limpa!':'Muita poluição coletada!<br>Pontos: <b>'+sc+'</b>')+'</p><button class="btn" onclick="startGame()">Jogar Novamente</button>';}document.addEventListener('keydown',function(e){if(e.key=='ArrowLeft')keys.l=true;if(e.key=='ArrowRight')keys.r=true;});document.addEventListener('keyup',function(e){if(e.key=='ArrowLeft')keys.l=false;if(e.key=='ArrowRight')keys.r=false;});<\/script></body></html>`;

const GAME_CORRIDA = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#87ceeb;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;padding:12px;user-select:none}#hud{display:flex;gap:20px;margin-bottom:8px;font-weight:700;color:#1a3a1a;font-size:.95rem}#hud b{color:#0d5a0d}canvas{display:block;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,.25);touch-action:none}#jbtn{margin-top:14px;background:#27ae60;color:#fff;border:none;padding:14px 50px;border-radius:28px;font-size:1.1rem;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(39,174,96,.4)}#jbtn:active{transform:scale(.95)}#ov{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:24px;z-index:9}#ov h2{font-size:1.8rem;color:#7CFC00;margin-bottom:12px}#ov p{color:#a5d6a7;margin-bottom:20px;line-height:1.5}.btn{background:#27ae60;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:1.1rem;font-weight:700;cursor:pointer}</style></head><body><div id="hud"><span>🌿 <b id="sc">0</b></span><span id="liv">❤️❤️❤️</span><span>💨 <b id="spd">1.0</b>x</span></div><canvas id="cv" width="360" height="220"></canvas><button id="jbtn" onclick="jump()">🚲 Pular! (Espaço)</button><div id="ov"><h2>🚲 Corrida Verde</h2><p>Pedale e desvie dos carros poluentes!<br>Colete folhas para ganhar pontos.<br>Espaço ou toque para pular.</p><button class="btn" onclick="startGame()">Pedalar!</button></div><script>var cv=document.getElementById('cv'),ctx=cv.getContext('2d');var W=360,H=220,GND=155;var player,obs,leaves,sc,lives,spd,running,lt=0,obsT=0,leafT=0,bgX=0,cloudX=0;var OBS=[{e:'🚗',w:38,h:28},{e:'🚙',w:42,h:30},{e:'🚕',w:38,h:28},{e:'🚛',w:52,h:36}];function startGame(){document.getElementById('ov').style.display='none';player={x:55,y:GND,vy:0,jumping:false,frame:0,ft:0};obs=[];leaves=[];sc=0;lives=3;spd=3;running=true;obsT=0;leafT=0;bgX=0;cloudX=0;lt=0;document.getElementById('sc').textContent=0;document.getElementById('spd').textContent='1.0';document.getElementById('liv').textContent='❤️❤️❤️';requestAnimationFrame(loop);}function loop(ts){if(!running)return;var dt=Math.min((ts-lt)/1000,.05);lt=ts;update(dt);draw();requestAnimationFrame(loop);}function update(dt){sc+=dt*spd;spd=3+Math.floor(sc/200)*.5;document.getElementById('sc').textContent=Math.floor(sc);document.getElementById('spd').textContent=spd.toFixed(1);if(player.jumping){player.vy+=780*dt;player.y+=player.vy*dt;}if(player.y>=GND){player.y=GND;player.vy=0;player.jumping=false;}player.ft+=dt;if(player.ft>.12){player.frame=(player.frame+1)%4;player.ft=0;}bgX-=spd*.5;cloudX-=.25;obs.forEach(function(o){o.x-=spd*2.2;});leaves.forEach(function(l){l.x-=spd*1.8;});obs=obs.filter(function(o){return o.x>-60;});leaves=leaves.filter(function(l){return l.x>-20;});obsT+=dt;if(obsT>Math.max(1.0,2.2-sc/400)){obsT=0;var o=OBS[Math.floor(Math.random()*OBS.length)];obs.push({x:W+20,y:GND+4-o.h,e:o.e,w:o.w,h:o.h});}leafT+=dt;if(leafT>.7){leafT=0;if(Math.random()<.6)leaves.push({x:W+10,y:GND-20-Math.random()*50});}for(var i=0;i<obs.length;i++){var o=obs[i];if(player.x+20>o.x+4&&player.x+10<o.x+o.w-4&&player.y+10>o.y+4){obs.splice(i,1);lives--;var h='';for(var j=0;j<lives;j++)h+='❤️';document.getElementById('liv').textContent=h||'💔';if(lives<=0){endGame();return;}break;}}for(var i=leaves.length-1;i>=0;i--){var l=leaves[i];if(Math.abs(player.x+16-l.x)<22&&Math.abs(player.y-l.y)<26){sc+=20;leaves.splice(i,1);}}}function draw(){var sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#87ceeb');sky.addColorStop(1,'#c8e6c9');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(255,255,255,.75)';var cx1=(cloudX%400+400)%400,cx2=(cloudX%400+200+400)%400;[[cx1,28,70],[cx2,52,90]].forEach(function(c){ctx.beginPath();ctx.ellipse(c[0],c[1],c[2]/2,16,0,0,6.28);ctx.fill();ctx.beginPath();ctx.ellipse(c[0]-18,c[1]+6,c[2]/3,12,0,0,6.28);ctx.fill();ctx.beginPath();ctx.ellipse(c[0]+20,c[1]+6,c[2]/3,12,0,0,6.28);ctx.fill();});ctx.fillStyle='#5d8a5d';ctx.fillRect(0,GND+22,W,H-GND-22);ctx.fillStyle='#4a7a4a';ctx.fillRect(0,GND+20,W,5);ctx.fillStyle='rgba(255,255,255,.45)';for(var x=(bgX%60+60)%60;x<W;x+=60)ctx.fillRect(x,GND+32,28,4);ctx.font='18px serif';ctx.textAlign='center';ctx.textBaseline='middle';leaves.forEach(function(l){ctx.fillText('🌿',l.x,l.y);});obs.forEach(function(o){ctx.fillText(o.e,o.x+o.w/2,o.y+o.h/2);});var py=player.jumping?player.y:player.y+Math.sin(player.frame*Math.PI/2)*1.5;ctx.font='30px serif';ctx.fillText('🚴',player.x+16,py+12);}function jump(){if(!running||player.jumping)return;player.jumping=true;player.vy=-400;}function endGame(){running=false;var o=document.getElementById('ov');o.style.display='flex';o.innerHTML='<h2>💥 Bateu!</h2><p>Distância: <b>'+Math.floor(sc)+'</b> metros<br>Continue pedalando pelo planeta! 🌿</p><button class="btn" onclick="startGame()">Pedalar de Novo!</button>';}document.addEventListener('keydown',function(e){if(e.code=='Space'||e.key==' '){e.preventDefault();jump();}});cv.addEventListener('touchstart',function(e){e.preventDefault();jump();},{passive:false});<\/script></body></html>`;

const GAME_MEMORIA = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:linear-gradient(135deg,#1b5e20 0%,#2e7d32 100%);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:20px;font-family:Arial,sans-serif}h1{color:#a5d6a7;font-size:1.2rem;margin-bottom:8px}#hud{display:flex;gap:24px;margin-bottom:14px;color:#c8e6c9;font-size:.9rem}#hud b{color:#fff}#grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;width:100%;max-width:360px}.card{aspect-ratio:1;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.3);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:2.1rem;cursor:pointer;transition:transform .25s,background .25s;user-select:none}.card.flip{background:rgba(255,255,255,.92);transform:scale(1.06)}.card.done{background:rgba(39,174,96,.45);border-color:#27ae60;cursor:default}.card.err{animation:shk .4s}@keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}#fact{background:rgba(255,255,255,.15);border-radius:14px;padding:12px;margin-top:14px;max-width:360px;width:100%;color:#c8e6c9;font-size:.83rem;min-height:52px;line-height:1.45;text-align:center}#msg{margin-top:10px;color:#fff;font-size:1rem;font-weight:700;min-height:24px;text-align:center}#rst{margin-top:12px;background:#27ae60;color:#fff;border:none;padding:10px 28px;border-radius:20px;font-size:.95rem;font-weight:700;cursor:pointer}</style></head><body><h1>🌿 Memória da Natureza</h1><div id="hud"><span>🔄 <b id="mv">0</b> tentativas</span><span>✅ <b id="pr">0</b>/8 pares</span></div><div id="grid"></div><div id="msg"></div><div id="fact">Encontre os pares para descobrir curiosidades da natureza! 🌍</div><button id="rst" onclick="init()">Novo Jogo</button><script>var CARDS=[{e:'🦁',f:'Leões passam 20h dormindo — guardam energia para caçar com precisão.'},{e:'🐘',f:'Elefantes percorrem 80km/dia e memorizam rotas de água por décadas.'},{e:'🦒',f:'Girafas dormem apenas 30 min/dia e podem correr 56 km/h!'},{e:'🐬',f:'Golfinhos têm nomes únicos (assobios) e ensinam técnicas uns aos outros.'},{e:'🦜',f:'Araras-azuis foram reintroduzidas no Brasil após extinção local — vitória da preservação!'},{e:'🐊',f:'Jacarés existem há 250 milhões de anos — sobreviveram ao fim dos dinossauros!'},{e:'🦋',f:'Uma borboleta dissolve quase todo o corpo durante a metamorfose e se reconstrói.'},{e:'🐸',f:'Sapos absorvem água pela pele e desaparecem quando rios ficam poluídos.'}];var flipped=[],matched=0,moves=0,locked=false,cards=[];function shuffle(a){return a.slice().sort(function(){return Math.random()-.5;});}function init(){flipped=[];matched=0;moves=0;locked=false;document.getElementById('mv').textContent=0;document.getElementById('pr').textContent=0;document.getElementById('msg').textContent='';document.getElementById('fact').textContent='Encontre os pares para descobrir curiosidades da natureza! 🌍';cards=shuffle(CARDS.concat(CARDS)).map(function(c,i){return{e:c.e,f:c.f,id:i,vis:false,done:false,el:null};});var grid=document.getElementById('grid');grid.innerHTML='';cards.forEach(function(c,i){var el=document.createElement('div');el.className='card';el.textContent='🌱';el.addEventListener('click',function(){flip(i);});c.el=el;grid.appendChild(el);});}function flip(i){var c=cards[i];if(locked||c.done||c.vis)return;c.vis=true;c.el.textContent=c.e;c.el.classList.add('flip');flipped.push(i);if(flipped.length===2)check();}function check(){locked=true;moves++;document.getElementById('mv').textContent=moves;var a=flipped[0],b=flipped[1];if(cards[a].e===cards[b].e){cards[a].done=cards[b].done=true;cards[a].el.classList.add('done');cards[b].el.classList.add('done');matched++;document.getElementById('pr').textContent=matched;document.getElementById('fact').textContent='💡 '+cards[a].f;flipped=[];locked=false;if(matched===8){document.getElementById('msg').textContent='🎉 Parabéns! Completado em '+moves+' tentativas!';window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:8,total:8},'*');}}else{setTimeout(function(){[cards[a],cards[b]].forEach(function(c){c.vis=false;c.el.textContent='🌱';c.el.classList.remove('flip');c.el.classList.add('err');setTimeout(function(){c.el.classList.remove('err');},400);});flipped=[];locked=false;},900);}}init();<\/script></body></html>`;

const GAME_BREAKOUT = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#0d1f0d;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;padding:12px;user-select:none}#hud{display:flex;gap:20px;margin-bottom:8px;font-weight:700;color:#a5d6a7;font-size:.95rem}#hud b{color:#fff}canvas{display:block;border:2px solid #27ae60;border-radius:10px;touch-action:none}#ov{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:24px;z-index:9}#ov h2{font-size:1.8rem;color:#7CFC00;margin-bottom:12px}#ov p{color:#a5d6a7;margin-bottom:20px;line-height:1.5}.btn{background:#27ae60;color:#fff;border:none;padding:12px 32px;border-radius:24px;font-size:1.1rem;font-weight:700;cursor:pointer}</style></head><body><div id="hud"><span>⭐ <b id="sc">0</b></span><span id="hp">❤️❤️❤️</span><span>🏭 Restam: <b id="bl">40</b></span></div><canvas id="cv" width="360" height="480"></canvas><div id="ov"><h2>🌿 Quebra-Fábricas</h2><p>Destrua as fábricas poluidoras!<br>Mova o paddle com o mouse, toque ou setas.<br>Não deixe a bola cair!</p><button class="btn" onclick="startGame()">Jogar!</button></div><script>var cv=document.getElementById('cv'),ctx=cv.getContext('2d');var W=360,H=480;var paddle,ball,blocks,sc,lives,running,raf;var EM=['🏭','🛢️','🪨','☁️','🏗️','💨'];var CL=['#5d0000','#7b1a00','#8b2500','#4a0000','#6b1500','#3d0a00'];function mkBlocks(){var arr=[];for(var r=0;r<5;r++)for(var c=0;c<8;c++)arr.push({x:4+c*44,y:50+r*30,w:40,h:24,alive:true,e:EM[(r*8+c)%EM.length],cl:CL[(r*8+c)%CL.length],hp:r<2?1:2});return arr;}function startGame(){document.getElementById('ov').style.display='none';paddle={x:W/2-40,y:H-20,w:80,h:12};ball={x:W/2,y:H-40,vx:3.5,vy:-3.5,r:8};blocks=mkBlocks();sc=0;lives=3;running=true;document.getElementById('sc').textContent=0;document.getElementById('hp').textContent='❤️❤️❤️';document.getElementById('bl').textContent=40;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);}var lt=0;function loop(ts){if(!running)return;var dt=Math.min((ts-lt)/1000,.05);lt=ts;update();draw();raf=requestAnimationFrame(loop);}function update(){ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x-ball.r<0){ball.x=ball.r;ball.vx=Math.abs(ball.vx);}if(ball.x+ball.r>W){ball.x=W-ball.r;ball.vx=-Math.abs(ball.vx);}if(ball.y-ball.r<0){ball.y=ball.r;ball.vy=Math.abs(ball.vy);}if(ball.y>H+20){lives--;var h='';for(var j=0;j<lives;j++)h+='❤️';document.getElementById('hp').textContent=h||'💔';if(lives<=0){endGame(false);return;}ball.x=W/2;ball.y=H-80;ball.vx=3.5*(Math.random()>.5?1:-1);ball.vy=-3.5;}if(ball.y+ball.r>paddle.y&&ball.y-ball.r<paddle.y+paddle.h&&ball.x>paddle.x-4&&ball.x<paddle.x+paddle.w+4){ball.vy=-Math.abs(ball.vy);var hit=(ball.x-(paddle.x+paddle.w/2))/(paddle.w/2);ball.vx=hit*5;ball.y=paddle.y-ball.r;}var alive=0;for(var i=0;i<blocks.length;i++){var b=blocks[i];if(!b.alive){continue;}alive++;if(ball.x+ball.r>b.x&&ball.x-ball.r<b.x+b.w&&ball.y+ball.r>b.y&&ball.y-ball.r<b.y+b.h){b.hp--;if(b.hp<=0){b.alive=false;sc+=10;}else sc+=2;document.getElementById('sc').textContent=sc;document.getElementById('bl').textContent=alive-1;var oc=ball.y>b.y&&ball.y<b.y+b.h;if(oc){ball.vx=-ball.vx;}else{ball.vy=-ball.vy;}break;}}if(alive===0)endGame(true);}function draw(){ctx.fillStyle='#0d1f0d';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(39,174,96,.06)';ctx.lineWidth=1;for(var i=0;i<W;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}for(var j=0;j<H;j+=40){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}blocks.forEach(function(b){if(!b.alive)return;ctx.fillStyle=b.cl;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(b.x,b.y,b.w,b.h,4);else ctx.rect(b.x,b.y,b.w,b.h);ctx.fill();if(b.hp>1){ctx.fillStyle='rgba(255,255,255,.15)';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(b.x,b.y,b.w,b.h,4);else ctx.rect(b.x,b.y,b.w,b.h);ctx.fill();}ctx.font='14px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.e,b.x+b.w/2,b.y+b.h/2);});var g=ctx.createLinearGradient(paddle.x,paddle.y,paddle.x+paddle.w,paddle.y);g.addColorStop(0,'#1b5e20');g.addColorStop(.5,'#4caf50');g.addColorStop(1,'#1b5e20');ctx.fillStyle=g;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(paddle.x,paddle.y,paddle.w,paddle.h,6);else ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h);ctx.fill();var bg=ctx.createRadialGradient(ball.x,ball.y,1,ball.x,ball.y,ball.r);bg.addColorStop(0,'#b0ff50');bg.addColorStop(1,'#27ae60');ctx.fillStyle=bg;ctx.shadowColor='#7CFC00';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,6.28);ctx.fill();ctx.shadowBlur=0;}function endGame(win){running=false;var o=document.getElementById('ov');o.style.display='flex';o.innerHTML='<h2>'+(win?'🎉 Planeta Limpo!':'💔 Fim de Jogo!')+'</h2><p>'+(win?'Você destruiu todas as fábricas poluidoras!<br>Pontos: <b>'+sc+'</b>':'As fábricas venceram desta vez...<br>Pontos: <b>'+sc+'</b>')+'</p><button class="btn" onclick="startGame()">Jogar Novamente</button>';if(win)window.parent&&window.parent.postMessage({type:'GAME_COMPLETE',score:sc,total:400},'*');}cv.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();paddle.x=Math.max(0,Math.min(W-paddle.w,e.clientX-r.left-paddle.w/2));});cv.addEventListener('touchmove',function(e){e.preventDefault();var r=cv.getBoundingClientRect();paddle.x=Math.max(0,Math.min(W-paddle.w,e.touches[0].clientX-r.left-paddle.w/2));},{passive:false});document.addEventListener('keydown',function(e){if(e.key=='ArrowLeft')paddle.x=Math.max(0,paddle.x-14);if(e.key=='ArrowRight')paddle.x=Math.min(W-paddle.w,paddle.x+14);});<\/script></body></html>`;

// ─── DEFINIÇÃO DAS 10 TRILHAS ──────────────────────────────────────────────────

const TRAILS = [
  {
    course: { title: 'Coleta Seletiva', description: 'Aprenda a separar corretamente o lixo nas lixeiras coloridas e ajude o planeta a reciclar mais!', coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80', difficulty: 'iniciante', minPlan: 'free', emoji: '♻️', estimatedMinutes: 10, order: 1, category: 'reciclagem', tags: ['reciclagem','lixo','meio ambiente'] },
    content: { title: 'Cobrinha Verde', type: 'game', content: GAME_COBRA, order: 1 }
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
    course: { title: 'Quiz ESG', description: 'Teste seus conhecimentos sobre sustentabilidade, reciclagem, energia e meio ambiente!', coverImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&q=80', difficulty: 'iniciante', minPlan: 'familia', emoji: '📊', estimatedMinutes: 12, order: 4, category: 'quiz', tags: ['quiz','esg','sustentabilidade'] },
    content: { title: 'Quiz: Sustentabilidade', type: 'game', content: GAME_QUIZ_ESG, order: 1 }
  },
  {
    course: { title: 'Cidade Sustentável', description: 'Construa do zero uma cidade ecológica! Escolha estruturas verdes e crie um modelo de desenvolvimento sustentável.', coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80', difficulty: 'intermediario', minPlan: 'familia', emoji: '🏙️', estimatedMinutes: 15, order: 5, category: 'urbanismo', tags: ['cidade','urbanismo','construção verde'] },
    content: { title: 'Quebra-Fábricas', type: 'game', content: GAME_BREAKOUT, order: 1 }
  },
  {
    course: { title: 'Energia Limpa', description: 'Descubra a diferença entre fontes de energia renováveis e não renováveis. O futuro é verde!', coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&q=80', difficulty: 'iniciante', minPlan: 'familia', emoji: '⚡', estimatedMinutes: 12, order: 6, category: 'energia', tags: ['energia','renovável','solar','eólica'] },
    content: { title: 'Caminhão Coletor', type: 'game', content: GAME_COLETOR, order: 1 }
  },
  {
    course: { title: 'Mobilidade Verde', description: 'Cada deslocamento tem um impacto no meio ambiente. Aprenda a escolher o transporte mais sustentável!', coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', difficulty: 'intermediario', minPlan: 'familia', emoji: '🚲', estimatedMinutes: 12, order: 7, category: 'transporte', tags: ['mobilidade','transporte','bicicleta','emissões'] },
    content: { title: 'Corrida de Bike', type: 'game', content: GAME_CORRIDA, order: 1 }
  },
  {
    course: { title: 'Biodiversidade', description: 'Conheça os biomas brasileiros e os animais que os habitam. A diversidade da vida depende de cada um de nós!', coverImage: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80', difficulty: 'intermediario', minPlan: 'familia', emoji: '🦋', estimatedMinutes: 15, order: 8, category: 'biodiversidade', tags: ['animais','biomas','amazônia','cerrado'] },
    content: { title: 'Memória da Natureza', type: 'game', content: GAME_MEMORIA, order: 1 }
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
