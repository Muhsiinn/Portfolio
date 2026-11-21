# Portfolio

My personal portfolio and digital field notebook: projects, writing, reading notes, and small observations.

Built with Eleventy, Nunjucks, Markdown, CSS, and vanilla JavaScript.

## Run locally

```bash
npm install
npm run serve
```

`npm run build` creates the production site in `_site/`, excluding drafts.

## Content

Add Markdown under `src/projects/` and `src/thoughts/`. Filenames determine page URLs, and front matter is optional. See `CONTENT_GUIDE.md` for where writing goes and `ASSET_GUIDE.md` for images. `_site/` is generated output; `artwork/` is an unpublished image archive.

## Deployment

Pushes to the `Portfolio-` branch build and deploy to GitHub Pages through `.github/workflows/static.yml`.
