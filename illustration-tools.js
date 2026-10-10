/* Shared, quiet illustration selection for archive pages and project entries. */
(function () {
  let cached;
  const assetURL = path => window.SiteAssets
    ? window.SiteAssets.url(path)
    : new URL(String(path).replace(/^\//, ''), new URL('.', location.href)).href;
  async function all() {
    if (!cached) cached = fetch(assetURL('illustrations-index.json')).then(response => response.ok ? response.json() : []);
    return cached;
  }
  function read(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function shuffled(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function chooseMany(items, key, limit = 3, avoidKey = '') {
    if (!items.length) return [];
    let previous = [];
    try { previous = JSON.parse(read(key) || '[]'); } catch (_) {}
    if (!Array.isArray(previous)) previous = [];
    const avoid = new Set([...previous, read(avoidKey)].filter(Boolean));
    const picked = shuffled(items.filter(item => !avoid.has(item.file))).slice(0, limit);
    if (picked.length < limit) {
      const used = new Set(picked.map(item => item.file));
      picked.push(...shuffled(items.filter(item => !used.has(item.file))).slice(0, limit - picked.length));
    }
    write(key, JSON.stringify(picked.map(item => item.file)));
    if (avoidKey && picked.length) write(avoidKey, picked[picked.length - 1].file);
    return picked;
  }
  function generic(item) { return !item.exclude && !item.fixed && !item.page && !item.projects; }
  async function forSectionMany(section, limit = 3) {
    const items = (await all()).filter(item => item.section === section && generic(item));
    return chooseMany(items, 'musi-section-art-' + section, limit);
  }
  async function forEntryMany(entry, limit = 3) {
    const items = (await all()).filter(item => !item.exclude && !item.fixed);
    const declared = (Array.isArray(entry.illustrations) ? entry.illustrations : [])
      .map(path => 'images/' + String(path).replace(/^\/?(?:images\/)?/, ''));
    const associated = items.filter(item => item.page === entry.path || item.page === entry.slug || declared.includes(item.file) || (entry.section === 'projects' && Array.isArray(item.projects) && item.projects.includes(entry.slug)));
    let candidates = associated;
    if (!candidates.length && entry.section === 'projects') {
      const section = entry.path.includes('/projects/ai/') ? 'ai' : entry.path.includes('/projects/neuroscience-psychiatry/') ? 'neuroscience-psychiatry' : 'other';
      const paths = Array.isArray(entry.illustrations) ? entry.illustrations : [];
      candidates = paths.length ? items.filter(item => paths.some(path => item.file === 'images/' + path.replace(/^images\//, ''))) : [];
      if (!candidates.length) candidates = items.filter(item => item.section === section && generic(item));
    } else if (!candidates.length) {
      candidates = items.filter(item => item.section === entry.section && generic(item));
    }
    const key = 'musi-entry-art-' + entry.section + '-' + entry.slug;
    return chooseMany(candidates, key, limit, 'musi-entry-art-last-' + entry.section);
  }
  function figure(item, className, placementKey) {
    if (!item) return null;
    const node = document.createElement('figure'); node.className = className;
    const image = document.createElement('img'); image.src = assetURL(item.file); image.alt = item.alt || ''; image.loading = 'lazy';
    if (item.width && item.height) { image.width = item.width; image.height = item.height; }
    image.addEventListener('error', () => {
      console.warn('Notebook illustration could not be loaded:', image.src);
      const region = node.parentElement;
      node.remove();
      if (region && region.id === 'entry-illustration') {
        if (!region.querySelector('img')) {
          region.hidden = true;
          const layout = region.closest('.entry-layout');
          if (layout) layout.classList.remove('entry-layout--illustrated', 'entry-layout--art-left', 'entry-layout--art-right');
        }
      }
    }, { once: true });
    node.append(image);
    if (item.caption) { const caption = document.createElement('figcaption'); caption.textContent = item.caption; node.append(caption); }
    if (placementKey) {
      node.dataset.placement = 'right';
      let hash = 0; const value = placementKey + ':' + item.file;
      for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
      node.dataset.offset = ['upper', 'middle', 'lower'][Math.abs(hash) % 3];
    }
    return node;
  }
  window.IllustrationTools = {
    all,
    forSectionMany,
    forEntryMany,
    forSection: async section => (await forSectionMany(section, 1))[0] || null,
    forEntry: async entry => (await forEntryMany(entry, 1))[0] || null,
    figure
  };
})();
