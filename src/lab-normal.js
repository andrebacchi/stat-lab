/* ===================== DISTRIBUIÇÃO NORMAL ===================== */
const NP=[{n:"Altura de adultos",m:170,s:8,u:"cm",a:180,b:160,mode:"above"},{n:"Peso ao nascer",m:3300,s:500,u:"g",a:2500,b:4000,mode:"below"},{n:"Pressão sistólica",m:120,s:15,u:"mmHg",a:140,b:100,mode:"above"},{n:"QI",m:100,s:15,u:"pontos",a:85,b:115,mode:"between"},{n:"Normal padrão (z)",m:0,s:1,u:"",a:-1.96,b:1.96,mode:"out"}];
const N={m:170,s:8,u:"cm",a:180,b:160,mode:"above",rule:false,tdf:0};
LAB("normal","Descritiva","Distribuição normal",`
<div class="intro"><span class="eyebrow">Descritiva</span><h2>A curva normal na prática</h2><p>Na curva normal, área é probabilidade. Escolha média e desvio padrão, arraste os limites e veja a proporção de pessoas em cada faixa.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Áreas sob a curva</h3><button class="more-btn" data-learn="dist">Saiba mais</button></div>
  <div class="chips" id="nPre"></div>
  <div class="fields" style="margin-top:10px">
   <div class="inp"><label for="nM">Média (μ)</label><div class="box"><input id="nM" inputmode="decimal"><span class="nu"></span></div></div>
   <div class="inp"><label for="nS">Desvio padrão (σ)</label><div class="box"><input id="nS" inputmode="decimal"><span class="nu"></span></div></div>
   <div class="inp"><label for="nA">Limite a</label><div class="box"><input id="nA" inputmode="decimal"><span class="nu"></span></div></div>
   <div class="inp" id="nBw"><label for="nB">Limite b</label><div class="box"><input id="nB" inputmode="decimal"><span class="nu"></span></div></div>
  </div>
  <div class="row" style="margin-top:10px;justify-content:space-between"><div class="seg" id="nMode"><button data-v="below">Abaixo de a</button><button data-v="above">Acima de a</button><button data-v="between">Entre a e b</button><button data-v="out">Fora de a e b</button></div>
   <label class="toggle"><input type="checkbox" id="nRule"> Regra 68–95–99,7</label></div>
  <svg class="ch" id="nPlot" style="margin-top:10px;touch-action:none" role="img" aria-label="Curva normal com área sombreada"></svg>
  <p class="note" style="margin-top:0">Arraste as linhas verticais para mudar os limites.</p>
  <div class="tiles" id="nTiles" style="margin-top:8px"></div>
  <div class="icons" id="nIcons" style="margin-top:12px" aria-hidden="true"></div>
  <div class="f" id="nF"></div>
  <details class="fold"><summary>Comparar com a distribuição t</summary>
   <div class="range" style="margin-top:8px"><label for="nT">Graus de liberdade (gl = n − 1)</label><output id="nTo"></output><input type="range" id="nT" min="0" max="60" value="0"></div>
   <p class="note">Com poucos graus de liberdade, a t tem caudas mais pesadas: valores extremos são mais prováveis. Arraste até 0 para esconder.</p>
  </details>
 </div>
 <div class="card"><div class="card-h"><h3>Qual valor corresponde a um percentil?</h3><button class="more-btn" data-learn="zscore">Saiba mais</button></div>
  <div class="range"><label for="nP">Percentil</label><output id="nPo"></output><input type="range" id="nP" min="1" max="99" value="95"></div>
  <div class="tiles" id="nPT" style="margin-top:8px"></div></div>
 <div class="card"><div class="card-h"><h3>Escore z: quem está mais longe da média?</h3><button class="more-btn" data-learn="zscore">Saiba mais</button></div>
  <p class="lede">Compare valores de escalas diferentes convertendo em “quantos desvios padrão da média”.</p>
  <div class="grpin" id="zIn"></div>
  <svg class="ch" id="zPlot" style="margin-top:10px" role="img" aria-label="Escores z"></svg>
  <div class="insight" id="zTxt"></div></div>
</div>`,()=>{
  const setN=p=>{Object.assign(N,{m:p.m,s:p.s,u:p.u,a:p.a,b:p.b,mode:p.mode});["nM","nS","nA","nB"].forEach((id,i)=>$(id).value=fmt([p.m,p.s,p.a,p.b][i],Number.isInteger([p.m,p.s,p.a,p.b][i])?0:2));segBind($("nMode"),N.mode,v=>{N.mode=v;renderNormal();});renderNormal();};
  chips($("nPre"),NP.map(p=>p.n),i=>setN(NP[i]),0);
  ["nM","nS","nA","nB"].forEach(id=>$(id).addEventListener("input",()=>{const [m,s,a,b]=["nM","nS","nA","nB"].map(i=>parse($(i).value));if(has(m))N.m=m;if(has(s)&&s>0)N.s=s;if(has(a))N.a=a;if(has(b))N.b=b;renderNormal();}));
  $("nRule").onchange=e=>{N.rule=e.target.checked;renderNormal();};$("nT").oninput=e=>{N.tdf=+e.target.value;renderNormal();};$("nP").oninput=renderNormal;
  const el=$("nPlot");let drag=null;
  el.addEventListener("pointerdown",e=>{const h=e.target.closest("[data-h]");if(!h)return;drag=h.dataset.h;el.setPointerCapture(e.pointerId);e.preventDefault();});
  el.addEventListener("pointermove",e=>{if(!drag||!N.plot)return;const q=svgPt(el,e),v=N.plot.lo+(q.x-N.plot.L)/N.plot.iw*(N.plot.hi-N.plot.lo),dec=N.s>=5?0:N.s>=.5?1:2,r=+v.toFixed(dec);N[drag]=r;$(drag==="a"?"nA":"nB").value=fmt(r,dec);renderNormal();});
  const end=()=>drag=null;el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);
  const Z=[{n:"Prova de estatística",x:8,m:6,s:1},{n:"Prova de farmacologia",x:75,m:60,s:10}];
  $("zIn").innerHTML=Z.map((z,i)=>`<div><div class="gname"><i style="background:${GC[i]}"></i><input id="zN${i}" value="${z.n}" aria-label="Nome ${i+1}"></div><div class="fields" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div class="inp"><label for="zX${i}">Valor</label><div class="box"><input id="zX${i}" inputmode="decimal" value="${fmt(z.x,0)}"></div></div><div class="inp"><label for="zM${i}">Média</label><div class="box"><input id="zM${i}" inputmode="decimal" value="${fmt(z.m,0)}"></div></div><div class="inp"><label for="zS${i}">DP</label><div class="box"><input id="zS${i}" inputmode="decimal" value="${fmt(z.s,0)}"></div></div></div></div>`).join("");
  $("zIn").addEventListener("input",renderZ);
  setN(NP[0]);
},()=>{renderNormal();renderZ();});
function renderNormal(){document.querySelectorAll("#lab-normal .nu").forEach(s=>s.textContent=N.u);$("nBw").hidden=N.mode==="below"||N.mode==="above";
  const {m,s}=N,el=$("nPlot"),H=220,W=box(el,H),L=12,Rr=12,T=16,iw=W-L-Rr,ih=H-T-34,lo=m-4*s,hi=m+4*s,X=v=>L+(v-lo)/(hi-lo)*iw,ym=npdf(m,m,s)*(N.tdf?1.02:1),Y=v=>T+ih-v/ym/1.08*ih;N.plot={lo,hi,L,iw};
  let a=N.a,b=N.b;if((N.mode==="between"||N.mode==="out")&&a>b)[a,b]=[b,a];const za=(a-m)/s,zb=(b-m)/s;
  const P=N.mode==="below"?Phi(za):N.mode==="above"?1-Phi(za):N.mode==="between"?Phi(zb)-Phi(za):Phi(za)+1-Phi(zb);
  const regs=N.mode==="below"?[[lo,a]]:N.mode==="above"?[[a,hi]]:N.mode==="between"?[[a,b]]:[[lo,a],[b,hi]];let sv="";
  if(N.rule)[3,2,1].forEach(k=>sv+=`<rect x="${X(m-k*s)}" y="${T}" width="${X(m+k*s)-X(m-k*s)}" height="${ih}" fill="var(--g3)" opacity=".08"/><text x="${X(m+k*s)-3}" y="${T+ih-4-(k-1)*14}" text-anchor="end" style="font-size:10.5px;fill:var(--g3)">±${k} DP: ${["68,3%","95,4%","99,7%"][k-1]}</text>`);
  regs.forEach(([p,q])=>{p=clamp(p,lo,hi);q=clamp(q,lo,hi);if(q<=p)return;let d=`M${X(p)},${Y(0)}`;for(let i=0;i<=80;i++){const v=p+(q-p)*i/80;d+=`L${X(v)},${Y(npdf(v,m,s))}`;}sv+=`<path d="${d}L${X(q)},${Y(0)}Z" fill="var(--accent)" opacity=".38"/>`;});
  let path="";for(let i=0;i<=240;i++){const v=lo+(hi-lo)*i/240;path+=(i?"L":"M")+X(v).toFixed(1)+","+Y(npdf(v,m,s)).toFixed(1);}sv+=`<path d="${path}" fill="none" stroke="var(--fg)" stroke-width="2"/>`;
  if(N.tdf){let p2="";for(let i=0;i<=240;i++){const v=lo+(hi-lo)*i/240;p2+=(i?"L":"M")+X(v).toFixed(1)+","+Y(tpdf((v-m)/s,N.tdf)/s).toFixed(1);}sv+=`<path d="${p2}" fill="none" stroke="var(--alt)" stroke-width="2" stroke-dasharray="6 4"/><text x="${W-14}" y="${T+10}" text-anchor="end" style="fill:var(--alt);font-size:11.5px">t com ${N.tdf} gl</text>`;}
  const hs=N.mode==="below"||N.mode==="above"?[["a",a]]:[["a",N.a],["b",N.b]];
  hs.forEach(([k,v])=>{if(v<lo||v>hi)return;sv+=`<g data-h="${k}" style="cursor:ew-resize"><line x1="${X(v)}" x2="${X(v)}" y1="${T-6}" y2="${T+ih}" stroke="var(--accent)" stroke-width="2.5"/><rect x="${X(v)-14}" y="${T+ih/2-14}" width="28" height="28" fill="transparent"/><circle cx="${X(v)}" cy="${T+ih*.45}" r="8" fill="var(--surface)" stroke="var(--accent)" stroke-width="2.5"/><text x="${X(v)}" y="${T+ih*.45+4}" text-anchor="middle" class="lbl" style="font-size:10px;fill:var(--accent)">${k}</text></g>`;});
  const ticks=[-3,-2,-1,0,1,2,3];sv+=xAxis(X,ticks.map(z=>m+z*s),T+ih,v=>auto(v),L,W-Rr);ticks.forEach(z=>sv+=`<text x="${X(m+z*s)}" y="${T+ih+30}" text-anchor="middle" style="font-size:10.5px">z ${z>0?"+":""}${fmt(z,0)}</text>`);
  el.setAttribute("viewBox",`0 0 ${W} ${H+14}`);el.innerHTML=sv;
  const lab=N.mode==="below"?`P(X < ${auto(a)})`:N.mode==="above"?`P(X > ${auto(a)})`:N.mode==="between"?`P(${auto(a)} < X < ${auto(b)})`:`P(X < ${auto(a)} ou X > ${auto(b)})`;
  $("nTiles").innerHTML=tile("z de a",fmt(za,2),`(${auto(a)} − ${auto(m)}) ÷ ${auto(s)}`)+(hs.length>1?tile("z de b",fmt(zb,2),`(${auto(b)} − ${auto(m)}) ÷ ${auto(s)}`):"")+tile("Probabilidade",pct(P,P<.01?2:1),lab,"acc big")+tile("Em 1.000 pessoas",`≈ ${fmt(Math.round(P*1000),0)}`,"frequência esperada");
  const k=Math.round(P*200);let ic="";for(let i=0;i<200;i++)ic+=`<i style="background:${i<k?"var(--accent)":"var(--dot)"}"></i>`;$("nIcons").innerHTML=ic;
  $("nF").innerHTML=`z = (x − μ) ÷ σ. ${lab} = ${N.mode==="below"?`Φ(${fmt(za,2)})`:N.mode==="above"?`1 − Φ(${fmt(za,2)})`:N.mode==="between"?`Φ(${fmt(zb,2)}) − Φ(${fmt(za,2)})`:`Φ(${fmt(za,2)}) + 1 − Φ(${fmt(zb,2)})`} = <b>${pct(P,2)}</b>. Φ é a área à esquerda na normal padrão.`;
  $("nTo").textContent=N.tdf?N.tdf:"desligado";
  const p=+$("nP").value/100,zp=zq(p);$("nPo").textContent=fmt(p*100,0);
  $("nPT").innerHTML=tile(`Percentil ${fmt(p*100,0)}`,auto(m+zp*s)+(N.u?" "+N.u:""),`μ + z × σ = ${auto(m)} + ${fmt(zp,3)} × ${auto(s)}`,"acc")+tile("z",fmt(zp,3),`${fmt(p*100,0)}% abaixo, ${fmt(100-p*100,0)}% acima`);}
function renderZ(){const g=[0,1].map(i=>({n:$("zN"+i).value,x:parse($("zX"+i).value),m:parse($("zM"+i).value),s:parse($("zS"+i).value)}));const el=$("zPlot");
  if(!g.every(q=>has(q.x)&&has(q.m)&&has(q.s)&&q.s>0)){el.innerHTML="";$("zTxt").textContent="Preencha valor, média e DP (maior que zero).";return;}
  const z=g.map(q=>(q.x-q.m)/q.s),H=120,W=box(el,H),L=12,iw=W-24,lim=Math.max(3.5,...z.map(Math.abs))+.3,X=v=>L+(v+lim)/(2*lim)*iw,Y=v=>80-v/0.4*66;let s="",p="";
  for(let i=0;i<=160;i++){const v=-lim+2*lim*i/160;p+=(i?"L":"M")+X(v)+","+Y(npdf(v));}s+=`<path d="${p}" fill="none" stroke="var(--tick)" stroke-width="1.6"/>`;
  z.forEach((v,i)=>s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${14+i*10}" y2="80" stroke="${GC[i]}" stroke-width="2.5"/><text x="${clamp(X(v),40,W-40)}" y="${10+i*10}" text-anchor="middle" class="lbl" style="font-size:11px;fill:${GC[i]}">z = ${fmt(v,2)}</text>`);
  s+=xAxis(X,nice(-lim,lim,6).filter(t=>t>=-lim&&t<=lim),82,v=>fmt(v,0),L,W-12);el.innerHTML=s;
  const big=Math.abs(z[0])>=Math.abs(z[1])?0:1;$("zTxt").innerHTML=`${esc(g[0].n)}: ${fmt(z[0],2)} DP ${z[0]>=0?"acima":"abaixo"} da média (percentil ${fmt(Phi(z[0])*100,0)}). ${esc(g[1].n)}: ${fmt(z[1],2)} DP (percentil ${fmt(Phi(z[1])*100,0)}). ${Math.abs(z[0]-z[1])<.05?"Os dois estão igualmente distantes da média.":`<b>${esc(g[big].n)}</b> está mais longe da média do seu grupo.`}`;}
