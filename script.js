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

// ── Gallery Carousel ──
(function () {
  const track    = document.getElementById('galleryTrack');
  const slides   = track ? Array.from(track.querySelectorAll('.gallery-slide')) : [];
  const dotsWrap = document.getElementById('gcDots');
  const prevBtn  = document.getElementById('gcPrev');
  const nextBtn  = document.getElementById('gcNext');

  if (!track || !slides.length) return;

  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  let current = 0;

  function totalPages() {
    return Math.ceil(slides.length / visibleCount());
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const d = document.createElement('button');
      d.className = 'gc-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to page ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(page) {
    const pages = totalPages();
    current = Math.max(0, Math.min(page, pages - 1));

    const wrapW  = track.parentElement.offsetWidth;
    const offset = current * wrapW;

    track.style.transform = `translateX(-${offset}px)`;

    document.querySelectorAll('.gc-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= pages - 1;
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  buildDots();
  goTo(0);
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  // ── Lightbox ──
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
