const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const W=+process.argv[2]||390;
const p=await b.newPage({viewport:{width:W,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|net::/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+process.cwd()+'/test.html');await p.waitForTimeout(400);
const bad=async(sel)=>p.evaluate(sel=>{const s=document.querySelector(sel);const t=s.innerText+s.innerHTML;const m=t.match(/NaN|undefined|Infinity|\[object/g);return{bad:m?m.length:0,ctx:m?t.slice(Math.max(0,t.search(/NaN|undefined|Infinity|\[object/)-80),t.search(/NaN|undefined|Infinity|\[object/)+30):"",sw:document.documentElement.scrollWidth}},sel);
const labs=await p.evaluate(()=>LABS.map(l=>l.id));
for(const l of labs){await p.evaluate(l=>navGo(l),l);await p.waitForTimeout(150);
 for(const id of ['tc1000','i100','aRep','chaSim','mRun1000','l1000','dn25','bGen']){const e=await p.$('#'+id);if(e&&await e.isVisible())await e.click();}
 await p.waitForTimeout(150);console.log(W,l,JSON.stringify(await bad('#lab-'+l)));
 if(process.argv[3])await p.screenshot({path:`s${W}-${l}.png`,fullPage:true});}
await p.evaluate(()=>navGo('testes'));
await p.click('#tMode [data-v="full"]');const tests=await p.evaluate(()=>Object.keys(TESTS).filter(k=>!TESTS[k].hidden));
for(const t of tests){await p.evaluate(t=>selectTest(t),t);await p.waitForTimeout(120);
 const nPre=await p.$$eval('#tPre .chip',c=>c.length);
 for(let i=0;i<nPre;i++){await p.click(`#tPre .chip[data-i="${i}"]`);await p.waitForTimeout(60);const r=await bad('#lab-testes');const err=await p.$eval('#tErr',e=>e.innerText);if(r.bad||err||r.sw>W)console.log('  ',t,'preset',i,JSON.stringify(r),err);}
 if(await p.$eval('#sOne',e=>e.disabled)){console.log('  sim disabled (expected for non-2x2)',t);await p.click('#tPre .chip[data-i="0"]');}await p.click('#sOne');await p.waitForTimeout(80);
 await p.click('#sRun');await p.waitForFunction(()=>!document.getElementById('sRun').disabled,{timeout:60000});await p.waitForTimeout(100);
 const r=await bad('#lab-testes');const pw=await p.$eval('#sRes',e=>e.innerText.split('\n').slice(0,4).join(' | '));console.log(t,JSON.stringify(r),pw.slice(0,160));
 if(process.argv[3])await p.screenshot({path:`s${W}-t-${t}.png`,fullPage:true});}
console.log('errors',errs.slice(0,10));await b.close();})();
