const L=require('./src/lib.js'),D=require('./d.json'),P=require('./py.json');
const d=D.bef.map((v,i)=>v-D.aft[i]);
const J={t1:L.tOne(D.x,120).p,welch:L.tInd(D.x,D.y).p,student:L.tInd(D.x,D.y,true).p,mw_exact:L.mannWhitney(D.x,D.y).p,mw_ties:L.mannWhitney(D.xt,D.yt).p,
tpair:L.tOne(d,0).p,wsr:L.wilcoxonSR(d).p,wsr_ties:L.wilcoxonSR(d.map(v=>Math.round(v/5))).p,anova:L.anova([D.a,D.b,D.c]).p,kw:L.kruskal([D.a,D.b,D.c]).p,fried:L.friedman([D.a,D.b,D.c]).p,
pear:L.pearson(D.xs,D.ys).p,spear:L.spearman(D.xs,D.ys).p,slope:L.linreg(D.xs,D.ys).b1,slope_p:L.linreg(D.xs,D.ys).p,chi:[L.chisq([[45,95],[30,130]]).X,L.chisq([[45,95],[30,130]]).p],chi_y:L.chisq([[45,95],[30,130]],true).X,
fisher:L.fisher22([[3,9],[10,4]]).p,binom:L.binomTest(7,20,.2).p,sw_x:[L.shapiro(D.x).W,L.shapiro(D.x).p],sw_a:[L.shapiro(D.a).W,L.shapiro(D.a).p],sw_small:[L.shapiro([3,5,6,9,20]).W,L.shapiro([3,5,6,9,20]).p],sw_8:[L.shapiro([1,2,2.5,3,7,8,9.5,30]).W,L.shapiro([1,2,2.5,3,7,8,9.5,30]).p],
logit:(r=>[r.b1,r.se1,r.p])(L.logreg(D.xl,D.yl))};
for(const k in J){const a=[].concat(J[k]),b=[].concat(P[k]);const bad=a.some((v,i)=>Math.abs(v-b[i])>1e-6*Math.max(1,Math.abs(b[i]))&&Math.abs(v-b[i])/Math.abs(b[i])>1e-4);console.log(bad?'XX':'ok',k,a.map(v=>+v.toPrecision(6)).join(','),'|',b.map(v=>+v.toPrecision(6)).join(','));}
// welch anova vs manual
const w=L.anova([D.a,D.b,D.c],true);console.log('welchF',w.wF,w.wdf2,w.wp);
