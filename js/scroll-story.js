/**
 * HAIR STORY — 200-Frame Interactive Canvas Scroll Engine
 * High-performance frame-scrubbing with multi-position luxury editorial cards
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('scrollStoryCanvas');
  const section = document.getElementById('scrollStorySection');
  const loaderHud = document.getElementById('storyLoaderHud');
  const progressBar = document.getElementById('loaderProgressBar');
  const percentText = document.getElementById('loaderPercent');
  const frameCounter = document.getElementById('frameCounterText');
  const cards = document.querySelectorAll('.story-card');
  const chapterNodes = document.querySelectorAll('.chapter-node');

  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 200;
  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrameIndex = 1;
  let targetFrameIndex = 1;
  let isTicking = false;

  // Frame URL builder
  function getFrameUrl(index) {
    const padded = String(index).padStart(3, '0');
    return `/ezgif-2c89d6df11669799-jpg/ezgif-frame-${padded}.jpg`;
  }

  // Set canvas size for retina sharp display
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    
    // Maintain 16:9 or source aspect ratio container
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Redraw current frame
    renderFrame(currentFrameIndex);
  }

  // Draw image frame with full-screen COVER scaling (edge-to-edge)
  function renderFrame(index) {
    const img = frames[index - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Full screen cover calculation
    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Preloader with priority: First frame first, then batches
  function preloadImages() {
    // 1. Load frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      frames[0] = firstImg;
      loadedCount++;
      renderFrame(1);
      // Load remaining frames
      loadRemainingFrames();
    };
    firstImg.onerror = () => {
      loadRemainingFrames();
    };
  }

  function loadRemainingFrames() {
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        frames[i - 1] = img;
        loadedCount++;
        const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (percentText) percentText.textContent = `${percent}%`;

        // If user already scrolled to this frame, render it
        if (currentFrameIndex === i) {
          renderFrame(i);
        }

        if (loadedCount >= TOTAL_FRAMES) {
          setTimeout(() => {
            if (loaderHud) loaderHud.classList.add('loaded');
          }, 300);
        }
      };
      img.onerror = () => {
        loadedCount++;
      };
    }
  }

  // Scroll Progress Calculation
  function handleScroll() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;

    // Progress 0 at start of section, 1 at bottom of scroll track
    let progress = -sectionTop / (sectionHeight - windowHeight);
    progress = Math.max(0, Math.min(1, progress));

    // Calculate Target Frame (1 to 200)
    targetFrameIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));

    // Auto hide loader if user begins scrolling
    if (progress > 0.02 && loaderHud && !loaderHud.classList.contains('loaded')) {
      loaderHud.classList.add('loaded');
    }

    // Smoothly animate towards target frame
    if (!isTicking) {
      window.requestAnimationFrame(updateAnimation);
      isTicking = true;
    }

    // Update Story Cards & Chapters based on progress intervals
    updateStoryMilestones(progress);

    // Navbar state: Blur Transparent over the frames, Normal solid after
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      if (progress >= 0.94 || rect.bottom <= 100) {
        siteHeader.classList.add('past-frames');
      } else {
        siteHeader.classList.remove('past-frames');
      }
    }
  }

  function updateAnimation() {
    if (currentFrameIndex !== targetFrameIndex) {
      // Smooth step towards target
      const step = Math.sign(targetFrameIndex - currentFrameIndex);
      const diff = Math.abs(targetFrameIndex - currentFrameIndex);
      
      if (diff > 4) {
        currentFrameIndex += step * Math.ceil(diff / 3);
      } else {
        currentFrameIndex += step;
      }

      renderFrame(currentFrameIndex);
    }

    if (currentFrameIndex !== targetFrameIndex) {
      window.requestAnimationFrame(updateAnimation);
    } else {
      isTicking = false;
    }
  }

  // Update Alternating Position Highlight Cards
  function updateStoryMilestones(progress) {
    // 5 Stages with clean active intervals:
    // 1: 0% to 20%   (pos-top-left)
    // 2: 20% to 42%  (pos-bottom-right)
    // 3: 42% to 65%  (pos-bottom-left)
    // 4: 65% to 85%  (pos-top-right)
    // 5: 85% to 100% (pos-center-stage)
    
    let activeStage = 1;
    if (progress >= 0.85) {
      activeStage = 5;
    } else if (progress >= 0.65) {
      activeStage = 4;
    } else if (progress >= 0.42) {
      activeStage = 3;
    } else if (progress >= 0.20) {
      activeStage = 2;
    } else {
      activeStage = 1;
    }

    cards.forEach(card => {
      const stageId = parseInt(card.dataset.stage, 10);
      if (stageId === activeStage) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    chapterNodes.forEach(node => {
      const nodeStage = parseInt(node.dataset.stage, 10);
      if (nodeStage === activeStage) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });
  }

  // Chapter Node Click to Jump
  chapterNodes.forEach(node => {
    node.addEventListener('click', () => {
      const stage = parseInt(node.dataset.stage, 10);
      const stageProgressMap = {
        1: 0.05,
        2: 0.30,
        3: 0.52,
        4: 0.74,
        5: 0.94
      };
      const targetProgress = stageProgressMap[stage] || 0;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollToY = sectionTop + targetProgress * (sectionHeight - windowHeight);

      window.scrollTo({
        top: scrollToY,
        behavior: 'smooth'
      });
    });
  });

  // Event Listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', resizeCanvas);

  // Initialize
  resizeCanvas();
  preloadImages();
});
