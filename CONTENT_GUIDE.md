# Content guide

Everything you write lives under `src/`. Nothing you write belongs in `_site/` — that folder is generated output and is wiped on every build.

## Where to put a new file

| What you're writing | Put the file in | Page URL |
| --- | --- | --- |
| A project | `src/projects/` | `/projects/<filename>/` |
| An essay or longer reflection | `src/thoughts/blogs/` | `/thoughts/blogs/<filename>/` |
| A note about a book, paper, or article | `src/thoughts/reading/` | `/thoughts/reading/<filename>/` |
| A short observation, letter, or discovery | `src/thoughts/notes/` | `/thoughts/notes/<filename>/` |
| One day's entries | `src/thoughts/notes/daily/YYYY-MM-DD.md` | `/thoughts/notes/daily/YYYY-MM-DD/` |
| An image used on a page | `src/assets/images/` | `/assets/images/...` |

Quick rule: **finished thought → Blogs; tied to a source → Reading Notes; small thought → Notes.**

Folders that are *not* for new writing:

- `src/thoughts/review/` — a migration holding area. Items here are never published. Don't add new entries.
- `artwork/` — unpublished image originals. See `ASSET_GUIDE.md`.
- `references/` — local design references, git-ignored.
- `scripts/`, `src/_includes/`, `src/_data/` — site code.

Subfolders inside a category are fine, except daily notes: those stay as `YYYY-MM-DD.md` files directly in `src/thoughts/notes/daily/`.

## Paste and go

You can paste a plain Markdown file into a category folder without adding front matter first. The site fills in sensible defaults:

- **Title**: the first Markdown heading (for example `# My note`), otherwise the filename.
- **Description**: the first paragraph of the file.
- **Date**: the date in the filename for daily notes, otherwise the file's date.
- **Type**: supplied by the category folder itself.

Only add front matter when you want to override those defaults, set tags, hide a draft, or add reading-source metadata. A bare file like this is enough:

```md
# A pasted observation

The first paragraph becomes the description automatically.

Everything below is normal Markdown.
```

## Terminal shortcut

`scripts/pnt.sh` adds pasted Markdown to the right folder and rebuilds. Add this alias to `~/.bashrc` (or `~/.zshrc`) and restart the shell:

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

With no file argument, `p-n-t` reads `markdown.md` if it exists; use `p-n-t --stdin` to force pasting. It adds simple title/date front matter when none is present. `--no-build` saves without rebuilding, and `-t "Title"` overrides the derived title. Run `p-n-t --help` for all options.

## Front matter

Front matter is optional. When you include it, `title` and `description` are recommended but not required; missing values are derived from the heading, filename, and first paragraph. `date`, `tags`, `draft`, and `archived` default to the file date, no tags, `false`, and `false`.

Tags do **not** control whether an entry appears on the site. Every published entry appears in its category listing, the `/thoughts/` overview, and the homepage "Recent writing" section even with no tags. Tags only pin items to the optional "Currently working on" and "Currently reading / hyperfixating" sections.

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

Reading notes can also use `sourceTitle`, `sourceAuthor`, `sourceType`, `sourceUrl` (URL or DOI), `chapter`, `pages`, and `dateRead`. Put your own annotations and attributed quotations in the Markdown body.

Two common front matter mistakes:

- `---` must be the **very first line** of the file. A blank line before it makes Eleventy treat the front matter as body text, so the header will show the filename and the raw `---` lines instead of your title and description.
- `date` must be a real date in `YYYY-MM-DD` form (for example `2026-11-21`). Values like `ongoing` are not dates. If you don't care about the date, leave the `date` line out and the file's date is used.

- Add `working` to a project or reading note to show it in the homepage "Currently working on" section.
- Add `currently-reading` or `hyperfixating` to a reading note for the homepage reading section.
- `draft: true` hides an entry and its listing/RSS/sitemap output in production. Local previews can show drafts.
- `archived: true` hides an entry from normal listings and feeds but keeps its individual page and lists it under `/thoughts/archive/`. Set it back to `false` to restore it.
- Delete the Markdown file to remove its page and links on the next build.

## Daily notes

Use `p-n-t --daily` or create `src/thoughts/notes/daily/2026-10-31.md`. The date in the filename is canonical. A second save for the same date edits the existing file; do not create a second date file.

A daily note needs no front matter. The filename supplies the date, and the category supplies its title, layout, and URL. Omit `draft` or set `draft: false` to publish it.

## Images, math, and code

Put images under `src/assets/images/` and reference them as `![Musi outdoors beside a lake](/assets/images/about/profile.jpg)`. See `ASSET_GUIDE.md`.

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

## If a file does not appear

1. Confirm it is under `src/thoughts/...` or `src/projects/`, not `_site/...`.
2. Confirm it ends in `.md`.
3. Check `draft: true` and `archived: true` in its front matter.
4. Run `npm run build` and read the terminal for an error.

As a safety net, `npm run build` looks for stray Markdown files in `_site/` and moves them into the matching `src/` folder before rebuilding. This protects accidental pastes, but editing `src/` directly is the reliable way.

## Preview and publish

- `npm run serve` — local preview server
- `npm run build` — production build into `_site/`, excluding drafts

The public site deploys through GitHub Actions. Enable GitHub Pages → Build and deployment → GitHub Actions in repository settings if it is not already configured. Use Git from your terminal to commit and push changes.
