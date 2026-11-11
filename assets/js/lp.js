// >>> Troque pelo número do Leo (DDI + DDD + número, só dígitos) <<<
const WHATSAPP = '5561983018101';

(() => {
  const waBase = `https://wa.me/${WHATSAPP}`;
  document.querySelectorAll('.js-wa').forEach(a => {
    a.href = waBase + '?text=' + encodeURIComponent(a.dataset.waMsg || 'Olá, Leo! Vim pelo site e quero um orçamento para o meu evento.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Nav scrolled
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    const toggle = (open) => {
      menu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  }

  // Hero reel (montagem única com 6 cenas)
  const reel = document.getElementById('heroReel');
  const bars = document.getElementById('reelBars');
  if (reel && bars) {
    const scenes = [
      { t: 0,    label: 'Festas temáticas' },
      { t: 5.8,  label: 'Na cabine' },
      { t: 7.9,  label: 'Pista cheia' },
      { t: 13.5, label: 'Open format' },
      { t: 18.8, label: 'Performance' },
      { t: 24.4, label: 'Showtime' }
    ];
    const label = document.getElementById('reelLabel');
    const idxEl = document.getElementById('reelIdx');
    const fills = scenes.map((sc, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'reel-bar';
      b.setAttribute('aria-label', `Cena ${i + 1}: ${sc.label}`);
      b.innerHTML = '<span></span>';
      b.addEventListener('click', () => { reel.currentTime = sc.t + 0.05; reel.play().catch(() => {}); });
      bars.appendChild(b);
      return b;
    });
    let last = -1;
    const tick = () => {
      const dur = reel.duration || 26.4, t = reel.currentTime;
      let cur = 0;
      scenes.forEach((sc, i) => { if (t >= sc.t) cur = i; });
      fills.forEach((b, i) => {
        const start = scenes[i].t, end = i < scenes.length - 1 ? scenes[i + 1].t : dur;
        const p = Math.max(0, Math.min(1, (t - start) / (end - start)));
        b.firstChild.style.transform = `scaleX(${p})`;
        b.classList.toggle('active', i === cur);
      });
      if (cur !== last) {
        last = cur;
        label.classList.remove('swap'); void label.offsetWidth; label.classList.add('swap');
        label.textContent = scenes[cur].label;
        idxEl.textContent = String(cur + 1).padStart(2, '0');
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    reel.play().catch(() => {});
  }

  // Equalizer bars
  const eq = document.getElementById('eq');
  if (eq) {
    for (let i = 0; i < 22; i++) {
      const s = document.createElement('span');
      s.style.animationDelay = (-Math.random() * 1.2).toFixed(2) + 's';
      s.style.animationDuration = (0.7 + Math.random() * 0.8).toFixed(2) + 's';
      eq.appendChild(s);
    }
  }

  // Reveal on scroll + counters
  const runCounter = (el) => {
    const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(end * e) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll?.('[data-count]').forEach(runCounter);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Spotlight on event cards
  document.querySelectorAll('.event').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  if (lb && lbImg) {
    document.querySelectorAll('.g-item').forEach(g => g.addEventListener('click', () => {
      lbImg.src = g.dataset.full;
      lbImg.alt = g.querySelector('img').alt;
      lb.classList.add('open');
    }));
    const closeLb = () => lb.classList.remove('open');
    if (lbClose) lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
