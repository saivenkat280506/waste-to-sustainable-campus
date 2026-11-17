/* ==========================================================================
   From Waste Campus to a Sustainable Campus — site behaviour
   Vanilla JS, no dependencies. Works from file:// without a server.
   ========================================================================== */
(function () {
  'use strict';

  var d = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- nav */
  var toggle = d.querySelector('.nav__toggle');
  var links = d.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
      d.body.classList.toggle('no-scroll', !open);
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        d.body.classList.remove('no-scroll');
      }
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        d.body.classList.remove('no-scroll');
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 940 && links.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        d.body.classList.remove('no-scroll');
      }
    });
  }

  /* ------------------------------------------------------ scroll progress */
  var bar = d.querySelector('.progress');
  var header = d.querySelector('.site-header');
  var toTop = d.querySelector('.to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var h = d.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    if (header) header.classList.toggle('is-stuck', y > 12);
    if (toTop) toTop.classList.toggle('is-on', y > 700);
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------ reveal on scroll */
  var revealables = Array.prototype.slice.call(d.querySelectorAll('.reveal'));
  var io = null;

  if (revealables.length) {
    var byParent = {};
    revealables.forEach(function (el) {
      var key = el.parentNode ? (el.parentNode.getAttribute('data-stagger') || el.parentNode.className) : 'x';
      if (!byParent[key]) byParent[key] = [];
      byParent[key].push(el);
    });
    Object.keys(byParent).forEach(function (key) {
      byParent[key].forEach(function (el, i) {
        if (!el.style.getPropertyValue('--d')) {
          el.style.setProperty('--d', Math.min(i * 90, 540) + 'ms');
        }
      });
    });

    function show(el) {
      el.classList.add('is-in');
      if (io) io.unobserve(el);
    }

    if (reduce || !('IntersectionObserver' in window)) {
      revealables.forEach(show);
    } else {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) show(entry.target);
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 6% 0px' });
      revealables.forEach(function (el) { io.observe(el); });

      var sweepScheduled = false;
      function sweep() {
        sweepScheduled = false;
        var vh = window.innerHeight;
        revealables.forEach(function (el) {
          if (el.classList.contains('is-in')) return;
          var r = el.getBoundingClientRect();
          if (r.bottom <= 0 || (r.top < vh * 0.94 && r.bottom > 0)) show(el);
        });
      }
      function scheduleSweep() {
        if (!sweepScheduled) {
          sweepScheduled = true;
          window.requestAnimationFrame(sweep);
        }
      }
      window.addEventListener('scroll', scheduleSweep, { passive: true });
      window.addEventListener('resize', scheduleSweep, { passive: true });
      window.addEventListener('load', scheduleSweep);
      sweep();
    }
  }

  /* ------------------------------------------------- active nav highlight */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  d.querySelectorAll('.nav__links a[href]').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ------------------------------------------------------------ footer year */
  d.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ============================================================ HOTSPOTS */
  var SPOTS = {
    bins: {
      title: 'The bin station',
      body: 'Three labelled bins sit on the main walkway: wet waste, paper and plastic. Labelling is the whole trick — people sort correctly when the bin tells them where things belong.'
    },
    academic: {
      title: 'Academic block',
      body: 'Classrooms and offices are the biggest source of paper. Reducing unnecessary printing and reusing the backs of sheets is the first objective in action.'
    },
    canteen: {
      title: 'The canteen',
      body: 'Canteens generate packaging and wet waste together. Keeping food waste apart from paper and plastic is what makes recycling cleaner and more hygienic.'
    },
    library: {
      title: 'Library & study halls',
      body: 'Used sheets, notes and paper scraps are collected here — for recycling, or for seed paper where suitable materials and safe methods are available.'
    },
    garden: {
      title: 'Campus garden',
      body: 'Clean, suitable plastic is cut into plant pots and trays for this bed. Reuse happens here, and it supports the greenery the campus already has.'
    },
    fountain: {
      title: 'Fountain & lawns',
      body: 'Cleaner surroundings help protect habitats and living organisms. Litter near water is the fastest route from campus to the wider ecosystem.'
    },
    sports: {
      title: 'Sports area',
      body: 'Bottles, wrappers and packaging collect here after use. A small labelled station at the edge of the field keeps most of it out of the litter.'
    },
    gate: {
      title: 'Gate & collection point',
      body: 'Set collection times and covered containers keep the handover to authorised recyclers tidy — and make it easy to see whether the plan is working.'
    }
  };

  d.querySelectorAll('[data-hotspot]').forEach(function (root) {
    var panel = root.querySelector('[data-spot-panel]');
    var pins = Array.prototype.slice.call(root.querySelectorAll('[data-spot]'));
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.hotspot__tab'));

    function activate(id) {
      var info = SPOTS[id];
      if (!info || !panel) return;
      panel.innerHTML = '<h3>' + info.title + '</h3><p>' + info.body + '</p>';
      pins.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-spot') === id);
      });
      tabs.forEach(function (t) {
        t.classList.toggle('is-active', t.getAttribute('data-spot') === id);
      });
    }

    pins.concat(tabs).forEach(function (el) {
      el.addEventListener('click', function () {
        activate(el.getAttribute('data-spot'));
      });
      el.addEventListener('mouseenter', function () {
        if (el.classList.contains('hotspot__pin')) activate(el.getAttribute('data-spot'));
      });
    });

    var first = pins.length ? pins[0].getAttribute('data-spot') : null;
    if (first) activate(first);
  });

  /* ====================================================== BEFORE / AFTER */
  d.querySelectorAll('[data-compare]').forEach(function (box) {
    var ratio = 50;

    function apply() {
      box.style.setProperty('--ratio', ratio + '%');
      box.setAttribute('aria-valuenow', Math.round(ratio));
      var l = box.querySelector('.compare__label--l');
      var r = box.querySelector('.compare__label--r');
      if (l) l.style.opacity = ratio < 8 ? 0 : 1;
      if (r) r.style.opacity = ratio > 92 ? 0 : 1;
    }

    function fromEvent(e) {
      var r = box.getBoundingClientRect();
      var x = (e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX)) - r.left;
      ratio = Math.max(0, Math.min(100, (x / r.width) * 100));
      apply();
    }

    var dragging = false;
    box.addEventListener('pointerdown', function (e) {
      dragging = true;
      fromEvent(e);
      try { box.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      e.preventDefault();
    });
    box.addEventListener('pointermove', function (e) {
      if (dragging) fromEvent(e);
    });
    box.addEventListener('pointerup', function (e) {
      dragging = false;
      fromEvent(e);
      try { box.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    box.addEventListener('pointercancel', function () { dragging = false; });
    box.addEventListener('pointercancel', function () { dragging = false; });

    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { ratio = Math.max(0, ratio - 4); apply(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { ratio = Math.min(100, ratio + 4); apply(); e.preventDefault(); }
    });

    apply();
  });

  /* ========================================================== ACCORDION */
  d.querySelectorAll('.acc__item').forEach(function (item) {
    var btn = item.querySelector('.acc__btn');
    var panel = item.querySelector('.acc__panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      // one open at a time
      var group = item.parentElement;
      if (group && group.classList.contains('acc')) {
        group.querySelectorAll('.acc__btn[aria-expanded="true"]').forEach(function (b) {
          if (b !== btn) {
            b.setAttribute('aria-expanded', 'false');
            b.closest('.acc__item').classList.remove('is-open');
          }
        });
      }
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  /* =========================================================== SCROLLER */
  d.querySelectorAll('[data-scroller]').forEach(function (wrap) {
    var track = wrap.querySelector('.scroller');
    var prev = wrap.querySelector('[data-scroll-prev]');
    var next = wrap.querySelector('[data-scroll-next]');
    if (!track) return;
    function step(dir) {
      var card = track.querySelector('.panel');
      var amount = card ? card.getBoundingClientRect().width + 18 : 360;
      track.scrollBy({ left: dir * amount, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  });

  /* =========================================================== COUNTERS */
  var counters = Array.prototype.slice.call(d.querySelectorAll('[data-count]'));
  if (counters.length) {
    function runCount(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-count-suffix') || '';
      var pad = parseInt(el.getAttribute('data-count-pad'), 10);
      if (reduce) {
        el.textContent = (pad ? String(target).padStart(pad, '0') : target) + suffix;
        return;
      }
      var start = null;
      var dur = 1100;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = (pad ? String(val).padStart(pad, '0') : val) + suffix;
        if (p < 1) window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (c) { cio.observe(c); });
    } else {
      counters.forEach(runCount);
    }
  }

  /* ================================================================ TOC */
  var tocLinks = Array.prototype.slice.call(d.querySelectorAll('[data-toc] a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = d.getElementById(id);
      if (sec) map[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          tocLinks.forEach(function (x) { x.classList.remove('is-current'); });
          a.classList.add('is-current');
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { spy.observe(d.getElementById(id)); });
  }

  /* ==================================================== SEGREGATION LAB */
  var lab = d.querySelector('[data-lab]');
  if (lab) {
    var BIN = {
      paper: {
        title: 'Paper bin',
        text: 'Used sheets, notes and paper scraps can be recycled, or turned into seed paper where suitable materials and safe methods are available. Keep them <strong>clean and dry</strong> so the pulp stays usable.'
      },
      plastic: {
        title: 'Plastic bin',
        text: 'Clean, suitable plastic containers can be reused as plant pots or trays, or sent to an approved recycler. <strong>Never melt or burn plastic on campus</strong> — fumes and heat make unsafe DIY methods risky.'
      },
      wet: {
        title: 'Wet waste bin',
        text: 'Food and other wet waste belongs in its own bin. Keeping it apart from paper and plastic makes recycling <strong>cleaner and more hygienic</strong>, and cuts contamination at the source.'
      }
    };

    var feedback = lab.querySelector('[data-lab-feedback]');
    var scoreEl = lab.querySelector('[data-lab-score]');
    var items = Array.prototype.slice.call(lab.querySelectorAll('[data-item]'));
    var bins = Array.prototype.slice.call(lab.querySelectorAll('[data-bin]'));
    var reset = lab.querySelector('[data-lab-reset]');
    var selected = null;
    var sorted = 0;

    function nameOf(key) {
      var el = lab.querySelector('[data-item="' + key + '"] .lab__name');
      return el ? el.textContent.trim() : key;
    }

    function paintBin(id, cls) {
      bins.forEach(function (b) {
        b.classList.remove('is-hit', 'is-hit--wrong');
        if (b.getAttribute('data-bin') === id) b.classList.add(cls);
      });
    }

    function clearBins() {
      bins.forEach(function (b) { b.classList.remove('is-hit', 'is-hit--wrong'); });
    }

    function selectItem(key) {
      selected = key;
      items.forEach(function (b) { b.classList.remove('is-selected'); });
      var btn = lab.querySelector('[data-item="' + key + '"]');
      if (btn) btn.classList.add('is-selected');
      clearBins();
      feedback.innerHTML = 'You picked <strong>' + nameOf(key) + '</strong>. Which labelled bin does it belong in?';
    }

    function submit(kind, picked) {
      var info = BIN[kind];
      if (!info) return;

      if (picked === kind) {
        var item = lab.querySelector('[data-item="' + kind + '"]');
        if (item) {
          item.classList.add('is-sorted');
          item.classList.remove('is-selected');
          item.disabled = true;
          item.setAttribute('draggable', 'false');
        }
        sorted += 1;
        selected = null;
        paintBin(kind, 'is-hit');
        feedback.innerHTML = '<strong>Correct — ' + info.title + '.</strong> ' + info.text;
        if (scoreEl) {
          scoreEl.innerHTML = 'Sorted <b>' + sorted + '</b> of ' + items.length +
            (sorted === items.length ? ' &middot; clean sweep!' : ' &middot; keep going.');
        }
      } else {
        paintBin(picked, 'is-hit--wrong');
        var wrongLabel = bins.filter(function (b) { return b.getAttribute('data-bin') === picked; })[0];
        var wl = wrongLabel ? wrongLabel.querySelector('.bin__label') : null;
        feedback.innerHTML = '<strong>Not that one.</strong> The ' +
          ((wl ? wl.textContent.trim() : picked) + ' bin').toLowerCase() +
          ' is for something else. “' + nameOf(kind) + '” goes in the <strong>' +
          info.title.toLowerCase() + '</strong>. ' + info.text;
        window.setTimeout(function () { if (selected) paintBin(kind, 'is-hit'); }, 1400);
      }
    }

    /* Pointer-based drag: works with a mouse, a finger or a stylus. */
    var ghost = null;
    var dragKey = null;
    var dragMoved = false;
    var startX = 0, startY = 0;
    var dragPointer = null;
    var suppressClick = false;

    function binUnder(x, y) {
      var el = d.elementFromPoint(x, y);
      return el ? el.closest('[data-bin]') : null;
    }

    function makeGhost(key, rect) {
      var g = d.createElement('div');
      g.className = 'lab__ghost';
      g.innerHTML = '<strong>' + nameOf(key) + '</strong><span>drop into a labelled bin</span>';
      g.style.width = Math.max(180, rect.width) + 'px';
      g.style.left = (rect.left + rect.width / 2) + 'px';
      g.style.top = (rect.top + rect.height / 2) + 'px';
      d.body.appendChild(g);
      return g;
    }

    function clearGhost() {
      if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
      ghost = null;
      bins.forEach(function (b) { b.classList.remove('is-over'); });
    }

    items.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-sorted')) return;
        if (dragMoved || suppressClick) return;
        selectItem(btn.getAttribute('data-item'));
      });

      btn.addEventListener('pointerdown', function (e) {
        if (btn.classList.contains('is-sorted')) return;
        dragKey = btn.getAttribute('data-item');
        dragMoved = false;
        dragPointer = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        selected = dragKey;
        items.forEach(function (b) { b.classList.remove('is-selected'); });
        btn.classList.add('is-selected');
        try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        e.preventDefault();
      });

      btn.addEventListener('pointermove', function (e) {
        if (!dragKey || e.pointerId !== dragPointer) return;
        var dx = Math.abs(e.clientX - startX);
        var dy = Math.abs(e.clientY - startY);
        if (!dragMoved && (dx > 7 || dy > 7)) {
          dragMoved = true;
          ghost = makeGhost(dragKey, btn.getBoundingClientRect());
          btn.classList.add('is-dragging');
          feedback.innerHTML = 'Drop it into the right labelled bin — <strong>' + nameOf(dragKey) + '</strong>.';
        }
        if (dragMoved && ghost) {
          ghost.style.transform = 'translate(-50%,-50%) translate(' + e.clientX + 'px,' + e.clientY + 'px)';
          var over = binUnder(e.clientX, e.clientY);
          bins.forEach(function (b) { b.classList.toggle('is-over', b === over); });
        }
      });

      function endDrag(e) {
        if (!dragKey) return;
        var key = dragKey;
        var wasDrag = dragMoved;
        var over = wasDrag && e ? binUnder(e.clientX, e.clientY) : null;
        dragKey = null;
        dragPointer = null;
        dragMoved = false;
        btn.classList.remove('is-dragging');
        clearGhost();
        if (wasDrag) {
          suppressClick = true;
          setTimeout(function () { suppressClick = false; }, 350);
          if (over) {
            submit(key, over.getAttribute('data-bin'));
          } else {
            feedback.innerHTML = 'Dropped outside a bin — pick it up again, or tap an item and then tap its bin.';
          }
        }
      }

      btn.addEventListener('pointerup', endDrag);
      btn.addEventListener('pointercancel', endDrag);
    });

    bins.forEach(function (bin) {
      bin.addEventListener('click', function () {
        if (!selected) {
          feedback.innerHTML = 'Pick up an item first — <strong>drag it</strong> or tap it, then choose its bin.';
          return;
        }
        submit(selected, bin.getAttribute('data-bin'));
      });

    });

    if (reset) {
      reset.addEventListener('click', function () {
        selected = null;
        sorted = 0;
        dragKey = null;
        dragMoved = false;
        if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
        ghost = null;
        items.forEach(function (btn) {
          btn.classList.remove('is-selected', 'is-sorted', 'is-dragging');
          btn.disabled = false;
          btn.setAttribute('draggable', 'true');
        });
        clearBins();
        feedback.innerHTML = 'Drag each item into the right labelled bin — <strong>wet waste</strong>, <strong>paper</strong> or <strong>plastic</strong>.';
        if (scoreEl) scoreEl.innerHTML = 'Sorted <b>0</b> of ' + items.length + ' &middot; ready when you are.';
      });
    }
  }

  /* ------------------------------------------------- banner marquee (loop) */
  var track = d.querySelector('.banner__track');
  if (track) track.innerHTML += track.innerHTML;
})();
