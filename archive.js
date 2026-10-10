(async function () {
  const host = document.querySelector('[data-section]');
  if (!host) return;
  const section = host.dataset.section;
  const labels = { ai: 'Artificial Intelligence', 'neuroscience-psychiatry': 'Neuroscience and Psychiatry', other: 'Other Software' };
  // Reorder the project sections here; the page jump links follow this order too.
  const projectGroupOrder = ['Neuroscience and Psychiatry', 'Artificial Intelligence', 'Other Software'];
  try {
    const response = await fetch(window.SiteAssets.url('content-index.json'));
    if (!response.ok) throw new Error('Archive index is unavailable.');
    const entries = (await response.json()).filter(item => item.section === section);
    if (section !== 'projects') addSectionIllustration(section);
    if (!entries.length) {
      const note = document.createElement('p'); note.className = 'empty-note';
      note.textContent = section === 'research' ? 'No research notes yet.' : 'No entries yet.';
      host.append(note); return;
    }
    if (section === 'projects') {
      const groups = new Map();
      entries.forEach(item => { const key = item.subsection || 'Other Software'; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(item); });
      const rank = name => {
        const index = projectGroupOrder.indexOf(name);
        return index < 0 ? projectGroupOrder.length : index;
      };
      const orderedGroups = [...groups.entries()].sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b));
      const navList = document.querySelector('.page-rail ul');
      if (navList) {
        const links = new Map([...navList.querySelectorAll('a[href^="#"]')].map(link => [link.getAttribute('href').slice(1), link.closest('li')]));
        for (const name of projectGroupOrder) {
          const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          if (links.has(id)) navList.append(links.get(id));
        }
      }
      for (const [name, items] of orderedGroups) {
        const key = Object.keys(labels).find(k => labels[k] === name) || 'other';
        const group = document.createElement('section'); group.className = 'project-group'; group.id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const heading = document.createElement('h2'); heading.className = 'page-title'; heading.style.fontSize = '1.65rem'; heading.textContent = name;
        const headingRow = document.createElement('div'); headingRow.className = 'project-group-head';
        const rail = document.querySelector('.page-rail');
        const art = await window.IllustrationTools.forSectionMany(key, 2);
        if (rail) art.forEach((item, index) => {
          const figure = window.IllustrationTools.figure(item, 'marginal-illustration rail-sketch section-sketch', name + '-' + index);
          if (figure) rail.append(figure);
        });
        headingRow.append(heading); group.append(headingRow);
        const list = document.createElement('div'); list.className = 'archive-list'; items.forEach(item => list.append(buildEntry(item))); group.append(list); host.append(group);
      }
    } else entries.forEach(item => host.append(buildEntry(item)));
  } catch (error) {
    console.error('Could not load archive entries.', error);
    const p = document.createElement('p'); p.className = 'empty-note'; p.textContent = 'Entries could not be loaded. Please try again later.'; host.replaceChildren(p);
  }
})();

async function addSectionIllustration(section) {
  try {
    const items = await window.IllustrationTools.forSectionMany(section, 3);
    if (!items.length) return;
    const rail = document.querySelector('.page-rail'); if (!rail) return;
    items.forEach((item, index) => {
      const figure = window.IllustrationTools.figure(item, 'marginal-illustration rail-sketch section-sketch', section + '-' + index);
      if (figure) rail.append(figure);
    });
  } catch (_) { /* illustrations are optional */ }
}

function buildEntry(item) {
  const article = document.createElement('article'); article.className = 'archive-entry'; article.id = item.slug;
  const meta = document.createElement('p'); meta.className = 'entry-meta';
  meta.textContent = [item.date, item.status].filter(Boolean).join(' · ');
  if (meta.textContent) article.append(meta);
  const h = document.createElement('h2'); const link = document.createElement('a');
  link.href = 'entry.html?path=' + encodeURIComponent(item.path); link.textContent = item.title; h.append(link); article.append(h);
  if (item.summary) { const p = document.createElement('p'); p.textContent = item.summary; article.append(p); }
  if (item.status) { const status = document.createElement('span'); status.className = 'entry-status'; status.textContent = item.status; article.append(status); }
  if (item.technologies && item.technologies.length) { const tech = document.createElement('p'); tech.className = 'entry-tech'; tech.textContent = item.technologies.join(' · '); article.append(tech); }
  const links = Object.entries(item.links || {});
  if (links.length) { const row = document.createElement('div'); row.className = 'entry-links'; links.forEach(([label, url]) => { const a = document.createElement('a'); a.href = url; a.textContent = label; a.target = '_blank'; a.rel = 'noopener noreferrer'; row.append(a); }); article.append(row); }
  return article;
}
