// ── Mobile Nav Hamburger ──
(function () {
  const btn   = document.getElementById('navHamburger');
  const nav   = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  function closeNav() {
    btn.classList.remove('active');
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
  function openNav() {
    btn.classList.add('active');
    nav.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  btn.addEventListener('click', () => {
    nav.classList.contains('open') ? closeNav() : openNav();
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeNav(); });
})();

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ── Reviews Carousel (mobile) ──
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewDots   = document.querySelectorAll('.carousel-dot');
if (reviewsTrack && reviewDots.length) {
  let st;
  reviewsTrack.addEventListener('scroll', () => {
    clearTimeout(st);
    st = setTimeout(() => {
      const idx = Math.round(reviewsTrack.scrollLeft / reviewsTrack.offsetWidth);
      reviewDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }, 50);
  });
}

// ── Gallery ──
(function () {
  const track    = document.getElementById('galleryTrack');
  const slides   = track ? Array.from(track.querySelectorAll('.gallery-slide')) : [];
  const dotsWrap = document.getElementById('gcDots');
  const prevBtn  = document.getElementById('gcPrev');
  const nextBtn  = document.getElementById('gcNext');

  if (!track || !slides.length) return;

  function isMobile() { return window.innerWidth <= 900; }

  // ── Carousel (mobile only) ──
  let current = 0;

  function visibleCount() {
    return window.innerWidth <= 560 ? 1 : 2;
  }

  function totalPages() {
    return Math.ceil(slides.length / visibleCount());
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    if (!isMobile()) return;
    for (let i = 0; i < totalPages(); i++) {
      const d = document.createElement('button');
      d.className = 'gc-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to page ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(page) {
    if (!isMobile()) return;
    const pages = totalPages();
    current = Math.max(0, Math.min(page, pages - 1));
    const wrapW  = track.parentElement.offsetWidth;
    const offset = current * wrapW;
    track.style.transform = `translateX(-${offset}px)`;
    document.querySelectorAll('.gc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= pages - 1;
  }

  function resetCarousel() {
    track.style.transform = 'translateX(0)';
    current = 0;
  }

  function applyLayout() {
    if (isMobile()) {
      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (dotsWrap) dotsWrap.style.display = '';
      buildDots();
      goTo(0);
    } else {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsWrap) dotsWrap.style.display = 'none';
      resetCarousel();
    }
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  applyLayout();
  window.addEventListener('resize', applyLayout);

  // ── Lightbox (all screen sizes) ──
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lbImg');
  const lbCap   = document.getElementById('lbCaption');
  const lbSub   = document.getElementById('lbSub');
  const lbClose = document.getElementById('lbClose');

  if (!lb) return;

  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      lbImg.src = slide.dataset.src;
      lbImg.alt = slide.dataset.caption || '';
      lbCap.textContent = slide.dataset.caption || '';
      lbSub.textContent = slide.dataset.sub    || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  lbClose && lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();
