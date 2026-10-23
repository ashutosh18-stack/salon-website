/**
 * HAIR STORY — Men's Hairstyle Architecture Scroll Engine
 * Sticky Mouse-Scroll Horizontal Ribbon with Parallax Depth,
 * Inertia Physics, and Real-Time Progress Tracking (12 Signature Cuts)
 */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('menStylesSection');
  const sticky = document.querySelector('.men-styles-sticky');
  const track = document.getElementById('menStylesTrack');
  const progressBar = document.getElementById('stylesScrollProgress');
  const counterCurrent = document.getElementById('stylesCounterCurrent');
  const btnPrev = document.getElementById('stylesSlidePrev');
  const btnNext = document.getElementById('stylesSlideNext');

  if (!section || !track) return;

  const cards = track.querySelectorAll('.style-card');
  const totalCards = cards.length;

  let targetTranslate = 0;
  let currentTranslate = 0;
  let maxTranslate = 0;
  let isTicking = false;

  function calculateBounds() {
    const windowWidth = window.innerWidth;
    const trackWidth = track.scrollWidth;
    // Extra right-side padding so last card lands gracefully in center/right
    const endBuffer = windowWidth > 900 ? windowWidth * 0.15 : 40;
    maxTranslate = Math.max(0, trackWidth - windowWidth + endBuffer);
  }

  function updateCardsParallax(x) {
    const windowWidth = window.innerWidth;
    const centerX = windowWidth / 2;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distanceFromCenter = (cardCenter - centerX) / (windowWidth / 2); // -1 to +1

      // Subtle internal image parallax shift
      const img = card.querySelector('.style-card-img');
      if (img) {
        const imgShift = Math.max(-25, Math.min(25, -distanceFromCenter * 18));
        img.style.transform = `scale(1.08) translateX(${imgShift}px)`;
      }

      // Center-highlight card with gold elevation
      if (Math.abs(distanceFromCenter) < 0.45) {
        card.classList.add('is-focused');
      } else {
        card.classList.remove('is-focused');
      }
    });

    // Update active index counter (1 to 12)
    const cardWidthWithGap = cards[0] ? cards[0].offsetWidth + 32 : 300;
    const activeIndex = Math.min(
      totalCards,
      Math.max(1, Math.round((x + windowWidth * 0.2) / cardWidthWithGap) + 1)
    );

    if (counterCurrent) {
      counterCurrent.textContent = activeIndex.toString().padStart(2, '0');
    }

    if (progressBar && maxTranslate > 0) {
      const progressPercent = Math.min(100, Math.max(0, (x / maxTranslate) * 100));
      progressBar.style.width = `${progressPercent}%`;
    }
  }

  function render() {
    const diff = targetTranslate - currentTranslate;
    if (Math.abs(diff) > 0.4) {
      currentTranslate += diff * 0.12; // Silky damped spring physics
      track.style.transform = `translate3d(-${currentTranslate}px, 0, 0)`;
      updateCardsParallax(currentTranslate);
      requestAnimationFrame(render);
    } else {
      currentTranslate = targetTranslate;
      track.style.transform = `translate3d(-${currentTranslate}px, 0, 0)`;
      updateCardsParallax(currentTranslate);
      isTicking = false;
    }
  }

  function handleScroll() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;

    // Progress 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
    const totalScrollable = sectionHeight - windowHeight;
    if (totalScrollable <= 0) return;

    let p = -rect.top / totalScrollable;
    p = Math.max(0, Math.min(1, p));

    targetTranslate = p * maxTranslate;

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(render);
    }
  }

  // Prev / Next button step slide
  function slideByCard(direction) {
    const cardWidthWithGap = cards[0] ? cards[0].offsetWidth + 28 : 360;
    const target = currentTranslate + direction * cardWidthWithGap;
    const clampedTarget = Math.max(0, Math.min(maxTranslate, target));
    
    // Scroll window proportionally within the section
    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;
    const totalScrollable = sectionHeight - windowHeight;

    if (totalScrollable > 0 && maxTranslate > 0) {
      const targetScrollY = window.scrollY + rect.top + (clampedTarget / maxTranslate) * totalScrollable;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  }

  if (btnPrev) btnPrev.addEventListener('click', () => slideByCard(-1));
  if (btnNext) btnNext.addEventListener('click', () => slideByCard(1));

  // Handle Resize
  window.addEventListener('resize', () => {
    calculateBounds();
    handleScroll();
  }, { passive: true });

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial bounds calculation
  calculateBounds();
  handleScroll();
  // Recalculate after images load
  window.addEventListener('load', () => {
    calculateBounds();
    handleScroll();
  });
});
