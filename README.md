# Digital praksis

Forside med værktøjer og inspiration til undervisning: tre områder med hver sit bløde 3D-ikon og direkte links nedenunder. Siden er ren HTML og CSS med en lille smule JavaScript og kan lægges direkte på GitHub Pages.

## Filer

| Fil | Indhold |
|---|---|
| `index.html` | **Siden og alt indhold:** områder, beskrivelser og links |
| `css/style.css` | Udseendet |
| `js/forside.js` | Kort trykreaktion på berøringsskærme (siden virker også uden den) |
| `assets/ikoner/` | De tre ikoner: `<navn>.webp` er objektet, `<navn>-skygge.webp` er kontaktskyggen |
| `tools/render/` | 3D-modellerne og værktøjet, der laver ikonerne |

## Tilføj eller ret et link

Åbn `index.html`. Under hvert område står en liste (`<ul class="tools">`):

- **Aktivt link:** kopiér en `<li>` med `<a class="tool" href="…">`, og ret adressen, navnet (`tool-name`) og typen (`tool-kind`, fx "Skema").
- **Noget, der er på vej:** brug en `<li>` med `<span class="tool tool--soon">`. Den har intet link og viser "På vej".
- **Når et "På vej"-punkt får et link:** udskift dets `<span class="tool tool--soon">…</span>` med et `<a class="tool">` som de aktive.

Ikonet over Organisering er en genvej til Regnbueskemaet. Ikoner over områder uden aktive links er ikke links.

## Lav ikonerne om

```
pip install playwright && playwright install chromium
python3 tools/render/render_ikoner.py               # alle tre
python3 tools/render/render_ikoner.py video         # ét ikon
```

Modellerne står i `tools/render/ikoner.js`. Alle tre bruger samme kamera, lys og farvepalet, så de passer sammen.

## Tidligere versioner

Det tidligere campuskort (mini next) ligger i git under tagget `campus-v4`. Ældre versioner hedder `v1`–`v4`. Brug fx `git checkout campus-v4` for at se kortet.
