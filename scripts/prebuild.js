const fs = require('node:fs');
const path = require('node:path');

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

for (const directory of ['src/projects', 'src/notes']) {
  for (const file of markdownFiles(directory)) {
    const source = fs.readFileSync(file, 'utf8');
    const match = source.match(/^---\s*\n([\s\S]*?)\n---(?:\s|$)/);
    if (!match) throw new Error(file + ': front matter is required.');
    for (const key of ['title', 'description']) {
      const field = match[1].match(new RegExp('^' + key + ':\\s*(.*)$', 'm'));
      if (!field || !field[1].trim()) throw new Error(file + ': ' + key + ' is required.');
      let value = field[1].trim();
      if (value.startsWith('"')) {
        try { value = JSON.parse(value); } catch {}
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      if (typeof value !== 'string' || !value.trim()) throw new Error(file + ': ' + key + ' must not be empty.');
    }
  }
}

fs.rmSync('_site', { recursive: true, force: true });
