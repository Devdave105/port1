/* DAVID AKPAN — main.js */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initBTT();
  initSmooth();
  handlePhoto();
});

/* ── NAV ── */
function initNav() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  document.querySelectorAll('.ml').forEach(l =>
    l.addEventListener('click', () => menu.classList.remove('open'))
  );

  // Close on outside click
  menu.addEventListener('click', e => {
    if (e.target === menu) menu.classList.remove('open');
  });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── BACK TO TOP ── */
function initBTT() {
  const btt = document.getElementById('btt');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('on', scrollY > 500);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── SMOOTH SCROLL ── */
function initSmooth() {
  const header = document.getElementById('header');
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const h = this.getAttribute('href');
      if (h === '#') return;
      const target = document.querySelector(h);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight + 16;
        window.scrollTo({
          top: target.getBoundingClientRect().top + scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ── PHOTO: hide placeholder if real image loads ── */
function handlePhoto() {
  const img         = document.getElementById('aboutPhoto');
  const placeholder = document.getElementById('photoPlaceholder');
  if (!img || !placeholder) return;

  const src = img.getAttribute('src');
  if (!src || src === 'YOUR_PHOTO_HERE.jpg') {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    return;
  }
  img.addEventListener('load', () => {
    placeholder.style.display = 'none';
    img.style.display = 'block';
  });
  img.addEventListener('error', () => {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  });
}

/* ── CONTACT FORM ── */
function handleForm(e) {
  e.preventDefault();
  const n    = document.getElementById('cfN').value.trim();
  const em   = document.getElementById('cfE').value.trim();
  const s    = document.getElementById('cfS').value.trim();
  const m    = document.getElementById('cfM').value.trim();
  const note = document.getElementById('formNote');

  note.textContent = 'Opening WhatsApp...';
  const text = `Hi David!\n\nName: ${n} (${em})\nSubject: ${s}\n\n${m}`;

  setTimeout(() => {
    window.open('https://wa.me/2349031538922?text=' + encodeURIComponent(text), '_blank');
    note.textContent = 'Message sent via WhatsApp!';
    e.target.reset();
    setTimeout(() => note.textContent = '', 4000);
  }, 400);
}

/* ── NEWSLETTER (footer) ── */
function subNL() {
  const inp  = document.getElementById('nlEmail');
  const note = document.getElementById('nlNote');
  if (!inp || !inp.value.includes('@')) {
    if (note) { note.style.color = '#f87171'; note.textContent = 'Enter a valid email.'; }
    return;
  }
  if (note) { note.style.color = '#60a5fa'; note.textContent = 'Subscribed — welcome aboard!'; }
  if (inp) inp.value = '';
  setTimeout(() => { if (note) note.textContent = ''; }, 5000);
}