/* ============================================
   YAYLI HUKUK - Main JavaScript
   Minimal, no dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Mobile Menu --- */
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navOverlay = document.querySelector('.nav-overlay');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Mobile dropdown toggle
    nav.querySelectorAll('.nav__item').forEach(function (item) {
      const link = item.querySelector('.nav__link');
      const dropdown = item.querySelector('.nav__dropdown');
      if (dropdown && link) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            item.classList.toggle('dropdown-open');
          }
        });
      }
    });
  }

  /* --- Header Scroll Shadow --- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all others in the same list
      item.closest('.faq__list').querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- Scroll Animations --- */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --- Form Handling --- */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Gönderiliyor...';
      btn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      setTimeout(function () {
        btn.textContent = 'Gönderildi!';
        btn.style.background = '#2d6a4f';
        btn.style.color = '#fff';
        form.reset();

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      }, 1000);
    });
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = header ? header.offsetHeight + 20 : 80;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        if (nav && nav.classList.contains('open')) {
          menuToggle.classList.remove('active');
          nav.classList.remove('open');
          if (navOverlay) navOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  /* --- Reviews Slider --- */
  (function () {
    var track = document.getElementById('reviewsTrack');
    var dotsContainer = document.getElementById('reviewsDots');
    var prevBtn = document.getElementById('reviewsPrev');
    var nextBtn = document.getElementById('reviewsNext');
    if (!track) return;

    var slides = track.querySelectorAll('.reviews-slide');
    var total = slides.length;
    var current = 0;
    var autoTimer;

    function getSlidesPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.ceil(total / getSlidesPerView());
    }

    function buildDots() {
      while (dotsContainer.firstChild) dotsContainer.removeChild(dotsContainer.firstChild);
      var pages = getTotalPages();
      for (var i = 0; i < pages; i++) {
        var btn = document.createElement('button');
        btn.className = 'reviews-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', (i + 1) + '. sayfaya git');
        btn.dataset.index = i;
        btn.addEventListener('click', function () {
          goTo(parseInt(this.dataset.index));
        });
        dotsContainer.appendChild(btn);
      }
    }

    function updateDots() {
      var page = Math.floor(current / getSlidesPerView());
      dotsContainer.querySelectorAll('.reviews-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === page);
      });
    }

    function goTo(page) {
      var spv = getSlidesPerView();
      current = page * spv;
      if (current >= total) current = 0;
      var slideWidth = slides[0].offsetWidth;
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      track.style.transform = 'translateX(-' + current * (slideWidth + gap) + 'px)';
      updateDots();
    }

    function next() {
      var spv = getSlidesPerView();
      var page = Math.floor(current / spv);
      var totalPages = getTotalPages();
      goTo((page + 1) % totalPages);
    }

    function prev() {
      var spv = getSlidesPerView();
      var page = Math.floor(current / spv);
      var totalPages = getTotalPages();
      goTo((page - 1 + totalPages) % totalPages);
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    }

    buildDots();
    startAuto();

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAuto(); });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        current = 0;
        track.style.transform = 'translateX(0)';
        buildDots();
      }, 200);
    }, { passive: true });

    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next(); else prev();
        startAuto();
      }
    }, { passive: true });
  }());

  /* --- Phone number click tracking (GA4) --- */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_call', {
          event_category: 'contact',
          event_label: link.getAttribute('href')
        });
      }
    });
  });

});
