/* ═══════════════════════════════════════════════════
   DAVID AKPAN PORTFOLIO — main.js
═══════════════════════════════════════════════════ */

/* ── PRELOADER ── */
const pre   = document.getElementById('preloader');
const pls   = [document.getElementById('pl1'),document.getElementById('pl2'),document.getElementById('pl3'),document.getElementById('pl4'),document.getElementById('pl5')];
let pi = 0;
pls[0].classList.add('active');
const pInt = setInterval(()=>{
  pls[pi].classList.remove('active');
  pi = (pi+1) % pls.length;
  pls[pi].classList.add('active');
},700);

window.addEventListener('load',()=>{
  setTimeout(()=>{
    clearInterval(pInt);
    pre.style.transition = 'opacity .6s ease';
    pre.style.opacity    = '0';
    setTimeout(()=>{ pre.style.display='none'; initHeroGSAP(); initScrollFade(); },650);
  },3200);
});

/* ── SCROLL FADE (IntersectionObserver) ── */
function initScrollFade(){
  const els = document.querySelectorAll('.fade-up,.fade-left,.fade-right');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  },{ threshold:0.1, rootMargin:'0px 0px -36px 0px' });
  els.forEach(el=>obs.observe(el));
}

/* ── NAVBAR ── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('sc', scrollY > 60);
  document.getElementById('btt').classList.toggle('vis', scrollY > 400);
},{ passive:true });
document.getElementById('burger').addEventListener('click',()=>document.getElementById('mobMenu').classList.toggle('open'));
document.querySelectorAll('.ml').forEach(l=>l.addEventListener('click',()=>document.getElementById('mobMenu').classList.remove('open')));

/* ── HERO SLIDER + TEXT SYNC ── */
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
const hc     = document.querySelector('.hero-content');
const slideNumEl = document.getElementById('slideNum');

const SD = [
  { tag:'Full-Stack Developer & Digital Architect', l1:'Crafting Digital', l2:'Excellence', l3:'For Ambitious Brands.', sub:'I architect high-performance web platforms, conversion-driven applications, and search-optimised ecosystems that transform businesses into market leaders.' },
  { tag:'Web Development & SEO Strategy',           l1:'Your Brand',       l2:'Deserves',   l3:'Page One.',           sub:'I build search-optimised platforms that pull traffic, engage users, and convert at scale — from the first click to the final sale.' },
  { tag:'SaaS Platforms & App Development',         l1:'Ideas Into',       l2:'Products',   l3:'That Ship.',          sub:'From concept to production-ready — I turn ambitious business ideas into polished, scalable, and profitable digital products.' }
];

let cs = 0, si;

function goSlide(i){
  slides[cs].classList.remove('active'); dots[cs].classList.remove('active');
  cs = i;
  slides[cs].classList.add('active'); dots[cs].classList.add('active');
  if(slideNumEl) slideNumEl.textContent = String(cs+1).padStart(2,'0');
  hc.classList.add('tx-out');
  setTimeout(()=>{
    const d = SD[cs];
    document.getElementById('hTagTxt').textContent = d.tag;
    document.getElementById('hL1').textContent     = d.l1;
    document.getElementById('hL2').textContent     = d.l2;
    document.getElementById('hL3').textContent     = d.l3;
    document.getElementById('hSub').textContent    = d.sub;
    hc.classList.remove('tx-out');
  },380);
}
si = setInterval(()=>goSlide((cs+1)%3), 5500);
dots.forEach((d,i)=>d.addEventListener('click',()=>{ clearInterval(si); goSlide(i); si=setInterval(()=>goSlide((cs+1)%3),5500); }));

/* ── GSAP HERO ENTRANCE ── */
function initHeroGSAP(){
  if(typeof gsap==='undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('.h-eyebrow',{opacity:1,y:0,duration:.9, delay:.15,ease:'power3.out'});
  gsap.to('.h-title',  {opacity:1,y:0,duration:1.1,delay:.38,ease:'power3.out'});
  gsap.to('.h-sub',    {opacity:1,y:0,duration:.9, delay:.62,ease:'power3.out'});
  gsap.to('.h-actions',{opacity:1,y:0,duration:.8, delay:.85,ease:'power3.out'});
  gsap.to('.h-metrics',{opacity:1,y:0,duration:.8, delay:1.0,ease:'power3.out'});

  /* stat counters */
  document.querySelectorAll('.an-n').forEach(el=>{
    const num = parseInt(el.textContent); const sfx = el.textContent.replace(/\d+/,'').trim();
    if(!num) return;
    ScrollTrigger.create({ trigger:el, start:'top 88%', onEnter:()=>{
      const o={v:0}; gsap.to(o,{ v:num, duration:1.8, ease:'power2.out', onUpdate(){ el.textContent=Math.ceil(o.v)+sfx; } });
    }});
  });
}

/* ── VIEW MORE ── */
document.getElementById('vmBtn')?.addEventListener('click',()=>{
  document.getElementById('vmWrap').style.display='none';
  document.getElementById('pjLoad').classList.remove('hidden');
  setTimeout(()=>{
    document.getElementById('pjLoad').classList.add('hidden');
    const ep = document.getElementById('pjExtra');
    ep.classList.remove('hidden'); ep.style.display='grid';
    ep.querySelectorAll('.pj-card').forEach((el,i)=>{
      el.style.opacity='0'; el.style.transform='translateY(28px)';
      setTimeout(()=>{ el.style.transition='opacity .6s ease,transform .6s ease'; el.style.opacity='1'; el.style.transform='translateY(0)'; },80+i*130);
    });
  },2000);
});

/* ── FAQ ── */
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const it=btn.parentElement, op=it.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!op) it.classList.add('open');
  });
});

/* ── REVIEWS CAROUSEL ── */
const rvT   = document.getElementById('rvTrack');
const cards = rvT ? rvT.querySelectorAll('.rv-card') : [];
const dotsEl = document.getElementById('rvDots');
let ri=0, ra;
if(dotsEl && cards.length){
  cards.forEach((_,i)=>{ const d=document.createElement('span'); d.className='rv-dot'+(i===0?' active':''); d.onclick=()=>{goRv(i);resetRA();}; dotsEl.appendChild(d); });
}
function goRv(i){ ri=((i%cards.length)+cards.length)%cards.length; rvT.style.transform=`translateX(-${ri*(340+24)}px)`; document.querySelectorAll('.rv-dot').forEach((d,j)=>d.classList.toggle('active',j===ri)); }
function resetRA(){ clearInterval(ra); ra=setInterval(()=>goRv(ri+1),5000); }
document.getElementById('rvNext')?.addEventListener('click',()=>{goRv(ri+1);resetRA();});
document.getElementById('rvPrev')?.addEventListener('click',()=>{goRv(ri-1);resetRA();});
ra = setInterval(()=>goRv(ri+1),5000);

/* ── WHATSAPP SEND ── */
document.getElementById('waSend')?.addEventListener('click',()=>{
  const txt = document.getElementById('waMsg').value.trim() || "Hi David, I found you via your portfolio and I'd like to work with you.";
  window.open('https://wa.me/2349031538922?text='+encodeURIComponent(txt),'_blank');
});

/* ── CONTACT FORM ── */
function handleForm(e){
  e.preventDefault();
  const n=document.getElementById('cfN').value.trim(), em=document.getElementById('cfE').value.trim(), s=document.getElementById('cfS').value.trim(), m=document.getElementById('cfM').value.trim();
  const note=document.getElementById('fNote');
  note.textContent='Redirecting to WhatsApp...';
  const msg=`Hi David!\n\nName: ${n} (${em})\nSubject: ${s}\n\n${m}`;
  setTimeout(()=>{ window.open('https://wa.me/2349031538922?text='+encodeURIComponent(msg),'_blank'); note.textContent='Sent via WhatsApp!'; e.target.reset(); setTimeout(()=>note.textContent='',4000); },500);
}

/* ── NEWSLETTER ── */
function subNL(){
  const el=document.getElementById('nlEmail'), msg=document.getElementById('nlMsg');
  if(!el.value.trim() || !el.value.includes('@')){ msg.style.color='#ea4335'; msg.textContent='Please enter a valid email.'; return; }
  msg.style.color=''; msg.textContent='Subscribed! Welcome aboard.';
  el.value=''; setTimeout(()=>msg.textContent='',5000);
}

/* ── BACK TO TOP ── */
document.getElementById('btt')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const h=this.getAttribute('href'); if(h==='#') return;
    const t=document.querySelector(h);
    if(t){ e.preventDefault(); window.scrollTo({top:t.getBoundingClientRect().top+scrollY-nav.offsetHeight-8,behavior:'smooth'}); }
  });
});