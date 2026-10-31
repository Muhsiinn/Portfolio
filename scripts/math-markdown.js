const katex = require('katex');

module.exports = function mathMarkdown(md) {
  md.inline.ruler.before('escape', 'math_inline', (state, silent) => {
    const start = state.pos;
    const source = state.src;
    let close;
    let contentStart;
    if (source.startsWith('\\(', start)) {
      close = '\\)';
      contentStart = start + 2;
    } else if (source[start] === '$' && source[start + 1] !== '$' && source[start + 1] !== ' ') {
      close = '$';
      contentStart = start + 1;
    } else {
      return false;
    }
    const end = source.indexOf(close, contentStart);
    if (end < 0 || end === contentStart || /\s/.test(source[end - 1]) || source.slice(contentStart, end).includes('\n')) return false;
    if (!silent) {
      const token = state.push('math_inline', 'math', 0);
      token.content = source.slice(contentStart, end);
    }
    state.pos = end + close.length;
    return true;
  });

  md.block.ruler.before('paragraph', 'math_block', (state, startLine, endLine, silent) => {
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    const firstLine = state.src.slice(startPos, state.eMarks[startLine]).trim();
    const delimiter = firstLine === '$$' ? '$$' : firstLine === '\\[' ? '\\]' : null;
    if (!delimiter) return false;
    let nextLine = startLine + 1;
    const chunks = [];
    while (nextLine < endLine) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
      const line = state.src.slice(lineStart, state.eMarks[nextLine]).trim();
      if (line === delimiter) break;
      chunks.push(state.src.slice(lineStart, state.eMarks[nextLine]));
      nextLine++;
    }
    if (nextLine >= endLine) return false;
    if (silent) return true;
    const token = state.push('math_block', 'math', 0);
    token.block = true;
    token.content = chunks.join('\n');
    token.map = [startLine, nextLine + 1];
    state.line = nextLine + 1;
    return true;
  });

  function render(content, displayMode) {
    return katex.renderToString(content, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
      output: 'htmlAndMathml'
    });
  }
  md.renderer.rules.math_inline = (tokens, index) => render(tokens[index].content, false);
  md.renderer.rules.math_block = (tokens, index) => '<div class="math-display">' + render(tokens[index].content, true) + '</div>\n';
};
