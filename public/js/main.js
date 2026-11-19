/* PranaBibi — interactions légères (menu, révélation, année) */
(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var menu = document.getElementById('primary-nav');

  function setOpen(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);

    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus();
    } else if (menu.contains(document.activeElement)) {
      burger.focus();
    }
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || burger.contains(e.target)) return;
      setOpen(false);
    });
  }

  /* Révélation au scroll, avec repli sans JS / mouvement réduit */
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* Téléphone masqué : le numéro est construit au clic */
  document.querySelectorAll('.reveal-tel').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var a = document.createElement('a');
      a.href = 'tel:' + ['+32', '493', '82', '83', '31'].join('');
      a.textContent = ['0493', '82', '83', '31'].join(' ');
      btn.replaceWith(a);
    });
  });

  /* WhatsApp : lien construit au clic, numéro absent du HTML */
  var wa = document.querySelector('.social-wa');
  if (wa) {
    wa.addEventListener('click', function () {
      var n = ['32', '493', '82', '83', '31'].join('');
      window.open('https://wa.me/' + n, '_blank', 'noopener');
    });
  }

  /* Bandeau -20 % : compact au scroll, fermable */
  var promo = document.getElementById('promo-bar');
  if (promo && !promo.closest('.site-header')) {
    var onPromoScroll = function () {
      promo.classList.toggle('compact', window.scrollY > 120);
    };
    window.addEventListener('scroll', onPromoScroll, { passive: true });
    onPromoScroll();

    var promoClose = promo.querySelector('.promo-close');
    if (promoClose) {
      promoClose.addEventListener('click', function () {
        promo.hidden = true;
      });
    }
  }

  /* Ruban bon cadeau : rétrécit au scroll */
  var ribbon = document.querySelector('.gift-ribbon');
  if (ribbon) {
    var onRibbonScroll = function () {
      ribbon.classList.toggle('compact', window.scrollY > 120);
    };
    window.addEventListener('scroll', onRibbonScroll, { passive: true });
    onRibbonScroll();
  }

  /* Hauteur réelle du header (bandeau inclus) -> variable CSS --header-h */
  var header = document.querySelector('.site-header');
  if (header) {
    var syncHeader = function () {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    if (window.ResizeObserver) { new ResizeObserver(syncHeader).observe(header); }
    window.addEventListener('resize', syncHeader);
    window.addEventListener('load', syncHeader);
    syncHeader();
  }

  /* Bulle de définition au survol des termes de massage */
  var terms = document.querySelectorAll('.term[data-def]');
  if (terms.length && window.matchMedia('(hover: hover)').matches) {
    var tip = document.createElement('div');
    tip.className = 'term-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    document.body.appendChild(tip);

    var showTip = function (el) {
      tip.textContent = el.getAttribute('data-def');
      tip.hidden = false;
      var r = el.getBoundingClientRect();
      var tw = tip.offsetWidth;
      var th = tip.offsetHeight;
      var left = Math.min(Math.max(12, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 12);
      var top = r.top - th - 10;
      if (top < 12) top = r.bottom + 10;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    };

    var hideTip = function () { tip.hidden = true; };

    terms.forEach(function (el) {
      el.addEventListener('mouseenter', function () { showTip(el); });
      el.addEventListener('mouseleave', hideTip);
      el.addEventListener('focus', function () { showTip(el); });
      el.addEventListener('blur', hideTip);
      el.addEventListener('click', hideTip);
    });

    window.addEventListener('scroll', hideTip, { passive: true });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
