/*!
 * blog.js — Wayline blog: post loader & markdown renderer
 * No external dependencies. Runs only on /blog/post.html
 */
(function () {
  'use strict';

  // ---- HTML-escape plain text for safe innerHTML insertion ----
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---- Parse YAML-like frontmatter between --- delimiters ----
  function parseFrontmatter(text) {
    var m = text.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n([\s\S]*)$/);
    if (!m) return { meta: {}, content: text };
    var meta = {};
    m[1].split(/\r?\n/).forEach(function (line) {
      var i = line.indexOf(':');
      if (i < 1) return;
      meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
    return { meta: meta, content: m[2] };
  }

  // ---- Inline markdown: bold, italic, code, links ----
  function inline(raw) {
    // Escape HTML first to prevent XSS, then apply markdown transforms
    var t = esc(raw);
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
    t = t.replace(/`([^`\n]+?)`/g, '<code>$1</code>');
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, txt, url) {
      // Only permit safe URL schemes
      var safe = /^(https?:|mailto:|\/|#)/.test(url) ? url : '#';
      return '<a href="' + esc(safe) + '" rel="noopener noreferrer">' + txt + '</a>';
    });
    return t;
  }

  // ---- Block markdown parser ----
  function renderMarkdown(md) {
    var blocks = md.split(/\n{2,}/);
    var html = [];
    blocks.forEach(function (raw) {
      var block = raw.trim();
      if (!block) return;
      if (block.startsWith('### ')) {
        html.push('<h3>' + inline(block.slice(4)) + '</h3>');
      } else if (block.startsWith('## ')) {
        html.push('<h2>' + inline(block.slice(3)) + '</h2>');
      } else if (block.startsWith('# ')) {
        html.push('<h1>' + inline(block.slice(2)) + '</h1>');
      } else if (/^[ \t]*[-*] /.test(block.split('\n')[0])) {
        var items = block.split('\n')
          .filter(function (l) { return /^[ \t]*[-*] /.test(l); })
          .map(function (l) { return '<li>' + inline(l.replace(/^[ \t]*[-*] /, '')) + '</li>'; });
        html.push('<ul>' + items.join('') + '</ul>');
      } else {
        // Paragraph — join continuation lines with a space
        html.push('<p>' + inline(block.split('\n').join(' ')) + '</p>');
      }
    });
    return html.join('\n');
  }

  // ---- Format ISO date for display ----
  function prettyDate(s) {
    try {
      return new Date(s + 'T12:00:00Z').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (_) { return s; }
  }

  // ---- Update a <meta name="..."> tag ----
  function setMetaName(name, val) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute('content', val);
  }

  // ---- Update a <meta property="..."> tag ----
  function setMetaProp(prop, val) {
    var el = document.querySelector('meta[property="' + prop + '"]');
    if (el) el.setAttribute('content', val);
  }

  // ---- Show error state ----
  function fail(postContent) {
    postContent.innerHTML = '<p class="post-error">Post not found. <a href="/blog/">← Back to Writing</a></p>';
  }

  // ---- Main: post loader (post.html only) ----
  var postContent = document.getElementById('post-content');
  if (!postContent) return;

  var params = new URLSearchParams(window.location.search);
  var slug = params.get('post') || '';

  // Strict allowlist: lowercase letters, digits, hyphens, 1–80 chars
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug)) {
    fail(postContent);
    return;
  }

  fetch('/blog/posts/' + slug + '.md')
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    })
    .then(function (text) {
      var fm = parseFrontmatter(text);
      var meta = fm.meta;
      var content = fm.content;

      // Update document title (text property — no escaping needed)
      if (meta.title) document.title = meta.title + ' \u2014 Wayline';

      // Update canonical link
      var canon = document.querySelector('link[rel="canonical"]');
      if (canon) canon.setAttribute('href', 'https://www.wayline.site/blog/post.html?post=' + encodeURIComponent(slug));

      // Update meta tags
      setMetaName('description', meta.description || '');
      setMetaProp('og:title', (meta.title || '') + ' \u2014 Wayline');
      setMetaProp('og:description', meta.description || '');

      // Render post header
      var header = document.getElementById('post-header');
      if (header) {
        header.innerHTML = [
          meta.category ? '<span class="post-category">' + esc(meta.category) + '</span>' : '',
          '<h1 class="post-title">' + esc(meta.title || '') + '</h1>',
          meta.date ? '<time class="post-date" datetime="' + esc(meta.date) + '">' + prettyDate(meta.date) + '</time>' : '',
          meta.description ? '<p class="post-deck">' + esc(meta.description) + '</p>' : ''
        ].join('\n');
      }

      // Render article body
      postContent.innerHTML = renderMarkdown(content);
    })
    .catch(function () { fail(postContent); });

  // ---- Scroll reveal (shared with main site) ----
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
}());
