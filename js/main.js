/**
 * HAIR STORY — Global Core Interactive Engine
 * Navigation, Mobile Menu, Luxury Ambiance Synthesizer, Before/After Slider
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Sticky Effect (On pages without custom scroll story headers) ---
  const header = document.querySelector('.site-header');
  if (!document.body.classList.contains('home-page') && !document.body.classList.contains('men-page')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Mobile Drawer Menu ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open');
    });

    // Close when clicking a nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // --- Luxury Salon Soundscape Synthesizer (Web Audio API) ---
  // Generates serene, warm acoustic / rhodes lounge chimes
  let audioCtx = null;
  let isAudioPlaying = false;
  let ambientInterval = null;
  const audioBtn = document.querySelector('.audio-toggle-btn');

  function initAudioEngine() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playLuxuryChime(freq, duration = 3.2, delay = 0) {
    if (!audioCtx || !isAudioPlaying) return;

    setTimeout(() => {
      if (!isAudioPlaying) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Soft warm lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, audioCtx.currentTime);

      // Warm sine + triangle blend
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Delicate envelope
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    }, delay * 1000);
  }

  // Ethereal Pentatonic Chord Progression
  const CHORD_PROGRESSIONS = [
    [261.63, 329.63, 392.00, 523.25], // C Major 7th
    [220.00, 261.63, 329.63, 392.00], // A Minor 7th
    [174.61, 220.00, 261.63, 329.63], // F Major 7th
    [196.00, 246.94, 293.66, 392.00]  // G Major 9th
  ];

  function startAtmosphereLoop() {
    let chordIndex = 0;
    function cycleChord() {
      if (!isAudioPlaying) return;
      const chord = CHORD_PROGRESSIONS[chordIndex % CHORD_PROGRESSIONS.length];
      chord.forEach((note, idx) => {
        playLuxuryChime(note, 3.8, idx * 0.25);
      });
      chordIndex++;
    }

    cycleChord();
    ambientInterval = setInterval(cycleChord, 4500);
  }

  function stopAtmosphereLoop() {
    if (ambientInterval) clearInterval(ambientInterval);
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      initAudioEngine();
      isAudioPlaying = !isAudioPlaying;

      if (isAudioPlaying) {
        audioBtn.classList.add('audio-active');
        const textSpan = audioBtn.querySelector('.sound-label');
        if (textSpan) textSpan.textContent = 'Ambiance: On';
        startAtmosphereLoop();
      } else {
        audioBtn.classList.remove('audio-active');
        const textSpan = audioBtn.querySelector('.sound-label');
        if (textSpan) textSpan.textContent = 'Ambiance: Off';
        stopAtmosphereLoop();
      }
    });
  }

  // --- Interactive Before & After Slider ---
  const compSlider = document.querySelector('.transformation-slider-wrap');
  if (compSlider) {
    const afterLayer = compSlider.querySelector('.layer-after');
    const handle = compSlider.querySelector('.comparison-handle');
    let isDragging = false;

    function updateSlider(xPos) {
      const rect = compSlider.getBoundingClientRect();
      let pos = (xPos - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      const percentage = pos * 100;

      if (afterLayer) afterLayer.style.width = `${percentage}%`;
      if (handle) handle.style.left = `${percentage}%`;
    }

    compSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    // Touch support for mobile
    compSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) updateSlider(e.touches[0].clientX);
    }, { passive: true });
  }

  // --- Modal Lightbox System ---
  const modalOverlay = document.getElementById('globalModalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalCloseBtn');

  window.openLuxuryModal = function(title, contentHtml) {
    if (!modalOverlay) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = contentHtml;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLuxuryModal = function() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', window.closeLuxuryModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.closeLuxuryModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLuxuryModal();
  });

  // --- Manifesto Floating Badge & Session Scroll Entrance ---
  const manifestoSection = document.querySelector('.section-manifesto');
  const manifestoBadge = document.querySelector('.manifesto-floating-badge');
  const manifestoGrid = document.querySelector('.manifesto-grid');

  if (manifestoSection && manifestoBadge) {
    const targetEl = manifestoGrid || manifestoSection;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          manifestoSection.classList.add('in-view');
          manifestoBadge.classList.add('in-view');
        } else {
          // If user scrolls back up above the section, reset so it replays smoothly
          if (entry.boundingClientRect.top > 0) {
            manifestoSection.classList.remove('in-view');
            manifestoBadge.classList.remove('in-view');
          }
        }
      });
    }, {
      threshold: 0.15,
      // Delayed by ~2 extra scrolls (-280px margin) so card & text animate when in full view
      rootMargin: '0px 0px -280px 0px'
    });

    observer.observe(targetEl);
  }

  // --- Universal High-Performance Scroll Reveal System Across All Pages ---
  const autoRevealTargets = document.querySelectorAll(
    'section:not(.page-hero-fixed), .service-card, .testimonial-card, .artisan-card, .style-stage-card, .cta-box, .section-header-center, .manifesto-card, .treatment-pillar-card, .contact-card, .editorial-feature-card, .reveal-init, .reveal-scale-init'
  );

  const scrollRevealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  autoRevealTargets.forEach(el => {
    if (!el.classList.contains('reveal-init') && !el.classList.contains('reveal-scale-init')) {
      el.classList.add('reveal-init');
      // Add micro-stagger for siblings
      if (el.parentElement && (el.classList.contains('service-card') || el.classList.contains('testimonial-card') || el.classList.contains('artisan-card'))) {
        const siblings = Array.from(el.parentElement.children);
        const childIndex = siblings.indexOf(el);
        if (childIndex > 0) {
          el.style.transitionDelay = `${(childIndex % 4) * 0.12}s`;
        }
      }
    }
    scrollRevealObserver.observe(el);
  });
});

