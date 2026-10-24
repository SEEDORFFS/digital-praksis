/*
 * Digital praksis · startprompt
 * - Felterne (fag, målgruppe, behov) skriver sig ind i prompten.
 * - "Kopiér startprompt" kopierer den aktuelle tekst, også det brugeren har rettet.
 *   Virker kopiering ikke, markeres teksten, så den kan kopieres manuelt.
 * - ?fra=<app> i adressen viser et kort eksempel fra den app, man kommer fra.
 */
(function () {
  'use strict';
  var btn = document.getElementById('kopier');
  var reset = document.getElementById('gendan');
  var msg = document.getElementById('kopier-besked');
  var box = btn ? document.getElementById(btn.getAttribute('data-target')) : null;

  /* ---------- kommer fra en app ---------- */
  try {
    var data = JSON.parse((document.getElementById('fra-data') || {}).textContent || '{}');
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

  if (!box) return;

  /* ---------- felter → prompt ---------- */
  var tpl = box.getAttribute('data-skabelon') || '';
  var defaults = { fag: '', maalgruppe: '', behov: '' };
  var fields = {};
  ['fag', 'maalgruppe', 'behov'].forEach(function (k) {
    fields[k] = document.getElementById('pf-' + k);
  });
  // standardteksterne i firkantede parenteser hentes fra den oprindelige prompt
  var original = box.value;
  [['fag', /^Mit fag: (.*)$/m], ['maalgruppe', /^Målgruppe: (.*)$/m], ['behov', /^Mit behov: (.*)$/m]].forEach(function (p) {
    var m = original.match(p[1]); defaults[p[0]] = m ? m[1] : '';
  });
  var LINES = { fag: /^Mit fag: .*$/m, maalgruppe: /^Målgruppe: .*$/m, behov: /^Mit behov: .*$/m };
  var LABEL = { fag: 'Mit fag: ', maalgruppe: 'Målgruppe: ', behov: 'Mit behov: ' };

  function val(k) {
    var f = fields[k];
    var v = f && f.value.trim();
    return v ? v : defaults[k];
  }
  function fill() {
    // ret kun de tre linjer, så brugerens egne rettelser i resten af teksten bevares
    var t = box.value;
    Object.keys(LINES).forEach(function (k) {
      if (LINES[k].test(t)) t = t.replace(LINES[k], LABEL[k] + val(k));
    });
    box.value = t;
  }
  Object.keys(fields).forEach(function (k) {
    if (fields[k]) fields[k].addEventListener('input', fill);
  });

  /* ---------- kopiér ---------- */
  var timer = 0;
  function say(text, ok) {
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
  btn.addEventListener('click', function () {
    var text = box.value;
    var done = function () { say('Kopieret. Sæt teksten ind hos din AI-assistent.', true); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { if (legacyCopy()) done(); else manual(); });
    } else if (legacyCopy()) {
      done();
    } else {
      manual();
    }
  });

  /* ---------- gendan: oprindelig tekst med felternes indhold ---------- */
  if (reset) reset.addEventListener('click', function () {
    box.value = tpl
      ? tpl.replace('{fag}', val('fag')).replace('{maalgruppe}', val('maalgruppe')).replace('{behov}', val('behov'))
      : original;
    say('Startprompten er gendannet.', true);
    box.focus();
  });
})();
