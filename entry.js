document.addEventListener('DOMContentLoaded', async () => {
  const title = document.getElementById('entry-title');
  const body = document.getElementById('entry-body');
  const path = new URLSearchParams(location.search).get('path');
  try {
    const res = await fetch(window.SiteAssets.url('content-index.json')); if (!res.ok) throw new Error('Archive content is unavailable.');
    const entries = await res.json(); const entry = entries.find(item => item.path === path);
    if (!entry) throw new Error('This entry is not in the content archive.');
    document.title = entry.title + ' — Musi'; title.textContent = entry.title;
    document.getElementById('entry-meta').textContent = [entry.date, entry.status].filter(Boolean).join(' · ');
    document.getElementById('entry-summary').textContent = entry.section === 'projects' ? entry.summary : '';
    const sourceURL = new URL(window.SiteAssets.url(entry.path)); sourceURL.pathname = sourceURL.pathname.slice(0, sourceURL.pathname.lastIndexOf('/') + 1);
    window.Notebook.render(entry.body, body, { margin: false, basePath: sourceURL.href });
    if (entry.section) {
      const art = await window.IllustrationTools.forEntryMany(entry, 3);
      const rail = document.getElementById('entry-illustration');
      const layout = document.querySelector('.entry-layout');
      if (art.length && rail && layout) {
        art.forEach((item, index) => {
          const figure = window.IllustrationTools.figure(item, 'marginal-illustration rail-sketch entry-margin-sketch', entry.path + '-' + index);
          if (figure) rail.append(figure);
        });
        if (rail.childElementCount) {
          rail.hidden = false;
          layout.classList.add('entry-layout--illustrated', 'entry-layout--art-right');
        }
      }
    }
  } catch (err) {
    console.error('Could not load archive entry.', err);
    body.textContent = 'This entry could not be loaded. Please return to the archive and try again.';
  }
});
