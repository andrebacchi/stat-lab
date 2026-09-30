import numpy as np, json, scipy.stats as st
rng=np.random.default_rng(3)
x=np.round(rng.normal(128,15,23),1); y=np.round(rng.normal(120,12,19),1)
xt=np.round(rng.normal(10,3,15)); yt=np.round(rng.normal(12,3,17))  # with ties
a=list(np.round(rng.normal(5,2,12),2)); b=list(np.round(rng.normal(6,2,12),2)); c=list(np.round(rng.normal(7,2,12),2))
bef=np.round(rng.normal(200,30,14),1); aft=np.round(bef-rng.normal(8,10,14),1)
xs=np.round(rng.normal(50,10,30),1); ys=np.round(0.5*xs+rng.normal(0,5,30),1)
xl=np.round(rng.normal(27,4,60),1); yl=(rng.random(60)<1/(1+np.exp(-(-8+0.3*xl)))).astype(int)
data=dict(x=x.tolist(),y=y.tolist(),xt=xt.tolist(),yt=yt.tolist(),a=a,b=b,c=c,bef=bef.tolist(),aft=aft.tolist(),xs=xs.tolist(),ys=ys.tolist(),xl=xl.tolist(),yl=yl.tolist())
json.dump(data,open('d.json','w'))
R={}
R['t1']=st.ttest_1samp(x,120).pvalue
R['welch']=st.ttest_ind(x,y,equal_var=False).pvalue; R['student']=st.ttest_ind(x,y).pvalue
R['mw_exact']=st.mannwhitneyu(x,y,method='exact').pvalue
R['mw_ties']=st.mannwhitneyu(xt,yt,method='asymptotic',use_continuity=True).pvalue
d=bef-aft
R['tpair']=st.ttest_rel(bef,aft).pvalue
R['wsr']=st.wilcoxon(bef,aft,method='exact').pvalue
R['wsr_ties']=st.wilcoxon(np.round(d/5),method='approx',correction=True).pvalue
R['anova']=st.f_oneway(a,b,c).pvalue; R['kw']=st.kruskal(a,b,c).pvalue; R['fried']=st.friedmanchisquare(a,b,c).pvalue
R['pear']=st.pearsonr(xs,ys).pvalue; R['spear']=st.spearmanr(xs,ys).pvalue
lr=st.linregress(xs,ys); R['slope']=lr.slope; R['slope_p']=lr.pvalue
R['chi']=st.chi2_contingency([[45,95],[30,130]],correction=False)[:2]
R['chi_y']=st.chi2_contingency([[45,95],[30,130]],correction=True)[0]
R['fisher']=st.fisher_exact([[3,9],[10,4]]).pvalue
R['binom']=st.binomtest(7,20,0.2).pvalue
R['sw_x']=list(st.shapiro(x)); R['sw_a']=list(st.shapiro(a)); R['sw_small']=list(st.shapiro([3,5,6,9,20])); R['sw_8']=list(st.shapiro([1,2,2.5,3,7,8,9.5,30]))
R['sw_big']=list(st.shapiro(np.exp(rng.normal(0,1,200)).round(3)))  # not same data in js! skip
import statsmodels.api as sm
m=sm.Logit(yl,sm.add_constant(xl)).fit(disp=0); R['logit']=[m.params[1],m.bse[1],m.pvalues[1]]
print(json.dumps(R,default=float))
