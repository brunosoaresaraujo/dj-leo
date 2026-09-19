/* ==========================================================================
   LEO ALVES — LANDING PAGE HERO JAVASCRIPT ENGINE
   Features: Dual-Video Modern Slide Engine, Audio Visualizer, Hardware Synth
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDualVideoSlider();
  initHudAudioEngine();
  initNavbarScroll();
  initMouseGlowTracking();
});

/* --------------------------------------------------------------------------
   1. DUAL-VIDEO MODERN SLIDE TRANSITION ENGINE
   -------------------------------------------------------------------------- */
let currentVideoSlide = 0;
const videoSlideDuration = 8000; // 8 seconds per video
let videoSlideTimer = null;
let progressInterval = null;
let progressStartTime = 0;

function initDualVideoSlider() {
  const slides = document.querySelectorAll('.video-slide-item');
  const tabs = document.querySelectorAll('.video-tab-item');
  const prevBtn = document.getElementById('videoPrevBtn');
  const nextBtn = document.getElementById('videoNextBtn');

  if (!slides.length) return;

  function switchVideoSlide(index) {
    currentVideoSlide = index;

    // Transition slides
    slides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      if (i === currentVideoSlide) {
        slide.classList.add('active');
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      } else {
        slide.classList.remove('active');
        if (video) {
          setTimeout(() => {
            if (!slide.classList.contains('active')) {
              video.pause();
            }
          }, 1400);
        }
      }
    });

    // Update tab indicators
    tabs.forEach((tab, i) => {
      const progressFill = tab.querySelector('.video-tab-progress-fill');
      if (i === currentVideoSlide) {
        tab.classList.add('active');
        if (progressFill) progressFill.style.width = '0%';
      } else {
        tab.classList.remove('active');
        if (progressFill) progressFill.style.width = '0%';
      }
    });

    // Reset and start slide progress animation
    startSlideProgress();
  }

  function startSlideProgress() {
    clearInterval(progressInterval);
    clearTimeout(videoSlideTimer);

    progressStartTime = Date.now();
    const activeTab = tabs[currentVideoSlide];
    const progressFill = activeTab ? activeTab.querySelector('.video-tab-progress-fill') : null;

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - progressStartTime;
      const pct = Math.min(100, (elapsed / videoSlideDuration) * 100);
      if (progressFill) {
        progressFill.style.width = `${pct}%`;
      }
    }, 50);

    videoSlideTimer = setTimeout(() => {
      const nextIndex = (currentVideoSlide + 1) % slides.length;
      switchVideoSlide(nextIndex);
    }, videoSlideDuration);
  }

  // Tab click bindings
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      switchVideoSlide(i);
    });
  });

  // Arrow buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentVideoSlide + 1) % slides.length;
      switchVideoSlide(nextIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentVideoSlide - 1 + slides.length) % slides.length;
      switchVideoSlide(prevIndex);
    });
  }


  // Initial boot
  switchVideoSlide(0);
}

/* --------------------------------------------------------------------------
   2. HUD AUDIO ENGINE & REAL-TIME SPECTRUM VISUALIZER
   -------------------------------------------------------------------------- */
let audioCtx = null;
let isHudGroovePlaying = false;
let hudGrooveInterval = null;

function initHudAudioEngine() {
  const playBtn = document.getElementById('hudPlayBtn');
  const canvas = document.getElementById('hudCanvas');

  if (canvas) {
    setupSpectrumVisualizer(canvas);
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isHudGroovePlaying = !isHudGroovePlaying;

      if (isHudGroovePlaying) {
        playBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        `;
        playBtn.style.background = '#10B981';

        // Play driving 128 BPM Techno Pattern
        let step = 0;
        triggerSynthSound('kick');
        hudGrooveInterval = setInterval(() => {
          step = (step + 1) % 4;
          if (step % 2 === 0) triggerSynthSound('kick');
          if (step === 2) triggerSynthSound('stab');
          if (step % 1 === 0) triggerSynthSound('hihat');
        }, 290); // ~128 BPM
      } else {
        playBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        `;
        playBtn.style.background = 'var(--color-electric-blue)';
        clearInterval(hudGrooveInterval);
      }
    });
  }
}

function triggerSynthSound(type) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  if (type === 'kick') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.15);
    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'stab') {
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    filter.type = 'lowpass';
    filter.Q.value = 7;
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(240, now + 0.25);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'hihat') {
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 8000;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(now);
    noise.stop(now + 0.05);
  }
}

function setupSpectrumVisualizer(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);

  let phase = 0;
  const barCount = 32;

  function render() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const barW = (w / barCount) - 2;

    for (let i = 0; i < barCount; i++) {
      const x = i * (barW + 2);
      const intensity = isHudGroovePlaying ? 1.4 : 0.6;
      const barH = (Math.sin(phase + i * 0.35) * 0.5 + 0.5) * (h * 0.75 * intensity) + (h * 0.12);
      const y = (h - barH) / 2;

      const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
      gradient.addColorStop(0, '#60A5FA');
      gradient.addColorStop(0.6, '#3B82C8');
      gradient.addColorStop(1, '#1E40AF');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 2);
      ctx.fill();
    }

    phase += isHudGroovePlaying ? 0.12 : 0.05;
    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   3. NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const nav = document.getElementById('lpNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   4. MOUSE GLOW TRACKING
   -------------------------------------------------------------------------- */
function initMouseGlowTracking() {
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });
}
