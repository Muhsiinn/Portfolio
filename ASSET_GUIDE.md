# Asset guide

There are only **two** image folders. Use this table and you never have to guess:

| Folder | Put here | Published? |
| --- | --- | --- |
| `src/assets/images/` | Any image that appears on a page | **Yes.** Served at `/assets/images/...` |
| `artwork/` | Originals, drafts, generated experiments, anything not on a page | **No.** Ignored by the build |

Do not put images in `_site/` (generated output, wiped on every build) or `references/` (local design references, git-ignored).

## Using an image on the site

1. Copy the file into a section folder under `src/assets/images/`:

   - `home/` — homepage
   - `about/` — about page, portrait
   - `projects/` — project pages (optionally `projects/ai/`, `projects/neuroscience-psychiatry/`, etc.)
   - `thoughts/` — notes, blogs, reading notes

   You can create a new section folder when you need one. The public URL always mirrors the path after `src/assets/`.

2. Reference it with a root-relative URL starting with `/assets/images/`:

   ```md
   ![Musi outdoors beside a lake](/assets/images/about/profile.jpg "notebook:caption=Musi")
   ```

3. Run `npm run build`.

Always write useful alt text: describe what the image shows, not "image of ...".

The `notebook:` title is optional and has only two recognised values:

- `caption=` — a line under the image
- `credit=` — a smaller line under the caption

Separate them with `;`. Values such as `align=` and `width=` are leftovers from the old site; they do nothing, so don't add them.

Eleventy reads the image dimensions for files inside `src/assets/images/` and adds `width`, `height`, `loading="lazy"`, and `decoding="async"` automatically. WebP and SVG are preferred; keep filenames short, lowercase, and hyphenated.

## The artwork archive

`artwork/` holds full-resolution originals and generated experiments carried over from the old site. Nothing there is copied into the published site, and its old section folders are just an archive — you do not need to maintain them.

To use an archived image, **copy** it from `artwork/` into the right `src/assets/images/` folder and reference the new path. Keep the original in `artwork/` untouched.

`ARTWORK_CREDITS.md` is a historical record of the old illustration system. The build does not read it. For live images, put the credit in the `notebook:credit=` value of the image reference.

## Other assets

Everything under `src/assets/` is copied as-is to `_site/assets/`:

- `src/assets/css/` — stylesheets and fonts
- `src/assets/js/` — JavaScript
- `src/assets/images/` — published images
