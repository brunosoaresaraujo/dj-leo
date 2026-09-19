/* ==========================================================================
   LEO ALVES — DESIGN SYSTEM JAVASCRIPT LOGIC & AUDIO ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTextReveal();
  initBackgroundColumns();
  initScrollAnimations();
  initFlashlightCards();
  initCardRotator();
  initSlideDeck();
  initColorCopy();
  initTypeTester();
  initAudioSynthesizer();
  initNavbarScroll();
  initLogoIsolationToggle();
});

/* --------------------------------------------------------------------------
   1. KINETIC TEXT REVEAL ANIMATION (Character Stagger)
   -------------------------------------------------------------------------- */
function initTextReveal() {
  const animatedElements = document.querySelectorAll('.kinetic-reveal');
  
  animatedElements.forEach((el) => {
    const text = el.innerText.trim();
    el.innerHTML = '';
    
    // Split into characters
    const chars = text.split('');
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'char';
      span.style.transitionDelay = `${index * 25}ms`;
      if (char === ' ') {
        span.style.width = '0.3em';
        span.style.display = 'inline-block';
      }
      el.appendChild(span);
    });
  });

  // Trigger reveal shortly after load
  setTimeout(() => {
    document.querySelectorAll('.char').forEach((c) => c.classList.add('revealed'));
  }, 150);
}

/* --------------------------------------------------------------------------
   2. BACKGROUND CLIP-PATH COLUMN GRID STAGGER
   -------------------------------------------------------------------------- */
function initBackgroundColumns() {
  const grid = document.getElementById('bg-clip-grid');
  if (!grid) return;
  
  const cols = window.innerWidth < 768 ? 6 : 12;
  grid.innerHTML = '';
  
  for (let i = 0; i < cols; i++) {
    const col = document.createElement('div');
    col.className = 'bg-clip-column';
    grid.appendChild(col);
    
    setTimeout(() => {
      col.classList.add('active');
    }, 100 + i * 80);
  }
}

/* --------------------------------------------------------------------------
   3. SCROLL ANIMATION OBSERVER
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   4. FLASHLIGHT & MOUSE SPOTLIGHT EFFECT
   -------------------------------------------------------------------------- */
function initFlashlightCards() {
  const containers = document.querySelectorAll('.flashlight-grid, .hero-interactive-deck, .spec-section');

  window.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.flashlight-card, .hero-interactive-deck, .swatch-card');
    
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   5. 3D CARD ROTATOR & FEATURE TAB SWITCHER
   -------------------------------------------------------------------------- */
let currentFeatureIndex = 0;
let rotatorInterval = null;

function initCardRotator() {
  const tabs = document.querySelectorAll('.feature-tab-btn');
  const cards = document.querySelectorAll('.rotator-card-item');
  if (!tabs.length || !cards.length) return;

  function updateRotator(index) {
    currentFeatureIndex = index;
    
    cards.forEach((card, i) => {
      if (i === currentFeatureIndex) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
        card.style.zIndex = '10';
      } else if (i === (currentFeatureIndex + 1) % cards.length) {
        card.style.opacity = '0.4';
        card.style.transform = 'translateY(-20px) scale(0.92)';
        card.style.zIndex = '5';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-40px) scale(0.85)';
        card.style.zIndex = '1';
      }
    });

    tabs.forEach((tab, i) => {
      if (i === currentFeatureIndex) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      clearInterval(rotatorInterval);
      updateRotator(i);
      rotatorInterval = setInterval(() => {
        updateRotator((currentFeatureIndex + 1) % tabs.length);
      }, 5000);
    });
  });

  updateRotator(0);
  rotatorInterval = setInterval(() => {
    updateRotator((currentFeatureIndex + 1) % tabs.length);
  }, 5000);
}

/* --------------------------------------------------------------------------
   6. INSTAGRAM SNAP SLIDE DECK (Navigation & Swipe)
   -------------------------------------------------------------------------- */
function initSlideDeck() {
  const container = document.getElementById('slideDeckContainer');
  const prevBtn = document.getElementById('slidePrevBtn');
  const nextBtn = document.getElementById('slideNextBtn');
  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = () => (window.innerWidth < 768 ? window.innerWidth * 0.85 : 480);

  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   7. COLOR TOKEN COPYING WITH TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function initColorCopy() {
  const swatches = document.querySelectorAll('.swatch-card');
  const toast = document.getElementById('copyToast');
  const toastText = document.getElementById('toastText');

  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const hex = swatch.getAttribute('data-hex');
      const token = swatch.getAttribute('data-token');
      
      navigator.clipboard.writeText(hex).then(() => {
        if (toast && toastText) {
          toastText.innerHTML = `Copied <strong>${token}</strong> (<code>${hex}</code>) to clipboard!`;
          toast.classList.add('show');
          
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3000);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE TYPE TESTER CONTROLS
   -------------------------------------------------------------------------- */
function initTypeTester() {
  const preview = document.getElementById('typePreview');
  const sizeSlider = document.getElementById('fontSizeSlider');
  const sizeValue = document.getElementById('fontSizeValue');
  const weightSelect = document.getElementById('fontWeightSelect');
  const fontFamilySelect = document.getElementById('fontFamilySelect');

  if (!preview) return;

  if (sizeSlider && sizeValue) {
    sizeSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      preview.style.fontSize = `${val}px`;
      sizeValue.textContent = `${val}px`;
    });
  }

  if (weightSelect) {
    weightSelect.addEventListener('change', (e) => {
      preview.style.fontWeight = e.target.value;
    });
  }

  if (fontFamilySelect) {
    fontFamilySelect.addEventListener('change', (e) => {
      preview.style.fontFamily = e.target.value;
    });
  }
}

/* --------------------------------------------------------------------------
   9. WEB AUDIO API SYNTHESIZER & WAVEFORM OSCILLOSCOPE
   -------------------------------------------------------------------------- */
let audioCtx = null;
let isVisualizerRunning = false;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function initAudioSynthesizer() {
  const padButtons = document.querySelectorAll('.synth-pad-btn');
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  const canvas = document.getElementById('waveformCanvas');
  
  if (canvas) {
    setupWaveformVisualizer(canvas);
  }

  padButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      initAudioContext();
      const soundType = btn.getAttribute('data-sound');
      playTechnoSound(soundType);
      
      btn.classList.add('playing');
      setTimeout(() => btn.classList.remove('playing'), 200);
    });
  });

  if (heroPlayBtn) {
    let isPlayingLoop = false;
    let loopInterval = null;

    heroPlayBtn.addEventListener('click', () => {
      initAudioContext();
      isPlayingLoop = !isPlayingLoop;

      if (isPlayingLoop) {
        heroPlayBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        `;
        heroPlayBtn.style.background = '#10B981';
        
        let step = 0;
        playTechnoSound('kick');
        loopInterval = setInterval(() => {
          step = (step + 1) % 4;
          if (step % 2 === 0) playTechnoSound('kick');
          if (step === 2) playTechnoSound('synth');
          if (step % 1 === 0) playTechnoSound('hihat');
        }, 320); // ~126 BPM techno groove
      } else {
        heroPlayBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        `;
        heroPlayBtn.style.background = 'var(--color-electric-blue)';
        clearInterval(loopInterval);
      }
    });
  }
}

function playTechnoSound(type) {
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  if (type === 'kick') {
    // Punchy 909-style Techno Kick
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.14);
    
    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'sub') {
    // Deep Sine Sub-Bass
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, now);
    
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.6);
  } else if (type === 'synth') {
    // Resonant Acid Saw Stab
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    
    filter.type = 'lowpass';
    filter.Q.value = 8;
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.28);
    
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'hihat') {
    // Crisp 909 Metallic Noise Hi-Hat
    const bufferSize = audioCtx.sampleRate * 0.06;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start(now);
    noise.stop(now + 0.06);
  } else if (type === 'modular') {
    // Modular FM Ping
    const carrier = audioCtx.createOscillator();
    const mod = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const mainGain = audioCtx.createGain();

    carrier.frequency.setValueAtTime(440, now);
    mod.frequency.setValueAtTime(110, now);
    modGain.gain.setValueAtTime(300, now);

    mod.connect(carrier.frequency);
    carrier.connect(mainGain);
    mainGain.connect(audioCtx.destination);

    mainGain.gain.setValueAtTime(0.4, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    mod.start(now);
    carrier.start(now);
    mod.stop(now + 0.4);
    carrier.stop(now + 0.4);
  } else if (type === 'clap') {
    // Layered 909 Clap
    const bufferSize = audioCtx.sampleRate * 0.12;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start(now);
    noise.stop(now + 0.15);
  }
}

function setupWaveformVisualizer(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);

  let phase = 0;
  const bars = 28;

  function render() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const barWidth = (width / bars) - 3;

    for (let i = 0; i < bars; i++) {
      const x = i * (barWidth + 3);
      // Simulated rhythmic spectrum
      const dynamicHeight = (Math.sin(phase + i * 0.4) * 0.5 + 0.5) * (height * 0.7) + (height * 0.15);
      const y = (height - dynamicHeight) / 2;

      const gradient = ctx.createLinearGradient(0, y, 0, y + dynamicHeight);
      gradient.addColorStop(0, '#60A5FA');
      gradient.addColorStop(0.5, '#3B82C8');
      gradient.addColorStop(1, '#1E40AF');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, dynamicHeight, 2);
      ctx.fill();
    }

    phase += 0.08;
    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   10. NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const nav = document.getElementById('topNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   11. LOGO ISOLATION SAFETY ZONE (1X H) TOGGLE
   -------------------------------------------------------------------------- */
function initLogoIsolationToggle() {
  const toggleBtn = document.getElementById('toggleIsolationBtn');
  const overlay = document.getElementById('isolationOverlay');
  if (!toggleBtn || !overlay) return;

  let isShown = true;
  toggleBtn.addEventListener('click', () => {
    isShown = !isShown;
    overlay.style.display = isShown ? 'flex' : 'none';
    toggleBtn.textContent = isShown ? 'Hide 1x H Safety Grid' : 'Show 1x H Safety Grid';
  });
}
