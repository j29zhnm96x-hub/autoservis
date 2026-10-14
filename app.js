/* ==========================================================================
   AutoServis — app.js v2.2.0 (SIMPLE)
   Fuel log + service log + auto-reminders for a few cars. Vanilla JS.
   Contract: docs/plan.md. DOM IDs match index.html verbatim.
   ========================================================================== */

'use strict';

// ==== CONFIG ====
const APP_VERSION = '2.2.0';
const STORAGE_KEY = 'autoservis_data';

const SERVICE_TYPES = ['oil', 'air-filter', 'fuel-filter', 'timing-belt', 'other'];

/* Fixed service cycles — the CORE of the auto-reminders. */
const CYCLES = {
  'oil':         { km: 8000,  months: 6 },
  'air-filter':  { km: 16000, months: 12 },
  'fuel-filter': { km: 24000, months: 24 },
  'timing-belt': { km: 60000, months: 60 },
  'other':       null
};

/* Service-type → i18n key suffix. */
const SERVICE_TYPE_KEYS = {
  'oil': 'oil',
  'air-filter': 'airFilter',
  'fuel-filter': 'fuelFilter',
  'timing-belt': 'timingBelt',
  'other': 'other'
};

// ==== I18N ====
const I18N = {
  hr: {
    appName: 'AutoServis',
    tabHome: 'Početna',
    tabFuel: 'Gorivo',
    tabServices: 'Servisi',
    tabCosts: 'Troškovi',
    tabSettings: 'Postavke',
    addFuel: 'Dodaj gorivo',
    addService: 'Dodaj servis',
    addVehicle: 'Dodaj vozilo',
    newFuel: 'Novo gorivo',
    editFuel: 'Uredi gorivo',
    newService: 'Novi servis',
    editService: 'Uredi servis',
    newVehicle: 'Novo vozilo',
    editVehicle: 'Uredi vozilo',
    save: 'Spremi',
    cancel: 'Odustani',
    delete: 'Obriši',
    edit: 'Uredi',
    date: 'Datum',
    km: 'Kilometraža',
    kmTh: 'km',
    liters: 'Litara',
    pricePerLiter: 'Cijena po litri',
    fullTank: 'Pun spremnik',
    total: 'Ukupno',
    consumption: 'Potrošnja',
    consShort: 'l/100',
    avgConsumption: 'Prosječna potrošnja',
    lastFuel: 'Zadnje gorivo',
    noFuel: 'Nema unosa goriva',
    noServices: 'Nema unosa servisa',
    serviceTypes: {
      oil: 'Ulje i filter ulja',
      airFilter: 'Filter zraka',
      fuelFilter: 'Filter goriva',
      timingBelt: 'Razvodni remen',
      other: 'Ostalo'
    },
    type: 'Tip',
    work: 'Napravljeno',
    parts: 'Zamijenjeni dijelovi',
    notes: 'Bilješke',
    cost: 'Trošak',
    nextService: 'Sljedeći servis',
    noNextService: 'Nema zakazanog servisa',
    forKm: 'za {km} km',
    forDays: '{days} dana',
    or: 'ili',
    overdue: 'Prekoračeno',
    soon: 'Uskoro',
    lastService: 'Zadnji servis',
    name: 'Naziv',
    make: 'Marka',
    model: 'Model',
    year: 'Godina',
    plate: 'Registracija',
    reg: 'Registracija',
    tech: 'Tehnički',
    insurance: 'Osiguranje',
    regExpiry: 'Registracija do',
    techExpiry: 'Tehnički pregled do',
    insExpiry: 'Osiguranje do',
    daysLeft: '{days} dana',
    expired: 'isteklo',
    notSet: '—',
    dateHint: 'Datum može biti u prošlosti',
    checkForUpdate: 'Provjeri ažuriranje',
    updateAvailable: 'Dostupna nova verzija v{version} — Osvježi',
    upToDate: 'Ažurni ste (v{version})',
    refresh: 'Osvježi',
    mileage: 'Kilometraža',
    vehicles: 'Vozila',
    noVehicles: 'Nema vozila',
    noActiveVehicle: 'Nema aktivnog vozila',
    setActive: 'Postavi aktivnim',
    active: 'Aktivno',
    language: 'Jezik',
    theme: 'Izgled',
    themeAuto: 'Auto',
    themeLight: 'Svijetla',
    themeDark: 'Tamna',
    data: 'Podaci',
    exportData: 'Izvezi podatke',
    importData: 'Uvezi podatke',
    resetData: 'Obriši sve podatke',
    version: 'Verzija',
    migrationToast: 'Svjež početak za servisni dnevnik',
    saved: 'Spremljeno',
    deleted: 'Obrisano',
    exportSuccess: 'Podaci izvezeni',
    importSuccess: 'Podaci uvezeni',
    importError: 'Neispravna datoteka',
    importConfirm: 'Uvoz će zamijeniti sve postojeće podatke. Nastaviti?',
    resetDone: 'Svi podaci obrisani',
    saveError: 'Greška pri spremanju',
    nameRequired: 'Unesite naziv',
    litersRequired: 'Unesite litre',
    dateRequired: 'Unesite datum',
    confirmReset: 'Svi podaci bit će trajno obrisani. Nastaviti?',
    confirmDeleteFuel: 'Obrisati ovaj unos goriva?',
    confirmDeleteService: 'Obrisati ovaj servis?',
    confirmDeleteVehicle: 'Obrisati ovo vozilo i sve njegove podatke?',
    newVersion: 'Nova verzija dostupna',
    reload: 'Učitaj ponovo',
    kmUnit: 'km',
    lPer100: 'l/100km',
    currency: '€',
    thisMonth: 'Ovaj mjesec',
    lastMonth: 'Prošli mjesec',
    monthlyAverage: 'Prosječno mjesečno',
    thisYear: 'Ova godina',
    fuelTotal: 'Gorivo',
    servicesTotal: 'Servisi',
    noCostsData: 'Nema podataka o troškovima',
    month: 'Mjesec',
    unitDays: 'dana',
    notesHeader: 'Bilješke',
    addNote: 'Dodaj bilješku',
    notePlaceholder: 'Nova bilješka…',
    noNotes: 'Nema bilješki',
    deleteNote: 'Obrisati ovu bilješku?'
  },
  en: {
    appName: 'AutoServis',
    tabHome: 'Home',
    tabFuel: 'Fuel',
    tabServices: 'Services',
    tabCosts: 'Costs',
    tabSettings: 'Settings',
    addFuel: 'Add fuel',
    addService: 'Add service',
    addVehicle: 'Add vehicle',
    newFuel: 'New fuel entry',
    editFuel: 'Edit fuel entry',
    newService: 'New service',
    editService: 'Edit service',
    newVehicle: 'New vehicle',
    editVehicle: 'Edit vehicle',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    date: 'Date',
    km: 'Mileage',
    kmTh: 'km',
    liters: 'Liters',
    pricePerLiter: 'Price per liter',
    fullTank: 'Full tank',
    total: 'Total',
    consumption: 'Consumption',
    consShort: 'l/100',
    avgConsumption: 'Avg consumption',
    lastFuel: 'Last fuel',
    noFuel: 'No fuel entries',
    noServices: 'No service entries',
    serviceTypes: {
      oil: 'Oil & oil filter',
      airFilter: 'Air filter',
      fuelFilter: 'Fuel filter',
      timingBelt: 'Timing belt',
      other: 'Other'
    },
    type: 'Type',
    work: 'Work done',
    parts: 'Parts replaced',
    notes: 'Notes',
    cost: 'Cost',
    nextService: 'Next service',
    noNextService: 'No upcoming service',
    forKm: 'in {km} km',
    forDays: 'in {days} days',
    or: 'or',
    overdue: 'Overdue',
    soon: 'Soon',
    lastService: 'Last service',
    name: 'Name',
    make: 'Make',
    model: 'Model',
    year: 'Year',
    plate: 'Plate',
    reg: 'Registration',
    tech: 'Technical',
    insurance: 'Insurance',
    regExpiry: 'Registration until',
    techExpiry: 'Technical inspection until',
    insExpiry: 'Insurance until',
    daysLeft: '{days} days',
    expired: 'expired',
    notSet: '—',
    dateHint: 'Date can be in the past',
    checkForUpdate: 'Check for update',
    updateAvailable: 'New version v{version} available — Refresh',
    upToDate: 'You are up to date (v{version})',
    refresh: 'Refresh',
    mileage: 'Mileage',
    vehicles: 'Vehicles',
    noVehicles: 'No vehicles',
    noActiveVehicle: 'No active vehicle',
    setActive: 'Set active',
    active: 'Active',
    language: 'Language',
    theme: 'Appearance',
    themeAuto: 'Auto',
    themeLight: 'Light',
    themeDark: 'Dark',
    data: 'Data',
    exportData: 'Export data',
    importData: 'Import data',
    resetData: 'Delete all data',
    version: 'Version',
    migrationToast: 'Fresh start for the service log',
    saved: 'Saved',
    deleted: 'Deleted',
    exportSuccess: 'Data exported',
    importSuccess: 'Data imported',
    importError: 'Invalid file',
    importConfirm: 'Import will replace all existing data. Continue?',
    resetDone: 'All data deleted',
    saveError: 'Save error',
    nameRequired: 'Enter a name',
    litersRequired: 'Enter liters',
    dateRequired: 'Enter a date',
    confirmReset: 'All data will be permanently deleted. Continue?',
    confirmDeleteFuel: 'Delete this fuel entry?',
    confirmDeleteService: 'Delete this service?',
    confirmDeleteVehicle: 'Delete this vehicle and all of its data?',
    newVersion: 'New version available',
    reload: 'Reload',
    kmUnit: 'km',
    lPer100: 'l/100km',
    currency: '€',
    thisMonth: 'This month',
    lastMonth: 'Last month',
    monthlyAverage: 'Monthly average',
    thisYear: 'This year',
    fuelTotal: 'Fuel',
    servicesTotal: 'Services',
    noCostsData: 'No cost data',
    month: 'Month',
    unitDays: 'days',
    notesHeader: 'Notes',
    addNote: 'Add note',
    notePlaceholder: 'New note…',
    noNotes: 'No notes',
    deleteNote: 'Delete this note?'
  }
};

/* Localized month names for the costs table ("Siječanj 2026" / "January 2026"). */
const MONTH_NAMES = {
  hr: ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
       'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'],
  en: ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December']
};

// ==== STATE ====
const state = {
  data: null,
  currentView: 'home',
  editingId: null,
  pendingMigration: false
};

// ==== UTILS ====
function byId(id) { return document.getElementById(id); }

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function t(key, vars) {
  const lang = (state.data && state.data.settings && state.data.settings.lang) || 'hr';
  const lookup = function (dict) {
    return key.split('.').reduce(function (o, p) { return o == null ? undefined : o[p]; }, dict);
  };
  let val = lookup(I18N[lang]);
  if (val == null) val = lookup(I18N.en);
  if (val == null) val = key;
  if (typeof val === 'string' && vars) {
    val = val.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }
  return val;
}

function svcTypeLabel(type) { return t('serviceTypes.' + (SERVICE_TYPE_KEYS[type] || 'other')); }

function parseNum(val) {
  const n = parseFloat(String(val == null ? '' : val).replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

function parseDate(iso) {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3]);
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function daysBetween(isoA, isoB) {
  const a = parseDate(isoA);
  const b = parseDate(isoB);
  if (!a || !b) return 0;
  return Math.round((b - a) / 86400000);
}

/* Calendar-safe month add on a YYYY-MM-DD string. */
function addMonths(iso, months) {
  const d = parseDate(iso);
  if (!d) return iso;
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function locale() {
  return (state.data && state.data.settings && state.data.settings.lang === 'en') ? 'en-GB' : 'hr-HR';
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = parseDate(iso);
  if (!d) return iso;
  return d.toLocaleDateString(locale(), { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtNum(n, decimals) {
  return (Number(n) || 0).toLocaleString(locale(), { maximumFractionDigits: decimals == null ? 2 : decimals });
}

/* Consumption always shows one decimal (7,0 hr / 7.0 en). */
function fmtCons(n) {
  return (Number(n) || 0).toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/* Plain integers (no thousands grouping) — "za 8000 km", not "za 8.000 km". */
function plainInt(n) { return String(Math.max(0, Math.round(Number(n) || 0))); }

function fmtKm(n) { return fmtNum(Math.round(Number(n) || 0), 0) + ' ' + t('kmUnit'); }

function fmtMoney(n) {
  return (Number(n) || 0).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + t('currency');
}

/* "Siječanj 2026" / "January 2026" from a "YYYY-MM" key. */
function fmtMonthLabel(ym) {
  const lang = (state.data && state.data.settings && state.data.settings.lang) || 'hr';
  const names = MONTH_NAMES[lang] || MONTH_NAMES.hr;
  const m = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!m) return ym;
  return names[+m[2] - 1] + ' ' + m[1];
}

// ==== STORAGE & MIGRATION ====
function defaultData() {
  return {
    version: 2,
    settings: { lang: 'hr', theme: 'auto' },
    activeVehicleId: null,
    vehicles: [],
    fuel: [],
    services: [],
    notes: []
  };
}

/* Optional ISO date (YYYY-MM-DD…) or null — normalizes vehicle expiry fields. */
function normDateStr(val) {
  return (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) ? val : null;
}

/* Normalize a v2-shaped object back to the exact model (drops unknown fields). */
function normalizeV2(raw) {
  const d = defaultData();
  if (!raw || typeof raw !== 'object') return d;
  d.settings = {
    lang: raw.settings && raw.settings.lang === 'en' ? 'en' : 'hr',
    theme: raw.settings && ['auto', 'light', 'dark'].indexOf(raw.settings.theme) !== -1 ? raw.settings.theme : 'auto'
  };
  d.activeVehicleId = typeof raw.activeVehicleId === 'string' ? raw.activeVehicleId : null;
  d.vehicles = (Array.isArray(raw.vehicles) ? raw.vehicles : []).map(function (v) {
    return {
      id: v.id || uid(), name: v.name || '', make: v.make || '', model: v.model || '',
      year: v.year || null, plate: v.plate || '', mileage: Number(v.mileage) || 0,
      regExpiry: normDateStr(v.regExpiry), techExpiry: normDateStr(v.techExpiry), insExpiry: normDateStr(v.insExpiry),
      createdAt: v.createdAt || new Date().toISOString()
    };
  });
  d.fuel = (Array.isArray(raw.fuel) ? raw.fuel : []).map(function (f) {
    return {
      id: f.id || uid(), vehicleId: f.vehicleId || '', date: f.date || '',
      km: Number(f.km) || 0, liters: Number(f.liters) || 0,
      pricePerLiter: Number(f.pricePerLiter) || 0, full: !!f.full,
      createdAt: f.createdAt || new Date().toISOString()
    };
  });
  d.services = (Array.isArray(raw.services) ? raw.services : []).map(function (s) {
    return {
      id: s.id || uid(), vehicleId: s.vehicleId || '', type: SERVICE_TYPES.indexOf(s.type) !== -1 ? s.type : 'other',
      date: s.date || '', km: Number(s.km) || 0, work: s.work || '', parts: s.parts || '',
      notes: s.notes || '', cost: Number(s.cost) || 0, createdAt: s.createdAt || new Date().toISOString()
    };
  });
  d.notes = (Array.isArray(raw.notes) ? raw.notes : []).map(function (n) {
    return {
      id: n.id || uid(), vehicleId: n.vehicleId || '', text: n.text || '',
      createdAt: n.createdAt || new Date().toISOString()
    };
  });
  return d;
}

/* One-time migration from v0.0.x / v0.1.2 (version < 2):
   vehicles lose vin/notes, fuel mileage→km, log/deadlines/documents/old services are dropped. */
function migrateToV2(raw) {
  const d = defaultData();
  d.settings = {
    lang: raw.settings && raw.settings.lang === 'en' ? 'en' : 'hr',
    theme: raw.settings && ['auto', 'light', 'dark'].indexOf(raw.settings.theme) !== -1 ? raw.settings.theme : 'auto'
  };
  d.activeVehicleId = typeof raw.activeVehicleId === 'string' ? raw.activeVehicleId : null;
  d.vehicles = (Array.isArray(raw.vehicles) ? raw.vehicles : []).map(function (v) {
    return {
      id: v.id || uid(), name: v.name || '', make: v.make || '', model: v.model || '',
      year: v.year || null, plate: v.plate || '', mileage: Number(v.mileage) || 0,
      regExpiry: normDateStr(v.regExpiry), techExpiry: normDateStr(v.techExpiry), insExpiry: normDateStr(v.insExpiry),
      createdAt: v.createdAt || new Date().toISOString()
    };
  });
  d.fuel = (Array.isArray(raw.fuel) ? raw.fuel : []).map(function (f) {
    return {
      id: f.id || uid(), vehicleId: f.vehicleId || '', date: f.date || '',
      km: Number(f.km != null ? f.km : f.mileage) || 0, liters: Number(f.liters) || 0,
      pricePerLiter: Number(f.pricePerLiter) || 0, full: !!f.full,
      createdAt: f.createdAt || new Date().toISOString()
    };
  });
  return d; // services/log/deadlines/documents intentionally dropped
}

function loadData() {
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { raw = null; }
  if (!raw || typeof raw !== 'object') {
    state.data = defaultData();
    return;
  }
  if (raw.version === 2) {
    state.data = normalizeV2(raw);
    return;
  }
  state.data = migrateToV2(raw);
  state.pendingMigration = true;
  saveData();
}

function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); }
  catch (e) { toast(t('saveError')); }
}

// ==== HELPERS ====
function getActiveVehicle() {
  return state.data.vehicles.find(function (v) { return v.id === state.data.activeVehicleId; }) || null;
}

function getVehicle(id) {
  return state.data.vehicles.find(function (v) { return v.id === id; }) || null;
}

function filterByVehicle(list) {
  const id = state.data.activeVehicleId;
  return list.filter(function (x) { return x.vehicleId === id; });
}

function ensureActiveVehicle() {
  if (!state.data.vehicles.length) { state.data.activeVehicleId = null; return; }
  const has = state.data.vehicles.some(function (v) { return v.id === state.data.activeVehicleId; });
  if (!has) { state.data.activeVehicleId = state.data.vehicles[0].id; saveData(); }
}

function requireActiveVehicle() {
  const v = getActiveVehicle();
  if (!v) toast(t('noActiveVehicle'));
  return v;
}

/* Logging a service/fuel above the stored mileage bumps the vehicle's odometer. */
function updateVehicleMileage(vehicle, km) {
  if (vehicle && Number(km) > (Number(vehicle.mileage) || 0)) {
    vehicle.mileage = Number(km);
  }
}

/* Newest-first sort by date, createdAt as tiebreak. */
function sortNewest(list) {
  return list.slice().sort(function (a, b) {
    const d = (b.date || '').localeCompare(a.date || '');
    if (d !== 0) return d;
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}

// ==== FUEL CONSUMPTION ====
/* liters / (km − prevKm) × 100, full-tank → full-tank only.
   Previous fill-up = the HIGHEST km still below the current entry's km
   (not entry order / date order), so backdated entries compute correctly. */
function computeConsumptions(fuelEntries) {
  const fulls = fuelEntries.filter(function (f) { return f.full; });
  const map = new Map();
  fulls.forEach(function (cur) {
    const curKm = Number(cur.km) || 0;
    let prev = null;
    for (let i = 0; i < fulls.length; i++) {
      const cand = fulls[i];
      if (cand.id === cur.id) continue;
      const candKm = Number(cand.km) || 0;
      if (candKm >= curKm) continue;
      if (!prev ||
          candKm > (Number(prev.km) || 0) ||
          (candKm === (Number(prev.km) || 0) && (cand.createdAt || '') > (prev.createdAt || ''))) {
        prev = cand;
      }
    }
    if (!prev) return;
    const delta = curKm - (Number(prev.km) || 0);
    if (delta <= 0) return;
    map.set(cur.id, ((Number(cur.liters) || 0) / delta) * 100);
  });
  return map;
}

// ==== SERVICE CYCLE CALCULATIONS ====
function lastServiceOf(vehicleId, type) {
  const list = state.data.services.filter(function (s) {
    return s.vehicleId === vehicleId && s.type === type;
  });
  if (!list.length) return null;
  return sortNewest(list)[0];
}

/* Next-due per type from the LAST service of that type; earliest across all types wins. */
function nextServiceFor(vehicle) {
  let best = null;
  SERVICE_TYPES.forEach(function (type) {
    const cycle = CYCLES[type];
    if (!cycle) return;
    const last = lastServiceOf(vehicle.id, type);
    if (!last) return;
    const nextKm = (Number(last.km) || 0) + cycle.km;
    const nextDate = addMonths(last.date, cycle.months);
    const kmRemaining = nextKm - (Number(vehicle.mileage) || 0);
    const daysRemaining = daysBetween(todayISO(), nextDate);
    const overdue = kmRemaining <= 0 || daysRemaining <= 0;
    const soon = !overdue && (kmRemaining < 1000 || daysRemaining < 30);
    const score = Math.min(kmRemaining / 1000, daysRemaining / 30);
    if (!best || score < best.score) {
      best = {
        type: type, last: last, nextKm: nextKm, nextDate: nextDate,
        kmRemaining: kmRemaining, daysRemaining: daysRemaining,
        status: overdue ? 'overdue' : (soon ? 'soon' : 'ok'), score: score
      };
    }
  });
  return best;
}

// ==== TOAST ====
let toastTimer = null;

function toast(message) {
  const el = byId('toast');
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  el.classList.add('toast--show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    el.classList.remove('toast--show');
    el.hidden = true;
  }, 2500);
}

// ==== CONFIRM DIALOG ====
function confirmDialog(opts) {
  return new Promise(function (resolve) {
    const dlg = byId('confirm');
    if (!dlg) { resolve(false); return; }
    byId('confirm-title').textContent = opts.title || t('delete');
    byId('confirm-text').textContent = opts.text || '';
    byId('confirm-ok').textContent = opts.okText || t('delete');
    byId('confirm-cancel').textContent = opts.cancelText || t('cancel');
    dlg.hidden = false;
    dlg.classList.add('confirm--open');
    const done = function (val) {
      dlg.classList.remove('confirm--open');
      dlg.hidden = true;
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      resolve(val);
    };
    const onOk = function () { done(true); };
    const onCancel = function () { done(false); };
    const okBtn = byId('confirm-ok');
    const cancelBtn = byId('confirm-cancel');
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
  });
}

// ==== THEME & LANGUAGE ====
const THEME_COLORS = { light: '#F5F2ED', dark: '#1A1815' };

function isDark(theme) {
  return theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

function applyTheme() {
  const theme = state.data.settings.theme;
  const dark = isDark(theme);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
}

function setTheme(theme) {
  state.data.settings.theme = theme;
  saveData();
  applyTheme();
  renderSettings();
}

function setLang(lang) {
  state.data.settings.lang = lang;
  saveData();
  document.documentElement.lang = lang;
  applyI18n();
  renderSettings();
  renderCurrentView();
}

/* Static data-i18n labels (tabs, headers, form fields, buttons). */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
}

// ==== I18N FOR DYNAMIC SELECT OPTIONS ====
function refreshSelectI18n() {
  document.querySelectorAll('#sv-type option').forEach(function (opt) {
    opt.textContent = t('serviceTypes.' + (SERVICE_TYPE_KEYS[opt.value] || 'other'));
  });
}

// ==== ROUTER ====
const VIEW_RENDERERS = {
  home: renderHome,
  fuel: renderFuel,
  services: renderServices,
  costs: renderCosts,
  settings: renderSettings
};

const VIEW_MAP = { home: 'view-home', fuel: 'view-fuel', services: 'view-services', costs: 'view-costs', settings: 'view-settings' };
const TAB_MAP = { home: 'tab-home', fuel: 'tab-fuel', services: 'tab-services', costs: 'tab-costs', settings: 'tab-settings' };

function showView(id) {
  state.currentView = id;
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('view--active'); });
  const view = byId(VIEW_MAP[id]);
  if (view) view.classList.add('view--active');
  document.querySelectorAll('.tab').forEach(function (tab) { tab.classList.remove('tab--active'); });
  const tab = byId(TAB_MAP[id]);
  if (tab) tab.classList.add('tab--active');
  const renderer = VIEW_RENDERERS[id];
  if (renderer) renderer();
  window.scrollTo(0, 0);
}

function renderCurrentView() {
  const renderer = VIEW_RENDERERS[state.currentView];
  if (renderer) renderer();
}

// ==== OVERLAYS ====
function fixOverlayHeight() {
  const vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  document.querySelectorAll('.overlay').forEach(function (el) { el.style.height = vh + 'px'; });
}

function openOverlay(id) {
  const el = byId(id);
  if (!el) return;
  el.hidden = false;
  el.classList.add('overlay--open');
  fixOverlayHeight();
  document.body.classList.add('body--overlay');
}

function closeOverlay(id) {
  const el = byId(id);
  if (!el) return;
  el.classList.remove('overlay--open');
  el.hidden = true;
  if (!document.querySelector('.overlay--open')) document.body.classList.remove('body--overlay');
}

// ==== VIEW: HOME ====
/* 2 smaller deadline countdown chips (technical / insurance) under the two big
   cards. regExpiry has its own big card since v2.2.0.
   green >30 days, amber 7–30, red <7 or expired, gray "—" when not set. */
function deadlineChipsHTML(vehicle) {
  const defs = [
    { key: 'techExpiry', label: t('tech') },
    { key: 'insExpiry', label: t('insurance') }
  ];
  return defs.map(function (d) {
    const iso = vehicle[d.key];
    let cls = 'dl-chip--none';
    let val = t('notSet');
    if (iso) {
      const days = daysBetween(todayISO(), iso);
      if (days <= 0) { cls = 'dl-chip--danger'; val = t('expired'); }
      else if (days > 30) { cls = 'dl-chip--ok'; val = t('daysLeft', { days: plainInt(days) }); }
      else if (days >= 7) { cls = 'dl-chip--warn'; val = t('daysLeft', { days: plainInt(days) }); }
      else { cls = 'dl-chip--danger'; val = t('daysLeft', { days: plainInt(days) }); }
    }
    return '<button type="button" class="dl-chip ' + cls + '" data-action="edit-vehicle" data-id="' + esc(vehicle.id) + '">' +
      '<span class="dl-chip__label">' + esc(d.label) + '</span>' +
      '<span class="dl-chip__value">' + esc(val) + '</span>' +
      '</button>';
  }).join('');
}

/* Big countdown card #1 — earliest upcoming service (km or days driver). */
function nextServiceCardHTML(vehicle) {
  const ns = nextServiceFor(vehicle);
  let cls = 'cd-card';
  let big, unit, meta = '';
  if (ns) {
    cls += ' cd-card--' + ns.status;
    if (ns.status === 'overdue') {
      big = esc(t('overdue'));
      unit = '';
    } else {
      const kmFirst = (ns.kmRemaining / 1000) <= (ns.daysRemaining / 30);
      big = esc(plainInt(kmFirst ? ns.kmRemaining : ns.daysRemaining));
      unit = esc(kmFirst ? t('kmUnit') : t('unitDays'));
    }
    meta = esc(t('lastService')) + ': ' + fmtDate(ns.last.date);
  } else {
    big = esc(t('notSet'));
    unit = '';
    meta = esc(t('noNextService'));
  }
  const typeLine = ns ? '<div class="cd-type">' + esc(svcTypeLabel(ns.type)) + '</div>' : '';
  return '<div class="' + cls + '" id="cd-service">' +
    '<div class="cd-label">' + esc(t('nextService')) + '</div>' + typeLine +
    '<div class="cd-num' + (ns && ns.status === 'overdue' ? ' cd-num--text' : '') + '">' + big + '</div>' +
    (unit ? '<div class="cd-unit">' + unit + '</div>' : '') +
    (meta ? '<div class="cd-meta">' + meta + '</div>' : '') +
    '</div>';
}

/* Big countdown card #2 — registration expiry. green >30, amber 7–30, red <7/expired. */
function regCardHTML(vehicle) {
  const iso = vehicle.regExpiry;
  let cls = 'cd-card';
  let big = esc(t('notSet'));
  let unit = '';
  let meta = '';
  if (iso) {
    const days = daysBetween(todayISO(), iso);
    if (days <= 0) { cls += ' cd-card--overdue'; big = esc(t('expired')); }
    else if (days > 30) { cls += ' cd-card--ok'; big = esc(plainInt(days)); unit = esc(t('unitDays')); }
    else if (days >= 7) { cls += ' cd-card--soon'; big = esc(plainInt(days)); unit = esc(t('unitDays')); }
    else { cls += ' cd-card--overdue'; big = esc(plainInt(days)); unit = esc(t('unitDays')); }
    meta = fmtDate(iso);
  }
  return '<button type="button" class="' + cls + ' cd-card--btn" id="cd-reg" data-action="edit-vehicle" data-id="' + esc(vehicle.id) + '">' +
    '<div class="cd-label">' + esc(t('reg')) + '</div>' +
    '<div class="cd-num' + (unit === '' ? ' cd-num--text' : '') + '">' + big + '</div>' +
    (unit ? '<div class="cd-unit">' + unit + '</div>' : '') +
    (meta ? '<div class="cd-meta">' + esc(meta) + '</div>' : '') +
    '</button>';
}

/* Notes (per-vehicle scratchpad) — newest first by createdAt. */
function renderNotes() {
  const listEl = byId('notes-list');
  if (!listEl) return;
  const id = state.data.activeVehicleId;
  const notes = state.data.notes
    .filter(function (n) { return n.vehicleId === id; })
    .slice()
    .sort(function (a, b) { return (b.createdAt || '').localeCompare(a.createdAt || ''); });
  if (!notes.length) {
    listEl.innerHTML = '<div class="notes__empty">' + esc(t('noNotes')) + '</div>';
    return;
  }
  listEl.innerHTML = notes.map(function (n) {
    return '<button type="button" class="note" data-action="delete-note" data-id="' + esc(n.id) + '">' +
      '<span class="note__date">' + fmtDate(n.createdAt) + '</span>' +
      '<span class="note__text">' + esc(n.text) + '</span>' +
      '</button>';
  }).join('');
}

function saveNote() {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  const input = byId('notes-input');
  const text = (input.value || '').trim();
  if (!text) return;
  state.data.notes.push({ id: uid(), vehicleId: vehicle.id, text: text, createdAt: new Date().toISOString() });
  saveData();
  input.value = '';
  renderNotes();
  toast(t('saved'));
}

async function deleteNote(id) {
  const ok = await confirmDialog({ title: t('delete'), text: t('deleteNote') });
  if (!ok) return;
  state.data.notes = state.data.notes.filter(function (n) { return n.id !== id; });
  saveData();
  renderNotes();
  toast(t('deleted'));
}

function renderHome() {
  const chips = byId('home-chips');
  const card = byId('home-vehicle');
  const countdowns = byId('home-countdowns');
  const deadlines = byId('home-deadlines');
  const lastFuel = byId('home-last-fuel');
  const vehicles = state.data.vehicles;

  if (!vehicles.length) {
    chips.innerHTML = '';
    card.innerHTML = '<div class="empty-state"><p>' + esc(t('noVehicles')) + '</p>' +
      '<button type="button" class="btn btn--primary" data-action="add-vehicle">' + esc(t('addVehicle')) + '</button></div>';
    countdowns.innerHTML = '';
    deadlines.innerHTML = '';
    lastFuel.innerHTML = '';
    const notesList = byId('notes-list');
    if (notesList) notesList.innerHTML = '';
    return;
  }

  const active = getActiveVehicle();
  if (!active) return;

  chips.innerHTML = vehicles.map(function (v) {
    return '<button type="button" class="chip' + (v.id === active.id ? ' chip--active' : '') +
      '" data-action="set-active" data-id="' + v.id + '">' + esc(v.name) + '</button>';
  }).join('');

  const fullName = [active.make, active.model].filter(Boolean).join(' ');
  card.innerHTML =
    '<div class="vc-name">' + esc(active.name) + '</div>' +
    (fullName ? '<div class="vc-sub">' + esc(fullName) + (active.year ? ' · ' + esc(active.year) : '') + '</div>' : '') +
    (active.plate ? '<div class="vc-plate">' + esc(active.plate) + '</div>' : '') +
    '<div class="vc-mileage">' + fmtKm(active.mileage) + '</div>';

  countdowns.innerHTML = nextServiceCardHTML(active) + regCardHTML(active);
  deadlines.innerHTML = deadlineChipsHTML(active);

  const fuel = sortNewest(filterByVehicle(state.data.fuel));
  if (fuel.length) {
    const latest = fuel[0];
    const cons = computeConsumptions(filterByVehicle(state.data.fuel)).get(latest.id);
    lastFuel.innerHTML =
      '<div class="ns-title ns-title--muted">' + esc(t('lastFuel')) + '</div>' +
      '<div class="lf-row"><span>' + fmtDate(latest.date) + '</span><span>' + fmtKm(latest.km) + '</span></div>' +
      '<div class="lf-row lf-row--strong"><span>' + fmtNum(latest.liters, 2) + ' L · ' + fmtMoney(latest.liters * latest.pricePerLiter) + '</span>' +
      '<span>' + (cons != null ? fmtCons(cons) + ' ' + esc(t('lPer100')) : '—') + '</span></div>';
  } else {
    lastFuel.innerHTML = '<div class="ns-title ns-title--muted">' + esc(t('lastFuel')) + '</div>' +
      '<div class="ns-meta">' + esc(t('noFuel')) + '</div>';
  }

  renderNotes();
}

// ==== VIEW: FUEL ====
function renderFuel() {
  const rows = byId('fuel-rows');
  const empty = byId('fuel-empty');
  const avgEl = byId('fuel-avg');
  const vehicle = getActiveVehicle();

  if (!vehicle) {
    rows.innerHTML = '';
    empty.hidden = false;
    empty.textContent = state.data.vehicles.length ? t('noActiveVehicle') : t('noVehicles');
    avgEl.innerHTML = '<span class="stat-label">' + esc(t('avgConsumption')) + '</span><span class="stat-value">—</span>';
    return;
  }

  const all = filterByVehicle(state.data.fuel);
  const consumptions = computeConsumptions(all);
  const values = Array.from(consumptions.values());
  const avg = values.length ? values.reduce(function (a, b) { return a + b; }, 0) / values.length : null;
  avgEl.innerHTML = '<span class="stat-label">' + esc(t('avgConsumption')) + '</span>' +
    '<span class="stat-value">' + (avg != null ? fmtCons(avg) + ' <small>' + esc(t('lPer100')) + '</small>' : '—') + '</span>';

  const list = sortNewest(all);
  empty.hidden = list.length > 0;
  rows.innerHTML = list.map(function (f) {
    const cons = consumptions.get(f.id);
    return '<tr data-action="edit-fuel" data-id="' + f.id + '">' +
      '<td>' + fmtDate(f.date) + (f.full ? '<span class="dot-full" title="' + esc(t('fullTank')) + '"></span>' : '') + '</td>' +
      '<td>' + fmtNum(f.km, 0) + '</td>' +
      '<td>' + fmtNum(f.liters, 2) + '</td>' +
      '<td>' + fmtMoney(f.liters * f.pricePerLiter) + '</td>' +
      '<td class="td-cons">' + (cons != null ? fmtCons(cons) : '—') + '</td>' +
      '</tr>';
  }).join('');
}

function openFuelOverlay(id) {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  state.editingId = id || null;
  byId('fuel-title').textContent = id ? t('editFuel') : t('newFuel');
  byId('fl-delete').style.display = id ? '' : 'none';
  if (id) {
    const f = state.data.fuel.find(function (x) { return x.id === id; });
    if (!f) return;
    byId('fl-date').value = f.date || '';
    byId('fl-km').value = f.km != null ? f.km : '';
    byId('fl-liters').value = f.liters != null ? f.liters : '';
    byId('fl-price').value = f.pricePerLiter != null ? f.pricePerLiter : '';
    byId('fl-full').checked = !!f.full;
  } else {
    byId('fl-date').value = todayISO();
    byId('fl-km').value = vehicle.mileage != null ? vehicle.mileage : '';
    byId('fl-liters').value = '';
    byId('fl-price').value = '';
    byId('fl-full').checked = true;
  }
  updateFuelTotal();
  openOverlay('overlay-fuel');
}

function updateFuelTotal() {
  const liters = parseNum(byId('fl-liters').value);
  const price = parseNum(byId('fl-price').value);
  byId('fl-total').textContent = fmtMoney(liters * price);
}

function saveFuel() {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  const date = byId('fl-date').value;
  if (!date) { toast(t('dateRequired')); return; }
  const liters = parseNum(byId('fl-liters').value);
  if (liters <= 0) { toast(t('litersRequired')); return; }
  const km = parseNum(byId('fl-km').value);
  const existing = state.editingId ? state.data.fuel.find(function (x) { return x.id === state.editingId; }) : null;
  const rec = {
    id: state.editingId || uid(),
    vehicleId: vehicle.id,
    date: date,
    km: km,
    liters: liters,
    pricePerLiter: parseNum(byId('fl-price').value),
    full: byId('fl-full').checked,
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };
  if (existing) state.data.fuel = state.data.fuel.map(function (x) { return x.id === rec.id ? rec : x; });
  else state.data.fuel.push(rec);
  updateVehicleMileage(vehicle, km);
  saveData();
  closeOverlay('overlay-fuel');
  renderCurrentView();
  toast(t('saved'));
}

async function deleteFuel(id) {
  const recId = id || state.editingId;
  const ok = await confirmDialog({ title: t('delete'), text: t('confirmDeleteFuel') });
  if (!ok) return;
  state.data.fuel = state.data.fuel.filter(function (x) { return x.id !== recId; });
  saveData();
  closeOverlay('overlay-fuel');
  renderCurrentView();
  toast(t('deleted'));
}

// ==== VIEW: SERVICES ====
function renderServices() {
  const rows = byId('services-rows');
  const empty = byId('services-empty');
  const vehicle = getActiveVehicle();

  if (!vehicle) {
    rows.innerHTML = '';
    empty.hidden = false;
    empty.textContent = state.data.vehicles.length ? t('noActiveVehicle') : t('noVehicles');
    return;
  }

  const list = sortNewest(filterByVehicle(state.data.services));
  empty.hidden = list.length > 0;
  rows.innerHTML = list.map(function (s) {
    return '<tr data-action="edit-service" data-id="' + s.id + '">' +
      '<td><span class="badge badge--' + esc(s.type) + '">' + esc(svcTypeLabel(s.type)) + '</span></td>' +
      '<td>' + fmtDate(s.date) + '</td>' +
      '<td>' + fmtNum(s.km, 0) + '</td>' +
      '<td class="td-work">' + esc(s.work || '—') + '</td>' +
      '<td>' + (s.cost ? fmtMoney(s.cost) : '—') + '</td>' +
      '</tr>';
  }).join('');
}

function openServiceOverlay(id) {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  state.editingId = id || null;
  refreshSelectI18n();
  byId('service-title').textContent = id ? t('editService') : t('newService');
  byId('sv-delete').style.display = id ? '' : 'none';
  if (id) {
    const s = state.data.services.find(function (x) { return x.id === id; });
    if (!s) return;
    byId('sv-type').value = s.type;
    byId('sv-date').value = s.date || '';
    byId('sv-km').value = s.km != null ? s.km : '';
    byId('sv-work').value = s.work || '';
    byId('sv-parts').value = s.parts || '';
    byId('sv-notes').value = s.notes || '';
    byId('sv-cost').value = s.cost != null && s.cost !== 0 ? s.cost : '';
  } else {
    byId('sv-type').value = 'oil';
    byId('sv-date').value = todayISO();
    byId('sv-km').value = vehicle.mileage != null ? vehicle.mileage : '';
    byId('sv-work').value = '';
    byId('sv-parts').value = '';
    byId('sv-notes').value = '';
    byId('sv-cost').value = '';
  }
  openOverlay('overlay-service');
}

function saveService() {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  const date = byId('sv-date').value;
  if (!date) { toast(t('dateRequired')); return; }
  const km = parseNum(byId('sv-km').value);
  const type = byId('sv-type').value;
  const existing = state.editingId ? state.data.services.find(function (x) { return x.id === state.editingId; }) : null;
  const rec = {
    id: state.editingId || uid(),
    vehicleId: vehicle.id,
    type: type,
    date: date,
    km: km,
    work: byId('sv-work').value.trim(),
    parts: byId('sv-parts').value.trim(),
    notes: byId('sv-notes').value.trim(),
    cost: parseNum(byId('sv-cost').value),
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };
  if (existing) state.data.services = state.data.services.map(function (x) { return x.id === rec.id ? rec : x; });
  else state.data.services.push(rec);
  updateVehicleMileage(vehicle, km);
  saveData();
  closeOverlay('overlay-service');
  renderCurrentView();
  toast(t('saved'));
}

async function deleteService(id) {
  const recId = id || state.editingId;
  const ok = await confirmDialog({ title: t('delete'), text: t('confirmDeleteService') });
  if (!ok) return;
  state.data.services = state.data.services.filter(function (x) { return x.id !== recId; });
  saveData();
  closeOverlay('overlay-service');
  renderCurrentView();
  toast(t('deleted'));
}

// ==== VIEW: COSTS ====
/* All costs DERIVED from existing entries (fuel: liters×pricePerLiter, services: cost).
   No new storage. Per active vehicle. */
function costsByMonth(vehicleId) {
  const map = new Map(); // "YYYY-MM" -> { fuel, services }
  function bucket(ym) {
    if (!map.has(ym)) map.set(ym, { fuel: 0, services: 0 });
    return map.get(ym);
  }
  state.data.fuel.forEach(function (f) {
    if (f.vehicleId !== vehicleId || !f.date) return;
    bucket(f.date.slice(0, 7)).fuel += (Number(f.liters) || 0) * (Number(f.pricePerLiter) || 0);
  });
  state.data.services.forEach(function (s) {
    if (s.vehicleId !== vehicleId || !s.date) return;
    bucket(s.date.slice(0, 7)).services += Number(s.cost) || 0;
  });
  // Drop months where nothing was spent (e.g. zero-cost entries) — they are not
  // "months with entries" for the average and would only clutter the table.
  Array.from(map.keys()).forEach(function (ym) {
    const v = map.get(ym);
    if (!v.fuel && !v.services) map.delete(ym);
  });
  return map;
}

function renderCosts() {
  const summary = byId('costs-summary');
  const cats = byId('costs-cats');
  const rows = byId('costs-rows');
  const empty = byId('costs-empty');
  const tableWrap = byId('costs-table-wrap');
  const vehicle = getActiveVehicle();

  if (!vehicle) {
    summary.innerHTML = '';
    cats.innerHTML = '';
    rows.innerHTML = '';
    tableWrap.hidden = true;
    empty.hidden = false;
    empty.textContent = state.data.vehicles.length ? t('noActiveVehicle') : t('noVehicles');
    return;
  }

  const map = costsByMonth(vehicle.id);
  const now = new Date();
  const thisYM = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const lastD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastYM = lastD.getFullYear() + '-' + String(lastD.getMonth() + 1).padStart(2, '0');
  const thisYear = String(now.getFullYear());

  let totalFuel = 0, totalServices = 0;
  let thisMonthTotal = 0, lastMonthTotal = 0, thisYearTotal = 0;
  map.forEach(function (v, ym) {
    const sum = v.fuel + v.services;
    totalFuel += v.fuel;
    totalServices += v.services;
    if (ym === thisYM) thisMonthTotal += sum;
    if (ym === lastYM) lastMonthTotal += sum;
    if (ym.slice(0, 4) === thisYear) thisYearTotal += sum;
  });
  const monthCount = map.size;
  const avg = monthCount ? (totalFuel + totalServices) / monthCount : 0;

  const cards = [
    { label: t('thisMonth'), value: thisMonthTotal },
    { label: t('lastMonth'), value: lastMonthTotal },
    { label: t('monthlyAverage'), value: avg },
    { label: t('thisYear'), value: thisYearTotal }
  ];
  summary.innerHTML = cards.map(function (c) {
    return '<div class="cost-card"><span class="cost-card__label">' + esc(c.label) + '</span>' +
      '<span class="cost-card__value">' + fmtMoney(c.value) + '</span></div>';
  }).join('');

  cats.innerHTML =
    '<div class="cost-cat"><span class="cost-cat__label">' + esc(t('fuelTotal')) + '</span>' +
    '<span class="cost-cat__value cost-cat__value--fuel">' + fmtMoney(totalFuel) + '</span></div>' +
    '<div class="cost-cat"><span class="cost-cat__label">' + esc(t('servicesTotal')) + '</span>' +
    '<span class="cost-cat__value cost-cat__value--svc">' + fmtMoney(totalServices) + '</span></div>';

  const yms = Array.from(map.keys()).sort().reverse(); // newest month first
  empty.hidden = yms.length > 0;
  empty.textContent = t('noCostsData');
  tableWrap.hidden = yms.length === 0;
  rows.innerHTML = yms.map(function (ym) {
    const v = map.get(ym);
    return '<tr>' +
      '<td>' + esc(fmtMonthLabel(ym)) + '</td>' +
      '<td>' + fmtMoney(v.fuel) + '</td>' +
      '<td>' + fmtMoney(v.services) + '</td>' +
      '<td class="td-total">' + fmtMoney(v.fuel + v.services) + '</td>' +
      '</tr>';
  }).join('');
}

// ==== VIEW: SETTINGS ====
function renderSettings() {
  const list = byId('settings-vehicles');
  const active = getActiveVehicle();

  if (!state.data.vehicles.length) {
    list.innerHTML = '<div class="settings-row"><span class="vh-meta">' + esc(t('noVehicles')) + '</span></div>';
  } else {
    list.innerHTML = state.data.vehicles.map(function (v) {
      const isActive = active && v.id === active.id;
      const sub = [v.make, v.model, v.year].filter(Boolean).join(' · ');
      return '<div class="settings-row vh-row' + (isActive ? ' vh-row--active' : '') + '" data-action="edit-vehicle" data-id="' + v.id + '">' +
        '<div class="vh-info"><div class="vh-name">' + esc(v.name) + (isActive ? ' <span class="badge badge--ok">' + esc(t('active')) + '</span>' : '') + '</div>' +
        (sub ? '<div class="vh-meta">' + esc(sub) + (v.plate ? ' · ' + esc(v.plate) : '') + '</div>' : (v.plate ? '<div class="vh-meta">' + esc(v.plate) + '</div>' : '')) +
        '<div class="vh-meta">' + fmtKm(v.mileage) + '</div></div>' +
        (isActive ? '' : '<button type="button" class="btn btn--small" data-action="set-active-settings" data-id="' + v.id + '">' + esc(t('setActive')) + '</button>') +
        '</div>';
    }).join('');
  }

  byId('set-lang-hr').classList.toggle('btn--active', state.data.settings.lang !== 'en');
  byId('set-lang-en').classList.toggle('btn--active', state.data.settings.lang === 'en');
  const theme = state.data.settings.theme;
  byId('set-theme-auto').classList.toggle('btn--active', theme === 'auto');
  byId('set-theme-light').classList.toggle('btn--active', theme === 'light');
  byId('set-theme-dark').classList.toggle('btn--active', theme === 'dark');
  byId('set-version').textContent = 'v' + APP_VERSION + ' · ' + t('version');
}

function openVehicleOverlay(id) {
  state.editingId = id || null;
  byId('vehicle-title').textContent = id ? t('editVehicle') : t('newVehicle');
  byId('vh-delete').style.display = id ? '' : 'none';
  byId('vh-set-active').style.display = id ? '' : 'none';
  if (id) {
    const v = getVehicle(id);
    if (!v) return;
    byId('vh-name').value = v.name || '';
    byId('vh-make').value = v.make || '';
    byId('vh-model').value = v.model || '';
    byId('vh-year').value = v.year || '';
    byId('vh-plate').value = v.plate || '';
    byId('vh-mileage').value = v.mileage != null ? v.mileage : '';
    byId('vh-reg').value = v.regExpiry || '';
    byId('vh-tech').value = v.techExpiry || '';
    byId('vh-ins').value = v.insExpiry || '';
  } else {
    byId('vh-name').value = '';
    byId('vh-make').value = '';
    byId('vh-model').value = '';
    byId('vh-year').value = '';
    byId('vh-plate').value = '';
    byId('vh-mileage').value = '';
    byId('vh-reg').value = '';
    byId('vh-tech').value = '';
    byId('vh-ins').value = '';
  }
  openOverlay('overlay-vehicle');
}

function saveVehicle() {
  const name = byId('vh-name').value.trim();
  if (!name) { toast(t('nameRequired')); return; }
  const yearRaw = byId('vh-year').value;
  const rec = {
    id: state.editingId || uid(),
    name: name,
    make: byId('vh-make').value.trim(),
    model: byId('vh-model').value.trim(),
    year: yearRaw ? Number(yearRaw) : null,
    plate: byId('vh-plate').value.trim(),
    mileage: parseNum(byId('vh-mileage').value),
    regExpiry: byId('vh-reg').value || null,
    techExpiry: byId('vh-tech').value || null,
    insExpiry: byId('vh-ins').value || null
  };
  if (state.editingId) {
    const existing = getVehicle(state.editingId);
    rec.createdAt = existing ? existing.createdAt : new Date().toISOString();
    state.data.vehicles = state.data.vehicles.map(function (x) { return x.id === rec.id ? rec : x; });
  } else {
    rec.createdAt = new Date().toISOString();
    state.data.vehicles.push(rec);
    if (!state.data.activeVehicleId) state.data.activeVehicleId = rec.id;
  }
  saveData();
  closeOverlay('overlay-vehicle');
  renderCurrentView();
  toast(t('saved'));
}

async function deleteVehicle(id) {
  const recId = id || state.editingId;
  const ok = await confirmDialog({ title: t('delete'), text: t('confirmDeleteVehicle') });
  if (!ok) return;
  state.data.vehicles = state.data.vehicles.filter(function (x) { return x.id !== recId; });
  state.data.fuel = state.data.fuel.filter(function (x) { return x.vehicleId !== recId; });
  state.data.services = state.data.services.filter(function (x) { return x.vehicleId !== recId; });
  state.data.notes = state.data.notes.filter(function (x) { return x.vehicleId !== recId; });
  if (state.data.activeVehicleId === recId) state.data.activeVehicleId = null;
  ensureActiveVehicle();
  saveData();
  closeOverlay('overlay-vehicle');
  renderSettings();
  renderCurrentView();
  toast(t('deleted'));
}

function setActiveVehicle(id) {
  state.data.activeVehicleId = id;
  saveData();
  renderCurrentView();
}

// ==== EXPORT / IMPORT / RESET ====
function exportData() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'autoservis-' + todayISO() + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  toast(t('exportSuccess'));
}

async function importData(file) {
  const ok = await confirmDialog({ title: t('importData'), text: t('importConfirm'), okText: t('importData') });
  if (!ok) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const raw = JSON.parse(reader.result);
      if (!raw || typeof raw !== 'object' || (!Array.isArray(raw.vehicles) && !Array.isArray(raw.fuel) && !Array.isArray(raw.services))) {
        throw new Error('bad shape');
      }
      state.data = raw.version === 2 ? normalizeV2(raw) : migrateToV2(raw);
      ensureActiveVehicle();
      saveData();
      applyTheme();
      applyI18n();
      showView('home');
      toast(t('importSuccess'));
    } catch (e) {
      toast(t('importError'));
    }
  };
  reader.onerror = function () { toast(t('importError')); };
  reader.readAsText(file);
}

async function resetData() {
  const ok = await confirmDialog({ title: t('resetData'), text: t('confirmReset'), okText: t('delete') });
  if (!ok) return;
  state.data = defaultData();
  saveData();
  applyTheme();
  applyI18n();
  showView('home');
  toast(t('resetDone'));
}

// ==== UPDATE BANNER & VERSION ====
function checkVersion() {
  fetch('version.json', { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('version fetch failed'); return r.json(); })
    .then(function (json) {
      if (json && json.version && json.version !== APP_VERSION) {
        const banner = byId('update-banner');
        if (banner) banner.hidden = false;
      }
    })
    .catch(function () { /* offline — banner only on mismatch */ });
}

/* Manual check from Settings (btn-check-update). Cache-busting query bypasses
   the SW's cache-first strategy so a real remote version.json is always read. */
function checkForUpdate() {
  fetch('version.json?cb=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('version fetch failed'); return r.json(); })
    .then(function (json) {
      if (json && json.version && json.version !== APP_VERSION) {
        toast(t('updateAvailable', { version: json.version }));
        const banner = byId('update-banner');
        if (banner) banner.hidden = false;
      } else {
        toast(t('upToDate', { version: APP_VERSION }));
      }
    })
    .catch(function () { /* offline — no toast, matches auto check */ });
}

// ==== EVENTS ====
function bindEvents() {
  // Tabs
  byId('tab-home').addEventListener('click', function () { showView('home'); });
  byId('tab-fuel').addEventListener('click', function () { showView('fuel'); });
  byId('tab-services').addEventListener('click', function () { showView('services'); });
  byId('tab-costs').addEventListener('click', function () { showView('costs'); });
  byId('tab-settings').addEventListener('click', function () { showView('settings'); });

  // Notes (home scratchpad)
  byId('notes-add-btn').addEventListener('click', function () {
    const add = byId('notes-add');
    add.hidden = !add.hidden;
    if (!add.hidden) byId('notes-input').focus();
  });
  byId('notes-save').addEventListener('click', saveNote);
  byId('notes-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') saveNote();
  });

  // Quick-add + table "+" buttons
  byId('btn-quick-fuel').addEventListener('click', function () { openFuelOverlay(null); });
  byId('btn-quick-service').addEventListener('click', function () { openServiceOverlay(null); });
  byId('btn-add-fuel').addEventListener('click', function () { openFuelOverlay(null); });
  byId('btn-add-service').addEventListener('click', function () { openServiceOverlay(null); });

  // Fuel overlay
  byId('fl-liters').addEventListener('input', updateFuelTotal);
  byId('fl-price').addEventListener('input', updateFuelTotal);
  byId('fl-save').addEventListener('click', saveFuel);
  byId('fl-cancel').addEventListener('click', function () { closeOverlay('overlay-fuel'); });
  byId('fl-delete').addEventListener('click', function () { deleteFuel(null); });
  document.querySelector('#overlay-fuel .overlay__close').addEventListener('click', function () { closeOverlay('overlay-fuel'); });

  // Service overlay
  byId('sv-save').addEventListener('click', saveService);
  byId('sv-cancel').addEventListener('click', function () { closeOverlay('overlay-service'); });
  byId('sv-delete').addEventListener('click', function () { deleteService(null); });
  document.querySelector('#overlay-service .overlay__close').addEventListener('click', function () { closeOverlay('overlay-service'); });

  // Vehicle overlay
  byId('vh-save').addEventListener('click', saveVehicle);
  byId('vh-cancel').addEventListener('click', function () { closeOverlay('overlay-vehicle'); });
  byId('vh-delete').addEventListener('click', function () { deleteVehicle(null); });
  byId('vh-set-active').addEventListener('click', function () {
    if (state.editingId) {
      setActiveVehicle(state.editingId);
      closeOverlay('overlay-vehicle');
      toast(t('saved'));
    }
  });
  document.querySelector('#overlay-vehicle .overlay__close').addEventListener('click', function () { closeOverlay('overlay-vehicle'); });

  // Settings
  byId('btn-add-vehicle').addEventListener('click', function () { openVehicleOverlay(null); });
  byId('set-lang-hr').addEventListener('click', function () { setLang('hr'); });
  byId('set-lang-en').addEventListener('click', function () { setLang('en'); });
  byId('set-theme-auto').addEventListener('click', function () { setTheme('auto'); });
  byId('set-theme-light').addEventListener('click', function () { setTheme('light'); });
  byId('set-theme-dark').addEventListener('click', function () { setTheme('dark'); });
  byId('btn-export').addEventListener('click', exportData);
  byId('btn-import').addEventListener('change', function (e) {
    const file = e.target.files && e.target.files[0];
    if (file) importData(file);
    e.target.value = '';
  });
  byId('btn-reset').addEventListener('click', resetData);
  byId('btn-check-update').addEventListener('click', checkForUpdate);

  // Delegated clicks: chips, table rows, vehicle rows, home empty-state button
  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.getAttribute('data-action');
    const id = el.getAttribute('data-id');
    if (action === 'set-active') setActiveVehicle(id);
    else if (action === 'set-active-settings') { setActiveVehicle(id); toast(t('saved')); }
    else if (action === 'edit-fuel') openFuelOverlay(id);
    else if (action === 'edit-service') openServiceOverlay(id);
    else if (action === 'edit-vehicle') openVehicleOverlay(id);
    else if (action === 'add-vehicle') openVehicleOverlay(null);
    else if (action === 'delete-note') deleteNote(id);
  });

  // Update banner
  byId('update-reload').addEventListener('click', function () { location.reload(); });

  // Theme auto follows the OS
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = function () { if (state.data.settings.theme === 'auto') applyTheme(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // iOS overlay height fix
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fixOverlayHeight);
    window.visualViewport.addEventListener('scroll', fixOverlayHeight);
  }
}

// ==== INIT ====
function init() {
  loadData();
  ensureActiveVehicle();
  applyTheme();
  document.documentElement.lang = state.data.settings.lang;
  applyI18n();
  refreshSelectI18n();
  bindEvents();
  showView('home');
  if (state.pendingMigration) {
    state.pendingMigration = false;
    setTimeout(function () { toast(t('migrationToast')); }, 350);
  }
  checkVersion();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(function () { /* ignore */ });
  }
}

init();
