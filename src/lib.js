/* ===================== biblioteca estatística ===================== */
const sum=a=>{let s=0;for(const x of a)s+=x;return s;}, mean=a=>sum(a)/a.length;
const sorted=a=>Float64Array.from(a).sort();
function median(a){const s=sorted(a),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;}
function variance(a,pop){const m=mean(a);let s=0;for(const x of a)s+=(x-m)**2;return s/(a.length-(pop?0:1));}
const sd=a=>Math.sqrt(variance(a));
function modes(a){const c=new Map();a.forEach(x=>c.set(x,(c.get(x)||0)+1));const mx=Math.max(...c.values());if(mx<2)return[];return[...c].filter(([,v])=>v===mx).map(([k])=>k).sort((x,y)=>x-y);}
/* quartis: "exc" = mediana das metades sem a mediana (n ímpar); "inc" = incluindo; "t7" = interpolação (Excel QUARTIL, R, jamovi) */
function quantile7(s,p){const h=(s.length-1)*p,lo=Math.floor(h);return s[lo]+(h-lo)*((s[Math.min(lo+1,s.length-1)])-s[lo]);}
function quartiles(a,method="exc"){const s=Array.from(sorted(a)),n=s.length,h=Math.floor(n/2);
  if(method==="t7")return{q1:quantile7(s,.25),q2:quantile7(s,.5),q3:quantile7(s,.75)};
  let lo,hi;if(n%2&&method==="inc"){lo=s.slice(0,h+1);hi=s.slice(h);}else{lo=s.slice(0,h);hi=s.slice(n%2?h+1:h);}
  return{q1:median(lo.length?lo:s),q2:median(s),q3:median(hi.length?hi:s),lo,hi};}
function skew(a){const n=a.length,m=mean(a);let m2=0,m3=0;for(const x of a){m2+=(x-m)**2;m3+=(x-m)**3;}m2/=n;m3/=n;return m2&&n>2?Math.sqrt(n*(n-1))/(n-2)*m3/m2**1.5:0;}
function kurt(a){const n=a.length,m=mean(a);let m2=0,m4=0;for(const x of a){m2+=(x-m)**2;m4+=(x-m)**4;}m2/=n;m4/=n;if(!m2||n<4)return 0;const g2=m4/m2**2-3;return((n+1)*g2+6)*(n-1)/((n-2)*(n-3));}
/* postos com empates (média) */
function ranks(a){const idx=a.map((v,i)=>[v,i]).sort((x,y)=>x[0]-y[0]),r=new Array(a.length),ties=[];
  for(let i=0;i<idx.length;){let j=i;while(j+1<idx.length&&idx[j+1][0]===idx[i][0])j++;const rk=(i+j)/2+1;for(let k=i;k<=j;k++)r[idx[k][1]]=rk;if(j>i)ties.push(j-i+1);i=j+1;}
  r.ties=ties;return r;}
/* distribuições */
function erfc(x){const z=Math.abs(x),t=1/(1+0.5*z);const r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277)))))))));return x>=0?r:2-r;}
const Phi=z=>0.5*erfc(-z/Math.SQRT2), npdf=(x,m=0,s=1)=>Math.exp(-(((x-m)/s)**2)/2)/(s*Math.sqrt(2*Math.PI));
function zq(p){if(p<=0)return-Infinity;if(p>=1)return Infinity;
  const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.3577518672690,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],c=[-7.784894002430293e-3,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[7.784695709041462e-3,0.3224671290700398,2.445134137142996,3.754408661907416];
  const pl=0.02425;let q,r,x;
  if(p<pl){q=Math.sqrt(-2*Math.log(p));x=(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
  else if(p<=1-pl){q=p-.5;r=q*q;x=(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);}
  else{q=Math.sqrt(-2*Math.log(1-p));x=-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
  const e=Phi(x)-p,u=e*Math.sqrt(2*Math.PI)*Math.exp(x*x/2);return x-u/(1+x*u/2);}
function lgamma(x){const c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];if(x<0.5)return Math.log(Math.PI/Math.sin(Math.PI*x))-lgamma(1-x);x-=1;let s=c[0];for(let i=1;i<9;i++)s+=c[i]/(x+i);const t=x+7.5;return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(s);}
function betacf(a,b,x){let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<1e-300)d=1e-300;d=1/d;let h=d;for(let m=1;m<=300;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;h*=d*c;aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-14)break;}return h;}
function ibeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(lgamma(a+b)-lgamma(a)-lgamma(b)+a*Math.log(x)+b*Math.log(1-x));return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b;}
/* P(T>|t|) etc. com cauda calculada diretamente para precisão */
function tcdf(t,df){if(!isFinite(t))return t>0?1:0;const x=df/(df+t*t),p=0.5*ibeta(x,df/2,0.5);return t>0?1-p:p;}
const tTwo=(t,df)=>Math.min(1,ibeta(df/(df+t*t),df/2,0.5));
const tpdf=(t,df)=>Math.exp(lgamma((df+1)/2)-lgamma(df/2)-0.5*Math.log(df*Math.PI)-(df+1)/2*Math.log(1+t*t/df));
function tq(p,df){if(df>1e6)return zq(p);let lo=-1e3,hi=1e3;for(let i=0;i<200;i++){const m=(lo+hi)/2;tcdf(m,df)<p?lo=m:hi=m;if(hi-lo<1e-12)break;}return(lo+hi)/2;}
const fSurv=(F,d1,d2)=>F<=0?1:ibeta(d2/(d2+d1*F),d2/2,d1/2);
const fpdf=(x,d1,d2)=>x<=0?0:Math.exp(0.5*(d1*Math.log(d1*x)+d2*Math.log(d2)-(d1+d2)*Math.log(d1*x+d2))-Math.log(x)-(lgamma(d1/2)+lgamma(d2/2)-lgamma((d1+d2)/2)));
function gammaP(a,x){if(x<=0)return 0;if(x<a+1){let s=1/a,t=s;for(let n=1;n<500;n++){t*=x/(a+n);s+=t;if(t<s*1e-15)break;}return s*Math.exp(-x+a*Math.log(x)-lgamma(a));}
  let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-15)break;}return 1-Math.exp(-x+a*Math.log(x)-lgamma(a))*h;}
function gammaQ(a,x){if(x<=0)return 1;if(x<a+1)return 1-gammaP(a,x);let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-15)break;}return Math.exp(-x+a*Math.log(x)-lgamma(a))*h;}
const chiSurv=(x,df)=>gammaQ(df/2,x/2);
const chipdf=(x,k)=>x<=0?0:Math.exp((k/2-1)*Math.log(x)-x/2-(k/2)*Math.log(2)-lgamma(k/2));
const lchoose=(n,k)=>lgamma(n+1)-lgamma(k+1)-lgamma(n-k+1);
const dbinom=(k,n,p)=>p===0?(k===0?1:0):p===1?(k===n?1:0):Math.exp(lchoose(n,k)+k*Math.log(p)+(n-k)*Math.log(1-p));
/* RNG com semente (exemplos reprodutíveis) */
let RNG=Math.random;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function withSeed(seed,fn){const old=RNG;RNG=mulberry(seed);try{return fn();}finally{RNG=old;}}
function randn(){let u=0,v=0;while(!u)u=RNG();while(!v)v=RNG();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
const SKZ=(()=>{const s=0.8,m=Math.exp(s*s/2),v=(Math.exp(s*s)-1)*Math.exp(s*s);return()=>(Math.exp(s*randn())-m)/Math.sqrt(v);})();
/* gera valor com média m, DP s e forma */
function draw(m,s,shape){if(shape==="skew")return m+s*SKZ();if(shape==="out")return m+s*(RNG()<0.06?4*randn():randn())/1.52;if(shape==="unif")return m+s*(RNG()-0.5)*Math.sqrt(12);return m+s*randn();}
const rbin=p=>RNG()<p?1:0;

/* ===================== testes ===================== */
function descr(a){const n=a.length,m=mean(a),s=n>1?sd(a):NaN;return{n,m,s,md:median(a),se:s/Math.sqrt(n)};}
function tOne(x,mu0=0,conf=.95){const d=descr(x),df=d.n-1,t=(d.m-mu0)/d.se,p=tTwo(t,df),q=tq(1-(1-conf)/2,df);return{...d,df,t,p,lo:d.m-q*d.se,hi:d.m+q*d.se,dz:(d.m-mu0)/d.s,diff:d.m-mu0,q};}
function tInd(x,y,equal=false,conf=.95){const a=descr(x),b=descr(y),diff=a.m-b.m;let se,df;
  const sp=Math.sqrt(((a.n-1)*a.s**2+(b.n-1)*b.s**2)/(a.n+b.n-2));
  if(equal){se=sp*Math.sqrt(1/a.n+1/b.n);df=a.n+b.n-2;}else{const va=a.s**2/a.n,vb=b.s**2/b.n;se=Math.sqrt(va+vb);df=(va+vb)**2/(va*va/(a.n-1)+vb*vb/(b.n-1));}
  const t=diff/se,p=tTwo(t,df),q=tq(1-(1-conf)/2,df),d=diff/sp,dse=Math.sqrt((a.n+b.n)/(a.n*b.n)+d*d/(2*(a.n+b.n)));
  return{a,b,diff,se,df,t,p,lo:diff-q*se,hi:diff+q*se,d,dlo:d-1.96*dse,dhi:d+1.96*dse,sp};}
/* Mann-Whitney: exato (sem empates, n<50) como no R; senão normal com correção de continuidade */
const MWC=new Map();
function mwDist(m,n){const k=m+","+n;if(MWC.has(k))return MWC.get(k);
  // coeficientes do binomial gaussiano [m+n, m]_q via recorrência f(m,n)=f(m-1,n) deslocado + f(m,n-1)
  let prev=[];for(let j=0;j<=n;j++)prev.push([1]);// m=0
  for(let i=1;i<=m;i++){const cur=[[1]];for(let j=1;j<=n;j++){const A=prev[j],B=cur[j-1],L=i*j+1,r=new Float64Array(L);for(let u=0;u<B.length;u++)r[u]+=B[u];for(let u=0;u<A.length;u++)if(u+j<L)r[u+j]+=A[u];cur.push(r);}prev=cur;}
  const f=prev[n],tot=sum(f),cdf=new Float64Array(f.length);let c=0;for(let u=0;u<f.length;u++){c+=f[u]/tot;cdf[u]=c;}const out={pmf:Array.from(f,v=>v/tot),cdf};MWC.set(k,out);return out;}
function mannWhitney(x,y){const n1=x.length,n2=y.length,r=ranks([...x,...y]);let R1=0;for(let i=0;i<n1;i++)R1+=r[i];const U=R1-n1*(n1+1)/2,exact=!r.ties.length&&n1<50&&n2<50;let p,z=null;
  if(exact){const D=mwDist(n1,n2),u=Math.round(U),lo=D.cdf[u],hi=1-(u>0?D.cdf[u-1]:0);p=Math.min(1,2*Math.min(lo,hi));}
  else{const N=n1+n2,tc=sum(r.ties.map(t=>t**3-t)),sig=Math.sqrt(n1*n2/12*((N+1)-tc/(N*(N-1)))),dz=U-n1*n2/2;z=(dz-Math.sign(dz)*0.5)/sig;p=Math.min(1,2*(1-Phi(Math.abs(z))));}
  return{U,W:R1,p,exact,z,rrb:1-2*(n1*n2-U)/(n1*n2),mdA:median(x),mdB:median(y),n1,n2};}
/* Wilcoxon postos sinalizados (1 amostra ou pareado) */
const SRC=new Map();
function srDist(n){if(SRC.has(n))return SRC.get(n);const M=n*(n+1)/2,f=new Float64Array(M+1);f[0]=1;for(let k=1;k<=n;k++)for(let s=M;s>=k;s--)f[s]+=f[s-k];const tot=2**n,cdf=new Float64Array(M+1);let c=0;for(let s=0;s<=M;s++){c+=f[s]/tot;cdf[s]=c;}const o={pmf:Array.from(f,v=>v/tot),cdf};SRC.set(n,o);return o;}
function wilcoxonSR(d0,mu0=0){const d=d0.map(v=>v-mu0).filter(v=>v!==0),n=d.length,zeros=d0.length-n;if(n<1)return{n,p:1,V:0,zeros};const r=ranks(d.map(Math.abs));let V=0;for(let i=0;i<n;i++)if(d[i]>0)V+=r[i];
  const exact=!r.ties.length&&!zeros&&n<50;let p,z=null;
  if(exact){const D=srDist(n),v=Math.round(V);p=Math.min(1,2*Math.min(D.cdf[v],1-(v>0?D.cdf[v-1]:0)));}
  else{const tc=sum(r.ties.map(t=>t**3-t)),sig=Math.sqrt(n*(n+1)*(2*n+1)/24-tc/48),dz=V-n*(n+1)/4;z=(dz-Math.sign(dz)*0.5)/sig;p=Math.min(1,2*(1-Phi(Math.abs(z))));}
  const T=n*(n+1)/2;return{V,n,zeros,p,exact,z,rrb:(V-(T-V))/T,md:median(d0)};}
/* ANOVA de uma via (clássica e de Welch) */
function anova(groups,welch=false){const k=groups.length,D=groups.map(descr),N=sum(D.map(g=>g.n)),gm=sum(groups.map(sum))/N;
  const ssb=sum(D.map(g=>g.n*(g.m-gm)**2)),ssw=sum(groups.map((g,i)=>sum(g.map(v=>(v-D[i].m)**2)))),df1=k-1,df2=N-k,F=(ssb/df1)/(ssw/df2);
  const res={k,D,N,ssb,ssw,df1,df2,F,p:fSurv(F,df1,df2),eta2:ssb/(ssb+ssw)};
  if(welch){const w=D.map(g=>g.n/g.s**2),W=sum(w),mw=sum(D.map((g,i)=>w[i]*g.m))/W,A=sum(D.map((g,i)=>w[i]*(g.m-mw)**2))/(k-1),tmp=sum(D.map((g,i)=>(1-w[i]/W)**2/(g.n-1))),B=1+2*(k-2)/(k*k-1)*tmp;
    res.wF=A/B;res.wdf2=(k*k-1)/(3*tmp);res.wp=fSurv(res.wF,k-1,res.wdf2);}
  return res;}
function kruskal(groups){const all=groups.flat(),N=all.length,r=ranks(all);let o=0,H=0;const R=groups.map(g=>{let s=0;for(let i=0;i<g.length;i++)s+=r[o+i];o+=g.length;return s;});
  H=12/(N*(N+1))*sum(R.map((s,i)=>s*s/groups[i].length))-3*(N+1);const C=1-sum(r.ties.map(t=>t**3-t))/(N**3-N);H/=C;const k=groups.length;
  return{H,df:k-1,p:chiSurv(H,k-1),eps2:H/(N-1),meanRank:R.map((s,i)=>s/groups[i].length),mds:groups.map(median)};}
/* medidas repetidas: cols[j][i] = sujeito i na condição j */
function rmAnova(cols){const k=cols.length,n=cols[0].length,all=cols.flat(),gm=mean(all);const cm=cols.map(mean),sm=[];for(let i=0;i<n;i++)sm.push(mean(cols.map(c=>c[i])));
  const ssc=n*sum(cm.map(m=>(m-gm)**2)),sss=k*sum(sm.map(m=>(m-gm)**2)),sst=sum(all.map(v=>(v-gm)**2)),sse=sst-ssc-sss,df1=k-1,df2=(k-1)*(n-1),F=(ssc/df1)/(sse/df2);
  return{F,df1,df2,p:fSurv(F,df1,df2),eta2p:ssc/(ssc+sse),cm,n,k};}
function friedman(cols){const k=cols.length,n=cols[0].length,R=new Array(k).fill(0);let tt=0;
  for(let i=0;i<n;i++){const r=ranks(cols.map(c=>c[i]));r.forEach((v,j)=>R[j]+=v);tt+=sum(r.ties.map(t=>t**3-t));}
  const Q=12*sum(R.map(s=>(s-n*(k+1)/2)**2))/(n*k*(k+1)-tt/(k-1));return{Q,df:k-1,p:chiSurv(Q,k-1),W:Q/(n*(k-1)),meanRank:R.map(s=>s/n)};}
function pearson(x,y){const n=x.length,mx=mean(x),my=mean(y);let sxy=0,sxx=0,syy=0;for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;syy+=(y[i]-my)**2;}
  const r=sxy/Math.sqrt(sxx*syy),df=n-2,t=r*Math.sqrt(df/(1-r*r)),p=Math.abs(r)>=1?0:tTwo(t,df),z=Math.atanh(r),h=1.96/Math.sqrt(n-3);
  return{r,n,df,t,p,lo:Math.tanh(z-h),hi:Math.tanh(z+h),sxy,sxx,syy,mx,my};}
function spearman(x,y){const res=pearson(ranks(x),ranks(y));return{rho:res.r,n:res.n,df:res.df,t:res.t,p:res.p};}
function linreg(x,y,conf=.95){const P=pearson(x,y),n=x.length,b1=P.sxy/P.sxx,b0=P.my-b1*P.mx,sse=P.syy-b1*P.sxy,s=Math.sqrt(sse/(n-2)),se1=s/Math.sqrt(P.sxx),se0=s*Math.sqrt(1/n+P.mx**2/P.sxx),q=tq(1-(1-conf)/2,n-2),t=b1/se1;
  return{b0,b1,se0,se1,t,df:n-2,p:tTwo(t,n-2),lo:b1-q*se1,hi:b1+q*se1,r2:P.r*P.r,s,res:x.map((v,i)=>y[i]-(b0+b1*v)),fit:x.map(v=>b0+b1*v),q,mx:P.mx,sxx:P.sxx,n};}
function logreg(x,y){let b0=0,b1=0,ok=true,it=0;const n=x.length;
  for(;it<60;it++){let g0=0,g1=0,h00=0,h01=0,h11=0;for(let i=0;i<n;i++){const p=1/(1+Math.exp(-(b0+b1*x[i]))),w=p*(1-p);g0+=y[i]-p;g1+=(y[i]-p)*x[i];h00+=w;h01+=w*x[i];h11+=w*x[i]*x[i];}
    const det=h00*h11-h01*h01;if(!(Math.abs(det)>1e-12)){ok=false;break;}const d0=(h11*g0-h01*g1)/det,d1=(-h01*g0+h00*g1)/det;b0+=d0;b1+=d1;if(Math.abs(d0)+Math.abs(d1)<1e-10)break;}
  let h00=0,h01=0,h11=0,ll=0,ll0=0;const pb=mean(y);for(let i=0;i<n;i++){const p=1/(1+Math.exp(-(b0+b1*x[i]))),w=p*(1-p);h00+=w;h01+=w*x[i];h11+=w*x[i]*x[i];ll+=y[i]?Math.log(Math.max(p,1e-300)):Math.log(Math.max(1-p,1e-300));ll0+=y[i]?Math.log(pb):Math.log(1-pb);}
  const det=h00*h11-h01*h01,se1=Math.sqrt(h00/det),se0=Math.sqrt(h11/det),z=b1/se1;if(!isFinite(se1)||Math.abs(b1)>30)ok=false;
  const lr=2*(ll-ll0);return{b0,b1,se0,se1,z,p:2*(1-Phi(Math.abs(z))),or:Math.exp(b1),lo:Math.exp(b1-1.96*se1),hi:Math.exp(b1+1.96*se1),ok,lr,lrp:chiSurv(lr,1),r2:1-ll/ll0,n};}
/* tabela R×C */
function chisq(tab,yates=false){const R=tab.length,C=tab[0].length,rs=tab.map(sum),cs=tab[0].map((_,j)=>sum(tab.map(r=>r[j]))),N=sum(rs);let X=0,minE=Infinity,lowE=0;const E=tab.map((r,i)=>r.map((o,j)=>{const e=rs[i]*cs[j]/N;minE=Math.min(minE,e);if(e<5)lowE++;return e;}));
  const yc=yates&&R===2&&C===2;for(let i=0;i<R;i++)for(let j=0;j<C;j++){const d=Math.abs(tab[i][j]-E[i][j]);X+=(yc?Math.max(0,d-0.5):d)**2/E[i][j];}
  const df=(R-1)*(C-1);return{X,df,p:chiSurv(X,df),E,rs,cs,N,minE,lowE,cellsN:R*C,V:Math.sqrt(X/(N*(Math.min(R,C)-1)))};}
function fisher22(t){const [[a,b],[c,d]]=t,r1=a+b,c1=a+c,N=a+b+c+d,lo=Math.max(0,r1+c1-N),hi=Math.min(r1,c1);const lp=k=>lchoose(c1,k)+lchoose(N-c1,r1-k)-lchoose(N,r1);
  const po=Math.exp(lp(a));let p=0;const pmf=[];for(let k=lo;k<=hi;k++){const q=Math.exp(lp(k));pmf.push([k,q]);if(q<=po*(1+1e-7))p+=q;}return{p:Math.min(1,p),pmf,a};}
function effects22(t){let [[a,b],[c,d]]=t;const hald=[a,b,c,d].some(v=>v===0);if(hald){a+=.5;b+=.5;c+=.5;d+=.5;}
  const p1=a/(a+b),p2=c/(c+d),rr=p1/p2,serr=Math.sqrt(1/a-1/(a+b)+1/c-1/(c+d)),or=a*d/(b*c),seor=Math.sqrt(1/a+1/b+1/c+1/d),rd=p1-p2,serd=Math.sqrt(p1*(1-p1)/(a+b)+p2*(1-p2)/(c+d));
  return{p1,p2,rr,rrlo:rr*Math.exp(-1.96*serr),rrhi:rr*Math.exp(1.96*serr),or,orlo:or*Math.exp(-1.96*seor),orhi:or*Math.exp(1.96*seor),rd,rdlo:rd-1.96*serd,rdhi:rd+1.96*serd,hald};}
function mcnemar(b,c,corr=false){const n=b+c;if(!n)return{X:0,p:1,pe:1,n};const X=(Math.max(0,Math.abs(b-c)-(corr?1:0)))**2/n;let pe=0;const k=Math.min(b,c);for(let i=0;i<=k;i++)pe+=dbinom(i,n,.5);return{X,p:chiSurv(X,1),pe:Math.min(1,2*pe),n};}
function binomTest(x,n,p0){const po=dbinom(x,n,p0);let p=0;const pmf=[];for(let k=0;k<=n;k++){const q=dbinom(k,n,p0);pmf.push(q);if(q<=po*(1+1e-7))p+=q;}
  const ph=x/n,z=1.96,den=1+z*z/n,c=(ph+z*z/(2*n))/den,h=z*Math.sqrt(ph*(1-ph)/n+z*z/(4*n*n))/den;return{p:Math.min(1,p),ph,lo:c-h,hi:c+h,pmf};}
/* sobrevivência: grupos = [{t:[..],e:[..]}] */
function kmCurve(g){const idx=g.t.map((t,i)=>[t,g.e[i]]).sort((a,b)=>a[0]-b[0]||b[1]-a[1]);let nr=idx.length,S=1;const pts=[[0,1]],cens=[];let med=null;
  for(let i=0;i<idx.length;){const t=idx[i][0];let d=0,c=0;while(i<idx.length&&idx[i][0]===t){idx[i][1]?d++:c++;i++;}if(d){S*=1-d/nr;pts.push([t,S]);if(med==null&&S<=0.5+1e-12)med=t;}if(c)cens.push([t,S]);nr-=d+c;}
  return{pts,cens,med,last:idx.length?idx[idx.length-1][0]:0,n:g.t.length,ev:sum(g.e)};}
function logrank(g1,g2){const all=[];g1.t.forEach((t,i)=>all.push([t,g1.e[i],0]));g2.t.forEach((t,i)=>all.push([t,g2.e[i],1]));all.sort((a,b)=>a[0]-b[0]);
  const times=[...new Set(all.filter(r=>r[1]).map(r=>r[0]))];let O1=0,E1=0,V=0;const risk=[];
  for(const t of times){const n1=all.filter(r=>r[2]===0&&r[0]>=t).length,n2=all.filter(r=>r[2]===1&&r[0]>=t).length,d1=all.filter(r=>r[2]===0&&r[0]===t&&r[1]).length,d2=all.filter(r=>r[2]===1&&r[0]===t&&r[1]).length,n=n1+n2,d=d1+d2;
    O1+=d1;E1+=d*n1/n;if(n>1)V+=d*(n1/n)*(1-n1/n)*(n-d)/(n-1);risk.push([n1,n2,d1,d2]);}
  const X=V>0?(O1-E1)**2/V:0;const O2=sum(g2.e),E2=sum(g1.e)+O2-E1;
  // Cox com covariável binária (grupo 2 vs 1), Breslow
  let b=0;for(let it=0;it<50;it++){let U=0,I=0;for(const [n1,n2,d1,d2] of risk){const d=d1+d2,e=Math.exp(b),den=n1+n2*e;U+=d2-d*n2*e/den;I+=d*n2*e*n1/(den*den);}if(!(I>0))break;const st=U/I;b+=st;if(Math.abs(st)<1e-10||Math.abs(b)>20)break;}
  let I=0;for(const [n1,n2,d1,d2] of risk){const d=d1+d2,e=Math.exp(b),den=n1+n2*e;I+=d*n2*e*n1/(den*den);}const se=1/Math.sqrt(I);
  return{X,p:chiSurv(X,1),O1,E1,O2,E2,hr:Math.exp(b),hrlo:Math.exp(b-1.96*se),hrhi:Math.exp(b+1.96*se),coxp:2*(1-Phi(Math.abs(b/se))),ok:isFinite(se)&&Math.abs(b)<15};}
/* Shapiro-Wilk (algoritmo de Royston, 1995, como no R) */
function shapiro(x0){const x=Array.from(sorted(x0)),n=x.length;if(n<3||n>5000)return null;const range=x[n-1]-x[0];if(range<1e-12*Math.max(1,Math.abs(x[0])))return null;
  const poly=(c,v)=>{let r=0;for(let i=c.length-1;i>=0;i--)r=r*v+c[i];return r;};
  const g=[-2.273,0.459],c1=[0,0.221157,-0.147981,-2.07119,4.434685,-2.706056],c2=[0,0.042981,-0.293762,-1.752461,5.682633,-3.582633],c3=[0.544,-0.39978,0.025054,-6.714e-4],c4=[1.3822,-0.77857,0.062767,-0.0020322],c5=[-1.5861,-0.31082,-0.083751,0.0038915],c6=[-0.4803,-0.082676,0.0030302];
  const nn2=Math.floor(n/2),a=new Array(nn2+1).fill(0);
  if(n===3)a[1]=Math.SQRT1_2;else{const an25=n+0.25,m=[0];let summ2=0;for(let i=1;i<=nn2;i++){m[i]=zq((i-0.375)/an25);summ2+=m[i]*m[i];}summ2*=2;const ss=Math.sqrt(summ2),rsn=1/Math.sqrt(n),a1=poly(c1,rsn)-m[1]/ss;let i1,fac;
    if(n>5){i1=3;const a2=-m[2]/ss+poly(c2,rsn);fac=Math.sqrt((summ2-2*m[1]**2-2*m[2]**2)/(1-2*a1*a1-2*a2*a2));a[2]=a2;}else{i1=2;fac=Math.sqrt((summ2-2*m[1]**2)/(1-2*a1*a1));}
    a[1]=a1;for(let i=i1;i<=nn2;i++)a[i]=-m[i]/fac;}
  const xm=mean(x);let num=0,ssq=0;for(let i=0;i<n;i++){ssq+=(x[i]-xm)**2;}for(let i=1;i<=nn2;i++)num+=a[i]*(x[n-i]-x[i-1]);let W=num*num/ssq;if(W>1)W=1;
  let p;if(n===3){p=Math.max(0,1.90985931710274*(Math.asin(Math.sqrt(W))-1.04719755119660));return{W,p:Math.min(1,p),n};}
  const w1=Math.log(1-W),xx=Math.log(n);let m,s,y=w1;
  if(n<=11){const gm=poly(g,n);if(y>=gm)return{W,p:1e-99,n};y=-Math.log(gm-y);m=poly(c3,n);s=Math.exp(poly(c4,n));}else{m=poly(c5,xx);s=Math.exp(poly(c6,xx));}
  p=1-Phi((y-m)/s);return{W,p,n};}
function holm(ps){const k=ps.length,o=ps.map((p,i)=>[p,i]).sort((a,b)=>a[0]-b[0]),adj=new Array(k);let mx=0;o.forEach(([p,i],j)=>{mx=Math.max(mx,Math.min(1,(k-j)*p));adj[i]=mx;});return adj;}
if(typeof module!=="undefined")module.exports={mean,median,sd,variance,quartiles,skew,kurt,ranks,Phi,zq,tcdf,tq,tTwo,fSurv,chiSurv,tOne,tInd,mannWhitney,wilcoxonSR,anova,kruskal,rmAnova,friedman,pearson,spearman,linreg,logreg,chisq,fisher22,effects22,mcnemar,binomTest,kmCurve,logrank,shapiro,holm,withSeed,draw,randn};
