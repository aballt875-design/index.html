/* study.js — بومودورو / مؤقت / ساعة إيقاف / عداد الامتحان / يوتيوب عائم */
let TM=null;
function dragWin(win,handle){
 let st=null;
 handle.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,select'))return;try{handle.setPointerCapture(e.pointerId)}catch(_){}const r=win.getBoundingClientRect();st={dx:e.clientX-r.left,dy:e.clientY-r.top};win.classList.add('drg')});
 handle.addEventListener('pointermove',e=>{if(!st)return;win.style.left=Math.max(0,Math.min(innerWidth-60,e.clientX-st.dx))+'px';win.style.top=Math.max(0,Math.min(innerHeight-40,e.clientY-st.dy))+'px';win.style.right='auto';win.style.bottom='auto'});
 const end=()=>{st=null;win.classList.remove('drg')};handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end)}
const tmSave=()=>lsSet('inf-tm',JSON.stringify(TM));
function tmToday(){const d=new Date().toISOString().slice(0,10);if(TM.today.d!==d)TM.today={d,n:0}}
const pmDur=p=>(p==='focus'?TM.cfg.focus:p==='short'?TM.cfg.short:TM.cfg.long)*60000;
const PHN={focus:'تركيز 🍅',short:'راحة قصيرة ☕',long:'راحة طويلة 🌿'};
const pmRem=()=>{const p=TM.pomo;return p.run?Math.max(0,p.end-Date.now()):(p.remain==null?pmDur(p.phase):p.remain)};
const tmRem=()=>{const t=TM.tm;return t.run?Math.max(0,t.end-Date.now()):(t.remain==null?t.total*1000:t.remain)};
const swEl=()=>{const s=TM.sw;return s.run?s.acc+Date.now()-s.start:s.acc};
const tfmt=ms=>{const s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=n=>String(n).padStart(2,'0');return(h?h+':'+p(m):p(m))+':'+p(x)};
function askNotif(){try{if('Notification' in window&&Notification.permission==='default')Notification.requestPermission()}catch(e){}}
function notify(t,b){try{if('Notification' in window&&Notification.permission==='granted'){if(navigator.serviceWorker)navigator.serviceWorker.ready.then(r=>r.showNotification(t,{body:b,icon:'icon-192.png'})).catch(()=>{});else new Notification(t,{body:b})}}catch(e){}}
function alarm(t,b){uiSound('chime');try{navigator.vibrate&&navigator.vibrate([200,100,200,100,400])}catch(e){}notify(t,b);toast(t+' — '+b)}
function pmNext(auto,skip){const p=TM.pomo;
 if(p.phase==='focus'){if(!skip){p.cnt++;TM.today.n++;p.phase=p.cnt%TM.cfg.every===0?'long':'short'}else p.phase='short'}else p.phase='focus';
 p.remain=null;p.run=false;if(auto&&TM.cfg.auto){p.end=Date.now()+pmDur(p.phase);p.run=true}tmSave()}
function tmTick(){
 const p=TM.pomo,t=TM.tm;
 if(p.run&&Date.now()>=p.end){const was=p.phase;tmToday();alarm(was==='focus'?'خلصت جلسة التركيز 🎉':'الراحة خلصت',was==='focus'?'خد راحة تستاهلها':'يلا نرجع نذاكر');pmNext(true)}
 if(t.run&&Date.now()>=t.end){t.run=false;t.remain=null;alarm('⏳ المؤقت خلص','انتهى الوقت');tmSave()}
 tmPaint()}
function tmPaint(){
 const chip=$('chip2'),p=TM.pomo,t=TM.tm,s=TM.sw;let txt='';
 if(p.run)txt='🍅 '+tfmt(pmRem());else if(t.run)txt='⏳ '+tfmt(tmRem());else if(s.run)txt='⏱ '+tfmt(swEl());
 chip.hidden=!txt||!$('tmp').hidden;chip.textContent=txt;
 if($('tmp').hidden||!$('tmt'))return;
 const tab=TM.tab;let ms,pr,lab,run;
 if(tab==='pomo'){ms=pmRem();pr=1-ms/pmDur(p.phase);lab=PHN[p.phase];run=p.run}
 else if(tab==='timer'){ms=tmRem();pr=1-ms/(t.total*1000);lab='مؤقت';run=t.run}
 else{ms=swEl();pr=(ms%60000)/60000;lab='ساعة إيقاف';run=s.run}
 $('tmt').textContent=tfmt(ms);$('tml').textContent=lab;
 $('rg').style.strokeDashoffset=String(326.7*(1-Math.max(0,Math.min(1,pr))));
 $('tm1').textContent=run?'⏸':'▶';
 if(tab==='pomo'&&$('tdn'))$('tdn').textContent='جلسات النهارده: '+TM.today.n+' 🍅';
 if(tab==='sw'&&$('laps'))$('laps').innerHTML=s.laps.map((l,i)=>'<div>لفة '+(i+1)+' — '+tfmt(l)+'</div>').reverse().join('')}
function tmBuild(){
 const b=$('tmp'),tab=TM.tab;tmToday();
 let h='<div class="tabs">'+[['pomo','🍅 بومودورو'],['timer','⏳ مؤقت'],['sw','⏱ ساعة إيقاف']].map(([k,l])=>`<button data-t="${k}" class="${k===tab?'on':''}">${l}</button>`).join('')+'</div>';
 h+='<div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="rb"/><circle id="rg" cx="60" cy="60" r="52" class="rf" stroke-dasharray="326.7" stroke-dashoffset="326.7"/></svg><div class="rc"><div id="tmt">00:00</div><div id="tml"></div></div></div>';
 h+='<div class="tbt"><button id="tm1" class="big">▶</button>'+(tab==='pomo'?'<button id="tm2">⏭ تخطي</button>':tab==='sw'?'<button id="tm2">🚩 لفة</button>':'')+'<button id="tm3">↺ إعادة</button></div>';
 if(tab==='pomo'){
  const c=TM.cfg,n=(k,l)=>`<label>${l}<input type="number" min="1" max="180" data-c="${k}" value="${c[k]}"></label>`;
  h+='<div class="tcfg">'+n('focus','تركيز (د)')+n('short','راحة (د)')+n('long','راحة طويلة')+n('every','كل كام جلسة')+`<label class="chk"><input type="checkbox" data-c="auto" ${c.auto?'checked':''}> تشغيل تلقائي للمرحلة اللي بعدها</label></div><div id="tdn" class="tnote"></div>`;
  const ex=TM.exam?Math.ceil((new Date(TM.exam)-new Date(new Date().toDateString()))/864e5):null;
  h+=`<div class="tcfg"><label>📅 يوم الامتحان<input type="date" id="exd" value="${TM.exam||''}"></label></div><div class="tnote">${ex==null?'':ex>0?'باقي '+ex+' يوم على الامتحان ⏳':ex===0?'الامتحان النهارده، بالتوفيق 🤲':'الامتحان عدّى'}</div>`}
 else if(tab==='timer'){h+='<div class="chips">'+[5,10,15,30,45,60,90].map(m=>`<button data-min="${m}" class="${TM.tm.total===m*60?'on':''}">${m} د</button>`).join('')+'</div><div class="tcfg"><label>دقائق مخصصة<input type="number" id="cmin" min="1" max="600" value="'+Math.round(TM.tm.total/60)+'"></label></div>'}
 else h+='<div id="laps" class="tnote"></div>';
 b.innerHTML=h;
 b.querySelectorAll('input[data-c]').forEach(i=>i.onchange=()=>{const k=i.dataset.c;TM.cfg[k]=i.type==='checkbox'?i.checked:Math.max(1,+i.value||1);if(!TM.pomo.run)TM.pomo.remain=null;tmSave();tmPaint()});
 const ed=$('exd');if(ed)ed.onchange=()=>{TM.exam=ed.value;tmSave();tmBuild()};
 const cm=$('cmin');if(cm)cm.onchange=()=>{TM.tm.total=Math.max(1,+cm.value||1)*60;TM.tm.remain=null;TM.tm.run=false;tmSave();tmBuild()};
 tmPaint()}
function tmClick(e){
 const b=e.target.closest('button');if(!b)return;const tab=TM.tab,id=b.id,now=Date.now();
 if(b.dataset.t){TM.tab=b.dataset.t;tmSave();tmBuild();return}
 if(b.dataset.min){const t=TM.tm;t.total=+b.dataset.min*60;t.remain=null;t.run=false;tmSave();tmBuild();return}
 if(id==='tm1'){
  if(tab==='pomo'){const p=TM.pomo;if(p.run){p.remain=Math.max(0,p.end-now);p.run=false}else{p.end=now+pmRem();p.run=true;askNotif()}}
  else if(tab==='timer'){const t=TM.tm;if(t.run){t.remain=Math.max(0,t.end-now);t.run=false}else{t.end=now+tmRem();t.run=true;askNotif()}}
  else{const s=TM.sw;if(s.run){s.acc+=now-s.start;s.run=false}else{s.start=now;s.run=true}}}
 else if(id==='tm2'){if(tab==='pomo')pmNext(false,true);else if(tab==='sw'&&(TM.sw.run||TM.sw.acc))TM.sw.laps.push(swEl())}
 else if(id==='tm3'){if(tab==='pomo'){TM.pomo.remain=null;TM.pomo.run=false}else if(tab==='timer'){TM.tm.remain=null;TM.tm.run=false}else TM.sw={acc:0,start:null,run:false,laps:[]}}
 else return;
 tmSave();tmPaint()}
/* ---------- يوتيوب عائم ---------- */
function ytParse(u){
 u=(u||'').trim();if(/^[\w-]{11}$/.test(u))return{v:u};
 try{const x=new URL(/^https?:/.test(u)?u:'https://'+u),l=x.searchParams.get('list');
  if(/youtu\.be$/.test(x.hostname))return{v:x.pathname.slice(1).split('/')[0],l};
  let v=x.searchParams.get('v');if(!v){const m=x.pathname.match(/\/(shorts|embed|live)\/([\w-]{11})/);if(m)v=m[2]}
  if(v||l)return{v,l}}catch(e){}
 return null}
function ytLoad(u){
 const f=$('yf'),p=ytParse(u);
 if(!p){f.src='about:blank';return false}
 if(!navigator.onLine){$('yoff').hidden=false;return false}
 $('yoff').hidden=true;let src='https://www.youtube.com/embed/'+(p.v||'videoseries')+'?autoplay=1&rel=0&playsinline=1';if(p.l)src+='&list='+p.l;f.src=src;return true}
function ytPlay(u){
 u=(u||'').trim();
 if(!ytParse(u)){window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(u||'شرح'),'_blank');return}
 $('yw').dataset.url=u;ytLoad(u);
 const i=items.findIndex(s=>s.wd==='yt');if(i>=0){items[i]={...items[i],url:u};commit()}}
function ytOpen(){addWidget('yt')}
function ytInit(){
 const w=document.createElement('div');w.id='yw';w.className='wgt';w.hidden=true;
 w.innerHTML='<div class="wh"><span>▶️ يوتيوب</span></div><div id="yin"><input id="yu" placeholder="الصق رابط يوتيوب (فيديو أو قائمة)…" dir="ltr"><button id="yg">▶</button><button id="yfind" title="بحث في يوتيوب">🔎</button></div><div id="yb"><iframe id="yf" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><div id="yoff" hidden>محتاج إنترنت لتشغيل يوتيوب</div></div>';
 $('wl').appendChild(w);
 $('yg').onclick=()=>ytPlay($('yu').value);
 $('yu').addEventListener('keydown',e=>{if(e.key==='Enter')ytPlay($('yu').value)});
 $('yfind').onclick=()=>window.open('https://www.youtube.com/results?search_query='+encodeURIComponent($('yu').value.trim()||'شرح درس'),'_blank')}
function studyInit(){
 TM={cfg:{focus:25,short:5,long:15,every:4,auto:true},pomo:{phase:'focus',remain:null,end:null,run:false,cnt:0},today:{d:'',n:0},tm:{total:600,remain:null,end:null,run:false},sw:{acc:0,start:null,run:false,laps:[]},exam:'',tab:'pomo'};
 try{const d=JSON.parse(lsGet('inf-tm'));if(d)for(const k in d)TM[k]=(d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k]))?Object.assign(TM[k]||{},d[k]):d[k]}catch(e){}
 tmToday();setInterval(tmTick,250);
 $('chip2').onclick=()=>{addWidget('tmr')};
 $('tmp').addEventListener('click',tmClick);
 ytInit()}
