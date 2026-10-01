/* Soul's Life — interazioni */
(function () {
  const d = document;

  /* ---- tema ---- */
  const saved = (() => { try { return localStorage.getItem('sl-theme'); } catch (e) { return null; } })();
  if (saved) d.documentElement.setAttribute('data-theme', saved);
  d.addEventListener('click', e => {
    const t = e.target.closest('[data-theme-toggle]');
    if (!t) return;
    const now = d.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    d.documentElement.setAttribute('data-theme', now);
    try { localStorage.setItem('sl-theme', now); } catch (e) {}
  });

  /* ---- nav ---- */
  const nav = d.querySelector('.nav');
  const bar = d.querySelector('.progress');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    if (bar) {
      const h = d.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = d.querySelector('.burger');
  const links = d.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
    links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open'); });
  }

  /* ---- reveal ---- */
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  d.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- contatori ---- */
  const cio = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '';
      const dur = 1300, t0 = performance.now();
      const step = now => {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = (end % 1 ? (end * e).toFixed(1) : Math.round(end * e)) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  d.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---- parallax hero ---- */
  const hm = d.querySelector('.hero-media img, .phero .hero-media img');
  if (hm && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 900);
      hm.style.transform = `scale(1.08) translateY(${y * 0.16}px)`;
    }, { passive: true });
  }

  /* ---- filtri galleria ---- */
  const chips = d.querySelectorAll('.chip');
  if (chips.length) {
    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(x => x.classList.remove('on'));
      c.classList.add('on');
      const f = c.dataset.filter;
      d.querySelectorAll('.tile').forEach(t => {
        t.hidden = !(f === 'all' || t.dataset.cat === f);
      });
    }));
  }

  /* ---- lightbox ---- */
  const lb = d.querySelector('.lb');
  if (lb) {
    const img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    let list = [], i = 0;
    const show = n => {
      const vis = list.filter(t => !t.hidden);
      if (!vis.length) return;
      i = (n + vis.length) % vis.length;
      const t = vis[i];
      img.src = t.querySelector('img').src;
      cap.textContent = t.querySelector('figcaption') ? t.querySelector('figcaption').textContent : '';
    };
    d.addEventListener('click', e => {
      const tile = e.target.closest('.tile');
      if (tile) {
        list = [...d.querySelectorAll('.tile')];
        const vis = list.filter(t => !t.hidden);
        show(vis.indexOf(tile));
        lb.classList.add('on');
        d.body.style.overflow = 'hidden';
      }
      if (e.target.closest('.lb-close') || e.target === lb) {
        lb.classList.remove('on'); d.body.style.overflow = '';
      }
      if (e.target.closest('.lb-next')) show(i + 1);
      if (e.target.closest('.lb-prev')) show(i - 1);
    });
    d.addEventListener('keydown', e => {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') { lb.classList.remove('on'); d.body.style.overflow = ''; }
      if (e.key === 'ArrowRight') show(i + 1);
      if (e.key === 'ArrowLeft') show(i - 1);
    });
  }

  /* ---- area riservata (demo) ---- */
  const form = d.querySelector('[data-locked-form]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const out = form.parentElement.querySelector('.hint');
      out.textContent = 'Area riservata: in questa anteprima l’accesso non è ancora attivo. Nella versione finale qui entrano libri e poesie.';
      out.style.color = 'var(--gold)';
    });
  }
})();
