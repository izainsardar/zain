// Two small enhancements. The page is complete without this file.
(function () {
  'use strict';

  // 1. Navigation turns translucent once the page has scrolled, and takes the
  //    light or dark treatment of whichever section is passing underneath it.
  var nav = document.querySelector('[data-nav]');
  if (nav) {
    var surfaces = Array.prototype.slice.call(document.querySelectorAll('[data-surface]'));
    var ticking = false;
    var update = function () {
      ticking = false;
      nav.classList.toggle('is-scrolled', window.scrollY > 4);
      var probe = nav.offsetHeight / 2;
      var light = false;
      for (var i = 0; i < surfaces.length; i++) {
        var r = surfaces[i].getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          light = surfaces[i].getAttribute('data-surface') === 'light';
          break;
        }
      }
      nav.classList.toggle('is-light', light);
      nav.classList.toggle('on-dark', !light);
    };
    var schedule = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  // 2. Fade and slight rise as sections enter. Skipped entirely under reduced motion.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });

  items.forEach(function (el) { observer.observe(el); });
  document.documentElement.classList.add('js-reveal');
})();
