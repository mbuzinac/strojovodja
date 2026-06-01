# Strojovođa – Prometni i signalni propisi

Mobilno-optimizirana PWA aplikacija za učenje željezničkih prometnih i signalnih propisa (Nuxt 3 + Tailwind CSS).

## Pokretanje

```bash
npm install
npm run dev
```

Aplikacija je dostupna na `http://localhost:3000`.

## Regeneracija baze podataka

Izvorne datoteke moraju biti u `~/Downloads/`:

- `Prometi i signalni propisi skripta Strojovođe13253 (003) (2).docx`
- `Ispitna pitanja za periodicne ispite-v1C_240506_12_240524_074306 (2).pdf`

```bash
npm run generate-db
```

## Struktura

- `data/database.js` – 6 kategorija s lekcijama, signalima i kviz pitanjima
- `components/SignalVisual.vue` – vizualizacija signala
- `components/QuizModal.vue` – modalni kviz s zvučnim efektom
- `pages/index.vue` – dashboard kategorija
- `pages/category/[id].vue` – stranica kategorije

## PWA

Offline rad omogućen je putem `@vite-pwa/nuxt`. Build:

```bash
npm run build
npm run preview
```
