/* ===================== LABORATÓRIO DE TESTES: dados ===================== */
const TS={test:"tind",alpha:.05,sim:null,simRun:0,pickOpen:true};
const rnd=(v,d=0)=>+v.toFixed(d);
const G=(seed,n,m,s,shape="norm",d=0,min=-Infinity,max=Infinity)=>withSeed(seed,()=>Array.from({length:n},()=>rnd(clamp(draw(m,s,shape),min,max),d)));
/* ---------- tipos de dados ---------- */
const TK={
 one:{label:"uma amostra",
  presets:[
   {n:"PAS de hipertensos tratados × meta 120",d:()=>({v:G(21,40,128,12),name:"PAS (mmHg)",mu0:120})},
   {n:"Tempo de espera × meta 30 min",d:()=>({v:G(22,25,38,20,"skew",0,3),name:"Espera (min)",mu0:30})},
   {n:"Hemoglobina × 13,5 (sem diferença)",d:()=>({v:G(23,30,13.5,1.2,"norm",1),name:"Hemoglobina (g/dL)",mu0:13.5})},
   {n:"Dor (0–10) × 5",d:()=>({v:G(24,20,3.8,2,"norm",0,0,10),name:"Dor (0–10)",mu0:5})}],
  sim:[["m","Média verdadeira",128],["s","Desvio padrão",12],["n","n",40],["mu0","Referência μ₀",120]],shape:true,
  gen:(P)=>({v:Array.from({length:P.n},()=>draw(P.m,P.s,P.shape)),mu0:P.mu0}),
  fromData:d=>{const x=descr(d.v);return{m:rnd(x.m,2),s:rnd(x.s,2),n:x.n,mu0:d.mu0??0};}},
 two:{label:"dois grupos",
  presets:[
   {n:"PAS: tratamento × controle",d:()=>({a:G(31,30,124,14),b:G(32,30,132,14),na:"Tratamento",nb:"Controle",name:"PAS (mmHg)"})},
   {n:"Internação: protocolo novo × padrão",d:()=>({a:G(33,25,6,4,"skew",0,1),b:G(34,25,9,6,"skew",0,1),na:"Novo",nb:"Padrão",name:"Internação (dias)"})},
   {n:"Colesterol: sem diferença real",d:()=>({a:G(35,40,200,35),b:G(36,40,200,35),na:"Grupo A",nb:"Grupo B",name:"Colesterol (mg/dL)"})},
   {n:"Grupos pequenos (n = 6)",d:()=>({a:[9.1,10.4,8.7,11.8,10.9,9.6],b:[12.2,13.9,11.5,14.8,12.7,13.1],na:"Controle",nb:"Tratado",name:"Escore"})},
   {n:"Dor (0–10): acupuntura × placebo",d:()=>({a:G(37,22,4,2,"norm",0,0,10),b:G(38,22,5.5,2,"norm",0,0,10),na:"Acupuntura",nb:"Placebo",name:"Dor (0–10)"})}],
  sim:[["ma","Média do grupo 1",124],["mb","Média do grupo 2",132],["s","Desvio padrão",14],["na","n do grupo 1",30],["nb","n do grupo 2",30]],shape:true,
  gen:P=>({a:Array.from({length:P.na},()=>draw(P.ma,P.s,P.shape)),b:Array.from({length:P.nb},()=>draw(P.mb,P.s,P.shape))}),
  fromData:d=>{const a=descr(d.a),b=descr(d.b);return{ma:rnd(a.m,2),mb:rnd(b.m,2),s:rnd(Math.sqrt((a.s**2+b.s**2)/2),2),na:a.n,nb:b.n};}},
 pair:{label:"dois momentos",
  presets:[
   {n:"Colesterol antes e depois do exercício",d:()=>{const a=G(41,20,210,30);const c=G(42,20,-12,14);return{a,b:a.map((v,i)=>v+c[i]),na:"Antes",nb:"Depois",name:"Colesterol (mg/dL)"};}},
   {n:"Ansiedade (0–40) antes e depois da terapia",d:()=>{const a=G(43,16,24,6,"norm",0,0,40);const c=G(44,16,-5,6,"skew");return{a,b:a.map((v,i)=>clamp(v+c[i],0,40)),na:"Antes",nb:"Depois",name:"Ansiedade (0–40)"};}},
   {n:"Sem efeito real",d:()=>{const a=G(45,18,80,12);const c=G(46,18,0,8);return{a,b:a.map((v,i)=>v+c[i]),na:"Antes",nb:"Depois",name:"Frequência cardíaca (bpm)"};}}],
  sim:[["m","Média antes",210],["c","Mudança média",-12],["sc","DP da mudança",14],["sb","DP entre pessoas",30],["n","Pares",20]],shape:true,
  gen:P=>{const a=Array.from({length:P.n},()=>P.m+P.sb*randn());return{a,b:a.map(v=>v+draw(P.c,P.sc,P.shape))};},
  fromData:d=>{const df=d.b.map((v,i)=>v-d.a[i]),x=descr(df),a=descr(d.a);return{m:rnd(a.m,2),c:rnd(x.m,2),sc:rnd(x.s,2),sb:rnd(a.s,2),n:x.n};}},
 k:{label:"três ou mais grupos",
  presets:[
   {n:"Colesterol com as dietas A, B e C",d:()=>({g:[G(51,15,205,20),G(52,15,196,20),G(53,15,184,20)],names:["Dieta A","Dieta B","Dieta C"],name:"Colesterol (mg/dL)"})},
   {n:"Internação em 3 hospitais (assimétrico)",d:()=>({g:[G(54,20,5,3,"skew",0,1),G(55,20,6,4,"skew",0,1),G(56,20,9,6,"skew",0,1)],names:["Hospital 1","Hospital 2","Hospital 3"],name:"Internação (dias)"})},
   {n:"Quatro grupos, sem diferença",d:()=>({g:[G(57,12,50,10),G(58,12,50,10),G(59,12,50,10),G(60,12,50,10)],names:["G1","G2","G3","G4"],name:"Escore"})}],
  sim:[["means","Médias (separe por espaço)","205 196 184"],["s","Desvio padrão",20],["n","n por grupo",15]],shape:true,
  gen:P=>({g:P.means.map(m=>Array.from({length:P.n},()=>draw(m,P.s,P.shape)))}),
  fromData:d=>{const D=d.g.map(descr);return{means:D.map(x=>numTxt(rnd(x.m,1))).join(" "),s:rnd(Math.sqrt(mean(D.map(x=>x.s**2))),2),n:Math.round(mean(D.map(x=>x.n)))};}},
 krep:{label:"três ou mais momentos",
  presets:[
   {n:"PAS em 0, 3 e 6 meses",d:()=>{const b=G(61,15,150,12);const c=[0,-8,-12];return{g:c.map((d,j)=>b.map((v,i)=>rnd(v+d+withSeed(62+j*50+i,()=>6*randn())))),names:["0 mês","3 meses","6 meses"],name:"PAS (mmHg)"};}},
   {n:"Dor (0–10) em 3 momentos",d:()=>{const b=G(63,12,6,1.5,"norm",0,0,10);const c=[0,-1,-2];return{g:c.map((d,j)=>b.map((v,i)=>clamp(Math.round(v+d+withSeed(64+j*50+i,()=>1.2*randn())),0,10))),names:["Início","1 semana","4 semanas"],name:"Dor (0–10)"};}}],
  sim:[["means","Médias por momento","150 142 138"],["sb","DP entre pessoas",12],["sw","DP dentro da pessoa",6],["n","Participantes",15]],shape:false,
  gen:P=>{const b=Array.from({length:P.n},()=>P.sb*randn());return{g:P.means.map(m=>b.map(v=>m+v+P.sw*randn()))};},
  fromData:d=>{const n=d.g[0].length,sub=d.g[0].map((_,i)=>mean(d.g.map(c=>c[i]))),res=d.g.flatMap((c,j)=>c.map((v,i)=>v-sub[i]-(mean(c)-mean(sub))));return{means:d.g.map(c=>numTxt(rnd(mean(c),1))).join(" "),sb:rnd(sd(sub),2),sw:rnd(Math.sqrt(sum(res.map(r=>r*r))/((n-1)*(d.g.length-1))),2),n};}},
 xy:{label:"duas variáveis numéricas",
  presets:[
   {n:"Atividade física × colesterol",d:()=>withSeed(71,()=>{const x=Array.from({length:40},()=>Math.max(0,Math.round(150+60*randn())));return{x,y:x.map(v=>Math.round(225-0.12*v+22*randn())),nx:"Atividade física (min/semana)",ny:"Colesterol (mg/dL)"};})},
   {n:"Horas de sono × estresse",d:()=>withSeed(72,()=>{const x=Array.from({length:30},()=>rnd(clamp(6.8+1.1*randn(),4,10),1));return{x,y:x.map(v=>Math.round(clamp(70-5*v+7*randn(),0,100))),nx:"Sono (h/noite)",ny:"Estresse (0–100)"};})},
   {n:"Sem relação, com um outlier",d:()=>withSeed(73,()=>{const x=Array.from({length:19},()=>rnd(50+10*randn(),1));const y=x.map(()=>rnd(20+4*randn(),1));x.push(110);y.push(45);return{x,y,nx:"Variável X",ny:"Variável Y"};})},
   {n:"Sem relação",d:()=>withSeed(74,()=>({x:Array.from({length:35},()=>rnd(50+10*randn(),1)),y:Array.from({length:35},()=>rnd(20+4*randn(),1)),nx:"Variável X",ny:"Variável Y"}))},
   {n:"Relação em U (curva)",d:()=>withSeed(75,()=>{const x=Array.from({length:40},()=>rnd(18+50*RNG(),1));return{x,y:x.map(v=>rnd(90+0.08*(v-43)**2+6*randn(),1)),nx:"Idade (anos)",ny:"Glicemia (mg/dL)"};})}],
  sim:[["rho","Correlação verdadeira (ρ)",-0.4],["n","n",40]],shape:false,out:true,
  gen:(P,d)=>{const mx=mean(d.x),sx=sd(d.x)||1,my=mean(d.y),sy=sd(d.y)||1;const x=[],y=[];for(let i=0;i<P.n;i++){const zx=randn(),zy=P.rho*zx+Math.sqrt(1-P.rho**2)*randn();x.push(mx+sx*zx);y.push(my+sy*zy);}if(P.shape==="out"){x[0]=mx+4*sx;y[0]=my+4*sy*(P.rho>=0?-1:1);}return{x,y};},
  fromData:d=>({rho:rnd(pearson(d.x,d.y).r,2),n:d.x.length})},
 xbin:{label:"X numérica e desfecho sim/não",
  presets:[
   {n:"IMC × diabetes",d:()=>withSeed(81,()=>{const x=Array.from({length:120},()=>rnd(27+5*randn(),1));return{x,y:x.map(v=>RNG()<1/(1+Math.exp(-(-7.5+0.22*v)))?1:0),nx:"IMC (kg/m²)",ny:"Diabetes (1 = sim)"};})},
   {n:"Idade × infarto em 10 anos",d:()=>withSeed(82,()=>{const x=Array.from({length:150},()=>Math.round(35+30*RNG()));return{x,y:x.map(v=>RNG()<1/(1+Math.exp(-(-6+0.075*v)))?1:0),nx:"Idade (anos)",ny:"Infarto (1 = sim)"};})}],
  sim:[["or","OR por unidade de X",1.25],["prev","Proporção de eventos",0.3],["n","n",120]],shape:false,
  gen:(P,d)=>{const mx=mean(d.x),sx=sd(d.x)||1,b1=Math.log(P.or),b0=Math.log(P.prev/(1-P.prev))-b1*mx;const x=Array.from({length:P.n},()=>mx+sx*randn());return{x,y:x.map(v=>RNG()<1/(1+Math.exp(-(b0+b1*v)))?1:0)};},
  fromData:d=>{const r=logreg(d.x,d.y);return{or:rnd(r.or,3),prev:rnd(mean(d.y),2),n:d.x.length};}},
 tab:{label:"duas variáveis categóricas",
  presets:[
   {n:"Sedentarismo × glicemia alta",d:()=>({t:[[45,95],[30,130]],rn:["Sedentário","Ativo"],cn:["Glicemia alta","Normal"]})},
   {n:"Tratamento × melhora",d:()=>({t:[[30,20],[18,32]],rn:["Convencional","Alternativo"],cn:["Melhorou","Não melhorou"]})},
   {n:"Tabela pequena",d:()=>({t:[[3,9],[10,4]],rn:["Exposto","Não exposto"],cn:["Doente","Sadio"]})},
   {n:"Tipo de serviço × satisfação (3 × 2)",r3:true,d:()=>({t:[[40,10],[30,20],[22,28]],rn:["UBS","UPA","Hospital"],cn:["Satisfeito","Insatisfeito"]})}],
  sim:"table",shape:false,
  gen:P=>({t:P.ps.map((row,i)=>{const c=row.map(()=>0);for(let k=0;k<P.ns[i];k++){let u=RNG(),j=0;while(j<row.length-1&&u>row[j]){u-=row[j];j++;}c[j]++;}return c;})}),
  fromData:d=>({ps:d.t.map(r=>{const s=sum(r)||1;return r.map(v=>v/s);}),ns:d.t.map(sum)})},
 mcn:{label:"sim/não antes e depois",
  presets:[
   {n:"Sintomas antes e depois do medicamento",d:()=>({t:[[20,15],[4,21]],lab:["Com sintomas","Sem sintomas"]})},
   {n:"Tabagismo antes e depois de campanha",d:()=>({t:[[38,9],[5,148]],lab:["Fuma","Não fuma"]})}],
  sim:[["pb","P(sim → não)",0.25],["pc","P(não → sim)",0.07],["n","Pares",60]],shape:false,
  gen:P=>{let t=[[0,0],[0,0]];for(let i=0;i<P.n;i++){const u=RNG();if(u<P.pb)t[0][1]++;else if(u<P.pb+P.pc)t[1][0]++;else if(RNG()<.5)t[0][0]++;else t[1][1]++;}return{t};},
  fromData:d=>{const n=sum(d.t.flat());return{pb:rnd(d.t[0][1]/n,3),pc:rnd(d.t[1][0]/n,3),n};}},
 prop:{label:"uma proporção",
  presets:[
   {n:"Fumantes: 28 em 120 × 15%",d:()=>({x:28,n:120,p0:.15,name:"fumantes"})},
   {n:"Efeito adverso: 7 em 20 × 20%",d:()=>({x:7,n:20,p0:.2,name:"efeito adverso"})},
   {n:"Cara ou coroa: 60 caras em 100 × 50%",d:()=>({x:60,n:100,p0:.5,name:"caras"})}],
  sim:[["p","Proporção verdadeira",0.23],["n","n",120],["p0","Referência p₀",0.15]],shape:false,
  gen:P=>{let x=0;for(let i=0;i<P.n;i++)x+=rbin(P.p);return{x,n:P.n,p0:P.p0};},
  fromData:d=>({p:rnd(d.x/d.n,3),n:d.n,p0:d.p0})},
 surv:{label:"tempo até o evento",
  presets:[
   {n:"Sobrevida com e sem o medicamento",d:()=>survGen(91,{m1:18,m2:30,n1:30,n2:30,fu:36},["Controle","Medicamento"],"meses")},
   {n:"Sem diferença real",d:()=>survGen(92,{m1:24,m2:24,n1:30,n2:30,fu:36},["Grupo A","Grupo B"],"meses")}],
  sim:[["m1","Mediana de sobrevida, grupo 1",18],["m2","Mediana de sobrevida, grupo 2",30],["n1","n do grupo 1",30],["n2","n do grupo 2",30],["fu","Seguimento máximo",36]],shape:false,
  gen:P=>survDraw(P),
  fromData:d=>{const k=d.g.map(kmCurve);return{m1:k[0].med??d.fu??36,m2:k[1].med??d.fu??36,n1:d.g[0].t.length,n2:d.g[1].t.length,fu:Math.max(...d.g.flatMap(g=>g.t))};}},
};
function survDraw(P){const one=(m,n)=>{const t=[],e=[];for(let i=0;i<n;i++){let x=-Math.log(1-RNG())*m/Math.LN2,c=P.fu*(0.5+0.5*RNG());if(x<=c){t.push(Math.max(.1,x));e.push(1);}else{t.push(c);e.push(0);}}return{t,e};};return{g:[one(P.m1,P.n1),one(P.m2,P.n2)]};}
function survGen(seed,P,names,u){return withSeed(seed,()=>{const d=survDraw(P);d.g.forEach(g=>{g.t=g.t.map(v=>Math.max(1,Math.round(v)));});d.names=names;d.unit=u;d.fu=P.fu;return d;});}
const survTxt=g=>g.t.map((t,i)=>auto(t)+(g.e[i]?"":"+")).join("  ");
function survParse(s){const t=[],e=[];String(s).split(/[\s;]+/).filter(Boolean).forEach(tok=>{const c=/\+$/.test(tok),v=parse(tok.replace("+",""));if(has(v)&&v>=0){t.push(v);e.push(c?0:1);}});return{t,e};}
