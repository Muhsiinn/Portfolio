const fs = require('node:fs');
const path = require('node:path');

const MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown', '.mdown', '.mkd', '.mdwn', '.mdtxt', '.mdtext']);

function isMarkdown(file) {
  return MARKDOWN_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(fullPath);
    return entry.isFile() && isMarkdown(entry.name) ? [fullPath] : [];
  });
}

function uniqueDestination(directory, relative) {
  let destination = path.join(directory, relative);
  if (!fs.existsSync(destination)) return destination;

  const extension = path.extname(destination);
  const base = destination.slice(0, -extension.length);
  let counter = 2;
  while (fs.existsSync(destination)) destination = base + '-' + counter++ + extension;
  return destination;
}

for (const directory of ['src/projects', 'src/thoughts']) {
  for (const file of markdownFiles(directory)) {
    const source = fs.readFileSync(file, 'utf8');
    if (source.startsWith('---') && !/^---\s*\r?\n[\s\S]*?\r?\n---(?:\s|$)/.test(source)) {
      throw new Error(file + ': front matter starts with --- but is not closed.');
    }
  }
}

// _site is generated output, but it is easy to drop a Markdown file there by
// mistake. Rescue every Markdown file into the matching source folder before
// cleaning, keeping subfolders and extensions intact.
if (fs.existsSync('_site')) {
  const outputRoot = path.resolve('_site');
  for (const file of markdownFiles('_site')) {
    const relative = path.relative(outputRoot, file).split(path.sep).join('/');
    const category = relative.match(/^(thoughts\/(?:blogs|reading|notes(?:\/daily)?)|projects)\//);
    const categoryPath = category ? category[1] : 'thoughts/notes';
    const rest = category ? relative.slice(category[0].length) : 'recovered/' + relative;
    const destinationDirectory = path.join('src', ...categoryPath.split('/'), path.dirname(rest));
    fs.mkdirSync(destinationDirectory, { recursive: true });

    let destination = path.join(destinationDirectory, path.basename(rest));
    if (fs.existsSync(destination)) {
      if (fs.readFileSync(destination, 'utf8') === fs.readFileSync(file, 'utf8')) {
        fs.rmSync(file);
        continue;
      }
      destination = uniqueDestination(destinationDirectory, path.basename(rest));
    }

    fs.renameSync(file, destination);
    console.log('[content] Moved and preserved pasted Markdown from _site/' + relative + ' to ' + destination);
  }
}

// Never delete a Markdown file, even if something unexpected left one behind.
const remainingMarkdown = fs.existsSync('_site') ? markdownFiles('_site') : [];
if (remainingMarkdown.length) {
  throw new Error('Refusing to clean _site; Markdown files are still there:\n' + remainingMarkdown.join('\n'));
}

// Build output is disposable. Clear it so deleted or moved Markdown files cannot
// leave old pages behind.
fs.rmSync('_site', { recursive: true, force: true });
