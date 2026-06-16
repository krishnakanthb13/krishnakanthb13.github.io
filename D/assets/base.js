/* ============================================================
   KKB · Dump — shared behaviour
   Builds the page chrome (top bar, theme switch, progress,
   back-to-top, footer) so individual pages stay tiny, and
   manages the light / dark / system theme.
   ============================================================ */
(function () {
  var root = document.documentElement,
      body = document.body,
      KEY  = 'kkb-theme',
      mq   = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---- theme ---- */
  function resolve(mode){ return (mode === 'dark' || (mode === 'system' && mq.matches)) ? 'dark' : 'light'; }
  function apply(mode){
    root.setAttribute('data-mode', mode);
    root.setAttribute('data-theme', resolve(mode));
    document.querySelectorAll('[data-set-theme]').forEach(function (b) {
      var on = b.getAttribute('data-set-theme') === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
  }

  /* ---- chrome ---- */
  /* relative defaults so links resolve both locally (file://) and on
     GitHub Pages — home = résumé one level up, section = hub in this folder */
  var section     = body.getAttribute('data-section')      || 'Dump';
  var crumb       = body.getAttribute('data-crumb')        || '';
  var home        = body.getAttribute('data-home')         || '../BKK.html';
  var sectionHref = body.getAttribute('data-section-href') || 'index.html';

  /* breadcrumb: Home / Section / Crumb — Section becomes the
     current page when no crumb is set (used by the hub itself). */
  var crumbsHTML = "<a href='" + home + "'>Home</a><span class='sep'>/</span>" + (crumb
    ? "<a href='" + sectionHref + "'>" + section + "</a><span class='sep'>/</span><span class='here'>" + crumb + "</span>"
    : "<span class='here'>" + section + "</span>");

  var SUN  = "<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='4'/><path d='M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19'/></svg>";
  var SYS  = "<svg viewBox='0 0 24 24'><rect x='3' y='4' width='18' height='13' rx='2'/><path d='M8 21h8M12 17v4'/></svg>";
  var MOON = "<svg viewBox='0 0 24 24'><path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'/></svg>";

  var prog = document.createElement('div');
  prog.className = 'reading-progress';
  prog.innerHTML = "<span id='rp-bar'></span>";

  var header = document.createElement('header');
  header.className = 'topbar';
  header.innerHTML =
    "<a class='brand' href='" + home + "' title='Home'><span class='brand-mark'>KKB</span></a>" +
    "<nav class='crumbs' aria-label='Breadcrumb'>" + crumbsHTML + "</nav>" +
    "<span class='grow'></span>" +
    "<div class='theme-switch' role='group' aria-label='Theme'>" +
      "<button data-set-theme='light' title='Light' aria-label='Light theme'>" + SUN + "</button>" +
      "<button data-set-theme='system' title='System' aria-label='System theme'>" + SYS + "</button>" +
      "<button data-set-theme='dark' title='Dark' aria-label='Dark theme'>" + MOON + "</button>" +
    "</div>" +
    "<a class='home-link' href='" + home + "'>↗ Portfolio</a>";

  body.insertBefore(header, body.firstChild);
  body.insertBefore(prog, body.firstChild);

  var top = document.createElement('a');
  top.className = 'to-top'; top.href = '#'; top.id = 'toTop';
  top.setAttribute('aria-label', 'Back to top'); top.innerHTML = '↑';
  body.appendChild(top);

  var page = document.querySelector('.page') || body;
  var updated = body.getAttribute('data-updated');
  var foot = document.createElement('footer');
  foot.className = 'page-footer';
  foot.innerHTML = "<p>krishnakanthb13 &middot; " + section + " &mdash; <a href='" + home + "'>back to portfolio</a></p>" +
    (updated ? "<p class='updated'>Last updated " + updated + "</p>" : "");
  page.appendChild(foot);

  /* ---- wire it up ---- */
  apply(localStorage.getItem(KEY) || 'system');

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set-theme]');
    if (b) { var m = b.getAttribute('data-set-theme'); localStorage.setItem(KEY, m); apply(m); }
  });
  if (mq.addEventListener) mq.addEventListener('change', function () {
    if ((localStorage.getItem(KEY) || 'system') === 'system') apply('system');
  });

  var bar = document.getElementById('rp-bar');
  function onScroll(){
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%';
    top.classList.toggle('show', window.scrollY > 400);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---- accordions ---- */
  document.querySelectorAll('[data-collapse]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = this.classList.toggle('open');
      this.setAttribute('aria-expanded', open);
      var c = this.nextElementSibling;
      if (c) c.style.maxHeight = open ? c.scrollHeight + 'px' : null;
    });
  });
})();
