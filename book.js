/* ♡ the flip-book engine — now with a shared cloud pantry ♡
 *
 * Two modes:
 *  ☁️ cloud mode     — firebase-config.js is filled in; everyone shares one
 *                      book. You sign in anonymously (no account needed) and
 *                      can edit/unstitch only the pages YOU added.
 *  🧺 scrapbook mode — no config yet; pages save to this browser only.
 */

const book = document.getElementById("book");
const bookWrap = document.getElementById("bookWrap");
const pageDots = document.getElementById("pageDots");
const cloudBadge = document.getElementById("cloudBadge");
const LS_KEY = "creami-book-recipes";
const NAME_KEY = "creami-book-name";

/* ── identity & storage backends ── */

let cloud = null;   // { db, uid, fns } when firebase is connected
let dynamicRecipes = []; // recipes added by people (cloud docs or local)

function localRecipes() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function refreshLocal() {
  dynamicRecipes = localRecipes().map((r, i) => ({ ...r, id: `local-${i}`, mine: true }));
  buildBook();
}

async function connectCloud() {
  if (!window.FIREBASE_CONFIG) return false;
  try {
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
    ]);
    const app = initializeApp(window.FIREBASE_CONFIG);
    const auth = authMod.getAuth(app);
    const cred = await authMod.signInAnonymously(auth);
    const db = fsMod.getFirestore(app);
    cloud = { db, uid: cred.user.uid, fns: fsMod };

    const q = fsMod.query(
      fsMod.collection(db, "recipes"),
      fsMod.orderBy("createdAt", "asc")
    );
    fsMod.onSnapshot(q, (snap) => {
      dynamicRecipes = snap.docs.map((d) => ({
        ...d.data(),
        id: d.id,
        mine: d.data().ownerId === cloud.uid,
      }));
      buildBook();
    }, (err) => {
      console.warn("cloud pantry unreachable, falling back:", err);
      cloud = null;
      setBadge(false);
      refreshLocal();
    });

    setBadge(true);
    return true;
  } catch (err) {
    console.warn("couldn't connect to the cloud pantry:", err);
    cloud = null;
    return false;
  }
}

function setBadge(isCloud) {
  cloudBadge.textContent = isCloud
    ? "☁️ shared book — everyone sees your pages ♡"
    : "🧺 scrapbook mode — pages save on this device only";
  cloudBadge.classList.toggle("cloud", isCloud);
}

async function saveRecipe(recipe, editId) {
  if (cloud) {
    const { db, uid, fns } = cloud;
    if (editId) {
      await fns.updateDoc(fns.doc(db, "recipes", editId), recipe);
    } else {
      await fns.addDoc(fns.collection(db, "recipes"), {
        ...recipe,
        ownerId: uid,
        createdAt: fns.serverTimestamp(),
      });
    }
    // onSnapshot rebuilds the book for us
  } else {
    const local = localRecipes();
    if (editId) local[Number(editId.replace("local-", ""))] = recipe;
    else local.push(recipe);
    localStorage.setItem(LS_KEY, JSON.stringify(local));
    refreshLocal();
  }
}

async function deleteRecipe(id) {
  if (cloud) {
    await cloud.fns.deleteDoc(cloud.fns.doc(cloud.db, "recipes", id));
  } else {
    const local = localRecipes();
    local.splice(Number(id.replace("local-", "")), 1);
    localStorage.setItem(LS_KEY, JSON.stringify(local));
    refreshLocal();
  }
}

/* ── page HTML builders ── */

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function chipFor(name) {
  const n = String(name || "").trim().toLowerCase();
  const style = n === "shannon" ? ["shannon", "🎀"]
    : n === "juju" ? ["juju", "🧸"]
    : ["guest", "🍒"];
  return `<span class="chip ${style[0]}">${esc(name || "someone sweet")} ${style[1]}</span>`;
}

function coverHTML() {
  return `
    <div class="cover">
      <div class="bubble"><span class="heart">💗</span></div>
      <h1>Shannon &amp; Juju's<br/>Creami Book</h1>
      <p class="subtitle">~ spun with love since 2026 ~</p>
      <div class="cactus">📚 🌵 🍨</div>
      <div class="hint">click me to open ♡</div>
    </div>`;
}

function dedicationHTML() {
  return `
    <div class="dedication">
      <div class="doily">🍨</div>
      <p>for cozy nights,<br/>
      24-hour freezes,<br/>
      &amp; the ones we re-spin for ♡</p>
    </div>`;
}

function backCoverHTML() {
  return `
    <div class="backcover">
      <span>🌵💗📚</span>
      the end...<br/>until the next spin ♡
    </div>`;
}

function recipeHTML(r) {
  const ings = (r.ingredients || []).map(i => `<li>${esc(i)}</li>`).join("");
  const steps = (r.steps || []).map(s => `<li>${esc(s)}</li>`).join("");
  const actions = r.mine
    ? `<div class="page-actions">
         <button class="forget-btn" data-edit="${esc(r.id)}">re-stitch (edit)</button>
         <button class="forget-btn" data-forget="${esc(r.id)}">unstitch this page</button>
       </div>`
    : "";
  return `
    <div class="page-inner">
      <span class="recipe-emoji">${esc(r.emoji || "🍨")}</span>
      <h2 class="recipe-title">${esc(r.title)}</h2>
      <p class="byline">
        ${chipFor(r.author)}
        ${r.mode ? `<span class="chip mode">❄ ${esc(r.mode)}</span>` : ""}
      </p>
      <div class="divider">· ♡ · ♡ · ♡ ·</div>
      <div class="section-label">what you'll need</div>
      <ul class="ing-list">${ings}</ul>
      <div class="section-label">how grandma does it</div>
      <ol class="step-list">${steps}</ol>
      ${r.notes ? `<div class="note">${esc(r.notes)}</div>` : ""}
      ${actions}
    </div>`;
}

/* ── build the sheets ── */

let currentSheet = 0; // number of sheets currently flipped
let sheets = [];

function allRecipes() {
  return [...RECIPES.map(r => ({ ...r, builtin: true })), ...dynamicRecipes];
}

function buildBook() {
  const recipes = allRecipes();

  // page sequence: cover | dedication, recipes..., (filler), back cover
  const pages = [coverHTML(), dedicationHTML()];
  recipes.forEach((r) => pages.push(recipeHTML(r)));
  if (pages.length % 2 === 0) {
    pages.push(`<div class="dedication"><p>~ this page is saving room<br/>for your next masterpiece ♡ ~</p></div>`);
  }
  pages.push(backCoverHTML());

  book.innerHTML = "";
  sheets = [];
  const nSheets = pages.length / 2;

  for (let i = 0; i < nSheets; i++) {
    const sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.innerHTML = `
      <div class="face front">${pages[i * 2]}<span class="page-num">${i === 0 ? "" : i * 2}</span></div>
      <div class="face back">${pages[i * 2 + 1]}<span class="page-num">${i * 2 + 1 === pages.length - 1 ? "" : i * 2 + 1}</span></div>`;
    sheet.addEventListener("click", (e) => {
      if (e.target.closest("[data-forget],[data-edit]")) return;
      sheet.classList.contains("flipped") ? goTo(i) : goTo(i + 1);
    });
    book.appendChild(sheet);
    sheets.push(sheet);
  }

  // dots
  pageDots.innerHTML = Array.from({ length: nSheets + 1 }, () => "<i></i>").join("");

  currentSheet = Math.min(currentSheet, nSheets);
  goTo(currentSheet, true);

  // wire up "unstitch" + "re-stitch" buttons (only present on your own pages)
  book.querySelectorAll("[data-forget]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!confirm("unstitch this recipe from the book?")) return;
      deleteRecipe(btn.dataset.forget);
    });
  });
  book.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(dynamicRecipes.find(r => r.id === btn.dataset.edit));
    });
  });
}

function goTo(n, instant = false) {
  currentSheet = Math.max(0, Math.min(n, sheets.length));

  sheets.forEach((sheet, i) => {
    const flipped = i < currentSheet;
    sheet.classList.toggle("flipped", flipped);
    // flipped sheets stack left (later = on top), unflipped stack right (earlier = on top)
    sheet.style.zIndex = flipped ? i + 1 : sheets.length - i;
  });

  // slide the book so a closed cover / back sit centered
  const shift = currentSheet === 0 ? -25 : currentSheet === sheets.length ? 25 : 0;
  bookWrap.style.transform = `${bookWrap.dataset.scale || ""} translateX(${shift}%)`.trim();
  book.classList.toggle("closed-front", currentSheet === 0);
  book.classList.toggle("closed-back", currentSheet === sheets.length);

  [...pageDots.children].forEach((d, i) => d.classList.toggle("on", i === currentSheet));
}

/* keep the turning sheet above its neighbors mid-flip */
book.addEventListener("transitionstart", (e) => {
  if (e.target.classList?.contains("sheet")) e.target.style.zIndex = 999;
});
book.addEventListener("transitionend", (e) => {
  if (e.target.classList?.contains("sheet")) goTo(currentSheet, true);
});

/* ── nav ── */

document.getElementById("prevBtn").addEventListener("click", () => goTo(currentSheet - 1));
document.getElementById("nextBtn").addEventListener("click", () => goTo(currentSheet + 1));
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goTo(currentSheet + 1);
  if (e.key === "ArrowLeft") goTo(currentSheet - 1);
});

/* ── responsive scale ── */

function fitBook() {
  const scale = Math.min(1, (window.innerWidth - 30) / 900);
  bookWrap.dataset.scale = scale < 1 ? `scale(${scale})` : "";
  goTo(currentSheet, true);
}
window.addEventListener("resize", fitBook);

/* ── add / edit modal ── */

const veil = document.getElementById("modalVeil");
const form = document.getElementById("recipeForm");
const modalTitle = document.getElementById("modalTitle");

function openModal(recipe) {
  form.reset();
  form.editId.value = recipe ? recipe.id : "";
  modalTitle.textContent = recipe ? "re-stitching your recipe ♡" : "a new recipe for the book ♡";
  form.author.value = (recipe && recipe.author) || localStorage.getItem(NAME_KEY) || "";
  if (recipe) {
    form.title.value = recipe.title || "";
    form.emoji.value = recipe.emoji || "";
    form.mode.value = recipe.mode || "";
    form.ingredients.value = (recipe.ingredients || []).join("\n");
    form.steps.value = (recipe.steps || []).join("\n");
    form.notes.value = recipe.notes || "";
  }
  veil.hidden = false;
  form.title.focus();
}

document.getElementById("addBtn").addEventListener("click", () => openModal(null));
document.getElementById("cancelBtn").addEventListener("click", () => (veil.hidden = true));
veil.addEventListener("click", (e) => { if (e.target === veil) veil.hidden = true; });

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(form);
  const lines = (name) => String(f.get(name) || "").split("\n").map(s => s.trim()).filter(Boolean);
  const recipe = {
    title: String(f.get("title")).trim(),
    emoji: String(f.get("emoji")).trim() || "🍨",
    author: String(f.get("author")).trim(),
    mode: String(f.get("mode")).trim(),
    ingredients: lines("ingredients"),
    steps: lines("steps"),
    notes: String(f.get("notes")).trim(),
  };
  localStorage.setItem(NAME_KEY, recipe.author);
  const editId = String(f.get("editId") || "");
  veil.hidden = true;
  try {
    await saveRecipe(recipe, editId || null);
    if (!editId) goTo(sheets.length - 1); // flip toward the new page
  } catch (err) {
    console.error(err);
    alert("oh no, the page wouldn't stitch in — check your connection and try again ♡");
  }
});

/* ── go! ── */

fitBook();
buildBook(); // show built-in pages right away
connectCloud().then((ok) => {
  setBadge(!!ok);
  if (!ok) refreshLocal();
});
