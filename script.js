/* ===================================================
   DAVID AKPAN — PORTFOLIO SITE  |  script.js
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- HAMBURGER ---- */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  /* ---- NAVBAR SCROLL ---- */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (navbar) {
      navbar.style.background = window.scrollY > 40
        ? 'rgba(10,13,19,0.97)'
        : 'rgba(12,16,24,0.88)';
    }
  });

  /* ---- ACTIVE NAV LINK ---- */
  var sections   = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');
  function highlightNav() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (sec) {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav);

  /* ---- BACK TO TOP ---- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- WHY — VIEW MORE / SEE LESS ---- */
  var whyToggle  = document.getElementById('whyToggle');
  var extraWhy   = document.querySelectorAll('.why-card.extra');
  var whyOpen    = false;
  if (whyToggle && extraWhy.length) {
    whyToggle.addEventListener('click', function () {
      whyOpen = !whyOpen;
      extraWhy.forEach(function (c, i) {
        if (whyOpen) {
          c.classList.remove('hidden');
          c.style.animation = 'none';
          c.offsetHeight;
          c.style.animation = 'fadeInUp 0.4s ease ' + (i * 0.07) + 's both';
        } else {
          c.classList.add('hidden');
        }
      });
      whyToggle.textContent = whyOpen ? 'See Less' : 'View More';
    });
  }

  /* ---- PORTFOLIO — VIEW MORE / SEE LESS ---- */
  var portToggle = document.getElementById('portfolioToggle');
  var extraPort  = document.querySelectorAll('.portfolio-card.port-extra');
  var portOpen   = false;
  if (portToggle && extraPort.length) {
    portToggle.addEventListener('click', function () {
      portOpen = !portOpen;
      extraPort.forEach(function (c, i) {
        if (portOpen) {
          c.classList.remove('hidden');
          c.style.animation = 'none';
          c.offsetHeight;
          c.style.animation = 'fadeInUp 0.4s ease ' + (i * 0.08) + 's both';
        } else {
          c.classList.add('hidden');
        }
      });
      portToggle.textContent = portOpen ? 'See Less' : 'View More Projects';
    });
  }

  /* ---- TESTIMONIALS SLIDER ---- */
  var track    = document.getElementById('testiTrack');
  var prevBtn  = document.getElementById('testiPrev');
  var nextBtn  = document.getElementById('testiNext');
  var dotsWrap = document.getElementById('testiDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    var cards   = Array.from(track.querySelectorAll('.testimonial-card'));
    var total   = cards.length;
    var current = 0;
    var perView = 3;
    var autoTimer;

    function getPerView() {
      if (window.innerWidth >= 900) return 3;
      if (window.innerWidth >= 600) return 2;
      return 1;
    }

    function maxIndex() { return Math.max(0, total - perView); }

    function getCardWidth() {
      if (!cards[0]) return 0;
      var gap = 20;
      var vp  = track.parentElement.offsetWidth;
      return (vp - gap * (perView - 1)) / perView + gap;
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      var pages = Math.ceil(total / perView);
      for (var i = 0; i < pages; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 'testi-dot';
          dot.setAttribute('aria-label', 'Page ' + (idx + 1));
          dot.addEventListener('click', function () { goTo(idx * perView); });
          dotsWrap.appendChild(dot);
        })(i);
      }
      updateDots();
    }

    function updateDots() {
      var dots = dotsWrap.querySelectorAll('.testi-dot');
      var page = Math.floor(current / perView);
      dots.forEach(function (d, i) { d.classList.toggle('active', i === page); });
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIndex()));
      track.style.transform = 'translateX(-' + (current * getCardWidth()) + 'px)';
      updateDots();
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        var next = current + perView;
        goTo(next >= total ? 0 : next);
      }, 4600);
    }

    prevBtn.addEventListener('click', function () { goTo(current - perView); startAuto(); });
    nextBtn.addEventListener('click', function () { goTo(current + perView >= total ? 0 : current + perView); startAuto(); });

    track.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    track.addEventListener('mouseleave', startAuto);

    /* Touch swipe */
    var touchX = 0;
    track.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + perView) : goTo(current - perView); startAuto(); }
    });

    function init() {
      perView = getPerView();
      /* set card flex widths via inline style */
      var gap = 20;
      var vp  = track.parentElement.offsetWidth;
      var cw  = (vp - gap * (perView - 1)) / perView;
      cards.forEach(function (c) { c.style.flex = '0 0 ' + cw + 'px'; });
      current = 0;
      track.style.transform = 'translateX(0)';
      buildDots();
      startAuto();
    }

    window.addEventListener('resize', function () {
      clearInterval(autoTimer);
      init();
    });
    init();
  }

  /* ---- CONTACT FORM ---- */
  var submitBtn   = document.getElementById('submitBtn');
  var formSuccess = document.getElementById('formSuccess');

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      var name  = (document.getElementById('cname')    || {}).value || '';
      var email = (document.getElementById('cemail')   || {}).value || '';
      var msg   = (document.getElementById('cmessage') || {}).value || '';

      if (!name.trim() || !email.trim() || !msg.trim()) {
        submitBtn.style.animation = 'none';
        submitBtn.offsetHeight;
        submitBtn.style.animation = 'shake 0.4s ease';
        setTimeout(function () { submitBtn.style.animation = ''; }, 450);
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      setTimeout(function () {
        submitBtn.textContent = 'Send Message \u2192';
        submitBtn.disabled = false;
        ['cname','cemail','cphone','cmessage'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
        if (formSuccess) {
          formSuccess.classList.remove('hidden');
          setTimeout(function () { formSuccess.classList.add('hidden'); }, 5000);
        }
      }, 1400);
    });
  }

  /* ---- SCROLL REVEAL ---- */
  var revealEls = document.querySelectorAll(
    '.service-card, .why-card:not(.extra), .portfolio-card:not(.port-extra), .testimonial-card, .about-img-col, .about-text, .contact-form-wrap, .contact-text, .footer-brand-col, .footer-col'
  );
  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

});