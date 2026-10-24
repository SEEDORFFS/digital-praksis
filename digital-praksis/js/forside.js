/*
 * Digital praksis · kort trykreaktion på berøringsskærme.
 * Alt indhold og alle links virker uden denne fil.
 */
(function () {
  'use strict';
  document.querySelectorAll('.area').forEach(function (area) {
    var timer = 0;
    area.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      if (!e.target.closest('.icon, .tool')) return;
      clearTimeout(timer);
      area.classList.add('is-pressed');
      timer = setTimeout(function () { area.classList.remove('is-pressed'); }, 220);
    }, { passive: true });
  });
})();
