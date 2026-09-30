/* ===================== TESTE DE HIPÓTESE ===================== */
const CH={truth:[],pick:[],rev:false,sim:null};
const HYP=[1,16,36,16,1].map(v=>v/70);
const DN={d:5,s:15,n:30,st:[]};
LAB("hip","Inferencial","Teste de hipótese",`
<div class="intro"><span class="eyebrow">Inferencial</span><h2>Valor de p, poder e a dança dos resultados</h2><p>Do chá de Fisher ao poder de um estudo: quão surpreendentes seriam estes dados se nada estivesse acontecendo, e com que frequência um estudo encontra um efeito que existe.</p></div>
<div class="grid two">
 <div class="card"><div class="card-h"><h3>A senhora e o chá</h3><button class="more-btn" data-learn="cha">Saiba mais</button></div>
  <p class="lede">Oito xícaras: em quatro, o leite foi posto primeiro. Escolha as quatro que você acha que são “leite primeiro” e revele. Ou deixe a senhora chutar mil vezes.</p>
  <svg class="ch" id="chaCups" role="img" aria-label="Xícaras"></svg>
  <div class="row" style="margin-top:8px"><button class="btn small primary" id="chaRev">Revelar</button><button class="btn small" id="chaNew">Novas xícaras</button><button class="btn small" id="chaSim">Chutar 1.000 vezes</button></div>
  <div class="insight" id="chaTxt"></div><svg class="ch" id="chaDist" style="margin-top:10px" role="img" aria-label="Acertos por acaso"></svg></div>
 <div class="card"><div class="card-h"><h3>A dança dos valores de p</h3><button class="more-btn" data-learn="danca">Saiba mais</button></div>
  <p class="lede">O mesmo estudo repetido várias vezes, com o mesmo efeito verdadeiro. Veja o quanto o p muda de uma repetição para outra.</p>
  <div class="fields"><div class="inp"><label for="dnD">Diferença verdadeira</label><div class="box"><input id="dnD" inputmode="decimal" value="5"></div></div><div class="inp"><label for="dnS">DP</label><div class="box"><input id="dnS" inputmode="decimal" value="15"></div></div><div class="inp"><label for="dnN">n por grupo</label><div class="box"><input id="dnN" inputmode="numeric" value="30"></div></div></div>
  <div class="row" style="margin-top:8px"><button class="btn small" id="dn1">+1 estudo</button><button class="btn small primary" id="dn25">25 estudos</button></div>
  <svg class="ch" id="dnPlot" style="margin-top:10px" role="img" aria-label="Estudos repetidos"></svg><div class="insight" id="dnTxt"></div></div>
 <div class="card wide"><div class="card-h"><h3>Erros tipo I e II, e poder</h3><button class="more-btn" data-learn="poder">Saiba mais</button></div>
  <p class="lede">Um ensaio compara dois grupos. Existe de fato uma diferença; o estudo vai conseguir detectá-la?</p>
  <div class="fields">
   <div class="inp"><label for="wD">Diferença verdadeira</label><div class="box"><input id="wD" inputmode="decimal" value="5"></div></div>
   <div class="inp"><label for="wS">DP</label><div class="box"><input id="wS" inputmode="decimal" value="15"></div></div>
   <div class="inp"><label for="wA">α</label><div class="box"><select id="wA"><option value="0.01">0,01</option><option value="0.05" selected>0,05</option><option value="0.10">0,10</option></select></div></div>
  </div>
  <div class="range" style="margin-top:10px"><label for="wN">n por grupo</label><output id="wNo"></output><input type="range" id="wN" min="5" max="600" value="100"></div>
  <svg class="ch" id="wCurves" style="margin-top:12px" role="img" aria-label="Distribuições sob H0 e H1"></svg>
  <div class="legend"><span><i style="background:var(--muted)"></i>se H₀ fosse verdadeira</span><span><i style="background:var(--accent)"></i>com o efeito verdadeiro</span><span><i style="background:var(--bad)"></i>α (falso positivo)</span><span><i style="background:var(--alt)"></i>β (falso negativo)</span></div>
  <div class="cols2" style="margin-top:10px"><div class="tiles" id="wTiles"></div><div><div class="sub">Poder conforme o tamanho da amostra</div><svg class="ch" id="wPow" role="img" aria-label="Curva de poder"></svg></div></div>
  <div class="insight" id="wTxt"></div></div>
</div>`,()=>{
  $("chaCups").addEventListener("click",e=>{const g=e.target.closest("[data-c]");if(!g||CH.rev)return;const i=+g.dataset.c;if(CH.pick.includes(i))CH.pick=CH.pick.filter(x=>x!==i);else if(CH.pick.length<4)CH.pick.push(i);renderCha();});
  $("chaRev").onclick=()=>{if(CH.pick.length<4){toast("Escolha 4 xícaras");return;}CH.rev=true;renderCha();};$("chaNew").onclick=()=>{newCups();renderCha();};
  $("chaSim").onclick=()=>{const c=[0,0,0,0,0];for(let j=0;j<1000;j++){const g=shuffle([...Array(8).keys()]).slice(0,4);c[g.filter(i=>CH.truth.includes(i)).length]++;}CH.sim=c;renderCha();};
  ["dnD","dnS","dnN"].forEach(id=>$(id).oninput=()=>{const d=parse($("dnD").value),s=parse($("dnS").value),n=parse($("dnN").value);if(has(d))DN.d=d;if(has(s)&&s>0)DN.s=s;if(has(n)&&n>=2)DN.n=Math.round(n);DN.st=[];renderDn();});
  $("dn1").onclick=()=>{DN.st.push(dnStudy());if(DN.st.length>40)DN.st.shift();renderDn();};$("dn25").onclick=()=>{DN.st=Array.from({length:25},dnStudy);renderDn();};
  ["wD","wS","wA"].forEach(id=>$(id).addEventListener("input",renderPow));$("wN").oninput=renderPow;
},()=>{if(!CH.truth.length)newCups();renderCha();if(!DN.st.length)DN.st=Array.from({length:25},dnStudy);renderDn();renderPow();});
function newCups(){CH.truth=shuffle([...Array(8).keys()]).slice(0,4);CH.pick=[];CH.rev=false;}
function renderCha(){const el=$("chaCups"),H=90,Wd=box(el,H),cw=Math.min(64,(Wd-10)/8);let s="";
  for(let i=0;i<8;i++){const x=(Wd-cw*8)/2+i*cw+cw/2,p=CH.pick.includes(i),t=CH.truth.includes(i);let fill=p?"var(--accent)":"var(--surface)",stroke=p?"var(--accent)":"var(--tick)";if(CH.rev)stroke=t?"var(--alt)":"var(--tick)";
    s+=`<g data-c="${i}" style="cursor:pointer"><rect x="${x-cw/2}" y="10" width="${cw}" height="70" fill="transparent"/><path d="M${x-cw*.32},18 L${x+cw*.32},18 L${x+cw*.26},58 Q${x},66 ${x-cw*.26},58 Z" fill="${fill}" fill-opacity="${p?.8:1}" stroke="${stroke}" stroke-width="${CH.rev&&t?3:1.6}"/><path d="M${x+cw*.3},28 q${cw*.18},4 0,20" fill="none" stroke="${stroke}" stroke-width="1.6"/>${CH.rev&&t?`<text x="${x}" y="82" text-anchor="middle" style="font-size:10.5px;fill:var(--alt);font-weight:600">leite 1º</text>`:""}</g>`;}
  el.innerHTML=s;
  if(CH.rev){const k=CH.pick.filter(i=>CH.truth.includes(i)).length,p=HYP.slice(k).reduce((a,b)=>a+b,0);$("chaTxt").innerHTML=`Você acertou <b>${k} de 4</b>. Se fosse puro chute, a probabilidade de acertar ${k} ou mais seria <b>${pct(p,1)}</b>: esse é o valor de p (unicaudal). ${k===4?"Acertar as quatro por acaso acontece em 1 de 70 tentativas (1,43%).":""}`;}
  else $("chaTxt").innerHTML=`Escolhidas: ${CH.pick.length} de 4. Toque nas xícaras para escolher.`;
  const d=$("chaDist"),HD=150,WD=box(d,HD),L=30,iw=WD-L-10,bw=iw/5,ih=HD-50,y=v=>14+ih-v/.6*ih;let h="";const sim=CH.sim;
  HYP.forEach((q,k)=>{const x=L+k*bw,obs=sim?sim[k]/1000:null;h+=`<rect x="${x+bw*.15}" y="${y(q)}" width="${bw*.3}" height="${14+ih-y(q)}" fill="var(--tick)"/>`;if(sim)h+=`<rect x="${x+bw*.5}" y="${y(obs)}" width="${bw*.3}" height="${14+ih-y(obs)}" fill="var(--accent)"/>`;h+=`<text x="${x+bw/2}" y="${HD-22}" text-anchor="middle">${k} acertos</text><text x="${x+bw/2}" y="${y(Math.max(q,obs||0))-5}" text-anchor="middle" style="font-size:11px">${pct(q,1)}</text>`;});
  h+=`<text x="${L}" y="10" style="font-size:11px">cinza: teórico · azul: ${sim?"1.000 chutes simulados":"toque em “Chutar 1.000 vezes”"}</text>`;d.innerHTML=h;}
function dnStudy(){const a=Array.from({length:DN.n},()=>DN.d+DN.s*randn()),b=Array.from({length:DN.n},()=>DN.s*randn());const r=tInd(a,b);return{e:r.diff,lo:r.lo,hi:r.hi,p:r.p};}
const pCol=p=>p<.001?"var(--g1)":p<.01?"var(--g3)":p<.05?"var(--good)":p<.1?"var(--alt)":"var(--bad)";
function renderDn(){const S=DN.st,el=$("dnPlot"),H=S.length*14+44,Wd=box(el,H),L=10,Rr=76,iw=Wd-L-Rr,all=S.flatMap(s=>[s.lo,s.hi]).concat([0,DN.d]),[a,b]=niceDom(Math.min(...all),Math.max(...all)),X=v=>L+(v-a)/(b-a)*iw;let s="";
  s+=`<line x1="${X(0)}" x2="${X(0)}" y1="4" y2="${H-30}" stroke="var(--bad)" stroke-dasharray="4 3"/><line x1="${X(DN.d)}" x2="${X(DN.d)}" y1="4" y2="${H-30}" stroke="var(--good)" stroke-width="2"/><text x="${X(DN.d)}" y="10" text-anchor="middle" style="font-size:10.5px;fill:var(--good)">verdade</text>`;
  S.forEach((q,i)=>{const y=20+i*14,c=pCol(q.p);s+=`<line x1="${X(q.lo)}" x2="${X(q.hi)}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${X(q.e)}" cy="${y}" r="3.5" fill="${c}"/><text x="${Wd-4}" y="${y+4}" text-anchor="end" style="font-size:10.5px;fill:${c};font-weight:600">p ${q.p<.001?"< 0,001":"= "+fmt(q.p,3)}</text>`;});
  s+=xAxis(X,nice(a,b,5).filter(t=>t>=a&&t<=b),H-28,v=>auto(v),L,L+iw);el.innerHTML=s;
  const sig=S.filter(q=>q.p<.05).length,se=DN.s*Math.sqrt(2/DN.n),pw=Phi(DN.d/se-1.96)+Phi(-DN.d/se-1.96),ps=S.map(q=>q.p);
  $("dnTxt").innerHTML=S.length?`${sig} de ${S.length} estudos deram p < 0,05 (poder teórico: ${pct(pw,0)}). Os valores de p foram de ${pv(Math.min(...ps))} a ${pv(Math.max(...ps))}, com os <b>mesmos</b> dados verdadeiros. Um único p diz pouco; o intervalo mostra a incerteza de forma mais honesta.`:"";}
function renderPow(){const d=parse($("wD").value),S=parse($("wS").value),n=+$("wN").value,a=+$("wA").value,el=$("wCurves");$("wNo").textContent=n;
  if(!(has(d)&&has(S)&&S>0)){el.innerHTML="";return;}
  const se=S*Math.sqrt(2/n),z=zq(1-a/2),c=z*se,pw=Phi(d/se-z)+Phi(-d/se-z),H=200,Wd=box(el,H),lo=Math.min(-4*se,d-4*se),hi=Math.max(4*se,d+4*se),L=10,iw=Wd-20,ih=H-44,ym=npdf(0,0,se),X=v=>L+(v-lo)/(hi-lo)*iw,Y=v=>14+ih-v/ym/1.08*ih;let s="";
  const area=(m,a1,b1,col,op)=>{a1=Math.max(a1,lo);b1=Math.min(b1,hi);if(b1<=a1)return"";let p=`M${X(a1)},${Y(0)}`;for(let i=0;i<=60;i++){const v=a1+(b1-a1)*i/60;p+=`L${X(v)},${Y(npdf(v,m,se))}`;}return `<path d="${p}L${X(b1)},${Y(0)}Z" fill="${col}" opacity="${op}"/>`;};
  s+=area(d,-c,c,"var(--alt)",.35)+area(0,c,hi,"var(--bad)",.5)+area(0,lo,-c,"var(--bad)",.5);
  const curve=(m,col)=>{let p="";for(let i=0;i<=200;i++){const v=lo+(hi-lo)*i/200;p+=(i?"L":"M")+X(v)+","+Y(npdf(v,m,se));}return `<path d="${p}" fill="none" stroke="${col}" stroke-width="2.2"/>`;};
  s+=curve(0,"var(--muted)")+curve(d,"var(--accent)");[-c,c].forEach(v=>s+=`<line x1="${X(v)}" x2="${X(v)}" y1="14" y2="${14+ih}" stroke="var(--bad)" stroke-dasharray="4 3"/>`);
  s+=`<text x="${X(0)}" y="12" text-anchor="middle" style="font-size:11px">H₀: diferença 0</text><text x="${X(d)}" y="${Math.max(24,Y(ym)-4)}" text-anchor="middle" style="font-size:11px;fill:var(--accent)">verdade: ${auto(d)}</text>`;
  s+=xAxis(X,nice(lo,hi,6).filter(v=>v>=lo&&v<=hi),14+ih,v=>auto(v));el.innerHTML=s;
  const powN=k=>{const s2=S*Math.sqrt(2/k);return Phi(d/s2-z)+Phi(-d/s2-z);},nfor=p=>{for(let k=2;k<200000;k=Math.ceil(k*1.02)+1)if(powN(k)>=p)return k;return NaN;};
  $("wTiles").innerHTML=tile("α · erro tipo I",pct(a,0),"falso positivo se H₀ verdadeira","bad")+tile("β · erro tipo II",pct(1-pw,0),"não detectar o efeito real","alt")+tile("Poder (1 − β)",pct(pw,0),"","acc")+tile("n para 80%",d?fmt(nfor(.8),0):"—","por grupo")+tile("n para 90%",d?fmt(nfor(.9),0):"—","por grupo");
  const pe=$("wPow"),HP=150,WP=box(pe,HP),LP=38,iwp=WP-LP-12,ihp=HP-40,nmax=600,Xp=k=>LP+(k-5)/(nmax-5)*iwp,Yp=v=>10+ihp-v*ihp;let ps=yGrid(Yp,[0,.5,.8,1],LP,WP-12,v=>pct(v,0)),pp="";
  for(let k=5;k<=nmax;k+=5)pp+=(k>5?"L":"M")+Xp(k)+","+Yp(powN(k));ps+=`<line x1="${LP}" x2="${WP-12}" y1="${Yp(.8)}" y2="${Yp(.8)}" stroke="var(--good)" stroke-dasharray="4 3"/><path d="${pp}" fill="none" stroke="var(--accent)" stroke-width="2.2"/><circle cx="${Xp(n)}" cy="${Yp(pw)}" r="5.5" fill="var(--alt)"/>`+xAxis(Xp,[5,100,200,300,400,500,600],10+ihp,v=>v,LP,WP-12);pe.innerHTML=ps;
  $("wTxt").innerHTML=pw<.8?`Com ${n} pacientes por grupo, o estudo tem só ${pct(pw,0)} de chance de detectar uma diferença real de ${auto(d)}. Um resultado “não significativo” aqui não demonstra ausência de efeito.`:`Com ${n} pacientes por grupo, o poder é de ${pct(pw,0)}: o estudo está adequado para detectar ${auto(d)}.`;}
