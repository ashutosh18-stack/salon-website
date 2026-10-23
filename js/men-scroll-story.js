/**
 * HAIR STORY — Men's Grooming Lounge Interactive Scroll Engine
 * 4-Stage Cinematic Dissolve Canvas Scrub with Multi-Position Editorial Notes
 * and Dynamic Glassmorphic Navbar States
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('menScrollCanvas');
  const section = document.getElementById('menScrollStorySection');
  const cards = document.querySelectorAll('#menScrollStorySection .story-card');
  const siteHeader = document.querySelector('.site-header');

  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');

  // The 4 High-Resolution Men's Lounge Transformation Stages
  const IMAGE_SOURCES = [
    '/images/men-stage-1-scissors.jpg',
    '/images/men-stage-2-clippers.jpg',
    '/images/men-stage-3-profile.jpg',
    '/images/men-stage-4-portrait.jpg'
  ];

  const images = [];
  let loadedCount = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let isTicking = false;

  // Preload all 4 images
  IMAGE_SOURCES.forEach((src, idx) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (idx === 0) {
        renderProgress(0);
      }
    };
    images[idx] = img;
  });

  // Handle Resize for Retina Displays
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    renderProgress(currentProgress);
  }

  // Stage Focal Point Biases (focalX, focalY from 0.0 to 1.0)
  const STAGE_CONFIGS = [
    { focalX: 0.50, focalY: 0.50 }, // Stage 1: Scissors Macro
    { focalX: 0.50, focalY: 0.50 }, // Stage 2: Clippers Shadow Fade
    { focalX: 0.45, focalY: 0.52 }, // Stage 3: Move_object_down Profile
    { focalX: 0.65, focalY: 0.48 }  // Stage 4: Zoom_out Editorial Portrait
  ];

  // Draw image with full-screen cover mode & focal alignment
  function drawCoverImage(img, alpha, focalX = 0.5, focalY = 0.5) {
    if (!img || !img.complete || img.naturalWidth === 0 || alpha <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;

    // Keep focal point prioritized when cropping excess dimension
    const offsetX = Math.min(0, Math.max(width - drawWidth, (width - drawWidth) * focalX));
    const offsetY = Math.min(0, Math.max(height - drawHeight, (height - drawHeight) * focalY));

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }

  // Smoothstep ease curve for filmic cross-dissolves
  function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  // Blend across the 4 stages with dedicated display plateaus
  function renderProgress(p) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    let baseIndex = 0;
    let nextIndex = 0;
    let blend = 0;

    if (p < 0.16) {
      // Stage 1 Hold
      baseIndex = 0;
      nextIndex = 0;
      blend = 0;
    } else if (p < 0.28) {
      // Transition Stage 1 -> 2
      baseIndex = 0;
      nextIndex = 1;
      blend = smoothstep(0.16, 0.28, p);
    } else if (p < 0.44) {
      // Stage 2 Hold
      baseIndex = 1;
      nextIndex = 1;
      blend = 0;
    } else if (p < 0.56) {
      // Transition Stage 2 -> 3
      baseIndex = 1;
      nextIndex = 2;
      blend = smoothstep(0.44, 0.56, p);
    } else if (p < 0.72) {
      // Stage 3 Hold (Move_object_down profile)
      baseIndex = 2;
      nextIndex = 2;
      blend = 0;
    } else if (p < 0.84) {
      // Transition Stage 3 -> 4
      baseIndex = 2;
      nextIndex = 3;
      blend = smoothstep(0.72, 0.84, p);
    } else {
      // Stage 4 Hold (Zoom_out portrait reveal)
      baseIndex = 3;
      nextIndex = 3;
      blend = 0;
    }

    // Always draw base stage at full opacity
    const baseConfig = STAGE_CONFIGS[baseIndex];
    drawCoverImage(images[baseIndex], 1.0, baseConfig.focalX, baseConfig.focalY);

    // Cross-dissolve next stage when in transition window
    if (blend > 0.001 && baseIndex !== nextIndex) {
      const nextConfig = STAGE_CONFIGS[nextIndex];
      drawCoverImage(images[nextIndex], blend, nextConfig.focalX, nextConfig.focalY);
    }
  }

  // Update floating highlight cards with synchronized milestone timing
  function updateStoryMilestones(p) {
    let activeStage = 1;
    if (p >= 0.78) activeStage = 4;
    else if (p >= 0.50) activeStage = 3;
    else if (p >= 0.22) activeStage = 2;

    cards.forEach(card => {
      const cardStage = parseInt(card.dataset.stage, 10);
      if (cardStage === activeStage) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Animation Frame Loop for Smooth Damped Scrubbing
  function updateAnimation() {
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0005) {
      currentProgress += diff * 0.18; // Silky inertia interpolation
      renderProgress(currentProgress);
      updateStoryMilestones(currentProgress);
      requestAnimationFrame(updateAnimation);
    } else {
      currentProgress = targetProgress;
      renderProgress(currentProgress);
      updateStoryMilestones(currentProgress);
      isTicking = false;
    }
  }

  // Scroll Listener
  function handleScroll() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;

    // Progress 0 at start, 1 at end of scroll track
    let p = -sectionTop / (sectionHeight - windowHeight);
    p = Math.max(0, Math.min(1, p));
    targetProgress = p;

    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(updateAnimation);
    }

    // Blurry transparent navbar over intro frames, solid dark past frames
    if (siteHeader) {
      if (p >= 0.94 || rect.bottom <= 100) {
        siteHeader.classList.add('past-frames');
      } else {
        siteHeader.classList.remove('past-frames');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', resizeCanvas, { passive: true });

  resizeCanvas();
  handleScroll();
});
