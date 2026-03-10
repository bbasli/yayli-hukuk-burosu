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
