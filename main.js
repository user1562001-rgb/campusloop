// Mobile menu
var m=document.querySelector('.menu'),n=document.getElementById('nav');
m.addEventListener('click',function(){var o=n.classList.toggle('open');m.setAttribute('aria-expanded',o);});
// GA4 CTA tracking
document.querySelectorAll('.btn').forEach(function(b){b.addEventListener('click',function(){gtag('event','cta_click',{cta_id:b.id||'cta',page_path:location.pathname});});});
// Waitlist submit tracking
var f=document.getElementById('wl');
if(f){f.addEventListener('submit',function(){gtag('event','waitlist_submit',{role:document.getElementById('role').value});});}
// Listing filter
var q=document.querySelector('[data-filter]');
if(q){q.addEventListener('input',function(){var v=q.value.toLowerCase(),c=0;document.querySelectorAll('.listing').forEach(function(l){var s=l.dataset.t.indexOf(v)>-1;l.hidden=!s;if(s)c++;});document.getElementById('none').hidden=c>0;});}

// Real photo overrides: drop a file into images/photos/ and it replaces the illustration
document.querySelectorAll('img[data-photo]').forEach(function(i){var p=new Image();p.onload=function(){i.src=i.dataset.photo;};p.src=i.dataset.photo;});
// Savings calculator
var np=document.getElementById('np');
if(np){var dc=document.getElementById('dc'),dv=document.getElementById('dv'),sv=document.getElementById('sv');
function calc(){var p=parseFloat(np.value)||0,d=+dc.value;dv.textContent=d;var pay=p*(1-d/100);sv.textContent='You could pay about $'+pay.toFixed(2)+' and save $'+(p-pay).toFixed(2);}
np.addEventListener('input',calc);dc.addEventListener('input',calc);calc();}
// Browse: save, sort, details
var grid=document.querySelector('.grid');
if(grid){var S={};try{S=JSON.parse(localStorage.getItem('cl_saved')||'{}');}catch(e){}
var cards=[].slice.call(grid.children),sc=document.getElementById('sc'),dlg=document.getElementById('dlg');
function keep(){try{localStorage.setItem('cl_saved',JSON.stringify(S));}catch(e){}sc.textContent=cards.filter(function(c){return S[c.dataset.t];}).length;}
cards.forEach(function(c){var k=c.dataset.t,b=c.querySelector('.save');
function paint(){var on=!!S[k];b.setAttribute('aria-pressed',on);b.innerHTML=on?'&#9829; Saved':'&#9825; Save';}
paint();b.addEventListener('click',function(){if(S[k]){delete S[k];}else{S[k]=1;gtag('event','save_item',{item:k});}paint();keep();});
c.querySelector('[data-open]').addEventListener('click',function(){document.getElementById('dt').textContent=c.querySelector('h3').textContent;document.getElementById('dd').textContent=c.querySelector('p').textContent;document.getElementById('dp').textContent=c.querySelector('.price').textContent;var im=document.getElementById('dimg'),ci=c.querySelector('img');im.src=ci.src;im.alt=ci.alt;gtag('event','view_item',{item:k});dlg.showModal();});});
keep();
document.getElementById('so').addEventListener('change',function(e){var v=e.target.value;cards.slice().sort(function(a,b){return v==='a'?a.dataset.price-b.dataset.price:v==='d'?b.dataset.price-a.dataset.price:a.dataset.i-b.dataset.i;}).forEach(function(c){grid.appendChild(c);});});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close();});}
// Move-out checklist
var ck=document.querySelectorAll('.check input');
if(ck.length){var D={};try{D=JSON.parse(localStorage.getItem('cl_check'+location.pathname)||'{}');}catch(e){}
function up(){var n=0;ck.forEach(function(x){if(x.checked)n++;});var pc=Math.round(n/ck.length*100);document.getElementById('bar').style.width=pc+'%';document.querySelector('.prog').setAttribute('aria-valuenow',pc);document.getElementById('pt').textContent=n+' of '+ck.length+' done';try{localStorage.setItem('cl_check'+location.pathname,JSON.stringify(D));}catch(e){}}
ck.forEach(function(x){x.checked=!!D[x.dataset.k];x.addEventListener('change',function(){D[x.dataset.k]=x.checked;up();});});up();}
// Scam quiz
var qz=document.getElementById('quiz');
if(qz){qz.addEventListener('submit',function(e){e.preventDefault();var s=0,fs=qz.querySelectorAll('fieldset');fs.forEach(function(f){var r=f.querySelector('input:checked');if(r&&r.value===f.dataset.a)s++;});var o=document.getElementById('qr');o.className='result '+(s===fs.length?'good':'bad');o.textContent='You got '+s+' of '+fs.length+(s===fs.length?'. Strong scam radar.':'. Re-read the warning signs above and try again.');gtag('event','quiz_complete',{score:s});});}

// Sign-in demo
var si=document.getElementById('signin'),sdd=document.getElementById('sdlg');
if(si){si.addEventListener('click',function(){sdd.showModal();});
document.getElementById('sform').addEventListener('submit',function(e){e.preventDefault();var v=document.getElementById('semail').value.trim().toLowerCase(),o=document.getElementById('sres'),ok=/^[^@\s]+@[^@\s]+\.edu\.au$/.test(v);o.className='result '+(ok?'good':'bad');o.textContent=ok?'Looks like a university email. A real launch would send a code to confirm it.':'Use your university email address ending in .edu.au.';gtag('event','signin_attempt',{valid:ok});});
sdd.addEventListener('click',function(e){if(e.target===sdd)sdd.close();});}
// Listing builder
var cl=document.getElementById('cl');
if(cl){var g=function(i){return document.getElementById('ls-'+i);},img={Textbook:'book.svg',Furniture:'chair.svg',Kitchenware:'pot.svg'};
function upd(){var t=g('t').value,p=g('p').value,u=g('u').value,d=g('d').value;
document.getElementById('pv-t').textContent=t||'Your item title';
document.getElementById('pv-c').textContent=g('o').value+' | '+g('c').value;
document.getElementById('pv-p').textContent=p?'$'+p:'Set a price';
document.getElementById('pv-u').textContent=u?'Pick-up: '+u:'Choose a pick-up point';
document.getElementById('pv-i').src='images/'+img[g('c').value];
var ok=[t.length>=8,+p>0,!!u,d.length>=30];
document.querySelectorAll('#ck li').forEach(function(l,i){l.querySelector('span').innerHTML=ok[i]?'&#10003;':'&#9675;';});return ok;}
cl.addEventListener('input',upd);upd();
cl.addEventListener('submit',function(e){e.preventDefault();var ok=upd(),n=ok.filter(Boolean).length,o=document.getElementById('cl-r');o.className='result '+(n===4?'good':'bad');o.textContent=n===4?'Great listing. This is a preview only, so nothing was posted.':(4-n)+' item(s) to fix in the checklist.';gtag('event','listing_preview',{score:n});});}
// Price guide
var pn=document.getElementById('pg-n');
if(pn){var pc=document.getElementById('pg-c'),pr=document.getElementById('pg-r');function pg(){var b=(+pn.value||0)*pc.value;pr.textContent='Try $'+Math.round(b*.9)+' to $'+Math.round(b*1.1);}pn.addEventListener('input',pg);pc.addEventListener('change',pg);pg();}
// Review demo
var rv=document.getElementById('rv');
if(rv){rv.addEventListener('submit',function(e){e.preventDefault();var o=document.getElementById('rv-r');o.className='result good';o.textContent=rv.querySelector('input:checked')?'Thanks. Demo only, nothing was saved.':'Choose a rating first.';});}
// Impact estimator
var im=document.getElementById('im-n');
if(im){var ir=document.getElementById('im-r');function iu(){ir.textContent='That is '+(+im.value||0)+' items kept in use instead of the bin.';}im.addEventListener('input',iu);iu();}
