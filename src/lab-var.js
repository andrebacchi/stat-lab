/* ===================== VARIÁVEIS ===================== */
const VT={nom:"Qualitativa nominal",ord:"Qualitativa ordinal",bin:"Qualitativa binária",disc:"Quantitativa discreta",cont:"Quantitativa contínua"};
const VITEMS=[
 ["Pressão arterial sistólica (mmHg)","cont","Pode assumir qualquer valor numa régua contínua; o limite é a precisão do aparelho."],
 ["Número de infartos prévios","disc","É uma contagem: só valores inteiros (0, 1, 2…)."],
 ["Tipo sanguíneo (A, B, AB, O)","nom","Categorias sem ordem entre si."],
 ["Classe funcional da insuficiência cardíaca (I a IV)","ord","Há ordem (IV é pior que III), mas a distância entre as classes não é necessariamente igual."],
 ["Tabagismo (fumante / não fumante)","bin","Só duas categorias."],
 ["Hemoglobina (g/dL)","cont","Medida numa escala contínua."],
 ["Número de consultas no último ano","disc","Contagem de eventos."],
 ["Escolaridade (fundamental, médio, superior)","ord","Categorias com ordem natural."],
 ["Óbito em 30 dias (sim / não)","bin","Desfecho com duas categorias."],
 ["Índice de massa corporal (kg/m²)","cont","Contínua. Do IMC numérico chega-se a eutrófico, sobrepeso e obeso; o inverso não é possível."],
 ["Estado civil","nom","Categorias sem hierarquia."],
 ["Dor numa escala de 0 a 10","ord","Números que representam categorias ordenadas: a diferença entre 2 e 3 não é necessariamente igual à entre 8 e 9. Na prática, costuma ser analisada como numérica discreta, com cautela."],
 ["Temperatura corporal (°C)","cont","Escala contínua."],
 ["Número de filhos","disc","Contagem."],
 ["Estadiamento do câncer (I a IV)","ord","Ordem clara entre as categorias."],
 ["Hipertensão diagnosticada (sim / não)","bin","Duas categorias."],
 ["Glicemia de jejum (mg/dL)","cont","Escala contínua."],
 ["Glicemia categorizada (normal, pré-diabetes, diabetes)","ord","A mesma informação da glicemia, agora em categorias ordenadas. Perde-se detalhe ao categorizar."],
 ["Região do país (Norte, Nordeste…)","nom","Categorias sem ordem."],
 ["Número de comprimidos tomados por dia","disc","Contagem."],
 ["Idade (anos)","cont","Rigorosamente contínua (o tempo passa continuamente), embora costume ser registrada em anos inteiros."],
 ["Grau de satisfação (muito insatisfeito a muito satisfeito)","ord","Escala de Likert: categorias ordenadas."],
 ["Vacinado contra influenza (sim / não)","bin","Duas categorias."],
 ["Tempo de internação (dias)","cont","O tempo é contínuo; registrado em dias inteiros, muitas vezes é tratado como discreto. Costuma ter distribuição assimétrica."],
 ["Grupo do estudo (placebo, dose baixa, dose alta)","ord","Há ordem de dose. Se fossem tratamentos diferentes sem ordem, seria nominal."],
 ["Especialidade médica","nom","Categorias sem ordem."],
 ["Escore de Apgar (0 a 10)","ord","Soma de itens pontuados: ordinal, frequentemente analisado como discreto."],
 ["Colesterol LDL (mg/dL)","cont","Escala contínua."],
 ["Número de quedas no último ano","disc","Contagem."],
 ["Classificação de risco no pronto-socorro (vermelho, laranja, amarelo, verde, azul)","ord","Cores com ordem de prioridade."],
];
const VS={i:0,ans:null,hits:0,tries:0,order:[...VITEMS.keys()].sort(()=>Math.random()-.5)};
LAB("var","Descritiva","Variáveis",`
<div class="intro"><span class="eyebrow">Descritiva</span><h2>Que tipo de variável é esta?</h2><p>O tipo de variável decide como descrever os dados, qual gráfico usar e qual teste aplicar. Classifique e veja o caminho da descrição.</p></div>
<div class="grid two">
 <div class="card"><div class="card-h"><h3>Classifique a variável</h3><button class="more-btn" data-learn="var">Saiba mais</button></div><div id="varQ"></div><p class="note" id="varScore"></p></div>
 <div class="card"><div class="card-h"><h3>Como descrever?</h3><button class="more-btn" data-learn="descr">Saiba mais</button></div><div class="flow" id="flow"></div></div>
</div>`,()=>{
  $("varQ").addEventListener("click",e=>{const b=e.target.closest(".opt");if(b&&!VS.ans){VS.ans=b.dataset.k;VS.tries++;if(VS.ans===VITEMS[VS.order[VS.i%VITEMS.length]][1])VS.hits++;renderVar();}if(e.target.id==="varNext"){VS.i++;VS.ans=null;renderVar();}});
  $("flow").addEventListener("click",e=>{const b=e.target.closest("[data-f]");if(b){const [k,v]=b.dataset.f.split(":");FL[k]=v;if(k==="t")FL.n=null;renderFlow();}if(e.target.id==="flowGo")go("bancada");});
},()=>{renderVar();renderFlow();});
function renderVar(){const it=VITEMS[VS.order[VS.i%VITEMS.length]];
  let h=`<span class="eyebrow">Variável ${VS.i%VITEMS.length+1} de ${VITEMS.length}</span><div class="q">${it[0]}</div><div class="opts">`+Object.entries(VT).map(([k,v])=>{let c="";if(VS.ans){if(k===it[1])c="right";else if(k===VS.ans)c="wrong";}return `<button class="opt ${c}" data-k="${k}" ${VS.ans?"disabled":""}>${v}</button>`;}).join("")+`</div>`;
  if(VS.ans){const ok=VS.ans===it[1],near=!ok&&((it[1]==="bin"&&(VS.ans==="nom"||VS.ans==="ord"))||(it[1]==="cont"&&VS.ans==="disc")||(it[1]==="ord"&&VS.ans==="disc"));
    h+=`<div class="fb"><b class="${ok?"ok":near?"":"no"}">${ok?"Correto.":near?"Quase.":"Não é bem isso."}</b> É <b>${VT[it[1]].toLowerCase()}</b>. ${it[2]}</div><div class="row" style="margin-top:10px"><button class="btn small primary" id="varNext">Próxima variável</button></div>`;}
  $("varQ").innerHTML=h;$("varScore").textContent=VS.tries?`Acertos: ${VS.hits} de ${VS.tries}`:"";}
const FL={t:null,n:null};
function renderFlow(){let h=`<div class="st"><span class="eyebrow">1. Que tipo de variável?</span><div class="row"><button class="chip ${FL.t==="q"?"on":""}" data-f="t:q">Qualitativa</button><button class="chip ${FL.t==="n"?"on":""}" data-f="t:n">Quantitativa</button></div></div>`;
  if(FL.t==="n")h+=`<div class="st"><span class="eyebrow">2. A distribuição é simétrica (aproximadamente normal)?</span><div class="row"><button class="chip ${FL.n==="s"?"on":""}" data-f="n:s">Sim</button><button class="chip ${FL.n==="a"?"on":""}" data-f="n:a">Não, é assimétrica</button></div></div>`;
  let r=null;if(FL.t==="q")r=["Frequência e proporção (%)","Gráfico de barras","Ex.: 32% dos pacientes eram fumantes (45 de 140)."];
  if(FL.t==="n"&&FL.n==="s")r=["Média ± desvio padrão","Histograma","Ex.: PAS 128 ± 15 mmHg."];
  if(FL.t==="n"&&FL.n==="a")r=["Mediana [intervalo interquartil]","Boxplot","Ex.: tempo de internação 5 [4–7] dias."];
  if(r)h+=`<div class="res"><span class="eyebrow">Descreva com</span><b>${r[0]}</b><span class="eyebrow" style="display:block;margin-top:6px">Gráfico</span><b>${r[1]}</b><p class="note" style="margin-top:6px">${r[2]}</p></div><p class="insight">Relate sempre tendência central e dispersão juntas.</p>${FL.t==="n"?`<button class="btn small" id="flowGo">Testar com dados na bancada</button>`:""}`;
  $("flow").innerHTML=h;}
