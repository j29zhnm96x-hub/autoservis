# AutoServis — Build Spec v2.0.0 "SIMPLE"

CONTRACT for the rewrite. Follow exactly. Project root:
`C:\Users\Korisnik\Documents\CodeProjects\Održavanje automobila`

**Goal:** Dead-simple tracker for 3 cars: fuel log + service log + auto-reminders. Nothing else.

## 1. Files
Replace (clean, focused, minimal): `index.html`, `app.js`, `styles.css`, `service-worker.js`,
`version.json`, `manifest.json`, `fonts.css`.
KEEP untouched: `icons/` (user's custom icon, 180/192/512), `fonts/` (Manrope woff2),
`.gitignore`, `docs/` (append `changes.md`, write `plan.md` + `temp/build-report.md`).
Do NOT commit or deploy.

## 2. Architecture
Vanilla JS SPA, no build step. Single `app.js`. localStorage key `autoservis_data`, schema `version: 2`.
4 tabs (no More-menu): **Početna** (`tab-home`), **Gorivo** (`tab-fuel`), **Servisi** (`tab-services`),
**Postavke** (`tab-settings`). Views: `view-home`, `view-fuel`, `view-services`, `view-settings`.
Overlays: `overlay-fuel`, `overlay-service`, `overlay-vehicle`. Globals: toast, confirm dialog, update banner.

## 3. Data model (localStorage, `version: 2`)
```
{ version: 2, settings: {lang:'hr', theme:'auto'}, activeVehicleId,
  vehicles: [{id, name, make, model, year, plate, mileage, createdAt}],
  fuel:     [{id, vehicleId, date, km, liters, pricePerLiter, full, createdAt}],
  services: [{id, vehicleId, type, date, km, work, parts, notes, cost, createdAt}] }
```
`id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7)`

### Migration (one-time, on load if stored version < 2 or old keys present)
- vehicles: transfer, DROP `vin`/`notes`
- fuel: rename `mileage` → `km`
- DROP `log`, `deadlines`, `documents`, old `services` (v0.0.x) entirely
- keep `settings.lang`/`theme` if valid
- show one-time toast "Svjež početak za servisni dnevnik" (i18n `migrationToast`)
- save with `version: 2`. Fresh install (no key) = no migration, no toast.

## 4. THE CORE — service cycle auto-reminders
```
oil:         { km: 8000,  months: 6 }
air-filter:  { km: 16000, months: 12 }
fuel-filter: { km: 24000, months: 24 }
timing-belt: { km: 60000, months: 60 }
other:       no auto-schedule (null)
```
- Next-due per type = LAST service of that type for that vehicle (latest by date, `createdAt` tiebreak).
- `nextKm = entry.km + cycle.km`; `nextDate = entry.date + cycle.months` (calendar-safe month add).
- Status: **overdue** if `vehicleMileage >= nextKm` OR `today >= nextDate`;
  **soon** if <1000 km or <30 days remaining; else ok.
- Dashboard shows the earliest upcoming across all types (urgency score
  `min(kmRemaining/1000, daysRemaining/30)`; overdue wins).
- Card: type label + "za X km ili X dana" (`forKm` + `or` + `forDays`); overdue → "Prekoračeno";
  status color via card class. Also show last service of that type (date).
- When logging service/fuel with `km > vehicle.mileage` → auto-update vehicle mileage, save.

## 5. view-home
Vehicle chips (tap = set active) → vehicle card (name / plate / km) → next-service card →
last-fuel card (date + consumption) → quick-add buttons: fuel + service.

## 6. view-fuel
Avg-consumption stat + "+" button + table: date, km, liters, total, consumption (per row).
Overlay (`fl-*`): `fl-date`, `fl-km` (auto-fill vehicle mileage), `fl-liters`, `fl-price`
(per liter, auto-calc live total `fl-total` display), `fl-full` checkbox, `fl-save`, `fl-cancel`, `fl-delete`.
- Total per row = liters × pricePerLiter.
- **Consumption** = `liters / (km − prevKm) × 100`, full-tank → full-tank ONLY
  (current AND previous entry both `full`, sorted by date+km, delta > 0). Else `—`.
- Avg consumption = mean of computed values.

## 7. view-services
"+" button + table: type badge, date, km, work done, cost. Overlay (`sv-*`): `sv-type`
(select: `oil|air-filter|fuel-filter|timing-belt|other`), `sv-date`, `sv-km` (auto-fill),
`sv-work` (textarea "što napravljeno"), `sv-parts` (input "zamijenjeni dijelovi"), `sv-notes`,
`sv-cost`, `sv-save`, `sv-cancel`, `sv-delete`.

## 8. view-settings
Vehicles CRUD list (tap row = edit overlay `vh-name`, `vh-make`, `vh-model`, `vh-year`,
`vh-plate`, `vh-mileage`; footer: `vh-set-active`, `vh-delete`, `vh-cancel`, `vh-save`) +
language (`set-lang-hr` / `set-lang-en`) + theme (`set-theme-auto` / `set-theme-light` /
`set-theme-dark`) + export / import (JSON file) / reset + version label (`v2.0.0`).
Deleting a vehicle deletes its fuel + services.

## 9. Design — REUSE v0.1.2 palette
Keep `:root` design tokens + `[data-theme="dark"]` warm-dark overrides, radius hierarchy
(6/10/16), Manrope, fixed header 52px + tab bar 58px, safe areas, 480px centered shell.
Strip dead CSS: log timeline, filter chips, documents, photo viewer, costs chart, deadlines, menu.
Strip: gradients/glass/purple/pill-buttons stay forbidden.

## 10. PWA
- viewport `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`
- `apple-mobile-web-app-capable`, status-bar-style default, `mobile-web-app-capable`
- dynamic `theme-color` meta: light `#F5F2ED` / dark `#1A1815` (updated on theme change + auto/matchMedia)
- SW cache name `autoservis-cache-v2.0.0`, precache with `?v=2.0.0` params; old caches deleted on activate
- iOS `visualViewport` overlay height fix; safe-area padding everywhere
- icons unchanged; pre-paint theme script in `<head>` (no flash)

## 11. Version = 2.0.0 EVERYWHERE
`APP_VERSION='2.0.0'`, `version.json`, `?v=2.0.0` asset params, SW cache name, UI version labels.

## 12. i18n
`I18N {hr,en}`, `t(key, vars)` helper, `data-i18n` attrs, HR default, `applyI18n()` on lang change
(includes dynamic selects/option labels). Required keys: `tabHome, tabFuel, tabServices, tabSettings,
addFuel, addService, addVehicle, serviceTypes.{oil:'Ulje i filter ulja', airFilter:'Filter zraka',
fuelFilter:'Filter goriva', timingBelt:'Razvodni remen', other:'Ostalo'}, nextService, noNextService,
forKm, forDays, or, overdue, soon, lastService, lastFuel, avgConsumption, …` — plus all form/CRUD/
toast/confirm keys used by the views above.

## 13. UX (saved preferences)
- `user-select: none` + `-webkit-user-select: none` + `-webkit-touch-callout: none` +
  `touch-action: manipulation` on ALL interactive elements (buttons, tabs, chips, table rows,
  checkboxes, overlay close, stats, banners).
- `body: touch-action: pan-x pan-y; -webkit-text-size-adjust: 100%; text-size-adjust: 100%`.
- 44px min touch targets. `prefers-reduced-motion` respected.

## 14. Verification (MANDATORY — python http.server :8123 + Playwright 390×844, system Chrome)
1. migration from v0.1.2 data works (vehicles+fuel survive; log/deadlines/documents dropped; toast shown)
2. add vehicle
3. log fuel ×2 (both full tank) → consumption computed on second
4. log oil service → dashboard shows "za 8000 km"
5. log air-filter service → next = 16000 km from that entry
6. HR/EN switch
7. dark mode renders all 4 views
8. reload persists
9. ZERO console errors
Write results to `docs/temp/build-report.md`.
