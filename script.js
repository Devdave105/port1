/* ============================================================
   DAVID AKPAN — script.js
   Built from scratch · Zero conflicts
   ============================================================ */

(function () {
  'use strict';

  /* ── helpers ── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ============================================================
     NAVBAR  —  transparent → solid on scroll
     ============================================================ */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    function update() { nav.classList.toggle('solid', window.scrollY > 44); }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  function initBackTop() {
    var btn = document.getElementById('backTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     HAMBURGER  —  bars animate to X, drawer slides in
     ============================================================ */
  function initHamburger() {
    var burger  = document.getElementById('burger');
    var drawer  = document.getElementById('drawer');
    var overlay = document.getElementById('drawerOverlay');
    if (!burger || !drawer) return;

    function open() {
      burger.classList.add('is-open');
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      burger.classList.remove('is-open');
      drawer.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    if (overlay) overlay.addEventListener('click', close);
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ============================================================
     HERO SLIDER
     ============================================================ */
  function initSlider() {
    var slides = $$('.hero-slide');
    var dots   = $$('.s-dot');
    if (!slides.length) return;

    var cur   = 0;
    var timer = null;

    function show(n) {
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = ((n % slides.length) + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
    }

    function autoplay() { timer = setInterval(function () { show(cur + 1); }, 5500); }
    function restart()  { clearInterval(timer); autoplay(); }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); restart(); });
    });

    autoplay();
  }

  /* ============================================================
     COUNTER  —  animates numbers when stats bar scrolls in
     ============================================================ */
  function initCounter() {
    var els  = $$('.stat-val[data-target]');
    var done = false;
    if (!els.length) return;

    function run() {
      if (done) return;
      var bar = $('.stats-bar');
      if (!bar || bar.getBoundingClientRect().top > window.innerHeight - 60) return;
      done = true;
      els.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var t0 = performance.now(), dur = 1800;
        (function tick(now) {
          var p = Math.min((now - t0) / dur, 1);
          var v = Math.round((1 - Math.pow(1 - p, 3)) * target);
          el.innerHTML = v + '<em>' + suffix + '</em>';
          if (p < 1) requestAnimationFrame(tick);
          else el.innerHTML = target + '<em>' + suffix + '</em>';
        })(t0);
      });
    }

    window.addEventListener('scroll', run, { passive: true });
    run();
  }

  /* ============================================================
     REVEAL ANIMATIONS  —  CSS-only, triggered by IntersectionObserver
     ============================================================ */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;

    if (!window.IntersectionObserver) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     FAQ ACCORDION
     ============================================================ */
  function initFAQ() {
    var items = $$('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn    = $('.faq-btn',    item);
      var answer = $('.faq-answer', item);
      var icon   = $('.faq-icon',   item);
      if (!btn || !answer) return;

      answer.style.display = 'none';  // start closed

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // close all
        items.forEach(function (i) {
          i.classList.remove('open');
          var a  = $('.faq-answer', i);
          var ic = $('.faq-icon',   i);
          if (a)  a.style.display  = 'none';
          if (ic) ic.textContent   = '+';
        });

        // open this one
        if (!isOpen) {
          item.classList.add('open');
          answer.style.display = 'block';
          if (icon) icon.textContent = '×';
        }
      });
    });
  }

  /* ============================================================
     REVIEWS
     ============================================================ */
  var DEFAULT_REVIEWS = [
    { name:'Emeka Okafor',  role:'CEO, Okafor Ventures',   rating:5, text:'David delivered a stunning business website that exceeded every expectation. Our online enquiries literally doubled within the first month of going live.' },
    { name:'Amara Nwosu',   role:'Founder, StyleByAmara',  rating:5, text:'Working with David was seamless from start to finish. He understood exactly what our brand needed — professional, fast, and the quality is outstanding.' },
    { name:'Chukwudi Eze',  role:'Director, EzeLogistics', rating:5, text:'Our website has completely transformed how clients perceive our business. Loads fast, looks world-class, and converts visitors. Absolutely worth every naira.' },
    { name:'Ngozi Adeyemi', role:'Brand Consultant',       rating:5, text:'David stands far above other developers I have worked with. He thinks about user experience and business results, not just aesthetics.' },
    { name:'Tunde Bakare',  role:'MD, Bakare Properties',  rating:5, text:'Incredibly impressed with the final product. Clean, modern, works perfectly across all devices, and delivered ahead of schedule. Highly recommended.' }
  ];

  function getSaved()  { try { return JSON.parse(localStorage.getItem('da_reviews') || '[]'); } catch(e) { return []; } }
  function setSaved(a) { try { localStorage.setItem('da_reviews', JSON.stringify(a)); } catch(e) {} }

  function starStr(n) {
    var s = '';
    for (var i = 0; i < 5; i++) s += '<span style="color:' + (i < n ? '#f59e0b' : '#d1d1cc') + '">&#9733;</span>';
    return s;
  }

  function makeReviewCard(r) {
    var d = document.createElement('div');
    d.className = 'review-card reveal';
    d.innerHTML =
      '<div class="rc-top">' +
        '<div class="rc-avatar">' + esc(r.name).slice(0,2).toUpperCase() + '</div>' +
        '<div><span class="rc-name">' + esc(r.name) + '</span>' +
          '<span class="rc-role">' + esc(r.role || 'Verified Client') + '</span></div>' +
      '</div>' +
      '<div class="rc-stars">' + starStr(r.rating) + '</div>' +
      '<p class="rc-text">' + esc(r.text) + '</p>';
    return d;
  }

  function initReviews() {
    var grid      = document.getElementById('reviewsGrid');
    var loadBtn   = document.getElementById('loadMoreReviews');
    var openBtn   = document.getElementById('openReviewForm');
    var formWrap  = document.getElementById('reviewFormWrap');
    var submitBtn = document.getElementById('submitReview');
    var starSel   = document.getElementById('starSelector');
    if (!grid) return;

    var all     = DEFAULT_REVIEWS.concat(getSaved());
    var showing = 3;
    var picked  = 0;

    function render() {
      grid.innerHTML = '';
      all.slice(0, showing).forEach(function (r) {
        var card = makeReviewCard(r);
        grid.appendChild(card);
        // trigger reveal immediately for newly added cards
        setTimeout(function () { card.classList.add('visible'); }, 40);
      });
      if (loadBtn) loadBtn.style.display = showing >= all.length ? 'none' : '';
    }
    render();

    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        showing += 3;
        render();
      });
    }

    // toggle form
    if (openBtn && formWrap) {
      formWrap.style.display = 'none';
      openBtn.addEventListener('click', function () {
        var vis = formWrap.style.display === 'none';
        formWrap.style.display = vis ? 'block' : 'none';
        openBtn.textContent = vis ? 'Close Form' : 'Leave a Review';
        if (vis) setTimeout(function () { formWrap.scrollIntoView({ behavior:'smooth', block:'start' }); }, 60);
      });
    }

    // star picker
    if (starSel) {
      var starBtns = $$('.star-btn', starSel);
      function paintStars(n) {
        starBtns.forEach(function (b, i) {
          b.style.color = i < n ? '#f59e0b' : '#d1d1cc';
          b.classList.toggle('lit', i < n);
        });
      }
      starBtns.forEach(function (b) {
        b.addEventListener('mouseover', function () { paintStars(parseInt(b.dataset.v, 10)); });
        b.addEventListener('mouseleave', function () { paintStars(picked); });
        b.addEventListener('click',     function () { picked = parseInt(b.dataset.v, 10); paintStars(picked); });
      });
    }

    // submit
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var nameEl = document.getElementById('rvName');
        var msgEl  = document.getElementById('rvMsg');
        var name = nameEl ? nameEl.value.trim() : '';
        var msg  = msgEl  ? msgEl.value.trim()  : '';
        if (!name)   { alert('Please enter your name.'); return; }
        if (!picked) { alert('Please select a star rating.'); return; }
        if (!msg)    { alert('Please write your review.'); return; }

        var sv = getSaved();
        sv.unshift({ name:name, role:'Verified Client', rating:picked, text:msg });
        setSaved(sv);
        all     = DEFAULT_REVIEWS.concat(sv);
        showing = Math.max(showing, DEFAULT_REVIEWS.length + 1);
        render();

        if (nameEl) nameEl.value = '';
        if (msgEl)  msgEl.value  = '';
        picked = 0;
        if (starSel) $$('.star-btn', starSel).forEach(function(b){ b.style.color='#d1d1cc'; b.classList.remove('lit'); });
        if (formWrap) formWrap.style.display = 'none';
        if (openBtn)  openBtn.textContent = 'Leave a Review';
        grid.scrollIntoView({ behavior:'smooth', block:'start' });
      });
    }
  }

  /* ============================================================
     LOAD MORE PROJECTS
     ============================================================ */
  function initMoreProjects() {
    var btn  = document.getElementById('loadMoreProjects');
    var more = document.getElementById('moreProjects');
    if (!btn || !more) return;

    var open = false;
    more.style.display = 'none';

    btn.addEventListener('click', function () {
      open = !open;
      more.style.display = open ? 'grid' : 'none';
      btn.textContent = open ? 'Show Less' : 'View More Projects';
      if (open) {
        // reveal cards inside
        $$('.reveal', more).forEach(function (el) {
          setTimeout(function () { el.classList.add('visible'); }, 80);
        });
        setTimeout(function () { more.scrollIntoView({ behavior:'smooth', block:'start' }); }, 60);
      }
    });
  }

  /* ============================================================
     PROJECT FILTER  (projects.html)
     ============================================================ */
  function initFilter() {
    var btns  = $$('.filter-btn');
    var cards = $$('.full-card[data-cat]');
    if (!btns.length || !cards.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.dataset.filter;
        cards.forEach(function (c) {
          var show = f === 'all' || c.dataset.cat === f;
          c.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ============================================================
     BOOKING FORM  —  validation + success state
     ============================================================ */
  function initBooking() {
    var form = document.getElementById('bookingForm');
    if (!form) return;

    var FIELDS = ['bName','bEmail','bPhone','bType','bBudget','bDesc'];

    function validate(id, val) {
      var errEl = document.getElementById(id + 'Err');
      var el    = document.getElementById(id);
      var msg   = '';
      if (!val.trim()) {
        msg = 'This field is required.';
      } else if (id === 'bEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = 'Please enter a valid email.';
      } else if (id === 'bPhone' && val.replace(/\D/g,'').length < 7) {
        msg = 'Please enter a valid phone number.';
      }
      if (errEl) errEl.textContent = msg;
      if (el)    el.style.borderColor = msg ? '#c0392b' : (val.trim() ? 'var(--red)' : '');
      return !msg;
    }

    FIELDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur',  function () { validate(id, this.value); });
      el.addEventListener('input', function () {
        var err = document.getElementById(id + 'Err');
        if (err && err.textContent) validate(id, this.value);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !validate(id, el.value)) ok = false;
      });
      if (!ok) return;

      var submitBtn = document.getElementById('submitBtn');
      var labelSpan = submitBtn && submitBtn.querySelector('.btn-label');
      var loaderDiv = submitBtn && submitBtn.querySelector('.loader-dots');

      if (submitBtn) submitBtn.disabled = true;
      if (labelSpan) labelSpan.style.display = 'none';
      if (loaderDiv) loaderDiv.style.display = 'flex';

      setTimeout(function () {
        // hide form fields
        $$('.form-group, .form-row-2', form).forEach(function (el) { el.style.display = 'none'; });
        var sub = form.querySelector('.sub');
        var h2  = form.querySelector('h2');
        if (sub) sub.style.display = 'none';
        if (h2)  h2.style.display  = 'none';
        if (submitBtn) submitBtn.style.display = 'none';
        // show success
        var ok = document.getElementById('formSuccess');
        if (ok) { ok.style.display = 'block'; ok.scrollIntoView({ behavior:'smooth', block:'center' }); }
      }, 1800);
    });
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLL
     ============================================================ */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 82, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    initNav();
    initBackTop();
    initHamburger();
    initSlider();
    initCounter();
    initReveal();
    initFAQ();
    initReviews();
    initMoreProjects();
    initFilter();
    initBooking();
    initAnchors();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();

})();