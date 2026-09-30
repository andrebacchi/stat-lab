/* ===================== BANCADA DE DADOS ===================== */
const gen=(seed,n,m,s,shape,dec=0)=>withSeed(seed,()=>Array.from({length:n},()=>+draw(m,s,shape).toFixed(dec)));
const BP=[
 {n:"Internação por pneumonia",u:"dias",v:[5,3,4,5,7,6,120]},
 {n:"Glicemia de jejum",u:"mg/dL",v:[92,88,95,101,97,90,99,94,96,93,105,89,98,91]},
 {n:"Pressão sistólica",u:"mmHg",v:gen(11,40,128,15,"norm")},
 {n:"Triglicerídeos",u:"mg/dL",v:gen(12,45,150,80,"skew").map(v=>Math.max(40,v))},
 {n:"Nota da prova (0–10)",u:"pontos",v:gen(13,36,7.2,1.8,"norm",1).map(v=>+clamp(10-Math.abs(10-v),0,10).toFixed(1))},
 {n:"Salários com os sócios",u:"R$ mil",v:[3.1,3.3,3.4,3.6,3.8,3.9,4,4.1,4.2,4.4,4.6,4.8,5,1000,5000]},
 {n:"Consultas no último ano",u:"consultas",v:withSeed(14,()=>Array.from({length:50},()=>{let k=0,p=Math.exp(-2.4),s=p,u=RNG();while(u>s){k++;p*=2.4/k;s+=p;}return k;}))},
 {n:"Tempo até o atendimento",u:"min",v:[12,15,16,18,20,21,22,24,25,27,30,32,34,35,80]},
 {n:"PAS: normotensos + hipertensos",u:"mmHg",v:withSeed(15,()=>Array.from({length:60},(_,i)=>Math.round(i<30?118+8*randn():158+10*randn())))},
 {n:"Peso ao nascer",u:"g",v:gen(16,50,3300,500,"norm")},
];
const B={v:[...BP[0].v],u:BP[0].u,name:BP[0].n,undo:[],qm:"exc",orig:false,mode:"move",bins:0,fit:true,lines:true,sdb:false,guess:false,checked:false,score:[0,0]};
function bPush(){B.undo.push(B.v.slice());if(B.undo.length>40)B.undo.shift();}
function bSet(v,keepGuess){B.v=v;if(!keepGuess)B.checked=false;renderBench();}
LAB("bancada","Descritiva","Bancada de dados",`
<div class="intro"><span class="eyebrow">Descritiva · laboratório livre</span><h2>Bancada de dados</h2><p>Junte tudo o que foi visto nas telas anteriores com os seus próprios dados. Digite ou cole qualquer sequência de números, ou comece por um exemplo. Arraste pontos, acrescente valores extremos, transforme os dados e veja o que acontece com cada medida.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Dados</h3><button class="more-btn" data-learn="bancada">Saiba mais</button></div>
  <div class="chips" id="bPre"></div>
  <div class="fields" style="margin-top:10px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">
   <div class="inp"><label for="bName">Variável <small>opcional</small></label><div class="box"><input id="bName" style="font-size:15px;font-weight:500"></div></div>
   <div class="inp"><label for="bUnit">Unidade <small>opcional</small></label><div class="box"><input id="bUnit" style="font-size:15px;font-weight:500"></div></div>
  </div>
  <div style="margin-top:10px"><textarea class="data" id="bData" aria-label="Valores separados por espaço, ponto e vírgula ou linha"></textarea><p class="note" style="margin-top:4px">Separe por espaço, ponto e vírgula ou quebra de linha. Vírgula é decimal. Dá para colar uma coluna do Excel.</p></div>
  <div class="sub">Experimentos</div>
  <div class="tools" id="bTools">
   <button class="tool" data-t="hi">+ valor extremo alto</button><button class="tool" data-t="lo">+ valor extremo baixo</button><button class="tool" data-t="rmout">Remover outliers</button><button class="tool" data-t="dup">Duplicar os dados</button><button class="tool" data-t="sort">Ordenar</button><button class="tool" data-t="log">Logaritmo</button><button class="tool" data-t="undo">Desfazer</button><button class="tool" data-t="clear">Limpar</button>
  </div>
  <div class="row" style="margin-top:8px"><div class="box" style="width:110px;min-height:36px"><input id="bK" inputmode="decimal" value="10" aria-label="Constante k" style="font-size:15px"></div><button class="tool" data-t="add">Somar k a todos</button><button class="tool" data-t="mul">Multiplicar todos por k</button></div>
  <details class="fold" id="bGenF"><summary>Gerar dados aleatórios</summary>
   <div class="chips" id="bShape" style="margin-top:8px"></div>
   <div class="fields" style="margin-top:10px">
    <div class="inp"><label for="bgN">n</label><div class="box"><input id="bgN" inputmode="numeric" value="50"></div></div>
    <div class="inp"><label for="bgM">Média</label><div class="box"><input id="bgM" inputmode="decimal" value="100"></div></div>
    <div class="inp"><label for="bgS">Desvio padrão</label><div class="box"><input id="bgS" inputmode="decimal" value="15"></div></div>
    <div class="inp"><label for="bgD">Casas decimais</label><div class="box"><input id="bgD" inputmode="numeric" value="0"></div></div>
   </div><div class="row" style="margin-top:8px"><button class="btn small primary" id="bGen">Gerar</button></div>
  </details>
 </div>
 <div class="card wide"><div class="card-h"><h3>Ver os dados</h3><button class="more-btn" data-learn="box">Saiba mais</button></div>
  <div class="row" style="justify-content:space-between">
   <div class="row" style="gap:8px"><span class="mini">No gráfico:</span><div class="seg" id="bMode" aria-label="Ação ao tocar no gráfico"><button data-v="move">Arrastar</button><button data-v="add">Adicionar</button><button data-v="del">Remover</button></div></div>
   <label class="toggle"><input type="checkbox" id="bGuess"> Estime antes de ver</label>
  </div>
  <svg class="ch" id="bDots" style="margin-top:12px;touch-action:none" role="img" aria-label="Gráfico de pontos com boxplot"></svg>
  <div class="legend" id="bLeg"><span><i style="background:var(--accent)"></i>média e IC 95%</span><span><i class="dash"></i>mediana</span><span><i style="background:var(--fg);height:10px;width:16px;border:1.5px solid var(--fg);background:transparent"></i>boxplot</span><span><i style="background:var(--bad);width:8px;height:8px;border-radius:50%"></i>outlier</span></div>
  <div class="row" style="margin-top:10px;gap:14px">
   <label class="toggle"><input type="checkbox" id="bLines" checked> Linhas de média e mediana</label>
   <label class="toggle"><input type="checkbox" id="bSdb"> Faixas de ±1, 2 e 3 DP</label>
   <label class="toggle"><input type="checkbox" id="bOrig"> Boxplot original (sem outliers)</label>
  </div>
  <div id="bGuessBox" hidden class="guess"></div>
  <div id="bStats">
   <div class="sub">Resumo</div><div class="stack" id="bTiles"></div>
   <div class="insight" id="bRec"></div>
  </div>
 </div>
 <div class="card"><div class="card-h"><h3>Histograma</h3><button class="more-btn" data-learn="dist">Saiba mais</button></div>
  <div class="range"><label for="bBins">Número de classes</label><output id="bBinsO"></output><input type="range" id="bBins" min="2" max="40" value="8"></div>
  <label class="toggle"><input type="checkbox" id="bFit" checked> Curva normal com a mesma média e DP</label>
  <svg class="ch" id="bHist" style="margin-top:8px" role="img" aria-label="Histograma"></svg></div>
 <div class="card"><div class="card-h"><h3>É normal? Gráfico Q-Q</h3><button class="more-btn" data-learn="qq">Saiba mais</button></div>
  <p class="lede">Se os dados forem normais, os pontos seguem a linha.</p>
  <svg class="ch" id="bQQ" role="img" aria-label="Gráfico Q-Q"></svg><div class="tiles" id="bSW" style="margin-top:10px"></div></div>
 <div class="card wide"><div class="card-h"><h3>Passo a passo</h3><button class="more-btn" data-learn="dp">Saiba mais</button></div>
  <div class="row" style="justify-content:space-between"><span class="mini">Método dos quartis</span><div class="seg" id="bQm"><button data-v="exc">Sem a mediana</button><button data-v="inc">Com a mediana</button><button data-v="t7">Interpolação</button></div></div>
  <div id="bSteps" style="margin-top:10px"></div>
  <div class="row" style="margin-top:14px"><button class="btn small" id="bToTest">Testar estes dados no laboratório de testes</button><button class="btn small" id="bToTcl">Usar como população no TCL</button></div>
 </div>
</div>`,()=>{
  chips($("bPre"),BP.map(p=>p.n),i=>{bPush();B.u=BP[i].u;B.name=BP[i].n;$("bName").value=B.name;$("bUnit").value=B.u;B.bins=0;bSet([...BP[i].v]);},BP.findIndex(p=>p.v.length===B.v.length&&p.v.every((x,j)=>x===B.v[j])));
  $("bName").value=B.name;$("bUnit").value=B.u;
  $("bName").addEventListener("input",e=>{B.name=e.target.value;renderBench();});$("bUnit").addEventListener("input",e=>{B.u=e.target.value;renderBench();});
  $("bData").addEventListener("input",e=>{B.v=parseList(e.target.value);B.checked=false;renderBench();});
  $("bData").addEventListener("focus",()=>bPush());
  $("bTools").addEventListener("click",e=>{const t=e.target.closest("[data-t]");if(t)bTool(t.dataset.t);});
  document.querySelectorAll('#lab-bancada .tool[data-t="add"],#lab-bancada .tool[data-t="mul"]').forEach(b=>b.onclick=()=>bTool(b.dataset.t));
  const SH=[["norm","Normal"],["skew","Assimétrica à direita"],["out","Normal com outliers"],["unif","Uniforme"],["bimod","Bimodal"]];let shp="norm";
  chips($("bShape"),SH.map(s=>s[1]),i=>shp=SH[i][0],0);
  $("bGen").onclick=()=>{const n=clamp(Math.round(parse($("bgN").value)||50),2,5000),m=parse($("bgM").value)??100,s=Math.abs(parse($("bgS").value)??15),d=clamp(Math.round(parse($("bgD").value)??0),0,4);bPush();
    const v=Array.from({length:n},(_,i)=>shp==="bimod"?(i%2?m-s:m+s)+s*.5*randn():draw(m,s,shp));B.name="Dados gerados";$("bName").value=B.name;B.bins=0;bSet(v.map(x=>+x.toFixed(d)));$("bPre").querySelectorAll(".chip").forEach(c=>c.classList.remove("on"));};
  segBind($("bMode"),"move",v=>B.mode=v);segBind($("bQm"),"exc",v=>{B.qm=v;renderBench();});
  $("bLines").onchange=e=>{B.lines=e.target.checked;renderBench();};$("bSdb").onchange=e=>{B.sdb=e.target.checked;renderBench();};$("bOrig").onchange=e=>{B.orig=e.target.checked;renderBench();};
  $("bFit").onchange=e=>{B.fit=e.target.checked;renderBench();};$("bBins").oninput=e=>{B.bins=+e.target.value;renderBench();};
  $("bGuess").onchange=e=>{B.guess=e.target.checked;B.checked=false;$("bGuessBox").innerHTML="";renderBench();};
  $("bToTest").onclick=()=>{if(B.v.length<3){toast("Precisa de pelo menos 3 valores");return;}openTestWith("t1",{one:{v:B.v.slice(),name:B.name||"Dados",mu0:null}});};
  $("bToTcl").onclick=()=>{if(B.v.length<5){toast("Precisa de pelo menos 5 valores");return;}SHARED.bench={v:B.v.slice(),name:B.name||"Meus dados"};go("tcl");tclUseBench();window.scrollTo({top:0});};
  // interação com o gráfico
  const el=$("bDots");let drag=null;
  el.addEventListener("pointerdown",e=>{if(!B.plot)return;const c=e.target.closest("circle[data-i]"),q=svgPt(el,e);
    if(B.mode==="move"&&c){bPush();drag=+c.dataset.i;el.setPointerCapture(e.pointerId);e.preventDefault();}
    else if(B.mode==="del"&&c){bPush();B.v.splice(+c.dataset.i,1);bSet(B.v);}
    else if(B.mode==="add"){const P=B.plot,v=P.lo+(q.x-P.L)/P.iw*(P.hi-P.lo);bPush();B.v.push(roundLike(v));bSet(B.v);}});
  el.addEventListener("pointermove",e=>{if(drag==null)return;const P=B.plot,q=svgPt(el,e);B.v[drag]=roundLike(P.lo+(q.x-P.L)/P.iw*(P.hi-P.lo));B.fixDom=[P.lo,P.hi];renderBench();});
  const end=()=>{if(drag!=null){drag=null;B.fixDom=null;renderBench();}};el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);
  $("bGuessBox").addEventListener("click",e=>{if(e.target.id==="gCheck"){B.checked=true;renderBench();}if(e.target.id==="gAgain"){B.checked=false;$("bGuessBox").innerHTML="";bSet(B.v);}});
},()=>renderBench());
function roundLike(v){const a=B.v,dec=Math.max(0,...a.map(x=>{const s=String(x);return s.includes(".")?s.split(".")[1].length:0;}));return +v.toFixed(Math.min(dec,3));}
function bTool(t){const v=B.v;if(t!=="undo")bPush();const k=parse($("bK").value);
  if(t==="hi"&&v.length){const s=v.length>1?sd(v):Math.abs(v[0])||1;v.push(roundLike(Math.max(...v)+Math.max(4*s,Math.abs(Math.max(...v))*.5)));}
  if(t==="lo"&&v.length){const s=v.length>1?sd(v):Math.abs(v[0])||1;v.push(roundLike(Math.min(...v)-Math.max(4*s,Math.abs(Math.min(...v))*.5)));}
  if(t==="rmout"&&v.length>=4){const q=quartiles(v,B.qm),i=q.q3-q.q1,a=q.q1-1.5*i,b=q.q3+1.5*i,r=v.filter(x=>x>=a&&x<=b);if(r.length===v.length)toast("Não há outliers pelo critério de Tukey");B.v=r;}
  if(t==="dup")B.v=[...v,...v];
  if(t==="sort")B.v=Array.from(sorted(v));
  if(t==="log"){if(v.some(x=>x<=0)){toast("Logaritmo só funciona com valores maiores que zero");B.undo.pop();}else{B.v=v.map(x=>+Math.log10(x).toFixed(3));B.u=B.u?`log₁₀ (${B.u})`:"log₁₀";$("bUnit").value=B.u;}}
  if(t==="add"&&has(k))B.v=v.map(x=>+(x+k).toFixed(6));
  if(t==="mul"&&has(k))B.v=v.map(x=>+(x*k).toFixed(6));
  if(t==="clear")B.v=[];
  if(t==="undo"){if(!B.undo.length){toast("Nada para desfazer");return;}B.v=B.undo.pop();}
  bSet(B.v);}
function bStats(v){const n=v.length,m=mean(v),md=median(v),mo=modes(v),s=n>1?sd(v):NaN,q=quartiles(v,B.qm),iqr=q.q3-q.q1,mn=Math.min(...v),mx=Math.max(...v),lf=q.q1-1.5*iqr,uf=q.q3+1.5*iqr,out=v.filter(x=>x<lf||x>uf),se=s/Math.sqrt(n),tc=n>1?tq(.975,n-1):NaN,sw=n>=3&&n<=5000?shapiro(v):null;
  return{n,m,md,mo,s,var:s*s,vp:variance(v,true),q,iqr,mn,mx,lf,uf,out,se,lo:m-tc*se,hi:m+tc*se,cv:s/Math.abs(m),sk:n>2?skew(v):NaN,ku:n>3?kurt(v):NaN,sw,tc};}
function renderBench(){const v=B.v,u=B.u?" "+B.u:"";if(document.activeElement!==$("bData"))$("bData").value=listTxt(v);
  const hide=B.guess&&!B.checked;$("bStats").hidden=hide;$("bGuessBox").hidden=!B.guess;$("bLeg").hidden=hide;
  if(v.length<1){msg($("bDots"),120,"Digite valores ou escolha um exemplo");$("bHist").innerHTML="";$("bQQ").innerHTML="";$("bTiles").innerHTML="";$("bSW").innerHTML="";$("bRec").innerHTML="";$("bSteps").innerHTML="";B.plot=null;return;}
  const S=bStats(v);
  // gráfico de pontos
  const el=$("bDots");B.plot=dotRows(el,[{v,color:"var(--accent)"}],{box:!hide&&v.length>=3,meanCI:!hide,orig:B.orig,qm:B.qm,drag:B.mode==="move",dom:B.fixDom,rowH:120});
  if(B.plot&&!hide){const P=B.plot,H=+el.viewBox.baseVal.height,y0=14,y1=H-34;let s="";
    if(B.sdb&&v.length>1)[3,2,1].forEach(k=>{const a=Math.max(P.lo,S.m-k*S.s),b=Math.min(P.hi,S.m+k*S.s);s+=`<rect x="${P.X(a)}" y="${y0}" width="${Math.max(0,P.X(b)-P.X(a))}" height="${y1-y0}" fill="var(--accent)" opacity=".07"/>`;});
    if(B.lines){s+=`<line x1="${P.X(S.m)}" x2="${P.X(S.m)}" y1="${y0}" y2="${y1}" stroke="var(--accent)" stroke-width="2"/><line x1="${P.X(S.md)}" x2="${P.X(S.md)}" y1="${y0}" y2="${y1}" stroke="var(--alt)" stroke-width="2" stroke-dasharray="6 4"/>`;
      const close=Math.abs(P.X(S.m)-P.X(S.md))<60;s+=`<text x="${clamp(P.X(S.m),28,P.W-28)}" y="${y0-2}" text-anchor="middle" class="lbl" style="fill:var(--accent);font-size:11px">média</text><text x="${clamp(P.X(S.md),30,P.W-30)}" y="${close?y1-4:y0-2}" text-anchor="middle" class="lbl" style="fill:var(--alt);font-size:11px">mediana</text>`;}
    el.insertAdjacentHTML("afterbegin",s);}
  // histograma
  const nb=B.bins||clamp(Math.round(1+Math.log2(v.length)),4,30);$("bBins").value=nb;$("bBinsO").textContent=nb;
  if(v.length>=2&&S.mx>S.mn)histo($("bHist"),v,{h:210,bins:nb,min:S.mn,max:S.mx,curve:B.fit&&S.s>0?(x=>npdf(x,S.m,S.s)):null,marks:hide?[]:[{v:S.m,cls:"mean",t:"média",tstyle:"fill:var(--accent)"},{v:S.md,cls:"med"}]});else msg($("bHist"),150,"Poucos valores diferentes");
  qqplot($("bQQ"),v);
  $("bSW").innerHTML=S.sw?tile("Shapiro-Wilk",`W = ${fmt(S.sw.W,3)}`,`${pvEq(S.sw.p)}`,S.sw.p<.05?"bad":"good")+tile("Assimetria",fmt(S.sk,2),Math.abs(S.sk)<.5?"≈ simétrica":S.sk>0?"cauda à direita":"cauda à esquerda")+tile("Curtose",has(S.ku)?fmt(S.ku,2):"—","0 na normal"):`<p class="note">São necessários pelo menos 3 valores diferentes.</p>`;
  // tiles
  const T=(l,x,s,c)=>tile(l,x,s,c);
  $("bTiles").innerHTML=`<div class="tgrp"><span class="eyebrow">Centro</span><div class="tiles">${T("Média",auto(S.m)+u,"soma ÷ n","acc")}${T("Mediana",auto(S.md)+u,"valor do meio","alt")}${T("Moda",S.mo.length?(S.mo.length>3?S.mo.length+" modas":S.mo.map(auto).join(" · ")):"—",S.mo.length?"mais frequente":"nenhum valor se repete","good")}${T("n",fmt(S.n,0),"observações")}</div></div>
   <div class="tgrp"><span class="eyebrow">Dispersão</span><div class="tiles">${T("Desvio padrão",auto(S.s),"amostral (n − 1)","acc")}${T("Variância",auto(S.var),"DP²")}${T("Amplitude",auto(S.mx-S.mn),`${auto(S.mn)} a ${auto(S.mx)}`)}${T("Q1 · Q3",`${auto(S.q.q1)} · ${auto(S.q.q3)}`,"25% · 75%")}${T("IIQ",auto(S.iqr),"Q3 − Q1")}${T("CV",has(S.cv)?fmt(S.cv*100,1)+"%":"—","DP ÷ média")}${T("Outliers",S.out.length?(S.out.length>4?S.out.length+" valores":S.out.map(auto).join(" · ")):"nenhum",`fora de ${auto(S.lf)} a ${auto(S.uf)}`,S.out.length?"bad":"")}</div></div>
   <div class="tgrp"><span class="eyebrow">Precisão da média</span><div class="tiles">${T("Erro padrão",auto(S.se),"DP ÷ √n")}${T("IC 95% da média",has(S.lo)?`${auto(S.lo)} a ${auto(S.hi)}`:"—","média ± t × EP")}</div></div>`;
  // recomendação
  let rec="";if(v.length>=3&&S.s>0){const nonN=(S.sw&&S.sw.p<.05)||Math.abs(S.sk)>1,dirTxt=S.sk>0?"à direita":"à esquerda",nm=B.name?B.name.toLowerCase():"a variável";
    rec=nonN?`<b>Distribuição assimétrica ${dirTxt}</b> (assimetria ${fmt(S.sk,2)}${S.sw?`; Shapiro-Wilk ${pvEq(S.sw.p)}`:""}). A média (${auto(S.m)}) é puxada pela cauda; prefira a mediana e o intervalo interquartil.`:`<b>Distribuição aproximadamente simétrica</b> (assimetria ${fmt(S.sk,2)}${S.sw?`; Shapiro-Wilk ${pvEq(S.sw.p)}`:""}). Média e desvio padrão resumem bem os dados.`;
    const sent=nonN?`A mediana de ${nm} foi ${auto(S.md)}${u} (IIQ ${auto(S.q.q1)}–${auto(S.q.q3)}; n = ${S.n}).`:`A média de ${nm} foi ${auto(S.m)}${u} (DP ${auto(S.s)}; n = ${S.n}).`;
    rec+=`<div class="relato" style="margin-top:8px"><span class="eyebrow">Como descrever</span><div id="bSent">${sent}</div><div class="row"><button class="btn small" id="bCopy">Copiar</button></div></div>`+(S.n<15?`<p class="note">Com poucos dados, o teste de Shapiro-Wilk tem pouco poder. Olhe também os gráficos.</p>`:"");}
  $("bRec").innerHTML=rec;const cp=$("bCopy");if(cp)cp.onclick=()=>copyText($("bSent").textContent);
  // estimativa
  if(B.guess){const gb=$("bGuessBox");if(!gb.innerHTML)gb.innerHTML=`<div class="sub">Olhe o gráfico e estime</div><div class="fields">${["Média","Mediana","Desvio padrão"].map((l,i)=>`<div class="inp"><label for="gg${i}">${l}</label><div class="box"><input id="gg${i}" inputmode="decimal"></div></div>`).join("")}</div><div class="row" style="margin-top:8px"><button class="btn small primary" id="gCheck">Conferir</button><button class="btn small" id="gAgain">Novo palpite</button></div><div id="gRes"></div>`;
    if(B.checked){const exp=[S.m,S.md,S.s],nm=["Média","Mediana","Desvio padrão"],rng=S.mx-S.mn||1;let hit=0;const rows=exp.map((x,i)=>{const g=parse($("gg"+i).value),err=has(g)?Math.abs(g-x)/rng:NaN,ok=err<=.05;if(ok)hit++;return `<tr><td>${nm[i]}</td><td>${has(g)?auto(g):"—"}</td><td>${auto(x)}</td><td class="${ok?"ok":"no"}">${has(err)?(ok?"✓ ":"")+"erro "+pct(err,0)+" da amplitude":"—"}</td></tr>`;});
      if(!$("gRes").dataset.done){B.score[0]+=hit;B.score[1]+=3;$("gRes").dataset.done="1";}
      $("gRes").innerHTML=`<div class="tw" style="margin-top:10px"><table class="t"><thead><tr><th>Medida</th><th>Palpite</th><th>Valor</th><th>Erro</th></tr></thead><tbody>${rows.join("")}</tbody></table></div><p class="score">Acertos na sessão (até 5% da amplitude): ${B.score[0]} de ${B.score[1]}</p>`;}}
  // passo a passo
  const n=v.length,s2=Array.from(sorted(v)),mid=n%2?[(n-1)/2]:[n/2-1,n/2],short=n>40,show=a=>short?a.slice(0,12).map(auto).join("  ")+"  …  "+a.slice(-4).map(auto).join("  "):a.map(auto).join("  ");
  const dev=v.map(x=>x-S.m),ss=sum(dev.map(d=>d*d));
  let st=`<span class="eyebrow">Média</span><div class="f">(${short?v.slice(0,8).map(auto).join(" + ")+" + … ":v.map(auto).join(" + ")}) ÷ ${n} = ${auto(sum(v))} ÷ ${n} = <b>${auto(S.m)}</b></div>
   <span class="eyebrow">Mediana: ordene (rol) e pegue o valor do meio</span><div class="f">${short?show(s2):s2.map((x,i)=>mid.includes(i)?`<b style="color:var(--alt)">[${auto(x)}]</b>`:auto(x)).join("  ")}${n%2?` → posição ${(n+1)/2}: <b>${auto(S.md)}</b>`:` → (${auto(s2[mid[0]])} + ${auto(s2[mid[1]])}) ÷ 2 = <b>${auto(S.md)}</b>`}</div>`;
  if(n>=3){st+=`<span class="eyebrow">Quartis (${B.qm==="t7"?"interpolação":B.qm==="inc"?"metades incluindo a mediana":"metades sem a mediana"})</span><div class="f">`+(B.qm==="t7"?`Q1 = valor na posição 1 + 0,25 × (n − 1) = ${fmt(1+.25*(n-1),2)} → <b>${auto(S.q.q1)}</b> · Q3 = posição 1 + 0,75 × (n − 1) = ${fmt(1+.75*(n-1),2)} → <b>${auto(S.q.q3)}</b>`:`metade inferior: ${show(S.q.lo)} → Q1 = <b>${auto(S.q.q1)}</b><br>metade superior: ${show(S.q.hi)} → Q3 = <b>${auto(S.q.q3)}</b>`)+`<br>IIQ = ${auto(S.q.q3)} − ${auto(S.q.q1)} = <b>${auto(S.iqr)}</b> · limites de Tukey: ${auto(S.q.q1)} − 1,5 × ${auto(S.iqr)} = ${auto(S.lf)} e ${auto(S.q.q3)} + 1,5 × ${auto(S.iqr)} = ${auto(S.uf)}</div>`;
   st+=`<span class="eyebrow">Variância e desvio padrão</span><div class="tw"><table class="t"><thead><tr><th>Valor</th><th>Desvio (x − média)</th><th>Desvio²</th></tr></thead><tbody>${v.slice(0,20).map((x,i)=>`<tr><td>${auto(x)}</td><td>${auto(dev[i])}</td><td>${auto(dev[i]**2)}</td></tr>`).join("")}${n>20?`<tr><td colspan="3" style="text-align:center">… mais ${n-20} valores</td></tr>`:""}<tr class="sum"><td>Soma</td><td>${auto(Math.abs(sum(dev))<1e-9?0:sum(dev))}</td><td>${auto(ss)}</td></tr></tbody></table></div>
   <div class="f">Variância = ${auto(ss)} ÷ (${n} − 1) = <b>${auto(S.var)}</b> · DP = √${auto(S.var)} = <b>${auto(S.s)}</b><br>A soma dos desvios é sempre zero; por isso eles são elevados ao quadrado. Dividindo por n (população): ${auto(S.vp)}.</div>`;}
  $("bSteps").innerHTML=st;if(typeof saveState==="function")saveState();}
