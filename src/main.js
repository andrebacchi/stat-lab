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
function fromHash(){const h=(location.hash||"").slice(1),[lab,sub]=h.split("-");go(LABS.some(l=>l.id===lab)?lab:"var");if(lab==="testes"&&sub&&TESTS[sub])selectTest(sub);}
fromHash();window.addEventListener("hashchange",()=>{fromHash();window.scrollTo({top:0});});

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
let deferredInstall=null;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;});window.addEventListener("appinstalled",()=>{deferredInstall=null;toast("STAT LAB instalado");});
$("instBtn").onclick=async()=>{if(deferredInstall){try{deferredInstall.prompt();const r=await deferredInstall.userChoice;deferredInstall=null;if(r&&r.outcome==="accepted")return;}catch(e){}}
  openSheet("Instalar o STAT LAB",`<p>O STAT LAB pode ficar na tela inicial como um aplicativo, abrir em tela cheia e funcionar sem internet depois da primeira visita.</p><div class="seg" id="platSeg" style="margin:6px 0 10px"><button data-p="ios">iPhone e iPad</button><button data-p="android">Android</button><button data-p="desktop">Computador</button></div><div id="platBody"></div>`);
  const set=k=>{$("platBody").innerHTML=SC[k];document.querySelectorAll("#platSeg button").forEach(b=>b.classList.toggle("on",b.dataset.p===k));};$("platSeg").onclick=e=>{const b=e.target.closest("button");if(b)set(b.dataset.p);};set(platform());};
