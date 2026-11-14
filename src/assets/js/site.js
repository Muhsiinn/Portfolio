(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const progress = document.querySelector('.reading-progress span');
  const topButton = document.querySelector('.back-top');
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
  const dateStamp = document.querySelector('[data-live-date]');
  if (dateStamp) {
    const today = new Date();
    dateStamp.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(today);
    dateStamp.dateTime = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  }
  document.querySelectorAll('[data-email-code]').forEach((el) => {
    const address = el.dataset.emailCode.split(',').map((code) => String.fromCharCode(Number(code) ^ 13)).join('');
    el.href = 'mailto:' + address;
    el.setAttribute('aria-label', 'Email Muhsin at ' + address);
  });

  function setTheme(theme, persist = false) {
    root.dataset.theme = theme;
    toggle?.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    if (persist) localStorage.setItem('notebook-theme', theme);
  }
  setTheme(root.dataset.theme || 'light');
  toggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!localStorage.getItem('notebook-theme')) setTheme(event.matches ? 'dark' : 'light');
  });

  let ticking = false;
  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    topButton?.classList.toggle('is-visible', scrollY > 600);
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScrollUI); ticking = true; }
  }, { passive: true });
  updateScrollUI();
  topButton?.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));

  document.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code) return;
    const button = document.createElement('button');
    button.className = 'copy-code';
    button.type = 'button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = 'Copied';
        setTimeout(() => { button.textContent = 'Copy'; }, 1400);
      } catch { button.textContent = 'Select code to copy'; }
    });
    pre.append(button);
  });

  document.querySelectorAll('.prose img').forEach((img) => {
    if (img.closest('a')) return;
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Open image: ' + (img.alt || 'image'));
    const open = () => {
      const dialog = document.createElement('dialog');
      dialog.className = 'image-lightbox';
      const enlarged = new Image();
      enlarged.src = img.currentSrc || img.src;
      enlarged.alt = img.alt;
      const caption = document.createElement('p');
      caption.textContent = img.alt || '';
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'Close';
      close.setAttribute('aria-label', 'Close image preview');
      close.addEventListener('click', () => dialog.close());
      dialog.append(close, enlarged, caption);
      dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => { dialog.remove(); img.focus(); });
      document.body.append(dialog);
      dialog.showModal();
      close.focus();
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
  });

  const lowData = navigator.connection?.saveData || matchMedia('(prefers-reduced-data: reduce)').matches;
  if (!lowData && 'IntersectionObserver' in window) {
    const seen = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const link = entry.target;
        observer.unobserve(link);
        if (!seen.has(link.href)) {
          seen.add(link.href);
          const prefetch = document.createElement('link');
          prefetch.rel = 'prefetch';
          prefetch.href = link.href;
          document.head.append(prefetch);
        }
      }
    }, { rootMargin: '0px' });
    document.querySelectorAll('a[href]').forEach((link) => {
      if (link.origin === location.origin && !link.hash && !link.hasAttribute('download')) {
        link.addEventListener('pointerenter', () => observer.observe(link), { once: true, passive: true });
        link.addEventListener('focus', () => observer.observe(link), { once: true });
      }
    });
  }
  // ── Neuron interactivity: organic drift + action potential ──
  const neuronFig = document.getElementById('neuron-figure');
  const apImpulse = document.getElementById('ap-impulse');
  const mvLabel   = document.getElementById('neuron-mv');
  const driftGroups = neuronFig ? [...neuronFig.querySelectorAll('.neuron-drift')] : [];
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (neuronFig && !noMotion && driftGroups.length) {
    let mx = 0, my = 0, tx = [0,0,0], ty = [0,0,0], cx = [0,0,0], cy = [0,0,0];
    let rafId = null, idle = false, apCooldown = false;
    const DRIFT = [1, .6, 1.4]; // per-group drift multipliers

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
      let settled = true;
      driftGroups.forEach((g, i) => {
        cx[i] = lerp(cx[i], tx[i], .08);
        cy[i] = lerp(cy[i], ty[i], .08);
        if (Math.abs(cx[i] - tx[i]) > .05 || Math.abs(cy[i] - ty[i]) > .05) settled = false;
        g.style.transform = `translate(${cx[i].toFixed(2)}px,${cy[i].toFixed(2)}px)`;
      });
      rafId = settled && idle ? null : requestAnimationFrame(tick);
    }

    function fireAP() {
      if (apCooldown || !apImpulse) return;
      apCooldown = true;
      apImpulse.classList.remove('is-active');
      void apImpulse.offsetWidth; // reflow to restart animation
      apImpulse.classList.add('is-active');
      if (mvLabel) { mvLabel.textContent = '+30 mV'; mvLabel.classList.add('is-firing'); }
      setTimeout(() => {
        apImpulse.classList.remove('is-active');
        if (mvLabel) { mvLabel.textContent = '−70 mV'; mvLabel.classList.remove('is-firing'); }
        setTimeout(() => { apCooldown = false; }, 600);
      }, 950);
    }

    neuronFig.addEventListener('pointermove', (e) => {
      const r = neuronFig.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width  - .5) * 2;
      const ny = ((e.clientY - r.top)  / r.height - .5) * 2;
      DRIFT.forEach((d, i) => { tx[i] = nx * 3 * d; ty[i] = ny * 2 * d; });
      idle = false;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });

    neuronFig.addEventListener('pointerleave', () => {
      DRIFT.forEach((_, i) => { tx[i] = 0; ty[i] = 0; });
      idle = true;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });

    neuronFig.addEventListener('pointerenter', fireAP, { passive: true });
    neuronFig.addEventListener('click', fireAP);
  }

})();
