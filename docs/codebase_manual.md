# AutoServis — Codebase Manual

## Overview
Personal car maintenance tracker PWA. Vanilla HTML/CSS/JS, no build tools, no npm. Offline-first, installable on iPhone via Add to Home Screen. Croatian primary, English secondary.

## Stack
- **No frameworks, no build step.** Files served statically (CloudFlare Pages target).
- **Storage:** structured data in `localStorage` (key `autoservis_data`); document photos in IndexedDB (DB `autoservis_photos`, store `photos`, key = photoId, value = compressed JPEG dataURL ≤900px, quality 0.8).
- **Fonts:** Manrope (latin + latin-ext woff2, weights 400–800).

## File map
| File | Purpose |
|---|---|
| `index.html` | App shell — all views as `<section class="view">`, bottom tab bar, overlay panels, global widgets. All element IDs are the DOM contract (see below). |
| `app.js` | ALL logic, single file, labeled sections: CONFIG, I18N, STATE, UTILS, STORAGE, PHOTOS, TOAST, CONFIRM DIALOG, UPDATE BANNER, VERSION CHECK, ROUTER, OVERLAYS, REMINDERS & COUNTDOWN, FUEL CONSUMPTION, COSTS, VIEW:* (home/services/fuel/deadlines/more/vehicles/costs/documents/settings), I18N APPLY, EVENT WIRING, PWA, INIT. |
| `styles.css` | All styling. Design tokens in `:root` (warm off-white bg, burnt-orange accent `#D9480F`, Manrope). Class names match index.html + app.js exactly. |
| `fonts.css` | `@font-face` declarations for Manrope. |
| `manifest.json` | PWA manifest (standalone, theme `#D9480F`, bg `#F5F2ED`). |
| `service-worker.js` | Cache `autoservis-cache-v0.0.1`; precaches core files; network-first for navigation, cache-first for assets; deletes old caches on activate. |
| `version.json` | `{"version": "0.0.1"}` — compared against `APP_VERSION` in app.js on load; mismatch shows update banner. |
| `icons/` | icon-192.png, icon-512.png, apple-touch-icon.png (180px). Generated via PowerShell System.Drawing. |
| `fonts/` | Manrope-latin.woff2, Manrope-latin-ext.woff2 (copied from Wowter project). |

## DOM contract
Views: `view-home`, `view-services`, `view-fuel`, `view-deadlines`, `view-more`, `view-vehicles`, `view-costs`, `view-documents`, `view-settings`.
Tabs: `tab-home`, `tab-services`, `tab-fuel`, `tab-deadlines`, `tab-more`.
Overlays: `overlay-service` (sv-*), `overlay-fuel` (fl-*), `overlay-deadline` (dl-*), `overlay-vehicle` (vh-*), `overlay-document` (dc-*). Global: `toast`, `confirm-dialog`, `update-banner`, `photo-viewer`. Full ID list in `docs/plan.md` §4 — app.js depends on these EXACTLY.

## Data model
`localStorage['autoservis_data']`:
```js
{ version: 1, settings: { lang: 'hr' }, activeVehicleId: null,
  vehicles: [{ id, name, make, model, year, plate, vin, mileage, notes, createdAt }],
  services: [{ id, vehicleId, type, date, mileage, cost, notes, remindKm, remindMonths, createdAt }],
  deadlines: [{ id, vehicleId, type, label, expiryDate, cost, notes, createdAt }],
  fuel: [{ id, vehicleId, date, mileage, liters, pricePerLiter, full, createdAt }],
  documents: [{ id, vehicleId, name, type, number, expiryDate, notes, photoId, createdAt }] }
```
- `id` = `Date.now().toString(36) + Math.random().toString(36).slice(2,7)`.
- All lists filtered by `activeVehicleId` (except vehicles). No vehicles → empty-state with add-vehicle CTA.
- Deleting a vehicle cascades to its services/fuel/deadlines/documents + IndexedDB photos.

## Key behaviors
- **Reminders (§7):** km reminder → next due km = `mileage + remindKm`; months → next due date = `date + remindMonths`. Dashboard shows earliest upcoming (km vs date normalized: 1000 km ≈ 30 days). Services list shows "due" badge when overdue.
- **Deadline countdown (§7):** days = expiryDate − today; green >30, amber 7–30, red <7 or expired. Dashboard chips use same colors.
- **Fuel consumption (§8):** `liters / (mileage − prevFillupMileage) × 100`, only when `full` checked and prev exists. Prev = immediately previous fuel entry in chronological order. Avg = mean of valid entries, 1 decimal.
- **Costs:** total = all time; year/month = by date (deadline cost attributed to expiry year). SVG bar chart = monthly totals of current year. Breakdown = service types + fuel + deadlines.
- **Photos:** `compressImage()` (canvas, ≤900px, q0.8) → `state.pendingPhoto` → `putPhoto()` on save → `getPhoto()` for thumbs/viewer. `loadDocumentThumbs()` fills thumbnails async after render.
- **i18n:** `I18N = { hr, en }`, `t(key)` with `{var}` templates, `data-i18n` attributes applied on load + language change. HR primary, EN secondary.
- **Version system (§10):** `APP_VERSION = '0.0.1'`; on load fetch `version.json`; mismatch → `update-banner` with reload. Bump version → bump cache name → SW cache refresh.
- **iOS fix (§9):** `fixOverlayHeight()` sets explicit overlay height from `visualViewport.height` on open + resize. Safe areas via `--safe-top`/`--safe-bottom`.

## Class conventions
- State classes toggled by app.js: `.view--active`, `.tab--active`, `.overlay--open`, `.photo-viewer--open`, `.confirm-dialog--open`, `.toast--show`, `.update-banner--show`, `.body--overlay`, `.btn--active` (language toggle).
- Overlay internals: `.overlay__panel/__header/__title/__close/__body/__footer` (from index.html).
- Confirm dialog + update banner + photo viewer inner markup is generated by app.js (`.confirm-backdrop/panel/title/text/actions`, `.update-banner-text`, `#update-banner-reload`, `.photo-viewer-backdrop/body/img/close`).
- List items generated by app.js: `.sv-item*`, `.fl-item*`, `.dl-item*` (+ `--ok/--warn/--danger`), `.vh-item*` (+ `--active`), `.dc-item*`, `.chip` (+ `--active`, `--ok/--warn/--danger`), `.vc-*`, `.ns-*`, `.empty`, `.empty-inline`, `.empty-state`, `.bd-row/label/value`, `.chart-bar` (+ `--empty`), `.dc-preview` (+ `--empty`), `.item-actions`, `.badge` (+ `--due`, `--ok`).

## Design rules
- Light theme only. Tokens in `:root` (§2 of plan.md). Type scale 11/13/16/18/22/28, body 16px.
- Radius: inputs/buttons 6px, cards 10px, overlays 16px top corners. NO pill buttons, NO gradients, NO glassmorphism, NO purple.
- Touch targets ≥44px. Shell max-width 480px, centered; designed at 390px.

## Verification
- `python -m http.server 8123` in project root, then Playwright at 390×844 (iPhone 13 Pro). Full flow: add vehicle → set active → add service (reminder) → add fuel ×2 (full) → add deadline → add document with photo → dashboard checks → EN switch → costs chart → SW + manifest → reload persistence. Zero console errors required.
- Note: browser/SW caches can serve stale assets during development — clear caches/unregister SW or bump `?v=` when iterating.