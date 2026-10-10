document.addEventListener('DOMContentLoaded', async () => {
  const target = document.getElementById('about-content');
  try {
    const response = await fetch(window.SiteAssets.url('content/about.md')); if (!response.ok) throw new Error('About note unavailable.');
    const source = (await response.text()).replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    window.Notebook.render(source, target, { margin: false, basePath: window.SiteAssets.url('content/') });
    const art = await window.IllustrationTools.forSectionMany('about', 3);
    const rail = document.querySelector('.page-rail');
    if (rail) art.forEach((item, index) => {
      const figure = window.IllustrationTools.figure(item, 'marginal-illustration rail-sketch section-sketch', 'about-' + index);
      if (figure) rail.append(figure);
    });
  } catch (error) {
    console.error('Could not load About content.', error);
    target.textContent = 'This page could not be loaded. Please try again later.';
  }
});
