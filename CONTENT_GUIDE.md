# Thoughts content guide

Markdown files under `src/thoughts/` are the writing database. Eleventy discovers entries from their category directories; there is no registry to update.

## Categories and paths

- Blogs: `src/thoughts/blogs/` for essays, technical articles, explanations, and reflections.
- Reading Notes: `src/thoughts/reading/` for notes connected to books, papers, articles, and other sources.
- Notes: `src/thoughts/notes/` for observations and small discoveries.
- Daily Notes: `src/thoughts/notes/daily/YYYY-MM-DD.md`, one file for each date. Add all entries for that day to the existing file.

Each category has a listing at `/thoughts/blogs/`, `/thoughts/reading/`, or `/thoughts/notes/`. The overview is `/thoughts/`; daily notes have an archive at `/thoughts/notes/daily/`.

## Front matter

Every entry needs a title and description. Date, tags, draft, and archived are optional and default to sensible empty/false values.

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

Reading notes can additionally use `sourceTitle`, `sourceAuthor`, `sourceType`, `sourceUrl` (URL or DOI), `chapter`, `pages`, and `dateRead`. Put your own annotations and attributed quotations in the Markdown body, with clear attribution to the original source.

## Write and manage entries

Create a `.md` file in the appropriate category directory, add front matter, then write normal Markdown. The filename supplies the URL slug. The local Publishing Desk can create, edit, preview, archive, restore, and delete these files too.

- `draft: true` hides an entry and its listing/RSS/sitemap output in production. Local Eleventy previews can show drafts.
- `archived: true` hides an entry from normal category listings and feeds while retaining its individual page. Set it back to `false` to restore it.
- Delete the Markdown file to remove its generated page and links on the next build.
- Add `featured: true` to a project to show it in the homepage featured list.
- Existing public `/notes/.../` addresses are retained for migrated entries through `legacyPermalink` metadata.
- Files in `src/thoughts/review/` are preserved migration items whose category is unclear. Review and move them into a category manually; they are never published.

## Daily notes

Use the dashboard calendar or create `src/thoughts/notes/daily/2026-10-31.md`. The date in the filename is canonical. A second save for the same date edits the existing file. Do not create a second date file.

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

Run the dashboard from its sibling checkout with `npm run dashboard`, or preview/build the public website in this repository with `npm run serve` / `npm run build`. Saving in the dashboard writes local Markdown only. Review changes in Sync & History and explicitly choose a commit message and sync action to commit and push.

The public site deploys through GitHub Actions. Enable GitHub Pages → Build and deployment → GitHub Actions in repository settings if it is not already configured.
