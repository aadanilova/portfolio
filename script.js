/* Портфолио Анны Даниловой: тема, шапка, появление секций, счётчики, модалка проектов.
   Vanilla JS без зависимостей. Каждая часть работает независимо и не ломает страницу без JS. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  initTheme();
  initYear();
  initHeader();
  initReveal();
  initModal();
  initCookie();

  /* ---------- Тема: по умолчанию тёмная, светлая — по кнопке ---------- */
  function initTheme() {
    var toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    function current() {
      return root.dataset.theme === 'light' ? 'light' : 'dark';
    }

    function syncLabel() {
      toggle.setAttribute('aria-label', current() === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
    }

    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      syncLabel();
    });

    syncLabel();
  }

  /* ---------- Год в футере ---------- */
  function initYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Шапка: граница после прокрутки ---------- */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Появление при скролле + счётчики ---------- */
  function initReveal() {
    document.querySelectorAll('[data-stagger]').forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (child, i) {
        child.style.setProperty('--i', String(i % 6));
      });
    });

    var items = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  function renderCount(el, value) {
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var text = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
    el.textContent = (el.dataset.prefix || '') + text + (el.dataset.suffix || '');
  }

  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var factor = Math.pow(10, parseInt(el.dataset.decimals || '0', 10));
    if (isNaN(target) || el.dataset.counted) return;
    el.dataset.counted = 'true';
    if (reduceMotion.matches) {
      renderCount(el, target);
      return;
    }
    var duration = 1400;
    var start = null;
    renderCount(el, 0);
    window.requestAnimationFrame(function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      renderCount(el, Math.round(target * factor * (1 - Math.pow(1 - t, 3))) / factor);
      if (t < 1) window.requestAnimationFrame(step);
    });
  }

  /* ---------- Модалка проекта ----------
     Карточка: заголовок — компания (или тип работы), описание — проект.
     Контекст работы (H-ONE, Фриланс, Skillbox) и инструменты лежат в data-context / data-tools
     и показываются только в модалке. */
  function initModal() {
    var modal = document.getElementById('case-modal');
    if (!modal || typeof modal.showModal !== 'function') return;

    var contextEl = modal.querySelector('[data-modal-context]');
    var titleEl = modal.querySelector('[data-modal-title]');
    var subEl = modal.querySelector('[data-modal-sub]');
    var metaEl = modal.querySelector('[data-modal-meta]');
    var toolsEl = modal.querySelector('[data-modal-tools]');
    var contentEl = modal.querySelector('[data-modal-content]');
    var closeBtn = modal.querySelector('[data-close]');
    var lastTrigger = null;

    // «H-ONE · мерч» → части не рвутся внутри, перенос только между ними
    function renderContext(text) {
      var fragment = document.createDocumentFragment();
      text.split(' · ').forEach(function (part, i) {
        if (i) fragment.appendChild(document.createTextNode(' · '));
        var span = document.createElement('span');
        span.className = 'nowrap';
        span.textContent = part;
        fragment.appendChild(span);
      });
      contextEl.replaceChildren(fragment);
      contextEl.hidden = !text;
    }

    function open(button) {
      var card = button.closest('.case');
      if (!card) return;
      lastTrigger = button;

      var desc = card.querySelector('.case__desc');
      var tools = card.dataset.tools || '';
      renderContext(card.dataset.context || '');
      titleEl.textContent = button.textContent;
      subEl.textContent = desc ? desc.textContent : '';
      subEl.hidden = !desc;
      toolsEl.textContent = tools;
      metaEl.hidden = !tools;

      var fragment = document.createDocumentFragment();
      var tpl = card.querySelector('template.case__details');
      if (tpl) fragment.appendChild(tpl.content.cloneNode(true));

      // Своей галереи нет — показываем обложку карточки (или её плейсхолдер)
      var gallery = fragment.querySelector('.gallery');
      if (!gallery || !gallery.querySelector('img')) {
        if (gallery) gallery.remove();
        fragment.appendChild(card.querySelector('.case__media').cloneNode(true));
      }

      contentEl.replaceChildren(fragment);
      modal.showModal();
      modal.scrollTop = 0;
      if (closeBtn) closeBtn.focus();
    }

    document.querySelectorAll('.case__open').forEach(function (button) {
      button.addEventListener('click', function () { open(button); });
    });

    // Закрытие: крестик или клик по подложке (Esc закрывает нативно)
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('[data-close]')) modal.close();
    });

    modal.addEventListener('close', function () {
      contentEl.replaceChildren();
      if (lastTrigger) lastTrigger.focus();
    });

    // Удержание фокуса внутри модалки
    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = Array.prototype.filter.call(
        modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null; }
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
  /* ---------- Уведомление о cookie: показывается, пока не нажали «Понятно» ---------- */
  function initCookie() {
    var KEY = 'cookie-notice';
    var banner = document.querySelector('[data-cookie]');
    if (!banner) return;

    try {
      if (localStorage.getItem(KEY) === 'ok') return;
    } catch (e) {}

    banner.hidden = false;
    requestAnimationFrame(function () {
      banner.classList.add('is-visible');
    });

    banner.querySelector('[data-cookie-ok]').addEventListener('click', function () {
      try {
        localStorage.setItem(KEY, 'ok');
      } catch (e) {}
      banner.hidden = true;
    });
  }
})();
