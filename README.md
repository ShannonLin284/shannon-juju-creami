# shannon-juju-creami 🍨💗

Shannon and Juju's knowledge about the beautiful magnificent ninja creami —
now a flippable, grandma-cute recipe book that everyone can add to!

**📖 read the book:** https://shannonlin284.github.io/shannon-juju-creami/

## how it works

- everyone sees the same book
- anyone can stitch in a recipe with the `＋ add a recipe ♡` button
- you can **edit or unstitch only the pages you added** (the buttons simply
  don't appear on other people's pages, and the database rules enforce it too)
- the badge at the top shows the mode:
  - **☁️ shared book** — the cloud backend is connected, pages sync for everyone
  - **🧺 scrapbook mode** — no backend yet, pages save per-browser
    (to connect the cloud, follow [FIREBASE-SETUP.md](FIREBASE-SETUP.md) — 5 min, free)

## run it locally

Open `index.html` in a browser, or:

```
npx http-server -p 4321
```

then visit http://localhost:4321

## how to flip

- click a page to turn it (right side = forward, left side = back)
- or use the `‹ back` / `next ›` buttons
- or arrow keys ← →

## how to add a recipe ♡

**the normal way:** click the `＋ add a recipe ♡` button in the corner, sign
it with your name, done. Your browser remembers it's yours so you can
re-stitch (edit) or unstitch it later.

**the founding-recipes way:** the original recipes live in
[recipes.js](recipes.js) — copy the template at the top of the file and paste
a new entry into the `RECIPES` list (that's a code change, so it goes through
git).

```js
{
  title: "Recipe Name",
  emoji: "🍓",
  author: "shannon",        // "shannon", "juju", or "both"
  mode: "Lite Ice Cream",   // creami spin mode
  ingredients: ["1 cup something yummy"],
  steps: ["Mix it up!", "Freeze 24 hours.", "Spin ♡"],
  notes: "grandma's secret tips go here",
},
```

new pages appear in the book automatically. ♡
