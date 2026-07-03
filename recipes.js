// ♡ ─────────────────────────────────────────────────── ♡
//   Shannon & Juju's Ninja Creami Recipe Book
//
//   To add a recipe forever: copy the template below,
//   fill it in, and paste it into the RECIPES list!
//   (Or just use the "+ add a recipe" button in the app
//    for quick ones — those save to your browser.)
//
//   TEMPLATE:
//   {
//     title: "Recipe Name",
//     emoji: "🍓",
//     author: "shannon",        // whoever's recipe it is
//     mode: "Lite Ice Cream",   // Creami spin mode
//     ingredients: [
//       "1 cup something yummy",
//     ],
//     steps: [
//       "Mix it all up!",
//       "Freeze 24 hours.",
//       "Spin & enjoy ♡",
//     ],
//     notes: "grandma's secret tips go here",
//   },
// ♡ ─────────────────────────────────────────────────── ♡

// ♡ faces for the book! drop pics into the images/ folder
//   and point to them here — chips & polaroids use these.
//   (add anyone: "mimi": "images/mimi.jpg")
const AVATARS = {
  shannon: "images/shannon.jpg",
  juju: "images/juju.jpg",
};

const RECIPES = [
  {
    title: "Strawberry Cheesecake",
    emoji: "🍓",
    author: "shannon",
    mode: "Lite Ice Cream",
    ingredients: [
      "1 cup fairlife 2% milk",
      "2 tbsp cheesecake pudding mix",
      "3 big strawberries, smushed",
      "2 tbsp cottage cheese (trust!)",
      "1 tbsp honey",
      "splash of vanilla",
    ],
    steps: [
      "Blend everything until silky smooth.",
      "Pour into the pint — don't pass the max fill line!",
      "Freeze 24 hours on a flat freezer shelf.",
      "Spin on Lite Ice Cream.",
      "If it's crumbly, add a splash of milk & re-spin ♡",
    ],
    notes: "top with crushed graham crackers like grandma would",
  },
  {
    title: "Matcha Cloud",
    emoji: "🍵",
    author: "shannon",
    mode: "Lite Ice Cream",
    ingredients: [
      "1 cup oat milk",
      "1.5 tsp good matcha, sifted",
      "2 tbsp vanilla protein powder",
      "1 tbsp condensed milk",
      "tiny pinch of salt",
    ],
    steps: [
      "Whisk matcha with a splash of warm milk first (no clumps!).",
      "Stir in everything else.",
      "Freeze 24 hours.",
      "Spin, then re-spin with a splash of milk for extra cloud ♡",
    ],
    notes: "tastes like a matcha latte from a tiny kyoto café",
  },
  {
    title: "Cookies & Dream",
    emoji: "🍪",
    author: "shannon",
    mode: "Lite Ice Cream",
    ingredients: [
      "1 cup fairlife chocolate milk",
      "1 scoop vanilla protein powder",
      "1 tbsp instant pudding mix (vanilla)",
      "3 oreos for mix-in, crushed",
    ],
    steps: [
      "Shake or blend the base (not the oreos!).",
      "Freeze 24 hours.",
      "Spin on Lite Ice Cream.",
      "Dig a little hole, drop in the oreos, run Mix-In ♡",
    ],
    notes: "we fight over who gets the bigger scoop of this one",
  },
];
