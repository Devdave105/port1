/* ═══════════════════════════════════
   DAVID AKPAN — main.js
═══════════════════════════════════ */

window.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initReveal();
  initFAQ();
  initVoices();
  initWA();
  initMore();
  initBTT();
  initSmooth();
});

/* ── NAV ── */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('navDrawer');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', scrollY > 56);
    document.getElementById('btt').classList.toggle('on', scrollY > 500);
  }, { passive: true });

  toggle.addEventListener('click', () => drawer.classList.toggle('open'));
  document.querySelectorAll('.drawer-link').forEach(l =>
    l.addEventListener('click', () => drawer.classList.remove('open'))
  );
}

/* ── REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── HERO ── */
function initHero() {
  const slides = document.querySelectorAll('.hbg-slide');
  const dots   = document.querySelectorAll('.hf-dot');
  const hLeft  = document.querySelector('.hero-left');
  const hNum   = document.getElementById('hNum');

  const DATA = [
    { eye: 'Full-Stack Developer & Digital Architect', t1: 'Building', t2: 'Digital', t3: 'Legacies.', body: 'I design and engineer high-performance digital products — platforms that rank, convert, and scale. Strategy-first. Code-led. Results-driven.' },
    { eye: 'Web Development & SEO Architecture',       t1: 'Your Brand', t2: 'Deserves', t3: 'Page One.',  body: 'Search-optimised systems built from the ground up to dominate rankings, engage users at every touchpoint, and convert at scale.' },
    { eye: 'SaaS Platforms & App Development',          t1: 'Ideas Into', t2: 'Products', t3: 'That Ship.', body: 'From concept to production-ready — I turn ambitious business ideas into polished, scalable, and profitable digital products.' }
  ];

  let cur = 0, timer;

  function go(i) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = i;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
    if (hNum) hNum.textContent = String(cur + 1).padStart(2, '0');

    hLeft.classList.add('out');
    setTimeout(() => {
      const d = DATA[cur];
      document.getElementById('hEyebrow').textContent = d.eye;
      document.getElementById('hT1').textContent = d.t1;
      document.getElementById('hT2').textContent = d.t2;
      document.getElementById('hT3').textContent = d.t3;
      document.getElementById('hBody').textContent = d.body;
      hLeft.classList.remove('out');
    }, 340);
  }

  dots.forEach((d, i) => d.addEventListener('click', () => {
    clearInterval(timer);
    go(i);
    timer = setInterval(() => go((cur + 1) % 3), 6000);
  }));

  timer = setInterval(() => go((cur + 1) % 3), 6000);

  // GSAP entrance
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.hero-left .hero-eyebrow', { opacity: 1, y: 0, duration: .8, delay: .15 })
    .to('.hero-left .hero-title',   { opacity: 1, y: 0, duration: 1  }, '-=.5')
    .to('.hero-left .hero-body',    { opacity: 1, y: 0, duration: .8 }, '-=.55')
    .to('.hero-left .hero-btns',    { opacity: 1, y: 0, duration: .7 }, '-=.5')
    .to('.hero-panel',              { opacity: 1, y: 0, duration: .8 }, '-=.6');

  // Stat counters on hero panel
  document.querySelectorAll('.hp-n').forEach(el => {
    const target = parseInt(el.dataset.target);
    if (!target) return;
    ScrollTrigger.create({ trigger: el, start: 'top 90%', onEnter: () => {
      const o = { v: 0 };
      gsap.to(o, { v: target, duration: 1.8, ease: 'power2.out', onUpdate() { el.textContent = Math.ceil(o.v); } });
    }});
  });

  // About metric counters
  document.querySelectorAll('.m-val').forEach(el => {
    const raw = el.textContent.trim();
    const num = parseInt(raw);
    const sfx = raw.replace(/\d+/, '').trim();
    if (!num) return;
    ScrollTrigger.create({ trigger: el, start: 'top 88%', onEnter: () => {
      const o = { v: 0 };
      gsap.to(o, { v: num, duration: 1.6, ease: 'power2.out', onUpdate() { el.textContent = Math.ceil(o.v) + sfx; } });
    }});
  });
}

/* ── FAQ ── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── VOICES CAROUSEL ── */
function initVoices() {
  const track  = document.getElementById('vsTrack');
  const cards  = track ? track.querySelectorAll('.vs-card') : [];
  const dotsEl = document.getElementById('vsDots');
  let cur = 0, auto;

  if (dotsEl && cards.length) {
    cards.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'vs-dot' + (i === 0 ? ' on' : '');
      d.onclick = () => { go(i); reset(); };
      dotsEl.appendChild(d);
    });
  }

  function go(i) {
    cur = ((i % cards.length) + cards.length) % cards.length;
    track.style.transform = `translateX(-${cur * (340 + 20)}px)`;
    document.querySelectorAll('.vs-dot').forEach((d, j) => d.classList.toggle('on', j === cur));
  }
  function reset() { clearInterval(auto); auto = setInterval(() => go(cur + 1), 5500); }

  document.getElementById('vsNext')?.addEventListener('click', () => { go(cur + 1); reset(); });
  document.getElementById('vsPrev')?.addEventListener('click', () => { go(cur - 1); reset(); });
  auto = setInterval(() => go(cur + 1), 5500);
}

/* ── WHATSAPP ── */
function initWA() {
  document.getElementById('waSend')?.addEventListener('click', () => {
    const msg = document.getElementById('waMsg').value.trim()
      || "Hi David, I found you through your portfolio and I'd like to discuss a project.";
    window.open('https://wa.me/2349031538922?text=' + encodeURIComponent(msg), '_blank');
  });
}

/* ── LOAD MORE ── */
function initMore() {
  document.getElementById('moreBtn')?.addEventListener('click', () => {
    document.getElementById('moreRow').style.display = 'none';
    const loading = document.getElementById('moreLoading');
    loading.classList.remove('hidden');
    loading.style.display = 'flex';

    setTimeout(() => {
      loading.classList.add('hidden');
      const extra = document.getElementById('moreItems');
      extra.classList.remove('hidden');
      extra.style.display = 'flex';
      extra.querySelectorAll('.work-item').forEach((el, i) => {
        el.style.opacity = '0'; el.style.transform = 'translateY(28px)';
        setTimeout(() => {
          el.style.transition = 'opacity .6s ease, transform .6s ease';
          el.style.opacity = '1'; el.style.transform = 'translateY(0)';
        }, 60 + i * 140);
      });
    }, 2000);
  });
}

/* ── CONTACT FORM ── */
function handleForm(e) {
  e.preventDefault();
  const n  = document.getElementById('cfN').value.trim();
  const em = document.getElementById('cfE').value.trim();
  const s  = document.getElementById('cfS').value.trim();
  const m  = document.getElementById('cfM').value.trim();
  const msg = document.getElementById('cfMsg');

  msg.textContent = 'Opening WhatsApp...';
  const text = `Hi David!\n\nName: ${n} (${em})\nSubject: ${s}\n\n${m}`;
  setTimeout(() => {
    window.open('https://wa.me/2349031538922?text=' + encodeURIComponent(text), '_blank');
    msg.textContent = 'Sent via WhatsApp!';
    e.target.reset();
    setTimeout(() => msg.textContent = '', 4000);
  }, 400);
}

/* ── NEWSLETTER ── */
function subNL() {
  const inp = document.getElementById('nlEmail');
  const note = document.getElementById('nlNote');
  if (!inp.value.trim() || !inp.value.includes('@')) {
    note.style.color = '#f87171'; note.textContent = 'Enter a valid email address.'; return;
  }
  note.style.color = '#FCA5A5'; note.textContent = 'Subscribed — welcome aboard.';
  inp.value = '';
  setTimeout(() => note.textContent = '', 5000);
}

/* ── BACK TO TOP ── */
function initBTT() {
  document.getElementById('btt')?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* ── SMOOTH SCROLL ── */
function initSmooth() {
  const nav = document.getElementById('nav');
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const h = this.getAttribute('href');
      if (h === '#') return;
      const target = document.querySelector(h);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + scrollY - nav.offsetHeight - 6,
          behavior: 'smooth'
        });
      }
    });
  });
}