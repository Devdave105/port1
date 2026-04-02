/* =========================================
   DAVID AKPAN PORTFOLIO — script.js
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* === AOS INIT === */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* === NAVBAR SCROLL === */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* === BACK TO TOP === */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* === HAMBURGER MENU === */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    mobileOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  /* === HERO SLIDER === */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let sliderInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    sliderInterval = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 5500);
  }

  function resetSlider() {
    clearInterval(sliderInterval);
    startSlider();
  }

  if (slides.length > 0) {
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-index'));
        goToSlide(idx);
        resetSlider();
      });
    });
    startSlider();
  }

  /* === STATS COUNTER === */
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  function countUp() {
    if (counted) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      counted = true;
      statNumbers.forEach(function (el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', countUp, { passive: true });
  countUp();

  /* === FAQ ACCORDION === */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        // Close all
        faqItems.forEach(function (i) {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.classList.remove('visible');
        });
        // Open clicked
        if (!isOpen) {
          item.classList.add('open');
          answer.classList.add('visible');
        }
      });
    }
  });

  /* === REVIEWS: DEFAULT DATA === */
  const defaultReviews = [
    {
      name: 'Ruben Okafor',
      role: 'CEO, Okafor Ventures',
      rating: 5,
      text: 'David delivered a stunning business website that exceeded all our expectations. The quality of work and attention to detail is exceptional. Our online enquiries doubled within the first month.',
      initials: 'RO'
    },
    {
      name: 'Ime Paul',
      role: 'Founder, StyleByAmara',
      rating: 5,
      text: 'Working with David was seamless from start to finish. He understood exactly what our brand needed and delivered a website that truly represents us. Professional, fast, and highly skilled.',
      initials: 'IP'
    },
    {
      name: 'Chukwudi Eze',
      role: 'Director, EzeLogistics',
      rating: 5,
      text: 'Our new website has completely transformed how clients perceive our business. David\'s work is premium quality. The site loads fast, looks professional, and converts visitors effectively.',
      initials: 'CE'
    },
    {
      name: 'Ngozi Adeyemi',
      role: 'Brand Consultant',
      rating: 5,
      text: 'I have worked with several developers before, but David stands out. He goes beyond just building a site — he thinks about the user experience and business goals throughout the process.',
      initials: 'NA'
    },
    {
      name: 'Imoowo Mbom',
      role: 'MD, Bakare Properties',
      rating: 5,
      text: 'Absolutely impressed with the final product. The website is clean, modern, and works perfectly on all devices. David communicated well throughout and delivered on time.',
      initials: 'IM'
    }
  ];

  /* === REVIEWS: LOAD FROM LOCALSTORAGE + DEFAULTS === */
  function getStoredReviews() {
    try {
      const stored = localStorage.getItem('da_reviews');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveReviews(reviews) {
    try {
      localStorage.setItem('da_reviews', JSON.stringify(reviews));
    } catch (e) {}
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, function (_, i) {
      return '<span style="color:' + (i < rating ? '#f59e0b' : '#d1d1cc') + '">&#9733;</span>';
    }).join('');
  }

  function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-header">
        <div class="review-avatar">${review.initials || review.name.slice(0, 2).toUpperCase()}</div>
        <div class="review-meta">
          <strong>${escapeHtml(review.name)}</strong>
          <span>${escapeHtml(review.role || 'Verified Client')}</span>
        </div>
      </div>
      <div class="review-stars">${renderStars(review.rating)}</div>
      <p class="review-text">${escapeHtml(review.text)}</p>
    `;
    return card;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  const reviewsGrid = document.getElementById('reviewsGrid');
  const loadMoreReviewsBtn = document.getElementById('loadMoreReviews');

  if (reviewsGrid) {
    let allReviews = [...defaultReviews, ...getStoredReviews()];
    let visibleCount = 3;

    function renderReviews() {
      reviewsGrid.innerHTML = '';
      const toShow = allReviews.slice(0, visibleCount);
      toShow.forEach(function (review) {
        reviewsGrid.appendChild(createReviewCard(review));
      });
      if (loadMoreReviewsBtn) {
        loadMoreReviewsBtn.style.display = visibleCount >= allReviews.length ? 'none' : '';
      }
    }

    renderReviews();

    if (loadMoreReviewsBtn) {
      loadMoreReviewsBtn.addEventListener('click', function () {
        visibleCount += 3;
        renderReviews();
        if (typeof AOS !== 'undefined') AOS.refreshHard();
      });
    }

    /* === ADD REVIEW FORM === */
    const openReviewFormBtn = document.getElementById('openReviewForm');
    const reviewFormWrap = document.getElementById('reviewFormWrap');

    if (openReviewFormBtn && reviewFormWrap) {
      openReviewFormBtn.addEventListener('click', function () {
        const isVisible = reviewFormWrap.classList.toggle('visible');
        openReviewFormBtn.textContent = isVisible ? 'Close Form' : 'Leave a Review';
        if (isVisible) {
          reviewFormWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    /* STAR RATING */
    const starSelector = document.getElementById('starSelector');
    let selectedRating = 0;

    if (starSelector) {
      const stars = starSelector.querySelectorAll('.star');
      stars.forEach(function (star) {
        star.addEventListener('mouseover', function () {
          const val = parseInt(this.getAttribute('data-value'));
          stars.forEach(function (s, i) {
            s.classList.toggle('active', i < val);
          });
        });
        star.addEventListener('mouseleave', function () {
          stars.forEach(function (s, i) {
            s.classList.toggle('active', i < selectedRating);
          });
        });
        star.addEventListener('click', function () {
          selectedRating = parseInt(this.getAttribute('data-value'));
          stars.forEach(function (s, i) {
            s.classList.toggle('active', i < selectedRating);
          });
        });
      });
    }

    /* SUBMIT REVIEW */
    const submitReviewBtn = document.getElementById('submitReview');
    if (submitReviewBtn) {
      submitReviewBtn.addEventListener('click', function () {
        const name = document.getElementById('reviewName').value.trim();
        const message = document.getElementById('reviewMessage').value.trim();

        if (!name) { alert('Please enter your name.'); return; }
        if (!selectedRating) { alert('Please select a star rating.'); return; }
        if (!message) { alert('Please write your review.'); return; }

        const newReview = {
          name: name,
          role: 'Verified Client',
          rating: selectedRating,
          text: message,
          initials: name.slice(0, 2).toUpperCase()
        };

        const stored = getStoredReviews();
        stored.unshift(newReview);
        saveReviews(stored);

        allReviews = [...defaultReviews, ...stored];
        visibleCount = Math.max(visibleCount, allReviews.indexOf(newReview) + 1);
        renderReviews();

        document.getElementById('reviewName').value = '';
        document.getElementById('reviewMessage').value = '';
        selectedRating = 0;
        if (starSelector) {
          starSelector.querySelectorAll('.star').forEach(function (s) { s.classList.remove('active'); });
        }

        if (reviewFormWrap) reviewFormWrap.classList.remove('visible');
        if (openReviewFormBtn) openReviewFormBtn.textContent = 'Leave a Review';

        reviewsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* === LOAD MORE PROJECTS === */
  const loadMoreProjectsBtn = document.getElementById('loadMoreProjects');
  const projectsMore = document.getElementById('projectsMore');
  if (loadMoreProjectsBtn && projectsMore) {
    loadMoreProjectsBtn.addEventListener('click', function () {
      if (projectsMore.style.display === 'none' || !projectsMore.style.display) {
        projectsMore.style.display = 'grid';
        projectsMore.style.gridTemplateColumns = 'repeat(3, 1fr)';
        projectsMore.style.gap = '28px';
        projectsMore.style.marginTop = '28px';
        loadMoreProjectsBtn.textContent = 'Show Less';
        if (typeof AOS !== 'undefined') AOS.refreshHard();
      } else {
        projectsMore.style.display = 'none';
        loadMoreProjectsBtn.textContent = 'View More Projects';
      }
    });
  }

  /* === PROJECTS PAGE FILTER === */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-full-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        projectCards.forEach(function (card) {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
            card.style.display = '';
          } else {
            card.classList.add('hidden');
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* === BOOKING FORM VALIDATION === */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const fields = ['fullName', 'email', 'phone', 'projectType', 'budget', 'projectDesc'];

    function validateField(id, value) {
      const errorEl = document.getElementById(id + 'Error');
      if (!errorEl) return true;
      let msg = '';

      if (!value.trim()) {
        msg = 'This field is required.';
      } else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg = 'Please enter a valid email address.';
      } else if (id === 'phone' && value.trim().length < 8) {
        msg = 'Please enter a valid phone number.';
      }

      errorEl.textContent = msg;
      const input = document.getElementById(id);
      if (input) {
        input.style.borderColor = msg ? '#d32f2f' : (value ? 'var(--primary)' : '');
      }
      return !msg;
    }

    fields.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur', function () { validateField(id, this.value); });
        el.addEventListener('input', function () {
          const errorEl = document.getElementById(id + 'Error');
          if (errorEl && errorEl.textContent) validateField(id, this.value);
        });
      }
    });

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      fields.forEach(function (id) {
        const el = document.getElementById(id);
        if (el && !validateField(id, el.value)) valid = false;
      });

      if (!valid) return;

      const submitBtn = document.getElementById('submitBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'inline-flex';

      // Simulate async submission
      setTimeout(function () {
        submitBtn.style.display = 'none';
        fields.forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.closest('.form-group').style.display = 'none';
        });
        // Also hide rows
        bookingForm.querySelectorAll('.form-row').forEach(function (r) { r.style.display = 'none'; });
        bookingForm.querySelector('.form-subtitle').style.display = 'none';

        const successEl = document.getElementById('formSuccess');
        if (successEl) {
          successEl.classList.add('visible');
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1800);
    });
  }

  /* === SMOOTH SCROLL FOR ANCHOR LINKS === */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72');
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
        closeMenu && closeMenu();
      }
    });
  });

});