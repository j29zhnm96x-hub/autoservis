# AutoServis — Build Spec v0.1.0

This is the CONTRACT for the build. Follow it exactly. All files go in project root:
`C:\Users\Korisnik\Documents\CodeProjects\Održavanje automobila`

## 1. Files to create
- `index.html` — app shell, all views as `<section class="view">`, bottom tab bar
- `app.js` — ALL logic (single file, organized in labeled sections)
- `styles.css` — all styling, design tokens in `:root`
- `fonts.css` — @font-face for Manrope (weights 400/500/600/700/800)
- `manifest.json` — PWA manifest
- `service-worker.js` — offline cache, versioned
- `version.json` — `{"version": "0.1.0"}`
- `icons/icon-192.png`, `icons/icon-512.png`, `icons/apple-touch-icon.png` (180px)
- `fonts/Manrope-latin.woff2`, `fonts/Manrope-latin-ext.woff2` — COPY from `C:\Users\Korisnik\Documents\CodeProjects\Wowter\fonts\`
- `.gitignore` — `.playwright-mcp/`, `.wrangler/`, `$out/`, `*.log`, `docs/temp/`
- `docs/changes.md`, `docs/decisions.md`, `docs/todo.md`, `docs/codebase_manual.md`

## 2. Design tokens (styles.css `:root`)
```css
:root {
  --bg: #F5F2ED;          /* warm off-white */
  --surface: #FFFFFF;
  --surface-2: #EDE8E0;
  --border: #E2DCD2;
  --text: #1F1D1A;
  --text-2: #6B655C;
  --text-3: #9A938A;
  --accent: #D9480F;      /* burnt orange — automotive */
  --accent-2: #F59F00;    /* amber */
  --ok: #2B8A3E;
  --warn: #E8590C;
  --danger: #C92A2A;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --shadow: 0 1px 3px rgba(31,29,26,.08);
  --font: 'Manrope', system-ui, -apple-system, sans-serif;
  --header-h: 52px; --tabbar-h: 58px;
  --safe-top: env(safe-area-inset-top); --safe-bottom: env(safe-area-inset-bottom);
}
```
Type scale: 11 / 13 / 16 / 18 / 22 / 28. Body 16px. Weights 400/500/600/700/800.
Radius hierarchy: inputs/buttons small 6px, cards 10px, overlays 16px top corners. NO pill buttons (max radius 10px on buttons). NO gradients, NO glassmorphism, NO purple. Light theme only.

## 3. Layout
- Fixed header (52px + safe-top), scrollable main, fixed bottom tab bar (58px + safe-bottom).
- 5 tabs: **Početna** (home), **Dnevnik** (log), **Gorivo** (fuel), **Rokovi** (deadlines), **Više** (more).
- More view = menu list: Vozila, Troškovi, Dokumenti, Postavke.
- Overlays: full-screen slide-up panels for add/edit forms + detail views. iOS fix: set explicit height via `visualViewport` (see section 9).
- Router: `showView(id)` toggles `.view--active`, updates tab active state, re-renders view content.

## 4. DOM contract (IDs — app.js depends on these EXACTLY)
Views: `view-home`, `view-log`, `view-fuel`, `view-deadlines`, `view-more`, `view-vehicles`, `view-costs`, `view-documents`, `view-settings`
Tabs: `tab-home`, `tab-log`, `tab-fuel`, `tab-deadlines`, `tab-more`

**view-home**: `home-vehicle-row` (vehicle chips), `home-vehicle-card` (name/plate/mileage), `home-next-service` (title/detail/days), `home-deadlines` (chip container), `home-stat-last-service`, `home-stat-consumption`, `home-stat-cost`, `btn-quick-service`, `btn-quick-fuel`

**view-log** (Dnevnik): `btn-add-log`, `log-filter` (type filter chips), `log-list` (timeline); overlay `overlay-log`: `lg-type`, `lg-date`, `lg-km`, `lg-description`, `lg-cost`, `lg-remind-km`, `lg-remind-months`, `lg-save`, `lg-cancel`, `lg-delete`, `overlay-log-title`

**view-fuel**: `btn-add-fuel`, `fuel-stat-avg`, `fuel-stat-total`, `fuel-stat-liters`, `fuel-list`; overlay `overlay-fuel`: `fl-date`, `fl-mileage`, `fl-liters`, `fl-price`, `fl-full`, `fl-save`, `fl-cancel`, `fl-delete`, `overlay-fuel-title`

**view-deadlines**: `btn-add-deadline`, `deadlines-list`; overlay `overlay-deadline`: `dl-type`, `dl-label`, `dl-date`, `dl-cost`, `dl-notes`, `dl-save`, `dl-cancel`, `dl-delete`, `overlay-deadline-title`

**view-more**: `menu-vehicles`, `menu-costs`, `menu-documents`, `menu-settings`, `more-version`

**view-vehicles**: `btn-add-vehicle`, `vehicles-list`; overlay `overlay-vehicle`: `vh-name`, `vh-make`, `vh-model`, `vh-year`, `vh-plate`, `vh-vin`, `vh-mileage`, `vh-notes`, `vh-save`, `vh-cancel`, `vh-delete`, `vh-set-active`, `overlay-vehicle-title`

**view-costs**: `cost-total`, `cost-year`, `cost-month`, `costs-chart` (SVG container), `costs-breakdown`

**view-documents**: `btn-add-document`, `documents-list`; overlay `overlay-document`: `dc-name`, `dc-type`, `dc-number`, `dc-date`, `dc-notes`, `dc-photo` (file input), `dc-photo-preview`, `dc-save`, `dc-cancel`, `dc-delete`, `overlay-document-title`; `photo-viewer` (fullscreen)

**view-settings**: `set-lang-hr`, `set-lang-en`, `btn-export`, `btn-import` (file input), `btn-reset`, `set-version`

**Global**: `toast`, `confirm-dialog` (title/text/ok/cancel), `update-banner` (text + reload button)

## 5. Data model (localStorage key `autoservis_data`)
```js
{
  version: 1,
  settings: { lang: 'hr' },
  activeVehicleId: null,
  vehicles: [{ id, name, make, model, year, plate, vin, mileage, notes, createdAt }],
  log: [{ id, vehicleId, type, date, km, description, cost, remindKm, remindMonths, createdAt }],
  deadlines: [{ id, vehicleId, type, label, expiryDate, cost, notes, createdAt }],
  fuel: [{ id, vehicleId, date, mileage, liters, pricePerLiter, full, createdAt }],
  documents: [{ id, vehicleId, name, type, number, expiryDate, notes, photoId, createdAt }]
}
```
- `id` = `Date.now().toString(36) + Math.random().toString(36).slice(2,7)`
- Photos: IndexedDB DB `autoservis_photos`, store `photos`, key = photoId, value = dataURL (JPEG, max 900px, quality 0.8, compressed via canvas).
- All lists filtered by `activeVehicleId` (except vehicles). If no vehicles exist → show empty-state with CTA to add vehicle.
- MIGRATION (one-time, on load): if stored data has `services` array → convert each to `log` entry `{type:'service', km: mileage, description: notes, keep date/cost/remindKm/remindMonths}`, then delete `services` key.

## 6. Log types / Deadline types
Log types: `service` (Servis / Service), `repair` (Popravak / Repair), `wash` (Pranje / Wash), `inspection` (Pregled / Inspection), `other` (Ostalo / Other)
Deadline types: `registration` (Registracija), `insurance` (Osiguranje), `technical` (Tehnički pregled), `license` (Vozačka dozvola / Driving license), `custom` (Drugo / Other — shows `label` field)

## 7. Reminders & countdown logic
- Log entry reminder: if `remindKm` → next due km = `km + remindKm`; if `remindMonths` → next due date = `date + remindMonths`. Dashboard shows the earliest upcoming reminder (km or date). Dnevnik list shows "due" badge when overdue.
- Deadline countdown: days = expiryDate − today. Green >30, amber 7–30, red <7 or expired. Dashboard chips show same colors.

## 8. Fuel consumption
- Consumption for a fill-up = `liters / (mileage − prevFillupMileage) * 100` (only when `full` checked and prev exists). Avg consumption = mean of valid entries. Show l/100km with 1 decimal.

## 9. PWA + iOS
- `manifest.json`: name "AutoServis", short_name "AutoServis", start_url "/", display "standalone", background_color "#F5F2ED", theme_color "#D9480F", lang "hr", icons 192+512 (purpose "any").
- `index.html` head: viewport `width=device-width, initial-scale=1.0, viewport-fit=cover`; `theme-color` #D9480F; `apple-mobile-web-app-capable` yes; `apple-mobile-web-app-status-bar-style` default; `apple-mobile-web-app-title` AutoServis; `apple-touch-icon` /icons/apple-touch-icon.png; manifest link; title "AutoServis".
- `service-worker.js`: cache name `autoservis-cache-v0.1.0`; precache core files; network-first for navigation, cache-first for assets; on activate delete old caches. Register SW in app.js on load.
- iOS visualViewport fix: overlay panels get explicit height from `visualViewport.height` on open + on resize (function `fixOverlayHeight()`).
- Safe areas: header/tabbar respect `--safe-top`/`--safe-bottom`.

## 10. Version system
- `APP_VERSION = '0.1.0'` constant in app.js.
- `version.json` = `{"version": "0.1.0"}`.
- index.html: `styles.css?v=0.1.0`, `app.js?v=0.1.0`, `fonts.css?v=0.1.0`.
- On load: fetch `version.json` → if version ≠ APP_VERSION → show `update-banner` with reload button.
- SW cache name includes version → version bump forces cache refresh.

## 11. Icons (generate via PowerShell System.Drawing)
Write and run a PS script that draws: 512×512 (and scaled 192, 180) square, background `#D9480F`, white car silhouette (body rectangle + cabin trapezoid + two wheel circles), flat, no gradients. Save PNG (no transparency for apple-touch-icon). Output to `icons/`.

## 12. i18n
- `I18N = { hr: {...}, en: {...} }`, `t(key)` helper, `data-i18n` attributes for static text, dynamic strings via `t()`.
- Keys needed: appName, tabHome, tabServices, tabFuel, tabDeadlines, tabMore, menuVehicles, menuCosts, menuDocuments, menuSettings, addService, addFuel, addDeadline, addVehicle, addDocument, save, cancel, delete, edit, active, setActive, noVehicles, noData, nextService, noNextService, dueKm, dueDate, overdue, daysLeft, expired, today, lastService, avgConsumption, totalCost, thisYear, thisMonth, totalAll, liters, price, mileage, date, cost, notes, type, fullTank, consumption, serviceTypes.{oil,brakes,tires,battery,inspection,other}, deadlineTypes.{registration,insurance,technical,license,custom}, documentTypes.{registration,insurance,technical,license,other}, language, exportData, importData, resetData, confirmReset, confirmDelete, version, newVersion, reload, photo, addPhoto, removePhoto, vehicles, services, fuel, deadlines, documents, costs, settings, km, lPer100, currency (€), etc. Worker may add more as needed — keep HR primary, EN secondary.

## 13. Verification (operator must do all)
1. `python -m http.server 8123` in project root.
2. Playwright at 390×844 (iPhone 13 Pro): load page, no console errors.
3. Flow test: add vehicle → set active → add service (with reminder) → add fuel (2 entries, full tank) → add deadline → add document with photo → check dashboard shows next service + deadline chips → switch to EN → check costs page shows chart + totals → check SW registered → check manifest loads.
4. Reload page → data persists.
5. Fix ALL console errors before reporting.

## 14. Report
Write `docs/temp/build-report.md`: files created, verification results, any deviations from spec, remaining issues.

## 15. Dnevnik (Log) view — v0.1.0
- Tab bar: Početna, **Dnevnik**, Gorivo, Rokovi, Više (Dnevnik REPLACES the old Servisi tab).
- `view-log` shows a chronological timeline (newest first) of ALL events for the active vehicle: log entries + fuel entries (fuel shown with badge "Gorivo", read-only in the diary).
- Each timeline item: date, km, colored type badge, description, cost. Log entries with reminders show "due" badge when overdue.
- Filter chips (`log-filter`): Svi / Servis / Popravak / Pranje / Pregled / Ostalo / Gorivo — filter the timeline.
- Add/edit form (`overlay-log`): type select, date, km, description (textarea), cost, remindKm, remindMonths. Delete button in edit mode.
- Dashboard "next service" card reads the earliest upcoming reminder from log entries.
- i18n keys: tabLog, addLog, logTypes.{service,repair,wash,inspection,other}, description, filterAll, due, logEmpty, etc.

## 16. Dark mode + UX fixes — v0.1.2
### Dark mode (MANDATORY feature)
- Add `[data-theme="dark"]` overrides in styles.css for ALL design tokens (warm dark palette, NOT pure black):
  `--bg: #1A1815; --surface: #24211C; --surface-2: #2E2A24; --border: #3A352E; --text: #EDE8E0; --text-2: #B5ADA1; --text-3: #8A8378; --accent: #F0661F; --accent-2: #F5A623; --ok: #4CAF6D; --warn: #F0661F; --danger: #E5484D; --shadow: 0 1px 3px rgba(0,0,0,.4);`
- Settings (Postavke) gets a theme selector: **Auto / Svijetla / Tamna** (segmented control, IDs `set-theme-auto`, `set-theme-light`, `set-theme-dark`). Persist in `settings.theme` ('auto' default | 'light' | 'dark').
- Apply: set `data-theme="light"|"dark"` on `<html>`. Auto = follow `prefers-color-scheme` + live listener for changes.
- Update `meta[name=theme-color]` dynamically: light → `#F5F2ED`, dark → `#1A1815`.
- i18n keys: theme, themeAuto, themeLight, themeDark.
- Verify ALL views/overlays/tab bar look correct in dark mode (no hardcoded light colors left).

### No text selection on buttons (user preference — remember it)
- CSS: `user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;` on ALL interactive elements: buttons, `.tab`, `.chip`, `.filter-chip`, `.menu-item`, `.vehicle-chip`, `.log-item`, `.stat`, `.quick-action`, any clickable row.
- `touch-action: manipulation` on those elements (kills double-tap zoom + selection).

### No pinch-to-zoom
- viewport meta: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover`.
- body: `touch-action: pan-x pan-y;` + `-webkit-text-size-adjust: 100%;`.

### Version
- Bump to **0.1.2** in ALL carriers: APP_VERSION, version.json, `?v=` params, SW cache name, UI version labels (more-version, set-version).