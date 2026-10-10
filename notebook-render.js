/* Shared renderer for repository Markdown. Content remains source Markdown. */
(function (global) {
  'use strict';
  function escapeHtml(text) { return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function markdown(source) {
    if (global.marked && typeof global.marked.parse === 'function') {
      const html = global.marked.parse(source || '', { gfm: true, breaks: false, headerIds: false, mangle: false });
      return global.DOMPurify ? global.DOMPurify.sanitize(html) : escapeHtml(source || '').replace(/\n/g, '<br>');
    }
    return '<p>' + escapeHtml(source || '').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
  }
  function optionsFromTitle(title) {
    const opts = { align:'center', width:100, caption:'' };
    if (!title.startsWith('notebook:')) return null;
    title.slice(9).split(';').forEach(part => {
      const i=part.indexOf('='); if(i<0)return;
      const key=part.slice(0,i).trim(), value=part.slice(i+1).trim();
      if(key==='align' && ['left','right','center'].includes(value))opts.align=value;
      if(key==='width' && /^(25|30|35|40|45|50|55|60|65|70|75|80|90|100)$/.test(value))opts.width=Number(value);
      if(key==='caption') { try{opts.caption=decodeURIComponent(value)}catch{opts.caption=value} }
    });
    return opts;
  }
  function decorateFigures(root) {
    root.querySelectorAll('img[title^="notebook:"]').forEach(img => {
      const opts=optionsFromTitle(img.title); const p=img.parentElement?.tagName==='P'?img.parentElement:null;
      const standalone=p && [...p.childNodes].every(n=>n===img || (n.nodeType===3 && !n.textContent.trim()));
      const fig=document.createElement(standalone?'figure':'span'); fig.className='notebook-figure notebook-figure--'+opts.align;
      fig.style.setProperty('--figure-width',opts.width+'%'); img.removeAttribute('title'); img.parentNode.insertBefore(fig,img); fig.append(img);
      if(opts.caption){const cap=document.createElement(standalone?'figcaption':'span');cap.className='notebook-figure__caption';cap.textContent=opts.caption;fig.append(cap)}
      if(standalone)p.replaceWith(fig);
    });
  }
  function render(markdownSource, target, options) {
    options = options || {};
    target.replaceChildren(); target.classList.add('notebook__body'); target.innerHTML=markdown(markdownSource);
    if (options.basePath) {
      const base = new URL(options.basePath, location.href);
      target.querySelectorAll('img[src],a[href]').forEach(el => {
        const attr = el.tagName === 'IMG' ? 'src' : 'href'; const value = el.getAttribute(attr);
        if (!value || /^(?:[a-z]+:|\/|#|data:|mailto:|tel:)/i.test(value)) return;
        el.setAttribute(attr, new URL(value, base).href);
      });
    }
    decorateFigures(target);
    if(global.hljs)target.querySelectorAll('pre code').forEach(el=>{try{global.hljs.highlightElement(el)}catch{}});
    if(global.mermaid){
      global.mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base'});
      target.querySelectorAll('pre code.language-mermaid').forEach((code,i)=>{
        const source=code.textContent, host=document.createElement('div');host.className='notebook-diagram';host.setAttribute('role','img');host.setAttribute('aria-label','Diagram rendered from Mermaid source');code.parentElement.replaceWith(host);
        global.mermaid.render('diagram-'+Date.now()+'-'+i,source).then(r=>{host.innerHTML=r.svg}).catch(()=>{host.textContent=source});
      });
    }
    if(global.renderMathInElement)global.renderMathInElement(target,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false});
    return target;
  }
  global.Notebook={render,parseMarkdown:markdown};
})(window);
