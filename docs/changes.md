# AutoServis — Changes

## v0.0.1 (2026-09-10) — Initial build
- Created app shell: `index.html` (9 views, 5 tabs, 5 overlays, photo-viewer, toast, confirm-dialog, update-banner), `manifest.json`, `service-worker.js`, `version.json`, `.gitignore`.
- Created `app.js` — all logic: data model (localStorage `autoservis_data`), IndexedDB photo storage (`autoservis_photos`), router, all views, reminders/countdown, fuel consumption, costs chart, i18n HR/EN, PWA registration, version check.
- Created `styles.css` (design tokens per spec §2) + `fonts.css` (Manrope 400–800).
- Copied Manrope woff2 fonts from Wowter project.
- Generated icons (192/512/apple-touch 180) via PowerShell System.Drawing.
- Verified locally: Playwright 390×844, full flow test, zero console errors.

### Integration fixes during verification
- Rewrote `styles.css` class names to match real DOM (index.html BEM + app.js-generated classes).
- Aligned overlay/photo-viewer/confirm-dialog state classes (`--open`) between app.js and styles.css.
- `index.html`: `dc-photo-preview` `<img>` → `<div>`; removed duplicate `dc-photo-remove` button.
- `app.js`: wired `.overlay__close` (×) buttons; fixed photo persistence bug — `saveDocument()` now writes photo to IndexedDB via `putPhoto()`.
- `index.html`: added favicon link + `mobile-web-app-capable` meta.
- `styles.css`: `min-width: 0` on `.stat` and `.quick-actions .btn` to fix 390px grid overflow.