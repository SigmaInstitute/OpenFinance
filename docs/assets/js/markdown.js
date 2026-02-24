// Minimal, safe markdown renderer (subset) for OpenFinance static pages.
// - Escapes HTML by default (no raw HTML support)
// - Supports: headings (#/##/###), blockquotes, unordered/ordered lists, paragraphs,
//   bold (**text**), inline code (`code`), links [text](url)

function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineFormat(s){
  let out = s;
  // Inline code
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Links
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return out;
}

function renderMarkdown(md){
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  let html = [];

  function flushParagraph(buf){
    if(!buf.length) return;
    const text = inlineFormat(buf.join(' '));
    html.push(`<p>${text}</p>`);
    buf.length = 0;
  }

  function flushList(listItems, ordered){
    if(!listItems.length) return;
    const tag = ordered ? 'ol' : 'ul';
    html.push(`<${tag}>`);
    for(const li of listItems){
      html.push(`<li>${inlineFormat(li)}</li>`);
    }
    html.push(`</${tag}>`);
    listItems.length = 0;
  }

  function flushBlockquote(bqLines){
    if(!bqLines.length) return;
    const inner = bqLines.map(x=>inlineFormat(x)).join('<br/>');
    html.push(`<blockquote>${inner}</blockquote>`);
    bqLines.length = 0;
  }

  let p = [];
  let ul = [];
  let ol = [];
  let bq = [];

  for(let raw of lines){
    const line = escapeHtml(raw).trimEnd();

    // Blank line flushes all open blocks.
    if(line.trim() === ''){
      flushBlockquote(bq);
      flushList(ul, false);
      flushList(ol, true);
      flushParagraph(p);
      continue;
    }

    // Blockquote
    if(line.trim().startsWith('&gt;')){
      flushList(ul, false);
      flushList(ol, true);
      flushParagraph(p);
      bq.push(line.replace(/^\s*&gt;\s?/, ''));
      continue;
    }else{
      flushBlockquote(bq);
    }

    // Headings
    if(/^###\s+/.test(line)){
      flushList(ul, false);
      flushList(ol, true);
      flushParagraph(p);
      html.push(`<h3>${inlineFormat(line.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if(/^##\s+/.test(line)){
      flushList(ul, false);
      flushList(ol, true);
      flushParagraph(p);
      html.push(`<h2>${inlineFormat(line.replace(/^##\s+/, ''))}</h2>`);
      continue;
    }
    if(/^#\s+/.test(line)){
      flushList(ul, false);
      flushList(ol, true);
      flushParagraph(p);
      html.push(`<h1>${inlineFormat(line.replace(/^#\s+/, ''))}</h1>`);
      continue;
    }

    // Unordered list
    if(/^[-*]\s+/.test(line)){
      flushParagraph(p);
      flushList(ol, true);
      ul.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    // Ordered list ("1.", "1)")
    if(/^\d+[\.|\)]\s+/.test(line)){
      flushParagraph(p);
      flushList(ul, false);
      ol.push(line.replace(/^\d+[\.|\)]\s+/, ''));
      continue;
    }

    // Default: paragraph text
    flushList(ul, false);
    flushList(ol, true);
    p.push(line.trim());
  }

  // Final flush
  flushBlockquote(bq);
  flushList(ul, false);
  flushList(ol, true);
  flushParagraph(p);

  return html.join('\n');
}
