# AutoServis — Changes

## v2.2.0 (2026-10-14) — Costs tab, big countdowns, notes
- **New "Troškovi" tab** (5th tab, between Servisi and Postavke; `tab-costs` / `view-costs`). All costs **derived** from existing entries — fuel (`liters × pricePerLiter`) + services (`cost`) — no new storage, per active vehicle. Summary cards: Ovaj mjesec, Prošli mjesec, Prosječno mjesečno (grand total ÷ distinct cost-bearing months; zero-sum months filtered out), Ova godina. Category breakdown: Gorivo / Servisi all-time totals. Monthly table newest first with localized month labels ("Listopad 2026" / "October 2026"). Vehicle without entries → "Nema podataka o troškovima", table hidden.
- **Dashboard big countdowns** (`#home-countdowns`, side-by-side `countdown-grid`): order is now chips → vehicle card → TWO big countdown cards → tech/ins chips → last fuel → quick-add → notes. Card 1 "Sljedeći servis": earliest upcoming type + big number (km- or days-driver by `nextServiceFor` score; "Prekoračeno" text when overdue), status-colored left border + number (ok/soon/overdue). Card 2 "Registracija": big days number + "dana", color rule green >30 / amber 7–30 / red <7 / "isteklo" / "—" when unset; tap opens vehicle edit (replaces the old reg chip). Numbers 32px bold (`.cd-num`).
- **Notes** (per-vehicle scratchpad, bottom of dashboard): `notes: [{id, vehicleId, text, createdAt}]` added to `defaultData` + `normalizeV2` (v2 model unchanged — version stays 2). Section header "Bilješke" + "+" toggles inline input (`notes-add-btn`/`notes-input`/`notes-save`). List newest-first by createdAt, date `fmtDate` + text, tap → confirm delete. Switching active vehicle switches the list; `deleteVehicle` also purges its notes. `applyI18n` now supports `data-i18n-placeholder`.
- Deadline chips row reduced to 2 (Tehnički / Osiguranje) — reg has its own big card; `deadline-row` grid 3→2 cols.
- i18n hr/en: `tabCosts, thisMonth, lastMonth, monthlyAverage, thisYear, fuelTotal, servicesTotal, noCostsData, month, unitDays, notesHeader, addNote, notePlaceholder, noNotes, deleteNote`.
- Version 2.2.0 everywhere: `APP_VERSION`, `version.json`, `?v=2.2.0` asset params, SW cache `autoservis-cache-v2.2.0`, UI version label.
- Verified locally: Playwright 390×844 — 51/51 checks, zero console errors. See `docs/temp/build-report.md`.

## v2.1.0 (2026-10-14) — Deadlines, update check, backdated fuel
- **Vehicle deadline dates:** vehicle model gains optional `regExpiry`/`techExpiry`/`insExpiry` (ISO date or null). Vehicle edit overlay gets 3 date inputs (`vh-reg`, `vh-tech`, `vh-ins`; labels "Registracija do / Tehnički pregled do / Osiguranje do", all optional). Migration on load (`normalizeV2` + `migrateToV2` via `normDateStr`) adds the three fields as `null` to existing vehicles.
- **Dashboard countdown chips** (`#home-deadlines`, under the vehicle card): 3 chips for the active vehicle — label + "X dana". Green >30 d, amber 7–30 d (inclusive), red <7 d or expired ("isteklo"), gray "—" when not set. Tap chip → opens vehicle edit form. `dl-chip` styles (light+dark), `deadline-row` 3-col grid.
- **Manual update check** (Postavke): `btn-check-update` → fetches `version.json?cb=<ts>` (`cache:'no-store'`; cache-buster bypasses the SW cache-first strategy). Newer (≠ APP_VERSION) → toast "Dostupna nova verzija vX.Y.Z — Osvježi" + shows the existing update banner (reload action); same → toast "Ažurni ste (vX.Y.Z)".
- **Backdate fuel entries:** `fl-date` is a plain `<input type="date">` (defaults today, no `min`, no past-date validation) with hint "Datum može biti u prošlosti" (`.field__hint`). `computeConsumptions` rewritten: previous fill-up = **highest km still below the current entry's km** among full-tank entries (createdAt tiebreak) — not entry order / date order — so backdated entries compute correctly.
- i18n hr/en: `reg, tech, insurance, regExpiry, techExpiry, insExpiry, daysLeft, expired, notSet, dateHint, checkForUpdate, updateAvailable, upToDate, refresh`.
- Version 2.1.0 everywhere: `APP_VERSION`, `version.json`, `?v=2.1.0` asset params, SW cache `autoservis-cache-v2.1.0`, UI version label.
- Verified locally: Playwright 390×844 — 31/31 checks, zero console errors. See `docs/temp/build-report.md`.

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