/* sound.js — أصوات الأقلام والواجهة (WebAudio بدون ملفات صوت) */
const SND={ac:null,mg:null,nb:null,pen:null};
/* [نوع الفلتر, التردد, Q, القوة, خشونة] */
const PSND={pen:['bandpass',2600,.8,.55],ballpoint:['bandpass',3600,.7,.4],fine:['bandpass',4000,.7,.35],ink:['bandpass',2200,.8,.5],cal:['bandpass',1500,1.1,.6],brushpen:['lowpass',1300,.6,.7],pencil:['highpass',2200,.5,.95],marker:['lowpass',2000,.9,.6],hl:['lowpass',1700,.9,.55],hlc:['lowpass',1800,.9,.55],chalk:['bandpass',1100,1.4,.9,1],crayon:['bandpass',800,1.2,.8,1],charcoal:['lowpass',1000,.8,.85,1],watercolor:['lowpass',650,.5,.6],oil:['lowpass',900,.6,.7],spray:['highpass',4200,.4,.7],air:['highpass',3000,.4,.45],dots:['bandpass',3000,1.5,.35],dashed:['bandpass',2600,1.2,.4],double:['bandpass',2400,.8,.5],wavy:['bandpass',2300,.8,.5],arrow:['bandpass',2500,.8,.5],eraser:['bandpass',1400,.7,.9,1]};
const PTONE={neon:[220,'sine'],rainbow:[330,'triangle']};
const PPING={stars:1,hearts:1,confetti:1,sparkle:1};
const sndOK=()=>S.snd&&S.vol>0;
function sndCtx(){
 if(SND.ac){if(SND.ac.state==='suspended')SND.ac.resume();SND.mg.gain.value=S.vol;return SND.ac}
 try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
  const a=SND.ac=new A();SND.mg=a.createGain();SND.mg.gain.value=S.vol;SND.mg.connect(a.destination);
  const n=a.sampleRate*2,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);let l=0;
  for(let i=0;i<n;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=w*.6+l*3}
  SND.nb=b;return a}catch(e){return null}}
function sTone(t,f,dur,vol,type){const a=SND.ac,o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0008,t+dur);o.connect(g);g.connect(SND.mg);o.start(t);o.stop(t+dur+.05)}
function sNoise(t,dur,type,f0,f1,vol,q){const a=SND.ac,s=a.createBufferSource();s.buffer=SND.nb;const f=a.createBiquadFilter();f.type=type;f.Q.value=q||1;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.15);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(SND.mg);s.start(t,Math.random()*1.4);s.stop(t+dur+.02)}
/* صوت الكتابة المستمر */
function penStart(b){
 if(!sndOK()||!S.penSnd)return;const a=sndCtx();if(!a)return;penEnd(true);
 if(PSND[b]){const p=PSND[b],s=a.createBufferSource();s.buffer=SND.nb;s.loop=true;const f=a.createBiquadFilter();f.type=p[0];f.frequency.value=p[1];f.Q.value=p[2];const g=a.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(SND.mg);s.start(0,Math.random()*1.5);SND.pen={s,f,g,p,rough:p[4]}}
 else if(PTONE[b]){const o=a.createOscillator(),g=a.createGain();o.type=PTONE[b][1];o.frequency.value=PTONE[b][0];g.gain.value=0;o.connect(g);g.connect(SND.mg);o.start();SND.pen={o,g,tone:1,base:PTONE[b][0]}}
 else if(PPING[b])SND.pen={ping:b,acc:0}}
function penMove(sp,dist){
 const q=SND.pen;if(!q||!SND.ac)return;const now=SND.ac.currentTime;
 if(q.ping){q.acc+=dist;if(q.acc>34){q.acc=0;sPing(q.ping)}return}
 const v=Math.min(1,sp/900);
 if(q.tone){q.o.frequency.setTargetAtTime(q.base*(1+v*1.6),now,.05);q.g.gain.setTargetAtTime(.05*(.3+v),now,.04);return}
 let g=q.p[3]*Math.pow(v,.6)*.35;if(q.rough)g*=.5+Math.random()*.9;
 q.g.gain.setTargetAtTime(g,now,.025);q.f.frequency.setTargetAtTime(q.p[1]*(.85+v*.5),now,.04)}
function penEnd(quick){
 const q=SND.pen;if(!q||!SND.ac)return;SND.pen=null;const now=SND.ac.currentTime;
 try{if(q.g){q.g.gain.cancelScheduledValues(now);q.g.gain.setTargetAtTime(0,now,quick?.01:.04)}}catch(e){}
 setTimeout(()=>{try{q.s&&q.s.stop();q.o&&q.o.stop()}catch(e){}},220)}
function sPing(k){
 const a=SND.ac;if(!a)return;const t=a.currentTime,N=[523,587,659,784,880,988,1175];
 if(k==='confetti'){sNoise(t,.07,'highpass',3000,5000,.25,.6);return}
 if(k==='hearts'){sTone(t,330+Math.random()*90,.25,.12,'sine');return}
 const f=N[(Math.random()*N.length)|0]*(k==='sparkle'?2:1);sTone(t,f,.5,.12,'triangle')}
/* أصوات الواجهة: click / flip (قلب صفحة) / chime / done / pop */
function uiSound(k){
 if(!sndOK())return;if((k==='click'||k==='flip'||k==='pop')&&!S.uiSnd)return;
 const a=sndCtx();if(!a)return;const t=a.currentTime;
 if(k==='click')sNoise(t,.03,'bandpass',2500,1800,.2,1.2);
 else if(k==='flip'){sNoise(t,.34,'bandpass',700,3800,.9,.8);sNoise(t+.05,.22,'highpass',2500,6000,.35,.6);sTone(t,110,.12,.12,'sine')}
 else if(k==='chime'){[880,1320,1760,2640].forEach((f,i)=>sTone(t,f,1.6,.16/(i+1),'sine'))}
 else if(k==='done'){[660,880,1100].forEach((f,i)=>sTone(t+i*.16,f,.9,.15,'sine'))}
 else if(k==='pop')sTone(t,500,.08,.12,'sine')}
