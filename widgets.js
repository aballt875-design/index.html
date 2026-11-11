/* widgets.js — أدوات حيّة جوه المساحة نفسها (حاسبة + يوتيوب) + شريط تنسيق النص + مهام المربعات */
const WG={els:new Map()};
const WGINFO={calc:{t:'🧮 الحاسبة العلمية',w:350,h:590},yt:{t:'▶️ يوتيوب',w:400,h:330}};
let _fk='',numL=false;
function calcOpen(){wgAdd('calc')}
function ytOpen(){wgAdd('yt')}
function ytInit(){}
function wgAdd(kind){
 if(isBook()){toast('الأدوات دي بتشتغل في المساحات اللانهائية (مش الدفتر)');return}
 if(kind==='calc'&&items.some(s=>s.md==='wg'&&s.kind==='calc')){toast('الحاسبة موجودة في الصفحة دي بالفعل');return}
 commitText();const I=WGINFO[kind],c=toW(W/2,H/2),w=Math.min(I.w,(W-24)/view.k),h=I.h*w/I.w;
 items.push({md:'wg',kind,id:'w'+Date.now().toString(36)+Math.random().toString(36).slice(2,4),x:c[0]-w/2,y:c[1]-h/2,w,h,u:''});
 commit();draw();toast(kind==='calc'?'الحاسبة جوه المساحة: تتحرك وتكبر مع اللوحة':'اتحرك بالشريط العلوي، وكبّر من الركن')}
function drawWgPh(s){ctx.fillStyle='rgba(120,90,50,.12)';rr(s.x,s.y,s.w,s.h,14);ctx.fill();ctx.fillStyle='#8a5a2e';ctx.font='bold '+Math.min(28,s.w*.07)+'px Cairo,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText((WGINFO[s.kind]||{t:''}).t,s.x+s.w/2,s.y+s.h/2)}
function wgSync(){
 const L=$('wl');if(!L)return;
 if(isBook()){L.hidden=true;return}L.hidden=false;
 const live=new Set(),k=view.k;
 for(const s of items){if(s.md!=='wg')continue;live.add(s.id);let el=WG.els.get(s.id);
  if(!el){el=wgMake(s);WG.els.set(s.id,el);L.appendChild(el)}
  el.style.width=s.w+'px';el.style.height=s.h+'px';el.style.transform='translate('+(s.x*k+view.x)+'px,'+(s.y*k+view.y)+'px) scale('+k+')';
  if(s.kind==='calc'){const c=$('calc');if(c&&el.contains(c))c.style.transform='scale('+(s.w/350)+')'}}
 for(const[id,el]of WG.els)if(!live.has(id)){el.remove();WG.els.delete(id)}}
function wgMake(s){
 const el=document.createElement('div');el.className='wg wg-'+s.kind;
 el.innerHTML='<div class="wgh"><span class="wgt">'+WGINFO[s.kind].t+'</span><button class="wgx" title="إغلاق">✕</button></div><div class="wgb"></div><div class="wgr"></div>';
 const body=el.querySelector('.wgb');if(s.kind==='calc')calcMount(body);else ytMount(body,s);
 el.querySelector('.wgx').onclick=()=>{const i=items.findIndex(x=>x.id===s.id);if(i>=0){items.splice(i,1);commit();draw()}};
 const bind=(handle,fn)=>{let st=null;
  handle.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;try{handle.setPointerCapture(e.pointerId)}catch(_){}const i=items.findIndex(x=>x.id===s.id);if(i<0)return;items[i]={...items[i]};st={x:e.clientX,y:e.clientY,i:s.id};e.stopPropagation()});
  handle.addEventListener('pointermove',e=>{if(!st)return;const dx=(e.clientX-st.x)/view.k,dy=(e.clientY-st.y)/view.k;st.x=e.clientX;st.y=e.clientY;const it=items.find(x=>x.id===s.id);if(it){fn(it,dx,dy);st.m=1;draw()}});
  const end=()=>{if(st&&st.m)commit();st=null};handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end)};
 bind(el.querySelector('.wgh'),(it,dx,dy)=>{it.x+=dx;it.y+=dy});
 bind(el.querySelector('.wgr'),(it,dx)=>{it.w=Math.max(230,it.w+dx);it.h=it.kind==='calc'?it.w*WGINFO.calc.h/WGINFO.calc.w:Math.max(170,it.h+dx*.56)});
 return el}
function ytMount(body,s){
 body.innerHTML='<div class="yin"><input placeholder="الصق رابط يوتيوب هنا…" dir="ltr"><button class="yg">▶</button><button class="yfd" title="بحث في يوتيوب">🔎</button></div><div class="yfr"><iframe allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="yoff">محتاج إنترنت لتشغيل يوتيوب</div></div>';
 const inp=body.querySelector('input'),fr=body.querySelector('iframe'),off=body.querySelector('.yoff');
 const play=u=>{const p=ytParse(u);
  if(!p){window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(u||'شرح'),'_blank');return}
  if(!navigator.onLine){off.hidden=false;toast('محتاج إنترنت لتشغيل يوتيوب');return}
  off.hidden=true;let src='https://www.youtube.com/embed/'+(p.v||'videoseries')+'?autoplay=1&rel=0&playsinline=1';if(p.l)src+='&list='+p.l;fr.src=src;
  const i=items.findIndex(x=>x.id===s.id);if(i>=0&&items[i].u!==u){items[i]={...items[i],u};commit()}};
 inp.value=s.u||'';off.hidden=navigator.onLine;
 body.querySelector('.yg').onclick=()=>play(inp.value);
 inp.addEventListener('keydown',e=>{if(e.key==='Enter')play(inp.value)});
 body.querySelector('.yfd').onclick=()=>window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(inp.value.trim()||'شرح درس'),'_blank');
 if(s.u&&navigator.onLine)play(s.u)}
/* ---------- مهام المربعات (بدون ورقة) ---------- */
function drawCk(s){
 const bs=s.f*1.15,done=!!s.done;ctx.lineWidth=Math.max(1.5,s.f*.09);ctx.strokeStyle=s.c;rr(s.x,s.y+2,bs,bs,bs*.22);
 if(done){ctx.fillStyle='#b9824a';ctx.fill();ctx.strokeStyle='#b9824a';ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(2,s.f*.12);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(s.x+bs*.24,s.y+2+bs*.52);ctx.lineTo(s.x+bs*.43,s.y+2+bs*.72);ctx.lineTo(s.x+bs*.78,s.y+2+bs*.28);ctx.stroke()}
 else{ctx.fillStyle='rgba(255,255,255,.55)';ctx.fill();ctx.stroke()}
 ctx.font=nf(s);ctx.textBaseline='top';ctx.textAlign='left';ctx.direction='ltr';ctx.fillStyle=s.c;ctx.globalAlpha=done?.55:1;
 const tx=s.x+bs+10,w=ctx.measureText(s.t||'').width;ctx.fillText(s.t||'',tx,s.y+(bs-s.f*1.2)/2+2);if(done)ctx.fillRect(tx,s.y+bs/2+2,w,Math.max(1.5,s.f*.07))}
function hitCheck(p){
 for(let i=items.length-1;i>=0;i--){const s=items[i];
  if(s.ck){const b=bbx(s);if(p[0]>=b[0]-6&&p[0]<=b[2]+6&&p[1]>=b[1]-6&&p[1]<=b[3]+6)return{i}}
  else if(s.tk){const L=layout(s);for(const r of L.rows)if(p[1]>=s.y+r.y-4&&p[1]<=s.y+r.y+r.ls.length*L.lh&&p[0]>=s.x+s.w-46&&p[0]<=s.x+s.w)return{i,row:r.i}}}
 return null}
function ckToggle(h){
 const s=items[h.i];if(!s)return;
 if(s.ck)items[h.i]={...s,done:!s.done};else{const dd=new Set(s.d||[]);if(dd.has(h.row))dd.delete(h.row);else dd.add(h.row);items[h.i]={...s,d:[...dd]}}
 commit();draw();uiSound('pop')}
/* ---------- نص منسّق ---------- */
function drawText(s){
 ctx.fillStyle=s.c;ctx.font=nf(s);ctx.textBaseline='top';ctx.textAlign='left';ctx.direction='ltr';
 const ls=s.t.split('\n'),ws=ls.map(l=>ctx.measureText(l).width),bw=s.bw||Math.max(0,...ws),lh=s.f*(s.lh||1.2),al=s.al||(/[\u0600-\u06FF]/.test(s.t)?'right':'left');
 ls.forEach((l,i)=>{let x=s.x;if(al==='right')x=s.x+bw-ws[i];else if(al==='center')x=s.x+(bw-ws[i])/2;const y=s.y+i*lh;ctx.fillText(l,x,y);
  if(s.u)ctx.fillRect(x,y+s.f*1.05,ws[i],Math.max(1,s.f*.06));if(s.s)ctx.fillRect(x,y+s.f*.55,ws[i],Math.max(1,s.f*.06))})}
function fmtKey(o,k){if(k==='b')o.b=!o.b;else if(k==='i')o.i=!o.i;else if(k==='u')o.u=!o.u;else if(k==='s')o.s=!o.s;else if(k==='alr')o.al='right';else if(k==='alc')o.al='center';else if(k==='all')o.al='left'}
function fmtApply(k){
 if(tp){const f=tp.fmt=tp.fmt||{};fmtKey(f,k);if(k==='sz+'||k==='sz-'){tp.f*=k==='sz+'?1.12:1/1.12;ti.style.fontSize=tp.f*view.k+'px'}
  ti.style.fontWeight=f.b?'700':'400';ti.style.fontStyle=f.i?'italic':'normal';ti.style.textDecoration=[f.u?'underline':'',f.s?'line-through':''].join(' ').trim()||'none';ti.style.textAlign=f.al||'';fit();return}
 if(sel==null||!items[sel])return;const it={...items[sel]};fmtKey(it,k);if(k==='sz+')it.f*=1.12;if(k==='sz-')it.f/=1.12;items[sel]=it;draw();clearTimeout(rcT);rcT=setTimeout(commit,400)}
function fmtUI(){
 const bar=$('fmt');if(!bar)return;let o=null;
 if(tp)o=tp.fmt||{};else if(sel!=null&&items[sel]){const s=items[sel];if(s.ck||s.n||(typeof s.t==='string'&&!s.p&&!s.md))o=s}
 const key=o?[o.b,o.i,o.u,o.s,o.al,tp?1:0,bul,numL].join('|'):'';
 if(key===_fk)return;_fk=key;bar.hidden=!o;if(!o)return;
 bar.querySelectorAll('button[data-f]').forEach(b=>{const f=b.dataset.f;b.classList.toggle('on',f==='b'?!!o.b:f==='i'?!!o.i:f==='u'?!!o.u:f==='s'?!!o.s:f==='alr'?o.al==='right':f==='alc'?o.al==='center':f==='all'?o.al==='left':f==='bl'?!!bul:f==='nm'?numL:false)})}
function fmtInit(){
 const bar=$('fmt');bar.addEventListener('mousedown',e=>e.preventDefault());
 bar.onclick=e=>{const b=e.target.closest('button[data-f]');if(!b)return;const f=b.dataset.f;
  if(f==='bl'){bul=!bul;if(bul)numL=false;if(tp&&tp.kind==='t'&&!ti.value.trim())ti.value=bul?'• ':''}
  else if(f==='nm'){numL=!numL;if(numL)bul=false;if(tp&&tp.kind==='t'&&!ti.value.trim())ti.value=numL?'1. ':''}
  else fmtApply(f);
  _fk='';fmtUI()}}
