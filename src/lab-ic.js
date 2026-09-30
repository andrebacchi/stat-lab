/* ===================== INTERVALO DE CONFIANÇA ===================== */
const IC={mu:128,sig:15,n:30,conf:0.95,t:true,st:[],shape:"norm"};
LAB("ic","Inferencial","Intervalo de confiança",`
<div class="intro"><span class="eyebrow">Inferencial</span><h2>O que “95% de confiança” quer dizer</h2><p>Simule cem estudos sobre a mesma população e conte quantos intervalos capturam o valor verdadeiro. Depois, calcule intervalos com seus próprios números.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Cem estudos, cem intervalos</h3><button class="more-btn" data-learn="ic">Saiba mais</button></div>
  <div class="fields">
   <div class="inp"><label for="iMu">Média verdadeira (μ)</label><div class="box"><input id="iMu" inputmode="decimal" value="128"></div></div>
   <div class="inp"><label for="iSg">DP da população (σ)</label><div class="box"><input id="iSg" inputmode="decimal" value="15"></div></div>
  </div>
  <div class="grid two" style="gap:12px;margin-top:10px">
   <div class="range"><label for="iN">n por estudo</label><output id="iNo"></output><input type="range" id="iN" min="3" max="400" value="30"></div>
   <div class="row" style="justify-content:flex-end"><div class="seg" id="iConf"><button data-v="0.90">90%</button><button data-v="0.95">95%</button><button data-v="0.99">99%</button></div></div>
  </div>
  <div class="row" style="margin-top:8px;justify-content:space-between"><div class="row"><div class="chips" id="iShape"></div><label class="toggle"><input type="checkbox" id="iT" checked> Usar t (recomendado)</label></div><div class="row"><button class="btn small" id="i1">+1 estudo</button><button class="btn small primary" id="i100">Simular 100 estudos</button></div></div>
  <svg class="ch" id="iPlot" style="margin-top:10px" role="img" aria-label="Intervalos de confiança simulados"></svg>
  <div class="tiles" id="iTiles" style="margin-top:12px"></div><div class="insight" id="iTxt"></div></div>
 <div class="card"><div class="card-h"><h3>Calculadora de IC</h3><button class="more-btn" data-learn="iccalc">Saiba mais</button></div>
  <div class="seg" id="kMode"><button data-v="mean">Média</button><button data-v="prop">Proporção</button><button data-v="n">Tamanho da amostra</button></div>
  <div id="kFields" style="margin-top:12px"></div><svg class="ch" id="kPlot" style="margin-top:10px" role="img" aria-label="Resultado"></svg><div class="f" id="kF"></div>
  <button class="btn small" id="kBench">Usar os dados da bancada</button></div>
 <div class="card"><div class="card-h"><h3>O que alarga ou estreita o IC</h3><button class="more-btn" data-learn="icwidth">Saiba mais</button></div>
  <p class="lede">Diferença de médias entre dois grupos. Mexa e compare com a situação inicial (linha cinza).</p>
  <div class="stack">
   <div class="range"><label for="wd">Diferença observada</label><output id="wdo"></output><input type="range" id="wd" min="-10" max="20" step="0.5" value="5"></div>
   <div class="range"><label for="ws">Desvio padrão</label><output id="wso"></output><input type="range" id="ws" min="2" max="40" value="15"></div>
   <div class="range"><label for="wn">n por grupo</label><output id="wno"></output><input type="range" id="wn" min="5" max="800" value="100"></div>
   <div class="seg" id="wc"><button data-v="0.90">90%</button><button data-v="0.95">95%</button><button data-v="0.99">99%</button></div>
  </div>
  <svg class="ch" id="wPlot" style="margin-top:10px" role="img" aria-label="Largura do IC"></svg><div class="f" id="wF"></div></div>
</div>`,()=>{
  const upd=()=>{const m=parse($("iMu").value),s=parse($("iSg").value);if(has(m))IC.mu=m;if(has(s)&&s>0)IC.sig=s;IC.st=[];renderIc();};["iMu","iSg"].forEach(id=>$(id).oninput=upd);
  $("iN").oninput=e=>{IC.n=+e.target.value;IC.st=[];renderIc();};segBind($("iConf"),"0.95",v=>{IC.conf=+v;IC.st=[];renderIc();});
  chips($("iShape"),["Normal","Assimétrica"],i=>{IC.shape=i?"skew":"norm";IC.st=[];renderIc();},0);
  $("iT").onchange=e=>{IC.t=e.target.checked;IC.st=[];renderIc();};$("i1").onclick=()=>{IC.st.push(oneStudy());renderIc();};$("i100").onclick=()=>{IC.st=Array.from({length:100},oneStudy);renderIc();};
  segBind($("kMode"),"mean",v=>{K.mode=v;renderKFields();});
  $("kBench").onclick=()=>{if(B.v.length<2){toast("A bancada precisa de pelo menos 2 valores");return;}const d=descr(B.v);K.mode="mean";segBind($("kMode"),"mean",v=>{K.mode=v;renderKFields();});K.v.M=fmt(d.m,2);K.v.DP=fmt(d.s,2);K.v.n=String(d.n);renderKFields();toast("Dados da bancada: "+(B.name||"sem nome"));};
  ["wd","ws","wn"].forEach(id=>$(id).oninput=renderW);segBind($("wc"),"0.95",v=>{W.c=+v;renderW();});
},()=>{renderIc();renderKFields();renderW();});
function oneStudy(){const x=Array.from({length:IC.n},()=>draw(IC.mu,IC.sig,IC.shape)),m=mean(x),s=sd(x),q=IC.t?tq(1-(1-IC.conf)/2,IC.n-1):zq(1-(1-IC.conf)/2),h=q*s/Math.sqrt(IC.n);return{m,lo:m-h,hi:m+h};}
function renderIc(){$("iNo").textContent=IC.n;const el=$("iPlot"),S=IC.st.slice(-100),H=Math.max(180,S.length*4+50),Wd=box(el,H),L=14,iw=Wd-28,span=IC.sig*Math.max(1.2,4.5/Math.sqrt(Math.min(IC.n,30))),X=v=>L+(v-(IC.mu-span))/(2*span)*iw;let s="";
  s+=`<line x1="${X(IC.mu)}" x2="${X(IC.mu)}" y1="4" y2="${H-30}" stroke="var(--good)" stroke-width="2"/><text x="${X(IC.mu)+4}" y="12" class="lbl" style="fill:var(--good);font-size:11px">μ = ${auto(IC.mu)}</text>`;
  S.forEach((c,i)=>{const hit=c.lo<=IC.mu&&c.hi>=IC.mu,y=20+i*4;s+=`<line x1="${X(Math.max(c.lo,IC.mu-span))}" x2="${X(Math.min(c.hi,IC.mu+span))}" y1="${y}" y2="${y}" stroke="${hit?"var(--accent)":"var(--bad)"}" stroke-width="${hit?1.6:2.6}"/>`;});
  if(!S.length)s+=`<text x="${Wd/2}" y="90" text-anchor="middle" style="font-style:italic">Toque em “Simular 100 estudos”</text>`;
  s+=xAxis(X,nice(IC.mu-span,IC.mu+span,6).filter(t=>t>=IC.mu-span&&t<=IC.mu+span),H-30,v=>auto(v));el.innerHTML=s;
  const all=IC.st,hit=all.filter(c=>c.lo<=IC.mu&&c.hi>=IC.mu).length,w=all.length?mean(all.map(c=>c.hi-c.lo)):NaN;
  $("iTiles").innerHTML=tile("Estudos",all.length)+tile("Capturaram μ",all.length?pct(hit/all.length,0):"—",`esperado ≈ ${pct(IC.conf,0)}`,"acc")+tile("Erraram",all.length-hit,"","bad")+tile("Largura média",has(w)?auto(w):"—");
  $("iTxt").innerHTML=`Cada estudo tem seu próprio intervalo. O método acerta em cerca de ${pct(IC.conf,0)} das vezes, mas nenhum estudo sabe se é um dos que erraram (em vermelho).`+(!IC.t&&IC.n<30&&all.length?` Com n = ${IC.n} e z no lugar de t, a captura fica abaixo do esperado.`:"")+(IC.shape==="skew"&&IC.n<15&&all.length?" Com dados assimétricos e n pequeno, a captura também pode ficar abaixo do prometido.":"");}
const K={mode:"mean",v:{M:"128",DP:"15",n:"100",c:"0.95",p:"24",np:"800",pe:"50",e:"5"}};
function kField(id,l,u,sm){return `<div class="inp"><label for="k_${id}">${l}${sm?`<small>${sm}</small>`:""}</label><div class="box"><input id="k_${id}" inputmode="decimal" value="${K.v[id]}">${u?`<span>${u}</span>`:""}</div></div>`;}
function renderKFields(){$("kFields").innerHTML=`<div class="fields">`+(K.mode==="mean"?kField("M","Média")+kField("DP","DP")+kField("n","n"):K.mode==="prop"?kField("p","Proporção","%")+kField("np","n"):kField("pe","Proporção esperada","%","50% se não souber")+kField("e","Margem de erro","%"))+`<div class="inp"><label for="k_c">Confiança</label><div class="box"><select id="k_c">${[["0.90","90%"],["0.95","95%"],["0.99","99%"]].map(([v,l])=>`<option value="${v}" ${K.v.c===v?"selected":""}>${l}</option>`).join("")}</select></div></div></div>`;
  $("kFields").querySelectorAll("input,select").forEach(el=>el.addEventListener("input",()=>{K.v[el.id.slice(2)]=el.value;renderK();}));renderK();}
function renderK(){const g=k=>parse(K.v[k]),c=+K.v.c,z=zq(1-(1-c)/2),el=$("kPlot");let f="";
  if(K.mode==="mean"){const M=g("M"),S=g("DP"),n=g("n");if(!(has(M)&&has(S)&&has(n)&&n>1&&S>=0)){el.innerHTML="";$("kF").textContent="Preencha os campos.";return;}
    const se=S/Math.sqrt(n),tt=tq(1-(1-c)/2,n-1),lo=M-tt*se,hi=M+tt*se;f=`EP = ${auto(S)} ÷ √${n} = ${auto(se)}<br>IC ${pct(c,0)} = ${auto(M)} ± ${fmt(tt,3)} × ${auto(se)} = <b>${auto(lo)} a ${auto(hi)}</b><br><span class="mini">Usando t com ${n-1} gl (com z = ${fmt(z,3)}: ${auto(M-z*se)} a ${auto(M+z*se)}).</span>`;drawCI(el,M,lo,hi,M-Math.max(3*se,(hi-lo)),M+Math.max(3*se,(hi-lo)));}
  else if(K.mode==="prop"){const p=g("p")/100,n=g("np");if(!(has(p)&&has(n)&&p>0&&p<1&&n>1)){el.innerHTML="";$("kF").textContent="Proporção entre 0 e 100% e n maior que 1.";return;}
    const se=Math.sqrt(p*(1-p)/n),lo=p-z*se,hi=p+z*se;f=`EP = √(${fmt(p,2)} × ${fmt(1-p,2)} ÷ ${n}) = ${fmt(se,4)}<br>IC ${pct(c,0)} = ${pct(p,1)} ± ${fmt(z,3)} × ${fmt(se,4)} = <b>${pct(lo,1)} a ${pct(hi,1)}</b>`;drawCI(el,p*100,lo*100,hi*100,Math.max(0,p*100-4*se*100-2),Math.min(100,p*100+4*se*100+2),"%");}
  else{const p=g("pe")/100,e=g("e")/100;if(!(has(p)&&has(e)&&p>0&&p<1&&e>0)){el.innerHTML="";$("kF").textContent="Preencha os campos.";return;}
    const n=z*z*p*(1-p)/(e*e);f=`n = z² × p(1 − p) ÷ e² = ${fmt(z,2)}² × ${fmt(p,2)} × ${fmt(1-p,2)} ÷ ${fmt(e,3)}² = ${fmt(n,1)} → <b>${fmt(Math.ceil(n-1e-9),0)} participantes</b>`+(Math.abs(c-.95)<1e-9?`<br>Com z arredondado para 2: n = ${fmt(Math.ceil(4*p*(1-p)/(e*e)-1e-9),0)}`:"");
    const H=150,Wd=box(el,H),L=50,iw=Wd-L-14,ih=H-40,X=v=>L+(v-.01)/(.1-.01)*iw,nmax=z*z*.25/(.01*.01),Y=v=>10+ih-Math.log10(Math.max(v,1))/Math.log10(nmax*1.2)*ih;let s="",pp="";
    for(let i=0;i<=90;i++){const ee=.01+i/1000;pp+=(i?"L":"M")+X(ee)+","+Y(z*z*p*(1-p)/(ee*ee));}s+=yGrid(Y,[10,100,1000,10000].filter(v=>v<nmax*1.2),L,Wd-14,v=>fmt(v,0))+`<path class="curveA" d="${pp}"/>`;
    if(e>=.01&&e<=.1)s+=`<circle cx="${X(e)}" cy="${Y(n)}" r="6" fill="var(--alt)"/>`;s+=xAxis(X,[.01,.02,.04,.06,.08,.1],10+ih,v=>pct(v,0),L,Wd-14)+`<text x="${Wd-14}" y="${H-1}" text-anchor="end" style="font-size:11px">margem de erro</text>`;el.innerHTML=s;}
  $("kF").innerHTML=f;}
function drawCI(el,est,lo,hi,a,b,u=""){const H=74,Wd=box(el,H),L=14,iw=Wd-28,X=v=>L+(v-a)/(b-a)*iw;el.innerHTML=`<line x1="${X(lo)}" x2="${X(hi)}" y1="26" y2="26" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/><circle cx="${X(est)}" cy="26" r="7" fill="var(--accent)"/><text x="${X(lo)}" y="12" text-anchor="middle" style="font-size:11px">${auto(lo)}${u}</text><text x="${X(hi)}" y="12" text-anchor="middle" style="font-size:11px">${auto(hi)}${u}</text>`+xAxis(X,nice(a,b,5).filter(t=>t>=a&&t<=b),46,v=>auto(v)+u,L,Wd-14);}
const W={c:.95};
function renderW(){const d=+$("wd").value,S=+$("ws").value,n=+$("wn").value;$("wdo").textContent=fmt(d,1);$("wso").textContent=S;$("wno").textContent=n;
  const ci=(d,S,n,c)=>{const se=S*Math.sqrt(2/n),h=tq(1-(1-c)/2,2*n-2)*se;return[d-h,d+h];},b0=ci(5,15,100,.95),b1=ci(d,S,n,W.c);
  const el=$("wPlot"),H=110,Wd=box(el,H),L=14,iw=Wd-28,a=Math.min(-4,b1[0]-2,b0[0]-2),b=Math.max(14,b1[1]+2,b0[1]+2),X=v=>L+(v-a)/(b-a)*iw;
  let s=`<line x1="${X(0)}" x2="${X(0)}" y1="4" y2="${H-30}" stroke="var(--bad)" stroke-dasharray="4 3"/><text x="${X(0)+4}" y="12" style="font-size:10.5px;fill:var(--bad)">sem diferença</text>`;
  s+=`<line x1="${X(b0[0])}" x2="${X(b0[1])}" y1="30" y2="30" stroke="var(--tick)" stroke-width="3" stroke-linecap="round"/><circle cx="${X(5)}" cy="30" r="5" fill="var(--tick)"/><text x="${X(b0[1])+6}" y="34" style="font-size:11px">inicial</text>`;
  s+=`<line x1="${X(b1[0])}" x2="${X(b1[1])}" y1="58" y2="58" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/><circle cx="${X(d)}" cy="58" r="7" fill="var(--accent)"/>`+xAxis(X,nice(a,b,6).filter(t=>t>=a&&t<=b),H-28,v=>auto(v));el.innerHTML=s;
  $("wF").innerHTML=`IC ${pct(W.c,0)} = ${fmt(d,1)} ± t × DP × √(2/n) = <b>${fmt(b1[0],2)} a ${fmt(b1[1],2)}</b> · largura ${fmt(b1[1]-b1[0],2)} (inicial: ${fmt(b0[1]-b0[0],2)}). ${b1[0]>0||b1[1]<0?"O intervalo não inclui o zero.":"O intervalo inclui o zero."}`;}
