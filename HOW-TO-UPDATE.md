# Updating ngdaniel.com

Your whole site is built from small, readable text files. You never have to touch
the design code. Here is where everything lives and how to change it.

The two easiest ways to update:

1. **Just ask Claude** ("add this restaurant", "change my About text"). It edits the
   right file and publishes.
2. **Edit the file yourself** using the cheat-sheet below.

---

## See your changes locally first (optional)

Open a terminal in `C:\Users\dvnie\Projects\ngdaniel` and run:

```
npm run dev
```

Then open http://localhost:4321 in your browser. Edits show up instantly. Press
`Ctrl + C` in the terminal to stop it.

---

## Add a restaurant

Copy any file in `src/content/restaurants/` to a new file (e.g. `cosme.md`) and edit:

```
---
name: "Cosme"
stars: 1          # 0, 1, 2, or 3 Michelin stars
city: "New York"
note: "the duck carnitas, every time"
order: 3          # controls position in the list (lower = higher up)
---
```

Same idea for:

- **Cars** → `src/content/cars/` (fields: `name`, `note`, `years`, `order`)
- **Tailors** → `src/content/tailors/` (fields: `name`, `location`, `instagram`, `order`)
- **Photo albums** → `src/content/albums/` (see below)

To remove something, delete its file. To reorder, change the `order` numbers.

---

## Edit your words (About, Timeline, links, etc.)

These live in `src/data/`:

- `site.json` — your name, About paragraphs, the "Building" text, contact line, and
  all your social links (X, LinkedIn, Instagram, Substack, Beli).
- `timeline.json` — the career story. Each `{ "era": "...", "text": "..." }` is one step.
- `interests.json` — the interest names, the short italic teaser (`dek`), and the blurb.

---

## Add real photos

1. Put image files in `public/photos/` (e.g. `public/photos/nyc-1.jpg`).
2. In the album's file under `src/content/albums/`, set a cover image:

```
---
title: "New York"
location: "2026"
cover: "/photos/nyc-1.jpg"
order: 1
images: []
---
```

(Full multi-photo galleries inside each album are a quick add-on when you have the
photos ready — just ask.)

---

## How changes go live

Once the site is deployed (next step after the domain is bought), saving a change and
pushing it to GitHub publishes it to ngdaniel.com automatically, usually within a
minute. Until then, changes are visible only on your computer via `npm run dev`.
