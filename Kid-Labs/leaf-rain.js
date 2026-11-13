/**
 * Leaf-to-Coin Rain Animation
 * Green leaves fall from the top and morph into green eco-coins
 * that drop into the piggy bank, filling it up over time.
 */
(function () {
  const canvas = document.getElementById('rewardRainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let running = false;

  const PARTICLE_COUNT = 22;
  const MORPH_START = 0.40;      // start morphing at 40% of height
  const MORPH_END = 0.65;        // fully coin at 65%

  /* ── leaf colours ────────────────────────── */
  const LEAF_FILLS = [
    ['#6ec958', '#3a8c2e'],
    ['#8fd46a', '#4b9b46'],
    ['#5bbf4a', '#2e7a28'],
    ['#a5d873', '#5aaf42'],
    ['#7ecf5c', '#348530'],
  ];

  /* ── eco coin colours (green, matching piggy coins) ── */
  const COIN_BODY   = '#3a8c2e';
  const COIN_LIGHT  = '#7ecf5c';
  const COIN_DARK   = '#1b5e20';
  const COIN_BORDER = '#4a9c5e';

  /* ── fill level tracking ────────────────── */
  let coinsCollected = 0;
  const MAX_FILL_COINS = 60;     // coins needed to fill the piggy to max
  const MAX_FILL_PERCENT = 55;   // max fill height in % of piggy container
  const MIN_PIGGY_SCALE = 1.0;   // starting scale
  const MAX_PIGGY_SCALE = 1.35;  // max scale when full

  function updateFillLevel() {
    const overlay = document.getElementById('coinFillOverlay');
    const piggyContainer = document.querySelector('.piggy-jar-container');

    // Update fill overlay height
    if (overlay) {
      const pct = Math.min((coinsCollected / MAX_FILL_COINS) * MAX_FILL_PERCENT, MAX_FILL_PERCENT);
      overlay.style.height = pct + '%';
    }

    // Scale up piggy bank as coins are collected
    if (piggyContainer) {
      const progress = Math.min(coinsCollected / MAX_FILL_COINS, 1);
      const scale = MIN_PIGGY_SCALE + progress * (MAX_PIGGY_SCALE - MIN_PIGGY_SCALE);
      piggyContainer.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      piggyContainer.style.transform = 'translateX(-50%) scale(' + scale + ')';
    }
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── get piggy bank slot position (top-center of the piggy container) ── */
  function getPiggySlot() {
    const piggy = document.querySelector('.piggy-jar-container');
    const rewardScreen = document.getElementById('rewardScreen');
    if (!piggy || !rewardScreen) return null;

    const piggyRect = piggy.getBoundingClientRect();
    const screenRect = rewardScreen.getBoundingClientRect();

    return {
      x: piggyRect.left + piggyRect.width * 0.5 - screenRect.left,
      y: piggyRect.top + piggyRect.height * 0.18 - screenRect.top,
    };
  }

  function makeParticle(w, h, instant) {
    const palette = LEAF_FILLS[Math.floor(Math.random() * LEAF_FILLS.length)];
    return {
      x: Math.random() * w,
      y: instant ? Math.random() * h * 0.35 : -Math.random() * 60 - 10,
      size: 10 + Math.random() * 8,
      speed: 0.5 + Math.random() * 1.0,
      drift: (Math.random() - 0.5) * 0.6,
      wobbleAmp: 6 + Math.random() * 10,
      wobbleSpeed: 0.012 + Math.random() * 0.014,
      wobbleOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      fill1: palette[0],
      fill2: palette[1],
      opacity: 0.7 + Math.random() * 0.3,
      t: 0,
      absorbed: false,
    };
  }

  function init() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(makeParticle(w, h, true));
    }
  }

  /* ── draw leaf shape ─────────────────────── */
  function drawLeaf(p, alpha) {
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity * alpha;

    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.8, -s * 0.6, s * 0.7, s * 0.4, 0, s);
    ctx.bezierCurveTo(-s * 0.7, s * 0.4, -s * 0.8, -s * 0.6, 0, -s);
    ctx.closePath();

    const grad = ctx.createLinearGradient(-s, -s, s, s);
    grad.addColorStop(0, p.fill1);
    grad.addColorStop(1, p.fill2);
    ctx.fillStyle = grad;
    ctx.fill();

    // leaf vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.7);
    ctx.lineTo(0, s * 0.7);
    ctx.strokeStyle = 'rgba(30,80,20,0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  /* ── draw green eco coin ─────────────────── */
  function drawCoin(p, alpha) {
    const r = p.size * 0.85;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * 0.15);
    ctx.globalAlpha = p.opacity * alpha;

    // coin body — green gradient
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, 0, 0, 0, r);
    grad.addColorStop(0, COIN_LIGHT);
    grad.addColorStop(0.45, COIN_BODY);
    grad.addColorStop(0.85, COIN_DARK);
    grad.addColorStop(1, '#0d3d12');
    ctx.fillStyle = grad;
    ctx.fill();

    // outer border ring
    ctx.strokeStyle = COIN_BORDER;
    ctx.lineWidth = 2;
    ctx.stroke();

    // inner decorative ring
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.76, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(165, 216, 115, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // tree emblem in center
    const ts = r * 0.35;

    // trunk
    ctx.beginPath();
    ctx.rect(-ts * 0.12, ts * 0.1, ts * 0.24, ts * 0.7);
    ctx.fillStyle = '#1b5e20';
    ctx.fill();

    // canopy (3 overlapping circles)
    ctx.fillStyle = '#0d3d12';
    ctx.beginPath();
    ctx.arc(0, -ts * 0.3, ts * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-ts * 0.3, ts * 0.05, ts * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ts * 0.3, ts * 0.05, ts * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // shimmer highlight
    ctx.beginPath();
    ctx.ellipse(-r * 0.18, -r * 0.28, r * 0.35, r * 0.12, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fill();

    ctx.restore();
  }

  function tick() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const slot = getPiggySlot();
    const targetX = slot ? slot.x : w / 2;
    const targetY = slot ? slot.y : h * 0.8;

    ctx.clearRect(0, 0, w, h);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.absorbed) continue;

      p.t += 1;
      p.y += p.speed;

      const progress = p.y / h;
      let morph = 0;
      if (progress > MORPH_START) {
        morph = Math.min(1, (progress - MORPH_START) / (MORPH_END - MORPH_START));
      }

      // Steer toward the piggy bank slot once morphing
      if (morph > 0) {
        const steerStrength = 0.02 + morph * 0.04;
        p.x += (targetX - p.x) * steerStrength;
        p.y += (targetY - p.y) * steerStrength * 0.5;
        p.speed = Math.min(p.speed + 0.005, 2.5);
      }

      p.x += p.drift + Math.sin(p.t * p.wobbleSpeed + p.wobbleOffset) * 0.4 * (1 - morph);
      p.rotation += p.rotSpeed * (1 - morph * 0.7);

      // fade in at top
      let fadeAlpha = 1;
      if (progress < 0.05) {
        fadeAlpha *= progress / 0.05;
      }

      // Distance to piggy slot
      const dx = p.x - targetX;
      const dy = p.y - targetY;
      const distToSlot = Math.sqrt(dx * dx + dy * dy);

      // Shrink + fade as coin approaches the slot
      let slotScale = 1;
      let slotFade = 1;
      if (morph > 0.5 && distToSlot < 80) {
        const closeness = 1 - (distToSlot / 80);
        slotScale = 1 - closeness * 0.6;
        slotFade = 1 - closeness * 0.8;
      }

      // Draw leaf portion
      if (morph < 1) {
        drawLeaf(p, (1 - morph) * fadeAlpha);
      }

      // Draw coin portion
      if (morph > 0) {
        ctx.save();
        const coinAlpha = morph * fadeAlpha * slotFade;
        if (slotScale < 1) {
          ctx.translate(p.x, p.y);
          ctx.scale(slotScale, slotScale);
          ctx.translate(-p.x, -p.y);
        }
        drawCoin(p, coinAlpha);
        ctx.restore();
      }

      // Absorb into piggy when very close to slot
      if (morph >= 0.8 && distToSlot < 25) {
        p.absorbed = true;
        coinsCollected++;
        updateFillLevel();

        // Trigger a subtle bounce on the piggy
        const piggy = document.querySelector('.piggy-jar-container');
        if (piggy) {
          piggy.classList.remove('piggy-bounce');
          // Force reflow so the animation restarts
          void piggy.offsetWidth;
          piggy.classList.add('piggy-bounce');
        }

        // Recycle particle
        setTimeout(() => {
          particles[i] = makeParticle(w, h, false);
        }, 120);
        continue;
      }

      // Fallback: recycle if it goes off screen
      if (p.y > h + 30) {
        particles[i] = makeParticle(w, h, false);
      }
    }

    if (running) {
      animId = requestAnimationFrame(tick);
    }
  }

  function start() {
    if (running) return;
    running = true;
    coinsCollected = 0;
    // Reset fill overlay
    const overlay = document.getElementById('coinFillOverlay');
    if (overlay) overlay.style.height = '0%';
    // Reset piggy scale
    const piggyContainer = document.querySelector('.piggy-jar-container');
    if (piggyContainer) {
      piggyContainer.style.transition = 'none';
      piggyContainer.style.transform = 'translateX(-50%) scale(1)';
    }
    resize();
    init();
    tick();
  }

  function stop() {
    running = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  /* ── observe reward screen visibility ────── */
  const rewardScreen = document.getElementById('rewardScreen');
  if (rewardScreen) {
    const observer = new MutationObserver(() => {
      if (!rewardScreen.hidden) {
        start();
      } else {
        stop();
      }
    });
    observer.observe(rewardScreen, { attributes: true, attributeFilter: ['hidden'] });
  }

  window.addEventListener('resize', () => {
    if (running) resize();
  });

  // expose for manual trigger
  window.startLeafRain = start;
  window.stopLeafRain = stop;
})();
