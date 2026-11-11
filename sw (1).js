const V='inf-v7',CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./sound.js','./calc.js','./study.js','./book.js','./ai.js','./pdf.min.mjs','./pdf.worker.min.mjs','./jszip.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||!r.url.startsWith('http'))return;
 const good=res=>res&&(res.ok||(res.type==='opaque'&&/fonts\.googleapis\.com/.test(r.url)));
 const put=res=>{if(good(res)){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res};
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(put).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));return}
 e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(put).catch(()=>hit);return hit||net}))});
