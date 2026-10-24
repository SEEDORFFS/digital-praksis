/*
 * Digital praksis · kopiér startprompt
 * Kopierer den aktuelle tekst i boksen (også det, brugeren har rettet).
 * Virker kopiering ikke, markeres teksten, så den kan kopieres manuelt.
 */
(function () {
  'use strict';
  var btn = document.getElementById('kopier');
  var reset = document.getElementById('gendan');
  var msg = document.getElementById('kopier-besked');
  if (!btn) return;
  var box = document.getElementById(btn.getAttribute('data-target'));
  var original = box.value;
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        say('Kopieret. Sæt teksten ind hos din AI-assistent.', true);
      }, function () {
        if (legacyCopy()) say('Kopieret. Sæt teksten ind hos din AI-assistent.', true); else manual();
      });
    } else if (legacyCopy()) {
      say('Kopieret. Sæt teksten ind hos din AI-assistent.', true);
    } else {
      manual();
    }
  });

  if (reset) reset.addEventListener('click', function () {
    box.value = original;
    say('Startprompten er gendannet.', true);
    box.focus();
  });
})();
