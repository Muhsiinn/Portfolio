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
  const emailLink = document.querySelector('[data-email-code]');
  if (emailLink) {
    const address = emailLink.dataset.emailCode.split(',').map((code) => String.fromCharCode(Number(code) ^ 13)).join('');
    emailLink.href = 'mailto:' + address;
    emailLink.textContent = address;
    emailLink.setAttribute('aria-label', 'Email Muhsin at ' + address);
  }

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
})();
