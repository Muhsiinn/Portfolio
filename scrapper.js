document.addEventListener('DOMContentLoaded', async () => {
  const target = document.getElementById('scrapper-content');
  try {
    const res = await fetch(window.SiteAssets.url('content/scrapper.md')); if (!res.ok) throw new Error('Scrapper file is missing.');
    const markdown = (await res.text()).replace(/<!--[\s\S]*?-->/g, '').trim();
    if (!markdown) { const p = document.createElement('p'); p.className = 'empty-note'; p.textContent = 'Nothing recorded here yet.'; target.append(p); return; }
    window.Notebook.render(markdown, target, { margin: false, basePath: window.SiteAssets.url('content/') });
  } catch (error) {
    console.error('Could not load Scrapper notes.', error);
    target.textContent = 'These notes could not be loaded. Please try again later.';
  }
});
