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
| Byg din egen app med AI (fælles vibecoding-vejledning) | Færdig: startprompt med felter, kopiknap, link til CIU's vibecoding-guide |
| Planlæg et undervisningsforløb (Regnbueskema GF2) | Færdig: kort intro, Prøv Regnbueskemaet, valg mellem at bruge og bygge selv |
| Følg elevernes progression (Holdtjek GF2 Tømrer) | Færdig efter samme princip |
| Reflektér over lærepladsvalg (VirksomhedsMatch) | Færdig efter samme princip |
| Styr tiden ved elevoplæg (Taletimer GF2 Tømrer) | Færdig efter samme princip |
| Lav en faglig podcast | Færdig: to episoder med afspiller (MP3 i `assets/podcast/`, ingen login) og vejledning i Gemini Notebook med fokus-prompt |
| AI i undervisningen | Færdig: vejledning + interaktivt modul om AI’s historie i `vejledning/ai-i-undervisningen/ai-historie/` (30 min + 15 min fordybelse, quiz, exitopgave, kildeliste med dato for faktatjek) |
| Brug grafisk facilitering, Lav en undervisningsvideo | På vej |

Knappen **Byg din egen app med AI** på appsiderne linker til `vejledning/byg-din-egen-webapp/?fra=<app>`. Så viser vibecoding-siden et kort eksempel fra den app, man kom fra. Eksemplerne står i `<script id="fra-data">` nederst i den side.

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
