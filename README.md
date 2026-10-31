# Muhsin's Digital Field Notebook

A small static personal site made with Eleventy, Nunjucks, Markdown, CSS, and a little vanilla JavaScript. It is a readable field notebook for projects, observations, and questions in progress.

## Run locally

    npm install
    npm run serve

Eleventy serves the site locally and includes draft previews. npm run build creates the production site in _site/, excluding drafts. The deployment workflow builds on pushes to Portfolio- and deploys to GitHub Pages.

## Content

Create Markdown files directly in src/projects/ or src/notes/. Their filenames determine their page URLs. There is no content registry to update. See CONTENT_GUIDE.md for front matter, examples, drafts, archiving, images, and publishing.

## Site details

- Eleventy collections generate project and note listings from Markdown files.
- KaTeX renders math; fenced code remains intact and receives syntax highlighting.
- feed.xml and sitemap.xml are generated from published content.
- Light and dark themes follow the system on first visit and remember a manual choice.
- Static files and stylesheets are served locally; no third-party scripts or runtime APIs are required.

The repository is https://github.com/Muhsiinn/portfolio. Its current Pages base path is /portfolio/; update pathPrefix in .eleventy.js, the site URL in src/_data/site.json, and src/robots.txt if Pages moves to a custom domain.

## Preserved files

Existing project and writing content now lives under src/. Original artwork and source images remain in images/, with selected web-ready assets copied into src/assets/images/. CV utilities and their generated PDFs remain separate from the website. ARTWORK_CREDITS.md preserves the former illustration manifest. A full pre-reconstruction snapshot was saved outside this repository during the rebuild.


## Local Publishing Desk

A separate sibling application in `../notebook-dashboard` manages project, daily note, article, and image Markdown sources. It is not part of this site's build. Start it from that directory with `npm install` and `npm run dashboard`; see its README for local setup and safe Git synchronization.
