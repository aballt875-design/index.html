/* calc.js — آلة حاسبة علمية على طراز كاسيو fx-991 */
const CA={ans:0,vars:{A:0,B:0,C:0,D:0,E:0,F:0,X:0,Y:0,M:0},ang:'deg',fmt:'norm',dig:4,exp:'',pos:0,hist:[],hi:-1,shift:false,alpha:false,hyp:false,sto:false,res:'',val:null,frac:false,justEq:false,mode:'comp'};
const cErr=m=>{throw m};
const c2r=x=>CA.ang==='deg'?x*Math.PI/180:CA.ang==='rad'?x:x*Math.PI/200;
const r2c=x=>CA.ang==='deg'?x*180/Math.PI:CA.ang==='rad'?x:x*200/Math.PI;
const cClean=v=>{if(!isFinite(v))cErr('M');if(Math.abs(v)<1e-13)return 0;return parseFloat(v.toPrecision(12))};
const cInt=n=>n===Math.floor(n);
function cFact(n){if(n<0||!cInt(n)||n>170)cErr('M');let r=1;for(let i=2;i<=n;i++)r*=i;return r}
function cPerm(n,r){if(n<0||r<0||r>n||!cInt(n)||!cInt(r))cErr('M');let v=1;for(let i=0;i<r;i++)v*=n-i;return v}
function cComb(n,r){if(n<0||r<0||r>n||!cInt(n)||!cInt(r))cErr('M');r=Math.min(r,n-r);let v=1;for(let i=1;i<=r;i++)v=v*(n-r+i)/i;return Math.round(v)}
const cGcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a};
function cF1(n,x){
 switch(n){
  case'sin':return Math.sin(c2r(x));case'cos':return Math.cos(c2r(x));
  case'tan':if(CA.ang==='deg'&&Math.abs(((x%180)+180)%180-90)<1e-9)cErr('M');return Math.tan(c2r(x));
  case'asin':if(Math.abs(x)>1)cErr('M');return r2c(Math.asin(x));
  case'acos':if(Math.abs(x)>1)cErr('M');return r2c(Math.acos(x));
  case'atan':return r2c(Math.atan(x));
  case'sinh':return Math.sinh(x);case'cosh':return Math.cosh(x);case'tanh':return Math.tanh(x);
  case'asinh':return Math.asinh(x);case'acosh':if(x<1)cErr('M');return Math.acosh(x);case'atanh':if(Math.abs(x)>=1)cErr('M');return Math.atanh(x);
  case'log':if(x<=0)cErr('M');return Math.log10(x);case'ln':if(x<=0)cErr('M');return Math.log(x);
  case'exp':return Math.exp(x);case'Abs':return Math.abs(x);
  case'√':if(x<0)cErr('M');return Math.sqrt(x);case'∛':return Math.cbrt(x);
  case'Int':return Math.floor(x);case'Frac':return x-Math.trunc(x);
  case'Rnd':return parseFloat(cFmt(x).replace('×10^','e'));
 }cErr('S')}
const CFN=['asinh','acosh','atanh','sinh','cosh','tanh','asin','acos','atan','sin','cos','tan','log','ln','exp','Abs','RanInt','Ran#','Rnd','GCD','LCM','Pol','Rec','Int','Frac'];
function cTok(s){
 const T=[];let i=0;s=s.replace(/ᴇ/g,'×10^');
 while(i<s.length){const c=s[i];
  if(/\s/.test(c)){i++;continue}
  if(/[0-9.]/.test(c)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const t=s.slice(i,j);if((t.match(/\./g)||[]).length>1||t==='.')cErr('S');T.push({n:parseFloat(t)});i=j;continue}
  const f=CFN.find(n=>s.startsWith(n,i));if(f){T.push({f});i+=f.length;continue}
  if(s.startsWith('nPr',i)||s.startsWith('nCr',i)){T.push({o:s.slice(i,i+3)});i+=3;continue}
  if(s.startsWith('Ans',i)){T.push({v:'Ans'});i+=3;continue}
  if(s.startsWith('⁻¹',i)){T.push({o:'⁻¹'});i+=2;continue}
  if('+−-×÷*/^ʳ!%²³°(),'.includes(c)){T.push({o:c});i++;continue}
  if(c==='√'||c==='∛'){T.push({f:c});i++;continue}
  if(c==='π'){T.push({v:'π'});i++;continue}
  if('eABCDEFXYM'.includes(c)){T.push({v:c});i++;continue}
  cErr('S')}
 return T}
function cEval(str){
 const T=cTok(str);let p=0;const pk=()=>T[p],nx=()=>T[p++],isO=(t,o)=>t&&t.o===o;
 const isMinus=t=>isO(t,'−')||isO(t,'-'),startsPrim=t=>t&&(t.n!==undefined||t.v||t.f||isO(t,'('));
 const val=n=>n==='π'?Math.PI:n==='e'?Math.E:n==='Ans'?CA.ans:CA.vars[n];
 const deg2cur=v=>CA.ang==='deg'?v:CA.ang==='rad'?v*Math.PI/180:v*10/9;
 function expr(){let v=term();while(pk()&&(isO(pk(),'+')||isMinus(pk()))){const o=nx(),r=term();v=isO(o,'+')?v+r:v-r}return v}
 function term(){let v=imp();while(pk()&&['×','÷','*','/'].includes(pk().o)){const o=nx().o,r=imp();if(o==='×'||o==='*')v*=r;else{if(r===0)cErr('M');v/=r}}return v}
 function imp(){let v=unary();while(startsPrim(pk()))v*=unary();return v}
 function unary(){const t=pk();if(isMinus(t)){nx();return -unary()}if(isO(t,'+')){nx();return unary()}return perm()}
 function perm(){let v=power();while(pk()&&(isO(pk(),'nPr')||isO(pk(),'nCr'))){const o=nx().o,r=power();v=o==='nPr'?cPerm(v,r):cComb(v,r)}return v}
 function unaryP(){const t=pk();if(isMinus(t)){nx();return -unaryP()}if(isO(t,'+')){nx();return unaryP()}return power()}
 function power(){const v=post(),t=pk();if(isO(t,'^')){nx();const e=unaryP();if(v<0&&!cInt(e))cErr('M');if(v===0&&e<0)cErr('M');return Math.pow(v,e)}if(isO(t,'ʳ')){nx();const r=unaryP();if(v===0)cErr('M');return Math.pow(r,1/v)}return v}
 function post(){let v=prim();for(;;){const t=pk();if(!t||!t.o)break;
  if(t.o==='!'){nx();v=cFact(v)}else if(t.o==='%'){nx();v/=100}else if(t.o==='²'){nx();v*=v}else if(t.o==='³'){nx();v=v*v*v}
  else if(t.o==='⁻¹'){nx();if(v===0)cErr('M');v=1/v}else if(t.o==='°'){nx();v=deg2cur(v)}else break}return v}
 function args(){if(!isO(pk(),'('))cErr('S');nx();const a=[];if(isO(pk(),')')){nx();return a}for(;;){a.push(expr());if(isO(pk(),','))nx();else break}if(isO(pk(),')'))nx();return a}
 function prim(){const t=nx();if(!t)cErr('S');if(t.n!==undefined)return t.n;if(t.v)return val(t.v);
  if(isO(t,'(')){const v=expr();if(isO(pk(),')'))nx();return v}
  if(t.f){const n=t.f;
   if(n==='Ran#')return parseFloat(Math.random().toFixed(3));
   if(['GCD','LCM','RanInt','Pol','Rec'].includes(n)){const a=args();if(a.length<2)cErr('S');
    if(n==='GCD')return cGcd(a[0],a[1]);if(n==='LCM')return Math.abs(a[0]*a[1])/(cGcd(a[0],a[1])||1);
    if(n==='RanInt'){const lo=Math.ceil(Math.min(a[0],a[1])),hi=Math.floor(Math.max(a[0],a[1]));return lo+Math.floor(Math.random()*(hi-lo+1))}
    if(n==='Pol'){const r=Math.hypot(a[0],a[1]),th=r2c(Math.atan2(a[1],a[0]));CA.vars.X=cClean(r);CA.vars.Y=cClean(th);return r}
    const x=a[0]*Math.cos(c2r(a[1])),y=a[0]*Math.sin(c2r(a[1]));CA.vars.X=cClean(x);CA.vars.Y=cClean(y);return x}
   const x=isO(pk(),'(')?args()[0]:post();if(x===undefined)cErr('S');return cF1(n,x)}
  cErr('S')}
 const v=expr();if(p<T.length)cErr('S');return cClean(v)}
/* تنسيق النتيجة */
function cSci(v,d){const[m,x]=v.toExponential(d).split('e');const mm=CA.fmt==='sci'?m:m.replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'');return mm+'×10^'+(+x)}
function cFmt(v){
 if(v===0)return'0';const a=Math.abs(v);
 if(CA.fmt==='fix')return v.toFixed(CA.dig);
 if(CA.fmt==='sci')return cSci(v,CA.dig);
 if(a>=1e10||a<1e-2)return cSci(v,9);
 return parseFloat(v.toPrecision(10)).toString()}
function cFrac(v){
 if(cInt(v))return String(v);const neg=v<0,a=Math.abs(v);let n0=0,d0=1,n1=1,d1=0,x=a;
 for(let i=0;i<24;i++){const f=Math.floor(x),n2=f*n1+n0,d2=f*d1+d0;n0=n1;d0=d1;n1=n2;d1=d2;if(d1>99999||Math.abs(a-n1/d1)<1e-11*Math.max(1,a))break;x=1/(x-f);if(!isFinite(x))break}
 if(d1>99999||Math.abs(a-n1/d1)>1e-8*Math.max(1,a))return null;
 const w=Math.floor(n1/d1),r=n1-w*d1,s=w?(r?w+' '+r+'/'+d1:String(w)):(r+'/'+d1);return(neg?'−':'')+s}
function cShow(){if(CA.val==null)return CA.res;if(CA.frac){const f=cFrac(CA.val);if(f)return f}return cFmt(CA.val)}
/* حلول المعادلات */
function cCubic(a,b,c,d){b/=a;c/=a;d/=a;const p=c-b*b/3,q=2*b*b*b/27-b*c/3+d,D=q*q/4+p*p*p/27,sh=b/3;
 if(D>1e-14){const sq=Math.sqrt(D),u=Math.cbrt(-q/2+sq),v=Math.cbrt(-q/2-sq),re=-(u+v)/2-sh,im=(u-v)*Math.sqrt(3)/2;return[[u+v-sh,0],[re,im],[re,-im]]}
 if(Math.abs(D)<=1e-14){const u=Math.cbrt(-q/2);return[[2*u-sh,0],[-u-sh,0],[-u-sh,0]]}
 const r=Math.sqrt(-p*p*p/27),ph=Math.acos(Math.max(-1,Math.min(1,-q/2/r))),m=2*Math.cbrt(r);return[0,1,2].map(k=>[m*Math.cos((ph+2*Math.PI*k)/3)-sh,0])}
function cGauss(A,B){const n=A.length,M=A.map((r,i)=>[...r,B[i]]);
 for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(M[r][i])>Math.abs(M[p][i]))p=r;if(Math.abs(M[p][i])<1e-12)return null;const t=M[i];M[i]=M[p];M[p]=t;
  for(let r=0;r<n;r++){if(r===i)continue;const f=M[r][i]/M[i][i];for(let c=i;c<=n;c++)M[r][c]-=f*M[i][c]}}
 return M.map((r,i)=>r[n]/r[i])}
const cFmtC=(re,im)=>{const f=x=>cFmt(cClean(x));return Math.abs(im)<1e-12?f(re):f(re)+(im<0?' − ':' + ')+f(Math.abs(im))+'i'};
const cEsc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
/* لوحة المفاتيح: [العنوان، الإدخال، عنوان shift، إدخال shift، حرف alpha، class] */
const CK=[
 [['SHIFT','#shift','','','','ks'],['ALPHA','#alpha','','','','ka'],['◀','#left'],['▶','#right'],['▲','#up'],['▼','#down']],
 [['x⁻¹','⁻¹','x!','!','B'],['nCr','nCr','nPr','nPr'],['Pol(','Pol(','Rec(','Rec('],['x³','³','∛','∛('],['Abs','Abs(','Ran#','Ran#']],
 [['x²','²','√','√('],['xʸ','^','ʸ√','ʳ'],['log','log(','10ˣ','10^('],['ln','ln(','eˣ','e^('],['(−)','−','Ans','Ans','A']],
 [['hyp','#hyp','','','C'],['sin','sin(','sin⁻¹','asin(','D'],['cos','cos(','cos⁻¹','acos(','E'],['tan','tan(','tan⁻¹','atan(','F'],['RCL','#rcl','STO','#sto']],
 [['(','('],[')',')','','','X'],['S⇔D','#sd','','','Y'],['M+','#mp','M−','#mm','M'],['π','π','e','e']],
 [['7','7','','','','kd'],['8','8','','','','kd'],['9','9','','','','kd'],['DEL','#del','','','','kc2'],['AC','#ac','','','','kc']],
 [['4','4','','','','kd'],['5','5','','','','kd'],['6','6','','','','kd'],['×','×','','','','kd'],['÷','÷','','','','kd']],
 [['1','1','','','','kd'],['2','2','','','','kd'],['3','3','','','','kd'],['+','+','','','','kd'],['−','−','','','','kd']],
 [['0','0','Ran#','Ran#','','kd'],['.','.','','','','kd'],['×10ˣ','ᴇ','','','','kd'],['Ans','Ans','','','','kd'],['=','#eq','','','','ke']]];
function cIns(s){
 if(CA.justEq){CA.justEq=false;if(/^(\+|−|×|÷|\^|ʳ|²|³|!|%|⁻¹|nPr|nCr|ᴇ)/.test(s)){CA.exp='Ans';CA.pos=3}else{CA.exp='';CA.pos=0}}
 CA.exp=CA.exp.slice(0,CA.pos)+s+CA.exp.slice(CA.pos);CA.pos+=s.length}
function cDel(){if(CA.pos<=0)return;const b=CA.exp.slice(0,CA.pos),m=b.match(/(asinh|acosh|atanh|sinh|cosh|tanh|asin|acos|atan|sin|cos|tan|log|ln|exp|Abs|RanInt|Ran#|Rnd|GCD|LCM|Pol|Rec|Int|Frac|Ans|nPr|nCr|⁻¹)\(?$/),n=m?m[0].length:1;CA.exp=b.slice(0,-n)+CA.exp.slice(CA.pos);CA.pos-=n;CA.justEq=false}
function cEq(){
 if(!CA.exp.trim())return;
 try{const v=cEval(CA.exp);CA.val=v;CA.ans=v;CA.res=cShow();CA.hist.unshift(CA.exp);if(CA.hist.length>40)CA.hist.pop();CA.hi=-1;CA.justEq=true}
 catch(e){CA.val=null;CA.res=e==='M'?'Math ERROR':'Syntax ERROR';CA.justEq=false}}
function cAct(a,wasSto){
 if(a[0]==='α'){const L=a.slice(1);if(wasSto){CA.vars[L]=CA.ans;CA.res=L+' ← '+cFmt(CA.ans);CA.val=null;return}cIns(L);return}
 switch(a){
  case'#left':CA.pos=Math.max(0,CA.pos-1);break;case'#right':CA.pos=Math.min(CA.exp.length,CA.pos+1);break;
  case'#del':cDel();break;case'#ac':CA.exp='';CA.pos=0;CA.res='';CA.val=null;CA.justEq=false;break;
  case'#eq':cEq();break;case'#hyp':CA.hyp=!CA.hyp;break;
  case'#sd':CA.frac=!CA.frac;if(CA.val!=null)CA.res=cShow();break;
  case'#up':if(CA.hist.length){CA.hi=Math.min(CA.hi+1,CA.hist.length-1);CA.exp=CA.hist[CA.hi];CA.pos=CA.exp.length;CA.justEq=false}break;
  case'#down':if(CA.hi>0){CA.hi--;CA.exp=CA.hist[CA.hi]}else{CA.hi=-1;CA.exp=''}CA.pos=CA.exp.length;break;
  case'#mp':case'#mm':{let v=CA.ans;if(CA.exp.trim()){try{v=cEval(CA.exp)}catch(e){CA.res='Syntax ERROR';return}}CA.vars.M+=a==='#mp'?v:-v;CA.res='M = '+cFmt(CA.vars.M);CA.val=null;break}
  default:cIns(a)}}
function cKey(k){
 const[lab,main,sl,sm,al]=k;let a=main;
 if(CA.alpha&&al)a='α'+al;else if(CA.shift&&sm)a=sm;
 if(a==='#shift'){CA.shift=!CA.shift;CA.alpha=false;cRender();return}
 if(a==='#alpha'){CA.alpha=!CA.alpha;CA.shift=false;cRender();return}
 const wasSto=CA.sto;CA.shift=false;CA.alpha=false;CA.sto=false;
 if(CA.hyp&&/^a?(sin|cos|tan)\($/.test(a)){a=a.slice(0,-1)+'h(';CA.hyp=false}
 if(a==='#rcl'){CA.alpha=true}else if(a==='#sto'){CA.alpha=true;CA.sto=true}else cAct(a,wasSto);
 cRender()}
function cRender(){
 const w=$('calc');if(!w)return;
 $('cx').innerHTML=cEsc(CA.exp.slice(0,CA.pos))+'<span class="cc"></span>'+cEsc(CA.exp.slice(CA.pos));
 $('cr').textContent=CA.res;
 $('cs').innerHTML=[CA.shift?'S':'',CA.alpha?'A':'',CA.hyp?'hyp':'',CA.sto?'STO':'',CA.vars.M?'M':''].filter(Boolean).map(x=>'<span>'+x+'</span>').join('');
 $('cang').textContent=CA.ang==='deg'?'DEG':CA.ang==='rad'?'RAD':'GRA';$('cfm').textContent=CA.fmt==='norm'?'Norm':CA.fmt==='fix'?'Fix':'Sci';
 $('cfrs').classList.toggle('on',CA.frac)}
/* ---------- الأوضاع الإضافية ---------- */
const cNum=id=>parseFloat($(id).value)||0;
const cInp=(id,l,v)=>`<label>${l}<input id="${id}" type="number" step="any" value="${v||0}" inputmode="decimal"></label>`;
function cModeForm(m){
 const f=$('cform');
 if(m==='eqn'){
  f.innerHTML='<select id="eq-t"><option value="2">ax²+bx+c=0</option><option value="3">ax³+bx²+cx+d=0</option><option value="s2">نظام معادلتين (x,y)</option><option value="s3">نظام 3 معادلات (x,y,z)</option></select><div id="eq-in"></div><button id="eq-go" class="cgo">حل</button><div id="eq-out" class="cout"></div>';
  const draw=()=>{const t=$('eq-t').value;let h='';if(t==='2')h=['a','b','c'].map(x=>cInp('q'+x,x)).join('');else if(t==='3')h=['a','b','c','d'].map(x=>cInp('q'+x,x)).join('');
   else{const n=t==='s2'?2:3,v=['x','y','z'];for(let i=0;i<n;i++){h+='<div class="eqr">';for(let j=0;j<n;j++)h+=cInp('s'+i+j,v[j]);h+=cInp('s'+i+'k','=')+'</div>'}}$('eq-in').innerHTML=h;$('eq-out').textContent=''};
  $('eq-t').onchange=draw;draw();
  $('eq-go').onclick=()=>{const t=$('eq-t').value,o=$('eq-out');
   try{if(t==='2'){const a=cNum('qa'),b=cNum('qb'),c=cNum('qc');if(!a){o.textContent=b?'x = '+cFmt(cClean(-c/b)):'لا يوجد حل';return}const D=b*b-4*a*c;
     if(D>=0)o.innerHTML='x₁ = '+cFmt(cClean((-b+Math.sqrt(D))/(2*a)))+'<br>x₂ = '+cFmt(cClean((-b-Math.sqrt(D))/(2*a)))+'<br>Δ = '+cFmt(cClean(D));
     else{const re=-b/(2*a),im=Math.sqrt(-D)/(2*a);o.innerHTML='x₁ = '+cFmtC(re,im)+'<br>x₂ = '+cFmtC(re,-im)+'<br>Δ = '+cFmt(cClean(D))}}
    else if(t==='3'){const a=cNum('qa');if(!a){o.textContent='a لازم تكون ≠ 0';return}const r=cCubic(a,cNum('qb'),cNum('qc'),cNum('qd'));o.innerHTML=r.map((z,i)=>'x'+(i+1)+' = '+cFmtC(z[0],z[1])).join('<br>')}
    else{const n=t==='s2'?2:3,A=[],B=[];for(let i=0;i<n;i++){A.push([...Array(n).keys()].map(j=>cNum('s'+i+j)));B.push(cNum('s'+i+'k'))}const s=cGauss(A,B);o.innerHTML=s?s.map((v,i)=>['x','y','z'][i]+' = '+cFmt(cClean(v))).join('<br>'):'مفيش حل وحيد'}}
   catch(e){o.textContent='Math ERROR'}}}
 else if(m==='stat'){
  f.innerHTML='<textarea id="st-d" rows="5" placeholder="اكتب القيم: كل سطر x أو (x y)&#10;مثال:&#10;1 2&#10;2 4&#10;3 6"></textarea><button id="st-go" class="cgo">احسب</button><div id="st-out" class="cout"></div>';
  $('st-go').onclick=()=>{const rows=$('st-d').value.split('\n').map(l=>l.trim().split(/[\s,;،]+/).filter(Boolean).map(Number)).filter(r=>r.length&&r.every(isFinite)),o=$('st-out');if(!rows.length){o.textContent='اكتب بيانات';return}
   const xs=rows.map(r=>r[0]),n=xs.length,sx=xs.reduce((a,b)=>a+b,0),sx2=xs.reduce((a,b)=>a+b*b,0),mean=sx/n,ss=xs.reduce((a,b)=>a+(b-mean)*(b-mean),0),srt=[...xs].sort((a,b)=>a-b),med=n%2?srt[(n-1)/2]:(srt[n/2-1]+srt[n/2])/2,F=v=>cFmt(cClean(v));
   let h=`n = ${n}<br>Σx = ${F(sx)}<br>Σx² = ${F(sx2)}<br>x̄ = ${F(mean)}<br>σx = ${F(Math.sqrt(ss/n))}<br>sx = ${n>1?F(Math.sqrt(ss/(n-1))):'—'}<br>min = ${F(srt[0])} ، max = ${F(srt[n-1])}<br>الوسيط = ${F(med)}`;
   if(rows.every(r=>r.length>1)&&n>1){const ys=rows.map(r=>r[1]),sy=ys.reduce((a,b)=>a+b,0),sy2=ys.reduce((a,b)=>a+b*b,0),sxy=xs.reduce((a,b,i)=>a+b*ys[i],0),dn=n*sx2-sx*sx,b=(n*sxy-sx*sy)/dn,a=(sy-b*sx)/n,r=(n*sxy-sx*sy)/Math.sqrt(dn*(n*sy2-sy*sy));h+=`<hr>Σy = ${F(sy)}<br>Σxy = ${F(sxy)}<br>ȳ = ${F(sy/n)}<br>y = A + Bx<br>A = ${F(a)}<br>B = ${F(b)}<br>r = ${F(r)}`}
   o.innerHTML=h}}
 else if(m==='base'){
  f.innerHTML='<div class="eqr"><input id="b-v" placeholder="الرقم" dir="ltr"><select id="b-b"><option value="10">DEC</option><option value="2">BIN</option><option value="8">OCT</option><option value="16">HEX</option></select></div><div class="eqr"><input id="b-w" placeholder="رقم تاني (اختياري)" dir="ltr"><select id="b-o"><option value="">—</option><option>and</option><option>or</option><option>xor</option><option>xnor</option><option>not</option><option>+</option><option>−</option><option>×</option><option>÷</option></select></div><button id="b-go" class="cgo">تحويل</button><div id="b-out" class="cout"></div>';
  $('b-go').onclick=()=>{const bs=+$('b-b').value,p=s=>{s=s.trim();if(!s)return 0;const n=parseInt(s,bs);if(isNaN(n))cErr('S');return n|0},o=$('b-out');
   try{let a=p($('b-v').value),b=p($('b-w').value);const op=$('b-o').value;
    if(op==='and')a&=b;else if(op==='or')a|=b;else if(op==='xor')a^=b;else if(op==='xnor')a=~(a^b);else if(op==='not')a=~a;else if(op==='+')a=(a+b)|0;else if(op==='−')a=(a-b)|0;else if(op==='×')a=Math.imul(a,b);else if(op==='÷'){if(!b)cErr('M');a=(a/b)|0}
    const u=a>>>0,g=s=>s.replace(/(?=(\d{4})+$)/g,' ').trim();
    o.innerHTML='DEC = '+a+'<br>BIN = '+g(u.toString(2).padStart(32,'0'))+'<br>OCT = '+u.toString(8)+'<br>HEX = '+u.toString(16).toUpperCase()}
   catch(e){o.textContent=e==='M'?'Math ERROR':'Syntax ERROR'}}}
 else if(m==='table'){
  f.innerHTML='<div class="eqr"><input id="t-f" placeholder="f(X) مثال: X²+2X+1" dir="ltr" value="X²"></div><div class="eqr">'+cInp('t-a','من',1)+cInp('t-b','إلى',5)+cInp('t-s','خطوة',1)+'</div><button id="t-go" class="cgo">جدول</button><div id="t-out" class="cout"></div>';
  $('t-go').onclick=()=>{const o=$('t-out'),a=cNum('t-a'),b=cNum('t-b'),s=cNum('t-s'),ex=$('t-f').value;if(!s||(b-a)/s>200||(b-a)/s<0){o.textContent='تأكد من (من/إلى/خطوة)';return}const old=CA.vars.X;let h='<table class="ctb"><tr><th>X</th><th>f(X)</th></tr>';
   for(let x=a;s>0?x<=b+1e-9:x>=b-1e-9;x+=s){CA.vars.X=cClean(x);let y;try{y=cFmt(cEval(ex))}catch(e){y='ERR'}h+='<tr><td>'+cFmt(cClean(x))+'</td><td>'+y+'</td></tr>'}CA.vars.X=old;o.innerHTML=h+'</table>'}}}
function cMode(m){CA.mode=m;$('ckeys').hidden=m!=='comp';$('clcd').hidden=m!=='comp';$('cctl').hidden=m!=='comp';$('cform').hidden=m==='comp';
 [...$('cmodes').children].forEach(b=>b.classList.toggle('on',b.dataset.m===m));if(m!=='comp')cModeForm(m)}
function calcBuild(){
 let w=$('calc');
 if(!w){w=document.createElement('div');w.id='calc';w.className='wgt';w.hidden=true;
  w.innerHTML='<div class="wh"><span>🧮 آلة حاسبة علمية</span></div><div id="cmodes">'+[['comp','COMP'],['eqn','EQN'],['stat','STAT'],['base','BASE'],['table','TABLE']].map(([k,l])=>`<button data-m="${k}">${l}</button>`).join('')+'</div>'
   +'<div id="clcd"><div id="cs"></div><div id="cx"></div><div id="cr"></div></div>'
   +'<div id="cctl"><button id="cang">DEG</button><button id="cfm">Norm</button><select id="cdg">'+[...Array(10).keys()].map(i=>`<option value="${i}"${i===4?' selected':''}>${i}</option>`).join('')+'</select><button id="cfrs">a b/c</button></div>'
   +'<div id="ckeys">'+CK.map((row,ri)=>'<div class="crow">'+row.map((k,ci)=>`<button class="ck ${k[5]||''} ${ri===0?'ktop':''}" data-r="${ri}" data-c="${ci}">${k[2]?`<i class="sl">${k[2]}</i>`:''}${k[4]?`<em class="al">${k[4]}</em>`:''}<b>${k[0]}</b></button>`).join('')+'</div>').join('')+'</div><div id="cform" hidden></div>';
  $('wl').appendChild(w);
  $('ckeys').onclick=e=>{const b=e.target.closest('.ck');if(b)cKey(CK[+b.dataset.r][+b.dataset.c])};
  $('cmodes').onclick=e=>{const b=e.target.closest('button');if(b)cMode(b.dataset.m)};
  $('cang').onclick=()=>{CA.ang=CA.ang==='deg'?'rad':CA.ang==='rad'?'gra':'deg';cRender()};
  $('cfm').onclick=()=>{CA.fmt=CA.fmt==='norm'?'fix':CA.fmt==='fix'?'sci':'norm';if(CA.val!=null)CA.res=cShow();cRender()};
  $('cdg').onchange=e=>{CA.dig=+e.target.value;if(CA.val!=null)CA.res=cShow();cRender()};
  $('cfrs').onclick=()=>{CA.frac=!CA.frac;if(CA.val!=null)CA.res=cShow();cRender()};
  cMode('comp')}
 cRender()}

function calcOpen(){addWidget('calc')}
