/*
 * Digital praksis · prompt-boks med felter og kopiknap
 * Bruges af alle vejledninger med en prompt-boks.
 * - Et felt med data-linje="Mit fag: " skriver sig ind i den linje i prompten,
 *   der starter med samme tekst. Brugerens øvrige rettelser i teksten bevares.
 * - "Kopiér" kopierer den aktuelle tekst. Virker kopiering ikke, markeres teksten,
 *   så den kan kopieres manuelt.
 * - "Gendan" sætter den oprindelige tekst tilbage med felternes indhold.
 * - ?fra=<app> i adressen viser et kort eksempel fra den app, man kommer fra.
 */
(function () {
  'use strict';

  /* ---------- kommer fra en app ---------- */
  try {
    var dataEl = document.getElementById('fra-data');
    var data = dataEl ? JSON.parse(dataEl.textContent) : {};
    var fra = new URLSearchParams(location.search).get('fra');
    var app = fra && data[fra];
    if (app) {
      var eks = document.getElementById('fra-eksempel');
      if (eks) {
        eks.textContent = '';
        var st = document.createElement('strong');
        st.textContent = app.navn + ' er et eksempel:';
        eks.append(st, ' ' + app.tekst + ' Din idé kan være noget helt andet.');
      }
      var fb = document.getElementById('fra-boks');
      if (fb) {
        var a = document.createElement('a');
        a.href = '../' + app.side + '/';
        a.textContent = 'Tilbage til ' + app.navn;
        fb.append('Du kommer fra ' + app.navn + '. ', a);
        fb.hidden = false;
      }
    }
  } catch (e) { /* siden virker også uden */ }

  /* ---------- prompt-bokse ---------- */
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  document.querySelectorAll('.prompt').forEach(function (wrap) {
    var box = wrap.querySelector('textarea');
    var btn = wrap.querySelector('.btn-copy');
    var reset = wrap.querySelector('.btn-reset');
    var msg = wrap.querySelector('.prompt-msg');
    if (!box || !btn) return;
    var original = box.value;
    var fields = [].slice.call(wrap.querySelectorAll('input[data-linje]')).map(function (inp) {
      var label = inp.getAttribute('data-linje');
      var re = new RegExp('^' + esc(label) + '.*$', 'm');
      var m = original.match(re);
      return { inp: inp, label: label, re: re, def: m ? m[0].slice(label.length) : '' };
    });

    function apply(text) {
      fields.forEach(function (f) {
        var v = f.inp.value.trim() || f.def;
        if (f.re.test(text)) text = text.replace(f.re, function () { return f.label + v; });
      });
      return text;
    }
    fields.forEach(function (f) {
      f.inp.addEventListener('input', function () { box.value = apply(box.value); });
    });

    var timer = 0;
    function say(text, ok) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = 'prompt-msg ' + (ok ? 'is-ok' : 'is-warn');
      clearTimeout(timer);
      if (ok) timer = setTimeout(function () { msg.textContent = ''; msg.className = 'prompt-msg'; }, 4000);
    }
    function manual() {
      box.focus();
      box.select();
      say('Kunne ikke kopiere automatisk. Teksten er markeret: tryk Ctrl+C (Cmd+C på Mac).', false);
    }
    function legacyCopy() {
      try {
        box.focus();
        box.select();
        var ok = document.execCommand && document.execCommand('copy');
        box.setSelectionRange(box.value.length, box.value.length);
        return !!ok;
      } catch (e) { return false; }
    }
    var okText = btn.getAttribute('data-ok') || 'Kopieret. Sæt teksten ind hos din AI-assistent.';
    btn.addEventListener('click', function () {
      var text = box.value;
      var done = function () { say(okText, true); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { if (legacyCopy()) done(); else manual(); });
      } else if (legacyCopy()) {
        done();
      } else {
        manual();
      }
    });
    if (reset) reset.addEventListener('click', function () {
      box.value = apply(original);
      say('Teksten er gendannet.', true);
      box.focus();
    });
  });
})();
