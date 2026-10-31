#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="${BASH_SOURCE[0]}"
while [[ -L "$SCRIPT_PATH" ]]; do
  SCRIPT_DIR="$(cd -- "$(dirname -- "$SCRIPT_PATH")" && pwd)"
  SCRIPT_PATH="$(readlink -- "$SCRIPT_PATH")"
  [[ "$SCRIPT_PATH" = /* ]] || SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT_PATH"
done
ROOT="$(cd -- "$(dirname -- "$SCRIPT_PATH")/.." && pwd)"
cd "$ROOT"

CATEGORY="notes"
TITLE=""
DATE="$(date +%F)"
DATE_SET=0
URL=""
SOURCE=""
FETCH=1
BUILD=1
FORCE_STDIN=0
FROM_SCRATCH=0
SCRATCH="$ROOT/markdown.md"

error() {
  printf 'p-n-t: %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'EOF'
Usage: p-n-t [options] [file-or-url]

Add Markdown to the portfolio site and rebuild it.

Categories (default: notes):
  -n, --note       src/thoughts/notes/
  -b, --blog       src/thoughts/blogs/
  -r, --reading    src/thoughts/reading/
  -d, --daily      src/thoughts/notes/daily/
  -p, --project    src/projects/

Input:
  p-n-t                  read markdown.md if it exists, otherwise paste Markdown
  p-n-t markdown.md      read a Markdown file
  cat note.md | p-n-t    read piped Markdown
  p-n-t --url URL        fetch Markdown or a web page
  p-n-t URL              fetch a URL if it is the only input

Options:
  -t, --title TITLE      override the derived title
      --date DATE        override the date (default: today)
      --no-fetch         do not fetch a pasted URL automatically
      --no-build         save the file without rebuilding the site
      --stdin            force pasting instead of reading markdown.md
  -h, --help             show this help

Examples:
  p-n-t
  p-n-t --reading
  p-n-t --blog markdown.md
  p-n-t --url https://example.com/essay
EOF
}

fetch_url() {
  local url="$1"

  # GitHub blob links are HTML pages; use the raw file instead.
  if [[ "$url" =~ ^https://github\.com/([^/]+)/([^/]+)/blob/(.+)$ ]]; then
    url="https://raw.githubusercontent.com/${BASH_REMATCH[1]}/${BASH_REMATCH[2]}/${BASH_REMATCH[3]}"
  fi

  if [[ "$url" =~ \.(md|markdown|mdown|mkd)(\?|#|$) ]]; then
    curl -fsSL --max-time 30 "$url"
    return
  fi

  if command -v pandoc >/dev/null 2>&1; then
    curl -fsSL --max-time 30 "$url" | pandoc -f html -t gfm --wrap=none
    return
  fi

  error "cannot convert an HTML page to Markdown. Install pandoc or use a raw .md URL."
}

yaml_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

slugify() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//' \
    | cut -c1-60 \
    | sed -E 's/-+$//'
}

front_matter_field() {
  local key="$1" file="$2"
  awk -v key="$key" '
    BEGIN { in_front_matter = 0 }
    NR == 1 && /^---[[:space:]]*$/ { in_front_matter = 1; next }
    in_front_matter && /^---[[:space:]]*$/ { exit }
    in_front_matter {
      line = $0
      sub(/\r$/, "", line)
      if (tolower(line) ~ "^" tolower(key) ":[[:space:]]*") {
        sub("^[^:]+:[[:space:]]*", "", line)
        print line
        exit
      }
    }
  ' "$file" | sed -E "s/^[[:space:]]*[\"']?//; s/[\"']?[[:space:]]*\$//"
}

while (($#)); do
  case "$1" in
    -n|--note|--notes) CATEGORY="notes"; shift ;;
    -b|--blog|--blogs) CATEGORY="blogs"; shift ;;
    -r|--reading|--readings) CATEGORY="reading"; shift ;;
    -d|--daily) CATEGORY="daily"; shift ;;
    -p|--project|--projects) CATEGORY="projects"; shift ;;
    -t|--title)
      (($# >= 2)) || error "--title needs a value"
      TITLE="$2"
      shift 2
      ;;
    --date)
      (($# >= 2)) || error "--date needs a value"
      DATE="$2"
      DATE_SET=1
      shift 2
      ;;
    -u|--url)
      (($# >= 2)) || error "--url needs a value"
      URL="$2"
      shift 2
      ;;
    --no-fetch) FETCH=0; shift ;;
    --no-build) BUILD=0; shift ;;
    --stdin) FORCE_STDIN=1; shift ;;
    -h|--help) usage; exit 0 ;;
    --)
      shift
      (($# == 0)) || SOURCE="$1"
      shift || true
      (($# == 0)) || error "only one file can be added at a time"
      break
      ;;
    -*)
      error "unknown option: $1"
      ;;
    *)
      if [[ "$1" =~ ^https?:// ]]; then
        URL="$1"
      else
        [[ -z "$SOURCE" ]] || error "only one file can be added at a time"
        SOURCE="$1"
      fi
      shift
      ;;
  esac
done

[[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || error "--date must be YYYY-MM-DD"

TMP="$(mktemp "${TMPDIR:-/tmp}/pnt.XXXXXX")"
trap 'rm -f "$TMP"' EXIT

if [[ -n "$URL" ]]; then
  printf 'Fetching %s\n' "$URL" >&2
  fetch_url "$URL" > "$TMP"
elif [[ -n "$SOURCE" ]]; then
  [[ -f "$SOURCE" ]] || error "file not found: $SOURCE"
  cat -- "$SOURCE" > "$TMP"
elif [[ "$FORCE_STDIN" -eq 0 && -t 0 && -f "$SCRATCH" && -s "$SCRATCH" ]]; then
  printf 'Reading markdown.md\n' >&2
  cat -- "$SCRATCH" > "$TMP"
  FROM_SCRATCH=1
elif [[ ! -t 0 ]]; then
  cat > "$TMP"
else
  printf 'Paste Markdown below. Finish with Ctrl+D.\n\n' >&2
  cat > "$TMP"
fi

# A single pasted URL is treated as something to fetch.
if [[ "$FETCH" -eq 1 && -z "$URL" ]]; then
  nonempty="$(awk 'NF { print; exit }' "$TMP")"
  count="$(awk 'NF { n++ } END { print n + 0 }' "$TMP")"
  if [[ "$count" -eq 1 && "$nonempty" =~ ^https?://[^[:space:]]+$ ]]; then
    URL="$nonempty"
    printf 'Fetching %s\n' "$URL" >&2
    fetch_url "$URL" > "$TMP"
  fi
fi

[[ -s "$TMP" ]] || error "no Markdown received"

# Make sure the file ends with a newline.
if [[ -n "$(tail -c 1 "$TMP")" ]]; then
  printf '\n' >> "$TMP"
fi

HAS_FRONT_MATTER=0
if [[ "$(head -n 1 "$TMP")" == "---" ]]; then
  if ! awk 'NR > 1 && /^---[[:space:]]*$/ { found = 1; exit } END { exit !found }' "$TMP"; then
    error "front matter starts with --- but is not closed"
  fi
  HAS_FRONT_MATTER=1
fi

if [[ "$DATE_SET" -eq 0 && "$HAS_FRONT_MATTER" -eq 1 ]]; then
  front_matter_date="$(front_matter_field date "$TMP")"
  if [[ "$front_matter_date" =~ ^([0-9]{4}-[0-9]{2}-[0-9]{2}) ]]; then
    DATE="${BASH_REMATCH[1]}"
  fi
fi

if [[ -z "$TITLE" && "$HAS_FRONT_MATTER" -eq 1 ]]; then
  TITLE="$(front_matter_field title "$TMP")"
fi

if [[ -z "$TITLE" ]]; then
  TITLE="$(awk '
    BEGIN { in_front_matter = 0 }
    NR == 1 && /^---[[:space:]]*$/ { in_front_matter = 1; next }
    in_front_matter && /^---[[:space:]]*$/ { in_front_matter = 0; next }
    in_front_matter { next }
    /^#{1,6}[[:space:]]+/ {
      sub(/^#{1,6}[[:space:]]+/, "")
      sub(/[[:space:]]*#+[[:space:]]*$/, "")
      gsub(/[*_`~]/, "")
      print
      exit
    }
  ' "$TMP")"
fi

if [[ -z "$TITLE" ]]; then
  TITLE="$(awk '
    BEGIN { in_front_matter = 0 }
    NR == 1 && /^---[[:space:]]*$/ { in_front_matter = 1; next }
    in_front_matter && /^---[[:space:]]*$/ { in_front_matter = 0; next }
    in_front_matter { next }
    /^[[:space:]]*$/ { next }
    /^[[:space:]]*<!--/ { next }
    /^[[:space:]]*```/ { next }
    {
      sub(/^[[:space:]]*[>*+-][[:space:]]*/, "")
      gsub(/[`*_~]/, "")
      sub(/^#{1,6}[[:space:]]*/, "")
      print
      exit
    }
  ' "$TMP")"
fi

TITLE="${TITLE:0:80}"
TITLE="${TITLE%"${TITLE##*[![:space:]]}"}"

if [[ -z "$TITLE" ]]; then
  case "$CATEGORY" in
    projects) TITLE="Project $DATE" ;;
    daily) TITLE="$DATE" ;;
    *) TITLE="Note $DATE" ;;
  esac
fi

case "$CATEGORY" in
  blogs) DIRECTORY="src/thoughts/blogs" ;;
  reading) DIRECTORY="src/thoughts/reading" ;;
  notes) DIRECTORY="src/thoughts/notes" ;;
  daily) DIRECTORY="src/thoughts/notes/daily" ;;
  projects) DIRECTORY="src/projects" ;;
  *) error "unknown category: $CATEGORY" ;;
esac

if [[ "$CATEGORY" == "daily" ]]; then
  FILENAME="$DATE.md"
else
  SLUG="$(slugify "$TITLE")"
  [[ -n "$SLUG" ]] || SLUG="note-$DATE"
  FILENAME="$SLUG.md"
fi

DESTINATION="$DIRECTORY/$FILENAME"
mkdir -p "$DIRECTORY"

if [[ "$HAS_FRONT_MATTER" -eq 0 && "$CATEGORY" != "daily" ]]; then
  {
    printf -- '---\n'
    printf 'title: "%s"\n' "$(yaml_escape "$TITLE")"
    printf 'date: %s\n' "$DATE"
    printf 'draft: false\n'
    printf -- '---\n\n'
    cat -- "$TMP"
  } > "$TMP.with-front-matter"
  mv -- "$TMP.with-front-matter" "$TMP"
fi

if grep -qiE '^draft:[[:space:]]*true[[:space:]]*$' "$TMP"; then
  printf 'Note: draft: true is set, so this will stay hidden in production.\n' >&2
fi

ACTION="Added"

if [[ "$CATEGORY" == "daily" && -e "$DESTINATION" ]]; then
  if cmp -s "$TMP" "$DESTINATION"; then
    printf 'Already added: %s\n' "$DESTINATION"
    exit 0
  fi

  # Add another entry to the same day instead of creating a second date file.
  printf '\n' >> "$DESTINATION"
  awk '
    BEGIN { in_front_matter = 0 }
    NR == 1 && /^---[[:space:]]*$/ { in_front_matter = 1; next }
    in_front_matter && /^---[[:space:]]*$/ { in_front_matter = 0; next }
    !in_front_matter { print }
  ' "$TMP" >> "$DESTINATION"
  ACTION="Appended to"
else
  if [[ -e "$DESTINATION" ]]; then
    if cmp -s "$TMP" "$DESTINATION"; then
      printf 'Already added: %s\n' "$DESTINATION"
      exit 0
    fi

    base="${FILENAME%.*}"
    extension="${FILENAME##*.}"
    counter=2
    while [[ -e "$DIRECTORY/${base}-${counter}.${extension}" ]]; do
      counter=$((counter + 1))
    done
    DESTINATION="$DIRECTORY/${base}-${counter}.${extension}"
  fi

  cp -- "$TMP" "$DESTINATION"
  chmod 644 "$DESTINATION"
fi

printf '%s: %s\n' "$ACTION" "$DESTINATION"

case "$CATEGORY" in
  blogs) ROUTE="/thoughts/blogs/${DESTINATION##*/}" ;;
  reading) ROUTE="/thoughts/reading/${DESTINATION##*/}" ;;
  notes) ROUTE="/thoughts/notes/${DESTINATION##*/}" ;;
  daily) ROUTE="/thoughts/notes/daily/${DATE}" ;;
  projects) ROUTE="/projects/${DESTINATION##*/}" ;;
esac
ROUTE="${ROUTE%.md}"
printf 'Page: https://muhsiinn.github.io/portfolio%s/\n' "$ROUTE"

if [[ "$BUILD" -eq 1 ]]; then
  printf '\nBuilding the site...\n'
  if ! npm run build; then
    printf 'Build failed. Your Markdown is safe at %s\n' "$DESTINATION" >&2
    exit 1
  fi
fi

if [[ "$FROM_SCRATCH" -eq 1 ]]; then
  printf '\nmarkdown.md was not cleared. Empty it before adding another note.\n'
fi
