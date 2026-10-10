# Musi.

A static personal archive of research, software projects, writing, and brief observations. Content is written in Markdown, committed to Git, and published through GitHub Pages. There is no website editor, database, API backend, AI service, or image-processing feature.

## Repository map

- `content/research/` — investigations, scientific questions, mathematical notes, and reading-informed work.
- `content/projects/ai/` — AI and neural-network software.
- `content/projects/neuroscience-psychiatry/` — computational neuroscience, psychiatry, and brain-inspired software.
- `content/projects/other/` — other software projects.
- `content/thoughts/` — personal writing and unfinished arguments.
- `content/blog/` — longer posts.
- `content/scrapper.md` — quick observations and questions, in their written order.
- `content/scrapper/` — titled short notes, automatically listed on the Scrapper page.
- `content/about.md` — the About page.
- `content/illustrations.md` — image captions, credits, alt text, fixed slots, and exclusions.
- `images/` — visual assets, separated into matching section folders.
- `scripts/build.py` — validates metadata and illustration references, discovers content/assets, and builds `_site/`.

The old JSON files and CV utilities remain in the repository for the separate CV workflow. The website is built from `content/` and `images/`, not those legacy project/blog JSON indexes.

## Add a Markdown page

Create a `.md` file in the relevant section directory. Blog, Research, Thoughts, project subsections, and `content/scrapper/` are discovered automatically at build time. Begin each page with JSON-compatible YAML frontmatter (ordinary JSON is valid YAML), then write Markdown below the closing delimiter:

```markdown
---
{
  "title": "A short title",
  "date": "2026-10-10",
  "summary": "Optional one-sentence index description."
}
---

The body is ordinary Markdown. Add equations with `$...$` or `$$...$$`,
code fences, tables, citations, links, and images as needed.
```

The build discovers pages recursively. No application component or hand-maintained index needs editing. Research, Thoughts, and Blog support `title`, `date`, and `summary`. Project pages should also use `status`, `technologies`, `description`, and `links`:

```json
{
  "title": "Fortran Neural Network Library",
  "status": "IN PROGRESS",
  "technologies": ["Fortran", "Neural networks"],
  "description": "A neural network library written in Fortran, currently in progress.",
  "links": {}
}
```

Keep statuses accurate: `COMPLETED`, `IN PROGRESS`, `EXPERIMENTAL`, or `PLANNED`. The existing project entries were transferred from the previous site records; the Fortran library remains marked `IN PROGRESS`.

### Markdown features

The shared read-only renderer supports GFM Markdown, tables, lists, code highlighting, KaTeX inline/display equations, Mermaid diagrams, captions, and image layout metadata. Equations and code remain source text in Markdown; plots, diagrams, screenshots, and embedded images are not altered.

Images use paths relative to their Markdown file. For example, from `content/research/note.md`, `../../images/research/brain.png` resolves to the public image folder. Standard Markdown alt text is retained for accessibility; captions and layout are optional:

```markdown
![Graphite neuron study](../../images/research/neuron.png "notebook:align=right;width=40;caption=Cell study")
```

Supported alignment is `left`, `right`, or `center`; widths use fixed percent presets. Captions are URL encoded when they contain spaces (for example, `caption=Cell%20study`). A normal Markdown image without this title syntax renders at its authored position, centered and responsive. Add as many images as needed in a page; source files are never changed by rendering.

For a page's optional outer-margin illustration, add an `illustrations` array to its frontmatter using paths relative to `images/`, such as `"illustrations": ["thoughts/mountain-walk.webp"]`. The asset must live in the appropriate `images/` folder and have a record in the TOML section of `content/illustrations.md` if it needs an alt-text override, credit, or page/section association. Inline Markdown images remain separate from this decorative selection.

The homepage brain stays fixed in its existing slot. To add a separate homepage study without changing a template, put it in `images/home/` and add an illustration record with `section = "home"` and a `position` of `left-margin`, `right-margin`, `lower-left`, or `lower-right`. Supply `alt`, and add `width` and `height` so the page can reserve space. The illustration is placed in the existing collage; it does not replace or rotate the brain. Section collections are discovered from their folders and selected from `content/illustrations.md`; entry-level `illustrations` metadata can narrow an individual page to specific files.

External rendering libraries (Marked, DOMPurify, Highlight.js, KaTeX, and Mermaid) are loaded from public CDNs. If those services are unavailable, source content remains readable, though enhanced rendering may be absent.

## Scrapper

Append one-line observations to `content/scrapper.md` for a quick, ordered stream. For a titled short note or question with its own page, save a Markdown file inside `content/scrapper/`; it appears automatically in the Scrapper list and opens as a normal archive page. Dates and tags are optional. For example, this is a format suggestion, not published sample content:

```markdown
- 2026-10-10 #reading A question to return to later.
- Could this observation be tested with a small simulation?
```

Entries stay in the order written. Scrapper is not a submission form and does not expand entries.

## Illustrations and image folders

Drop assets into the matching folder under `images/`: `home/`, `research/`, `projects/ai/`, `projects/neuroscience-psychiatry/`, `projects/other/`, `thoughts/`, `blog/`, `scrapper/`, or `about/`. Agent-generated originals can be kept in `images/generated/`; place a selected, web-ready image in one of its named section folders (for example, `images/generated/ai/`) and the build will discover, index, and publish it automatically. The full-resolution PNG archive directly inside `images/generated/` is kept out of the deployment. Supported image types are `.jpg`, `.jpeg`, `.png`, `.webp`, and `.svg`. The build does not publish the repository's `references/` directory or loose legacy images at the top of `images/`.

Most discovered images can be associated with a section by folder alone. Generated section folders are `images/generated/home/`, `research/`, `ai/`, `neuroscience-psychiatry/`, `other/`, `thoughts/`, `blog/`, `scrapper/`, and `about/`. Add a record in the TOML code fence in `content/illustrations.md` when you want a caption, credit, alt-text override, fixed placement, page-specific selection, or exclusion from rotation. For example:

```toml
[[illustration]]
file = "research/neuron.png"
section = "research"
alt = "Pencil drawing of a neuron"
caption = "Cell study"
credit = "Original drawing"
```

For a generated file, use its path under `images/`, such as `file = "generated/ai/soft-network.png"`. The build includes generated artwork in the section index and copies only named section folders into `_site`; raw source PNGs and the contact sheet remain in the repository but are not shipped to visitors. No component changes are needed when adding artwork.

For an individual Markdown entry, set `page = "note-filename"` using the entry filename without `.md`. `exclude = true` keeps an image out of section rotation. Homepage decoration is selected separately from section rotation.

Homepage collage items use named `slot` values (`home-brain`, `home-poppy`, `home-writer`, `portrait`). The brain is a fixed slot and never rotates. Replace the brain asset at `images/home/brain-study.webp` and keep its manifest slot to change it. The collage uses compressed WebP versions for faster loading; original PNG source files remain in the repository. The included brain sketch is newly created artwork inspired by the reference, not an exact copy. The writer image is an imagined figure, not Sylvia Plath. The profile JPG is intentionally not shown on the homepage.

Section illustrations are optional; nothing appears when a section has no associated asset. Where multiple candidates exist, a section illustration can rotate on page visits without an animation. The original Markdown image references are separate from this illustration library and are never replaced with a rotating image.

Decorative artwork for Research, Projects, Blog, and Scrapper is discovered in the corresponding `images/` folders. Project subsection art stays within its matching category. Individual project, research, blog, and Scrapper pages use their section collection, or a page-specific image when `page = "entry-filename"` is set in the manifest. A project can use a narrower set with `projects = ["project-filename"]` on illustration records, or an `illustrations` array of paths relative to `images/` in its JSON frontmatter. Selection changes across visits, while placement is stable during reading. Decorative SVG studies have empty alt text; add descriptive alt text when an image carries information. The older labeled SVGs remain in the project folders but are excluded from decorative rotation so authored technical figures can stay accurate.

The build prints a warning for a manifest file that cannot be found. Unsupported file types are ignored.

## Local preview

Requires Python 3.11+ (standard library only):

```sh
python3 scripts/build.py
python3 -m http.server 8080 --directory _site
```

Then open <http://localhost:8080>. The build also writes ignored `content-index.json` and `illustrations-index.json` files beside the source HTML, so serving the repository root works too. Re-run the build after changing Markdown, images, or the illustration manifest. `_site/` and both indexes are generated and ignored by Git.

## Publish

Push to the `Portfolio-` branch. `.github/workflows/static.yml` runs `python3 scripts/build.py` and deploys `_site/` to GitHub Pages. The site uses relative paths and does not need a private backend or API credentials. Run the same build locally before committing to catch malformed metadata and unresolved illustration references.

## Visual reference and verification

The checked-in design reference is stored locally in `references/` and is excluded from deployment. Production illustrations are separate assets in `images/home/`. The build script checks frontmatter and illustration manifest paths; there is no browser editor or external service to configure.
