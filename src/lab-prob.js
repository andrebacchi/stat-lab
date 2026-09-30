/* ===================== PROBABILIDADE ===================== */
const LLN={p:.5,out:[],label:["cara","coroa"]};
const PT=[{n:"Hipertensão e diabetes",A:"hipertensão",B:"diabetes",pa:30,pba:20,pbn:7},{n:"Bancária e feminista (caso Larissa)",A:"bancária",B:"feminista",pa:5,pba:30,pbn:30},{n:"Doença e teste positivo",A:"doença",B:"teste positivo",pa:10,pba:90,pbn:15},{n:"Fumante e tosse crônica",A:"fumante",B:"tosse crônica",pa:15,pba:40,pbn:8}];
const PR={i:0,A:"hipertensão",B:"diabetes"};
LAB("prob","Descritiva","Probabilidade",`
<div class="intro"><span class="eyebrow">Descritiva · probabilidade</span><h2>Acaso, frequências e as regras do “E” e do “OU”</h2><p>Jogue moedas e dados milhares de vezes, monte uma população de 100 pessoas e veja de onde vêm as regras de probabilidade.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Lei dos grandes números</h3><button class="more-btn" data-learn="lln">Saiba mais</button></div>
  <div class="row" style="justify-content:space-between"><div class="chips" id="lPre"></div></div>
  <div class="range" style="margin-top:10px"><label for="lP">Probabilidade verdadeira do evento</label><output id="lPo"></output><input type="range" id="lP" min="1" max="99" value="50"></div>
  <div class="row" style="margin-top:8px"><button class="btn small" id="l1">+1</button><button class="btn small" id="l10">+10</button><button class="btn small" id="l100">+100</button><button class="btn small primary" id="l1000">+1.000</button><button class="btn small" id="l0">Recomeçar</button></div>
  <div class="coins" id="lCoins" style="margin-top:10px"></div>
  <svg class="ch" id="lPlot" style="margin-top:8px" role="img" aria-label="Proporção acumulada"></svg>
  <div class="tiles" id="lTiles" style="margin-top:8px"></div><div class="insight" id="lTxt"></div></div>
 <div class="card wide"><div class="card-h"><h3>Cem pessoas: “E”, “OU” e probabilidade condicional</h3><button class="more-btn" data-learn="and">Saiba mais</button></div>
  <div class="chips" id="pPre"></div>
  <div class="cols2" style="margin-top:12px">
   <div class="stack">
    <div class="range"><label for="pA">P(A)</label><output id="pAo"></output><input type="range" id="pA" min="0" max="100" value="30"></div>
    <div class="range"><label for="pBA">P(B | A): B entre quem tem A</label><output id="pBAo"></output><input type="range" id="pBA" min="0" max="100" value="20"></div>
    <div class="range"><label for="pBN">P(B | não A): B entre quem não tem A</label><output id="pBNo"></output><input type="range" id="pBN" min="0" max="100" value="7"></div>
    <div class="legend" id="pLeg"></div>
   </div>
   <div class="icons" id="pIcons" style="grid-template-columns:repeat(10,1fr);max-width:320px;gap:4px" aria-hidden="true"></div>
  </div>
  <div class="tiles" id="pTiles" style="margin-top:14px"></div><div class="f" id="pF"></div><div class="insight" id="pTxt"></div></div>
 <div class="card"><div class="card-h"><h3>O caso Larissa</h3><button class="more-btn" data-learn="and">Saiba mais</button></div>
  <p class="lede">“Larissa, 31 anos, solteira, sincera e muito inteligente. Cursou filosofia. Quando estudante, preocupava-se com discriminação e justiça social e participou de protestos contra as armas nucleares.”</p><div id="larQ"></div></div>
 <div class="card"><div class="card-h"><h3>Probabilidade ou chance?</h3><button class="more-btn" data-learn="odds">Saiba mais</button></div>
  <div class="fields"><div class="inp"><label for="oX">Eventos</label><div class="box"><input id="oX" inputmode="numeric" value="20"></div></div><div class="inp"><label for="oN">Total</label><div class="box"><input id="oN" inputmode="numeric" value="100"></div></div></div>
  <div class="tiles" id="oTiles" style="margin-top:10px"></div><svg class="ch" id="oPlot" style="margin-top:10px" role="img" aria-label="Probabilidade versus chance"></svg>
  <p class="note">Em epidemiologia, “chance” é a tradução de <i>odds</i>. Probabilidade vai de 0 a 1; chance vai de 0 ao infinito.</p></div>
 <div class="card wide"><div class="card-h"><h3>Porcentagens se multiplicam</h3><button class="more-btn" data-learn="pct">Saiba mais</button></div>
  <p class="lede">Um preço de R$ 100,00 cai X% e depois sobe os mesmos X%. Qual o preço final?</p>
  <div class="range"><label for="cX">X</label><output id="cXo"></output><input type="range" id="cX" min="1" max="90" value="25"></div>
  <svg class="ch" id="cPlot" style="margin-top:10px" role="img" aria-label="Preço após desconto e aumento"></svg><div class="insight" id="cTxt"></div></div>
</div>`,()=>{
  const LP=[["Moeda",.5,["cara","coroa"]],["Dado: sair 6",1/6,["6","outro"]],["Evento raro (5%)",.05,["evento","nada"]]];
  chips($("lPre"),LP.map(x=>x[0]),i=>{LLN.p=LP[i][1];LLN.label=LP[i][2];$("lP").value=Math.round(LLN.p*100);LLN.out=[];renderLLN();},0);
  $("lP").oninput=e=>{LLN.p=+e.target.value/100;LLN.label=["evento","nada"];LLN.out=[];$("lPre").querySelectorAll(".chip").forEach(c=>c.classList.remove("on"));renderLLN();};
  [["l1",1],["l10",10],["l100",100],["l1000",1000]].forEach(([id,k])=>$(id).onclick=()=>{for(let i=0;i<k;i++)LLN.out.push(Math.random()<LLN.p?1:0);renderLLN();});$("l0").onclick=()=>{LLN.out=[];renderLLN();};
  chips($("pPre"),PT.map(p=>p.n),i=>{const p=PT[i];PR.A=p.A;PR.B=p.B;$("pA").value=p.pa;$("pBA").value=p.pba;$("pBN").value=p.pbn;renderPT();},0);
  ["pA","pBA","pBN"].forEach(id=>$(id).oninput=renderPT);
  $("larQ").addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(b){LAR.ans=b.dataset.a;renderLar();}if(e.target.id==="larGo"){const p=PT[1];PR.A=p.A;PR.B=p.B;$("pA").value=p.pa;$("pBA").value=p.pba;$("pBN").value=p.pbn;$("pPre").querySelectorAll(".chip").forEach((c,i)=>c.classList.toggle("on",i===1));renderPT();$("pPre").scrollIntoView({behavior:"smooth",block:"center"});}});
  ["oX","oN"].forEach(id=>$(id).oninput=renderOdds);$("cX").oninput=renderPct;
},()=>{renderLLN();renderPT();renderLar();renderOdds();renderPct();});
function renderLLN(){const o=LLN.out,n=o.length,k=sum(o);$("lPo").textContent=pct(LLN.p,0);
  $("lCoins").innerHTML=o.slice(-40).map(v=>`<i style="background:${v?"var(--accent)":"var(--tick)"}">${v?(LLN.label[0][0]||"").toUpperCase():""}</i>`).join("")||`<span class="mini">Os últimos 40 resultados aparecem aqui.</span>`;
  const el=$("lPlot"),H=200,W=box(el,H),L=40,Rr=12,T=10,iw=W-L-Rr,ih=H-T-30,nmax=Math.max(10,n),X=i=>L+Math.log10(i)/Math.log10(nmax)*iw,Y=v=>T+ih-v*ih;let s=yGrid(Y,[0,.25,.5,.75,1],L,W-Rr,v=>pct(v,0));
  s+=`<line x1="${L}" x2="${W-Rr}" y1="${Y(LLN.p)}" y2="${Y(LLN.p)}" stroke="var(--good)" stroke-width="2"/>`;
  if(n){let c=0,p="";const step=Math.max(1,Math.floor(n/600));for(let i=1;i<=n;i++){c+=o[i-1];if(i%step===0||i===n||i<50)p+=(p?"L":"M")+X(i).toFixed(1)+","+Y(c/i).toFixed(1);}s+=`<path d="${p}" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="${X(n)}" cy="${Y(k/n)}" r="5" fill="var(--accent)"/>`;}
  const tk=[1,10,100,1000,10000,100000].filter(t=>t<=nmax);s+=xAxis(X,tk,T+ih,v=>fmt(v,0),L,W-Rr)+`<text x="${W-Rr}" y="${H-1}" text-anchor="end" style="font-size:11px">número de jogadas (escala log)</text>`;el.innerHTML=s;
  $("lTiles").innerHTML=tile("Jogadas",fmt(n,0))+tile(`Proporção de “${LLN.label[0]}”`,n?pct(k/n,1):"—",`${fmt(k,0)} de ${fmt(n,0)}`,"acc")+tile("Probabilidade verdadeira",pct(LLN.p,1),"","good")+tile("Diferença",n?pct(Math.abs(k/n-LLN.p),1):"—","em pontos percentuais");
  $("lTxt").innerHTML=!n?"Jogue algumas vezes. Com poucas jogadas, a proporção oscila muito.":n<50?"Com poucas jogadas, a proporção ainda pode estar longe da probabilidade verdadeira.":`Com ${fmt(n,0)} jogadas, a proporção observada se aproxima da probabilidade verdadeira. Repare que as sequências curtas (os últimos resultados) continuam imprevisíveis: o acaso não “compensa” resultados anteriores.`;}
function renderPT(){const pa=+$("pA").value/100,pba=+$("pBA").value/100,pbn=+$("pBN").value/100,ab=pa*pba,anb=pa*(1-pba),nab=(1-pa)*pbn,pb=ab+nab,por=pa+pb-ab,pab=pb?ab/pb:NaN;
  $("pAo").textContent=pct(pa,0);$("pBAo").textContent=pct(pba,0);$("pBNo").textContent=pct(pbn,0);
  const nAB=Math.round(ab*100),nA=Math.round(anb*100),nB=Math.round(nab*100);let ic="";for(let i=0;i<100;i++){const c=i<nAB?"var(--g4)":i<nAB+nA?"var(--g1)":i<nAB+nA+nB?"var(--g2)":"var(--dot)";ic+=`<i style="background:${c}"></i>`;}$("pIcons").innerHTML=ic;
  $("pLeg").innerHTML=`<span><i style="background:var(--g4);height:10px;width:10px;border-radius:50%"></i>${esc(PR.A)} e ${esc(PR.B)}: ${nAB}</span><span><i style="background:var(--g1);height:10px;width:10px;border-radius:50%"></i>só ${esc(PR.A)}: ${nA}</span><span><i style="background:var(--g2);height:10px;width:10px;border-radius:50%"></i>só ${esc(PR.B)}: ${nB}</span><span><i style="background:var(--dot);height:10px;width:10px;border-radius:50%"></i>nenhum: ${100-nAB-nA-nB}</span>`;
  $("pTiles").innerHTML=tile(`P(${esc(PR.A)} e ${esc(PR.B)})`,pct(ab,1),"regra do E","acc")+tile(`P(${esc(PR.A)} ou ${esc(PR.B)})`,pct(por,1),"regra do OU")+tile(`P(${esc(PR.B)})`,pct(pb,1),"total")+tile(`P(${esc(PR.A)} | ${esc(PR.B)})`,has(pab)?pct(pab,1):"—",`entre quem tem ${esc(PR.B)}`,"alt");
  $("pF").innerHTML=`E: P(A e B) = P(A) × P(B | A) = ${pct(pa,0)} × ${pct(pba,0)} = <b>${pct(ab,1)}</b><br>OU: P(A ou B) = P(A) + P(B) − P(A e B) = ${pct(pa,0)} + ${pct(pb,1)} − ${pct(ab,1)} = <b>${pct(por,1)}</b><br>Condicional invertida: P(A | B) = P(A e B) ÷ P(B) = ${pct(ab,1)} ÷ ${pct(pb,1)} = <b>${has(pab)?pct(pab,1):"—"}</b>`;
  const indep=Math.abs(pba-pbn)<.005;
  $("pTxt").innerHTML=`“${esc(PR.A)} e ${esc(PR.B)}” (${pct(ab,1)}) nunca passa de P(${esc(PR.A)}) (${pct(pa,0)}): um pedaço de um pedaço é um pedaço menor. `+(indep?`Como P(B | A) = P(B | não A), A e B são <b>independentes</b>: saber de A não muda a probabilidade de B.`:`Repare que P(${esc(PR.B)} | ${esc(PR.A)}) = ${pct(pba,0)} é diferente de P(${esc(PR.A)} | ${esc(PR.B)}) = ${has(pab)?pct(pab,0):"—"}. Inverter a condicional é um erro comum, inclusive ao interpretar testes diagnósticos.`);}
const LAR={ans:null};
function renderLar(){const q=$("larQ");if(!LAR.ans){q.innerHTML=`<p class="q" style="font-size:18px">O que é mais provável?</p><div class="opts"><button class="opt" data-a="b">Larissa é bancária.</button><button class="opt" data-a="bf">Larissa é bancária <u>e</u> participa do movimento feminista.</button></div>`;return;}
  q.innerHTML=`<div class="opts"><button class="opt right" disabled>Larissa é bancária.</button><button class="opt ${LAR.ans==="bf"?"wrong":""}" disabled>Larissa é bancária <u>e</u> participa do movimento feminista.</button></div><div class="fb">${LAR.ans==="b"?"<b class='ok'>Correto.</b>":"<b class='no'>Você caiu na falácia da conjunção</b>, como a maioria das pessoas (Tversky e Kahneman, 1983)."} “Bancária e feminista” é um subconjunto de “bancária”: nunca pode ser mais provável.</div><div class="row" style="margin-top:10px"><button class="btn small" id="larGo">Ver nas 100 pessoas</button></div>`;}
function renderOdds(){const x=parse($("oX").value),n=parse($("oN").value),el=$("oPlot");if(!(has(x)&&has(n)&&n>0&&x>=0&&x<=n)){$("oTiles").innerHTML=`<p class="note">Eventos deve estar entre 0 e o total.</p>`;return;}
  const p=x/n,o=x<n?x/(n-x):Infinity;$("oTiles").innerHTML=tile("Probabilidade",fmt(p,3),`${fmt(x,0)} ÷ ${fmt(n,0)} = ${pct(p,1)}`,"acc")+tile("Chance (odds)",isFinite(o)?fmt(o,3):"∞",`${fmt(x,0)} ÷ ${fmt(n-x,0)}`,"alt");
  const H=170,W=box(el,H),L=36,iw=W-L-14,ih=H-40,X=v=>L+v/0.8*iw,Y=v=>10+ih-Math.min(v,4)/4*ih;let s="",pp="",po="";for(let i=0;i<=100;i++){const q=i/100*0.8;pp+=(i?"L":"M")+X(q)+","+Y(q);po+=(i?"L":"M")+X(q)+","+Y(q/(1-q));}
  s+=yGrid(Y,[0,1,2,3,4],L,W-14,v=>v)+`<path class="curveA" d="${pp}"/><path class="curve" d="${po}"/>`+xAxis(X,[0,.2,.4,.6,.8],10+ih,v=>pct(v,0),L,W-14);if(p<=.8)s+=`<circle cx="${X(p)}" cy="${Y(p)}" r="5" fill="var(--accent)"/><circle cx="${X(p)}" cy="${Y(o)}" r="5" fill="var(--alt)"/>`;
  s+=`<text x="${W-16}" y="${Y(3.6)}" text-anchor="end" style="fill:var(--alt)">chance</text><text x="${W-16}" y="${Y(.95)}" text-anchor="end" style="fill:var(--accent)">probabilidade</text>`;el.innerHTML=s;}
function renderPct(){const x=+$("cX").value/100,v1=100*(1-x),v2=v1*(1+x);$("cXo").textContent=pct(x,0);const el=$("cPlot"),H=150,W=box(el,H),bw=Math.min(110,(W-60)/3),Y=v=>H-26-v/100*(H-48);let s="";
  [["início",100],[`−${pct(x,0)}`,v1],[`+${pct(x,0)}`,v2]].forEach(([l,v],i)=>{const x0=(W-3*bw-48)/2+i*(bw+24);s+=`<rect x="${x0}" y="${Y(v)}" width="${bw}" height="${H-26-Y(v)}" rx="4" fill="${i===2?"var(--alt)":"var(--accent)"}" opacity=".85"/><text x="${x0+bw/2}" y="${Y(v)-6}" text-anchor="middle" class="lbl">R$ ${fmt(v,2)}</text><text x="${x0+bw/2}" y="${H-8}" text-anchor="middle">${l}</text>`;});
  el.innerHTML=s;$("cTxt").innerHTML=`O aumento de ${pct(x,0)} incide sobre um valor menor (R$ ${fmt(v1,2)}), então não devolve o que foi tirado. Preço final: <b>R$ ${fmt(v2,2)}</b> = 100 × (1 − ${fmt(x,2)}²).`;}
