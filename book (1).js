/* book.js — مساحة الدفتر/الكتاب: غلاف فخم + صفحات بتتقلب بصوت ورق */
const PW=800,PH=1130;
let bookOpen=false,flip=null,edgeSw=null;
const COVERS=[{id:'leather',n:'جلد بني'},{id:'navy',n:'كحلي ذهبي'},{id:'burgundy',n:'عنابي'},{id:'emerald',n:'زمردي'},{id:'black',n:'أسود فضي'},{id:'marble',n:'رخام'},{id:'galaxy',n:'مجرّة'},{id:'sunrise',n:'شروق'}];
const PAPERS=['سادة','سطور','مربعات','نقاط','كورنيل'];
const BKF=[['Reem Kufi','ريم كوفي'],['Aref Ruqaa','عارف رقعة'],['Amiri','أميري'],['El Messiri','المسيري'],['Cairo','كايرو'],['Lemonada','ليمونادا'],['Marhey','مرحي'],['Rakkas','رقّاص']];
const CPAL={leather:['#6b4330','#33190f','#e9c77d'],navy:['#1f3d75','#0a1630','#ecc977'],burgundy:['#912238','#3a0a16','#ecc977'],emerald:['#13805f','#04301f','#ecc977'],black:['#2e2e34','#08080a','#dfe3ea'],marble:['#f6f6f4','#c9ccd1','#2a2a2a'],galaxy:['#33207a','#04020d','#fff1bf'],sunrise:['#ff9166','#5b35e8','#fff7e8']};
const isBook=()=>!!(typeof WS!=='undefined'&&WS[ws]&&WS[ws].type==='book');
function bookView(){const k=Math.min((W-20)/PW,(H-20)/PH);return{x:(W-PW*k)/2,y:(H-PH*k)/2,k}}
function clampBook(){
 const fit=Math.min((W-20)/PW,(H-20)/PH);view.k=Math.max(fit*.85,Math.min(fit*8,view.k));
 const pw=PW*view.k,ph=PH*view.k;
 view.x=pw<W?(W-pw)/2:Math.min(40,Math.max(W-pw-40,view.x));
 view.y=ph<H?(H-ph)/2:Math.min(40,Math.max(H-ph-40,view.y))}
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function drawCover(c,w,h,cv){
 const id=cv.s||'leather',t=cv.t||'دفتري',pal=CPAL[id]||CPAL.leather;
 c.save();rrect(c,0,0,w,h,w*.025);c.clip();
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,pal[0]);g.addColorStop(1,pal[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
 if(id==='marble'){c.strokeStyle='rgba(90,95,110,.35)';for(let i=0;i<14;i++){c.lineWidth=1+rn(i+50)*3;c.beginPath();let x=rn(i)*w,y=0;c.moveTo(x,y);for(let k=1;k<=6;k++){x+=(rn(i*9+k)-.5)*w*.35;y=k*h/6;c.quadraticCurveTo(x+(rn(i*7+k)-.5)*80,y-h/12,x,y)}c.stroke()}}
 else if(id==='galaxy'){const rg=c.createRadialGradient(w*.7,h*.3,10,w*.7,h*.3,w*.7);rg.addColorStop(0,'rgba(190,110,255,.55)');rg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=rg;c.fillRect(0,0,w,h);for(let i=0;i<220;i++){c.globalAlpha=.3+rn(i+700)*.7;c.fillStyle='#fff';c.beginPath();c.arc(rn(i)*w,rn(i+300)*h,.6+rn(i+900)*2,0,7);c.fill()}c.globalAlpha=1}
 else if(id==='sunrise'){c.fillStyle='rgba(255,236,170,.9)';c.beginPath();c.arc(w/2,h*.72,w*.22,0,7);c.fill();c.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<4;i++){c.beginPath();c.arc(w/2,h*.72,w*(.28+i*.1),0,7);c.fill()}}
 else{c.globalAlpha=.1;for(let i=0;i<1600;i++){c.fillStyle=rn(i+6000)>.5?'#fff':'#000';c.fillRect(rn(i)*w,rn(i+3000)*h,2,2)}c.globalAlpha=1}
 const foil=c.createLinearGradient(0,0,w,h*.6);
 if(id==='black'){foil.addColorStop(0,'#9aa0aa');foil.addColorStop(.5,'#ffffff');foil.addColorStop(1,'#8d939d')}
 else if(id==='marble'){foil.addColorStop(0,'#1d1d1d');foil.addColorStop(1,'#4a4a4a')}
 else{foil.addColorStop(0,pal[2]);foil.addColorStop(.45,'#fff6d6');foil.addColorStop(1,pal[2])}
 const m=w*.07;c.strokeStyle=foil;c.lineWidth=w*.008;rrect(c,m,m,w-m*2,h-m*2,w*.015);c.stroke();c.lineWidth=w*.003;rrect(c,m*1.35,m*1.35,w-m*2.7,h-m*2.7,w*.01);c.stroke();
 if(id==='leather'||id==='burgundy'){c.setLineDash([w*.012,w*.01]);c.lineWidth=w*.004;rrect(c,m*.6,m*.6,w-m*1.2,h-m*1.2,w*.02);c.stroke();c.setLineDash([])}
 c.fillStyle=foil;[[m,m,1,1],[w-m,m,-1,1],[m,h-m,1,-1],[w-m,h-m,-1,-1]].forEach(([x,y,sx,sy])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+sx*w*.07,y);c.lineTo(x,y+sy*w*.07);c.closePath();c.fill()});
 let fs=w*.12;const fam=cv.f||'Reem Kufi';c.textAlign='center';c.textBaseline='middle';
 for(;fs>w*.05;fs-=2){c.font=fs+'px "'+fam+'",serif';if(c.measureText(t).width<w*.66)break}
 c.fillStyle='rgba(0,0,0,.45)';c.fillText(t,w/2+3,h*.34+3);c.fillStyle=foil;c.fillText(t,w/2,h*.34);
 c.strokeStyle=foil;c.lineWidth=w*.004;c.beginPath();c.moveTo(w*.3,h*.43);c.lineTo(w*.7,h*.43);c.stroke();c.fillStyle=foil;c.beginPath();c.arc(w/2,h*.43,w*.012,0,7);c.fill();
 c.beginPath();c.arc(w/2,h*.78,w*.1,0,7);c.stroke();c.beginPath();for(let k=0;k<10;k++){const r=k%2?w*.03:w*.075,a=k*Math.PI/5-Math.PI/2;c.lineTo(w/2+Math.cos(a)*r,h*.78+Math.sin(a)*r)}c.closePath();c.fill();
 if(id==='black'||id==='leather'){const b=c.createLinearGradient(w*.86,0,w*.9,0);b.addColorStop(0,'rgba(0,0,0,.7)');b.addColorStop(.5,'rgba(60,60,60,.9)');b.addColorStop(1,'rgba(0,0,0,.7)');c.fillStyle=b;c.fillRect(w*.86,0,w*.04,h)}
 const sp=c.createLinearGradient(0,0,w*.08,0);sp.addColorStop(0,'rgba(0,0,0,.6)');sp.addColorStop(.45,'rgba(255,255,255,.12)');sp.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sp;c.fillRect(0,0,w*.08,h);
 const sh=c.createLinearGradient(0,0,w,h);sh.addColorStop(0,'rgba(255,255,255,.14)');sh.addColorStop(.5,'rgba(255,255,255,0)');sh.addColorStop(1,'rgba(0,0,0,.18)');c.fillStyle=sh;c.fillRect(0,0,w,h);
 c.restore()}
function drawPaper(x,t){
 x.save();const g=x.createLinearGradient(0,0,PW,PH);g.addColorStop(0,'#fffdf7');g.addColorStop(1,'#f7f1e1');x.fillStyle=g;x.fillRect(0,0,PW,PH);x.lineWidth=1.2;
 if(t===1){x.strokeStyle='#b9cbe6';for(let y=150;y<PH-60;y+=42){x.beginPath();x.moveTo(0,y);x.lineTo(PW,y);x.stroke()}x.strokeStyle='#e9a5a5';x.beginPath();x.moveTo(110,0);x.lineTo(110,PH);x.stroke()}
 else if(t===2){x.strokeStyle='#cfe0f3';for(let a=40;a<PW;a+=40){x.beginPath();x.moveTo(a,0);x.lineTo(a,PH);x.stroke()}for(let b=40;b<PH;b+=40){x.beginPath();x.moveTo(0,b);x.lineTo(PW,b);x.stroke()}}
 else if(t===3){x.fillStyle='#b5bfd0';for(let a=40;a<PW;a+=40)for(let b=40;b<PH;b+=40){x.beginPath();x.arc(a,b,2.2,0,7);x.fill()}}
 else if(t===4){x.strokeStyle='#b9cbe6';for(let y=190;y<PH-250;y+=42){x.beginPath();x.moveTo(250,y);x.lineTo(PW,y);x.stroke()}
  x.strokeStyle='#e08a8a';x.lineWidth=2;x.beginPath();x.moveTo(0,150);x.lineTo(PW,150);x.moveTo(250,150);x.lineTo(250,PH-250);x.moveTo(0,PH-250);x.lineTo(PW,PH-250);x.stroke();
  x.fillStyle='#b88';x.font='22px Cairo,sans-serif';x.textAlign='center';x.fillText('الموضوع / التاريخ',PW/2,100);x.fillText('كلمات مفتاحية',125,190);x.fillText('الملاحظات',525,190);x.fillText('الملخص',PW/2,PH-205)}
 x.restore()}
function deskBG(x){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a2c20');g.addColorStop(1,'#1d140d');x.fillStyle=g;x.fillRect(0,0,W,H);x.globalAlpha=.05;x.fillStyle='#fff';for(let i=0;i<60;i++)x.fillRect(0,rn(i)*H,W,1+rn(i+9)*2);x.globalAlpha=1}
function renderBook(x,st){
 x.setTransform(dpr,0,0,dpr,0,0);deskBG(x);
 x.setTransform(dpr*view.k,0,0,dpr*view.k,dpr*view.x,dpr*view.y);
 const sb=view.k*dpr;
 if(!st.open){
  for(let i=5;i>=1;i--){x.fillStyle=i%2?'#f2ead8':'#d9cfb8';x.fillRect(i*5,i*4,PW,PH)}
  x.save();x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=40*sb;x.shadowOffsetY=10*sb;x.fillStyle='#000';x.fillRect(0,0,PW,PH);x.restore();
  drawCover(x,PW,PH,WS[ws].cover||{s:'leather',t:'دفتري'});return}
 const g=P[st.pg];
 x.save();x.shadowColor='rgba(0,0,0,.55)';x.shadowBlur=30*sb;x.shadowOffsetY=8*sb;x.fillStyle='#fffdf7';x.fillRect(0,0,PW,PH);x.restore();
 x.save();x.beginPath();x.rect(0,0,PW,PH);x.clip();drawPaper(x,g.bg);
 const old=ctx,ob=bk;ctx=x;bk=sb;for(const s of (st.pg===pg?items:g.items))drawItem(s);ctx=old;bk=ob;
 x.fillStyle='rgba(0,0,0,.35)';x.font='26px Cairo,sans-serif';x.textAlign='center';x.textBaseline='alphabetic';x.fillText(String(st.pg+1),PW/2,PH-34);
 const sp=x.createLinearGradient(0,0,36,0);sp.addColorStop(0,'rgba(0,0,0,.22)');sp.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=sp;x.fillRect(0,0,36,PH);x.restore()}
function snapBook(st){const c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;renderBook(c.getContext('2d'),st);return c}
function bookGo(d){
 if(flip||!d||!isBook())return;let to;
 if(!bookOpen){if(d<0)return;to={open:true,pg}}
 else if(d<0)to=pg===0?{open:false,pg}:{open:true,pg:pg-1};
 else{if(pg>=P.length-1){toast('ده آخر صفحة — زوّد صفحة من 📄 الصفحات');return}to={open:true,pg:pg+1}}
 commitText();flip={A:snapBook({open:bookOpen,pg}),B:snapBook(to),d,t0:performance.now(),to};uiSound('flip');draw()}
function bookClose(){if(flip||!bookOpen)return;commitText();const to={open:false,pg};flip={A:snapBook({open:true,pg}),B:snapBook(to),d:-1,t0:performance.now(),to};uiSound('flip');draw()}
function bookFlipFrame(){
 const f=flip,t=(performance.now()-f.t0)/520;
 if(t>=1){flip=null;finishFlip(f.to);return false}
 const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,x0=view.x*dpr,sw=PW*view.k*dpr;
 const base=f.d>0?f.B:f.A,top=f.d>0?f.A:f.B,s=Math.max(.001,f.d>0?1-e:e);
 ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(base,0,0);
 ctx.save();ctx.translate(x0,0);ctx.scale(s,1);ctx.drawImage(top,-x0,0);ctx.restore();
 ctx.save();ctx.globalAlpha=.35*Math.sin(Math.PI*e);ctx.fillStyle='#000';ctx.fillRect(x0+sw*s,view.y*dpr,Math.min(30*dpr,sw*(1-s)),PH*view.k*dpr);ctx.restore();
 draw(1);return true}
function finishFlip(to){if(to.open&&to.pg!==pg){stash();loadPage(to.pg)}bookOpen=to.open;dirty=true;bookUI();draw()}
function bookUI(){const b=isBook();$('bnav').hidden=!b;if(b)$('bpi').textContent=bookOpen?(pg+1)+' / '+P.length:'الغلاف 📕'}
function buildBookPP(){
 const b=$('pp');b.innerHTML='';
 const row=(...xs)=>{const r=document.createElement('div');r.className='pgs';xs.forEach(x=>r.appendChild(x));b.appendChild(r)},lab=t=>{const h=document.createElement('div');h.className='ph';h.textContent=t;b.appendChild(h)};
 const renum=()=>P.forEach((g,i)=>g.name='صفحة '+(i+1));
 const add=mb('➕ صفحة بعد دي',()=>{if(!bookOpen){toast('افتح الدفتر الأول');return}stash();P.splice(pg+1,0,mkPage(0,P[pg].bg));renum();loadPage(pg+1);saveSoon();buildBookPP()});
 const dl=mb('🗑 حذف الصفحة',()=>{if(!bookOpen)return;if(P.length<2){toast('لازم تفضل صفحة');return}if(!dl._c){dl._c=1;dl.textContent='متأكد؟';return}P.splice(pg,1);renum();loadPage(Math.min(pg,P.length-1));saveSoon();buildBookPP()});
 row(add,dl);
 lab('الذهاب لصفحة');const gi=document.createElement('input');gi.type='number';gi.min=1;gi.max=P.length;gi.value=pg+1;gi.className='bkin';
 const gb=mb('اذهب',()=>{const n=Math.max(1,Math.min(P.length,+gi.value||1))-1;if(n===pg&&bookOpen)return;if(bookOpen){stash();loadPage(n);bookOpen=true;uiSound('flip');dirty=true;draw();bookUI()}pop(null)});
 const gr=document.createElement('div');gr.className='eqr2';gr.append(gi,gb);b.appendChild(gr);
 lab('نوع الورق');row(...PAPERS.map((n,i)=>mb(n,()=>{if(!bookOpen)return;P[pg].bg=i;dirty=true;draw();saveSoon();buildBookPP()},bookOpen&&P[pg].bg===i?'on':'')));
 row(mb('🧾 نفس الورق لكل الصفحات',()=>{if(!bookOpen)return;const t=P[pg].bg;P.forEach(g=>g.bg=t);dirty=true;draw();saveSoon();toast('اتطبّق ✓')}),mb('📕 اقفل الدفتر',()=>{pop(null);bookClose()}),mb('🎨 الغلاف',()=>{buildBK(ws);pop('bk')}))}
function buildBK(ed){
 const b=$('bk');b.innerHTML='';const c0=ed>=0?WS[ed].cover:{s:'leather',t:'دفتري',f:'Reem Kufi'},st={s:c0.s,t:c0.t,f:c0.f,paper:1,n:20};
 const lab=t=>{const h=document.createElement('div');h.className='ph';h.textContent=t;b.appendChild(h)};
 lab(ed>=0?'🎨 تعديل غلاف الدفتر':'📓 دفتر جديد — صفحات بتتقلب وغلاف زي الكتاب');
 const ti_=document.createElement('input');ti_.className='bkin';ti_.value=st.t;ti_.placeholder='اسم الدفتر';b.appendChild(ti_);
 const fs_=document.createElement('select');fs_.className='bkin';BKF.forEach(([f,a])=>{const o=document.createElement('option');o.value=f;o.textContent='خط الغلاف: '+a;if(f===st.f)o.selected=true;fs_.appendChild(o)});b.appendChild(fs_);
 lab('اختار الغلاف');const gr=document.createElement('div');gr.className='bgs';const cans=[];
 COVERS.forEach(cv_=>{const e=document.createElement('button'),c=document.createElement('canvas');c.width=180;c.height=254;c.style.cssText='width:90px;height:127px';const sp=document.createElement('span');sp.textContent=cv_.n;e.append(c,sp);e.onclick=()=>{st.s=cv_.id;paint()};gr.appendChild(e);cans.push([cv_.id,c,e])});b.appendChild(gr);
 function paint(){cans.forEach(([id,c,e])=>{const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,180,254);x.scale(180/PW,254/PH);drawCover(x,PW,PH,{s:id,t:st.t,f:st.f});e.classList.toggle('on',id===st.s)})}
 ti_.oninput=()=>{st.t=ti_.value||'دفتري';paint()};
 fs_.onchange=()=>{st.f=fs_.value;loadF(st.f);paint();setTimeout(paint,700)};
 loadF(st.f);paint();setTimeout(paint,700);
 if(ed<0){
  lab('نوع الورق');const pr=document.createElement('div');pr.className='pgs';PAPERS.forEach((n,i)=>{const e=mb(n,()=>{st.paper=i;[...pr.children].forEach((x,j)=>x.classList.toggle('on',j===i))},i===st.paper?'on':'');pr.appendChild(e)});b.appendChild(pr);
  lab('عدد الصفحات');const nr=document.createElement('div');nr.className='pgs';[10,20,40,80,120].forEach(n=>{const e=mb(String(n),()=>{st.n=n;[...nr.children].forEach(x=>x.classList.toggle('on',x===e))},n===st.n?'on':'');nr.appendChild(e)});b.appendChild(nr)}
 const go=mb(ed>=0?'💾 حفظ الغلاف':'✅ إنشاء الدفتر',()=>{
  if(ed>=0){WS[ed].cover={s:st.s,t:st.t,f:st.f};WS[ed].name=st.t;$('wsb').textContent='🗂 '+WS[ws].name;dirty=true;saveSoon();draw();pop(null)}
  else{saveNow();const pages=[];for(let i=0;i<st.n;i++)pages.push(mkPage(i+1,st.paper));WS.push({name:st.t,pg:0,type:'book',cover:{s:st.s,t:st.t,f:st.f},P:pages});switchWS(WS.length-1);pop(null);toast('📓 دوس على الغلاف عشان تفتح الدفتر')}},'on');
 go.style.cssText='width:100%;margin-top:10px;padding:10px';b.appendChild(go)}
function bookInit(){
 $('bpv').onclick=()=>bookGo(-1);$('bnx').onclick=()=>bookGo(1);$('bcv').onclick=()=>bookClose()}
