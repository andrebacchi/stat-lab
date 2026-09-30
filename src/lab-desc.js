/* ===================== TELAS DESCRITIVAS (tendência central, dispersão, distribuições) ===================== */
const srt=a=>Array.from(sorted(a));
LAB("centro","Descritiva","Tendência central",`
  <div class="intro"><span class="eyebrow">Descritiva · 2</span><h2>Média, mediana e moda: quem representa o paciente típico?</h2><p>Escolha um conjunto de dados ou digite o seu. Arraste qualquer ponto no gráfico e veja quem se mexe: a média ou a mediana.</p></div>
  <div class="grid two">
    <div class="card wide"><div class="card-h"><h3>Dados</h3><button class="more-btn" data-learn="centro">Saiba mais</button></div>
      <div class="chips" id="cePresets"></div>
      <div style="margin-top:10px"><textarea class="data" id="ceData" aria-label="Dados separados por espaço ou ponto e vírgula"></textarea></div>
      <div class="row" style="margin-top:8px"><button class="btn small" id="ceAddOut">+ valor extremo</button><button class="btn small" id="ceDrop">− último valor</button><span class="note" id="ceUnit" style="margin:0"></span></div>
      <svg class="ch" id="cePlot" style="margin-top:12px" role="img" aria-label="Gráfico de pontos"></svg>
      <div class="legend"><span><i style="background:var(--accent)"></i>média</span><span><i class="dash"></i>mediana</span><span><i style="background:var(--good)"></i>moda</span></div>
      <div class="tiles" id="ceTiles" style="margin-top:12px"></div>
      <div class="insight" id="ceInsight"></div>
    </div>
    <div class="card wide"><div class="card-h"><h3>Passo a passo</h3></div><div id="ceSteps"></div></div>
  </div>
`,null,()=>renderCentro());
LAB("disp","Descritiva","Dispersão e boxplot",`
  <div class="intro"><span class="eyebrow">Descritiva · 3</span><h2>Dispersão: o quanto os dados se espalham</h2><p>Quartis, intervalo interquartil, outliers, variância, desvio padrão e coeficiente de variação, tudo no mesmo conjunto de dados.</p></div>
  <div class="grid two">
    <div class="card wide"><div class="card-h"><h3>Boxplot</h3><button class="more-btn" data-learn="box">Saiba mais</button></div>
      <div class="chips" id="dPresets"></div>
      <div style="margin-top:10px"><textarea class="data" id="dData" aria-label="Dados"></textarea></div>
      <div class="row" style="margin-top:10px;justify-content:space-between">
        <div class="seg" id="dBoxType"><button data-v="tukey">Tukey (moderno)</button><button data-v="orig">Original</button></div>
        <label class="toggle"><input type="checkbox" id="dTrain"> Calcular antes de ver</label>
      </div>
      <div class="row" style="margin-top:8px;gap:8px"><span class="mini">Quartis:</span><div class="seg" id="dQm"><button data-v="exc">Sem a mediana</button><button data-v="inc">Com a mediana</button><button data-v="t7">Interpolação</button></div></div>
      <svg class="ch" id="dPlot" style="margin-top:12px" role="img" aria-label="Boxplot"></svg>
      <div id="dTrainBox" hidden></div>
      <div class="tiles" id="dTiles" style="margin-top:12px"></div>
    </div>
    <div class="card"><div class="card-h"><h3>Variância e desvio padrão</h3><button class="more-btn" data-learn="dp">Saiba mais</button></div>
      <p class="lede">Quanto cada valor se afasta da média, elevado ao quadrado, e depois a média desses desvios.</p>
      <div class="tw" id="dTable"></div><div id="dVar"></div></div>
    <div class="card"><div class="card-h"><h3>Comparar dispersões (CV%)</h3><button class="more-btn" data-learn="cv">Saiba mais</button></div>
      <p class="lede">Quem varia mais: prematuros (1,5 kg ± 0,3) ou adultos obesos (120 kg ± 15)?</p>
      <div class="fields">
        <div class="inp"><label for="cvM1">Grupo A · média</label><div class="box"><input id="cvM1" inputmode="decimal" value="1,5"></div></div>
        <div class="inp"><label for="cvS1">Grupo A · DP</label><div class="box"><input id="cvS1" inputmode="decimal" value="0,3"></div></div>
        <div class="inp"><label for="cvM2">Grupo B · média</label><div class="box"><input id="cvM2" inputmode="decimal" value="120"></div></div>
        <div class="inp"><label for="cvS2">Grupo B · DP</label><div class="box"><input id="cvS2" inputmode="decimal" value="15"></div></div>
      </div>
      <svg class="ch" id="cvPlot" style="margin-top:12px" role="img" aria-label="Comparação de CV"></svg>
      <div class="insight" id="cvTxt"></div></div>
  </div>
`,null,()=>{renderDisp();renderCV();});
LAB("dist","Descritiva","Formas de distribuição",`
  <div class="intro"><span class="eyebrow">Descritiva · 4</span><h2>Normal ou assimétrica?</h2><p>Gere amostras de diferentes formatos e veja o que acontece com média, mediana e moda, e com a regra 68–95–99,7.</p></div>
  <div class="grid two">
    <div class="card wide"><div class="card-h"><h3>Histograma</h3><button class="more-btn" data-learn="dist">Saiba mais</button></div>
      <div class="chips" id="fShape"></div>
      <div class="grid two" style="margin-top:12px;gap:12px">
        <div class="range"><label for="fN">Tamanho da amostra</label><output id="fNo"></output><input type="range" id="fN" min="20" max="3000" step="10" value="500"></div>
        <div class="row" style="justify-content:flex-end"><label class="toggle"><input type="checkbox" id="fRule"> Regra 68–95–99,7</label><label class="toggle"><input type="checkbox" id="fFit" checked> Curva normal</label><button class="btn small" id="fNew">Nova amostra</button></div>
      </div>
      <div id="fNormCtl" class="fields" style="margin-top:10px">
        <div class="inp"><label for="fMu">Média (μ)</label><div class="box"><input id="fMu" inputmode="decimal" value="170"><span>cm</span></div></div>
        <div class="inp"><label for="fSd">Desvio padrão (σ)</label><div class="box"><input id="fSd" inputmode="decimal" value="8"><span>cm</span></div></div>
      </div>
      <svg class="ch" id="fPlot" style="margin-top:12px" role="img" aria-label="Histograma"></svg>
      <div class="legend"><span><i style="background:var(--accent)"></i>média</span><span><i class="dash"></i>mediana</span><span><i style="background:var(--good)"></i>moda (classe mais alta)</span></div>
      <div class="tiles" id="fTiles" style="margin-top:12px"></div>
      <div class="insight" id="fRec"></div>
    </div>
  </div>
`,null,()=>{if(!SS.data.length)newSample();renderDist();});
/* ===================== 2. TENDÊNCIA CENTRAL ===================== */
const CP=[["Internação por pneumonia (dias)",[5,3,4,5,7,6,120],"dias"],["Pesos de 3 objetos (kg)",[3,2,1],"kg"],["Salários da empresa (R$ mil)",[3.1,3.3,3.4,3.6,3.8,3.9,4,4.1,4.2,4.4,4.6,4.8,5,1000,5000],"R$ mil"],["Glicemia de jejum (mg/dL)",[92,88,95,101,97,90,99,94,96,93],"mg/dL"]];
const CS={data:[...CP[0][1]],unit:"dias"};
function renderCentro(){const a=CS.data;$("ceUnit").textContent=CS.unit?`Unidade: ${CS.unit}`:"";
  if(document.activeElement!==$("ceData"))$("ceData").value=a.map(v=>fmt(v,Number.isInteger(v)?0:1)).join("  ");
  const el=$("cePlot");if(a.length<1){el.innerHTML="";$("ceTiles").innerHTML="";$("ceSteps").innerHTML="";$("ceInsight").textContent="Digite pelo menos um valor.";return;}
  const m=mean(a),md=median(a),mo=modes(a),H=150,W=box(el,H),L=16,Rr=16,iw=W-L-Rr,lo=Math.min(...a),hi=Math.max(...a),pad=(hi-lo||1)*.06,X=v=>L+(v-(lo-pad))/((hi+pad)-(lo-pad))*iw,base=H-38;
  const stack=new Map();let s="";const ticks=nice(lo-pad,hi+pad,Math.max(3,Math.floor(iw/80)));s+=xAxis(X,ticks.filter(t=>t>=lo-pad&&t<=hi+pad),base+8);
  a.forEach((v,i)=>{const k=v.toFixed(6),n=stack.get(k)||0;stack.set(k,n+1);s+=`<circle class="dotp" data-i="${i}" cx="${X(v)}" cy="${base-8-n*15}" r="7" style="cursor:ew-resize" opacity=".85"/>`;});
  s+=`<line class="mean" x1="${X(m)}" x2="${X(m)}" y1="8" y2="${base+6}"/><line class="med" x1="${X(md)}" x2="${X(md)}" y1="8" y2="${base+6}"/>`;
  mo.forEach(v=>s+=`<circle cx="${X(v)}" cy="${base-8}" r="11" fill="none" stroke="var(--good)" stroke-width="2"/>`);
  s+=`<text x="${clamp(X(m),30,W-30)}" y="8" text-anchor="middle" class="lbl" style="fill:var(--accent)">média</text>`;
  el.innerHTML=s;
  $("ceTiles").innerHTML=`<div class="tile acc"><span>Média</span><b>${auto(m)}</b><small>soma ÷ n</small></div><div class="tile alt"><span>Mediana</span><b>${auto(md)}</b><small>valor do meio</small></div><div class="tile good"><span>Moda</span><b>${mo.length?mo.map(auto).join(" e "):"—"}</b><small>${mo.length?"mais frequente":"nenhum valor se repete"}</small></div><div class="tile"><span>n</span><b>${a.length}</b><small>observações</small></div>`;
  const s2=srt(a),n=a.length,mid=n%2?[(n-1)/2]:[n/2-1,n/2];
  $("ceSteps").innerHTML=`<span class="eyebrow">Média</span><div class="f">(${a.map(v=>auto(v)).join(" + ")}) ÷ ${n} = ${auto(sum(a))} ÷ ${n} = <b>${auto(m)}</b></div>
   <span class="eyebrow">Mediana: coloque em ordem crescente (rol) e pegue o meio</span><div class="f">${s2.map((v,i)=>mid.includes(i)?`<b style="color:var(--alt)">[${auto(v)}]</b>`:auto(v)).join("  ")}${n%2?"":`  →  (${auto(s2[mid[0]])} + ${auto(s2[mid[1]])}) ÷ 2 = <b>${auto(md)}</b>`}</div>
   <p class="note">${n%2?"Número ímpar de valores: a mediana é o valor do meio.":"Número par de valores: a mediana é a média dos dois valores do meio."}</p>`;
  const iqr=quartiles(a).q3-quartiles(a).q1,gap=Math.abs(m-md);
  $("ceInsight").className="insight"+(n>2&&gap>Math.max(iqr*.5,Math.abs(md)*.2)?" warn":"");
  $("ceInsight").innerHTML=n>2&&gap>Math.max(iqr*.5,Math.abs(md)*.2)?`A média (${auto(m)}) está longe da mediana (${auto(md)}): um ou mais valores extremos puxam a média para a cauda. Aqui, a <b>mediana</b> representa melhor o caso típico.`:`Média e mediana estão próximas: a distribuição é aproximadamente simétrica, e a <b>média</b> é uma boa medida-resumo.`;}
(function(){let drag=null;const el=$("cePlot");
  el.addEventListener("pointerdown",e=>{const c=e.target.closest("circle[data-i]");if(!c)return;drag=+c.dataset.i;el.setPointerCapture(e.pointerId);e.preventDefault();});
  el.addEventListener("pointermove",e=>{if(drag==null)return;const a=CS.data,lo=Math.min(...a),hi=Math.max(...a),pad=(hi-lo||1)*.06,W=el.viewBox.baseVal.width,pt=el.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(el.getScreenCTM().inverse());
    const v=(lo-pad)+(q.x-16)/(W-32)*((hi+pad)-(lo-pad));const r=hi-lo>50?0:hi-lo>5?1:2;a[drag]=Math.round(clamp(v,lo-pad*3,hi+pad*3)*10**r)/10**r;renderCentro();});
  const end=()=>drag=null;el.addEventListener("pointerup",end);el.addEventListener("pointercancel",end);})();
chips($("cePresets"),CP.map(p=>p[0]),i=>{CS.data=[...CP[i][1]];CS.unit=CP[i][2];renderCentro();},0);
$("ceData").addEventListener("input",e=>{CS.data=parseList(e.target.value);CS.unit="";renderCentro();});
$("ceAddOut").onclick=()=>{const a=CS.data;if(!a.length)return;a.push(Math.round(Math.max(...a)*5));renderCentro();};
$("ceDrop").onclick=()=>{CS.data.pop();renderCentro();};


/* ===================== 3. DISPERSÃO ===================== */
const DP_=[["Tempo até o atendimento (min)",[12,15,16,18,20,21,22,24,25,27,30,32,34,35,80]],["Internação por pneumonia (dias)",[5,3,4,5,7,6,120]],["Pesos de 3 objetos (kg)",[3,2,1]],["Glicemia de jejum (mg/dL)",[92,88,95,101,97,90,99,94,96,93]]];
const DS={data:[...DP_[0][1]],type:"tukey",qm:"exc",train:false,checked:false};
function dispStats(a){const q=quartiles(a,DS.qm),iqr=q.q3-q.q1,lf=q.q1-1.5*iqr,uf=q.q3+1.5*iqr,s=srt(a),out=s.filter(v=>v<lf||v>uf),inl=s.filter(v=>v>=lf&&v<=uf);
  return{...q,iqr,lf,uf,out,wlo:Math.min(...inl),whi:Math.max(...inl),min:s[0],max:s[s.length-1]};}
function renderDisp(){const a=DS.data;if(document.activeElement!==$("dData"))$("dData").value=a.map(v=>auto(v)).join("  ");
  if(a.length<3){$("dPlot").innerHTML="";$("dTiles").innerHTML=`<p class="note">Digite pelo menos 3 valores.</p>`;$("dTable").innerHTML="";$("dVar").innerHTML="";return;}
  const st=dispStats(a),el=$("dPlot"),H=190,W=box(el,H),L=16,Rr=16,iw=W-L-Rr,pad=(st.max-st.min||1)*.06,lo=st.min-pad,hi=st.max+pad,X=v=>L+(v-lo)/(hi-lo)*iw,yb=66,bh=46,hide=DS.train&&!DS.checked;let s="";
  const wl=DS.type==="tukey"?st.wlo:st.min,wh=DS.type==="tukey"?st.whi:st.max;
  if(!hide){s+=`<line class="wh" x1="${X(wl)}" x2="${X(st.q1)}" y1="${yb}" y2="${yb}"/><line class="wh" x1="${X(st.q3)}" x2="${X(wh)}" y1="${yb}" y2="${yb}"/><line class="wh" x1="${X(wl)}" x2="${X(wl)}" y1="${yb-10}" y2="${yb+10}"/><line class="wh" x1="${X(wh)}" x2="${X(wh)}" y1="${yb-10}" y2="${yb+10}"/>`;
    s+=`<rect class="box" x="${X(st.q1)}" y="${yb-bh/2}" width="${Math.max(1,X(st.q3)-X(st.q1))}" height="${bh}" rx="3"/><line x1="${X(st.q2)}" x2="${X(st.q2)}" y1="${yb-bh/2}" y2="${yb+bh/2}" stroke="var(--alt)" stroke-width="3"/>`;
    if(DS.type==="tukey")st.out.forEach(v=>s+=`<circle class="out" cx="${X(v)}" cy="${yb}" r="5"/>`);
    [["Q1",st.q1],["Md",st.q2],["Q3",st.q3]].forEach(([t,v])=>s+=`<text x="${X(v)}" y="${yb-bh/2-6}" text-anchor="middle" class="lbl" style="font-size:11px">${t}</text>`);
    if(DS.type==="tukey"&&st.iqr>0){[st.lf,st.uf].forEach(v=>{if(v>lo&&v<hi)s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${yb-24}" y2="${yb+24}" stroke="var(--bad)" stroke-dasharray="3 3"/>`;});}}
  else s+=`<text x="${W/2}" y="${yb+4}" text-anchor="middle" style="font-style:italic">Calcule os valores abaixo e toque em “Conferir”</text>`;
  const stack=new Map();srt(a).forEach(v=>{const k=v.toFixed(6),n=stack.get(k)||0;stack.set(k,n+1);s+=`<circle class="${!hide&&DS.type==="tukey"&&st.out.includes(v)?"out":"dotq"}" cx="${X(v)}" cy="${H-44-n*9}" r="4"/>`;});
  s+=xAxis(X,nice(lo,hi,Math.max(3,Math.floor(iw/80))).filter(t=>t>=lo&&t<=hi),H-34);el.innerHTML=s;
  const T=(l,v,sub,c="")=>`<div class="tile ${c}"><span>${l}</span><b>${v}</b>${sub?`<small>${sub}</small>`:""}</div>`;
  $("dTiles").innerHTML=hide?"":T("Amplitude",auto(st.max-st.min),`${auto(st.max)} − ${auto(st.min)}`)+T("Q1",auto(st.q1),"25%")+T("Mediana",auto(st.q2),"50%","alt")+T("Q3",auto(st.q3),"75%")+T("IIQ",auto(st.iqr),"Q3 − Q1","acc")+T("Limites",`${auto(st.lf)} a ${auto(st.uf)}`,"Q1 − 1,5·IIQ · Q3 + 1,5·IIQ")+T("Outliers",st.out.length?st.out.map(auto).join(", "):"nenhum","","bad");
  // treino
  const tb=$("dTrainBox");tb.hidden=!DS.train;
  if(DS.train&&!tb.dataset.built){tb.dataset.built="1";tb.innerHTML=`<p class="note">Método: mediana das metades${DS.qm==="inc"?" (incluindo a mediana)":DS.qm==="t7"?" (interpolação, como no Excel e no jamovi)":" (sem a mediana, quando n é ímpar)"}. Limites = Q1 − 1,5·IIQ e Q3 + 1,5·IIQ.</p><div class="fields">${["Mediana","Q1","Q3","IIQ","Limite inferior","Limite superior"].map((l,i)=>`<div class="inp"><label for="tr${i}">${l}</label><div class="box"><input id="tr${i}" inputmode="decimal"></div></div>`).join("")}<div class="inp"><label for="tr6">Outlier(s)<small>separe por espaço; vazio = nenhum</small></label><div class="box"><input id="tr6"></div></div></div><div class="row" style="margin-top:8px"><button class="btn small primary" id="trCheck">Conferir</button><button class="btn small" id="trReset">Tentar de novo</button></div><div id="trRes"></div>`;}
  if(DS.train&&DS.checked){const exp=[st.q2,st.q1,st.q3,st.iqr,st.lf,st.uf],names=["Mediana","Q1","Q3","IIQ","Limite inferior","Limite superior"];
    const rows=exp.map((v,i)=>{const u=parse($("tr"+i).value);const ok=has(u)&&Math.abs(u-v)<1e-6+Math.abs(v)*1e-3;return `<tr><td>${names[i]}</td><td>${has(u)?auto(u):"—"}</td><td>${auto(v)}</td><td class="${ok?"ok":"no"}">${ok?"✓":"✗"}</td></tr>`;});
    const uo=parseList($("tr6").value).sort((x,y)=>x-y),oko=uo.length===st.out.length&&uo.every((v,i)=>Math.abs(v-st.out[i])<1e-6);
    rows.push(`<tr><td>Outliers</td><td>${uo.length?uo.map(auto).join(", "):"nenhum"}</td><td>${st.out.length?st.out.map(auto).join(", "):"nenhum"}</td><td class="${oko?"ok":"no"}">${oko?"✓":"✗"}</td></tr>`);
    $("trRes").innerHTML=`<div class="tw" style="margin-top:10px"><table class="t"><thead><tr><th>Medida</th><th>Você</th><th>Correto</th><th></th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;}
  // variância
  const m=mean(a),n=a.length,rows=a.slice(0,25).map(v=>`<tr><td>${auto(v)}</td><td>${auto(v-m)}</td><td>${auto((v-m)**2)}</td></tr>`).join(""),ss=sum(a.map(v=>(v-m)**2)),vr=ss/(n-1),vp=ss/n,sdv=Math.sqrt(vr);
  $("dTable").innerHTML=`<table class="t"><thead><tr><th>Valor</th><th>Desvio (x − média)</th><th>Desvio²</th></tr></thead><tbody>${rows}${n>25?`<tr><td colspan="3" style="text-align:center">… mais ${n-25} valores</td></tr>`:""}<tr class="sum"><td>Soma</td><td>${auto(Math.abs(sum(a.map(v=>v-m)))<1e-9?0:sum(a.map(v=>v-m)))}</td><td>${auto(ss)}</td></tr></tbody></table>`;
  $("dVar").innerHTML=`<p class="note">A soma dos desvios é sempre zero: por isso eles são elevados ao quadrado.</p><div class="tiles" style="margin-top:8px"><div class="tile"><span>Variância amostral</span><b>${auto(vr)}</b><small>soma ÷ (n − 1)</small></div><div class="tile"><span>Variância populacional</span><b>${auto(vp)}</b><small>soma ÷ n</small></div><div class="tile acc"><span>Desvio padrão</span><b>${auto(sdv)}</b><small>√variância amostral</small></div><div class="tile"><span>CV%</span><b>${m?fmt(sdv/Math.abs(m)*100,1)+"%":"—"}</b><small>DP ÷ média × 100</small></div><div class="tile"><span>Erro padrão</span><b>${auto(sdv/Math.sqrt(n))}</b><small>DP ÷ √n</small></div></div>`;}
chips($("dPresets"),DP_.map(p=>p[0]),i=>{DS.data=[...DP_[i][1]];DS.checked=false;renderDisp();},0);
$("dData").addEventListener("input",e=>{DS.data=parseList(e.target.value);DS.checked=false;renderDisp();});
segBind($("dBoxType"),"tukey",v=>{DS.type=v;renderDisp();});
$("dTrain").addEventListener("change",e=>{DS.train=e.target.checked;DS.checked=false;renderDisp();});
$("dTrainBox").addEventListener("click",e=>{if(e.target.id==="trCheck"){DS.checked=true;renderDisp();}if(e.target.id==="trReset"){DS.checked=false;$("dTrainBox").querySelectorAll("input").forEach(i=>i.value="");$("trRes").innerHTML="";renderDisp();}});
function renderCV(){const g=[[parse($("cvM1").value),parse($("cvS1").value),"A"],[parse($("cvM2").value),parse($("cvS2").value),"B"]];const el=$("cvPlot");
  if(!g.every(x=>has(x[0])&&has(x[1])&&x[0]>0)){el.innerHTML="";$("cvTxt").textContent="Preencha médias (maiores que zero) e desvios padrão.";return;}
  const cv=g.map(x=>x[1]/x[0]*100),H=110,W=box(el,H),L=90,iw=W-L-60,mx=Math.max(...cv)*1.15;let s="";
  cv.forEach((c,i)=>{const y=18+i*44;s+=`<text x="0" y="${y+15}" class="lbl">Grupo ${g[i][2]}</text><rect x="${L}" y="${y}" width="${c/mx*iw}" height="22" rx="4" fill="${i?"var(--alt)":"var(--accent)"}" opacity=".85"/><text x="${L+c/mx*iw+6}" y="${y+15}" class="lbl">${fmt(c,1)}%</text>`;});
  el.innerHTML=s;const big=cv[0]>cv[1]?0:1;
  $("cvTxt").innerHTML=`Em desvio padrão absoluto, o grupo ${g[g[1][1]>g[0][1]?1:0][2]} varia mais (${auto(Math.max(g[0][1],g[1][1]))} contra ${auto(Math.min(g[0][1],g[1][1]))}). Em termos <b>relativos à média</b>, quem varia mais é o grupo ${g[big][2]} (CV ${fmt(cv[big],1)}%).`;}
["cvM1","cvS1","cvM2","cvS2"].forEach(id=>$(id).addEventListener("input",renderCV));


/* ===================== 4. DISTRIBUIÇÕES ===================== */
const SHAPES=[
 {n:"Normal",ctx:"Altura (cm)",gen:()=>SS.mu+SS.sd*randn()},
 {n:"Assimétrica à direita",ctx:"Tempo de internação (dias)",gen:()=>5*Math.exp(0.7*randn())},
 {n:"Assimétrica à esquerda",ctx:"Idade ao óbito (anos)",gen:()=>Math.max(20,97-9*Math.exp(0.6*randn()))},
 {n:"Bimodal",ctx:"PAS: normotensos + hipertensos (mmHg)",gen:()=>Math.random()<.5?118+8*randn():155+10*randn()},
];
const SS={shape:0,n:500,mu:170,sd:8,data:[],rule:false,fit:true};
function newSample(){SS.data=Array.from({length:SS.n},SHAPES[SS.shape].gen);}
function renderDist(){const a=SS.data,m=mean(a),md=median(a),s=sd(a);$("fNo").textContent=SS.n.toLocaleString("pt-BR");$("fNormCtl").hidden=SS.shape!==0;
  const lo=Math.min(...a),hi=Math.max(...a),bands=SS.rule?[[m-3*s,m+3*s,"var(--accent)",.06],[m-2*s,m+2*s,"var(--accent)",.08],[m-s,m+s,"var(--accent)",.12]]:[];
  const r=histo($("fPlot"),a,{h:240,min:lo,max:hi,bands,curve:SS.fit?(v=>npdf(v,m,s)):null,marks:[{v:m,cls:"mean"},{v:md,cls:"med"}]});
  const mi=r.cnt.indexOf(Math.max(...r.cnt)),mo=r.lo+(mi+.5)*r.bw;
  $("fPlot").insertAdjacentHTML("beforeend",`<line x1="${r.X(mo)}" x2="${r.X(mo)}" y1="14" y2="${240-30}" stroke="var(--good)" stroke-width="2"/>`);
  const w=k=>a.filter(v=>Math.abs(v-m)<=k*s).length/a.length,sk=skew(a),ku=kurt(a);
  $("fTiles").innerHTML=`<div class="tile acc"><span>Média</span><b>${auto(m)}</b></div><div class="tile alt"><span>Mediana</span><b>${auto(md)}</b></div><div class="tile good"><span>Moda (classe)</span><b>${auto(mo)}</b></div><div class="tile"><span>DP</span><b>${auto(s)}</b></div><div class="tile"><span>Assimetria</span><b>${fmt(sk,2)}</b><small>${Math.abs(sk)<.5?"≈ simétrica":sk>0?"cauda à direita":"cauda à esquerda"}</small></div><div class="tile"><span>Curtose</span><b>${fmt(ku,2)}</b><small>0 = normal</small></div>`+
    (SS.rule?`<div class="tile"><span>± 1 DP</span><b>${pct(w(1),0)}</b><small>normal: 68%</small></div><div class="tile"><span>± 2 DP</span><b>${pct(w(2),0)}</b><small>normal: 95%</small></div><div class="tile"><span>± 3 DP</span><b>${pct(w(3),1)}</b><small>normal: 99,7%</small></div>`:"");
  const sym=Math.abs(sk)<.5&&SS.shape!==3;
  $("fRec").className="insight"+(sym?"":" warn");
  $("fRec").innerHTML=`<b>${SHAPES[SS.shape].ctx}.</b> `+(SS.shape===3?`Dois picos: nenhuma medida-resumo única representa bem esses dados. Descreva os grupos separadamente.`:sym?`Distribuição simétrica: média, mediana e moda praticamente coincidem. Descreva com <b>média ± DP</b> e use histograma.`:`Distribuição assimétrica: a média é puxada para a cauda ${sk>0?"direita":"esquerda"} (média ${auto(m)} × mediana ${auto(md)}). Descreva com <b>mediana [IIQ]</b> e use boxplot.`);}
chips($("fShape"),SHAPES.map(x=>x.n),i=>{SS.shape=i;newSample();renderDist();},0);
$("fN").addEventListener("input",e=>{SS.n=+e.target.value;newSample();renderDist();});
$("fNew").onclick=()=>{newSample();renderDist();};
$("fRule").addEventListener("change",e=>{SS.rule=e.target.checked;renderDist();});
$("fFit").addEventListener("change",e=>{SS.fit=e.target.checked;renderDist();});
["fMu","fSd"].forEach(id=>$(id).addEventListener("input",()=>{const m=parse($("fMu").value),s=parse($("fSd").value);if(has(m)&&has(s)&&s>0){SS.mu=m;SS.sd=s;newSample();renderDist();}}));



segBind($("dQm"),"exc",v=>{DS.qm=v;DS.checked=false;const tb=$("dTrainBox");delete tb.dataset.built;tb.innerHTML="";renderDisp();});
