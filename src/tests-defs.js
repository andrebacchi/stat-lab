/* ===================== LABORATÓRIO DE TESTES: testes ===================== */
const icL=()=>`IC ${fmt((1-TS.alpha)*100,0)}%`, conf=()=>1-TS.alpha;
const nm=(s,f)=>s&&s.trim()?s.trim():f;
const ADVS=/^(Distribuição (de |exata)|Aproximação normal|Quantos eventos esperar|Os mesmos dados convertidos|Resíduos)/;
function slot(div,title,note){div.insertAdjacentHTML("beforeend",`<div class="${ADVS.test(title)?"adv":""}"><div class="sub">${title}</div>${note?`<p class="note" style="margin:-2px 0 6px">${note}</p>`:""}<svg class="ch" role="img" aria-label="${esc(title)}"></svg></div>`);return div.lastElementChild.lastElementChild;}
function verdict(p){const a=TS.alpha;return p<a?`Com α = ${fmt(a,2)}, <b>rejeita-se H₀</b>: dados como estes seriam raros (${pvEq(p)}) se não houvesse ${this&&this.what||"diferença"}.`:`Com α = ${fmt(a,2)}, <b>não se rejeita H₀</b> (${pvEq(p)}). Os dados são compatíveis com ausência de efeito, mas isso não prova que o efeito seja zero: veja a largura do intervalo.`;}
const V=(p,what)=>verdict.call({what},p);
function nullT(svg,t,df,lab="t"){const lim=clamp(Math.abs(t)*1.15,4.5,12),c=tq(1-TS.alpha/2,df);nullPlot(svg,{range:[-lim,lim],pdf:v=>tpdf(v,df),tails:[[Math.abs(t),lim],[-lim,-Math.abs(t)]],crit:[-c,c],obs:t,obsLabel:`${lab} = ${fmt(t,2)}`});}
function nullZ(svg,z,lab="z"){const lim=clamp(Math.abs(z)*1.15,4,12),c=zq(1-TS.alpha/2);nullPlot(svg,{range:[-lim,lim],pdf:v=>npdf(v),tails:[[Math.abs(z),lim],[-lim,-Math.abs(z)]],crit:[-c,c],obs:z,obsLabel:`${lab} = ${fmt(z,2)}`});}
function nullChi(svg,X,df,lab="χ²"){const c=chiQ(1-TS.alpha,df),hi=Math.max(c*1.7,X*1.12,df+4*Math.sqrt(2*df));nullPlot(svg,{range:[0,hi],pdf:v=>chipdf(Math.max(v,df<2?hi/400:0),df),tails:[[X,hi]],crit:[c],obs:X,obsLabel:`${lab} = ${fmt(X,2)}`});}
function nullF(svg,F,d1,d2){const c=fQ(1-TS.alpha,d1,d2),hi=Math.max(c*1.8,F*1.12,4);nullPlot(svg,{range:[0,hi],pdf:v=>fpdf(Math.max(v,d1<2?hi/400:1e-6),d1,d2),tails:[[F,hi]],crit:[c],obs:F,obsLabel:`F = ${fmt(F,2)}`});}
function chiQ(p,df){let lo=0,hi=Math.max(10,df*10);for(let i=0;i<100;i++){const m=(lo+hi)/2;(1-chiSurv(m,df))<p?lo=m:hi=m;}return(lo+hi)/2;}
function fQ(p,d1,d2){let lo=0,hi=200;for(let i=0;i<100;i++){const m=(lo+hi)/2;(1-fSurv(m,d1,d2))<p?lo=m:hi=m;}return(lo+hi)/2;}
function exactPmf(svg,D,obs,k0,lab){const n=D.pmf.length-1+k0,mid=(k0+n)/2,dist=Math.abs(obs-mid);let pmf=D.pmf,s=k0;if(pmf.length>160){const m=pmf.indexOf(Math.max(...pmf)),w=Math.max(40,Math.ceil(Math.abs(obs-k0-m)*1.2));const a=Math.max(0,m-w),b=Math.min(pmf.length-1,m+w);pmf=pmf.slice(a,b+1);s=k0+a;}
  pmfPlot(svg,pmf,{k0:s,obs:Math.round(obs),obsLabel:`${lab} = ${auto(obs)}`,isExt:k=>Math.abs(k-mid)>=dist-1e-9});}
function swRows(list){return `<div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>n</th><th>Shapiro-Wilk W</th><th>p</th><th></th></tr></thead><tbody>${list.map(([n,v])=>{const s=v.length>=3?shapiro(v):null;return `<tr><td>${esc(n)}</td><td>${v.length}</td><td>${s?fmt(s.W,3):"—"}</td><td>${s?pv(s.p):"—"}</td><td class="${s&&s.p<.05?"no":"ok"}">${s?(s.p<.05?"desvio da normalidade":"sem evidência de desvio"):""}</td></tr>`;}).join("")}</tbody></table></div>`;}
const sdRatio=D=>{const s=D.map(x=>x.s),r=Math.max(...s)/Math.min(...s);return `<p class="note">Razão entre o maior e o menor DP: <b>${fmt(r,2)}</b>. ${r>2?"Variâncias bem diferentes: prefira a versão de Welch.":"Variâncias parecidas."}</p>`;};
const normNote=`<p class="note">Com amostras grandes (n ≥ 30 por grupo), o teste é robusto a desvios moderados da normalidade graças ao Teorema Central do Limite. Com amostras pequenas e dados assimétricos, prefira a alternativa não paramétrica.</p>`;
const npNote=`<p class="note">Testes não paramétricos usam os postos (a ordem) dos valores, não os valores em si. Não exigem distribuição normal e são pouco afetados por outliers, mas testam principalmente se um grupo tende a ter valores maiores que o outro.</p>`;
function slopeChart(svg,a,b,na,nb){const H=240,W=box(svg,H),L=46,R=16,T=14,Bt=30,x1=L+Math.min(80,W*.18),x2=W-R-Math.min(80,W*.18),all=[...a,...b],[lo,hi]=niceDom(Math.min(...all),Math.max(...all)),Y=v=>T+(H-T-Bt)-(v-lo)/(hi-lo)*(H-T-Bt);let s=yGrid(Y,nice(lo,hi,4).filter(t=>t>=lo&&t<=hi),L,W-R);
  a.forEach((v,i)=>{const up=b[i]>v;s+=`<line x1="${x1}" x2="${x2}" y1="${Y(v)}" y2="${Y(b[i])}" stroke="${up?"var(--g2)":"var(--g1)"}" stroke-opacity=".55" stroke-width="1.6"/><circle cx="${x1}" cy="${Y(v)}" r="3.5" fill="var(--g1)"/><circle cx="${x2}" cy="${Y(b[i])}" r="3.5" fill="var(--g2)"/>`;});
  const ma=mean(a),mb=mean(b);s+=`<line x1="${x1}" x2="${x2}" y1="${Y(ma)}" y2="${Y(mb)}" stroke="var(--fg)" stroke-width="3.5"/><text x="${x1}" y="${H-8}" text-anchor="middle" class="lbl">${esc(na)}</text><text x="${x2}" y="${H-8}" text-anchor="middle" class="lbl">${esc(nb)}</text>`;
  const up=a.filter((v,i)=>b[i]>v).length,dn=a.filter((v,i)=>b[i]<v).length;s+=`<text x="${W-R}" y="${T+4}" text-anchor="end" style="font-size:11px"><tspan style="fill:var(--g2)">↑ ${up} aumentaram</tspan>  <tspan style="fill:var(--g1)">↓ ${dn} diminuíram</tspan></text>`;svg.innerHTML=s;}
function lineChart(svg,cols,names){const k=cols.length,n=cols[0].length,H=250,W=box(svg,H),L=46,R=20,T=14,Bt=30,all=cols.flat(),[lo,hi]=niceDom(Math.min(...all),Math.max(...all)),Y=v=>T+(H-T-Bt)-(v-lo)/(hi-lo)*(H-T-Bt),X=j=>L+30+j*(W-L-R-60)/Math.max(1,k-1);let s=yGrid(Y,nice(lo,hi,4).filter(t=>t>=lo&&t<=hi),L,W-R);
  for(let i=0;i<n;i++)s+=`<polyline points="${cols.map((c,j)=>X(j)+","+Y(c[i])).join(" ")}" fill="none" stroke="var(--tick)" stroke-opacity=".5" stroke-width="1.2"/>`;
  const D=cols.map(descr);D.forEach((d,j)=>{const q=tq(.975,d.n-1);s+=`<line x1="${X(j)}" x2="${X(j)}" y1="${Y(d.m-q*d.se)}" y2="${Y(d.m+q*d.se)}" stroke="var(--accent)" stroke-width="3"/>`;});
  s+=`<polyline points="${D.map((d,j)=>X(j)+","+Y(d.m)).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="3.5"/>`+D.map((d,j)=>`<circle cx="${X(j)}" cy="${Y(d.m)}" r="5.5" fill="var(--accent)"/><text x="${X(j)}" y="${H-8}" text-anchor="middle" class="lbl">${esc(names[j])}</text>`).join("");svg.innerHTML=s;}
function stackBars(svg,tab,rn,cn){const r=tab.length,H=r*42+44,W=box(svg,H),L=Math.min(120,W*.3),R=12,iw=W-L-R;let s="";
  tab.forEach((row,i)=>{const t=sum(row);let x=L;const y=12+i*42;s+=`<text x="0" y="${y+18}" class="lbl" style="font-size:12px">${esc(rn[i])}</text>`;row.forEach((v,j)=>{const w=t?v/t*iw:0;s+=`<rect x="${x}" y="${y}" width="${Math.max(0,w-1)}" height="28" fill="${GC[j%5]}" opacity="${j?0.55:0.9}"/>`;if(w>34)s+=`<text x="${x+w/2}" y="${y+18}" text-anchor="middle" style="fill:var(--surface);font-size:11.5px;font-weight:600">${pct(t?v/t:0,0)}</text>`;x+=w;});});
  s+=`<g transform="translate(${L},${H-14})">`+cn.map((c,j)=>`<rect x="${j*Math.min(150,iw/cn.length)}" y="-9" width="10" height="10" fill="${GC[j%5]}" opacity="${j?0.55:0.9}"/><text x="${j*Math.min(150,iw/cn.length)+14}" y="0" style="font-size:11.5px">${esc(c)}</text>`).join("")+`</g>`;svg.innerHTML=s;}
function kmPlot(svg,gs,names,unit){const H=260,W=box(svg,H),L=40,R=14,T=12,Bt=34,iw=W-L-R,ih=H-T-Bt,K=gs.map(kmCurve),tmax=Math.max(...K.map(k=>k.last))||1,X=t=>L+t/tmax*iw,Y=s=>T+ih-s*ih;let s=yGrid(Y,[0,.25,.5,.75,1],L,W-R,v=>pct(v,0));
  s+=`<line x1="${L}" x2="${W-R}" y1="${Y(.5)}" y2="${Y(.5)}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
  K.forEach((k,i)=>{let p=`M${X(0)},${Y(1)}`,prev=1;k.pts.slice(1).forEach(([t,S])=>{p+=`L${X(t)},${Y(prev)}L${X(t)},${Y(S)}`;prev=S;});p+=`L${X(k.last)},${Y(prev)}`;s+=`<path d="${p}" fill="none" stroke="${GC[i]}" stroke-width="2.4"/>`;
    k.cens.forEach(([t,S])=>s+=`<line x1="${X(t)}" x2="${X(t)}" y1="${Y(S)-5}" y2="${Y(S)+5}" stroke="${GC[i]}" stroke-width="1.6"/>`);
    if(k.med!=null)s+=`<line x1="${X(k.med)}" x2="${X(k.med)}" y1="${Y(.5)}" y2="${T+ih}" stroke="${GC[i]}" stroke-dasharray="3 3"/>`;
    s+=`<text x="${W-R}" y="${T+14+i*16}" text-anchor="end" class="lbl" style="font-size:12px;fill:${GC[i]}">${esc(names[i])}</text>`;});
  s+=xAxis(X,nice(0,tmax,Math.max(3,Math.floor(iw/70))).filter(t=>t<=tmax),T+ih,v=>auto(v),L,W-R)+`<text x="${W-R}" y="${H-1}" text-anchor="end" style="font-size:11px">tempo${unit?" ("+esc(unit)+")":""} · traço vertical = censura</text>`;svg.innerHTML=s;}
function pairTable(groups,names,fn,lab){const rows=[],ps=[];for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++){const r=fn(groups[i],groups[j]);rows.push([names[i],names[j],r]);ps.push(r.p);}const adj=holm(ps);
  return `<div class="tw"><table class="t"><thead><tr><th>Comparação</th><th>${lab}</th><th>p</th><th>p (Holm)</th></tr></thead><tbody>${rows.map(([a,b,r],i)=>`<tr><td>${esc(a)} × ${esc(b)}</td><td>${r.lab}</td><td>${pv(r.p)}</td><td class="${adj[i]<TS.alpha?"ok":""}">${pv(adj[i])}</td></tr>`).join("")}</tbody></table></div><p class="note">A correção de Holm controla a chance de falsos positivos ao fazer várias comparações.</p>`;}

const TESTS={
 t1:{name:"t para uma amostra",kind:"one",fam:"Uma amostra",alt:"w1",sims:["t1","w1"],
  check:d=>d.v.length>=2&&has(d.mu0)?null:"Informe pelo menos 2 valores e o valor de referência.",
  p:d=>tOne(d.v,d.mu0).p,eff:d=>mean(d.v)-d.mu0,effName:"Diferença média",trueEff:P=>P.m-P.mu0,
  show(d,S){const r=tOne(d.v,d.mu0,conf()),N=nm(d.name,"a variável");
   dotRows(slot(S.main,"Os dados","◆ média com "+icL()+" · linha vermelha: valor de referência"),[{v:d.v,name:N}],{ref:d.mu0,refLabel:`μ₀ = ${auto(d.mu0)}`,rowH:110});
   forest(slot(S.a,`Diferença para μ₀ (${icL()})`),[{name:"média − μ₀",e:r.diff,lo:r.lo-d.mu0,hi:r.hi-d.mu0}],{null:0});
   nullT(slot(S.b,"Distribuição de t se H₀ fosse verdadeira","Área sombreada = valor de p. Linhas vermelhas = valores críticos."),r.t,r.df);
   S.tiles.innerHTML=tile("Média",auto(r.m),`DP ${auto(r.s)} · n = ${r.n}`)+tile("Diferença",auto(r.diff),`${icL()}: ${auto(r.lo-d.mu0)} a ${auto(r.hi-d.mu0)}`,"acc")+tile("t",fmt(r.t,2),`gl = ${r.df}`)+tile("p",pv(r.p),"bicaudal",r.p<TS.alpha?"acc":"")+tile("d de Cohen",fmt(r.dz,2),"diferença ÷ DP");
   S.rel(`A média de ${N} foi ${auto(r.m)} (DP ${auto(r.s)}; n = ${r.n}), ${r.diff>=0?"acima":"abaixo"} do valor de referência de ${auto(d.mu0)} em ${auto(Math.abs(r.diff))} (${icL()} da diferença: ${auto(r.lo-d.mu0)} a ${auto(r.hi-d.mu0)}); t(${r.df}) = ${fmt(r.t,2)}; ${pvEq(r.p)}.`,V(r.p));
   S.ass.innerHTML=swRows([[N,d.v]])+normNote;}},
 w1:{name:"Wilcoxon para uma amostra",kind:"one",fam:"Uma amostra",alt:"t1",sims:["t1","w1"],np:true,
  check:d=>d.v.length>=2&&has(d.mu0)?null:"Informe pelo menos 2 valores e o valor de referência.",
  p:d=>wilcoxonSR(d.v,d.mu0).p,eff:d=>median(d.v)-d.mu0,effName:"Mediana − μ₀",trueEff:P=>P.shape==="norm"||P.shape==="out"||P.shape==="unif"?P.m-P.mu0:null,
  show(d,S){const r=wilcoxonSR(d.v,d.mu0),N=nm(d.name,"a variável"),q=quartiles(d.v,"t7"),ab=d.v.filter(v=>v>d.mu0).length,be=d.v.filter(v=>v<d.mu0).length;
   dotRows(slot(S.main,"Os dados","A linha laranja do boxplot é a mediana · linha vermelha: valor de referência"),[{v:d.v,name:N}],{ref:d.mu0,refLabel:`μ₀ = ${auto(d.mu0)}`,meanCI:false,rowH:110});
   if(r.exact)exactPmf(slot(S.a,"Distribuição exata de V se H₀ fosse verdadeira","V = soma dos postos das diferenças positivas. Barras azuis: tão ou mais extremas que o observado."),srDist(r.n),r.V,0,"V");
   else nullZ(slot(S.a,"Aproximação normal (há empates ou n ≥ 50)"),r.z);
   S.tiles.innerHTML=tile("Mediana",auto(r.md),`IIQ ${auto(q.q1)}–${auto(q.q3)}`)+tile("Acima · abaixo de μ₀",`${ab} · ${be}`,r.zeros?`${r.zeros} iguais a μ₀ (excluídos)`:"")+tile("V",fmt(r.V,1),r.exact?"p exato":"aproximação normal")+tile("p",pv(r.p),"bicaudal",r.p<TS.alpha?"acc":"")+tile("r (rank-biserial)",fmt(r.rrb,2),"tamanho de efeito");
   S.rel(`A mediana de ${N} foi ${auto(r.md)} (IIQ ${auto(q.q1)}–${auto(q.q3)}; n = ${d.v.length}). Teste de Wilcoxon contra ${auto(d.mu0)}: V = ${fmt(r.V,1)}; ${pvEq(r.p)}; r = ${fmt(r.rrb,2)}.`,V(r.p));
   S.ass.innerHTML=npNote+`<p class="note">O teste de Wilcoxon supõe que as diferenças em relação a μ₀ sejam distribuídas de forma aproximadamente simétrica.</p>`;}},
 sw:{name:"Shapiro-Wilk (normalidade)",kind:"one",fam:"Uma amostra",sims:["sw"],nomu:true,
  check:d=>d.v.length>=3?null:"Informe pelo menos 3 valores.",
  p:d=>{const s=shapiro(d.v);return s?s.p:1;},eff:d=>skew(d.v),effName:"Assimetria",trueEff:P=>P.shape==="norm"?0:null,
  show(d,S){const r=shapiro(d.v),x=descr(d.v),N=nm(d.name,"a variável");if(!r){S.tiles.innerHTML=`<p class="note">Os valores precisam variar.</p>`;return;}
   histo(slot(S.main,"Histograma com a curva normal de mesma média e DP"),d.v,{h:210,curve:v=>npdf(v,x.m,x.s)});qqplot(slot(S.a,"Gráfico Q-Q","Pontos sobre a linha: dados compatíveis com a normal."),d.v);
   S.tiles.innerHTML=tile("W",fmt(r.W,3),"1 = normal perfeita")+tile("p",pv(r.p),"",r.p<TS.alpha?"bad":"good")+tile("Assimetria",fmt(skew(d.v),2))+tile("n",x.n);
   S.rel(`O teste de Shapiro-Wilk para ${N} resultou em W = ${fmt(r.W,3)}; ${pvEq(r.p)} (n = ${x.n}).`,r.p<TS.alpha?`Com α = ${fmt(TS.alpha,2)}, rejeita-se a hipótese de normalidade.`:`Não há evidência de desvio da normalidade. Com amostras pequenas o teste tem pouco poder; com amostras enormes, qualquer desvio mínimo vira “significativo”. Olhe sempre os gráficos.`);
   S.ass.innerHTML=`<p class="note">H₀ do Shapiro-Wilk: os dados vêm de uma distribuição normal. Aqui, um p pequeno é que indica problema.</p>`;}},
 bin:{name:"Binomial (proporção × referência)",kind:"prop",fam:"Uma amostra",sims:["bin"],
  check:d=>d.n>=1&&d.x>=0&&d.x<=d.n&&d.p0>0&&d.p0<1?null:"Eventos entre 0 e n, referência entre 0 e 100%.",
  p:d=>binomTest(d.x,d.n,d.p0).p,eff:d=>d.x/d.n,effName:"Proporção observada",trueEff:P=>P.p,
  show(d,S){const r=binomTest(d.x,d.n,d.p0),N=nm(d.name,"eventos");
   forest(slot(S.main,`Proporção observada com IC 95% (Wilson) e a referência`),[{name:N,e:r.ph,lo:r.lo,hi:r.hi}],{null:d.p0,dom:[0,Math.min(1,Math.max(r.hi,d.p0)*1.3+.02)],fmt:v=>pct(v,0)});
   const sd0=Math.sqrt(d.n*d.p0*(1-d.p0)),a=Math.max(0,Math.floor(Math.min(d.x,d.n*d.p0-5*sd0))),b=Math.min(d.n,Math.ceil(Math.max(d.x,d.n*d.p0+5*sd0))),po=r.pmf[d.x];
   pmfPlot(slot(S.a,`Quantos eventos esperar se a proporção fosse ${pct(d.p0,0)}`,"Barras azuis: resultados tão ou menos prováveis que o observado (somam o p)."),r.pmf.slice(a,b+1),{k0:a,obs:d.x,obsLabel:`${d.x} de ${d.n}`,isExt:(k,q)=>q<=po*(1+1e-7)});
   S.tiles.innerHTML=tile("Proporção",pct(r.ph,1),`${d.x} de ${d.n}`,"acc")+tile("IC 95%",`${pct(r.lo,1)} a ${pct(r.hi,1)}`,"Wilson")+tile("Referência",pct(d.p0,1))+tile("p",pv(r.p),"exato, bicaudal",r.p<TS.alpha?"acc":"");
   S.rel(`Foram observados ${d.x} ${N} em ${d.n} (${pct(r.ph,1)}; IC 95% ${pct(r.lo,1)} a ${pct(r.hi,1)}), comparados à referência de ${pct(d.p0,1)}; teste binomial exato, ${pvEq(r.p)}.`,V(r.p));
   S.ass.innerHTML=`<p class="note">Supõe observações independentes, cada uma com a mesma probabilidade de evento.</p>`;}},
 tind:{name:"t independente",kind:"two",fam:"Dois grupos independentes",alt:"mw",sims:["tind","mw"],opt:"welch",
  check:d=>d.a.length>=2&&d.b.length>=2?null:"Cada grupo precisa de pelo menos 2 valores.",
  p:d=>tInd(d.a,d.b).p,eff:d=>mean(d.a)-mean(d.b),effName:"Diferença de médias",trueEff:P=>P.ma-P.mb,
  show(d,S){const st=!!TS.student,r=tInd(d.a,d.b,st,conf()),na=nm(d.na,"Grupo 1"),nb=nm(d.nb,"Grupo 2"),N=nm(d.name,"a variável"),tn=st?"t de Student":"t de Welch";
   dotRows(slot(S.main,"Os dados","◆ média com "+icL()+" · caixa: boxplot"),[{v:d.a,name:na},{v:d.b,name:nb}]);
   forest(slot(S.a,`Diferença de médias (${na} − ${nb}) com ${icL()}`,"Se o intervalo cruza o zero, os dados são compatíveis com ausência de diferença."),[{name:"diferença",e:r.diff,lo:r.lo,hi:r.hi}],{null:0});
   nullT(slot(S.b,`Distribuição de t se H₀ fosse verdadeira (gl = ${fmt(r.df,1)})`),r.t,r.df);
   S.tiles.innerHTML=tile(na,auto(r.a.m),`DP ${auto(r.a.s)} · n = ${r.a.n}`)+tile(nb,auto(r.b.m),`DP ${auto(r.b.s)} · n = ${r.b.n}`)+tile("Diferença",auto(r.diff),`${icL()}: ${auto(r.lo)} a ${auto(r.hi)}`,"acc")+tile(tn,fmt(r.t,2),`gl = ${fmt(r.df,1)}`)+tile("p",pv(r.p),"bicaudal",r.p<TS.alpha?"acc":"")+tile("d de Cohen",fmt(r.d,2),`IC 95%: ${fmt(r.dlo,2)} a ${fmt(r.dhi,2)}`);
   S.rel(`${N}: média de ${auto(r.a.m)} (DP ${auto(r.a.s)}) em ${na} e ${auto(r.b.m)} (DP ${auto(r.b.s)}) em ${nb}; diferença de ${auto(r.diff)} (${icL()}: ${auto(r.lo)} a ${auto(r.hi)}); ${tn}(${fmt(r.df,1)}) = ${fmt(r.t,2)}; ${pvEq(r.p)}; d de Cohen = ${fmt(r.d,2)}.`,V(r.p));
   S.ass.innerHTML=swRows([[na,d.a],[nb,d.b]])+sdRatio([r.a,r.b])+normNote;}},
 mw:{name:"Mann-Whitney",kind:"two",fam:"Dois grupos independentes",alt:"tind",sims:["tind","mw"],np:true,
  check:d=>d.a.length>=1&&d.b.length>=1&&d.a.length+d.b.length>=3?null:"Informe valores nos dois grupos.",
  p:d=>mannWhitney(d.a,d.b).p,eff:d=>median(d.a)-median(d.b),effName:"Diferença de medianas",trueEff:P=>P.shape==="skew"?null:P.ma-P.mb,
  show(d,S){const r=mannWhitney(d.a,d.b),na=nm(d.na,"Grupo 1"),nb=nm(d.nb,"Grupo 2"),N=nm(d.name,"a variável"),qa=quartiles(d.a,"t7"),qb=quartiles(d.b,"t7"),ps=r.U/(r.n1*r.n2);
   dotRows(slot(S.main,"Os dados","A linha laranja de cada boxplot é a mediana"),[{v:d.a,name:na},{v:d.b,name:nb}],{meanCI:false});
   if(r.exact)exactPmf(slot(S.a,"Distribuição exata de U se H₀ fosse verdadeira","U conta quantos pares têm o valor do primeiro grupo maior que o do segundo. Barras azuis: tão ou mais extremas que o observado."),mwDist(r.n1,r.n2),r.U,0,"U");
   else nullZ(slot(S.a,"Aproximação normal (há empates ou n ≥ 50)"),r.z);
   S.tiles.innerHTML=tile(na,auto(r.mdA),`mediana · IIQ ${auto(qa.q1)}–${auto(qa.q3)}`)+tile(nb,auto(r.mdB),`mediana · IIQ ${auto(qb.q1)}–${auto(qb.q3)}`)+tile("U",fmt(r.U,1),r.exact?"p exato":"aproximação normal")+tile("p",pv(r.p),"bicaudal",r.p<TS.alpha?"acc":"")+tile("P(1 > 2)",pct(ps,0),`chance de um valor de ${na} superar um de ${nb}`,"acc")+tile("r (rank-biserial)",fmt(r.rrb,2));
   S.rel(`${N}: mediana de ${auto(r.mdA)} (IIQ ${auto(qa.q1)}–${auto(qa.q3)}) em ${na} e ${auto(r.mdB)} (IIQ ${auto(qb.q1)}–${auto(qb.q3)}) em ${nb}; Mann-Whitney U = ${fmt(r.U,1)}; ${pvEq(r.p)}; r = ${fmt(r.rrb,2)}.`,V(r.p));
   S.ass.innerHTML=npNote;}},
 tpar:{name:"t pareado",kind:"pair",fam:"Dois momentos (pareados)",alt:"wsr",sims:["tpar","wsr"],
  check:d=>d.a.length===d.b.length&&d.a.length>=2?null:"Os dois momentos precisam ter o mesmo número de valores (um por participante, na mesma ordem).",
  p:d=>tOne(d.b.map((v,i)=>v-d.a[i]),0).p,eff:d=>mean(d.b)-mean(d.a),effName:"Mudança média",trueEff:P=>P.c,
  show(d,S){const df=d.b.map((v,i)=>v-d.a[i]),r=tOne(df,0,conf()),na=nm(d.na,"Antes"),nb=nm(d.nb,"Depois"),N=nm(d.name,"a variável");
   slopeChart(slot(S.main,"Cada linha é um participante","Linha grossa: médias"),d.a,d.b,na,nb);
   dotRows(slot(S.a,`Diferenças (${nb} − ${na}) com ${icL()}`),[{v:df,name:"diferença"}],{ref:0,refLabel:"sem mudança",rowH:100});
   nullT(slot(S.b,"Distribuição de t se H₀ fosse verdadeira"),r.t,r.df);
   S.tiles.innerHTML=tile(na,auto(mean(d.a)),`DP ${auto(sd(d.a))}`)+tile(nb,auto(mean(d.b)),`DP ${auto(sd(d.b))}`)+tile("Mudança média",auto(r.m),`${icL()}: ${auto(r.lo)} a ${auto(r.hi)}`,"acc")+tile("t",fmt(r.t,2),`gl = ${r.df}`)+tile("p",pv(r.p),"bicaudal",r.p<TS.alpha?"acc":"")+tile("dz",fmt(r.dz,2),"mudança ÷ DP das diferenças");
   S.rel(`${N} passou de ${auto(mean(d.a))} (DP ${auto(sd(d.a))}) para ${auto(mean(d.b))} (DP ${auto(sd(d.b))}); mudança média de ${auto(r.m)} (${icL()}: ${auto(r.lo)} a ${auto(r.hi)}; n = ${r.n} pares); t pareado(${r.df}) = ${fmt(r.t,2)}; ${pvEq(r.p)}.`,V(r.p));
   S.ass.innerHTML=swRows([["Diferenças",df]])+`<p class="note">No teste pareado, o que precisa ser aproximadamente normal é a distribuição das <b>diferenças</b>, não de cada momento.</p>`;}},
 wsr:{name:"Wilcoxon pareado",kind:"pair",fam:"Dois momentos (pareados)",alt:"tpar",sims:["tpar","wsr"],np:true,
  check:d=>d.a.length===d.b.length&&d.a.length>=2?null:"Os dois momentos precisam ter o mesmo número de valores.",
  p:d=>wilcoxonSR(d.b.map((v,i)=>v-d.a[i])).p,eff:d=>median(d.b.map((v,i)=>v-d.a[i])),effName:"Mediana das diferenças",trueEff:P=>P.shape==="skew"?null:P.c,
  show(d,S){const df=d.b.map((v,i)=>v-d.a[i]),r=wilcoxonSR(df),na=nm(d.na,"Antes"),nb=nm(d.nb,"Depois"),N=nm(d.name,"a variável"),q=quartiles(df,"t7");
   slopeChart(slot(S.main,"Cada linha é um participante"),d.a,d.b,na,nb);
   dotRows(slot(S.a,`Diferenças (${nb} − ${na})`),[{v:df,name:"diferença"}],{ref:0,refLabel:"sem mudança",meanCI:false,rowH:100});
   if(r.exact)exactPmf(slot(S.b,"Distribuição exata de V se H₀ fosse verdadeira","V = soma dos postos das diferenças positivas."),srDist(r.n),r.V,0,"V");else nullZ(slot(S.b,"Aproximação normal (há empates, zeros ou n ≥ 50)"),r.z);
   S.tiles.innerHTML=tile("Mediana das diferenças",auto(r.md),`IIQ ${auto(q.q1)}–${auto(q.q3)}`,"acc")+tile("V",fmt(r.V,1),r.exact?"p exato":"aproximação normal")+tile("p",pv(r.p),"bicaudal",r.p<TS.alpha?"acc":"")+tile("r (rank-biserial)",fmt(r.rrb,2))+(r.zeros?tile("Sem mudança",r.zeros,"pares excluídos"):"");
   S.rel(`A mediana da mudança em ${N} foi ${auto(r.md)} (IIQ ${auto(q.q1)}–${auto(q.q3)}; n = ${d.a.length} pares); teste de Wilcoxon pareado: V = ${fmt(r.V,1)}; ${pvEq(r.p)}; r = ${fmt(r.rrb,2)}.`,V(r.p));
   S.ass.innerHTML=npNote;}},
 mcn:{name:"McNemar",kind:"mcn",fam:"Dois momentos (pareados)",sims:["mcn","mcnE"],
  check:d=>d.t.flat().every(v=>v>=0)&&d.t[0][1]+d.t[1][0]>0?null:"É preciso haver pelo menos um par que mudou de categoria.",
  p:d=>mcnemar(d.t[0][1],d.t[1][0]).p,eff:d=>(d.t[0][1]-d.t[1][0])/sum(d.t.flat()),effName:"Diferença de proporções",trueEff:P=>P.pb-P.pc,
  show(d,S){const [[a,b],[c,e]]=d.t,n=a+b+c+e,r=mcnemar(b,c,!!TS.yates),L=d.lab||["Sim","Não"];
   stackBars(slot(S.main,"Proporções antes e depois"),[[a+b,c+e],[a+c,b+e]],["Antes","Depois"],L);
   S.a.insertAdjacentHTML("beforeend",`<div class="sub">Só os pares que mudaram importam</div><div class="tw"><table class="t"><thead><tr><th></th><th>Depois: ${esc(L[0])}</th><th>Depois: ${esc(L[1])}</th></tr></thead><tbody><tr><td>Antes: ${esc(L[0])}</td><td>${a}</td><td style="background:var(--accent-soft);font-weight:700">${b}</td></tr><tr><td>Antes: ${esc(L[1])}</td><td style="background:var(--alt-soft);font-weight:700">${c}</td><td>${e}</td></tr></tbody></table></div><p class="note">O teste compara as duas células destacadas: ${b} passaram de “${esc(L[0])}” para “${esc(L[1])}” e ${c} fizeram o caminho inverso.</p>`);
   nullChi(slot(S.b,"Distribuição de χ² (1 gl) se H₀ fosse verdadeira"),r.X,1);
   S.tiles.innerHTML=tile("Antes",pct((a+b)/n,1),esc(L[0]))+tile("Depois",pct((a+c)/n,1),esc(L[0]))+tile("Mudaram",`${b} × ${c}`,"discordantes","acc")+tile("χ²",fmt(r.X,2),TS.yates?"com correção":"sem correção")+tile("p",pv(r.p),"",r.p<TS.alpha?"acc":"")+tile("p exato",pv(r.pe),"binomial");
   S.rel(`A proporção “${esc(L[0])}” passou de ${pct((a+b)/n,1)} para ${pct((a+c)/n,1)} (n = ${n} pares; ${b} mudaram para “${esc(L[1])}” e ${c} no sentido inverso); teste de McNemar: χ²(1) = ${fmt(r.X,2)}; ${pvEq(r.p)} (p exato = ${pv(r.pe)}).`,V(r.p));
   S.ass.innerHTML=`<p class="note">Com poucos pares discordantes (b + c < 25), use o p exato.</p>`;}},
 mcnE:{name:"McNemar exato",hidden:true,kind:"mcn",p:d=>mcnemar(d.t[0][1],d.t[1][0]).pe},
 anova:{name:"ANOVA de uma via",kind:"k",fam:"Três ou mais grupos",alt:"kw",sims:["anova","kw"],opt:"welchA",
  check:d=>d.g.length>=2&&d.g.every(g=>g.length>=2)?null:"Cada grupo precisa de pelo menos 2 valores.",
  p:d=>anova(d.g).p,eff:d=>anova(d.g).eta2,effName:"η²",trueEff:P=>{const m=P.means,v=variance(m,true);return v/(v+P.s**2);},
  show(d,S){const r=anova(d.g,true),names=d.g.map((_,i)=>nm(d.names[i],"Grupo "+(i+1))),N=nm(d.name,"a variável"),W=!!TS.welchA,F=W?r.wF:r.F,df2=W?r.wdf2:r.df2,p=W?r.wp:r.p;
   dotRows(slot(S.main,"Os dados","◆ média com "+icL()),d.g.map((v,i)=>({v,name:names[i]})),{rowH:64});
   nullF(slot(S.a,`Distribuição de F(${r.df1}, ${fmt(df2,1)}) se H₀ fosse verdadeira`),F,r.df1,df2);
   S.b.innerHTML=`<div class="sub">Comparações par a par (t de Welch)</div>`+pairTable(d.g,names,(x,y)=>{const t=tInd(x,y);return{p:t.p,lab:auto(t.diff)};},"Diferença");
   S.tiles.innerHTML=r.D.map((g,i)=>tile(names[i],auto(g.m),`DP ${auto(g.s)} · n = ${g.n}`)).join("")+tile(W?"F de Welch":"F",fmt(F,2),`gl = ${r.df1} e ${fmt(df2,1)}`)+tile("p",pv(p),"",p<TS.alpha?"acc":"")+tile("η²",fmt(r.eta2,3),"proporção da variação explicada pelos grupos","acc");
   S.rel(`Médias de ${N}: ${names.map((n,i)=>`${n} ${auto(r.D[i].m)} (DP ${auto(r.D[i].s)})`).join("; ")}; ${W?"ANOVA de Welch":"ANOVA"}: F(${r.df1}, ${fmt(df2,1)}) = ${fmt(F,2)}; ${pvEq(p)}; η² = ${fmt(r.eta2,3)}.`,V(p)+" A ANOVA diz se há alguma diferença; as comparações par a par dizem onde.");
   S.ass.innerHTML=swRows(names.map((n,i)=>[n,d.g[i]]))+sdRatio(r.D)+normNote;}},
 kw:{name:"Kruskal-Wallis",kind:"k",fam:"Três ou mais grupos",alt:"anova",sims:["anova","kw"],np:true,
  check:d=>d.g.length>=2&&d.g.every(g=>g.length>=1)?null:"Informe valores em todos os grupos.",
  p:d=>kruskal(d.g).p,eff:d=>kruskal(d.g).eps2,effName:"ε²",trueEff:()=>null,
  show(d,S){const r=kruskal(d.g),names=d.g.map((_,i)=>nm(d.names[i],"Grupo "+(i+1))),N=nm(d.name,"a variável");
   dotRows(slot(S.main,"Os dados","A linha laranja de cada boxplot é a mediana"),d.g.map((v,i)=>({v,name:names[i]})),{rowH:64,meanCI:false});
   nullChi(slot(S.a,`Distribuição de χ² (${r.df} gl) se H₀ fosse verdadeira`),r.H,r.df,"H");
   S.b.innerHTML=`<div class="sub">Comparações par a par (Mann-Whitney)</div>`+pairTable(d.g,names,(x,y)=>{const t=mannWhitney(x,y);return{p:t.p,lab:fmt(t.U,1)};},"U");
   S.tiles.innerHTML=names.map((n,i)=>tile(n,auto(r.mds[i]),`mediana · posto médio ${fmt(r.meanRank[i],1)}`)).join("")+tile("H",fmt(r.H,2),`gl = ${r.df}`)+tile("p",pv(r.p),"",r.p<TS.alpha?"acc":"")+tile("ε²",fmt(r.eps2,3),"tamanho de efeito","acc");
   S.rel(`${N} (medianas: ${names.map((n,i)=>`${n} ${auto(r.mds[i])}`).join("; ")}); teste de Kruskal-Wallis: H(${r.df}) = ${fmt(r.H,2)}; ${pvEq(r.p)}; ε² = ${fmt(r.eps2,3)}.`,V(r.p));
   S.ass.innerHTML=npNote;}},
 rm:{name:"ANOVA de medidas repetidas",kind:"krep",fam:"Três ou mais momentos",alt:"fr",sims:["rm","fr"],
  check:d=>d.g.length>=2&&d.g.every(c=>c.length===d.g[0].length)&&d.g[0].length>=2?null:"Todos os momentos precisam ter o mesmo número de valores (um por participante, na mesma ordem).",
  p:d=>rmAnova(d.g).p,eff:d=>rmAnova(d.g).eta2p,effName:"η² parcial",trueEff:()=>null,
  show(d,S){const r=rmAnova(d.g),names=d.g.map((_,i)=>nm(d.names[i],"Momento "+(i+1))),N=nm(d.name,"a variável");
   lineChart(slot(S.main,"Cada linha cinza é um participante","Linha azul: médias com "+icL()),d.g,names);
   nullF(slot(S.a,`Distribuição de F(${r.df1}, ${r.df2}) se H₀ fosse verdadeira`),r.F,r.df1,r.df2);
   S.b.innerHTML=`<div class="sub">Comparações par a par (t pareado)</div>`+pairTable(d.g,names,(x,y)=>{const t=tOne(y.map((v,i)=>v-x[i]),0);return{p:t.p,lab:auto(t.m)};},"Mudança");
   S.tiles.innerHTML=names.map((n,i)=>tile(n,auto(r.cm[i]),"média")).join("")+tile("F",fmt(r.F,2),`gl = ${r.df1} e ${r.df2}`)+tile("p",pv(r.p),"",r.p<TS.alpha?"acc":"")+tile("η² parcial",fmt(r.eta2p,3),"","acc");
   S.rel(`${N} (médias: ${names.map((n,i)=>`${n} ${auto(r.cm[i])}`).join("; ")}; n = ${r.n}); ANOVA de medidas repetidas: F(${r.df1}, ${r.df2}) = ${fmt(r.F,2)}; ${pvEq(r.p)}; η² parcial = ${fmt(r.eta2p,3)}.`,V(r.p));
   S.ass.innerHTML=`<p class="note">Supõe resíduos aproximadamente normais e esfericidade (variâncias das diferenças entre momentos parecidas). Softwares como o jamovi testam a esfericidade (Mauchly) e aplicam correções (Greenhouse-Geisser) quando ela falha; esta versão didática não faz a correção.</p>`;}},
 fr:{name:"Friedman",kind:"krep",fam:"Três ou mais momentos",alt:"rm",sims:["rm","fr"],np:true,
  check:d=>d.g.length>=2&&d.g.every(c=>c.length===d.g[0].length)&&d.g[0].length>=2?null:"Todos os momentos precisam ter o mesmo número de valores.",
  p:d=>friedman(d.g).p,eff:d=>friedman(d.g).W,effName:"W de Kendall",trueEff:()=>null,
  show(d,S){const r=friedman(d.g),names=d.g.map((_,i)=>nm(d.names[i],"Momento "+(i+1))),N=nm(d.name,"a variável");
   lineChart(slot(S.main,"Cada linha cinza é um participante"),d.g,names);
   nullChi(slot(S.a,`Distribuição de χ² (${r.df} gl) se H₀ fosse verdadeira`),r.Q,r.df);
   S.b.innerHTML=`<div class="sub">Comparações par a par (Wilcoxon pareado)</div>`+pairTable(d.g,names,(x,y)=>{const t=wilcoxonSR(y.map((v,i)=>v-x[i]));return{p:t.p,lab:fmt(t.V,1)};},"V");
   S.tiles.innerHTML=names.map((n,i)=>tile(n,auto(median(d.g[i])),`mediana · posto médio ${fmt(r.meanRank[i],2)}`)).join("")+tile("χ²",fmt(r.Q,2),`gl = ${r.df}`)+tile("p",pv(r.p),"",r.p<TS.alpha?"acc":"")+tile("W de Kendall",fmt(r.W,3),"concordância","acc");
   S.rel(`${N} (medianas: ${names.map((n,i)=>`${n} ${auto(median(d.g[i]))}`).join("; ")}; n = ${d.g[0].length}); teste de Friedman: χ²(${r.df}) = ${fmt(r.Q,2)}; ${pvEq(r.p)}; W de Kendall = ${fmt(r.W,3)}.`,V(r.p));
   S.ass.innerHTML=npNote;}},
 pear:{name:"Correlação de Pearson",kind:"xy",fam:"Associação",alt:"spear",sims:["pear","spear"],drag:true,
  check:d=>d.x.length===d.y.length&&d.x.length>=3?null:"X e Y precisam ter o mesmo número de valores (pelo menos 3 pares).",
  p:d=>pearson(d.x,d.y).p,eff:d=>pearson(d.x,d.y).r,effName:"r",trueEff:P=>P.rho,
  show(d,S){const r=pearson(d.x,d.y),l=linreg(d.x,d.y),nx=nm(d.nx,"X"),ny=nm(d.ny,"Y");
   TS.sc=scatter(slot(S.main,"Diagrama de dispersão","Arraste os pontos e veja o r mudar. A linha é a reta de regressão."),d.x,d.y,{curve:v=>l.b0+l.b1*v,xlab:nx,ylab:ny,drag:true});
   nullT(slot(S.a,"Distribuição de t se não houvesse correlação"),r.t,r.df);
   S.tiles.innerHTML=tile("r",fmt(r.r,3),`IC 95%: ${fmt(r.lo,2)} a ${fmt(r.hi,2)}`,"acc big")+tile("r²",pct(r.r*r.r,1),"variação de Y compartilhada com X")+tile("t",fmt(r.t,2),`gl = ${r.df}`)+tile("p",pv(r.p),"",r.p<TS.alpha?"acc":"")+tile("Força",corrWord(r.r),"")+tile("n",r.n,"pares");
   S.rel(`Houve correlação ${r.r>=0?"positiva":"negativa"} ${corrWord(r.r)} entre ${nx} e ${ny} (r de Pearson = ${fmt(r.r,2)}; IC 95% ${fmt(r.lo,2)} a ${fmt(r.hi,2)}; n = ${r.n}; ${pvEq(r.p)}).`,V(r.p,"correlação")+" Correlação não é causalidade.");
   S.ass.innerHTML=swRows([[nx,d.x],[ny,d.y]])+`<p class="note">Pearson mede relação <b>linear</b> e é sensível a outliers. Uma relação curva pode ter r próximo de zero. Olhe sempre o gráfico.</p>`;}},
 spear:{name:"Correlação de Spearman",kind:"xy",fam:"Associação",alt:"pear",sims:["pear","spear"],np:true,drag:true,
  check:d=>d.x.length===d.y.length&&d.x.length>=3?null:"X e Y precisam ter o mesmo número de valores.",
  p:d=>spearman(d.x,d.y).p,eff:d=>spearman(d.x,d.y).rho,effName:"ρ de Spearman",trueEff:P=>P.shape==="out"?null:6/Math.PI*Math.asin(P.rho/2),
  show(d,S){const r=spearman(d.x,d.y),p=pearson(d.x,d.y),nx=nm(d.nx,"X"),ny=nm(d.ny,"Y"),rx=ranks(d.x),ry=ranks(d.y);
   TS.sc=scatter(slot(S.main,"Diagrama de dispersão","Arraste os pontos."),d.x,d.y,{xlab:nx,ylab:ny,drag:true});
   scatter(slot(S.a,"Os mesmos dados convertidos em postos","Spearman é a correlação de Pearson calculada sobre os postos."),rx,ry,{xlab:"posto de X",ylab:"posto de Y",color:"var(--alt)",r:4,h:220});
   S.tiles.innerHTML=tile("ρ (rho)",fmt(r.rho,3),"Spearman","acc big")+tile("p",pv(r.p),"aproximação t",r.p<TS.alpha?"acc":"")+tile("r de Pearson",fmt(p.r,3),"para comparar")+tile("n",r.n,"pares");
   S.rel(`Houve correlação ${r.rho>=0?"positiva":"negativa"} ${corrWord(r.rho)} entre ${nx} e ${ny} (ρ de Spearman = ${fmt(r.rho,2)}; n = ${r.n}; ${pvEq(r.p)}).`,V(r.p,"correlação"));
   S.ass.innerHTML=npNote+`<p class="note">Spearman capta relações monotônicas (sempre crescentes ou sempre decrescentes), mesmo que não sejam retas. O p aqui usa a aproximação t; o R e o jamovi usam o cálculo exato para amostras pequenas sem empates, com diferenças mínimas.</p>`;}},
 lin:{name:"Regressão linear simples",kind:"xy",fam:"Previsão",sims:["lin"],drag:true,
  check:d=>d.x.length===d.y.length&&d.x.length>=3?null:"X e Y precisam ter o mesmo número de valores (pelo menos 3 pares).",
  p:d=>linreg(d.x,d.y).p,eff:d=>linreg(d.x,d.y).b1,effName:"Inclinação (b₁)",trueEff:(P,d)=>P.shape==="out"?null:P.rho*(sd(d.y)/sd(d.x)),
  show(d,S){const l=linreg(d.x,d.y,conf()),nx=nm(d.nx,"X"),ny=nm(d.ny,"Y");
   TS.sc=scatter(slot(S.main,"Reta de regressão com "+icL()+" da média prevista","Arraste os pontos e veja a reta se ajustar."),d.x,d.y,{curve:v=>l.b0+l.b1*v,band:v=>{const h=l.q*l.s*Math.sqrt(1/l.n+(v-l.mx)**2/l.sxx),f=l.b0+l.b1*v;return[f-h,f+h];},xlab:nx,ylab:ny,drag:true});
   scatter(slot(S.a,"Resíduos (observado − previsto)","Sem padrão = bom ajuste. Curvas ou funil indicam problemas."),l.fit,l.res,{hline:0,xlab:"valor previsto",ylab:"resíduo",color:"var(--alt)",r:4,h:200});
   const px=TS.predX??rnd(mean(d.x),1);
   S.b.innerHTML=`<div class="sub">Prever</div><div class="row"><span class="mini">${esc(nx)} =</span><div class="box" style="width:110px;min-height:38px"><input id="lnX" inputmode="decimal" value="${fmt(px,1)}"></div><span class="mini">→ ${esc(ny)} previsto = <b id="lnY">${auto(l.b0+l.b1*px)}</b></span></div>`;
   $("lnX").oninput=e=>{const v=parse(e.target.value);if(has(v)){TS.predX=v;$("lnY").textContent=auto(l.b0+l.b1*v);}};
   S.tiles.innerHTML=tile("Equação",`Y = ${auto(l.b0)} ${l.b1<0?"−":"+"} ${auto(Math.abs(l.b1))}·X`,"",`acc`)+tile("Inclinação b₁",auto(l.b1),`${icL()}: ${auto(l.lo)} a ${auto(l.hi)}`)+tile("R²",pct(l.r2,1),"variação de Y explicada por X")+tile("t",fmt(l.t,2),`gl = ${l.df}`)+tile("p",pv(l.p),"da inclinação",l.p<TS.alpha?"acc":"")+tile("Erro padrão da regressão",auto(l.s),"DP dos resíduos");
   S.rel(`Cada unidade a mais em ${nx} associou-se a ${l.b1>=0?"um aumento":"uma redução"} de ${auto(Math.abs(l.b1))} em ${ny} (${icL()}: ${auto(l.lo)} a ${auto(l.hi)}; ${pvEq(l.p)}); R² = ${fmt(l.r2,2)}; n = ${l.n}.`,V(l.p,"relação linear")+" A regressão prevê Y a partir de X; ela não prova que X cause Y.");
   S.ass.innerHTML=swRows([["Resíduos",l.res]])+`<p class="note">A normalidade exigida é a dos <b>resíduos</b>, não das variáveis. Também se supõe relação linear e variância constante dos resíduos (veja o gráfico de resíduos).</p>`;}},
 log:{name:"Regressão logística simples",kind:"xbin",fam:"Previsão",sims:["log"],
  check:d=>d.x.length===d.y.length&&d.x.length>=5&&d.y.every(v=>v===0||v===1)&&d.y.some(v=>v)&&d.y.some(v=>!v)?null:"X e Y com o mesmo número de valores; Y só com 0 e 1, e com pelo menos um de cada.",
  p:d=>{const r=logreg(d.x,d.y);return r.ok?r.p:1;},eff:d=>{const r=logreg(d.x,d.y);return r.ok?r.or:NaN;},effName:"OR por unidade",trueEff:P=>P.or,
  show(d,S){const r=logreg(d.x,d.y),nx=nm(d.nx,"X"),ny=nm(d.ny,"Y"),jit=d.y.map((_,i)=>((i*7919)%100/100-.5)*.08);
   scatter(slot(S.main,"Desfecho (0 ou 1) e a curva logística","Cada ponto é uma pessoa; a curva é a probabilidade prevista do desfecho."),d.x,d.y,{curve:v=>1/(1+Math.exp(-(r.b0+r.b1*v))),jit,ydom:[-.12,1.12],xlab:nx,ylab:ny,yfmt:v=>v===0||v===1?fmt(v,0):pct(v,0),r:4});
   // proporções por faixas
   const o=d.x.map((v,i)=>[v,d.y[i]]).sort((a,b)=>a[0]-b[0]),k=Math.min(8,Math.max(3,Math.floor(o.length/15))),bins=[];for(let i=0;i<k;i++){const s=o.slice(Math.floor(i*o.length/k),Math.floor((i+1)*o.length/k));bins.push({name:`${auto(s[0][0])}–${auto(s[s.length-1][0])}`,e:mean(s.map(q=>q[1]))});}
   forest(slot(S.a,`Proporção de ${ny.toLowerCase()} por faixa de ${nx.toLowerCase()}`),bins.map(b=>({name:b.name,e:b.e,lo:b.e,hi:b.e})),{dom:[0,1],fmt:v=>pct(v,0),L:110});
   S.tiles.innerHTML=tile("OR por unidade de X",fmt(r.or,3),`IC 95%: ${fmt(r.lo,3)} a ${fmt(r.hi,3)}`,"acc big")+tile("b₁",fmt(r.b1,4),`EP ${fmt(r.se1,4)}`)+tile("z de Wald",fmt(r.z,2))+tile("p",pv(r.p),"Wald",r.p<TS.alpha?"acc":"")+tile("Eventos",`${sum(d.y)} de ${d.y.length}`)+tile("R² de McFadden",fmt(r.r2,3));
   S.rel(`Cada unidade a mais em ${nx} associou-se a uma chance (odds) ${r.or>=1?"maior":"menor"} de ${ny} (OR = ${fmt(r.or,3)}; IC 95% ${fmt(r.lo,3)} a ${fmt(r.hi,3)}; ${pvEq(r.p)}; n = ${r.n}; ${sum(d.y)} eventos).`,V(r.p,"associação")+` Para 10 unidades a mais, a OR é ${fmt(r.or**10,2)}.`);
   S.ass.innerHTML=(r.ok?"":`<div class="warnbox"><b>Atenção:</b> o modelo não convergiu bem (possível separação perfeita: um valor de X prevê o desfecho sem erro).</div>`)+`<p class="note">Regra prática: pelo menos 10 eventos (e 10 não eventos) por variável no modelo. Aqui: ${Math.min(sum(d.y),d.y.length-sum(d.y))} no grupo menor.</p>`;}},
 chi:{name:"Qui-quadrado",kind:"tab",fam:"Associação",alt:"fisher",sims:["chi","fisher"],opt:"yates",
  check:d=>d.t.every(r=>r.every(v=>v>=0))&&d.t.every(r=>sum(r)>0)&&d.t[0].every((_,j)=>sum(d.t.map(r=>r[j]))>0)?null:"Nenhuma linha ou coluna pode ter total zero.",
  p:d=>chisq(d.t).p,eff:d=>d.t.length===2&&d.t[0].length===2?effects22(d.t).rr:NaN,effName:"Razão de proporções",trueEff:P=>P.ps.length===2&&P.ps[0].length===2?P.ps[0][0]/P.ps[1][0]:null,
  show(d,S){const r=chisq(d.t,!!TS.yates),is22=d.t.length===2&&d.t[0].length===2;
   stackBars(slot(S.main,"Distribuição do desfecho em cada linha"),d.t,d.rn,d.cn);
   S.a.insertAdjacentHTML("beforeend",`<div class="adv"><div class="sub">Observado (esperado se não houvesse associação)</div><div class="tw"><table class="t"><thead><tr><th></th>${d.cn.map(c=>`<th>${esc(c)}</th>`).join("")}<th>Total</th></tr></thead><tbody>${d.t.map((row,i)=>`<tr><td>${esc(d.rn[i])}</td>${row.map((o,j)=>`<td>${o} <span class="mini">(${fmt(r.E[i][j],1)})</span></td>`).join("")}<td>${r.rs[i]}</td></tr>`).join("")}<tr class="sum"><td>Total</td>${r.cs.map(c=>`<td>${c}</td>`).join("")}<td>${r.N}</td></tr></tbody></table></div><p class="note">Esperado = total da linha × total da coluna ÷ total geral. O χ² soma (observado − esperado)² ÷ esperado.</p></div>`);
   nullChi(slot(S.b,`Distribuição de χ² (${r.df} gl) se não houvesse associação`),r.X,r.df);
   let eff="";if(is22){const e=effects22(d.t);eff=tile(`Proporção em ${esc(d.rn[0])}`,pct(e.p1,1),esc(d.cn[0]))+tile(`Proporção em ${esc(d.rn[1])}`,pct(e.p2,1),esc(d.cn[0]))+tile("Razão de proporções",fmt(e.rr,2),`IC 95%: ${fmt(e.rrlo,2)} a ${fmt(e.rrhi,2)}`,"acc")+tile("Odds ratio",fmt(e.or,2),`IC 95%: ${fmt(e.orlo,2)} a ${fmt(e.orhi,2)}`)+tile("Diferença de proporções",pct(e.rd,1),`IC 95%: ${pct(e.rdlo,1)} a ${pct(e.rdhi,1)}`);
     S.b.insertAdjacentHTML("beforeend",`<div class="sub">Medidas de efeito (escala log)</div><svg class="ch" id="chiF"></svg>`);forest($("chiF"),[{name:"Razão de proporções",e:e.rr,lo:e.rrlo,hi:e.rrhi},{name:"Odds ratio",e:e.or,lo:e.orlo,hi:e.orhi,color:"var(--alt)"}],{null:1,log:true,L:130});}
   S.tiles.innerHTML=tile("χ²",fmt(r.X,2),`gl = ${r.df}${TS.yates&&is22?" · Yates":""}`)+tile("p",pv(r.p),"",r.p<TS.alpha?"acc":"")+tile("V de Cramér",fmt(r.V,3),"força da associação")+eff;
   const e=is22?effects22(d.t):null;
   S.rel(`${is22?`${d.cn[0]} ocorreu em ${pct(e.p1,1)} (${d.t[0][0]}/${r.rs[0]}) em ${d.rn[0]} e em ${pct(e.p2,1)} (${d.t[1][0]}/${r.rs[1]}) em ${d.rn[1]}; razão de proporções = ${fmt(e.rr,2)} (IC 95% ${fmt(e.rrlo,2)} a ${fmt(e.rrhi,2)}); `:""}qui-quadrado: χ²(${r.df}) = ${fmt(r.X,2)}; ${pvEq(r.p)}; N = ${r.N}.`,V(r.p,"associação"));
   S.ass.innerHTML=(r.lowE?`<div class="warnbox"><b>${r.lowE} de ${r.cellsN} células</b> com valor esperado menor que 5 (mínimo ${fmt(r.minE,1)}). ${is22?"Use o teste exato de Fisher.":"Considere agrupar categorias."}</div>`:`<p class="note">Todos os valores esperados são ≥ 5: o qui-quadrado é adequado.</p>`)+`<p class="note">Supõe observações independentes (cada pessoa conta uma vez). Para dados pareados, use McNemar.</p>`+(e&&e.hald?`<p class="note">Havia célula com zero: somou-se 0,5 a todas as células para calcular RP e OR.</p>`:"");}},
 fisher:{name:"Exato de Fisher",kind:"tab",fam:"Associação",alt:"chi",sims:["chi","fisher"],
  check:d=>d.t.length===2&&d.t[0].length===2?(d.t.flat().every(v=>v>=0)?null:"Valores não podem ser negativos."):"O teste exato de Fisher aqui funciona para tabelas 2 × 2. Remova linhas ou colunas.",
  p:d=>fisher22(d.t).p,eff:d=>effects22(d.t).rr,effName:"Razão de proporções",trueEff:P=>P.ps.length===2&&P.ps[0].length===2?P.ps[0][0]/P.ps[1][0]:null,
  show(d,S){const r=fisher22(d.t),e=effects22(d.t),[[a,b],[c,dd]]=d.t;
   stackBars(slot(S.main,"Distribuição do desfecho em cada linha"),d.t,d.rn,d.cn);
   const po=r.pmf.find(q=>q[0]===a)[1];pmfPlot(slot(S.a,`Distribuição exata da célula “${esc(d.rn[0])} × ${esc(d.cn[0])}” com os totais fixos`,"Barras azuis: tabelas tão ou menos prováveis que a observada. Somadas, dão o p."),r.pmf.map(q=>q[1]),{k0:r.pmf[0][0],obs:a,obsLabel:`observado: ${a}`,isExt:(k,q)=>q<=po*(1+1e-7)});
   S.tiles.innerHTML=tile("p exato",pv(r.p),"bicaudal",r.p<TS.alpha?"acc":"")+tile(`Proporção em ${esc(d.rn[0])}`,pct(e.p1,1))+tile(`Proporção em ${esc(d.rn[1])}`,pct(e.p2,1))+tile("Razão de proporções",fmt(e.rr,2),`IC 95%: ${fmt(e.rrlo,2)} a ${fmt(e.rrhi,2)}`,"acc")+tile("Odds ratio",fmt(e.or,2),"estimativa amostral");
   S.rel(`${d.cn[0]} ocorreu em ${a}/${a+b} (${pct(e.p1,1)}) em ${d.rn[0]} e em ${c}/${c+dd} (${pct(e.p2,1)}) em ${d.rn[1]}; teste exato de Fisher, ${pvEq(r.p)}.`,V(r.p,"associação"));
   S.ass.innerHTML=`<p class="note">Fisher calcula a probabilidade exata, sem aproximação: é o indicado quando algum valor esperado é menor que 5. Com amostras grandes, dá resultado parecido com o qui-quadrado.</p>`;}},
 km:{name:"Kaplan-Meier e log-rank",kind:"surv",fam:"Sobrevida",sims:["km","cox"],
  check:d=>d.g.every(g=>g.t.length>=2)&&d.g.some(g=>sum(g.e)>0)?null:"Cada grupo precisa de pelo menos 2 tempos e deve haver eventos.",
  p:d=>logrank(d.g[0],d.g[1]).p,eff:d=>logrank(d.g[0],d.g[1]).hr,effName:"Hazard ratio (2 vs 1)",trueEff:P=>P.m1/P.m2,
  show(d,S){const r=logrank(d.g[0],d.g[1]),names=d.names.map((n,i)=>nm(n,"Grupo "+(i+1))),K=d.g.map(kmCurve),u=d.unit||"";
   kmPlot(slot(S.main,"Curvas de sobrevida de Kaplan-Meier","Cada degrau é um evento. Traços verticais: participantes censurados (saíram do estudo sem o evento)."),d.g,names,u);
   S.a.insertAdjacentHTML("beforeend",`<div class="adv"><div class="sub">Eventos observados × esperados</div><div class="tw"><table class="t"><thead><tr><th>Grupo</th><th>n</th><th>Eventos (O)</th><th>Esperados (E)</th><th>O/E</th><th>Mediana</th></tr></thead><tbody>${[0,1].map(i=>`<tr><td>${esc(names[i])}</td><td>${K[i].n}</td><td>${i?r.O2:r.O1}</td><td>${fmt(i?r.E2:r.E1,1)}</td><td>${fmt((i?r.O2:r.O1)/(i?r.E2:r.E1),2)}</td><td>${K[i].med!=null?auto(K[i].med):"não atingida"}</td></tr>`).join("")}</tbody></table></div><p class="note">Se não houvesse diferença, cada grupo teria eventos proporcionais ao número de pessoas em risco a cada momento.</p></div>`);
   nullChi(slot(S.b,"Distribuição de χ² (1 gl) se as curvas fossem iguais"),r.X,1);
   S.tiles.innerHTML=names.map((n,i)=>tile(n,K[i].med!=null?auto(K[i].med)+(u?" "+u:""):"não atingida",`mediana · ${K[i].ev} eventos em ${K[i].n}`)).join("")+tile("Log-rank χ²",fmt(r.X,2),"gl = 1")+tile("p",pv(r.p),"",r.p<TS.alpha?"acc":"")+(r.ok?tile("Hazard ratio",fmt(r.hr,2),`${names[1]} vs ${names[0]} · IC 95%: ${fmt(r.hrlo,2)} a ${fmt(r.hrhi,2)} (Cox)`,"acc"):"");
   S.rel(`A mediana de sobrevida foi ${K[0].med!=null?auto(K[0].med)+" "+u:"não atingida"} em ${names[0]} e ${K[1].med!=null?auto(K[1].med)+" "+u:"não atingida"} em ${names[1]}; log-rank χ²(1) = ${fmt(r.X,2)}; ${pvEq(r.p)}${r.ok?`; hazard ratio (Cox) = ${fmt(r.hr,2)} (IC 95% ${fmt(r.hrlo,2)} a ${fmt(r.hrhi,2)})`:""}.`,V(r.p,"diferença entre as curvas")+(r.ok?` HR < 1 significa menor risco instantâneo de evento em ${names[1]}.`:""));
   S.ass.innerHTML=`<p class="note">Supõe censura não informativa (quem sai do estudo tem o mesmo risco de quem fica) e, para o HR de Cox, riscos proporcionais (curvas que não se cruzam).</p>`;}},
 cox:{name:"Regressão de Cox",hidden:true,kind:"surv",p:d=>{const r=logrank(d.g[0],d.g[1]);return r.ok?r.coxp:1;}},
};
function corrWord(r){const a=Math.abs(r);return a<.1?"desprezível":a<.3?"fraca":a<.5?"moderada":a<.7?"forte":"muito forte";}
