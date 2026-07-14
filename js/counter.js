/* ================================================================
   A.D.N.D — Animated Counters
   ================================================================ */

const CounterAnimation = (() => {
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-counter'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2200;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);

      el.textContent = value.toLocaleString('pt-BR') + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('pt-BR') + suffix;
        el.classList.add('counter-done');
      }
    }

    requestAnimationFrame(tick);
  }

  function init() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('counter-started')) {
            entry.target.classList.add('counter-started');
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  return { init };
})();
