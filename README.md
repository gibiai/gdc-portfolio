# Gabriele De Carlo — Data Analyst Portfolio

Cyberpunk-themed portfolio with animated 3D-feel data background, glitch effects, and full responsive layout.

## 📁 Folder structure

```
portfolio/
├── index.html
└── assets/
    ├── profile.jpg     ← la tua foto profilo
    ├── crime.png       ← preview progetto Italy Crime
    ├── ai.png          ← preview progetto AI Jobs
    └── churn.png       ← preview progetto Customer Churn
```

Crea la cartella `assets/` accanto a `index.html` e mettici dentro le 4 immagini con i nomi esatti qui sopra. Se un'immagine manca, parte un fallback colorato così il sito non si rompe mai.

## 🚀 Deploy su Vercel — 5 minuti

### Opzione A: con GitHub (consigliata, deploy automatico ad ogni modifica)

1. Vai su [github.com](https://github.com), crea un nuovo repository (es. `gdc-portfolio`)
2. Carica `index.html` e la cartella `assets/` (drag & drop dal browser funziona)
3. Vai su [vercel.com](https://vercel.com), accedi con GitHub
4. Click **"Add New… → Project"** → seleziona il repo
5. Lascia tutto di default → **Deploy**
6. ✅ In 30 secondi sei online su `gdc-portfolio.vercel.app`

Per usare un dominio custom (es. `gabrieledecarlo.com`): Settings → Domains → Add.

### Opzione B: drag & drop diretto (senza GitHub)

1. Comprimi la cartella in `portfolio.zip`
2. Vai su [vercel.com/new](https://vercel.com/new)
3. Trascina il `.zip` nella pagina
4. Deploy fatto

Lo svantaggio: ogni modifica richiede ri-upload manuale.

## 🎨 Personalizzare

Tutto è in un singolo `index.html`. Cose da modificare facilmente:

- **Skills**: array `skills` riga ~580, modifica nome / icona / livello / categoria
- **Progetti**: array `projects` riga ~610, link Notion/GitHub specifici
- **Certificazioni**: array `certs` riga ~605
- **Bio**: hero-bio nella sezione `#hero` e about-bio in `#about-sec`
- **Colori**: `:root` in cima al CSS — `--teal`, `--violet`, `--yellow`, `--blue`, `--red`

## 🔗 Link integrati

Già pre-configurati:
- LinkedIn → `linkedin.com/in/gabriele-de-carlo-8b601598`
- GitHub → `github.com/gibiai`
- Calendly → `calendly.com/gabrieledecarlo/30min`
- WhatsApp → entrambi i numeri (IT + PT)
- Resume → Google Drive
- Email → `gabrieledecarlo9@gmail.com`

I 3 progetti puntano tutti al Notion principale. Se vuoi link specifici per ogni progetto, sostituiscili nell'array `projects`.

## ⚡ Performance

- Tutto in un file, zero dipendenze esterne (solo Google Fonts)
- ~25KB di HTML+CSS+JS
- Animazioni canvas leggere, ottimizzate per 60fps
- Responsive desktop / tablet / mobile

## 🐛 Troubleshooting

**Le immagini non si vedono**: controlla i nomi esatti nella cartella `assets/` (case-sensitive). I fallback colorati partono in automatico se i file mancano.

**Il sito è bianco**: controlla la console (F12). Probabile errore JS — segnalami.

**Animazioni laggose su mobile**: normale su dispositivi vecchi, l'effetto resta godibile. Per disabilitarle del tutto, commenta la chiamata `loop()` in fondo allo script.

---

Built with curiosity, deployed on Vercel. 🚀
