/* ===================== MÚLTIPLAS COMPARAÇÕES ===================== */
const MS={corr:"none",ps:[],real:false,agg:null};
LAB("mult","Inferencial","Múltiplas comparações",`
<div class="intro"><span class="eyebrow">Inferencial</span><h2>Quanto mais você procura, mais você acha</h2><p>Mesmo sem nenhum efeito real, testes repetidos produzem “descobertas”. Veja quantas, e como corrigir.</p></div>
<div class="grid two">
 <div class="card"><div class="card-h"><h3>Chance de pelo menos um falso positivo</h3><button class="more-btn" data-learn="mult">Saiba mais</button></div>
  <div class="range"><label for="mK">Número de testes (k)</label><output id="mKo"></output><input type="range" id="mK" min="1" max="50" value="10"></div>
  <svg class="ch" id="mCurve" style="margin-top:10px" role="img" aria-label="Taxa de erro familiar"></svg><div class="f" id="mF"></div></div>
 <div class="card"><div class="card-h"><h3>Vinte testes, nenhum efeito</h3><button class="more-btn" data-learn="correc">Saiba mais</button></div>
  <div class="row" style="justify-content:space-between"><div class="seg" id="mCorr"><button data-v="none">Sem correção</button><button data-v="bonf">Bonferroni</button><button data-v="holm">Holm</button><button data-v="bh">B-H</button></div><label class="toggle"><input type="checkbox" id="mReal"> 3 efeitos reais</label></div>
  <svg class="ch" id="mGrid" style="margin-top:10px" role="img" aria-label="Valores de p"></svg>
  <div class="row" style="margin-top:8px"><button class="btn small" id="mRun">Rodar 20 testes</button><button class="btn small primary" id="mRun1000">Rodar 1.000 vezes</button></div>
  <div class="tiles" id="mTiles" style="margin-top:10px"></div></div>
 <div class="card wide"><div class="card-h"><h3>Corrija os seus valores de p</h3><button class="more-btn" data-learn="correc">Saiba mais</button></div>
  <p class="lede">Cole os valores de p de um artigo ou da sua análise e veja quais continuam abaixo de α depois de cada correção.</p>
  <div class="row" style="align-items:flex-start"><textarea class="data" id="mP" style="flex:1;min-width:0">0,001 0,008 0,012 0,03 0,04 0,049 0,21 0,55</textarea><label class="twin">α <select id="mA" class="tool"><option value="0.05">0,05</option><option value="0.01">0,01</option><option value="0.10">0,10</option></select></label></div>
  <div class="tw" id="mTab" style="margin-top:10px"></div></div>
</div>`,()=>{
  $("mK").oninput=renderMCurve;segBind($("mCorr"),"none",v=>{MS.corr=v;renderMGrid();});
  $("mReal").onchange=e=>{MS.real=e.target.checked;MS.agg=null;MS.ps=runTests();renderMGrid();};$("mRun").onclick=()=>{MS.ps=runTests();renderMGrid();};
  $("mRun1000").onclick=()=>{const agg={};["none","bonf","holm","bh"].forEach(h=>agg[h]={fw:0,pw:0});for(let r=0;r<1000;r++){const ps=runTests();["none","bonf","holm","bh"].forEach(h=>{const S=sigM(ps,h);if(ps.some((x,i)=>S[i]&&!x.real))agg[h].fw++;if(MS.real)agg[h].pw+=ps.filter((x,i)=>S[i]&&x.real).length/3;});}Object.values(agg).forEach(v=>{v.fw/=1000;v.pw/=1000;});MS.agg=agg;renderMGrid();};
  $("mP").oninput=renderMTab;$("mA").onchange=renderMTab;
},()=>{renderMCurve();if(!MS.ps.length)MS.ps=runTests();renderMGrid();renderMTab();});
function renderMCurve(){const k=+$("mK").value,a=.05,f=1-(1-a)**k;$("mKo").textContent=k;const el=$("mCurve"),H=170,Wd=box(el,H),L=40,iw=Wd-L-14,ih=H-40,X=v=>L+(v-1)/49*iw,Y=v=>10+ih-v*ih;let s=yGrid(Y,[0,.2,.4,.6,.8,1],L,Wd-14,v=>pct(v,0)),p="";
  for(let i=1;i<=50;i++)p+=(i>1?"L":"M")+X(i)+","+Y(1-(1-a)**i);s+=`<path class="curveA" d="${p}"/>`;[1,5,10,20].forEach(q=>s+=`<circle cx="${X(q)}" cy="${Y(1-(1-a)**q)}" r="3" fill="var(--tick)"/>`);
  s+=`<circle cx="${X(k)}" cy="${Y(f)}" r="7" fill="var(--alt)"/><text x="${clamp(X(k),60,Wd-60)}" y="${Y(f)-12}" text-anchor="middle" class="lbl">${pct(f,0)}</text>`+xAxis(X,[1,10,20,30,40,50],10+ih,v=>v,L,Wd-14);el.innerHTML=s;
  $("mF").innerHTML=`P(≥ 1 falso positivo) = 1 − (1 − 0,05)<sup>${k}</sup> = <b>${pct(f,1)}</b><br>Bonferroni: usar α = 0,05 ÷ ${k} = ${fmt(.05/k,4)} em cada teste`;}
function runTests(){return Array.from({length:20},(_,i)=>{const z=(MS.real&&i<3?3+randn():randn());return{p:2*(1-Phi(Math.abs(z))),real:MS.real&&i<3};});}
function adjP(ps,how){const k=ps.length,o=ps.map((p,i)=>[p,i]).sort((a,b)=>a[0]-b[0]),adj=new Array(k);if(how==="none")return ps.slice();if(how==="bonf")return ps.map(p=>Math.min(1,p*k));if(how==="holm")return holm(ps);
  let mn=1;for(let j=k-1;j>=0;j--){mn=Math.min(mn,o[j][0]*k/(j+1));adj[o[j][1]]=Math.min(1,mn);}return adj;}
function sigM(ps,how,a=.05){return adjP(ps.map(x=>x.p),how).map(p=>p<a);}
function renderMGrid(){const el=$("mGrid"),H=150,Wd=box(el,H),cols=5,cw=(Wd-8)/cols,rh=34;const S=sigM(MS.ps,MS.corr);let s="";
  MS.ps.forEach((x,i)=>{const c=i%cols,r=Math.floor(i/cols),X0=4+c*cw,Y0=4+r*rh,on=S[i];s+=`<rect x="${X0+2}" y="${Y0}" width="${cw-4}" height="${rh-6}" rx="6" fill="${on?(x.real?"var(--good-soft)":"var(--bad-soft)"):"var(--sunk)"}" stroke="${on?(x.real?"var(--good)":"var(--bad)"):"var(--line)"}"/><text x="${X0+cw/2}" y="${Y0+18}" text-anchor="middle" style="font-size:12px;fill:${on?(x.real?"var(--good)":"var(--bad)"):"var(--muted)"};font-weight:${on?600:400}">p ${x.p<.001?"< 0,001":"= "+fmt(x.p,3)}${x.real?" ★":""}</text>`;});
  el.innerHTML=s;const fp=MS.ps.filter((x,i)=>S[i]&&!x.real).length,tp=MS.ps.filter((x,i)=>S[i]&&x.real).length;
  $("mTiles").innerHTML=tile("Falsos positivos",fp,"nesta rodada","bad")+(MS.real?tile("Efeitos reais achados",`${tp} de 3`,"★ = efeito real","good"):"")+(MS.agg?tile("Em 1.000 rodadas",pct(MS.agg[MS.corr].fw,0),"com ≥ 1 falso positivo")+(MS.real?tile("Poder médio",pct(MS.agg[MS.corr].pw,0),"efeitos reais detectados"):""):"");}
function renderMTab(){const ps=parseList($("mP").value).filter(p=>p>=0&&p<=1),a=+$("mA").value;if(!ps.length){$("mTab").innerHTML=`<p class="note">Digite valores de p entre 0 e 1.</p>`;return;}
  const A={none:ps,bonf:adjP(ps,"bonf"),holm:adjP(ps,"holm"),bh:adjP(ps,"bh")},cell=v=>`<td class="${v<a?"ok":""}">${pv(v)}${v<a?" ✓":""}</td>`;
  $("mTab").innerHTML=`<table class="t"><thead><tr><th>p original</th><th>Bonferroni</th><th>Holm</th><th>Benjamini-Hochberg</th></tr></thead><tbody>${ps.map((p,i)=>`<tr>${cell(p)}${cell(A.bonf[i])}${cell(A.holm[i])}${cell(A.bh[i])}</tr>`).join("")}<tr class="sum"><td>${ps.filter(p=>p<a).length} abaixo de α</td><td>${A.bonf.filter(p=>p<a).length}</td><td>${A.holm.filter(p=>p<a).length}</td><td>${A.bh.filter(p=>p<a).length}</td></tr></tbody></table><p class="note">Valores de p ajustados: compare cada um diretamente com α. Bonferroni e Holm controlam a chance de qualquer falso positivo; Benjamini-Hochberg controla a proporção de falsas descobertas.</p>`;}

/* ===================== SIGNIFICÂNCIA × RELEVÂNCIA ===================== */
const RP=[["Relevante",[8,6,10,5]],["Significativo, mas trivial",[1,.5,1.5,5]],["Relevância incerta",[5,2,8,5]],["Inconclusivo",[3,-4,10,5]],["Contra efeito relevante",[.5,-1.5,2.5,5]]];
const RQ=[["RP 1,71 (sedentarismo e glicemia)",[1.71,1.15,2.56]],["RP 2,81",[2.81,1.39,5.69]],["RP 0,60",[.6,.38,.93]],["RP 1,30",[1.3,.8,2.1]]];
LAB("rel","Inferencial","Significância × relevância",`
<div class="intro"><span class="eyebrow">Inferencial</span><h2>Significância estatística não é relevância clínica</h2><p>Leia o intervalo de confiança contra o menor efeito que importa para o paciente.</p></div>
<div class="grid two">
 <div class="card wide"><div class="card-h"><h3>O IC e o Δ mínimo importante</h3><button class="more-btn" data-learn="rel">Saiba mais</button></div>
  <div class="chips" id="rPre"></div>
  <div class="fields" style="margin-top:10px">
   <div class="inp"><label for="rE">Estimativa</label><div class="box"><input id="rE" inputmode="decimal"></div></div>
   <div class="inp"><label for="rL">IC 95% inferior</label><div class="box"><input id="rL" inputmode="decimal"></div></div>
   <div class="inp"><label for="rH">IC 95% superior</label><div class="box"><input id="rH" inputmode="decimal"></div></div>
   <div class="inp"><label for="rM">Δ mínimo importante</label><div class="box"><input id="rM" inputmode="decimal"></div></div>
  </div>
  <svg class="ch" id="rPlot" style="margin-top:12px" role="img" aria-label="IC versus delta mínimo"></svg><div class="insight" id="rTxt"></div></div>
 <div class="card"><div class="card-h"><h3>Mesmo efeito, conclusões opostas?</h3><button class="more-btn" data-learn="same">Saiba mais</button></div>
  <div class="range"><label for="s2">Tamanho do estudo 2, em relação ao estudo 1</label><output id="s2o"></output><input type="range" id="s2" min="5" max="100" value="18"></div>
  <svg class="ch" id="s2Plot" style="margin-top:10px" role="img" aria-label="Dois estudos"></svg><div class="insight" id="s2Txt"></div></div>
 <div class="card"><div class="card-h"><h3>Interpretando RP, RR e OR com o IC</h3><button class="more-btn" data-learn="ratio">Saiba mais</button></div>
  <div class="chips" id="qPre"></div>
  <div class="fields" style="margin-top:10px">
   <div class="inp"><label for="qE">Razão</label><div class="box"><input id="qE" inputmode="decimal"></div></div>
   <div class="inp"><label for="qL">IC inferior</label><div class="box"><input id="qL" inputmode="decimal"></div></div>
   <div class="inp"><label for="qH">IC superior</label><div class="box"><input id="qH" inputmode="decimal"></div></div>
  </div>
  <svg class="ch" id="qPlot" style="margin-top:10px" role="img" aria-label="Forest plot"></svg><div class="insight" id="qTxt"></div></div>
</div>`,()=>{
  const setR=v=>{["rE","rL","rH","rM"].forEach((id,i)=>$(id).value=fmt(v[i],Number.isInteger(v[i])?0:1));renderRel();};chips($("rPre"),RP.map(r=>r[0]),i=>setR(RP[i][1]),0);setR(RP[0][1]);
  ["rE","rL","rH","rM"].forEach(id=>$(id).oninput=renderRel);$("s2").oninput=renderSame;
  const setQ=v=>{["qE","qL","qH"].forEach((id,i)=>$(id).value=fmt(v[i],2));renderRatio();};chips($("qPre"),RQ.map(r=>r[0]),i=>setQ(RQ[i][1]),0);setQ(RQ[0][1]);
  ["qE","qL","qH"].forEach(id=>$(id).oninput=renderRatio);
},()=>{renderRel();renderSame();renderRatio();});
function renderRel(){const [e,lo,hi,m]=["rE","rL","rH","rM"].map(id=>parse($(id).value)),el=$("rPlot");
  if(![e,lo,hi,m].every(has)||lo>hi||m<=0){el.innerHTML="";$("rTxt").textContent="Preencha estimativa, IC (inferior ≤ superior) e um Δ mínimo maior que zero.";return;}
  const a=Math.min(lo,0,-m*.3)-Math.abs(m)*.4,b=Math.max(hi,m)+Math.abs(m)*.4,H=120,Wd=box(el,H),L=14,iw=Wd-28,X=v=>L+(v-a)/(b-a)*iw;let s="";
  s+=`<rect x="${X(m)}" y="18" width="${Wd-14-X(m)}" height="${H-56}" fill="var(--good)" opacity=".08"/><line x1="${X(0)}" x2="${X(0)}" y1="18" y2="${H-38}" stroke="var(--tick)" stroke-dasharray="4 3"/><line x1="${X(m)}" x2="${X(m)}" y1="18" y2="${H-38}" stroke="var(--good)" stroke-width="2"/>`;
  s+=`<text x="${X(0)}" y="12" text-anchor="middle" style="font-size:11px">sem efeito</text><text x="${X(m)+4}" y="12" style="font-size:11px;fill:var(--good)">Δ mínimo importante</text>`;
  s+=`<line x1="${X(lo)}" x2="${X(hi)}" y1="52" y2="52" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/><circle cx="${X(e)}" cy="52" r="8" fill="var(--accent)"/>`+xAxis(X,nice(a,b,6).filter(v=>v>=a&&v<=b),H-34,v=>auto(v));el.innerHTML=s;
  let c,t;if(hi<0){c="Efeito na direção oposta";t="O IC inteiro está abaixo de zero: os dados sugerem dano ou efeito contrário ao esperado.";}
  else if(lo>=m){c="Significativo e clinicamente relevante";t="O IC inteiro está acima do Δ mínimo: mesmo o valor mais pessimista compatível com os dados é clinicamente importante.";}
  else if(lo>0&&hi<m){c="Significativo, mas clinicamente trivial";t="O IC exclui o zero, mas fica inteiro abaixo do Δ mínimo. É típico de amostras muito grandes: há efeito, mas pequeno demais para importar.";}
  else if(lo>0){c="Significativo, relevância incerta";t="O IC exclui o zero, mas é compatível tanto com efeitos triviais quanto com efeitos relevantes.";}
  else if(hi>=m){c="Inconclusivo, não “sem efeito”";t="O IC é largo: compatível com dano, com nenhum efeito e com benefício relevante. Faltou precisão, não efeito.";}
  else{c="Evidência contra efeito relevante";t="O IC inclui o zero, mas é estreito e fica abaixo do Δ mínimo: se houver efeito, ele é pequeno demais para importar.";}
  $("rTxt").innerHTML=`<b>${c}.</b> ${t}`;}
function renderSame(){const f=+$("s2").value/100,se1=5/zq(1-.002/2),se2=se1/Math.sqrt(f),p2=2*(1-Phi(5/se2));$("s2o").textContent=pct(f,0);
  const el=$("s2Plot"),H=124,Wd=box(el,H),L=74,iw=Wd-L-12,a=-8,b=18,X=v=>L+(v-a)/(b-a)*iw;let s=`<line x1="${X(0)}" x2="${X(0)}" y1="16" y2="${H-32}" stroke="var(--tick)" stroke-dasharray="4 3"/><text x="${X(0)}" y="11" text-anchor="middle" style="font-size:10.5px">sem efeito</text>`;
  [[se1,"Estudo 1",.002],[se2,"Estudo 2",p2]].forEach(([se,l,p],i)=>{const y=34+i*34,lo=5-1.96*se,hi=5+1.96*se;s+=`<text x="0" y="${y+4}" class="lbl">${l}</text><line x1="${X(Math.max(a,lo))}" x2="${X(Math.min(b,hi))}" y1="${y}" y2="${y}" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/><circle cx="${X(5)}" cy="${y}" r="6" fill="var(--accent)"/><text x="${Math.min(X(Math.min(b,hi))+4,Wd-70)}" y="${y-8}" style="font-size:11px">p ${p<.001?"< 0,001":"= "+fmt(p,3)}</text>`;});
  s+=xAxis(X,[-5,0,5,10,15],H-26,v=>v);el.innerHTML=s;
  $("s2Txt").innerHTML=`Os dois estudos estimam <b>o mesmo efeito</b> (5 unidades). O estudo 2 tem ${pct(f,0)} do tamanho do estudo 1 e, por isso, é mais impreciso (${pvEq(p2)}). Eles não se contradizem: chamar um de “positivo” e o outro de “negativo” é erro de interpretação.`;}
function renderRatio(){const e=parse($("qE").value),l=parse($("qL").value),h=parse($("qH").value),el=$("qPlot");if(![e,l,h].every(v=>has(v)&&v>0)||!(l<=e&&e<=h)){el.innerHTML="";$("qTxt").textContent="Digite uma razão e seu IC (inferior ≤ razão ≤ superior, todos maiores que zero).";return;}
  const c=l>1?"var(--alt)":h<1?"var(--good)":"var(--tick)";forest(el,[{name:"Sua razão",e,lo:l,hi:h,color:c}],{null:1,log:true,L:84});
  $("qTxt").innerHTML=`<b>${auto(e)} (${auto(l)} a ${auto(h)}):</b> `+(l>1?`associação positiva: o desfecho é mais frequente nos expostos. O IC inteiro está acima de 1; o aumento pode ir de ${pct(l-1,0)} a ${pct(h-1,0)}.`:h<1?`associação negativa, possível fator de proteção. O IC inteiro está abaixo de 1; a redução pode ir de ${pct(1-h,0)} a ${pct(1-l,0)}.`:`o IC inclui 1: compatível com aumento, ausência ou redução do risco.`)+` Precisão: ${h/l>4?"baixa (IC largo)":h/l>2?"moderada":"boa (IC estreito)"}.`;}
