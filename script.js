/**
 * DooreVisuals landing — reveals, mobile detect, view toggle, burger
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'dv-view';
  var MQ = '(max-width: 860px)';

  function prefersNarrow() {
    return window.matchMedia(MQ).matches;
  }

  function uaLooksMobile() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  }

  function getPref() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'auto';
    } catch (e) {
      return 'auto';
    }
  }

  function setPref(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function shouldUseMobile(pref) {
    if (pref === 'mobile') return true;
    if (pref === 'desktop') return false;
    return prefersNarrow() || uaLooksMobile();
  }

  function applyView() {
    var pref = getPref();
    var mobile = shouldUseMobile(pref);
    document.documentElement.classList.toggle('mobile-ui', mobile);
    document.documentElement.classList.toggle('mobile-preview', mobile && pref === 'mobile' && !prefersNarrow());
    document.documentElement.dataset.viewPref = pref;

    var label = document.querySelector('.view-switch-label');
    if (label) {
      var text = 'Вид: Авто';
      if (pref === 'mobile') text = 'Вид: Телефон';
      if (pref === 'desktop') text = 'Вид: ПК';
      label.textContent = text;
    }

    closeMenu();
  }

  function cycleView() {
    var order = ['auto', 'mobile', 'desktop'];
    var pref = getPref();
    var next = order[(order.indexOf(pref) + 1) % order.length];
    setPref(next);
    applyView();
  }

  /* Burger menu */
  var menuBtn = document.getElementById('menu-btn');
  var navLinks = document.getElementById('nav-links');
  var backdrop = document.getElementById('nav-backdrop');

  function closeMenu() {
    if (!navLinks || !menuBtn) return;
    navLinks.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (backdrop) {
      backdrop.hidden = true;
    }
  }

  function toggleMenu() {
    if (!navLinks || !menuBtn) return;
    var open = !navLinks.classList.contains('is-open');
    navLinks.classList.toggle('is-open', open);
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (backdrop) backdrop.hidden = !open;
  }

  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  var viewToggle = document.getElementById('view-toggle');
  if (viewToggle) viewToggle.addEventListener('click', cycleView);

  window.matchMedia(MQ).addEventListener('change', function () {
    if (getPref() === 'auto') applyView();
  });

  applyView();

  /* Scroll reveals */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* Soft mouse parallax — desktop only */
  var hero = document.querySelector('.hero-visual');
  if (hero && window.matchMedia('(pointer:fine)').matches) {
    var frame = 0;
    var heroRoot = document.querySelector('.hero');
    if (heroRoot) {
      heroRoot.addEventListener('mousemove', function (e) {
        if (document.documentElement.classList.contains('mobile-ui')) return;
        if (frame) return;
        frame = requestAnimationFrame(function () {
          var rect = hero.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          hero.style.transform =
            'translateY(' + (-8 + y * -6) + 'px) rotateX(' + (y * -3) + 'deg) rotateY(' + (x * 4) + 'deg)';
          frame = 0;
        });
      });
    }
  }
})();
