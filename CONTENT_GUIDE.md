# Thoughts content guide

Markdown files under `src/thoughts/` are the writing database. Eleventy discovers entries from their category directories; there is no registry to update.

`_site/` is generated output. Never paste or edit content there: every build replaces it. Add Markdown files under `src/` instead. If a file seems to disappear, check that it is in `src/thoughts/...`, not `_site/thoughts/...`.

As a safety net, `npm run build` looks for stray Markdown files (`.md`, `.markdown`, and similar extensions) in `_site/` and moves them into the matching `src/thoughts/...` or `src/projects/...` folder before rebuilding. Subfolders and extensions are kept. The move is printed in the terminal, and the build refuses to clean `_site/` if any Markdown file cannot be rescued. This protects accidental pastes, but editing `src/` directly is still the reliable way to update content.

## Paste and go

You can paste a normal Markdown file into a category folder without adding front matter first. The site fills in sensible defaults:

- **Title**: the first Markdown heading (for example `# My note`), otherwise the filename.
- **Description**: the first paragraph of the file.
- **Date**: a date in the filename for daily notes, otherwise the file's date.
- **Type**: supplied by the category folder itself.

You only need front matter when you want to override those defaults, set tags, mark something as a draft, or add reading-source metadata. A bare file like this is enough:

```md
# A pasted observation

The first paragraph becomes the description automatically.

Everything below is normal Markdown.
```

Subfolders inside a category are supported, except daily notes, which stay as `YYYY-MM-DD.md` files in `src/thoughts/notes/daily/`.

## Terminal shortcut

`scripts/pnt.sh` adds pasted Markdown to the site. Add this alias to `~/.bashrc` (or `~/.zshrc`) and restart the shell:

```bash
alias p-n-t="$HOME/D/Github/Portfolio/scripts/pnt.sh"
```

Then use it from any directory:

```bash
p-n-t                        # paste Markdown, then press Ctrl+D
p-n-t markdown.md            # add a Markdown file
p-n-t --blog                 # add to Blogs
p-n-t --reading              # add to Reading Notes
p-n-t --daily                # add to Daily Notes
p-n-t --project              # add to Projects
p-n-t --url https://...      # fetch Markdown or a web page
```

With no file argument, `p-n-t` reads `markdown.md` if it exists; use `p-n-t --stdin` to force pasting instead. It writes the file under `src/`, adds a simple title/date front matter when one is missing, and runs `npm run build`. `--no-build` saves without rebuilding, and `-t "Title"` overrides the derived title.

## Categories and paths

- Blogs: `src/thoughts/blogs/` for essays, technical articles, explanations, and reflections.
- Reading Notes: `src/thoughts/reading/` for notes connected to books, papers, articles, and other sources.
- Notes: `src/thoughts/notes/` for observations and small discoveries.
- Daily Notes: `src/thoughts/notes/daily/YYYY-MM-DD.md`, one file for each date. Add all entries for that day to the existing file.

Each category has a listing at `/thoughts/blogs/`, `/thoughts/reading/`, or `/thoughts/notes/`. The overview is `/thoughts/`; daily notes have an archive at `/thoughts/notes/daily/`.

Empty sections do not disappear. They show a small placeholder — “Musi is too lazy to fix/update this section.” — until you add an entry. The text lives in `src/_data/site.json` as `emptySection` if you ever want to change it.

## Front matter

Front matter is optional. When you include it, `title` and `description` are recommended but no longer required; missing values are derived from the heading, filename, and first paragraph. `date`, `tags`, `draft`, and `archived` default to the file date, no tags, `false`, and `false`.

Tags do **not** control whether an entry appears on the site. Every published entry appears in its category listing, the `/thoughts/` overview, and the homepage “Recent writing” section even with no tags. Tags only pin items to the optional “Currently working on” and “Currently reading / hyperfixating” sections.

```yaml
---
title: "A title"
description: "A short plain-language summary."
date: 2026-10-31
tags:
  - neuroscience
draft: true
archived: false
---
```

`tags` can be a YAML list or a comma-separated string, so both `tags: [psychology, reading]` and `tags: psychology, reading` work.

Reading notes can additionally use `sourceTitle`, `sourceAuthor`, `sourceType`, `sourceUrl` (URL or DOI), `chapter`, `pages`, and `dateRead`. Put your own annotations and attributed quotations in the Markdown body, with clear attribution to the original source.

## Write and manage entries

Create or paste a `.md` file in the appropriate category directory. Front matter is optional; add it only when you need to override the defaults above. The filename supplies the URL slug. The local Publishing Desk can create, edit, preview, archive, restore, and delete these files too.

If a new file does not appear:

1. Confirm it is under `src/thoughts/...`, not `_site/...`.
2. Confirm it ends in `.md`.
3. Check `draft: true` and `archived: true` in its front matter. New files created by the dashboard start as drafts. Set `draft: false` when the entry is ready for the public site.
4. Run `npm run build` and check the terminal for an error.

- `draft: true` hides an entry and its listing/RSS/sitemap output in production. Local Eleventy previews can show drafts.
- `archived: true` hides an entry from normal category listings and feeds while retaining its individual page. Set it back to `false` to restore it.
- Delete the Markdown file to remove its generated page and links on the next build.
- Add `working` to the `tags` list on a project or reading note to show it in the homepage “Currently working on” section. Remove the tag when it is no longer active. Draft and archived items stay out of that section in production.
- Add `currently-reading` or `hyperfixating` to a reading note to show it in the homepage reading section. These tags are independent of `working`.
- Existing public `/notes/.../` addresses are retained for migrated entries through `legacyPermalink` metadata.
- Files in `src/thoughts/review/` are preserved migration items whose category is unclear. Review and move them into a category manually; they are never published.

## Daily notes

Use the dashboard calendar or create `src/thoughts/notes/daily/2026-10-31.md`. The date in the filename is canonical. A second save for the same date edits the existing file. Do not create a second date file.

A daily note needs no front matter at all. The filename supplies its date, the title is generated from that date, and the category supplies its layout and URL. You can paste a plain Markdown file named `YYYY-MM-DD.md` straight into the daily folder. Set `draft: false` (or omit front matter) when it should be public.

## Images, math, and code

Put images under `src/assets/images/` and reference them as `![Describe the image](/assets/images/example.webp "notebook:caption=Optional caption;credit=Source")`. Use useful alternative text. The dashboard Media Library inserts these references without overwriting existing assets.

Inline math: `$x^2 + y^2 = z^2$`. Display math:

```latex
$$
\begin{aligned}
P(A \mid B) &= \frac{P(B \mid A)P(A)}{P(B)} \\
E &= mc^2
\end{aligned}
$$
```

Use fenced code blocks with a language identifier for syntax highlighting. Mathematical expressions inside fenced code remain literal code.

## Preview and publish

Run the dashboard from its sibling checkout with `npm run dashboard`, or preview/build the public website in this repository with `npm run serve` / `npm run build`. Saving in the dashboard writes local Markdown and triggers a debounced website rebuild. Use Git independently from your terminal.

The public site deploys through GitHub Actions. Enable GitHub Pages → Build and deployment → GitHub Actions in repository settings if it is not already configured.
