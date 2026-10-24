# Digital praksis

Praktisk vejledning til undervisere, der vil bruge digitale teknologier i deres egen undervisning. Forsiden har tre områder med hver sit bløde 3D-ikon. Hvert punkt åbner en vejledningsside, og de færdige apps bruges som eksempler.

Siden er ren HTML og CSS med lidt JavaScript og kører direkte på GitHub Pages: https://seedorffs.github.io/digital-praksis/

## Filer

| Fil | Indhold |
|---|---|
| `index.html` | Forsiden: områder og links til vejledningerne |
| `vejledning/<navn>/index.html` | Én mappe pr. vejledning. Adressen bliver `…/vejledning/<navn>/` |
| `vejledning/_skabelon/index.html` | **Skabelon til nye vejledninger** med alle seks afsnit og forklaring |
| `css/style.css` | Udseendet på forside og vejledninger |
| `js/forside.js` | Kort trykreaktion på berøringsskærme |
| `js/vejledning.js` | Knappen "Kopiér startprompt" |
| `assets/ikoner/` | De tre ikoner. `<navn>.webp` er objektet, og `<navn>-skygge.webp` er kontaktskyggen |
| `tools/render/` | 3D-modellerne og værktøjet, der laver ikonerne |

## Status på vejledningerne

| Side | Status |
|---|---|
| Byg din egen webapp med AI | Færdig |
| Planlæg et undervisningsforløb (Regnbueskema GF2) | Eksemplet er beskrevet; trinvis vejledning mangler |
| Følg elevernes progression (Holdtjek GF2 Tømrer) | Eksemplet er beskrevet; trinvis vejledning mangler |
| Reflektér over lærepladsvalg (VirksomhedsMatch) | Eksemplet er beskrevet; trinvis vejledning mangler |
| Styr tiden ved elevoplæg (Taletimer GF2 Tømrer) | Eksemplet er beskrevet; trinvis vejledning mangler |
| AI i undervisningen | På vej |
| Brug grafisk facilitering | På vej |
| Lav en undervisningsvideo | På vej |
| Lav en faglig podcast | På vej |

## Lav en ny vejledning

1. Kopiér mappen `vejledning/_skabelon` til `vejledning/<kort-navn>`. Brug små bogstaver og bindestreger, og skriv æ, ø og å som ae, oe og aa.
2. Udfyld de afsnit, der er relevante, og slet resten. Kommentaren øverst i filen forklarer hvert felt.
3. Tilføj et punkt på forsiden i det rigtige område.

## Gør en "på vej"-side færdig

Åbn siden, og erstat afsnittet "Denne vejledning er på vej" med de relevante afsnit fra skabelonen. Fjern linjen `<p class="status">`. På forsiden fjerner du `tool--soon` og `<span class="soon">På vej</span>` fra punktet.

## Lav ikonerne om

```
pip install playwright && playwright install chromium
python3 tools/render/render_ikoner.py               # alle tre
python3 tools/render/render_ikoner.py video         # ét ikon
```

Modellerne står i `tools/render/ikoner.js`. Alle tre bruger samme kamera, lys og farvepalet, så de passer sammen.

## Tidligere versioner

Den første forside uden vejledninger er gemt i git under tagget `forside-v1`. Det tidligere campuskort ligger i det lokale mini-next-projekt (zip-filen i Dokumenter › Digital praksis).
