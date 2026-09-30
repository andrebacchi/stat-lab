/* ===================== TABELA DE DADOS (uma linha por participante) ===================== */
const GRIDK=new Set(["pair","krep","xy","xbin"]);
function gridCols(k,d){
  if(k==="pair")return[{get:()=>d.a,set:v=>d.a=v,name:()=>d.na||"",setName:s=>d.na=s},{get:()=>d.b,set:v=>d.b=v,name:()=>d.nb||"",setName:s=>d.nb=s}];
  if(k==="krep")return d.g.map((_,j)=>({get:()=>d.g[j],set:v=>d.g[j]=v,name:()=>d.names[j]||"",setName:s=>d.names[j]=s}));
  return[{get:()=>d.x,set:v=>d.x=v,name:()=>d.nx||"",setName:s=>d.nx=s},{get:()=>d.y,set:v=>d.y=v,name:()=>d.ny||"",setName:s=>d.ny=s}];}
const gridN=(k,d)=>Math.max(0,...gridCols(k,d).map(c=>c.get().length));
function gridPad(k,d){const n=gridN(k,d);gridCols(k,d).forEach(c=>{const a=c.get();while(a.length<n)a.push(null);});}
/* só as linhas completas entram na análise */
function cleanData(k,d){if(!GRIDK.has(k))return{d,idx:null,drop:0};const C=gridCols(k,d),n=gridN(k,d),idx=[];for(let i=0;i<n;i++)if(C.every(c=>has(c.get()[i])))idx.push(i);
  const o=Object.assign({},d);if(k==="pair"){o.a=idx.map(i=>d.a[i]);o.b=idx.map(i=>d.b[i]);}else if(k==="krep"){o.g=d.g.map(c=>idx.map(i=>c[i]));}else{o.x=idx.map(i=>d.x[i]);o.y=idx.map(i=>d.y[i]);}
  const filled=[...Array(n).keys()].filter(i=>C.some(c=>has(c.get()[i]))).length;return{d:o,idx,drop:filled-idx.length};}
function gridHTML(k,d){gridPad(k,d);const C=gridCols(k,d),n=gridN(k,d),diff=k==="pair";
  const hd=C.map((c,j)=>`<th><input data-gh="${j}" value="${esc(c.name())}" aria-label="Nome da coluna ${j+1}"></th>`).join("");
  let rows="";for(let i=0;i<n;i++){const vals=C.map(c=>c.get()[i]),df=diff&&has(vals[0])&&has(vals[1])?numTxt(+(vals[1]-vals[0]).toFixed(6)):"";
    rows+=`<tr><td class="rn">${i+1}</td>${vals.map((v,j)=>`<td><input data-gr="${i}" data-gc="${j}" inputmode="decimal" value="${has(v)?numTxt(v):""}" aria-label="Linha ${i+1}, ${esc(C[j].name()||"coluna "+(j+1))}"></td>`).join("")}${diff?`<td class="ro" data-df="${i}">${df}</td>`:""}<td><button class="rowdel" data-del="${i}" aria-label="Apagar linha ${i+1}">×</button></td></tr>`;}
  const cl=cleanData(k,d);
  return `<div class="gridwrap"><table class="grid-in"><thead><tr><th class="rn">#</th>${hd}${diff?`<th class="ro">Diferença<br><span class="mini">2ª − 1ª</span></th>`:""}<th></th></tr></thead><tbody>${rows}</tbody></table></div>
   <div class="row" style="margin-top:8px"><button class="tool" id="gAdd">+ linha</button><button class="tool" id="gAdd5">+ 5 linhas</button><button class="tool" id="gClear">Limpar tabela</button><span class="mini" id="gCount">${gridCountTxt(k,cl)}</span></div>
   <p class="note">Cada linha é um participante${k==="krep"||k==="pair"?", com as medidas nas colunas":", com as duas variáveis nas colunas"}${k==="xbin"?" (Y só aceita 0 e 1)":""}. Dá para colar direto do Excel: copie as colunas (com ou sem o cabeçalho) e cole na primeira célula. Enter desce para a linha seguinte.</p>`;}
function gridCountTxt(k,cl){const n=k==="krep"?cl.d.g[0].length:k==="pair"?cl.d.a.length:cl.d.x.length;return `${n} ${k==="xy"||k==="xbin"?"pares":"participantes"} completos${cl.drop?` · ${cl.drop} linha(s) incompleta(s) ignorada(s)`:""}`;}
function gridRead(el,k,d){const C=gridCols(k,d);
  if(el.dataset.gh!=null){C[+el.dataset.gh].setName(el.value);return true;}
  if(el.dataset.gr==null)return false;const i=+el.dataset.gr,j=+el.dataset.gc,v=parse(el.value);C[j].get()[i]=has(v)?v:null;
  if(k==="pair"){const td=document.querySelector(`[data-df="${i}"]`);if(td)td.textContent=has(d.a[i])&&has(d.b[i])?numTxt(+(d.b[i]-d.a[i]).toFixed(6)):"";}
  $("gCount").textContent=gridCountTxt(k,cleanData(k,d));return true;}
function gridFocus(i,j){const x=document.querySelector(`#tIn [data-gr="${i}"][data-gc="${j}"]`);if(x){x.focus();x.select&&x.select();}}
function gridBind(el,k){
  el.onkeydown=e=>{const t=e.target;if(t.dataset.gr==null||e.key!=="Enter")return;e.preventDefault();const d=TD[k],i=+t.dataset.gr,j=+t.dataset.gc;if(i+1>=gridN(k,d)){gridCols(k,d).forEach(c=>c.get().push(null));buildInputs();}gridFocus(i+1,j);};
  el.onpaste=e=>{const t=e.target;if(t.dataset.gr==null&&t.dataset.gh==null)return;const txt=(e.clipboardData||window.clipboardData).getData("text");if(!/[\t\n]/.test(txt.trim()))return;e.preventDefault();
    const d=TD[k],C=gridCols(k,d);let lines=txt.replace(/\r/g,"").split("\n").filter(l=>l.trim()!=="").map(l=>l.split(/\t|;/));let r0=t.dataset.gr!=null?+t.dataset.gr:0,c0=t.dataset.gc!=null?+t.dataset.gc:+t.dataset.gh;
    if(lines.length&&lines[0].some(x=>x.trim()!==""&&!has(parse(x)))){lines[0].forEach((x,j)=>{if(C[c0+j])C[c0+j].setName(x.trim());});lines=lines.slice(1);if(t.dataset.gh!=null)r0=0;}
    lines.forEach((cells,ii)=>cells.forEach((x,jj)=>{const col=C[c0+jj];if(!col)return;const a=col.get();while(a.length<=r0+ii)a.push(null);const v=parse(x);a[r0+ii]=has(v)?v:null;}));
    gridPad(k,d);d.pi=-1;buildInputs();analyze();fillSimFromData();buildSim();toast(`${lines.length} linha(s) coladas`);};
}
function gridClick(id,k,d,btn){const C=gridCols(k,d);
  if(id==="gAdd"||id==="gAdd5"){for(let r=0;r<(id==="gAdd"?1:5);r++)C.forEach(c=>c.get().push(null));buildInputs();gridFocus(gridN(k,d)-(id==="gAdd"?1:5),0);return true;}
  if(id==="gClear"){C.forEach(c=>c.set(Array(5).fill(null)));if(k==="krep")d.g=d.g.map(()=>Array(5).fill(null));buildInputs();analyze();return true;}
  if(btn&&btn.dataset.del!=null){const i=+btn.dataset.del;C.forEach(c=>c.get().splice(i,1));buildInputs();analyze();return true;}
  return false;}
