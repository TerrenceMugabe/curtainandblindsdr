const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

const track = document.getElementById('reviewsTrack');
const dots  = document.querySelectorAll('.carousel-dot');
if (track && dots.length) {
  let st;
  track.addEventListener('scroll', () => {
    clearTimeout(st);
    st = setTimeout(() => {
      const idx = Math.round(track.scrollLeft / track.offsetWidth);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }, 50);
  });
}