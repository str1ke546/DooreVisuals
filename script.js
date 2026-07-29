/**
 * Scroll reveals + soft parallax for DooreVisuals landing
 */
(function () {
  'use strict';

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

  // Soft mouse parallax on hero visual
  var hero = document.querySelector('.hero-visual');
  if (hero && window.matchMedia('(pointer:fine)').matches) {
    var frame = 0;
    document.querySelector('.hero').addEventListener('mousemove', function (e) {
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
})();
