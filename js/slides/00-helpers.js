/* =====================================================================
   Django Lab — slide authoring helpers (global.DL)
   Loaded before every content file. Pure string builders, no state.
   ===================================================================== */
(function (global) {
  'use strict';

  const esc = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const faDigits = (value) => String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  /* ---------- code block with language chip + copy button ---------- */
  function c(lang, source, title) {
    const code = Array.isArray(source) ? source.join('\n') : String(source);
    const highlighted = global.DjangoLab && global.DjangoLab.highlight
      ? global.DjangoLab.highlight(code, lang)
      : esc(code);
    return `
      <div class="code-block" dir="ltr">
        <div class="code-head">
          <span class="code-lang">${esc(title || lang)}</span>
          <button class="copy-btn" type="button" data-code="${esc(code)}">کپی</button>
        </div>
        <pre class="code"><code>${highlighted}</code></pre>
      </div>`;
  }

  /* ---------- callout: info | tip | warn | danger ---------- */
  function callout(type, title, text) {
    return `
      <div class="callout ${type}">
        <div class="callout-ico">${type === 'warn' ? '!' : type === 'danger' ? 'x' : 'i'}</div>
        <div class="callout-body">
          <div class="callout-title">${title}</div>
          <p>${text}</p>
        </div>
      </div>`;
  }

  /* ---------- exercise with optional revealed solution ---------- */
  function exercise(title, difficulty, body, solution) {
    return `
      <div class="exercise">
        <div class="exercise-head">
          <span class="exercise-badge">تمرین</span>
          <span class="ex-label">${title}</span>
          <span class="exercise-diff">${difficulty}</span>
        </div>
        <div class="exercise-body">
          ${body}
          ${solution ? `<button class="reveal-btn" type="button">نمایش راه‌حل</button><div class="exercise-solution"><div class="exercise-solution-label">راه‌حل پیشنهادی</div>${solution}</div>` : ''}
        </div>
      </div>`;
  }

  function tbl(headers, rows) {
    return `
      <div class="table-wrap">
        <table class="tbl">
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>`;
  }

  function flow(items) {
    return `
      <div class="diagram">
        <div class="flow" dir="rtl">
          <div class="flow-row">
            ${items.map((item, index) => `
              <span class="flow-box ${index === 0 || index === items.length - 1 ? 'accent' : ''}">${item}</span>
              ${index < items.length - 1 ? '<span class="flow-arrow">←</span>' : ''}
            `).join('')}
          </div>
        </div>
      </div>`;
  }

  /* ---------- learning objectives block ---------- */
  function objectives(items) {
    return `
      <div class="objectives">
        <div class="objectives-title">در پایان این بخش می‌توانید:</div>
        <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>`;
  }

  /* ---------- guided lab: numbered steps + verification checkpoint ----------
     steps: [{ do: html, why?: html }]  |  checkpoint: html
  ------------------------------------------------------------------------- */
  function lab(title, meta, steps, checkpoint) {
    return `
      <div class="lab">
        <div class="lab-head">
          <span class="lab-badge">کارگاه</span>
          <span class="lab-title">${title}</span>
          ${meta ? `<span class="lab-meta">${meta}</span>` : ''}
        </div>
        <ol class="lab-steps">
          ${steps.map((step, index) => `
            <li class="lab-step">
              <span class="lab-num">${faDigits(index + 1)}</span>
              <div class="lab-body">
                ${step.do}
                ${step.why ? `<p class="lab-why"><strong>چرا؟</strong> ${step.why}</p>` : ''}
              </div>
            </li>`).join('')}
        </ol>
        ${checkpoint ? `
          <div class="lab-check">
            <div class="lab-check-title">نقطه کنترل — قبل از رفتن به مرحله بعد</div>
            ${checkpoint}
          </div>` : ''}
      </div>`;
  }

  /* ---------- definition-of-done checklist ---------- */
  function checklist(title, items) {
    return `
      <div class="checklist">
        <div class="checklist-title">${title}</div>
        <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>`;
  }

  /* ---------- self-check question; options: [text, ...] ---------- */
  function quiz(question, options, answerIndex, explain) {
    return `
      <div class="quiz">
        <div class="quiz-q"><span class="quiz-badge">خودآزمایی</span> ${question}</div>
        <div class="quiz-opts">
          ${options.map((option, index) => `
            <button class="quiz-opt" type="button" data-correct="${index === answerIndex ? '1' : '0'}">
              <span class="quiz-key">${'الف ب ج د'.split(' ')[index] || index + 1}</span>${option}
            </button>`).join('')}
        </div>
        <div class="quiz-explain"><strong>چرا؟</strong> ${explain}</div>
      </div>`;
  }

  function slide(section, title, subtitle, body, level) {
    return { section, title, subtitle, body, level: level || 'مقدماتی' };
  }

  global.SLIDES = global.SLIDES || [];
  global.DL = { c, callout, exercise, tbl, flow, slide, faDigits, esc, objectives, lab, checklist, quiz };
})(window);
