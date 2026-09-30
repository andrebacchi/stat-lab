/* ===================== utilidades de interface ===================== */
const $=id=>document.getElementById(id);
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const has=v=>v!=null&&isFinite(v);
const fmt=(x,d=1)=>!isFinite(x)?(x>0?"∞":"—"):(Math.abs(x)<0.5*10**-d?0:x).toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d}).replace("-","−");
function auto(x){if(!isFinite(x))return fmt(x);if(Number.isInteger(x))return fmt(x,0);const a=Math.abs(x);return a>=1000?fmt(x,0):a>=100?fmt(x,1):a>=10?fmt(x,1):a>=1?fmt(x,2):a>=0.01?fmt(x,3):fmt(x,4);}
const pct=(x,d=1)=>fmt(x*100,d)+"%";
const pv=p=>!has(p)?"—":p<0.001?"< 0,001":p>0.999?"> 0,999":fmt(p,3);
const pvEq=p=>p<0.001?"p < 0,001":"p = "+pv(p);
const parse=s=>{s=String(s).trim().replace(/\s/g,"").replace(/[−–]/g,"-");if(s==="")return null;if(s.includes(","))s=s.replace(/\./g,"").replace(",",".");const v=parseFloat(s);return isFinite(v)?v:null;};
/* aceita espaço, ponto e vírgula, quebra de linha; vírgula decimal; "1.000" como mil só com vírgula presente */
function parseList(s){return String(s).replace(/\t/g," ").split(/[\s;]+/).map(t=>t.trim()).filter(Boolean).map(t=>{t=t.replace(/[−–]/g,"-");if(/^-?\d+,\d+$/.test(t))t=t.replace(",",".");else if(t.includes(",")&&t.includes("."))t=t.replace(/\./g,"").replace(",",".");const v=parseFloat(t.replace("−","-"));return isFinite(v)?v:null;}).filter(has);}
const numTxt=v=>String(+(+v).toFixed(6)).replace("-","−").replace(".",",");
const listTxt=a=>a.map(numTxt).join("  ");
const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1600);}
function copyText(txt){const ok=()=>toast("Copiado");try{navigator.clipboard.writeText(txt).then(ok,()=>toast("Selecione o texto e copie"));}catch(e){toast("Selecione o texto e copie");}}
const GC=["var(--g1)","var(--g2)","var(--g3)","var(--g4)","var(--g5)"];

/* ---------- SVG ---------- */
function box(el,h){const W=Math.max(280,Math.round(el.clientWidth||el.parentElement.clientWidth||600));el.setAttribute("viewBox",`0 0 ${W} ${h}`);return W;}
function nice(lo,hi,n=5){if(!(hi>lo)){hi=lo+1;lo=lo-1;}const span=hi-lo,step0=span/n,e=Math.pow(10,Math.floor(Math.log10(step0))),f=step0/e,step=(f<1.5?1:f<3?2:f<7?5:10)*e;const t=[];for(let v=Math.ceil(lo/step-1e-9)*step;v<=hi+step*1e-9;v+=step)t.push(+v.toFixed(12));return t;}
function niceDom(lo,hi,n=5){if(!(hi>lo)){const d=Math.abs(lo)*0.1||1;lo-=d;hi+=d;}const pad=(hi-lo)*0.04;return[lo-pad,hi+pad];}
function xAxis(X,ticks,y,f=auto,x0,x1){const a=x0??X(ticks[0]),b=x1??X(ticks[ticks.length-1]);return `<line class="ax" x1="${a}" x2="${b}" y1="${y}" y2="${y}"/>`+ticks.map(t=>`<line class="ax" x1="${X(t)}" x2="${X(t)}" y1="${y}" y2="${y+4}"/><text x="${X(t)}" y="${y+17}" text-anchor="middle">${f(t)}</text>`).join("");}
function yGrid(Y,ticks,x0,x1,f=auto){return ticks.map(t=>`<line class="gr" x1="${x0}" x2="${x1}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${x0-6}" y="${Y(t)+4}" text-anchor="end">${f(t)}</text>`).join("");}
const svgPt=(el,e)=>{const p=el.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(el.getScreenCTM().inverse());};
function msg(el,h,t){const W=box(el,h);el.innerHTML=`<text x="${W/2}" y="${h/2}" text-anchor="middle" style="font-style:italic">${t}</text>`;}

/* histograma */
function histo(el,vals,o={}){const H=o.h||220,W=box(el,H),L=o.L??10,R=10,T=o.T??14,B=30,iw=W-L-R,ih=H-T-B;
  const lo=o.min??Math.min(...vals),hi=o.max??Math.max(...vals),nb=o.bins||Math.min(40,Math.max(6,Math.round(Math.sqrt(vals.length)))),bw=(hi-lo)/nb||1;
  const cnt=new Array(nb).fill(0);vals.forEach(v=>{const i=Math.min(nb-1,Math.max(0,Math.floor((v-lo)/bw)));cnt[i]++;});
  const dens=cnt.map(c=>c/(vals.length*bw)),ymax=Math.max(...dens,o.ymax||0,1e-12)*1.12,X=v=>L+(v-lo)/(hi-lo)*iw,Y=d=>T+ih-d/ymax*ih;let s="";
  (o.bands||[]).forEach(b=>s+=`<rect x="${X(Math.max(lo,b[0]))}" y="${T}" width="${Math.max(0,X(Math.min(hi,b[1]))-X(Math.max(lo,b[0])))}" height="${ih}" fill="${b[2]}" opacity="${b[3]||.12}"/>`);
  cnt.forEach((c,i)=>{if(!c)return;const x=X(lo+i*bw),col=o.colorOf?o.colorOf(lo+(i+.5)*bw):null;s+=`<rect class="${o.cls||"bar"}" ${col?`style="fill:${col}"`:""} x="${x+.5}" y="${Y(dens[i])}" width="${Math.max(1,iw/nb-1)}" height="${T+ih-Y(dens[i])}"/>`;});
  if(o.curve){let p="";for(let i=0;i<=160;i++){const v=lo+(hi-lo)*i/160;p+=(i?"L":"M")+X(v).toFixed(1)+","+Y(o.curve(v)).toFixed(1);}s+=`<path class="${o.curveCls||"curve"}" d="${p}"/>`;}
  (o.marks||[]).forEach(m=>{if(!has(m.v)||m.v<lo||m.v>hi)return;const x=X(m.v);s+=`<line class="${m.cls||""}" x1="${x}" x2="${x}" y1="${T}" y2="${T+ih}" ${m.style?`style="${m.style}"`:""}/>`;if(m.t)s+=`<text x="${clamp(x,40,W-40)}" y="${T-3}" text-anchor="middle" class="lbl" style="font-size:11px;${m.tstyle||""}">${m.t}</text>`;});
  s+=xAxis(X,nice(lo,hi,Math.max(3,Math.floor(iw/80))).filter(t=>t>=lo-1e-9&&t<=hi+1e-9),T+ih,o.fmt,L,W-R);
  el.innerHTML=s;return{X,Y,cnt,bw,lo,hi,W,T,ih};}

/* linhas de pontos + boxplot + média com IC, um grupo por linha */
function dotRows(el,groups,o={}){const n=groups.length,rowH=o.rowH||(n>1?74:110),T=o.T??18,H=T+n*rowH+34,W=box(el,H),L=o.L??(n>1?Math.min(96,W*.24):12),R=14,iw=W-L-R;
  const all=groups.flatMap(g=>g.v);if(!all.length){msg(el,H,"Sem dados");return null;}
  let [lo,hi]=niceDom(Math.min(...all,o.ref??Infinity),Math.max(...all,o.ref??-Infinity));if(o.dom){lo=o.dom[0];hi=o.dom[1];}
  const X=v=>L+(v-lo)/(hi-lo)*iw;let s="";
  const ticks=nice(lo,hi,Math.max(3,Math.floor(iw/80))).filter(t=>t>=lo&&t<=hi);ticks.forEach(t=>s+=`<line class="gr" x1="${X(t)}" x2="${X(t)}" y1="${T-6}" y2="${T+n*rowH}"/>`);
  if(has(o.ref))s+=`<line x1="${X(o.ref)}" x2="${X(o.ref)}" y1="${T-10}" y2="${T+n*rowH}" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="5 4"/><text x="${clamp(X(o.ref),30,W-30)}" y="${T-12}" text-anchor="middle" style="font-size:11px;fill:var(--bad)">${o.refLabel||"referência"}</text>`;
  groups.forEach((g,gi)=>{const y0=T+gi*rowH,col=g.color||GC[gi%5],v=g.v;if(!v.length)return;
    if(n>1)s+=`<text x="0" y="${y0+rowH/2+4}" class="lbl" style="font-size:12.5px;fill:${col}">${esc(g.name||"")}</text>`;
    // pontos empilhados por faixa de pixel
    const bins=new Map(),r=Math.max(2.4,Math.min(o.r||6,1400/(v.length+60))),yb=y0+rowH*.62;
    v.forEach((x,i)=>{const key=Math.round(X(x)/(r*2));const k=bins.get(key)||0;bins.set(key,k+1);const cy=yb-k*r*1.7;if(cy<y0+4)return;s+=`<circle ${o.drag?`data-i="${i}" data-g="${gi}" style="cursor:ew-resize"`:""} cx="${X(x)}" cy="${cy}" r="${r}" fill="${col}" fill-opacity=".55" stroke="${col}" stroke-width="1"/>`;});
    if(o.box!==false&&v.length>=3){const q=quartiles(v,o.qm||"exc"),iqr=q.q3-q.q1,lf=q.q1-1.5*iqr,uf=q.q3+1.5*iqr,inl=v.filter(x=>x>=lf&&x<=uf),wl=o.orig?Math.min(...v):Math.min(...inl),wh=o.orig?Math.max(...v):Math.max(...inl),yy=yb+r+13,bh=16;
      s+=`<line x1="${X(wl)}" x2="${X(q.q1)}" y1="${yy}" y2="${yy}" stroke="var(--fg)" stroke-width="1.4"/><line x1="${X(q.q3)}" x2="${X(wh)}" y1="${yy}" y2="${yy}" stroke="var(--fg)" stroke-width="1.4"/><line x1="${X(wl)}" x2="${X(wl)}" y1="${yy-5}" y2="${yy+5}" stroke="var(--fg)" stroke-width="1.4"/><line x1="${X(wh)}" x2="${X(wh)}" y1="${yy-5}" y2="${yy+5}" stroke="var(--fg)" stroke-width="1.4"/>`;
      s+=`<rect x="${X(q.q1)}" y="${yy-bh/2}" width="${Math.max(1,X(q.q3)-X(q.q1))}" height="${bh}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4" rx="2"/><line x1="${X(q.q2)}" x2="${X(q.q2)}" y1="${yy-bh/2}" y2="${yy+bh/2}" stroke="var(--alt)" stroke-width="3"/>`;
      if(!o.orig)v.filter(x=>x<lf||x>uf).forEach(x=>s+=`<circle cx="${X(x)}" cy="${yy}" r="3.2" fill="var(--bad)"/>`);}
    if(o.meanCI!==false&&v.length>=2){const d=descr(v),q=tq(.975,d.n-1),yy=y0+10;s+=`<line x1="${X(clamp(d.m-q*d.se,lo,hi))}" x2="${X(clamp(d.m+q*d.se,lo,hi))}" y1="${yy}" y2="${yy}" stroke="${col}" stroke-width="3" stroke-linecap="round"/><rect x="${X(d.m)-5}" y="${yy-5}" width="10" height="10" fill="${col}" transform="rotate(45 ${X(d.m)} ${yy})"/>`;}
  });
  s+=xAxis(X,ticks,T+n*rowH+2,o.fmt,L,W-R);el.innerHTML=s;return{X,lo,hi,L,iw,W};}

function qqplot(el,v,o={}){const H=o.h||200,W=box(el,H),n=v.length;if(n<3){msg(el,H,"Poucos dados");return;}const s=Array.from(sorted(v)),m=mean(v),sdv=sd(v),z=s.map((_,i)=>zq((i+1-.375)/(n+.25)));
  const L=42,R=10,T=10,B=30,iw=W-L-R,ih=H-T-B,[xl,xh]=niceDom(Math.min(...z),Math.max(...z)),[yl,yh]=niceDom(s[0],s[n-1]),X=x=>L+(x-xl)/(xh-xl)*iw,Y=y=>T+ih-(y-yl)/(yh-yl)*ih;let h="";
  h+=yGrid(Y,nice(yl,yh,4).filter(t=>t>=yl&&t<=yh),L,W-R);
  h+=`<line x1="${X(xl)}" y1="${Y(m+sdv*xl)}" x2="${X(xh)}" y2="${Y(m+sdv*xh)}" stroke="var(--alt)" stroke-width="2"/>`;
  s.forEach((y,i)=>h+=`<circle cx="${X(z[i])}" cy="${Y(y)}" r="3.2" fill="${o.color||"var(--accent)"}" fill-opacity=".7"/>`);
  h+=xAxis(X,nice(xl,xh,5).filter(t=>t>=xl&&t<=xh),T+ih,v=>fmt(v,0),L,W-R)+`<text x="${W-R}" y="${H-2}" text-anchor="end" style="font-size:11px">quantis teóricos (z)</text>`;el.innerHTML=h;}

function scatter(el,x,y,o={}){const H=o.h||260,W=box(el,H),L=46,R=12,T=12,B=34,iw=W-L-R,ih=H-T-B;if(x.length<2){msg(el,H,"Poucos pares");return null;}
  const fd=o.drag&&typeof TS!=="undefined"&&TS.fixDom;if(o.drag)el.style.touchAction="none";const [xl,xh]=o.xdom||(fd?fd[0]:niceDom(Math.min(...x),Math.max(...x))),[yl,yh]=o.ydom||(fd?fd[1]:niceDom(Math.min(...y),Math.max(...y))),X=v=>L+(v-xl)/(xh-xl)*iw,Y=v=>T+ih-(v-yl)/(yh-yl)*ih;let h="";
  h+=yGrid(Y,nice(yl,yh,4).filter(t=>t>=yl&&t<=yh),L,W-R,o.yfmt);
  if(o.band){let up="",dn="";const N=60;for(let i=0;i<=N;i++){const xv=xl+(xh-xl)*i/N,[a,b]=o.band(xv);up+=(i?"L":"M")+X(xv)+","+Y(clamp(b,yl,yh));dn=`L${X(xv)},${Y(clamp(a,yl,yh))}`+dn;}h+=`<path d="${up}${dn.replace(/^L/,"L")}Z" fill="var(--alt)" opacity=".15"/>`;}
  if(o.curve){let p="";for(let i=0;i<=120;i++){const xv=xl+(xh-xl)*i/120,yv=o.curve(xv);p+=(i?"L":"M")+X(xv)+","+Y(clamp(yv,yl-(yh-yl),yh+(yh-yl)));}h+=`<path d="${p}" fill="none" stroke="var(--alt)" stroke-width="2.4"/>`;}
  if(o.hline!=null)h+=`<line x1="${L}" x2="${W-R}" y1="${Y(o.hline)}" y2="${Y(o.hline)}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
  x.forEach((v,i)=>h+=`<circle ${o.drag?`data-i="${i}" style="cursor:move"`:""} cx="${X(v)}" cy="${Y(y[i]+(o.jit?o.jit[i]:0))}" r="${o.r||5}" fill="${o.color||"var(--accent)"}" fill-opacity=".6" stroke="${o.color||"var(--accent)"}"/>`);
  h+=xAxis(X,nice(xl,xh,Math.max(3,Math.floor(iw/80))).filter(t=>t>=xl&&t<=xh),T+ih,o.xfmt,L,W-R);
  if(o.xlab)h+=`<text x="${W-R}" y="${H-1}" text-anchor="end" style="font-size:11px">${esc(o.xlab)}</text>`;if(o.ylab)h+=`<text x="${L}" y="${T-1}" style="font-size:11px">${esc(o.ylab)}</text>`;
  el.innerHTML=h;return{X,Y,xl,xh,yl,yh,L,T,iw,ih};}

/* distribuição de referência (H0) com estatística observada e área do p */
function nullPlot(el,o){const H=o.h||170,W=box(el,H),L=10,R=10,T=18,B=30,iw=W-L-R,ih=H-T-B,[lo,hi]=o.range,X=v=>L+(v-lo)/(hi-lo)*iw;let ym=0;for(let i=0;i<=200;i++)ym=Math.max(ym,o.pdf(lo+(hi-lo)*i/200));const Y=v=>T+ih-v/ym/1.05*ih;let s="";
  const area=(a,b)=>{a=Math.max(a,lo);b=Math.min(b,hi);if(b<=a)return"";let d=`M${X(a)},${Y(0)}`;for(let i=0;i<=80;i++){const v=a+(b-a)*i/80;d+=`L${X(v)},${Y(o.pdf(v))}`;}return `<path d="${d}L${X(b)},${Y(0)}Z" fill="var(--accent)" opacity=".35"/>`;};
  (o.tails||[]).forEach(([a,b])=>s+=area(a,b));let p="";for(let i=0;i<=240;i++){const v=lo+(hi-lo)*i/240;p+=(i?"L":"M")+X(v).toFixed(1)+","+Y(o.pdf(v)).toFixed(1);}s+=`<path d="${p}" fill="none" stroke="var(--fg)" stroke-width="1.8"/>`;
  (o.crit||[]).forEach(c=>{if(c>lo&&c<hi)s+=`<line x1="${X(c)}" x2="${X(c)}" y1="${T}" y2="${T+ih}" stroke="var(--bad)" stroke-dasharray="4 3"/>`;});
  if(has(o.obs)){const xo=X(clamp(o.obs,lo,hi));s+=`<line x1="${xo}" x2="${xo}" y1="${T-4}" y2="${T+ih}" stroke="var(--accent)" stroke-width="2.5"/><text x="${clamp(xo,54,W-54)}" y="${T-6}" text-anchor="middle" class="lbl" style="fill:var(--accent);font-size:11.5px">${o.obsLabel}${o.obs>hi?" →":o.obs<lo?" ←":""}</text>`;}
  s+=xAxis(X,nice(lo,hi,Math.max(4,Math.floor(iw/70))).filter(v=>v>=lo&&v<=hi),T+ih,o.fmt||(v=>auto(v)),L,W-R);el.innerHTML=s;}
/* distribuição discreta (exata) */
function pmfPlot(el,pmf,o){const H=o.h||160,W=box(el,H),L=10,R=10,T=16,B=30,iw=W-L-R,ih=H-T-B,k0=o.k0||0,n=pmf.length,bw=iw/n,ym=Math.max(...pmf)*1.1,Y=v=>T+ih-v/ym*ih;let s="";
  pmf.forEach((q,i)=>{const k=k0+i,ext=o.isExt(k,q);s+=`<rect x="${L+i*bw+bw*.1}" y="${Y(q)}" width="${Math.max(1,bw*.8)}" height="${T+ih-Y(q)}" fill="${k===o.obs?"var(--alt)":ext?"var(--accent)":"var(--dot)"}" ${ext&&k!==o.obs?'opacity=".6"':""}/>`;});
  const X=k=>L+(k-k0+.5)*bw;s+=xAxis(X,nice(k0,k0+n-1,Math.max(3,Math.floor(iw/70))).filter(t=>t>=k0&&t<=k0+n-1&&Number.isInteger(t)),T+ih,v=>fmt(v,0),L,W-R);
  if(has(o.obs))s+=`<text x="${clamp(X(o.obs),50,W-50)}" y="${Math.max(12,Y(pmf[o.obs-k0]||0)-6)}" text-anchor="middle" class="lbl" style="font-size:11.5px;fill:var(--alt)">${o.obsLabel}</text>`;el.innerHTML=s;}
/* barra horizontal de estimativa com IC (forest de uma linha ou várias) */
function forest(el,rows,o={}){const H=rows.length*30+40,W=box(el,H),L=o.L??Math.min(130,W*.36),R=14,iw=W-L-R;const vals=rows.flatMap(r=>[r.lo,r.hi,r.e]).filter(has).concat(o.null??[]);let [a,b]=o.dom||niceDom(Math.min(...vals),Math.max(...vals));
  const lg=o.log,f=v=>lg?Math.log(v):v;if(lg){a=Math.min(...vals)*0.8;b=Math.max(...vals)*1.25;}const X=v=>L+(f(v)-f(a))/(f(b)-f(a))*iw;let s="";
  if(o.null!=null)s+=`<line x1="${X(o.null)}" x2="${X(o.null)}" y1="4" y2="${H-30}" stroke="var(--tick)" stroke-dasharray="4 3"/>`;
  rows.forEach((r,i)=>{const y=18+i*30,c=r.color||"var(--accent)";s+=`<text x="0" y="${y+4}" style="font-size:12px;fill:var(--fg)">${esc(r.name)}</text>`;if(has(r.lo)&&has(r.hi))s+=`<line x1="${X(clamp(r.lo,a,b))}" x2="${X(clamp(r.hi,a,b))}" y1="${y}" y2="${y}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;if(has(r.e))s+=`<circle cx="${X(r.e)}" cy="${y}" r="5.5" fill="${c}"/>`;});
  const ticks=lg?[0.1,0.2,0.25,0.5,1,2,4,5,10,20,50].filter(t=>t>=a&&t<=b):nice(a,b,Math.max(3,Math.floor(iw/80))).filter(t=>t>=a&&t<=b);s+=xAxis(X,ticks,H-28,o.fmt||(lg?numTxt:(v=>auto(v))),L,W-R);el.innerHTML=s;}

/* ---------- sheet e navegação ---------- */
function openSheet(t,h){const r=$("sheetRoot"),last=document.activeElement;r.innerHTML=`<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(t)}"><div class="sheet-h"><h3>${t}</h3><button class="x" id="sx" aria-label="Fechar">×</button></div><div class="learn">${h}</div></div></div>`;document.body.style.overflow="hidden";
  const close=()=>{r.innerHTML="";document.body.style.overflow="";document.removeEventListener("keydown",k);last&&last.focus&&last.focus();},k=e=>{if(e.key==="Escape")close();};document.addEventListener("keydown",k);$("sx").onclick=close;$("scrim").addEventListener("click",e=>{if(e.target.id==="scrim")close();});$("sx").focus();}
function chips(el,items,onPick,active){el.innerHTML=items.map((it,i)=>`<button class="chip ${i===active?"on":""}" data-i="${i}">${it}</button>`).join("");el.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;el.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",c===b));onPick(+b.dataset.i);};}
function segBind(el,val,on){el.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.v===val));el.onclick=e=>{const b=e.target.closest("button");if(!b)return;el.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));on(b.dataset.v);};}
const tile=(l,v,sub,c="")=>`<div class="tile ${c}"><span>${l}</span><b>${v}</b>${sub?`<small>${sub}</small>`:""}</div>`;
/* executa simulação em blocos para não travar a tela */
function runChunks(total,step,fn,onProg,onDone){let i=0;const tick=()=>{const end=Math.min(total,i+step);for(;i<end;i++)fn(i);onProg&&onProg(i/total);if(i<total)setTimeout(tick,0);else onDone&&onDone();};tick();}
const R={};let cur="var";
const SHARED={bench:null};
const LABS=[];
function LAB(id,grp,name,html,init,render){const s=document.createElement("section");s.className="lab";s.id="lab-"+id;s.hidden=true;s.innerHTML=html;$("labs").appendChild(s);LABS.push({id,grp,name,init,render,ready:false});R[id]=()=>{const L=LABS.find(l=>l.id===id);if(!L.ready){L.ready=true;init&&init();}render&&render();};}
