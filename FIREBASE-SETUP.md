# connecting the shared cloud book ☁️💗

Right now the site runs in **scrapbook mode** — recipes people add only save
in their own browser. Follow these 5 minutes of steps once, and everyone will
share ONE book: anyone can add pages, and each person can edit/unstitch only
their own.

## 1. create a (free) firebase project

1. Go to https://console.firebase.google.com and sign in with any Google account.
2. Click **Add project** → name it `shannon-juju-creami` → you can turn OFF
   Google Analytics → **Create project**.

## 2. turn on anonymous sign-in

1. In the left sidebar: **Build → Authentication** → **Get started**.
2. Under *Sign-in method*, choose **Anonymous** → toggle **Enable** → Save.

(This is how the book knows "this page is yours" without anyone making an
account — each browser quietly gets its own secret identity.)

## 3. create the database

1. Left sidebar: **Build → Firestore Database** → **Create database**.
2. Pick the default location → start in **production mode** → Create.

## 4. paste the security rules

In Firestore, open the **Rules** tab, replace everything with this, and
click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{id} {
      // anyone can read the book
      allow read: if true;

      // you can add a page, but it must be signed with YOUR id
      allow create: if request.auth != null
        && request.resource.data.ownerId == request.auth.uid;

      // you can only edit/unstitch pages you stitched in yourself,
      // and you can't hand them to someone else
      allow update: if request.auth != null
        && resource.data.ownerId == request.auth.uid
        && request.resource.data.ownerId == resource.data.ownerId;
      allow delete: if request.auth != null
        && resource.data.ownerId == request.auth.uid;
    }
  }
}
```

This is what actually enforces "you can only edit your own" — it's checked on
Google's servers, so it holds even if someone pokes at the site's code.

## 5. copy your config into the book

1. Click the ⚙️ gear (top-left) → **Project settings**.
2. Scroll to *Your apps* → click the **</>** (web) icon → nickname it
   `creami-book` → **Register app**.
3. Firebase shows a `firebaseConfig = { ... }` block. Copy just the `{ ... }`
   part into [firebase-config.js](firebase-config.js):

```js
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "shannon-juju-creami.firebaseapp.com",
  projectId: "shannon-juju-creami",
  // ...the rest of what firebase gave you
};
```

4. Commit & push — GitHub Pages redeploys, and the badge at the top of the
   site flips to **“☁️ shared book — everyone sees your pages ♡”**.

## little things to know

- **Identities are per-browser.** Your pages are tied to the browser you added
  them from (clearing site data = losing edit access to them, though the pages
  stay in the book).
- **It's fine that the config is public** — access control comes from the
  rules above, not from hiding keys.
- The 3 founding recipes live in [recipes.js](recipes.js) and are edited by
  changing the code (Shannon's domain 🎀).
