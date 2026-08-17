(function (global) {
  'use strict';

  const slides = global.SLIDES || [];
  const $ = (id) => document.getElementById(id);
  const els = {
    slide: $('slide'),
    toc: $('toc'),
    sidebar: $('sidebar'),
    menuToggle: $('menuToggle'),
    progressBar: $('progressBar'),
    progressLabel: $('progressLabel'),
    searchInput: $('searchInput'),
    themeToggle: $('themeToggle'),
    themeIcon: $('themeIcon'),
    printBtn: $('printBtn'),
    prevBtn: $('prevBtn'),
    nextBtn: $('nextBtn'),
    sectionJump: $('sectionJump'),
    slideKicker: $('slideKicker'),
    overview: $('overview'),
    overviewGrid: $('overviewGrid'),
  };

  const faDigits = global.DL && global.DL.faDigits
    ? global.DL.faDigits
    : (value) => String(value);

  let current = getIndexFromHash();

  function getIndexFromHash() {
    const match = location.hash.match(/slide-(\d+)/);
    if (!match) return 0;
    const index = Number(match[1]) - 1;
    return Number.isFinite(index) ? clamp(index, 0, slides.length - 1) : 0;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sections() {
    return [...new Set(slides.map(slide => slide.section))];
  }

  function sectionFirstIndex(section) {
    return slides.findIndex(slide => slide.section === section);
  }

  function render() {
    if (!slides.length) {
      els.slide.innerHTML = '<h1 class="slide-title">اسلایدی پیدا نشد</h1>';
      return;
    }

    current = clamp(current, 0, slides.length - 1);
    const item = slides[current];
    document.title = `${item.title} | آزمایشگاه جنگو`;
    history.replaceState(null, '', `#slide-${current + 1}`);

    els.slide.innerHTML = `
      <div class="slide-kicker-top">
        <span class="chip">${item.level || 'درس'}</span>
        <span>${item.section}</span>
      </div>
      <h1 class="slide-title">${item.title}</h1>
      ${item.subtitle ? `<p class="slide-sub">${item.subtitle}</p>` : ''}
      ${item.body}
      <footer class="slide-foot">
        <span>اسلاید ${faDigits(current + 1)} از ${faDigits(slides.length)}</span>
        <span><kbd class="kbd">←</kbd> <kbd class="kbd">→</kbd> حرکت، <kbd class="kbd">T</kbd> فهرست، <kbd class="kbd">/</kbd> جست‌وجو</span>
      </footer>
    `;

    bindSlideActions();
    updateProgress();
    updateActiveToc();
    updateControls();
    els.slide.focus({ preventScroll: true });
    document.querySelector('.slide-wrapper').scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindSlideActions() {
    els.slide.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.code || '');
          btn.textContent = 'کپی شد';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'کپی';
            btn.classList.remove('copied');
          }, 1400);
        } catch {
          btn.textContent = 'خطا';
        }
      });
    });

    els.slide.querySelectorAll('.reveal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const solution = btn.nextElementSibling;
        if (!solution) return;
        solution.classList.toggle('open');
        btn.textContent = solution.classList.contains('open') ? 'پنهان کردن راه‌حل' : 'نمایش راه‌حل';
      });
    });
  }

  function buildToc() {
    const grouped = sections().map(section => ({
      section,
      slides: slides
        .map((slide, index) => ({ ...slide, index }))
        .filter(slide => slide.section === section),
    }));

    els.toc.innerHTML = grouped.map(group => `
      <div class="toc-section" data-section="${group.section}">
        <div class="toc-section-title">${group.section}</div>
        ${group.slides.map(slide => `
          <button class="toc-link" type="button" data-index="${slide.index}">
            <span class="toc-num">${faDigits(slide.index + 1)}</span>
            <span>${slide.title}</span>
          </button>
        `).join('')}
      </div>
    `).join('');

    els.toc.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', () => go(Number(link.dataset.index)));
    });
  }

  function buildSectionJump() {
    els.sectionJump.innerHTML = sections().map(section => {
      const index = sectionFirstIndex(section);
      return `<option value="${index}">${section}</option>`;
    }).join('');
    els.sectionJump.addEventListener('change', () => go(Number(els.sectionJump.value)));
  }

  function buildOverview() {
    if (!els.overviewGrid) return;
    els.overviewGrid.innerHTML = sections().map(section => {
      const count = slides.filter(slide => slide.section === section).length;
      const index = sectionFirstIndex(section);
      return `
        <button class="overview-card" type="button" data-index="${index}">
          <h3>${section}</h3>
          <p>${faDigits(count)} اسلاید آموزشی، همراه با توضیح و کد.</p>
          <span class="ov-count">شروع از اسلاید ${faDigits(index + 1)}</span>
        </button>
      `;
    }).join('');

    els.overviewGrid.querySelectorAll('.overview-card').forEach(card => {
      card.addEventListener('click', () => {
        closeOverview();
        go(Number(card.dataset.index));
      });
    });
  }

  function updateProgress() {
    const percent = slides.length <= 1 ? 100 : ((current + 1) / slides.length) * 100;
    els.progressBar.style.width = `${percent}%`;
    els.progressLabel.textContent = `${faDigits(current + 1)} / ${faDigits(slides.length)}`;
    els.slideKicker.textContent = `${slides[current].section} - ${slides[current].title}`;
    els.sectionJump.value = sectionFirstIndex(slides[current].section);
  }

  function updateActiveToc() {
    els.toc.querySelectorAll('.toc-link').forEach(link => {
      const active = Number(link.dataset.index) === current;
      link.classList.toggle('active', active);
      if (active) link.scrollIntoView({ block: 'nearest' });
    });
  }

  function updateControls() {
    els.prevBtn.disabled = current === 0;
    els.nextBtn.disabled = current === slides.length - 1;
  }

  function go(index) {
    current = clamp(index, 0, slides.length - 1);
    render();
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('django-lab-theme', theme);
    els.themeIcon.innerHTML = theme === 'dark'
      ? '<path fill="currentColor" d="M12 2a10 10 0 107.1 17.1A8 8 0 0112 2z"/>'
      : '<path fill="currentColor" d="M12 4V1h-0v3h0zm0 19v-3h0v3h0zM4 13H1v-2h3v2zm19 0h-3v-2h3v2zM5.6 7L3.5 4.9l1.4-1.4L7 5.6 5.6 7zm14.9 12.1l-1.4 1.4-2.1-2.1 1.4-1.4 2.1 2.1zM18.4 7L17 5.6l2.1-2.1 1.4 1.4L18.4 7zM4.9 20.5l-1.4-1.4L5.6 17 7 18.4l-2.1 2.1zM12 6a6 6 0 100 12 6 6 0 000-12z"/>';
  }

  function filterToc(query) {
    const q = query.trim().toLowerCase();
    els.toc.querySelectorAll('.toc-section').forEach(sectionEl => {
      let visibleCount = 0;
      sectionEl.querySelectorAll('.toc-link').forEach(link => {
        const index = Number(link.dataset.index);
        const slide = slides[index];
        const haystack = `${slide.section} ${slide.title} ${slide.subtitle} ${slide.body}`.toLowerCase();
        const visible = !q || haystack.includes(q);
        link.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      sectionEl.hidden = visibleCount === 0;
    });
  }

  function openOverview() {
    els.overview.hidden = false;
  }

  function closeOverview() {
    els.overview.hidden = true;
  }

  function bindGlobalActions() {
    els.prevBtn.addEventListener('click', prev);
    els.nextBtn.addEventListener('click', next);
    els.menuToggle.addEventListener('click', () => els.sidebar.classList.toggle('collapsed'));
    els.printBtn.addEventListener('click', () => window.print());
    els.themeToggle.addEventListener('click', () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
    els.searchInput.addEventListener('input', () => filterToc(els.searchInput.value));

    document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeOverview));
    document.querySelector('.brand').addEventListener('dblclick', openOverview);

    window.addEventListener('hashchange', () => {
      const nextIndex = getIndexFromHash();
      if (nextIndex !== current) go(nextIndex);
    });

    document.addEventListener('keydown', (event) => {
      const tag = event.target && event.target.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (typing && event.key !== 'Escape') return;

      if (event.key === 'ArrowLeft') next();
      if (event.key === 'ArrowRight') prev();
      if (event.key.toLowerCase() === 't') els.sidebar.classList.toggle('collapsed');
      if (event.key.toLowerCase() === 'o') openOverview();
      if (event.key === '/') {
        event.preventDefault();
        els.searchInput.focus();
      }
      if (event.key === 'Escape') {
        closeOverview();
        els.searchInput.blur();
      }
    });
  }

  function init() {
    const savedTheme = localStorage.getItem('django-lab-theme');
    setTheme(savedTheme || document.documentElement.dataset.theme || 'dark');
    buildToc();
    buildSectionJump();
    buildOverview();
    bindGlobalActions();
    render();
  }

  init();
})(window);
