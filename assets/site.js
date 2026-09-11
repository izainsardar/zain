(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navigation: solid bar once the page moves
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile drawer
  var drawer = document.getElementById('drawer');
  var toggle = document.getElementById('navToggle');
  function setDrawer(open) {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setDrawer(true); });
  document.getElementById('drawerClose').addEventListener('click', function () { setDrawer(false); });
  drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });

  window.__mzReady = true;

  // The opening screen never waits on the scroll observer
  document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('is-in'); });

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal:not(.is-in)');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Guilloche: engraved rosettes, the pattern of banknotes and watch dials
  var PATTERNS = {
    hero:  { color: '195,165,112', alpha: 0.26, bands: [
      { R: 0.26, A: 0.030, k: 16, n: 20 },
      { R: 0.37, A: 0.028, k: 24, n: 18, B: 0.012, m: 6 },
      { R: 0.47, A: 0.010, k: 60, n: 8 }
    ] },
    maxim: { color: '220,197,150', alpha: 0.30, bands: [
      { R: 0.30, A: 0.040, k: 14, n: 24 },
      { R: 0.44, A: 0.020, k: 30, n: 14, B: 0.010, m: 4 }
    ] },
    card:  { color: '195,165,112', alpha: 0.34, bands: [
      { R: 0.28, A: 0.045, k: 12, n: 16 },
      { R: 0.42, A: 0.024, k: 22, n: 12 }
    ] }
  };
  function drawGuilloche(canvas) {
    var p = PATTERNS[canvas.getAttribute('data-guilloche')];
    var size = canvas.getBoundingClientRect().width;
    if (!p || !size) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(size * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = 'rgba(' + p.color + ',' + p.alpha + ')';
    var c = size / 2, steps = 720;
    p.bands.forEach(function (b) {
      for (var i = 0; i < b.n; i++) {
        var ph = (i / b.n) * Math.PI * 2;
        ctx.beginPath();
        for (var s = 0; s <= steps; s++) {
          var t = (s / steps) * Math.PI * 2;
          var r = (b.R + b.A * Math.sin(b.k * t + ph) + (b.B || 0) * Math.sin((b.m || 0) * t - ph)) * size;
          var x = c + r * Math.cos(t), y = c + r * Math.sin(t);
          if (s) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    });
  }
  var canvases = document.querySelectorAll('canvas[data-guilloche]');
  function drawAll() { canvases.forEach(drawGuilloche); }
  drawAll();
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawAll, 150); });

  // Calling card: a slight tilt and sheen under the pointer
  var card = document.getElementById('callingCard');
  if (card && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.transform = 'rotateY(' + ((px - 0.5) * 7) + 'deg) rotateX(' + ((0.5 - py) * 7) + 'deg)';
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
