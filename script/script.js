(function () {
  const KEYWORDS = new Set([
    'model', 'entity', 'enum', 'expert', 'function', 'abstract', 'extends',
    'type', 'let', 'if', 'for', 'while', 'match', 'return', 'in', 'as',
    'true', 'false', 'null'
  ]);
  const TYPES = new Set([
    'boolean', 'string', 'integer', 'long', 'decimal', 'float', 'double',
    'date', 'list', 'set', 'map', 'typeref', 'Base', 'Maybe', 'Option', 'Result'
  ]);
  const TWO_CHAR = ['==', '!=', '<=', '>=', '&&', '||'];

  /* varela.svg, inlined; fill tracks the theme via currentColor */
  const LOGO = '<svg class="logo" viewBox="0 0 921 213" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Varela">' +
    '<g transform="matrix(149.309,0,0,149.309,879.991,167.854)"></g>' +
    '<text x="94.478px" y="167.854px" style="font-family:\'Lato-Regular\', \'Lato\', sans-serif;font-size:149.309px;fill:currentColor;">V<tspan x="232.14px 379.956px 522.396px 655.43px 778.461px " y="167.854px 167.854px 167.854px 167.854px 167.854px ">ARELA</tspan></text>' +
    '</svg>';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function span(cls, text) {
    return '<span class="tok-' + cls + '">' + esc(text) + '</span>';
  }

  /** Varela highlighter — aligned with autocomplete/server/src/lexer.js */
  function highlightVarela(src) {
    let out = '';
    let i = 0;
    const n = src.length;
    let lineStart = true;

    while (i < n) {
      const c = src[i];

      if (c === '\n') {
        out += '\n';
        i += 1;
        lineStart = true;
        continue;
      }
      if (c === ' ' || c === '\t' || c === '\r') {
        out += c;
        i += 1;
        continue;
      }

      // line comment
      if (c === '#') {
        const s = i;
        while (i < n && src[i] !== '\n') i += 1;
        out += span('cm', src.slice(s, i));
        continue;
      }

      // directive at line start: %model, %vson, …
      if (c === '%' && lineStart) {
        const s = i;
        while (i < n && src[i] !== '\n') i += 1;
        out += span('dir', src.slice(s, i));
        continue;
      }
      lineStart = false;

      // annotation @Name
      if (c === '@' && /[A-Za-z_]/.test(src[i + 1] || '')) {
        const s = i;
        i += 1;
        while (i < n && /[A-Za-z0-9_]/.test(src[i])) i += 1;
        out += span('ann', src.slice(s, i));
        continue;
      }

      // ~Type.property, $host, ?Type
      if ((c === '~' || c === '$' || c === '?') && /[A-Za-z_]/.test(src[i + 1] || '')) {
        const s = i;
        i += 1;
        while (i < n && /[A-Za-z0-9_.]/.test(src[i])) i += 1;
        out += span('ref', src.slice(s, i));
        continue;
      }

      // strings / templates
      if (c === "'" || c === '"') {
        const quote = c;
        const s = i;
        i += 1;
        while (i < n) {
          if (src[i] === '\\') { i += 2; continue; }
          if (src[i] === quote) { i += 1; break; }
          if (src[i] === '\n' && quote === "'") break;
          i += 1;
        }
        out += span(quote === '"' ? 'tpl' : 'str', src.slice(s, Math.min(i, n)));
        continue;
      }

      // numbers (optional type suffix: 3i, 1.0d)
      if (/[0-9]/.test(c)) {
        const s = i;
        while (i < n && /[0-9]/.test(src[i])) i += 1;
        if (src[i] === '.' && /[0-9]/.test(src[i + 1] || '')) {
          i += 1;
          while (i < n && /[0-9]/.test(src[i])) i += 1;
        }
        while (i < n && /[A-Za-z]/.test(src[i])) i += 1;
        out += span('num', src.slice(s, i));
        continue;
      }

      // identifiers / keywords / types
      if (/[A-Za-z_]/.test(c)) {
        const s = i;
        while (i < n && /[A-Za-z0-9_]/.test(src[i])) i += 1;
        const id = src.slice(s, i);
        if (KEYWORDS.has(id)) out += span('kw', id);
        else if (TYPES.has(id)) out += span('type', id);
        else out += span('id', id);
        continue;
      }

      const two = src.slice(i, i + 2);
      if (TWO_CHAR.includes(two)) {
        out += span('punct', two);
        i += 2;
        continue;
      }

      out += span('punct', c);
      i += 1;
    }
    return out;
  }

  function highlightText(src) {
    let out = '';
    let i = 0;
    const n = src.length;
    while (i < n) {
      if (src[i] === '#') {
        const s = i;
        while (i < n && src[i] !== '\n') i += 1;
        out += span('cm', src.slice(s, i));
        continue;
      }
      out += esc(src[i]);
      i += 1;
    }
    return out;
  }

  function inline(text) {
    return esc(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  }

  function slugify(text) {
    return text.toLowerCase()
      .replace(/&[^;]+;/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function renderMarkdown(md) {
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    let html = '';
    let i = 0;
    let inTable = false;
    let lastHeading = '';
    const toc = [];
    const usedIds = Object.create(null);

    function closeTable() {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
    }

    function uniqueId(base) {
      let id = base || 'section';
      if (usedIds[id]) {
        let n = 2;
        while (usedIds[id + '-' + n]) n += 1;
        id = id + '-' + n;
      }
      usedIds[id] = true;
      return id;
    }

    while (i < lines.length) {
      const line = lines[i];

      // fenced code
      const fence = line.match(/^```(\w*)\s*$/);
      if (fence) {
        closeTable();
        const lang = fence[1] || 'text';
        i += 1;
        const body = [];
        while (i < lines.length && !lines[i].startsWith('```')) {
          body.push(lines[i]);
          i += 1;
        }
        i += 1; // closing fence
        const src = body.join('\n');
        const highlighted = (lang === 'lps' || lang === 'vson')
          ? highlightVarela(src)
          : highlightText(src);
        html += '<pre><span class="lang-tag">' + esc(lang) + '</span><code class="language-' +
          esc(lang) + '">' + highlighted + '</code></pre>\n';
        continue;
      }

      // horizontal rule
      if (/^---+\s*$/.test(line)) {
        closeTable();
        html += '<hr>\n';
        i += 1;
        continue;
      }

      // headings
      const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) {
        closeTable();
        const level = h[1].length;
        const raw = h[2];
        const text = inline(raw);
        lastHeading = raw;
        if (level === 1) {
          html += '<header id="top"><p class="brand">The Varela language · beta</p>' +
            LOGO + '</header>\n';
        } else {
          const id = uniqueId(slugify(raw));
          toc.push({ id: id, title: raw, level: level });
          html += '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>\n';
        }
        i += 1;
        continue;
      }

      // table
      if (line.includes('|') && line.trim().startsWith('|')) {
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        const next = lines[i + 1] || '';
        const isSep = /^\|[\s:|-]+\|$/.test(next.trim()) ||
          /^\|?[\s|:-]+\|?$/.test(next.trim());

        if (!inTable) {
          html += '<table><thead><tr>';
          cells.forEach((c) => { html += '<th>' + inline(c) + '</th>'; });
          html += '</tr></thead><tbody>\n';
          inTable = true;
          i += 1;
          if (isSep) i += 1;
          continue;
        }
        html += '<tr>';
        cells.forEach((c) => { html += '<td>' + inline(c) + '</td>'; });
        html += '</tr>\n';
        i += 1;
        continue;
      }

      if (inTable && !line.includes('|')) closeTable();

      // blank
      if (!line.trim()) {
        i += 1;
        continue;
      }

      // unordered list
      if (/^[-*]\s+/.test(line)) {
        closeTable();
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^[-*]\s+/, ''));
          i += 1;
        }
        const zen = /^Zen of Varela$/i.test(lastHeading);
        html += '<ul' + (zen ? ' class="zen"' : '') + '>\n';
        items.forEach(function (t) {
          html += '<li>' + inline(t) + '</li>\n';
        });
        html += '</ul>\n';
        continue;
      }

      // blockquote (beta callout or ordinary)
      if (line.startsWith('>')) {
        closeTable();
        const quoteLines = [];
        while (i < lines.length && lines[i].startsWith('>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i += 1;
        }
        const joined = quoteLines.join('\n').trim();
        const isBeta = /\bBETA\b/i.test(joined);
        if (isBeta) {
          const parts = joined.split(/\n\s*\n/);
          const label = parts[0].replace(/\*\*/g, '');
          const bodyText = parts.length > 1 ? parts.slice(1).join(' ') : '';
          html += '<aside class="beta-banner" role="status"><span class="beta-label">' +
            esc(label) + '</span>';
          if (bodyText) html += '<p>' + inline(bodyText) + '</p>';
          html += '</aside>\n';
        } else {
          html += '<blockquote><p>' + inline(joined.replace(/\n+/g, ' ')) + '</p></blockquote>\n';
        }
        continue;
      }

      // paragraph (merge consecutive non-blank, non-special lines)
      const parts = [line];
      i += 1;
      while (i < lines.length) {
        const nline = lines[i];
        if (!nline.trim()) break;
        if (/^#{1,3}\s/.test(nline) || nline.startsWith('```') ||
            /^---+\s*$/.test(nline) || nline.trim().startsWith('|') ||
            nline.startsWith('>') || /^[-*]\s+/.test(nline)) break;
        parts.push(nline);
        i += 1;
      }
      html += '<p>' + inline(parts.join(' ')) + '</p>\n';
    }
    closeTable();
    return { html: html, toc: toc };
  }

  function buildToc(entries) {
    const nav = document.getElementById('toc');
    nav.innerHTML = entries.map(function (e) {
      return '<a class="toc-h' + e.level + '" href="#' + e.id + '" data-id="' + e.id + '">' +
        esc(e.title) + '</a>';
    }).join('');
  }

  function watchActive(entries) {
    const links = Array.prototype.slice.call(document.querySelectorAll('#toc a'));
    if (!entries.length || !('IntersectionObserver' in window)) return;

    const byId = Object.create(null);
    links.forEach(function (a) { byId[a.getAttribute('data-id')] = a; });

    let current = null;
    function setActive(id) {
      if (current === id) return;
      current = id;
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('data-id') === id);
      });
    }

    const observer = new IntersectionObserver(function (obs) {
      const visible = obs
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-10% 0px -70% 0px', threshold: [0, 1] });

    entries.forEach(function (e) {
      const el = document.getElementById(e.id);
      if (el) observer.observe(el);
    });

    if (entries[0]) setActive(entries[0].id);
  }

  fetch('content.md')
    .then(response => response.text())
    .then(text => {

      const md = text.replace(/^\n/, '');

      const rendered = renderMarkdown(md);
      document.getElementById('doc').innerHTML = rendered.html;
      buildToc(rendered.toc);
      watchActive(rendered.toc);

    })
    .catch(error => console.error('Error loading markdown:', error));

  // --- Theme Toggle Logic (Runs independently) ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const root = document.documentElement;
    const syncTheme = function () {
      const dark = root.getAttribute('data-theme') === 'dark';
      themeToggle.setAttribute('aria-label',
        dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.title = dark ? 'Light mode' : 'Dark mode';
    };
    themeToggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('varela-theme', next); } catch (e) {}
      syncTheme();
    });
    syncTheme();
  }
})();
