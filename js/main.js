/**
 * EcoClean – Custom Vanilla JS (v3)
 * 1. Cursor bubble follower
 * 2. Sticky navbar + mobile hamburger menu (fixed)
 * 3. Services tabs
 * 4. Image slider (arrows + auto)
 * 5. Testimonials infinite ticker
 * 6. FAQ accordion
 * 7. Before/After image compare on HOVER (no click)
 * 8. Scroll fade-in (IntersectionObserver)
 * 9. Marquee text ticker
 * 10. Active nav highlight on scroll
 * 11. Floating bubble animations (circular path)
 */
(function () {
  'use strict';

  /* ===================== INJECT CSS ===================== */
  function injectCSS() {
    var id = 'eco-custom-style';
    if (document.getElementById(id)) return;
    var s = document.createElement('style');
    s.id = id;
    s.textContent = `
      /* ── Global Font ─────────────────────────────── */
      body, p, h1, h2, h3, h4, h5, h6, a, span, button, input, select, textarea { font-family: "Lexend", sans-serif; }
      *, *::before, *::after { box-sizing: border-box; }
      .fa, .fas, .far, .fab, [class*="fa-"], [class*="fa-"]::before { font-family: "Font Awesome 5 Free", "Font Awesome 5 Brands" !important; }

      /* ── Section image background fix (path changed) ─ */
      .section-image-background {
        background-image: linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)),
          url("assets/images/673f70bb6a5e2ad4fe5da897_view-professional-cleaning-service-person-holding-supplies (1) 1.webp") !important;
        background-size: cover !important;
        background-position: center !important;
        background-attachment: scroll !important;
      }

      /* ── Bubble float: circular path ─────────────── */
      @keyframes bubbleFloat1 {
        0%   { transform: translate(0,    0);    }
        25%  { transform: translate(60px, -50px); }
        50%  { transform: translate(120px,  0);   }
        75%  { transform: translate(60px,  50px); }
        100% { transform: translate(0,    0);    }
      }
      @keyframes bubbleFloat2 {
        0%   { transform: translate(0,    0);    }
        25%  { transform: translate(-60px, 50px); }
        50%  { transform: translate(-120px, 0);   }
        75%  { transform: translate(-60px,-50px); }
        100% { transform: translate(0,    0);    }
      }
      .bubble.small-blue-top { animation: bubbleFloat1 18s ease-in-out infinite; }
      .bubble.small-blue     { animation: bubbleFloat2 22s ease-in-out infinite; }
      .bubble.big            { animation: bubbleFloat1 28s ease-in-out infinite; }
      .bubble.small          { animation: bubbleFloat2 16s ease-in-out infinite; }

      /* ── Marquee ──────────────────────────────────── */
      @keyframes marqueeScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      /* ── Testimonials ticker ─────────────────────── */
      @keyframes tickerScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      .testimonials-ticker { overflow: hidden; }
      .testimonials-row {
        display: flex; gap: 24px;
        width: max-content;
        animation: tickerScroll 50s linear infinite;
      }
      .testimonials-row:nth-child(even) { animation-direction: reverse; }
      .testimonials-row:hover { animation-play-state: paused; }
      .testimonial-item { min-width: 380px !important; }

      /* ── Scroll fade-in ──────────────────────────── */
      .eco-fade {
        opacity: 0; transform: translateY(28px);
        transition: opacity .7s ease, transform .7s ease;
      }
      .eco-fade--in { opacity: 1 !important; transform: translateY(0) !important; }

      /* ── Navbar scrolled shadow ──────────────────── */
      .navbar--scrolled { box-shadow: 0 4px 32px rgba(0,0,0,.14) !important; }

      /* ── Mobile nav overlay ──────────────────────── */
      .nav-overlay.nav--open { display: block !important; }


      /* ── Cursor bubble ───────────────────────────── */
      .cursor-bubble {
        position: fixed !important;
        pointer-events: none;
        z-index: 9997;
        background: rgba(30, 80, 180, 0.55) !important;
        transition: width .25s ease, height .25s ease, opacity .25s ease, background .25s ease;
      }
      .cursor-bubble--hover {
        width: 70px !important; height: 70px !important;
        background: rgba(20, 60, 160, 0.75) !important;
      }

      /* ── Slider ─────────────────────────────────── */
      .w-slider { position: relative; overflow: hidden; }
      .w-slider-mask { display: flex !important; overflow: visible !important; width: 100% !important; }
      .w-slide { min-width: 100% !important; flex-shrink: 0 !important; transition: transform .5s ease; }

      /* ── Tabs ───────────────────────────────────── */
      .w-tab-pane { display: none; }
      .w-tab-pane.w--tab-active { display: block; }

      /* ── FAQ accordion ───────────────────────────── */
      .accordion-list { overflow: hidden; transition: max-height .4s ease; }
      .accordion--open .faq-btn-plus-vertical { transform: scaleY(0) !important; }

      /* ── Before/After compare (hover-driven) ─────── */
      .compare-component {
        position: relative !important;
        overflow: hidden !important;
        cursor: none !important;
        user-select: none;
      }
      .compare-before-wrapper {
        position: absolute !important;
        top: 0 !important; left: 0 !important;
        bottom: 0 !important;
        overflow: hidden !important;
        z-index: 2 !important;
        width: 50%;
      }
      .before-inner {
        position: absolute !important;
        top: 0 !important; left: 0 !important;
        height: 100% !important;
      }
      .compare-divider { display: none !important; }
      .compare-after-wrapper img, .before-inner img {
        width: 100%; height: 100%;
        object-fit: cover; display: block;
      }

      /* ── Consistent buttons & text ───────────────── */
      .primary-button, .primary-button-dark, .secondary-button,
      .button, input[type="submit"] {
        border-radius: 12px !important;
      }
      a, button { -webkit-tap-highlight-color: transparent; }

      /* ── FAQ left panel layout ────────────────────── */
      .faq-left-panel { display: flex; flex-direction: column; gap: 20px; }
      .faq-image-container { margin-top: 20px; }
      .faq-image-container img { width: 100%; border-radius: 16px; }
      .faq-button-animated {
        width: 100% !important; margin-top: 16px !important;
        text-align: center !important; justify-content: center !important;
        transition: transform .3s ease, box-shadow .3s ease;
      }
      .faq-button-animated:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,.12); }
    `;
    document.head.appendChild(s);
  }

  /* ===================== MOBILE NAV ===================== */
  function initNavbar() {
    var navbar    = document.querySelector('.navbar, .w-nav');
    var navMenu   = document.querySelector('.w-nav-menu, .nav-menu');
    var openBtn   = document.querySelector('.menu-button');
    var closeBtn  = document.querySelector('.close-menu-button');

    /* Create overlay */
    var overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    function openNav() {
      if (navMenu) navMenu.classList.add('nav--open');
      if (overlay) overlay.classList.add('nav--open');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      if (navMenu) navMenu.classList.remove('nav--open');
      if (overlay) overlay.classList.remove('nav--open');
      document.body.style.overflow = '';
    }

    window.toggleMobileMenu = function(e) {
      if (e && e.preventDefault) e.preventDefault();
      var navMenu = document.querySelector('.w-nav-menu, .nav-menu');
      var menuBtn = document.querySelector('.menu-button');
      var burgerImg = menuBtn ? menuBtn.querySelector('img') : null;
      if (navMenu) {
        var isOpen = navMenu.classList.contains('nav--open') || navMenu.classList.contains('open');
        if (isOpen) {
          navMenu.classList.remove('nav--open', 'open');
          if (burgerImg) burgerImg.src = 'assets/images/673da48c9a42551df1da8679_menu-btn.svg';
        } else {
          navMenu.classList.add('nav--open', 'open');
          if (burgerImg) burgerImg.src = 'assets/images/673da48c9a42551df1da867a_close-btn.svg';
        }
      }
    };

    if (openBtn && !openBtn.dataset.bound) {
      openBtn.dataset.bound = 'true';
      openBtn.addEventListener('click', function(e) {
        window.toggleMobileMenu(e);
      });
    }

    /* Close on nav link click */
    document.querySelectorAll('.nav-link, .w-nav-link').forEach(function (l) {
      l.addEventListener('click', function() {
        var navMenu = document.querySelector('.w-nav-menu, .nav-menu');
        var burgerImg = document.querySelector('.menu-button img');
        if (navMenu) {
          navMenu.classList.remove('nav--open', 'open');
        }
        if (burgerImg) {
          burgerImg.src = 'assets/images/673da48c9a42551df1da8679_menu-btn.svg';
        }
      });
    });

    /* Navbar scrolled shadow */
    if (navbar) {
      window.addEventListener('scroll', function () {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    /* Smooth scroll for all # links */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var h = this.getAttribute('href');
        if (!h || h === '#' || h.length < 2) return;
        var target = document.querySelector(h);
        if (!target) return;
        e.preventDefault();
        closeNav();
        var off = (navbar ? navbar.offsetHeight : 80) + 10;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
      });
    });
  }

  /* ===================== CURSOR BUBBLE ================== */
  function initCursorBubble() {
    var bubble = document.querySelector('.cursor-bubble');
    if (!bubble) return;
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var bx = mx, by = my;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function tick() {
      bx += (mx - bx) * 0.1;
      by += (my - by) * 0.1;
      bubble.style.left = (bx - bubble.offsetWidth / 2) + 'px';
      bubble.style.top  = (by - bubble.offsetHeight / 2) + 'px';
      requestAnimationFrame(tick);
    })();
    document.querySelectorAll('a, button, .w-tab-link, .accordion-toggle-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { bubble.classList.add('cursor-bubble--hover'); });
      el.addEventListener('mouseleave', function () { bubble.classList.remove('cursor-bubble--hover'); });
    });
  }

  /* ===================== TABS =========================== */
  function initTabs() {
    document.querySelectorAll('.w-tabs').forEach(function (wrap) {
      var links = wrap.querySelectorAll('.w-tab-link');
      var panes = wrap.querySelectorAll('.w-tab-pane');
      function activate(link) {
        var id = link.getAttribute('data-w-tab');
        links.forEach(function (l) { l.classList.remove('w--current'); });
        link.classList.add('w--current');
        panes.forEach(function (p) {
          var on = p.getAttribute('data-w-tab') === id;
          p.style.display = on ? 'block' : 'none';
          p.classList.toggle('w--tab-active', on);
        });
      }
      if (links.length) activate(links[0]);
      links.forEach(function (l) { l.addEventListener('click', function (e) { e.preventDefault(); activate(l); }); });
    });
  }

  /* ===================== SLIDER ========================= */
  function initSliders() {
    document.querySelectorAll('.w-slider').forEach(function (slider) {
      var mask   = slider.querySelector('.w-slider-mask');
      var slides = slider.querySelectorAll('.w-slide');
      var prev   = slider.querySelector('.w-slider-arrow-left');
      var next   = slider.querySelector('.w-slider-arrow-right');
      var total  = slides.length;
      var cur    = 0;
      if (!total || !mask) return;

      function goTo(idx) {
        cur = ((idx % total) + total) % total;
        mask.style.transform = 'translateX(-' + (cur * 100) + '%)';
      }
      goTo(0);
      if (prev) prev.addEventListener('click', function () { goTo(cur - 1); });
      if (next) next.addEventListener('click', function () { goTo(cur + 1); });
      var delay = parseInt(slider.getAttribute('data-delay'), 10) || 4000;
      setInterval(function () { goTo(cur + 1); }, delay);
    });
  }

  /* ===================== TESTIMONIALS =================== */
  function initTestimonials() {
    document.querySelectorAll('.testimonials-row').forEach(function (row) {
      var items = row.querySelectorAll('.testimonial-item');
      /* clone once for seamless loop */
      if (!row.dataset.cloned) {
        items.forEach(function (item) {
          var c = item.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          row.appendChild(c);
        });
        row.dataset.cloned = '1';
      }
    });
  }

  /* ===================== FAQ ============================ */
  function initFAQ() {
    var items = document.querySelectorAll('.accordion-item-element');
    items.forEach(function (item) {
      var toggle = item.querySelector('.accordion-toggle-item');
      var list   = item.querySelector('.accordion-list');
      if (!toggle || !list) return;
      list.style.maxHeight = '0';
      toggle.style.cursor  = 'pointer';
      toggle.addEventListener('click', function () {
        var open = item.classList.contains('accordion--open');
        items.forEach(function (o) {
          o.classList.remove('accordion--open');
          var ol = o.querySelector('.accordion-list');
          if (ol) ol.style.maxHeight = '0';
        });
        if (!open) {
          item.classList.add('accordion--open');
          list.style.maxHeight = list.scrollHeight + 'px';
        }
      });
    });
  }

  /* ===================== BEFORE/AFTER (HOVER) =========== */
  function initCompare() {
    var comp   = document.querySelector('.compare-component');
    if (!comp) return;

    var before = comp.querySelector('.compare-before-wrapper');
    var divider = comp.querySelector('.compare-divider');
    var inner  = comp.querySelector('.before-inner');
    if (!before || !divider) return;

    /* Move divider to component level */
    if (divider.parentNode !== comp) comp.appendChild(divider);

    /* Disable browser image drag */
    comp.querySelectorAll('img').forEach(function (img) { img.draggable = false; });

    function setPos(pct) {
      pct = Math.max(2, Math.min(98, pct));
      before.style.width   = pct + '%';
      divider.style.left   = pct + '%';
      if (inner) inner.style.width = comp.offsetWidth + 'px';
    }

    setPos(50);

    /* Hover-driven: just follow mouse, no drag needed */
    comp.addEventListener('mousemove', function (e) {
      var rect = comp.getBoundingClientRect();
      var pct  = ((e.clientX - rect.left) / rect.width) * 100;
      setPos(pct);
    });
    comp.addEventListener('mouseleave', function () { setPos(50); });

    /* Touch support */
    comp.addEventListener('touchmove', function (e) {
      e.preventDefault();
      var rect = comp.getBoundingClientRect();
      var pct  = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      setPos(pct);
    }, { passive: false });

    window.addEventListener('resize', function () {
      if (inner) inner.style.width = comp.offsetWidth + 'px';
    });
  }

  /* ===================== SCROLL FADE ==================== */
  function initScrollFade() {
    var selectors = [
      '.banner-title-wrap', '.feature-item', '.about-us-image-wrap',
      '.title-flex', '.pricing-item', '.title-left-wrap',
      '.big-text-block-wrap', '.section-subtitle-blue',
      '.contacts-form-wrapper', '.contact-us-images-wrap',
      '.faq-wrapper', '.compare-container'
    ];
    document.querySelectorAll(selectors.join(',')).forEach(function (el) {
      if (!el.closest('.navbar') && !el.closest('.w-nav')) el.classList.add('eco-fade');
    });
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.eco-fade').forEach(function (el) { el.classList.add('eco-fade--in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('eco-fade--in'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.eco-fade').forEach(function (el) { obs.observe(el); });
  }

  /* ===================== MARQUEE ======================== */
  function initMarquee() {
    document.querySelectorAll('.logo-overflow-hidden').forEach(function (wrap) {
      wrap.style.display  = 'flex';
      wrap.style.overflow = 'hidden';
      var wrappers = Array.from(wrap.querySelectorAll('.text-wrapper'));
      /* clone once for seamless */
      if (!wrap.dataset.cloned) {
        wrappers.forEach(function (tw) {
          var c = tw.cloneNode(true); c.setAttribute('aria-hidden', 'true'); wrap.appendChild(c);
        });
        wrap.dataset.cloned = '1';
        wrappers = Array.from(wrap.querySelectorAll('.text-wrapper'));
      }
      wrappers.forEach(function (tw) {
        tw.style.animation  = 'marqueeScroll 22s linear infinite';
        tw.style.flexShrink = '0';
        tw.style.display    = 'flex';
        tw.style.alignItems = 'center';
        tw.style.gap        = '24px';
        tw.style.whiteSpace = 'nowrap';
      });
    });
  }

  /* ===================== ACTIVE NAV ===================== */
  function initActiveNav() {
    var links   = document.querySelectorAll('.nav-link, .w-nav-link');
    if (!links.length) return;
    window.addEventListener('scroll', function () {
      var pos = window.scrollY + 100;
      var cur = '';
      document.querySelectorAll('[id]').forEach(function (s) { if (s.offsetTop <= pos) cur = s.id; });
      links.forEach(function (l) {
        l.classList.toggle('w--current', l.getAttribute('href') === '#' + cur);
      });
    }, { passive: true });
  }

  /* ===================== FORM =========================== */
  function initForm() {
    var form = document.getElementById('email-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var wrap = form.closest('.w-form');
      if (!wrap) return;
      var done = wrap.querySelector('.w-form-done');
      if (done) done.style.display = 'block';
      form.style.display = 'none';
    });
  }

  /* ===================== BOOT =========================== */
  function init() {
    injectCSS();
    initMarquee();
    initCursorBubble();
    initNavbar();
    initTabs();
    initSliders();
    initTestimonials();
    initFAQ();
    initCompare();
    initScrollFade();
    initActiveNav();
    initForm();

    /* Prevent empty href jumps */
    document.querySelectorAll("a[href='#'], a[href='']").forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
