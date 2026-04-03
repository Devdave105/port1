/* =========================================
   DAVID AKPAN PORTFOLIO — script.js
   ========================================= */

(function () {

  /* === AOS === */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
    }
  }

  /* === NAVBAR SCROLL + BACK TO TOP === */
  function initNavbar() {
    var navbar    = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (navbar)    navbar.classList.toggle('scrolled', y > 40);
      if (backToTop) backToTop.classList.toggle('visible', y > 400);
    }, { passive: true });

    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* === HAMBURGER === */
  function initHamburger() {
    var hamburger = document.getElementById('hamburger');
    var navLinks  = document.getElementById('navLinks');
    var overlay   = document.getElementById('mobileOverlay');
    if (!hamburger || !navLinks) return;

    function openNav() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('open');
      if (overlay) overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });
    if (overlay) overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
    navLinks.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
  }

  /* === HERO SLIDER === */
  function initSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots   = document.querySelectorAll('.slider-dot');
    if (!slides.length) return;

    var current = 0;
    var timer   = null;

    function goTo(n) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = ((n % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function play() { timer = setInterval(function () { goTo(current + 1); }, 5500); }
    function reset() { clearInterval(timer); play(); }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.getAttribute('data-index'), 10));
        reset();
      });
    });

    play();
  }

  /* === STATS COUNTER === */
  function initCounter() {
    var els  = document.querySelectorAll('.stat-number[data-target]');
    var done = false;
    if (!els.length) return;

    function run() {
      if (done) return;
      var bar = document.querySelector('.stats-bar');
      if (!bar || bar.getBoundingClientRect().top > window.innerHeight - 80) return;
      done = true;
      els.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-target'), 10);
        var t0 = performance.now(), dur = 1800;
        (function tick(now) {
          var p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
        })(t0);
      });
    }

    window.addEventListener('scroll', run, { passive: true });
    run();
  }

  /* === FAQ ACCORDION === */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn    = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      var icon   = item.querySelector('.faq-icon');
      if (!btn || !answer) return;

      /* start hidden */
      answer.style.display = 'none';

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        /* close all */
        items.forEach(function (i) {
          i.classList.remove('open');
          var a = i.querySelector('.faq-answer');
          var ic = i.querySelector('.faq-icon');
          if (a)  a.style.display = 'none';
          if (ic) ic.textContent  = '+';
        });

        /* open this one */
        if (!isOpen) {
          item.classList.add('open');
          answer.style.display = 'block';
          if (icon) icon.textContent = '×';
        }
      });
    });
  }

  /* === REVIEWS === */
  var DEFAULTS = [
    { name:'Emeka Okafor',  role:'CEO, Okafor Ventures',   rating:5, text:'David delivered a stunning business website that exceeded all expectations. Our online enquiries doubled within the first month.' },
    { name:'Amara Nwosu',   role:'Founder, StyleByAmara',  rating:5, text:'Working with David was seamless from start to finish. He understood exactly what our brand needed — professional, fast, and highly skilled.' },
    { name:'Chukwudi Eze',  role:'Director, EzeLogistics', rating:5, text:'Our new website has completely transformed how clients perceive us. The site loads fast, looks professional, and converts visitors effectively.' },
    { name:'Ngozi Adeyemi', role:'Brand Consultant',       rating:5, text:'David stands out above other developers. He thinks about user experience and business goals throughout the entire process.' },
    { name:'Tunde Bakare',  role:'MD, Bakare Properties',  rating:5, text:'Absolutely impressed with the final product. Clean, modern, works perfectly on all devices, and delivered right on time.' }
  ];

  function savedReviews() {
    try { return JSON.parse(localStorage.getItem('da_reviews') || '[]'); } catch (e) { return []; }
  }
  function persistReviews(arr) {
    try { localStorage.setItem('da_reviews', JSON.stringify(arr)); } catch (e) {}
  }
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function starHtml(n) {
    var h = '';
    for (var i = 0; i < 5; i++)
      h += '<span style="color:' + (i < n ? '#f59e0b' : '#d1d1cc') + '">&#9733;</span>';
    return h;
  }
  function makeCard(r) {
    var d = document.createElement('div');
    d.className = 'review-card';
    d.innerHTML =
      '<div class="review-header">' +
        '<div class="review-avatar">' + esc(r.name).slice(0,2).toUpperCase() + '</div>' +
        '<div class="review-meta"><strong>' + esc(r.name) + '</strong><span>' + esc(r.role || 'Verified Client') + '</span></div>' +
      '</div>' +
      '<div class="review-stars">' + starHtml(r.rating) + '</div>' +
      '<p class="review-text">' + esc(r.text) + '</p>';
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

    var all      = DEFAULTS.concat(savedReviews());
    var showing  = 3;
    var pickedStar = 0;

    /* --- render grid --- */
    function render() {
      grid.innerHTML = '';
      all.slice(0, showing).forEach(function (r) { grid.appendChild(makeCard(r)); });
      if (loadBtn) loadBtn.style.display = showing >= all.length ? 'none' : 'inline-flex';
    }
    render();

    /* load more */
    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        showing += 3;
        render();
      });
    }

    /* toggle review form */
    if (openBtn && formWrap) {
      formWrap.style.display = 'none';
      openBtn.addEventListener('click', function () {
        var visible = formWrap.style.display === 'none' || formWrap.style.display === '';
        formWrap.style.display = visible ? 'block' : 'none';
        openBtn.textContent = visible ? 'Close Form' : 'Leave a Review';
        if (visible) setTimeout(function(){ formWrap.scrollIntoView({ behavior:'smooth', block:'start' }); }, 50);
      });
    }

    /* star selector */
    if (starSel) {
      var starBtns = starSel.querySelectorAll('.star');
      function paintStars(n) {
        starBtns.forEach(function (b, i) {
          b.style.color = i < n ? '#f59e0b' : '#d1d1cc';
        });
      }
      starBtns.forEach(function (b) {
        b.addEventListener('mouseover', function () { paintStars(parseInt(b.getAttribute('data-value'),10)); });
        b.addEventListener('mouseleave', function () { paintStars(pickedStar); });
        b.addEventListener('click',     function () { pickedStar = parseInt(b.getAttribute('data-value'),10); paintStars(pickedStar); });
      });
    }

    /* submit */
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var nameEl = document.getElementById('reviewName');
        var msgEl  = document.getElementById('reviewMessage');
        var name   = nameEl ? nameEl.value.trim() : '';
        var msg    = msgEl  ? msgEl.value.trim()  : '';

        if (!name)       { alert('Please enter your name.'); return; }
        if (!pickedStar) { alert('Please select a star rating.'); return; }
        if (!msg)        { alert('Please write your review.'); return; }

        var nr = { name:name, role:'Verified Client', rating:pickedStar, text:msg };
        var sv = savedReviews();
        sv.unshift(nr);
        persistReviews(sv);

        all     = DEFAULTS.concat(sv);
        showing = Math.max(showing, DEFAULTS.length + 1);
        render();

        if (nameEl) nameEl.value = '';
        if (msgEl)  msgEl.value  = '';
        pickedStar = 0;
        if (starSel) starSel.querySelectorAll('.star').forEach(function(b){ b.style.color='#d1d1cc'; });
        if (formWrap) formWrap.style.display = 'none';
        if (openBtn)  openBtn.textContent = 'Leave a Review';
        grid.scrollIntoView({ behavior:'smooth', block:'start' });
      });
    }
  }

  /* === LOAD MORE PROJECTS === */
  function initProjectToggle() {
    var btn  = document.getElementById('loadMoreProjects');
    var more = document.getElementById('projectsMore');
    if (!btn || !more) return;

    var isOpen = false;
    more.style.display = 'none';

    btn.addEventListener('click', function () {
      isOpen = !isOpen;
      if (isOpen) {
        more.style.display       = 'grid';
        more.style.gridTemplateColumns = 'repeat(3,1fr)';
        more.style.gap           = '28px';
        more.style.marginTop     = '28px';
        btn.textContent          = 'Show Less';
        setTimeout(function(){ more.scrollIntoView({ behavior:'smooth', block:'start' }); }, 50);
      } else {
        more.style.display = 'none';
        btn.textContent    = 'View More Projects';
      }
    });
  }

  /* === PROJECT FILTER (projects.html) === */
  function initFilter() {
    var btns  = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.project-full-card');
    if (!btns.length || !cards.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        cards.forEach(function (c) {
          c.style.display = (f === 'all' || c.getAttribute('data-category') === f) ? '' : 'none';
        });
      });
    });
  }

  /* === BOOKING FORM === */
  function initBooking() {
    var form = document.getElementById('bookingForm');
    if (!form) return;

    var FIELDS = ['fullName','email','phone','projectType','budget','projectDesc'];

    function validate(id, val) {
      var errEl = document.getElementById(id + 'Error');
      var el    = document.getElementById(id);
      var msg   = '';
      if (!val.trim()) {
        msg = 'This field is required.';
      } else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = 'Please enter a valid email address.';
      } else if (id === 'phone' && val.replace(/\D/g,'').length < 7) {
        msg = 'Please enter a valid phone number.';
      }
      if (errEl) errEl.textContent = msg;
      if (el)    el.style.borderColor = msg ? '#d32f2f' : (val.trim() ? 'var(--primary)' : '');
      return !msg;
    }

    FIELDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur',  function () { validate(id, this.value); });
      el.addEventListener('input', function () {
        var err = document.getElementById(id+'Error');
        if (err && err.textContent) validate(id, this.value);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allOk = true;
      FIELDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !validate(id, el.value)) allOk = false;
      });
      if (!allOk) return;

      var submitBtn = document.getElementById('submitBtn');
      var txtSpan   = submitBtn && submitBtn.querySelector('.btn-text');
      var ldrSpan   = submitBtn && submitBtn.querySelector('.btn-loader');

      if (submitBtn) submitBtn.disabled = true;
      if (txtSpan)   txtSpan.style.display   = 'none';
      if (ldrSpan)   ldrSpan.style.display   = 'inline-flex';

      setTimeout(function () {
        form.querySelectorAll('.form-group, .form-row').forEach(function (el) { el.style.display = 'none'; });
        var sub = form.querySelector('.form-subtitle');
        var h2  = form.querySelector('h2');
        if (sub) sub.style.display = 'none';
        if (h2)  h2.style.display  = 'none';
        if (submitBtn) submitBtn.style.display = 'none';

        var success = document.getElementById('formSuccess');
        if (success) {
          success.style.display = 'block';
          success.scrollIntoView({ behavior:'smooth', block:'center' });
        }
      }, 1800);
    });
  }

  /* === SMOOTH ANCHOR SCROLL === */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href   = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* === BOOT === */
  function boot() {
    initAOS();
    initNavbar();
    initHamburger();
    initSlider();
    initCounter();
    initFAQ();
    initReviews();
    initProjectToggle();
    initFilter();
    initBooking();
    initAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();