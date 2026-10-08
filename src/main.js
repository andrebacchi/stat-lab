/* ===================== navegação e início ===================== */
function renderNav(){const L=LABS.find(l=>l.id===cur);document.querySelectorAll(".blk").forEach(b=>b.classList.toggle("on",b.dataset.grp===L.grp));
  $("subs").innerHTML=LABS.filter(l=>l.grp===L.grp).map((l,i)=>`<button class="sb ${l.id===cur?"on":""}" data-lab="${l.id}"><i>${i+1}</i>${l.name}</button>`).join("");
  const i=LABS.indexOf(L),p=LABS[i-1],n=LABS[i+1],gl=g=>g==="Descritiva"?"Descritiva":"Inferencial";
  $("labFoot").innerHTML=(p?`<button data-lab="${p.id}"><span>‹ Anterior${p.grp!==L.grp?" · "+gl(p.grp):""}</span><b>${p.name}</b></button>`:"")+(n?`<button class="nx" data-lab="${n.id}"><span>Próximo${n.grp!==L.grp?" · "+gl(n.grp):""} ›</span><b>${n.name}</b></button>`:"");}
function go(id){cur=id;document.querySelectorAll(".lab").forEach(s=>s.hidden=s.id!=="lab-"+id);renderNav();R[id]&&R[id]();try{history.replaceState(null,"","#"+id)}catch(e){}}
const navGo=id=>{go(id);window.scrollTo({top:0});};
$("subs").addEventListener("click",e=>{const b=e.target.closest("[data-lab]");if(b)navGo(b.dataset.lab);});
$("labFoot").addEventListener("click",e=>{const b=e.target.closest("[data-lab]");if(b)navGo(b.dataset.lab);});
$("blocks").addEventListener("click",e=>{const b=e.target.closest("[data-grp]");if(!b)return;const L=LABS.find(l=>l.id===cur);if(L.grp===b.dataset.grp)return;const first=LABS.find(l=>l.grp===b.dataset.grp);navGo(first.id);});
document.querySelectorAll(".more-btn").forEach(b=>b.insertAdjacentHTML("afterbegin",`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6.3"/><path d="M8 7.2v4M8 4.9v.1" stroke-linecap="round"/></svg>`));
document.addEventListener("click",e=>{if(e.target.closest("[data-gloss]")){openGloss();return;}const b=e.target.closest("[data-learn]");if(b){const L=LEARN[b.dataset.learn];if(L)openSheet(L[0],L[1]);}});
$("howBtn").onclick=()=>openSheet("Como usar o STAT LAB",`<p>O STAT LAB é um laboratório para experimentar com estatística: você coloca números, mexe nos controles e vê o que acontece. No topo, escolha o bloco (descritiva ou inferencial) e depois a tela. No fim de cada tela há atalhos para a anterior e a próxima.</p>
<h4>As bancadas</h4><p><b>Estatística descritiva:</b> ${LABS.filter(l=>l.grp==="Descritiva").map(l=>l.name).join(", ")}.</p><p><b>Estatística inferencial:</b> ${LABS.filter(l=>l.grp==="Inferencial").map(l=>l.name).join(", ")}.</p>
<h4>Dados</h4><ul><li>Digite ou cole números separados por espaço, ponto e vírgula ou quebra de linha. Vírgula é decimal. Uma coluna copiada do Excel funciona.</li><li>Todo campo com exemplos tem botões prontos para começar.</li><li>Na bancada de dados e nas correlações, dá para arrastar os pontos no gráfico.</li><li>Os dados da bancada podem ser levados para o laboratório de testes, para o Teorema Central do Limite e para a calculadora de IC.</li></ul>
<h4>Laboratório de testes</h4><ul><li>Escolha o teste (ou responda às perguntas do guia), use um exemplo ou seus dados.</li><li>Veja os dados, a distribuição de referência com o valor de p, o resultado e uma frase pronta para relatar.</li><li>No mundo simulado, defina a verdade da população e simule mil estudos para ver o poder, o erro tipo I e a comparação entre teste paramétrico e não paramétrico.</li></ul>
<h4>Glossário e memória</h4><ul><li>O botão <b>Glossário</b> explica símbolos e abreviações (α, β, gl, IC, OR…).</li><li>Os dados que você digita ficam guardados neste navegador e voltam quando a página é reaberta.</li><li>No laboratório de testes, a chave <b>Essencial / Completo</b> controla o nível de detalhe.</li></ul>
<div class="resetbox"><b>Restaurar exemplos</b><p style="margin:4px 0 8px">Apaga os dados que você digitou neste navegador e volta aos exemplos iniciais.</p><button class="btn small" id="rst1">Restaurar exemplos</button><span id="rst2"></span></div>
<h4>Sugestão para aula</h4><ol><li>Peça para a turma prever o que vai acontecer (a média muda? o poder sobe?).</li><li>Mostre no laboratório.</li><li>Discuta a diferença entre a previsão e o resultado.</li></ol>
<p class="src">Os cálculos seguem os mesmos métodos do R e do jamovi (conferidos). Pequenas diferenças podem surgir em testes por postos com amostras pequenas e empates, onde os programas escolhem entre p exato e aproximado.</p>`);
let rt;window.addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(()=>R[cur]&&R[cur](),150);});
loadState();
/* Ligações da família BACCHI LAB: números no endereço (?a=&b=&c=&d=), tela depois do # (testes-chi, testes-fisher, testes-mcn),
   origem em "de". Lê uma vez, valida, limpa o endereço e mostra um aviso. Hoje só o 2×2 LAB envia. */
const ORIGEM={"2-2-lab":"2×2 LAB"};
function fromLink(){let q;try{q=new URLSearchParams(location.search);}catch(e){return null;}if(![..."abcd"].some(k=>q.has(k)))return null;
  try{history.replaceState(null,"",location.pathname+location.hash);}catch(e){}
  const n=k=>{const v=Number(q.get(k));return Number.isInteger(v)&&v>=0&&v<=1e6?v:null;},v=[..."abcd"].map(n);if(v.some(x=>x===null)||v[0]+v[1]+v[2]+v[3]<1)return null;
  const txt=k=>String(q.get(k)||"").replace(/[<>"&]/g,"").trim().slice(0,40),[a,b,c,d]=v,ex=txt("ex"),ds=txt("ds"),de=ORIGEM[q.get("de")]||"outro app";
  const test=((location.hash||"").match(/^#testes-(chi|fisher|mcn)$/)||[])[1]||"chi";
  try{history.replaceState(null,"",location.pathname+"#testes-"+test);}catch(e){}
  if(test==="mcn")TD.mcn={t:[[a,b],[c,d]],lab:["Sim","Não"],pi:-1};
  else TD.tab={t:[[a,b],[c,d]],rn:ex?[ex+": sim",ex+": não"]:["Exposto","Não exposto"],cn:ds?[ds+": sim",ds+": não"]:["Com desfecho","Sem desfecho"],pi:-1};
  SIMP[test==="mcn"?"mcn":"tab"]=null;
  return{test,de,a,b,c,d};}
function linkBanner(L){if(!L)return;const N=L.a+L.b+L.c+L.d,box=document.createElement("div");box.className="linkbox";box.id="linkBanner";box.setAttribute("role","status");
  box.innerHTML=`<p><b>Recebido do ${L.de}:</b> a tabela ${L.a} · ${L.b} · ${L.c} · ${L.d} (N = ${N}). `+(L.test==="mcn"?`Ela foi lida como pares: nas linhas, a primeira medida; nas colunas, a segunda. Só os pares discordantes (${L.b} e ${L.c}) entram no teste.`:`Use <b>Ver com ${TESTS[L.test==="chi"?"fisher":"chi"].name}</b> para comparar os dois testes.`)+` No modo <b>Completo</b> aparecem a distribuição de referência e a simulação de mil estudos.</p><button class="btn small" id="linkClose">Entendi</button>`;
  const intro=document.querySelector("#lab-testes .intro");intro&&intro.after(box);$("linkClose").onclick=()=>box.remove();}
const LINK=fromLink();
function fromHash(){const h=(location.hash||"").slice(1),[lab,sub]=h.split("-");go(LABS.some(l=>l.id===lab)?lab:"var");if(lab==="testes"&&sub&&TESTS[sub])selectTest(sub);}
fromHash();linkBanner(LINK);window.addEventListener("hashchange",()=>{fromHash();window.scrollTo({top:0});});

(function(){let seen=false;try{seen=localStorage.getItem("statlab.intro")==="1";}catch(e){}const w=$("welcome");if(!seen)w.hidden=false;
  const done=()=>{w.hidden=true;try{localStorage.setItem("statlab.intro","1")}catch(e){}};
  $("wClose").onclick=done;$("wStart").onclick=()=>{done();navGo("var");};})();
document.addEventListener("click",e=>{if(e.target.id==="rst1"){$("rst2").innerHTML=` <button class="btn small" id="rst3" style="border-color:var(--bad);color:var(--bad)">Confirmar: apagar meus dados</button>`;}
  if(e.target.id==="rst3"){try{localStorage.removeItem("statlab.data");localStorage.removeItem("statlab.mode");}catch(err){}location.hash="";location.reload();}});

/* instalar como aplicativo */
function platform(){const u=navigator.userAgent||"";if(/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1))return"ios";if(/Android/.test(u))return"android";return"desktop";}
const SC={ios:`<ol class="steps-l"><li>Abra esta página no <b>Safari</b>.</li><li>Toque em <b>Compartilhar</b> <kbd>⬆︎</kbd>.</li><li>Toque em <b>Adicionar à Tela de Início</b>.</li><li>Confirme o nome e toque em <b>Adicionar</b>.</li></ol>`,
 android:`<ol class="steps-l"><li>Abra esta página no <b>Chrome</b>.</li><li>Toque no menu <kbd>⋮</kbd>.</li><li>Toque em <b>Adicionar à tela inicial</b> ou <b>Instalar app</b>.</li><li>Confirme. O ícone aparece junto dos seus apps.</li></ol>`,
 desktop:`<ol class="steps-l"><li><b>Chrome ou Edge:</b> use o ícone de instalar na barra de endereço, ou o menu <kbd>⋮</kbd> → <b>Transmitir, salvar e compartilhar</b> → <b>Instalar página como app</b>.</li><li><b>Safari (Mac):</b> menu <b>Arquivo</b> → <b>Adicionar ao Dock</b>.</li><li><b>Qualquer navegador:</b> salve nos favoritos com <kbd>Ctrl</kbd>+<kbd>D</kbd>.</li></ol>`};
/* Janela em que o app está rodando: "navegador" (aba comum), "propria" (instalado, na janela dele) ou "outra"
   (aberto dentro de outro app instalado, como o BACCHI LAB). Neste último caso o Android também responde
   display-mode: standalone, e o botão Instalar sumia para quem ainda não tinha o app: a diferença é de onde a página veio. */
function janelaApp(k){
  if(!(matchMedia("(display-mode: standalone)").matches||navigator.standalone===true))return"navegador";
  let fora=false,marca=false;
  try{const r=document.referrer&&new URL(document.referrer);fora=!!r&&r.origin===location.origin&&!r.pathname.startsWith(new URL("./",location.href).pathname);}catch(e){}
  try{if(!document.referrer)localStorage.setItem(k,"1");if(!fora)sessionStorage.setItem(k,"1");marca=localStorage.getItem(k)==="1"||sessionStorage.getItem(k)==="1";}catch(e){}
  return !fora||marca?"propria":"outra";
}
/* Confirmação do próprio navegador, quando ele sabe responder (Chrome no Android, pelo related_applications do manifest). */
function appInstalado(k){
  if(!navigator.getInstalledRelatedApps)return Promise.resolve(false);
  return navigator.getInstalledRelatedApps().then(l=>{if(l.length){try{localStorage.setItem(k,"1");}catch(e){}}return l.length>0;}).catch(()=>false);
}
const JAN_K="stat-lab.instalado";let janela=janelaApp(JAN_K);if(janela==="outra")appInstalado(JAN_K).then(ok=>{if(ok)janela="propria";});
let deferredInstall=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;});window.addEventListener("appinstalled",()=>{deferredInstall=null;try{localStorage.setItem(JAN_K,"1");}catch(e){}toast("STAT LAB instalado");});
/* QR code do app (padrão do BACCHI LAB). O desenho é fixo: aponta para o endereço do app no ar.
   Foi gerado com o qrcode.js do repositório bacchilab (nível M); se o endereço mudar, gere de novo. */
const QR_URL="https://andrebacchi.github.io/stat-lab/",QR_SVG="<svg viewBox=\"0 0 33 33\" shape-rendering=\"crispEdges\" role=\"img\" aria-label=\"QR code para andrebacchi.github.io/stat-lab\"><rect width=\"33\" height=\"33\" fill=\"#fff\"/><path d=\"M2 2h7v1h-7zM16 2h2v1h-2zM21 2h1v1h-1zM24 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM13 3h2v1h-2zM17 3h4v1h-4zM22 3h1v1h-1zM24 3h1v1h-1zM30 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM11 4h1v1h-1zM13 4h2v1h-2zM16 4h1v1h-1zM19 4h2v1h-2zM24 4h1v1h-1zM26 4h3v1h-3zM30 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM11 5h1v1h-1zM14 5h1v1h-1zM16 5h1v1h-1zM20 5h1v1h-1zM24 5h1v1h-1zM26 5h3v1h-3zM30 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM11 6h2v1h-2zM14 6h7v1h-7zM24 6h1v1h-1zM26 6h3v1h-3zM30 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM10 7h1v1h-1zM12 7h2v1h-2zM16 7h3v1h-3zM21 7h1v1h-1zM24 7h1v1h-1zM30 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h7v1h-7zM11 9h2v1h-2zM17 9h1v1h-1zM19 9h1v1h-1zM21 9h2v1h-2zM2 10h1v1h-1zM5 10h1v1h-1zM7 10h2v1h-2zM10 10h1v1h-1zM13 10h3v1h-3zM17 10h2v1h-2zM23 10h1v1h-1zM25 10h1v1h-1zM2 11h2v1h-2zM5 11h1v1h-1zM7 11h1v1h-1zM9 11h2v1h-2zM12 11h1v1h-1zM14 11h1v1h-1zM19 11h2v1h-2zM22 11h3v1h-3zM27 11h1v1h-1zM30 11h1v1h-1zM2 12h2v1h-2zM7 12h6v1h-6zM14 12h1v1h-1zM21 12h3v1h-3zM27 12h3v1h-3zM2 13h4v1h-4zM7 13h1v1h-1zM11 13h2v1h-2zM14 13h2v1h-2zM17 13h2v1h-2zM20 13h1v1h-1zM28 13h2v1h-2zM5 14h1v1h-1zM8 14h1v1h-1zM10 14h1v1h-1zM14 14h1v1h-1zM16 14h1v1h-1zM19 14h1v1h-1zM21 14h5v1h-5zM27 14h1v1h-1zM29 14h2v1h-2zM3 15h2v1h-2zM7 15h1v1h-1zM10 15h2v1h-2zM13 15h3v1h-3zM19 15h1v1h-1zM21 15h1v1h-1zM23 15h1v1h-1zM3 16h1v1h-1zM5 16h4v1h-4zM10 16h1v1h-1zM12 16h2v1h-2zM15 16h2v1h-2zM20 16h1v1h-1zM22 16h1v1h-1zM24 16h7v1h-7zM2 17h2v1h-2zM5 17h1v1h-1zM9 17h4v1h-4zM14 17h1v1h-1zM17 17h1v1h-1zM19 17h1v1h-1zM21 17h1v1h-1zM23 17h2v1h-2zM27 17h1v1h-1zM29 17h1v1h-1zM3 18h2v1h-2zM8 18h2v1h-2zM12 18h4v1h-4zM19 18h2v1h-2zM22 18h2v1h-2zM29 18h1v1h-1zM3 19h1v1h-1zM6 19h2v1h-2zM9 19h2v1h-2zM14 19h3v1h-3zM18 19h2v1h-2zM23 19h3v1h-3zM27 19h1v1h-1zM30 19h1v1h-1zM2 20h1v1h-1zM8 20h1v1h-1zM10 20h3v1h-3zM16 20h1v1h-1zM18 20h2v1h-2zM22 20h1v1h-1zM24 20h1v1h-1zM29 20h2v1h-2zM4 21h2v1h-2zM9 21h3v1h-3zM13 21h1v1h-1zM16 21h2v1h-2zM19 21h1v1h-1zM24 21h1v1h-1zM26 21h1v1h-1zM29 21h2v1h-2zM2 22h1v1h-1zM4 22h1v1h-1zM7 22h7v1h-7zM21 22h6v1h-6zM28 22h1v1h-1zM10 23h1v1h-1zM13 23h2v1h-2zM16 23h1v1h-1zM18 23h1v1h-1zM21 23h2v1h-2zM26 23h1v1h-1zM28 23h3v1h-3zM2 24h7v1h-7zM11 24h1v1h-1zM18 24h1v1h-1zM20 24h1v1h-1zM22 24h1v1h-1zM24 24h1v1h-1zM26 24h1v1h-1zM29 24h1v1h-1zM2 25h1v1h-1zM8 25h1v1h-1zM10 25h5v1h-5zM16 25h1v1h-1zM20 25h1v1h-1zM22 25h1v1h-1zM26 25h3v1h-3zM30 25h1v1h-1zM2 26h1v1h-1zM4 26h3v1h-3zM8 26h1v1h-1zM12 26h2v1h-2zM19 26h1v1h-1zM22 26h5v1h-5zM29 26h2v1h-2zM2 27h1v1h-1zM4 27h3v1h-3zM8 27h1v1h-1zM10 27h2v1h-2zM13 27h1v1h-1zM21 27h2v1h-2zM24 27h6v1h-6zM2 28h1v1h-1zM4 28h3v1h-3zM8 28h1v1h-1zM13 28h2v1h-2zM26 28h3v1h-3zM30 28h1v1h-1zM2 29h1v1h-1zM8 29h1v1h-1zM13 29h3v1h-3zM18 29h6v1h-6zM29 29h1v1h-1zM2 30h7v1h-7zM10 30h2v1h-2zM17 30h1v1h-1zM19 30h2v1h-2zM22 30h3v1h-3zM26 30h2v1h-2zM29 30h1v1h-1z\" fill=\"#161a22\"/></svg>";
function showQR(){
  openSheet("QR code do STAT LAB",`<div class="qr-wrap"><p>Aponte a câmera do celular para o código.</p><div class="qr-box">${QR_SVG}</div><p class="qr-url" id="qrUrl">andrebacchi.github.io/stat-lab</p><div class="qr-acts"><button class="btn primary" id="qrCopy">Copiar link</button>${navigator.share?'<button class="btn" id="qrShare">Compartilhar</button>':''}</div><p class="qr-nota">QR Code é marca registrada da DENSO WAVE INCORPORATED.</p></div>`);
  const g=id=>document.getElementById(id);
  g("qrCopy").onclick=async e=>{const b=e.currentTarget;
    try{await navigator.clipboard.writeText(QR_URL);b.textContent="Link copiado";}
    catch(_){const r=document.createRange();r.selectNodeContents(g("qrUrl"));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="Selecionado: copie";}
    setTimeout(()=>{if(b.isConnected)b.textContent="Copiar link";},2200);};
  if(g("qrShare"))g("qrShare").onclick=()=>navigator.share({title:"STAT LAB",url:QR_URL}).catch(()=>{});
}
document.getElementById("qrBtn").onclick=showQR;
$("instBtn").onclick=async()=>{if(deferredInstall){try{deferredInstall.prompt();const r=await deferredInstall.userChoice;deferredInstall=null;if(r&&r.outcome==="accepted")return;}catch(e){}}
  openSheet("Instalar o STAT LAB",`${janela==="outra"?`<p class="fora">Você abriu este app por dentro de outro, como o BACCHI LAB, e daqui não dá para instalar. Toque em <kbd>⋮</kbd> no alto da tela e em <b>Abrir no Chrome</b>; lá, toque de novo em <b>Instalar</b>.</p>`:""}<p>O STAT LAB pode ficar na tela inicial como um aplicativo, abrir em tela cheia e funcionar sem internet depois da primeira visita.</p><div class="seg" id="platSeg" style="margin:6px 0 10px"><button data-p="ios">iPhone e iPad</button><button data-p="android">Android</button><button data-p="desktop">Computador</button></div><div id="platBody"></div>`);
  const set=k=>{$("platBody").innerHTML=SC[k];document.querySelectorAll("#platSeg button").forEach(b=>b.classList.toggle("on",b.dataset.p===k));};$("platSeg").onclick=e=>{const b=e.target.closest("button");if(b)set(b.dataset.p);};set(platform());};
