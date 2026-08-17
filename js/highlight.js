/* =====================================================================
   Django Lab — tiny zero-dependency syntax highlighter
   Supports: python, django(python), html, bash, sql, ini, text, console
   Returns HTML string. Escapes input first, then wraps tokens in spans.
   ===================================================================== */
(function (global) {
  'use strict';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // A token rule: [regex, className]. Runs in order on the *raw* string,
  // building output by scanning and emitting untouched text escaped.
  // We use a single combined approach: a master regex with alternation
  // capturing which language pattern matched, then tag accordingly.

  function highlight(code, lang) {
    lang = (lang || 'text').toLowerCase();
    if (lang === 'django' || lang === 'py' || lang === 'python') lang = 'python';
    if (lang === 'sh' || lang === 'shell' || lang === 'console' || lang === 'terminal') lang = 'bash';
    if (lang === 'cfg' || lang === 'conf' || lang === 'toml' || lang === 'ini') lang = 'ini';
    if (lang === 'htmldjango' || lang === 'jinja' || lang === 'dtl') lang = 'html';

    const fn = HL[lang] || HL.text;
    return fn(code);
  }

  // generic runner: takes [(regex, groupIndex, className)] and processes
  // We'll instead use simpler per-lang functions with replace on escaped text
  // where tokens don't contain '<'/'>' ambiguity. But python code may have '<'
  // in comparisons — so we escape first, then regex on entities-safe text.

  function runRules(escaped, rules) {
    // rules: array of {re, cls}
    // Build a combined regex
    const parts = rules.map(r => '(' + r.re + ')');
    const combined = new RegExp(parts.join('|'), 'g');
    const clsMap = rules.map(r => r.cls);
    let out = '';
    let last = 0;
    let m;
    while ((m = combined.exec(escaped)) !== null) {
      const idx = m.slice(1).findIndex(v => v !== undefined);
      out += escaped.slice(last, m.index);
      const text = m[0];
      const cls = clsMap[idx];
      out += '<span class="tok ' + cls + '">' + text + '</span>';
      last = m.index + text.length;
      combined.lastIndex = last;
    }
    out += escaped.slice(last);
    return out;
  }

  const HL = {};

  HL.python = function (code) {
    let s = esc(code);
    // strings (triple first), f-strings, normal, comments
    const rules = [
      { re: '#[^\\n]*', cls: 'com' },
      { re: 'rb?[rb]?\'\'\'[\\s\\S]*?\'\'\'', cls: 'str' },
      { re: 'rb?[rb]?"""[\\s\\S]*?"""', cls: 'str' },
      { re: '[rfb]+\'(?:\\\\.|[^\'\\\\])*\'', cls: 'str' },
      { re: '[rfb]+\"(?:\\\\.|[^\"\\\\])*\"', cls: 'str' },
      { re: '\\b\\d+\\.?\\d*\\b', cls: 'num' },
      { re: '\\b(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|self|cls)\\b', cls: 'kw' },
      { re: '@[A-Za-z_][A-Za-z0-9_.]*', cls: 'dec' },
      { re: '\\b[A-Za-z_][A-Za-z0-9_]*(?=\\()', cls: 'fn' },
      { re: '\\b[A-Z][A-Za-z0-9_]*\\b', cls: 'dec' },
    ];
    return runRules(s, rules);
  };

  HL.html = function (code) {
    let s = esc(code);
    // comments
    s = s.replace(/&lt;!--[\s\S]*?--&gt;/g, m => '<span class="tok com">' + m + '</span>');
    // tags
    s = s.replace(/(&lt;\/?)([a-zA-Z][\w-]*)((?:\s+[^&]*?)*?)(\/?&gt;)/g, function (_, lt, tag, attrs, gt) {
      // attrs: highlight attr names + values
      const a = attrs.replace(/([a-zA-Z-:]+)(=)(&quot;.*?&quot;|&#39;.*?&#39;|"[^"]*"|'[^']*')/g,
        '<span class="tok attr">$1</span>$2<span class="tok str">$3</span>');
      return '<span class="tok tag">' + lt + '</span><span class="tok dec">' + tag + '</span>' + a + '<span class="tok tag">' + gt + '</span>';
    });
    // django template tags {{ }} {% %}
    s = s.replace(/\{\{[\s\S]*?\}\}/g, m => '<span class="tok fn">' + m + '</span>');
    s = s.replace(/\{%[\s\S]*?%\}/g, m => '<span class="tok dec">' + m + '</span>');
    return s;
  };

  HL.bash = function (code) {
    let s = esc(code);
    const rules = [
      { re: '#[^\\n]*', cls: 'com' },
      { re: '"(?:\\\\.|[^"\\\\])*"', cls: 'str' },
      { re: "'[^']*'", cls: 'str' },
      { re: '\\b(?:cd|ls|mkdir|rm|cp|mv|echo|cat|source|export|python|python3|pip|pip3|django-admin|manage|git|sudo|nano|code|workon|deactivate|venv|chmod|which|psql|heroku|npm|node)\\b', cls: 'kw' },
      { re: '(?<=^|\\s)--?[a-zA-Z][\\w-]*', cls: 'attr' },
      { re: '\\$\\(?[A-Za-z_][\\w]*\\)?', cls: 'var' },
    ];
    return runRules(s, rules);
  };

  HL.sql = function (code) {
    let s = esc(code);
    const rules = [
      { re: '--[^\\n]*', cls: 'com' },
      { re: "'(?:''|[^'])*'", cls: 'str' },
      { re: '\\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|DEFAULT|AUTOINCREMENT|AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|ASC|DESC|LIMIT|OFFSET|DISTINCT|COUNT|SUM|AVG|MAX|MIN|AS|INTEGER|TEXT|VARCHAR|BOOLEAN|DATETIME|SERIAL|INDEX|UNIQUE|ALTER|ADD|COLUMN|DROP|CONSTRAINT)\\b', cls: 'kw' },
      { re: '\\b\\d+\\b', cls: 'num' },
    ];
    return runRules(s, rules);
  };

  HL.ini = function (code) {
    let s = esc(code);
    const rules = [
      { re: '#[^\\n]*', cls: 'com' },
      { re: ';[^\\n]*', cls: 'com' },
      { re: '^\\[[^\\]]+\\]', cls: 'dec' },
      { re: '[A-Za-z_][\\w]*(?=\\s*=)', cls: 'attr' },
      { re: '(?<==)([^\\n]+)', cls: 'str' },
    ];
    return runRules(s, rules);
  };

  HL.text = function (code) { return esc(code); };

  global.DjangoLab = global.DjangoLab || {};
  global.DjangoLab.highlight = highlight;
})(window);
