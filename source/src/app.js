/* ORCGA MEDIA — site behaviour */
(function () {
  'use strict';

  /* Mobile navigation ------------------------------------------------ */
  var burger = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Header shadow on scroll ------------------------------------------ */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 12 ? '0 8px 30px rgba(17,24,39,.08)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll reveal ----------------------------------------------------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* Safety nets: never let content stay invisible. Deep links jump past
     the observer, and printing bypasses it entirely. */
  var revealAll = function () {
    items.forEach(function (el) { el.classList.add('in'); });
  };
  if (window.location.hash) { setTimeout(revealAll, 60); }
  window.addEventListener('beforeprint', revealAll);
  document.querySelectorAll('a[href*="#"]').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(revealAll, 60); });
  });

  /* Work filters ------------------------------------------------------ */
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        document.querySelectorAll('[data-cat]').forEach(function (card) {
          var show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* YouTube slots -----------------------------------------------------
     Any element with data-youtube="VIDEO_ID" becomes a click-to-play
     embed. Drop the 11-character ID from the share URL into that
     attribute and the card plays inline — no other edits needed.      */
  document.querySelectorAll('[data-youtube]').forEach(function (holder) {
    var id = (holder.getAttribute('data-youtube') || '').trim();
    if (!id || id.indexOf('REPLACE') === 0) return;

    /* The slot styling stays as the backdrop until a real thumbnail
       actually loads, so a slow or blocked image never leaves a black box. */
    var title = holder.getAttribute('data-title') || 'ORCGA Media film still';
    holder.setAttribute('data-slot', title);

    /* If the markup already supplies a thumbnail image, keep it as-is;
       otherwise load a still (a supplied one, else YouTube's own). */
    if (!holder.querySelector('img')) {
      var customThumb = (holder.getAttribute('data-thumb') || '').trim();
      var thumb = new Image();
      thumb.alt = title;
      thumb.loading = 'lazy';
      var triedFallback = false;
      thumb.onload = function () {
        if (thumb.naturalWidth < 200) { thumb.onerror(); return; }
        holder.classList.remove('slot');
        holder.insertBefore(thumb, holder.firstChild);
      };
      thumb.onerror = function () {
        if (triedFallback) return;
        triedFallback = true;
        thumb.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      };
      thumb.src = customThumb || 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
    }

    holder.classList.add('is-playable');
    holder.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      frame.title = title;
      frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      holder.textContent = '';
      holder.classList.remove('slot');
      holder.appendChild(frame);
    });
  });

  /* Contact form → mailto (no backend on a static host) --------------- */
  var form = document.querySelector('form[data-mailto]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = [
        'Name: ' + (d.get('name') || ''),
        'Organisation: ' + (d.get('org') || ''),
        'Email: ' + (d.get('email') || ''),
        'Service required: ' + (d.get('service') || ''),
        'Timeline: ' + (d.get('timeline') || ''),
        '',
        d.get('message') || ''
      ].join('\n');
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent('Project enquiry — ' + (d.get('org') || d.get('name') || 'New enquiry')) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* Footer year ------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
