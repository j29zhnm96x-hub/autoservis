# AutoServis — Changes

## v2.0.0 "SIMPLE" (2026-10-14) — Full rewrite
- **Rebuilt from scratch** per `docs/plan.md` v2.0.0: dead-simple tracker — fuel log + service log + auto-reminders. Nothing else.
- 4 tabs replace the 5-tab More-menu pattern: Početna, Gorivo, Servisi, Postavke.
- **Data model v2** (`autoservis_data`, `version: 2`): vehicles (no vin/notes), fuel (`km`, not `mileage`), services (`type|date|km|work|parts|notes|cost`). `log`/`deadlines`/`documents`/old `services` dropped.
- **One-time migration** from v0.0.x/v0.1.2: transfers vehicles + fuel (renames `mileage`→`km`), drops log/deadlines/documents, one-time toast "Svjež početak za servisni dnevnik".
- **Service cycle auto-reminders (CORE):** oil 8000 km/6 mo, air-filter 16000/12, fuel-filter 24000/24, timing-belt 60000/60, other = none. Next-due per type from the LAST service of that type (`km + cycle`, `date + months`); overdue if mileage ≥ nextKm OR today ≥ nextDate; soon if <1000 km or <30 days. Dashboard shows earliest upcoming ("za X km ili X dana" + status color).
- Fuel consumption = liters/(km−prevKm)×100, full-tank → full-tank only; avg-consumption stat; live total in the fuel overlay.
- Logging fuel/service with km above vehicle mileage auto-bumps the odometer.
- i18n HR/EN complete (`t()` + `data-i18n`), HR default; consumption always 1 decimal; due-line km/days use plain integers ("za 8000 km").
- Design: reused v0.1.2 warm palette + `[data-theme="dark"]` overrides, tokens, radius hierarchy, Manrope; stripped dead CSS (log timeline, filter chips, documents, photo viewer, costs chart, deadlines, menu).
- PWA: viewport-fit=cover + user-scalable=no, apple-mobile-web-app-capable, dynamic theme-color (#F5F2ED/#1A1815), SW cache `autoservis-cache-v2.0.0`, iOS visualViewport overlay fix, safe areas.
- Version 2.0.0 everywhere: APP_VERSION, version.json, `?v=2.0.0` params, SW cache, UI labels.
- KEPT untouched: `icons/`, `fonts/`, `.gitignore`.
- Verified locally: Playwright 390×844 (system Chrome) — 9/9 scenarios pass, zero console errors. See `docs/temp/build-report.md`.

## v0.1.0 (2026-09-11) — Dnevnik log system
- **Dnevnik replaces Servisi** (plan §15): tab `tab-log`, view `view-log`, overlay `overlay-log` with `lg-*` fields (type/date/km/description/cost/remindKm/remindMonths).
- Data model: `services` → `log` with one-time migration on load (service → log entry `{type:'service', km:mileage, description:notes}`, `services` key deleted, migration persisted).
- Log types: `service` / `repair` / `wash` / `inspection` / `other` (replaces oil/brakes/tires/battery/inspection/other).
- Timeline view: chronological (newest first) merge of log + fuel entries; fuel shown read-only with "Gorivo" badge; per-type colored badges + left borders; "due" badge when reminder overdue.
- Filter chips: Svi / Servis / Popravak / Pranje / Pregled / Ostalo / Gorivo (`state.logFilter`).
- Dashboard next-service card + last-service stat read from log entries; costs view reads from log.
- Version bump 0.1.0: `APP_VERSION`, `version.json`, `?v=` params, SW cache `autoservis-cache-v0.1.0`.
- i18n: `tabLog`, `addLog`, `logTypes.*`, `description`, `filterAll`, `due`, `logEmpty`, `newLog`, `editLog`, `confirmDeleteLog`, `noLog` (HR + EN); removed dead service keys.
- Verified locally: Playwright 390×844 — migration from old services data, add/edit/delete log entries, filter chips, dashboard next-service, zero console errors. See `docs/temp/build-report.md`.

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