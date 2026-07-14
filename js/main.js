/* ================================================================
   A.D.N.D — Main Application Controller
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ── Bootstrap modules ─────────────────────────────────── */
  ThemeManager.init();
  ClockWidget.init();
  CounterAnimation.init();
  Cart.init();
  NotificationSystem.init();

  /* ── Navbar scroll behavior ────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ────────────────────────────────────────── */
  const menuBtn  = document.getElementById('menu-toggle');
  const navMenu  = document.getElementById('nav-menu');
  const menuIcon = menuBtn?.querySelector('i');

  menuBtn?.addEventListener('click', () => {
    const isOpen = navMenu?.classList.toggle('open');
    if (menuIcon) menuIcon.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ── Smooth scroll + close menu ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      navMenu?.classList.remove('open');
      if (menuIcon) menuIcon.className = 'fas fa-bars';
      document.body.style.overflow = '';

      const offset = (navbar?.offsetHeight || 80) + 16;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Scroll Reveal (IntersectionObserver) ─────────────── */
  const revealEls = document.querySelectorAll('[data-animate]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── VSL Audio Auto-Unmute ────────────────────────────────── */
  const audioBadge = document.getElementById('vsl-audio-badge');
  const vslIframe  = document.querySelector('#vsl-player iframe');

  function unmuteVSL() {
    if (vslIframe && vslIframe.contentWindow) {
      vslIframe.contentWindow.postMessage(JSON.stringify({ method: 'setMuted', value: false }), '*');
      vslIframe.contentWindow.postMessage(JSON.stringify({ method: 'setVolume', value: 1 }), '*');
    }

    if (audioBadge) {
      audioBadge.classList.add('fade-out');
      setTimeout(() => audioBadge.remove(), 600);
    }

    // Cleanup listeners
    window.removeEventListener('click', unmuteVSL);
    window.removeEventListener('touchstart', unmuteVSL);
    window.removeEventListener('scroll', unmuteVSL);
    window.removeEventListener('keydown', unmuteVSL);
  }

  // Listen to first user gesture
  window.addEventListener('click', unmuteVSL);
  window.addEventListener('touchstart', unmuteVSL, { passive: true });
  window.addEventListener('scroll', unmuteVSL, { passive: true });
  window.addEventListener('keydown', unmuteVSL);

  // Fallback: Listen to Vimeo controls if user clicks directly on the player iframe
  window.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && (data.event === 'play' || data.event === 'volumechange')) {
        unmuteVSL();
      }
    } catch (e) {}
  });

  /* ── Global WhatsApp buttons ─────────────────────────────── */
  document.querySelectorAll('.btn-whatsapp:not(.vsl-wa-btn)').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.open(
        'https://wa.me/5598999120388?text=Olá!%20Vim%20pelo%20site%20da%20A.D.N.D%20e%20gostaria%20de%20mais%20informações.',
        '_blank'
      );
    });
  });

  /* ── Hero budget button → scroll to services ─────────────── */
  document.getElementById('hero-orcamento-btn')?.addEventListener('click', () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.querySelectorAll('.btn-orcamento:not(#hero-orcamento-btn)').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Testimonials Carousel ───────────────────────────────── */
  initTestimonialsCarousel();

  /* ── Lazy image loading ──────────────────────────────────── */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach((img) => imgObserver.observe(img));
  }
});

/* ── Testimonials Carousel ─────────────────────────────────── */
function initTestimonialsCarousel() {
  const track    = document.querySelector('.testimonials-track');
  const cards    = document.querySelectorAll('.testimonial-card');
  const prevBtn  = document.getElementById('testimonial-prev');
  const nextBtn  = document.getElementById('testimonial-next');
  const dotsWrap = document.getElementById('testimonial-dots');

  if (!track || !cards.length) return;

  let current  = 0;
  let autoPlay = null;

  // Build dots
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `t-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });
  }

  function getVisible() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640)  return 2;
    return 1;
  }

  function goTo(index) {
    const visible  = getVisible();
    const maxIdx   = Math.max(0, cards.length - visible);
    current        = Math.max(0, Math.min(index, maxIdx));

    const gap      = 24;
    const cardW    = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${current * cardW}px)`;

    document.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoPlay = setInterval(() => {
      const visible = getVisible();
      const maxIdx  = Math.max(0, cards.length - visible);
      goTo(current >= maxIdx ? 0 : current + 1);
    }, 4500);
  }

  function resetAuto() {
    clearInterval(autoPlay);
    startAuto();
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  window.addEventListener('resize', () => goTo(current));
  startAuto();
}
