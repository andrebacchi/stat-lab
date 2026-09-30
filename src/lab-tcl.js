/* ===================== AMOSTRAS E TCL ===================== */
const TC={shape:1,n:5,means:[],last:[],pop:null};
const TSH=[{n:"Normal",g:()=>100+15*randn()},{n:"Assimétrica à direita",g:()=>5*Math.exp(0.7*randn())},{n:"Assimétrica à esquerda",g:()=>Math.max(20,97-9*Math.exp(0.6*randn()))},{n:"Bimodal",g:()=>Math.random()<.5?118+8*randn():155+10*randn()},{n:"Uniforme",g:()=>Math.random()*100},{n:"Sim/não (30%)",g:()=>Math.random()<.3?1:0}];
LAB("tcl","Inferencial","Amostras e TCL",`
<div class="intro"><span class="eyebrow">Inferencial</span><h2>Da amostra à população</h2><p>Sorteie amostras de uma população de qualquer formato, inclusive dos seus próprios dados, e veja as médias se organizarem numa curva normal.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Teorema Central do Limite</h3><button class="more-btn" data-learn="tcl">Saiba mais</button></div>
  <div class="chips" id="tcShape"></div>
  <div class="grid two" style="margin-top:12px;gap:12px">
   <div class="range"><label for="tcN">Tamanho de cada amostra (n)</label><output id="tcNo"></output><input type="range" id="tcN" min="1" max="100" value="5"></div>
   <div class="row" style="justify-content:flex-end"><button class="btn small" id="tc1">Sortear 1</button><button class="btn small" id="tc100">+100</button><button class="btn small primary" id="tc1000">+1.000</button><button class="btn small" id="tc0">Limpar</button></div>
  </div>
  <div class="sub">População e a última amostra</div><svg class="ch" id="tcPop" role="img" aria-label="População"></svg>
  <div class="sub">Médias das amostras sorteadas</div><svg class="ch" id="tcMeans" role="img" aria-label="Distribuição das médias"></svg>
  <div class="legend"><span><i style="background:var(--alt)"></i>normal prevista: média μ, erro padrão σ/√n</span></div>
  <div class="tiles" id="tcTiles" style="margin-top:12px"></div><div class="insight" id="tcTxt"></div></div>
 <div class="card"><div class="card-h"><h3>Desvio padrão × erro padrão</h3><button class="more-btn" data-learn="ep">Saiba mais</button></div>
  <div class="fields"><div class="inp"><label for="epM">Média</label><div class="box"><input id="epM" inputmode="decimal" value="128"></div></div><div class="inp"><label for="epS">DP</label><div class="box"><input id="epS" inputmode="decimal" value="15"></div></div></div>
  <div class="range" style="margin-top:10px"><label for="epN">n</label><output id="epNo"></output><input type="range" id="epN" min="2" max="1000" value="100"></div>
  <svg class="ch" id="epPlot" style="margin-top:8px" role="img" aria-label="DP versus EP"></svg><div class="f" id="epF"></div>
  <p class="note">O DP descreve os indivíduos e não muda com n. O EP descreve a precisão da média e diminui com √n: para cortá-lo pela metade, é preciso quadruplicar a amostra.</p></div>
 <div class="card"><div class="card-h"><h3>Tipos de amostragem</h3><button class="more-btn" data-learn="amostr">Saiba mais</button></div>
  <p class="lede">400 moradores; pontos escuros têm hipertensão (mais frequente à direita, onde moram os mais velhos). O ambulatório fica no canto esquerdo.</p>
  <div class="chips" id="aMeth"></div>
  <div class="range" style="margin-top:8px"><label for="aN">Tamanho da amostra</label><output id="aNo"></output><input type="range" id="aN" min="10" max="200" step="10" value="40"></div>
  <svg class="ch" id="aGrid" style="margin-top:10px" role="img" aria-label="População e amostra"></svg>
  <div class="row" style="margin-top:8px"><button class="btn small" id="aOne">Sortear amostra</button><button class="btn small primary" id="aRep">Repetir 500 vezes</button></div>
  <svg class="ch" id="aDist" style="margin-top:8px" role="img" aria-label="Estimativas repetidas"></svg><div class="insight" id="aTxt"></div></div>
</div>`,()=>{
  chips($("tcShape"),[...TSH.map(x=>x.n),"Meus dados (bancada)"],i=>{if(i===TSH.length&&!SHARED.bench){SHARED.bench={v:B.v.slice(),name:B.name||"Meus dados"};}TC.shape=i;TC.pop=null;TC.means=[];TC.last=[];renderTcl();},1);
  $("tcN").oninput=e=>{TC.n=+e.target.value;TC.means=[];TC.last=[];renderTcl();};
  $("tc1").onclick=()=>tclDraw(1);$("tc100").onclick=()=>tclDraw(100);$("tc1000").onclick=()=>tclDraw(1000);$("tc0").onclick=()=>{TC.means=[];TC.last=[];renderTcl();};
  ["epM","epS"].forEach(id=>$(id).oninput=renderEp);$("epN").oninput=renderEp;
  chips($("aMeth"),METH.map(m=>m[0]),i=>{AM.meth=i;AM.sel=METH[i][1]();renderAm();},0);
  $("aN").oninput=e=>{AM.n=+e.target.value;AM.reps={};AM.sel=METH[AM.meth][1]();renderAm();};
  $("aOne").onclick=()=>{AM.sel=METH[AM.meth][1]();renderAm();};
  $("aRep").onclick=()=>{AM.reps[AM.meth]=Array.from({length:500},()=>mean(METH[AM.meth][1]().map(i=>AM.pop[i].h)));renderAm();};
},()=>{renderTcl();renderEp();if(!AM.sel.length)AM.sel=METH[0][1]();renderAm();});
function tclUseBench(){const L=LABS.find(l=>l.id==="tcl");if(!L.ready)R.tcl();TC.shape=TSH.length;TC.pop=null;TC.means=[];TC.last=[];$("tcShape").querySelectorAll(".chip").forEach((c,i)=>c.classList.toggle("on",i===TSH.length));renderTcl();}
function tPop(){if(!TC.pop||TC.pop.shape!==TC.shape){let v;if(TC.shape===TSH.length){const b=SHARED.bench||{v:B.v};v=b.v.length?b.v.slice():[0];}else v=Array.from({length:20000},TSH[TC.shape].g);const so=Array.from(sorted(v));
  TC.pop={shape:TC.shape,v,mu:mean(v),sd:Math.sqrt(variance(v,true)),lo:so[Math.floor(so.length*.002)],hi:so[Math.min(so.length-1,Math.floor(so.length*.998))]};if(TC.pop.hi<=TC.pop.lo){TC.pop.lo-=1;TC.pop.hi+=1;}}return TC.pop;}
function tclDraw(k){const P=tPop();for(let j=0;j<k;j++){const s=Array.from({length:TC.n},()=>P.v[Math.floor(Math.random()*P.v.length)]);TC.last=s;TC.means.push(mean(s));}renderTcl();}
function renderTcl(){const P=tPop();$("tcNo").textContent=TC.n;const lo=P.lo,hi=P.hi,disc=TC.shape===5,bin=disc?2:undefined;
  const r=histo($("tcPop"),P.v,{h:150,min:lo,max:hi,cls:"bar2",bins:TC.shape===TSH.length?Math.min(30,Math.max(6,Math.round(Math.sqrt(P.v.length)))):bin,marks:[{v:P.mu,cls:"mean"}]});
  if(TC.last.length){const m=mean(TC.last);$("tcPop").insertAdjacentHTML("beforeend",TC.last.filter(x=>x>=lo&&x<=hi).slice(0,100).map(v=>`<circle cx="${r.X(v)}" cy="${150-44+(Math.random()-.5)*10}" r="4" fill="var(--alt)" opacity=".85"/>`).join("")+(m>=lo&&m<=hi?`<line x1="${r.X(m)}" x2="${r.X(m)}" y1="20" y2="${150-30}" stroke="var(--alt)" stroke-width="2.5"/><text x="${clamp(r.X(m),50,r.W-50)}" y="12" text-anchor="middle" class="lbl" style="fill:var(--alt);font-size:11px">média da amostra</text>`:""));}
  const se=P.sd/Math.sqrt(TC.n),M=TC.means;
  if(M.length)histo($("tcMeans"),M,{h:190,min:lo,max:hi,bins:60,curve:v=>npdf(v,P.mu,se),ymax:npdf(P.mu,P.mu,se)*0.9,marks:[{v:P.mu,cls:"mean"}]});else msg($("tcMeans"),190,"Sorteie amostras para ver as médias se acumularem");
  const obs=M.length>1?sd(M):NaN,nm_=TC.shape===TSH.length?(SHARED.bench&&SHARED.bench.name||"Meus dados"):TSH[TC.shape].n;
  $("tcTiles").innerHTML=tile("Amostras",fmt(M.length,0),`de n = ${TC.n}`)+tile("μ da população",auto(P.mu),`σ = ${auto(P.sd)}`,"acc")+tile("Média das médias",M.length?auto(mean(M)):"—")+tile("DP das médias",has(obs)?auto(obs):"—",`teórico σ/√n = ${auto(se)}`,"alt");
  $("tcTxt").innerHTML=(TC.shape===TSH.length?`População: <b>${esc(nm_)}</b> (${P.v.length} valores, sorteados com reposição). `:"")+(TC.n<5&&TC.shape!==0?`Com n = ${TC.n}, as médias ainda carregam o formato da população. Aumente n e veja a curva normal aparecer.`:`As médias se acumulam em torno de μ, com dispersão σ/√n = ${auto(se)}, ${TC.shape===0?"":"mesmo que a população não seja normal. "}Quanto maior n, mais estreita a curva.`)+(disc?" Com dados sim/não, a média amostral é uma proporção.":"");}
function renderEp(){const n=+$("epN").value,m=parse($("epM").value)??128,s=Math.abs(parse($("epS").value)??15),se=s/Math.sqrt(n);$("epNo").textContent=n;
  const el=$("epPlot"),H=110,W=box(el,H),L=110,iw=W-L-110,mx=s*1.05||1;let h="";
  [["DP (indivíduos)",s,"var(--muted)"],["EP (média)",se,"var(--accent)"]].forEach(([l,v,c],i)=>{const y=14+i*42;h+=`<text x="0" y="${y+15}" class="lbl">${l}</text><rect x="${L}" y="${y}" width="${Math.max(2,v/mx*iw)}" height="22" rx="4" fill="${c}" opacity=".8"/><text x="${L+v/mx*iw+6}" y="${y+15}" class="lbl">${auto(v)}</text>`;});
  el.innerHTML=h;$("epF").innerHTML=`EP = DP ÷ √n = ${auto(s)} ÷ √${n} = <b>${auto(se)}</b><br>IC 95% = ${auto(m)} ± 1,96 × ${auto(se)} = <b>${auto(m-1.96*se)} a ${auto(m+1.96*se)}</b>`;}
const AM={pop:[],meth:0,sel:[],reps:{},n:40};
(function(){const r=mulberry(7);for(let y=0;y<20;y++)for(let c=0;c<20;c++){const age=c/19,p=0.08+0.55*age+(((Math.floor(y/5)+Math.floor(c/5))%3===0)?0.1:0);AM.pop.push({r:y,c,h:r()<p?1:0,old:c>=10});}})();
AM.true=mean(AM.pop.map(p=>p.h));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const METH=[["Aleatória simples",()=>shuffle([...AM.pop.keys()]).slice(0,AM.n)],
 ["Estratificada",()=>{const y=shuffle(AM.pop.map((p,i)=>i).filter(i=>!AM.pop[i].old)),o=shuffle(AM.pop.map((p,i)=>i).filter(i=>AM.pop[i].old));return[...y.slice(0,AM.n/2),...o.slice(0,AM.n/2)];}],
 ["Conglomerados",()=>{const k=Math.max(1,Math.round(AM.n/25)),blocks=shuffle([...Array(16).keys()]).slice(0,k);return AM.pop.map((p,i)=>i).filter(i=>blocks.includes(Math.floor(AM.pop[i].r/5)*4+Math.floor(AM.pop[i].c/5)));}],
 ["Conveniência",()=>AM.pop.map((p,i)=>[i,p.c+Math.abs(p.r-10)*0.6+Math.random()*2]).sort((a,b)=>a[1]-b[1]).slice(0,AM.n).map(x=>x[0])]];
function renderAm(){$("aNo").textContent=AM.n;const el=$("aGrid"),W0=el.clientWidth||300,H=Math.min(280,Math.max(200,W0*0.62)),W=box(el,H),cs=Math.min((W-10)/20,(H-10)/20),x0=(W-cs*20)/2;let s=`<rect x="${x0-2}" y="2" width="${cs*20+4}" height="${cs*20+4}" fill="none" stroke="var(--line)"/>`;
  AM.pop.forEach((p,i)=>{const sel=AM.sel.includes(i);s+=`<circle cx="${x0+p.c*cs+cs/2}" cy="${4+p.r*cs+cs/2}" r="${cs*0.32}" fill="${p.h?"var(--fg)":"var(--dot)"}" ${sel?`stroke="var(--alt)" stroke-width="2.4"`:""}/>`;});
  if(AM.meth===2)for(let b=1;b<4;b++)s+=`<line x1="${x0+b*5*cs}" x2="${x0+b*5*cs}" y1="4" y2="${4+cs*20}" stroke="var(--tick)" stroke-dasharray="3 3"/><line x1="${x0}" x2="${x0+cs*20}" y1="${4+b*5*cs}" y2="${4+b*5*cs}" stroke="var(--tick)" stroke-dasharray="3 3"/>`;
  if(AM.meth===1)s+=`<line x1="${x0+10*cs}" x2="${x0+10*cs}" y1="4" y2="${4+cs*20}" stroke="var(--accent)" stroke-width="2"/>`;el.innerHTML=s;
  const est=AM.sel.length?mean(AM.sel.map(i=>AM.pop[i].h)):null,d=$("aDist"),HD=150,WD=box(d,HD),L=12,iw=WD-24,X=v=>L+v*iw;let h=`<line x1="${X(AM.true)}" x2="${X(AM.true)}" y1="8" y2="${HD-30}" stroke="var(--good)" stroke-width="2"/><text x="${X(AM.true)}" y="${HD-36}" text-anchor="middle" class="lbl" style="fill:var(--good);font-size:11px">verdadeiro ${pct(AM.true,0)}</text>`;
  METH.forEach((m,k)=>{const v=AM.reps[k];if(!v)return;const y=12+k*22,mu=mean(v),s2=sd(v),c=k===AM.meth?"var(--alt)":"var(--tick)";h+=`<text x="${L}" y="${y+4}" style="font-size:11px">${m[0]}</text><line x1="${X(clamp(mu-2*s2,0,1))}" x2="${X(clamp(mu+2*s2,0,1))}" y1="${y+10}" y2="${y+10}" stroke="${c}" stroke-width="3" stroke-linecap="round"/><circle cx="${X(mu)}" cy="${y+10}" r="5" fill="${c}"/>`;});
  h+=xAxis(X,[0,.2,.4,.6,.8,1],HD-30,v=>pct(v,0));d.innerHTML=h;const rep=AM.reps[AM.meth];
  $("aTxt").innerHTML=(est!=null?`Esta amostra (n = ${AM.sel.length}) estima <b>${pct(est,0)}</b> de hipertensos; o valor verdadeiro é ${pct(AM.true,0)}. `:"")+(rep?`Em 500 repetições, a média das estimativas foi ${pct(mean(rep),0)} (95% entre ${pct(mean(rep)-2*sd(rep),0)} e ${pct(mean(rep)+2*sd(rep),0)}). `+(AM.meth===3?"<b>Viés:</b> repetir ou aumentar a amostra não corrige a conveniência; ela erra sempre para o mesmo lado.":AM.meth===2?"Sem viés, mas mais variável: moradores de um mesmo bloco se parecem entre si.":AM.meth===1?"Sem viés e mais precisa: cada estrato está representado na proporção certa.":"Sem viés: em média, acerta o valor verdadeiro. Aumente a amostra e veja a faixa estreitar."):"Toque em “Repetir 500 vezes” para ver viés e precisão de cada método.");}
