/* ===================== LABORATÓRIO DE TESTES: interface ===================== */
const TD={},SIMP={},DEFP={w1:1,mw:1,wsr:1,kw:1,fr:1,spear:2,fisher:2,sw:1,lin:1,chi:0};
const FAMS=["Uma amostra","Dois grupos independentes","Dois momentos (pareados)","Três ou mais grupos","Três ou mais momentos","Associação","Previsão","Sobrevida"];
const dec=a=>Math.min(3,Math.max(0,...a.map(x=>{const s=String(x);return s.includes(".")&&!s.includes("e")?s.split(".")[1].length:0;})));
LAB("testes","Inferencial","Laboratório de testes",`
<div class="intro"><span class="eyebrow">Inferencial</span><h2>Laboratório de testes</h2><p>Escolha um teste, use um exemplo ou digite seus dados e veja gráficos, resultado e como relatar. No fim, simule mil estudos para ver o poder do teste e o que acontece quando não há efeito.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>Escolha o teste</h3><button class="more-btn" data-learn="teste">Saiba mais</button></div>
  <div class="tpick" id="tPick"></div>
  <p class="note" style="margin-top:12px">Não sabe qual usar? <a href="#guia" class="lnk">Abra o guia “Qual teste usar?”</a></p>
 </div>
 <div class="card wide"><div class="bench-h"><div><span class="eyebrow" id="tFam"></span><h3 id="tName"></h3></div><div class="row"><div class="seg" id="tMode" aria-label="Nível de detalhe"><button data-v="ess">Essencial</button><button data-v="full">Completo</button></div><button class="btn small" id="tAlt" hidden></button><button class="btn small" data-gloss>Glossário</button><button class="more-btn" id="tLearn">Saiba mais sobre este teste</button></div></div>
  <div class="sub">Exemplos</div><div class="chips" id="tPre"></div>
  <div class="sub">Dados</div><div id="tIn"></div>
  <div class="row" style="margin-top:12px;gap:14px;justify-content:space-between"><div class="row" id="tOpt"></div><label class="twin">α <select id="tAlpha" class="tool"><option value="0.01">0,01</option><option value="0.05" selected>0,05</option><option value="0.10">0,10</option></select></label></div>
 </div>
 <div class="card wide"><div class="card-h"><h3>Resultado</h3></div>
  <div id="tErr"></div><div id="tMain"></div>
  <div class="cols2"><div id="tA"></div><div id="tB"></div></div>
  <div class="tiles" id="tTiles" style="margin-top:14px"></div>
  <div id="tRel"></div></div>
 <p class="note ess-only card wide" style="margin:0;padding:12px 16px">Modo essencial: dados, intervalo de confiança, valor de p e como relatar. No modo <b>Completo</b> aparecem a distribuição de referência, as estatísticas do teste, os tamanhos de efeito, os pressupostos e o mundo simulado.</p>
 <div class="card wide adv"><div class="card-h"><h3>Pressupostos</h3><button class="more-btn" data-learn="pressup">Saiba mais</button></div><div id="tAss"></div></div>
 <div class="card wide adv"><div class="card-h"><h3>Mundo simulado</h3><button class="more-btn" data-learn="simul">Saiba mais</button></div>
  <p class="lede">Aqui você define a verdade da população. Gere um estudo para ver dados que ela produz, ou simule mil estudos para ver com que frequência o teste encontra o efeito (poder) e quantos falsos positivos aparecem quando não há efeito.</p>
  <div id="sF"></div><div class="chips" id="sShape" style="margin-top:10px"></div>
  <div class="row" style="margin-top:12px"><button class="btn small" id="sFrom">Copiar valores dos dados atuais</button><button class="btn small" id="sNull">Sem efeito (H₀ verdadeira)</button><button class="btn small" id="sOne">Gerar um estudo</button><button class="btn small primary" id="sRun">Simular 1.000 estudos</button></div>
  <div class="progress" id="sProg" hidden><i></i></div>
  <div id="sRes"></div></div>
</div>`,initTests,()=>{if(!TD[TESTS[TS.test].kind])loadPreset(DEFP[TS.test]||0,true);else if(!SIMP[TESTS[TS.test].kind])fillSimFromData();renderPick();buildInputs();analyze();buildSim();});
function initTests(){
  $("tPick").addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(b){selectTest(b.dataset.t);return;}if(e.target.id==="tOpenPick"){TS.pickOpen=true;renderPick();}if(e.target.id==="tClosePick"){TS.pickOpen=false;renderPick();}});
  $("tAlt").onclick=()=>selectTest(TESTS[TS.test].alt);
  $("tLearn").onclick=()=>{const L=LEARN["t_"+TS.test]||LEARN.teste;openSheet(L[0],L[1]);};
  let md="ess";try{md=localStorage.getItem("statlab.mode")||"ess";}catch(e){}TS.full=md==="full";$("lab-testes").classList.toggle("ess",!TS.full);
  segBind($("tMode"),md,v=>{TS.full=v==="full";try{localStorage.setItem("statlab.mode",v)}catch(e){}$("lab-testes").classList.toggle("ess",!TS.full);analyze();buildSim();});
  $("tAlpha").onchange=e=>{TS.alpha=+e.target.value;analyze();if(TS.sim)renderSim();};
  // arrastar pontos nos gráficos de dispersão
  let drag=null;const main=$("tMain");
  main.addEventListener("pointerdown",e=>{const c=e.target.closest("circle[data-i]");if(!c||!TS.sc)return;const d=TD[TESTS[TS.test].kind];drag={i:TS.cidx?TS.cidx[+c.dataset.i]:+c.dataset.i,svg:c.ownerSVGElement,dx:dec(d.x.filter(has)),dy:dec(d.y.filter(has))};TS.fixDom=[[TS.sc.xl,TS.sc.xh],[TS.sc.yl,TS.sc.yh]];drag.svg.setPointerCapture(e.pointerId);e.preventDefault();});
  main.addEventListener("pointermove",e=>{if(!drag)return;const q=svgPt(drag.svg,e),s=TS.sc,d=TD[TESTS[TS.test].kind];d.x[drag.i]=rnd(s.xl+(q.x-s.L)/s.iw*(s.xh-s.xl),drag.dx);d.y[drag.i]=rnd(s.yl+(s.T+s.ih-q.y)/s.ih*(s.yh-s.yl),drag.dy);analyze(true);});
  const end=()=>{if(drag){drag=null;TS.fixDom=null;syncInputs();analyze();}};main.addEventListener("pointerup",end);main.addEventListener("pointercancel",end);
  $("sFrom").onclick=()=>{fillSimFromData();buildSim();};$("sNull").onclick=()=>{setSimNull();buildSim();};
  $("sOne").onclick=genOne;$("sRun").onclick=runSim;
}
function renderPick(){const t=TESTS[TS.test];if(!TS.pickOpen){$("tPick").innerHTML=`<div class="picked"><div><span class="mini">${t.fam}</span><b>${t.name}</b></div><button class="btn small" id="tOpenPick">Trocar teste</button></div>`;return;}
  $("tPick").innerHTML=FAMS.map(f=>`<div class="fam"><span>${f}</span><div class="row">${Object.entries(TESTS).filter(([,t])=>t.fam===f&&!t.hidden).map(([id,t])=>`<button class="chip ${id===TS.test?"on":""}" data-t="${id}">${t.name}${t.np?"<small>não paramétrico</small>":""}</button>`).join("")}</div></div>`).join("")+(TS.picked?`<div class="row" style="margin-top:4px"><button class="btn small" id="tClosePick">Fechar a lista</button></div>`:"");}
function selectTest(id){if(!TESTS[id])return;TS.pickOpen=false;TS.picked=true;const k0=TESTS[TS.test].kind;TS.test=id;TS.sim=null;TS.predX=null;const t=TESTS[id];if(!TD[t.kind]||(id==="fisher"&&!(TD.tab.t.length===2&&TD.tab.t[0].length===2)))loadPreset(DEFP[id]||0,true);else if(t.kind!==k0||!SIMP[t.kind])fillSimFromData();
  renderPick();buildInputs();analyze();buildSim();$("sRes").innerHTML="";try{history.replaceState(null,"","#testes-"+id)}catch(e){}}
function loadPreset(i,silent){const t=TESTS[TS.test],K=TK[t.kind];TD[t.kind]=K.presets[i].d();TD[t.kind].pi=i;fillSimFromData();if(!silent){buildInputs();analyze();buildSim();$("sRes").innerHTML="";TS.sim=null;}}
function openTestWith(id,patch){go("testes");const t=TESTS[id];if(patch.one){TD.one={v:patch.one.v,name:patch.one.name,mu0:patch.one.mu0};}selectTest(id);window.scrollTo({top:0});setTimeout(()=>{const el=$("tM0");if(el&&!has(TD.one.mu0))el.focus();},200);}

/* ---------- entradas ---------- */
function grpBlock(i,id,name,vals,ph,extra=""){return `<div><div class="gname"><i style="background:${GC[i%5]}"></i><input id="${id}N" value="${esc(name)}" aria-label="Nome"><small id="${id}C">n = ${vals.length}</small></div><textarea class="data sm" id="${id}" placeholder="${ph||"valores separados por espaço"}">${listTxt(vals)}</textarea>${extra}</div>`;}
function buildInputs(){const t=TESTS[TS.test],k=t.kind,d=TD[k],el=$("tIn");$("tFam").textContent=t.fam;$("tName").textContent=t.name;
  $("tAlt").hidden=!t.alt;if(t.alt)$("tAlt").textContent="Ver com "+TESTS[t.alt].name;
  const pl=TK[k].presets.map((p,i)=>[i,p]).filter(([,p])=>!(p.r3&&TS.test==="fisher"));chips($("tPre"),pl.map(([,p])=>p.n),j=>loadPreset(pl[j][0]),pl.findIndex(([i])=>i===d.pi));
  let h="";
  if(k==="one")h=`<div class="fields" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))"><div class="inp"><label for="tVN">Variável</label><div class="box"><input id="tVN" value="${esc(d.name||"")}" style="font-size:15px;font-weight:500"></div></div>${t.nomu?"":`<div class="inp"><label for="tM0">Valor de referência (μ₀)</label><div class="box"><input id="tM0" inputmode="decimal" value="${has(d.mu0)?fmt(d.mu0,dec([d.mu0])):""}"></div></div>`}</div><textarea class="data" id="tV" style="margin-top:10px">${listTxt(d.v)}</textarea><p class="note" id="tVC">n = ${d.v.length}</p>`;
  const vn=`<div class="inp" style="max-width:360px;margin-bottom:10px"><label for="tVN">Variável</label><div class="box"><input id="tVN" value="${esc(d.name||"")}" style="font-size:15px;font-weight:500"></div></div>`;
  if(k==="two")h=vn+`<div class="grpin">${grpBlock(0,"tGa",d.na,d.a)}${grpBlock(1,"tGb",d.nb,d.b)}</div>`;
  if(k==="pair")h=vn+gridHTML(k,d);
  if(k==="krep")h=vn+gridHTML(k,d)+`<div class="row" style="margin-top:4px"><button class="tool" id="tGadd" ${d.g.length>=5?"disabled":""}>+ momento (coluna)</button><button class="tool" id="tGdel" ${d.g.length<=2?"disabled":""}>− momento</button></div>`;
  if(k==="k")h=`<div class="inp" style="max-width:360px;margin-bottom:10px"><label for="tVN">Variável</label><div class="box"><input id="tVN" value="${esc(d.name||"")}" style="font-size:15px;font-weight:500"></div></div><div class="grpin">${d.g.map((v,i)=>grpBlock(i,"tG"+i,d.names[i]||"",v)).join("")}</div><div class="row" style="margin-top:8px"><button class="tool" id="tGadd" ${d.g.length>=5?"disabled":""}>+ ${k==="k"?"grupo":"momento"}</button><button class="tool" id="tGdel" ${d.g.length<=2?"disabled":""}>− ${k==="k"?"grupo":"momento"}</button></div>${k==="krep"?`<p class="note">Um valor por participante em cada momento, sempre na mesma ordem.</p>`:""}`;
  if(k==="xy"||k==="xbin")h=gridHTML(k,d);
  if(k==="tab"){const c=d.t[0].length;h=`<div class="tw"><table class="tbl-in"><thead><tr><th></th>${d.cn.map((n,j)=>`<th><input data-cn="${j}" value="${esc(n)}" aria-label="Nome da coluna ${j+1}" style="text-align:center"></th>`).join("")}<th>Total</th></tr></thead><tbody>${d.t.map((r,i)=>`<tr><th class="rh"><input data-rn="${i}" value="${esc(d.rn[i])}" aria-label="Nome da linha ${i+1}"></th>${r.map((v,j)=>`<td><input data-c="${i},${j}" inputmode="numeric" value="${v}" aria-label="${esc(d.rn[i])} e ${esc(d.cn[j])}"></td>`).join("")}<td class="tot">${sum(r)}</td></tr>`).join("")}</tbody></table></div>
   <div class="row" style="margin-top:8px"><button class="tool" id="tRadd" ${d.t.length>=4?"disabled":""}>+ linha</button><button class="tool" id="tRdel" ${d.t.length<=2?"disabled":""}>− linha</button><button class="tool" id="tCadd" ${c>=4?"disabled":""}>+ coluna</button><button class="tool" id="tCdel" ${c<=2?"disabled":""}>− coluna</button></div><p class="note">Linhas: grupos ou exposição. Colunas: desfecho. Digite contagens (número de pessoas).</p>`;}
  if(k==="mcn"){const L=d.lab;h=`<div class="fields" style="max-width:420px;margin-bottom:10px"><div class="inp"><label for="tL0">Categoria 1</label><div class="box"><input id="tL0" value="${esc(L[0])}" style="font-size:15px;font-weight:500"></div></div><div class="inp"><label for="tL1">Categoria 2</label><div class="box"><input id="tL1" value="${esc(L[1])}" style="font-size:15px;font-weight:500"></div></div></div>
   <div class="tw"><table class="tbl-in"><thead><tr><th></th><th>Depois: ${esc(L[0])}</th><th>Depois: ${esc(L[1])}</th></tr></thead><tbody>${[0,1].map(i=>`<tr><th class="rh">Antes: ${esc(L[i])}</th>${[0,1].map(j=>`<td><input data-c="${i},${j}" inputmode="numeric" value="${d.t[i][j]}"></td>`).join("")}</tr>`).join("")}</tbody></table></div><p class="note">Cada pessoa aparece uma vez, na célula que combina a situação antes e depois.</p>`;}
  if(k==="prop")h=`<div class="fields"><div class="inp"><label for="tPx">Eventos</label><div class="box"><input id="tPx" inputmode="numeric" value="${d.x}"></div></div><div class="inp"><label for="tPn">Total (n)</label><div class="box"><input id="tPn" inputmode="numeric" value="${d.n}"></div></div><div class="inp"><label for="tP0">Referência</label><div class="box"><input id="tP0" inputmode="decimal" value="${fmt(d.p0*100,1).replace(",0","")}"><span>%</span></div></div><div class="inp"><label for="tPN">O que é o evento</label><div class="box"><input id="tPN" value="${esc(d.name||"")}" style="font-size:15px;font-weight:500"></div></div></div>`;
  if(k==="surv")h=`<div class="inp" style="max-width:240px;margin-bottom:10px"><label for="tSU">Unidade de tempo</label><div class="box"><input id="tSU" value="${esc(d.unit||"")}" style="font-size:15px;font-weight:500"></div></div><div class="grpin">${d.g.map((g,i)=>`<div><div class="gname"><i style="background:${GC[i]}"></i><input id="tS${i}N" value="${esc(d.names[i])}" aria-label="Nome do grupo"><small id="tS${i}C">n = ${g.t.length} · ${sum(g.e)} eventos</small></div><textarea class="data sm" id="tS${i}">${survTxt(g)}</textarea></div>`).join("")}</div><p class="note">Um tempo por participante. Acrescente <b>+</b> ao tempo de quem saiu do estudo sem o evento (censurado), por exemplo 24+.</p>`;
  el.innerHTML=h;
  // opções específicas
  const o=$("tOpt");o.innerHTML="";
  if(t.opt==="welch")o.innerHTML=`<label class="toggle"><input type="checkbox" id="oSt" ${TS.student?"checked":""}> Assumir variâncias iguais (t de Student)</label>`;
  if(t.opt==="welchA")o.innerHTML=`<label class="toggle"><input type="checkbox" id="oWa" ${TS.welchA?"checked":""}> ANOVA de Welch (variâncias diferentes)</label>`;
  if(t.opt==="yates"||t.kind==="mcn")o.innerHTML=`<label class="toggle"><input type="checkbox" id="oYa" ${TS.yates?"checked":""}> Correção de continuidade (Yates)</label>`;
  const oS=$("oSt"),oW=$("oWa"),oY=$("oYa");if(oS)oS.onchange=e=>{TS.student=e.target.checked;analyze();};if(oW)oW.onchange=e=>{TS.welchA=e.target.checked;analyze();};if(oY)oY.onchange=e=>{TS.yates=e.target.checked;analyze();};
  el.oninput=e=>readInput(e.target);if(GRIDK.has(k))gridBind(el,k);else{el.onkeydown=null;el.onpaste=null;}
  el.onclick=e=>{const id=e.target.id,btn=e.target.closest("[data-del]");const d=TD[k];if(GRIDK.has(k)&&gridClick(id,k,d,btn))return;if(!id)return;
    if(id==="tGadd"&&d.g.length<5){const n=d.g[0].length||10;d.g.push(k==="krep"?d.g[d.g.length-1].map(v=>has(v)?v:null):G(Date.now()%1e6,n,mean(d.g[0])||50,sd(d.g[0])||10));d.names.push((k==="k"?"Grupo ":"Momento ")+(d.g.length));}
    else if(id==="tGdel"&&d.g.length>2){d.g.pop();d.names.pop();}
    else if(id==="tRadd"&&d.t.length<4){d.t.push(d.t[0].map(()=>10));d.rn.push("Linha "+(d.t.length));}
    else if(id==="tRdel"&&d.t.length>2){d.t.pop();d.rn.pop();}
    else if(id==="tCadd"&&d.t[0].length<4){d.t.forEach(r=>r.push(10));d.cn.push("Coluna "+(d.t[0].length));}
    else if(id==="tCdel"&&d.t[0].length>2){d.t.forEach(r=>r.pop());d.cn.pop();}
    else return;d.pi=-1;buildInputs();analyze();buildSim();};}
function readInput(el){const t=TESTS[TS.test],k=t.kind,d=TD[k],id=el.id;d.pi=-1;$("tPre").querySelectorAll(".chip").forEach(c=>c.classList.remove("on"));
  if(GRIDK.has(k)&&gridRead(el,k,d)){clearTimeout(TS.deb);TS.deb=setTimeout(()=>analyze(),150);return;}
  if(id==="tVN")d.name=el.value;if(id==="tM0")d.mu0=parse(el.value);if(id==="tV"){d.v=parseList(el.value);$("tVC").textContent="n = "+d.v.length;}
  if(id==="tGa"||id==="tGb"){const key=id==="tGa"?"a":"b";d[key]=parseList(el.value);$(id+"C").textContent="n = "+d[key].length;}
  if(id==="tGaN")d.na=el.value;if(id==="tGbN")d.nb=el.value;
  let m=id.match(/^tG(\d)$/);if(m){d.g[+m[1]]=parseList(el.value);$(id+"C").textContent="n = "+d.g[+m[1]].length;}
  m=id.match(/^tG(\d)N$/);if(m)d.names[+m[1]]=el.value;
  if(id==="tX"||id==="tY"){const key=id==="tX"?"x":"y";d[key]=parseList(el.value);$(id+"C").textContent="n = "+d[key].length;}
  if(id==="tXN")d.nx=el.value;if(id==="tYN")d.ny=el.value;
  if(el.dataset.c){const [i,j]=el.dataset.c.split(",").map(Number),v=parse(el.value);d.t[i][j]=has(v)&&v>=0?Math.round(v):0;const tot=el.closest("tr").querySelector(".tot");if(tot)tot.textContent=sum(d.t[i]);}
  if(el.dataset.rn)d.rn[+el.dataset.rn]=el.value;if(el.dataset.cn)d.cn[+el.dataset.cn]=el.value;
  if(id==="tL0"||id==="tL1")d.lab[+id.slice(2)]=el.value;
  if(id==="tPx")d.x=Math.round(parse(el.value)??0);if(id==="tPn")d.n=Math.round(parse(el.value)??0);if(id==="tP0"){const v=parse(el.value);d.p0=has(v)?v/100:NaN;}if(id==="tPN")d.name=el.value;
  if(id==="tSU")d.unit=el.value;m=id.match(/^tS(\d)$/);if(m){d.g[+m[1]]=survParse(el.value);$(id+"C").textContent=`n = ${d.g[+m[1]].t.length} · ${sum(d.g[+m[1]].e)} eventos`;}m=id.match(/^tS(\d)N$/);if(m)d.names[+m[1]]=el.value;
  clearTimeout(TS.deb);TS.deb=setTimeout(()=>analyze(),120);}
function syncInputs(){buildInputs();}
/* ---------- análise ---------- */
function analyze(live){const t=TESTS[TS.test],d0=TD[t.kind];if(!d0)return;const cl=cleanData(t.kind,d0),d=cl.d;TS.cidx=cl.idx;const err=t.check(d);["tMain","tA","tB","tTiles","tRel","tAss"].forEach(id=>$(id).innerHTML="");$("tErr").innerHTML="";TS.sc=null;
  if(err){$("tErr").innerHTML=`<div class="warnbox">${err}</div>`;return;}
  const S={main:$("tMain"),a:$("tA"),b:$("tB"),tiles:$("tTiles"),ass:$("tAss"),rel:(txt,interp)=>{$("tRel").innerHTML=`<div class="insight">${interp}</div><div class="relato"><span class="eyebrow">Como relatar</span><div id="tRelT">${txt}</div><div class="row"><button class="btn small" id="tCopy">Copiar</button></div></div>`;$("tCopy").onclick=()=>copyText($("tRelT").textContent);}};
  try{t.show(d,S);$("tTiles").querySelectorAll(".tile").forEach(x=>{const l=x.querySelector("span").textContent.trim();if(ADVT.test(l))x.classList.add("adv");});saveState();}catch(e){$("tErr").innerHTML=`<div class="warnbox">Não foi possível calcular com estes dados. Verifique se há variação nos valores de cada grupo.</div>`;console.error(e);}}
/* ---------- mundo simulado ---------- */
function fillSimFromData(){const t=TESTS[TS.test],K=TK[t.kind];if(!TD[t.kind])return;const d=cleanData(t.kind,TD[t.kind]).d;let P=null;try{P=K.fromData(d);}catch(e){}if(!P){SIMP[t.kind]=null;return;}const old=SIMP[t.kind];P.shape=old&&old.shape||"norm";SIMP[t.kind]=P;}
function setSimNull(){const k=TESTS[TS.test].kind,P=SIMP[k];if(!P)return;
  ({one:()=>P.m=P.mu0,two:()=>P.mb=P.ma,pair:()=>P.c=0,k:()=>{const m=parseList(P.means);P.means=m.map(()=>numTxt(rnd(mean(m),1))).join(" ");},krep:()=>{const m=parseList(P.means);P.means=m.map(()=>numTxt(rnd(mean(m),1))).join(" ");},xy:()=>P.rho=0,xbin:()=>P.or=1,tab:()=>{const N=sum(P.ns),pool=P.ps[0].map((_,j)=>sum(P.ps.map((r,i)=>r[j]*P.ns[i]))/N);P.ps=P.ps.map(()=>pool.slice());},mcn:()=>P.pc=P.pb,prop:()=>P.p=P.p0,surv:()=>P.m2=P.m1})[k]();}
function simIsNull(k,P,id){const eq=(a,b)=>Math.abs(a-b)<1e-9,ml=m=>Array.isArray(m)?m:parseList(m);if(id==="sw")return P.shape==="norm";
  return({one:()=>eq(P.m,P.mu0),two:()=>eq(P.ma,P.mb),pair:()=>eq(P.c,0),k:()=>{const m=ml(P.means);return m.every(v=>eq(v,m[0]));},krep:()=>{const m=ml(P.means);return m.every(v=>eq(v,m[0]));},xy:()=>eq(P.rho,0),xbin:()=>eq(P.or,1),tab:()=>P.ps.every(r=>r.every((v,j)=>Math.abs(v-P.ps[0][j])<1e-9)),mcn:()=>eq(P.pb,P.pc),prop:()=>eq(P.p,P.p0),surv:()=>eq(P.m1,P.m2)})[k]();}
function buildSim(){const t=TESTS[TS.test],K=TK[t.kind],P=SIMP[t.kind];const f=$("sF");["sOne","sRun","sNull","sFrom"].forEach(id=>$(id).disabled=!P);if(!P){f.innerHTML="";$("sShape").innerHTML="";return;}
  if(K.sim==="table"){const d=TD[t.kind];f.innerHTML=`<p class="note" style="margin-top:0">Proporção verdadeira de cada categoria em cada linha (cada linha soma 100%).</p><div class="tw"><table class="tbl-in"><thead><tr><th></th><th>n</th>${d.cn.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${P.ps.map((r,i)=>`<tr><th class="rh">${esc(d.rn[i]||"Linha "+(i+1))}</th><td><input data-sn="${i}" inputmode="numeric" value="${P.ns[i]}"></td>${r.map((v,j)=>`<td><input data-sp="${i},${j}" inputmode="decimal" value="${numTxt(+(v*100).toFixed(1))}"></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    f.oninput=e=>{const el=e.target,v=parse(el.value);if(!has(v))return;if(el.dataset.sn!=null)P.ns[+el.dataset.sn]=v;if(el.dataset.sp){const [i,j]=el.dataset.sp.split(",").map(Number);P.ps[i][j]=v/100;}};$("sShape").innerHTML="";return;}
  f.innerHTML=`<div class="fields">${K.sim.map(([key,l])=>`<div class="inp"><label for="sp_${key}">${l}</label><div class="box"><input id="sp_${key}" inputmode="decimal" value="${typeof P[key]==="string"?P[key]:numTxt(+(+P[key]).toFixed(Math.abs(P[key])<1?3:2))}"></div></div>`).join("")}</div>`;
  f.oninput=e=>{const key=e.target.id.slice(3),v=key==="means"?e.target.value:parse(e.target.value);if(key==="means"||has(v))P[key]=v;};
  const sh=K.shape?[["norm","Normal"],["skew","Assimétrica"],["out","Com outliers"]]:K.out?[["norm","Normal"],["out","Com um outlier"]]:[];
  if(sh.length){chips($("sShape"),sh.map(s=>s[1]),i=>{P.shape=sh[i][0];},Math.max(0,sh.findIndex(s=>s[0]===P.shape)));}else $("sShape").innerHTML="";}
function simParams(){const t=TESTS[TS.test],P={...SIMP[t.kind]};if(typeof P.means==="string")P.means=parseList(P.means);
  const ints=["n","na","nb","n1","n2"];ints.forEach(k=>{if(k in P)P[k]=clamp(Math.round(P[k]),2,5000);});
  if(t.kind==="k"&&P.means.length<2)return "Informe pelo menos duas médias.";if(t.kind==="krep"&&P.means.length<2)return "Informe pelo menos duas médias.";
  if("s" in P&&!(P.s>0))return "O desvio padrão precisa ser maior que zero.";if(t.kind==="xy"&&!(Math.abs(P.rho)<1))return "A correlação precisa estar entre −1 e 1.";
  if(t.kind==="tab"){if(!P.ps.every(r=>r.every(v=>v>=0)&&sum(r)>0)||!P.ns.every(n=>n>=1))return "Proporções não podem ser negativas e cada linha precisa de n ≥ 1.";P.ns=P.ns.map(n=>Math.round(n));P.ps=P.ps.map(r=>{const t=sum(r);return r.map(v=>v/t);});}if(t.kind==="prop"&&!(P.p>0&&P.p<1&&P.p0>0&&P.p0<1))return "As proporções precisam estar entre 0 e 1.";
  if(t.kind==="mcn"&&!(P.pb>=0&&P.pc>=0&&P.pb+P.pc<1))return "As probabilidades de mudança precisam somar menos que 1.";if(t.kind==="xbin"&&!(P.or>0&&P.prev>0&&P.prev<1))return "OR maior que zero e proporção entre 0 e 1.";
  if(t.kind==="surv"&&!(P.m1>0&&P.m2>0&&P.fu>0))return "Medianas e seguimento precisam ser maiores que zero.";return P;}
function genOne(){const t=TESTS[TS.test],k=t.kind,P=simParams();if(typeof P==="string"){toast(P);return;}const d=TD[k],g=TK[k].gen(P,cleanData(k,d).d);
  const r1=v=>rnd(v,Math.max(1,dec(k==="one"?d.v:k==="two"||k==="pair"?[...d.a,...d.b]:k==="k"||k==="krep"?d.g.flat():[0])));
  if(k==="one"){d.v=g.v.map(r1);d.mu0=P.mu0;}if(k==="two"||k==="pair"){d.a=g.a.map(r1);d.b=g.b.map(r1);}if(k==="k"||k==="krep"){d.g=g.g.map(c=>c.map(r1));while(d.names.length<d.g.length)d.names.push((k==="k"?"Grupo ":"Momento ")+(d.names.length+1));d.names.length=d.g.length;}
  if(k==="xy"){d.x=g.x.map(v=>rnd(v,Math.max(1,dec(d.x))));d.y=g.y.map(v=>rnd(v,Math.max(1,dec(d.y))));}if(k==="xbin"){d.x=g.x.map(v=>rnd(v,1));d.y=g.y;}
  if(k==="tab"||k==="mcn")d.t=g.t;if(k==="prop"){d.x=g.x;d.n=g.n;d.p0=g.p0;}if(k==="surv"){d.g=g.g.map(q=>({t:q.t.map(v=>rnd(v,1)),e:q.e}));}
  d.pi=-1;buildInputs();analyze();toast("Novo estudo gerado a partir do mundo simulado");}
const K_gen=(k,P,d)=>TK[k].gen(P,d);
function runSim(){const t=TESTS[TS.test],k=t.kind,P=simParams();if(typeof P==="string"){toast(P);return;}const d0=cleanData(k,TD[k]).d,tests=t.sims.map(id=>({id,t:TESTS[id]})),N=1000,ps=tests.map(()=>new Float64Array(N)),eff=new Float64Array(N),run=++TS.simRun;
  $("sRun").disabled=true;$("sProg").hidden=false;$("sRes").innerHTML="";
  runChunks(N,20,i=>{if(run!==TS.simRun)return;const g=TK[k].gen(P,d0);const dd=Object.assign({},d0,g);tests.forEach((q,j)=>{let p=NaN;try{if(!q.t.check||!q.t.check(dd))p=q.t.p(dd);}catch(e){}ps[j][i]=p;});try{eff[i]=t.eff?t.eff(dd):NaN;}catch(e){eff[i]=NaN;}},
   f=>{$("sProg").firstChild.style.width=pct(f,0);},()=>{$("sRun").disabled=false;$("sProg").hidden=true;if(run!==TS.simRun)return;TS.sim={P,tests,ps,eff,k,id:TS.test,te:t.trueEff?t.trueEff(P,d0):null,isNull:simIsNull(k,P,TS.test)};renderSim();});}
function renderSim(){const S=TS.sim;if(!S||S.id!==TS.test)return;const a=TS.alpha,t=TESTS[S.id],rate=S.ps.map(p=>{const v=Array.from(p).filter(has);return v.filter(x=>x<a).length/v.length;});
  let h=`<div class="sub">${S.isNull?"Falsos positivos: estudos com p < α sem efeito real":"Poder: estudos com p < α"}</div>`;
  h+=S.tests.map((q,j)=>!has(rate[j])?"":`<div class="powbar"><span>${q.t.name}</span><span class="bar"><i style="width:${pct(rate[j],1)};background:${j?"var(--alt)":"var(--accent)"}"></i></span><b>${pct(rate[j],1)}</b></div>`).join("");
  h+=`<div class="cols2" style="margin-top:6px"><div><div class="sub">Valores de p (${esc(t.name)})</div><svg class="ch" id="sPh"></svg></div><div><div class="sub">${esc(t.effName||"Estimativa")} em cada estudo</div><svg class="ch" id="sEh"></svg></div></div><div class="insight" id="sTxt"></div>`;
  $("sRes").innerHTML=h;
  // p-valores
  const pv0=Array.from(S.ps[0]).filter(has);histo($("sPh"),pv0,{h:170,min:0,max:1,bins:20,colorOf:c=>c<a?"var(--accent)":"var(--dot)",cls:"bar2",fmt:v=>fmt(v,1),marks:[{v:a,style:"stroke:var(--bad);stroke-dasharray:4 3",t:"α"}]});
  // efeitos
  const ok=[];S.eff.forEach((e,i)=>{if(has(e)&&has(S.ps[0][i]))ok.push([e,S.ps[0][i]<a]);});let msgE="";
  if(ok.length>5){let lo=Math.min(...ok.map(q=>q[0])),hi=Math.max(...ok.map(q=>q[0]));if(has(S.te)){lo=Math.min(lo,S.te);hi=Math.max(hi,S.te);}const ratio=/razão|OR|Hazard/i.test(t.effName||"");
    if(ratio){const s=Array.from(ok.map(q=>q[0])).sort((x,y)=>x-y);lo=Math.max(lo,s[Math.floor(s.length*.01)]);hi=Math.min(hi,s[Math.ceil(s.length*.99)-1]);}
    effHist($("sEh"),ok,lo,hi,S.te);
    const sig=ok.filter(q=>q[1]).map(q=>q[0]),mAll=median(ok.map(q=>q[0]));
    if(has(S.te)&&!S.isNull&&sig.length>=5&&rate[0]<.8){const ms=median(sig),ex=ratio?Math.log(ms)/Math.log(S.te):ms/S.te;if(isFinite(ex)&&ex>1.1)msgE=` Repare no gráfico da direita: entre os estudos com p < α, a estimativa mediana foi ${auto(ms)}, contra ${auto(S.te)} na verdade. Quando o poder é baixo, os estudos “positivos” tendem a <b>exagerar o efeito</b>.`;}}
  else $("sEh").innerHTML="";
  const best=rate.length>1?(rate[0]>=rate[1]?0:1):0;
  let txt=S.isNull?`Não há efeito neste mundo, e mesmo assim <b>${pct(rate[0],1)}</b> dos estudos deram p < α com ${esc(t.name)}. É o erro tipo I, que fica perto de α = ${fmt(a,2)} quando o teste é adequado. Os valores de p se espalham de forma uniforme entre 0 e 1.`
   :`Neste mundo existe efeito. ${esc(t.name)} o detectou em <b>${pct(rate[0],1)}</b> dos estudos${rate[0]<.8?"; poder abaixo dos 80% recomendados. Aumente n ou o tamanho do efeito para ver o poder subir.":"."}`;
  if(rate.length>1&&has(rate[1])&&!S.isNull&&Math.abs(rate[0]-rate[1])>.02)txt+=` ${esc(S.tests[best].t.name)} teve mais poder neste cenário (${pct(rate[best],1)}).${S.P.shape==="skew"||S.P.shape==="out"?" Com dados assimétricos ou com outliers, testes baseados em postos costumam levar vantagem.":S.P.shape==="norm"&&best===0?" Com dados normais, o teste paramétrico aproveita melhor a informação.":""}`;
  if(rate.length>1&&has(rate[1])&&S.isNull)txt+=` Com ${esc(S.tests[1].t.name)}: ${pct(rate[1],1)}.`;
  $("sTxt").innerHTML=txt+msgE;}
function effHist(el,ok,lo,hi,te){const H=170,W=box(el,H),L=10,R=10,T=14,B=30,iw=W-L-R,ih=H-T-B,nb=24;if(!(hi>lo)){hi=lo+1;}const bw=(hi-lo)/nb,all=new Array(nb).fill(0),sg=new Array(nb).fill(0);
  ok.forEach(([e,s])=>{if(e<lo||e>hi)return;const i=Math.min(nb-1,Math.floor((e-lo)/bw));all[i]++;if(s)sg[i]++;});const ym=Math.max(...all)*1.1||1,X=v=>L+(v-lo)/(hi-lo)*iw,Y=c=>T+ih-c/ym*ih;let s="";
  all.forEach((c,i)=>{if(!c)return;const x=X(lo+i*bw),w=Math.max(1,iw/nb-1);s+=`<rect x="${x}" y="${Y(c)}" width="${w}" height="${T+ih-Y(c)}" fill="var(--dot)"/>`;if(sg[i])s+=`<rect x="${x}" y="${Y(sg[i])}" width="${w}" height="${T+ih-Y(sg[i])}" fill="var(--accent)"/>`;});
  if(has(te)&&te>=lo&&te<=hi)s+=`<line x1="${X(te)}" x2="${X(te)}" y1="${T-4}" y2="${T+ih}" stroke="var(--good)" stroke-width="2.5"/><text x="${clamp(X(te),40,W-40)}" y="${T-6}" text-anchor="middle" class="lbl" style="fill:var(--good);font-size:11px">verdade: ${auto(te)}</text>`;
  s+=xAxis(X,nice(lo,hi,Math.max(3,Math.floor(iw/80))).filter(t=>t>=lo&&t<=hi),T+ih,v=>auto(v),L,W-R);el.innerHTML=s+`<text x="${W-R}" y="${T+8}" text-anchor="end" style="font-size:10.5px;fill:var(--accent)">azul: p < α</text>`;}

const ADVT=/^(t|V|U|F|H|χ²|W|z de Wald|b₁|F de Welch|t de Welch|t de Student|Log-rank χ²|d de Cohen|dz|r \(rank-biserial\)|η²|ε²|η² parcial|W de Kendall|V de Cramér|R² de McFadden|Erro padrão da regressão|Odds ratio|Diferença de proporções|Acima · abaixo de μ₀)$/;
let SVT;function saveState(){clearTimeout(SVT);SVT=setTimeout(()=>{try{localStorage.setItem("statlab.data",JSON.stringify({v:2,TD,test:TS.test,bench:{v:B.v,u:B.u,name:B.name}}));}catch(e){}},400);}
function loadState(){try{const S=JSON.parse(localStorage.getItem("statlab.data")||"null");if(!S||S.v!==2)return;
  Object.entries(S.TD||{}).forEach(([k,d])=>{if(!TK[k]||!d||typeof d!=="object")return;const ref=Object.keys(TK[k].presets[0].d()).filter(x=>x!=="pi");if(ref.every(x=>x in d))TD[k]=d;});
  if(TESTS[S.test]&&!TESTS[S.test].hidden)TS.test=S.test;
  if(S.bench&&Array.isArray(S.bench.v)&&S.bench.v.every(x=>typeof x==="number")){B.v=S.bench.v;B.u=S.bench.u||"";B.name=S.bench.name||"";}}catch(e){}}
