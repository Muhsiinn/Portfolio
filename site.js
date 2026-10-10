const siteScript = document.currentScript;
const siteBase = new URL('.', siteScript?.src || location.href);
window.SiteAssets = {
  url(path) { return new URL(String(path).replace(/^\//, ''), siteBase).href; }
};

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
document.querySelectorAll('.collage img').forEach(img => img.addEventListener('error', () => { const figure = img.closest('figure'); if (figure) figure.hidden = true; }, { once: true }));
fetch(window.SiteAssets.url('illustrations-index.json')).then(r => r.ok ? r.json() : []).then(items => {
  const bySlot = new Map(items.filter(item => item.slot).map(item => [item.slot, item]));
  document.querySelectorAll('[data-illustration-slot]').forEach(img => {
    const item = bySlot.get(img.dataset.illustrationSlot); if (!item) return;
    img.src = window.SiteAssets.url(item.file); img.alt = item.alt || '';
    const caption = document.querySelector('[data-caption-slot="' + img.dataset.illustrationSlot + '"]');
    // Captions are reader-facing; provenance and licensing stay in the manifest.
    if (caption) {
      caption.textContent = item.caption || '';
      caption.hidden = !item.caption;
    }
  });
  const positions = {
    'left-margin': 'home-art--left-margin',
    'right-margin': 'home-art--right-margin',
    'lower-left': 'home-art--lower-left',
    'lower-right': 'home-art--lower-right'
  };
  const collage = document.getElementById('home-illustrations');
  if (collage) {
    const byPosition = new Map();
    items.filter(item => item.section === 'home' && !item.slot && !item.exclude && positions[item.position]).forEach(item => {
      if (!byPosition.has(item.position)) byPosition.set(item.position, []);
      byPosition.get(item.position).push(item);
    });
    byPosition.forEach((collection, position) => {
      const key = 'musi-home-art-' + position;
      let previous = null;
      try { previous = localStorage.getItem(key); } catch (_) {}
      let choices = collection.filter(item => item.file !== previous);
      if (!choices.length) choices = collection;
      const item = choices[Math.floor(Math.random() * choices.length)];
      try { localStorage.setItem(key, item.file); } catch (_) {}
    const figure = document.createElement('figure'); figure.className = 'home-art ' + positions[item.position];
    const image = document.createElement('img'); image.src = window.SiteAssets.url(item.file); image.alt = item.alt || ''; image.loading = 'lazy';
    if (item.width && item.height) { image.width = item.width; image.height = item.height; }
    image.addEventListener('error', () => figure.remove(), { once: true });
    figure.append(image);
    if (item.caption) { const caption = document.createElement('figcaption'); caption.textContent = item.caption; figure.append(caption); }
    collage.append(figure);
    });
  }
}).catch(() => {});
