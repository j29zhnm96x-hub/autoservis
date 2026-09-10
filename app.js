/* ==========================================================================
   AutoServis — app.js
   All application logic for the AutoServis PWA (vanilla JS, no build step).
   Contract: docs/plan.md sections 4–12. DOM IDs follow section 4 verbatim.
   ========================================================================== */

'use strict';

// ==== CONFIG ====
const APP_VERSION = '0.0.1';
const STORAGE_KEY = 'autoservis_data';
const DB_NAME = 'autoservis_photos';
const DB_STORE = 'photos';
const DB_VERSION = 1;
const PHOTO_MAX_SIZE = 900;
const PHOTO_QUALITY = 0.8;

const SERVICE_TYPES = ['oil', 'brakes', 'tires', 'battery', 'inspection', 'other'];
const DEADLINE_TYPES = ['registration', 'insurance', 'technical', 'license', 'custom'];
const DOCUMENT_TYPES = ['registration', 'insurance', 'technical', 'license', 'other'];

// ==== I18N ====
const I18N = {
  hr: {
    appName: 'AutoServis',
    tabHome: 'Početna',
    tabServices: 'Servisi',
    tabFuel: 'Gorivo',
    tabDeadlines: 'Rokovi',
    tabMore: 'Više',
    menuVehicles: 'Vozila',
    menuCosts: 'Troškovi',
    menuDocuments: 'Dokumenti',
    menuSettings: 'Postavke',
    addService: 'Dodaj servis',
    addFuel: 'Dodaj gorivo',
    addDeadline: 'Dodaj rok',
    addVehicle: 'Dodaj vozilo',
    addDocument: 'Dodaj dokument',
    save: 'Spremi',
    cancel: 'Odustani',
    delete: 'Obriši',
    edit: 'Uredi',
    active: 'Aktivno',
    setActive: 'Postavi aktivno',
    noVehicles: 'Nema vozila',
    noData: 'Nema podataka',
    nextService: 'Sljedeći servis',
    noNextService: 'Nema zakazanog servisa',
    dueKm: 'za {km} km',
    dueDate: 'do {date}',
    overdue: 'Prekoračeno',
    daysLeft: '{days} dana',
    expired: 'Isteklo',
    today: 'Danas',
    lastService: 'Zadnji servis',
    avgConsumption: 'Prosječna potrošnja',
    totalCost: 'Ukupni troškovi',
    thisYear: 'Ove godine',
    thisMonth: 'Ovaj mjesec',
    totalAll: 'Ukupno sve',
    liters: 'Litara',
    price: 'Cijena',
    mileage: 'Kilometraža',
    date: 'Datum',
    cost: 'Trošak',
    notes: 'Bilješke',
    type: 'Tip',
    fullTank: 'Pun rezervoar',
    consumption: 'Potrošnja',
    serviceTypes: {
      oil: 'Ulje i filteri',
      brakes: 'Kočnice',
      tires: 'Gume',
      battery: 'Akumulator',
      inspection: 'Tehnički pregled',
      other: 'Drugo'
    },
    deadlineTypes: {
      registration: 'Registracija',
      insurance: 'Osiguranje',
      technical: 'Tehnički pregled',
      license: 'Vozačka dozvola',
      custom: 'Drugo'
    },
    documentTypes: {
      registration: 'Registracija',
      insurance: 'Osiguranje',
      technical: 'Tehnički pregled',
      license: 'Vozačka dozvola',
      other: 'Drugo'
    },
    language: 'Jezik',
    exportData: 'Izvezi podatke',
    importData: 'Uvezi podatke',
    resetData: 'Obriši sve podatke',
    confirmReset: 'Jeste li sigurni? Svi podaci bit će trajno obrisani.',
    confirmDelete: 'Jeste li sigurni da želite obrisati?',
    version: 'Verzija',
    newVersion: 'Nova verzija je dostupna',
    reload: 'Osvježi',
    photo: 'Fotografija',
    addPhoto: 'Dodaj fotografiju',
    removePhoto: 'Ukloni fotografiju',
    vehicles: 'Vozila',
    services: 'Servisi',
    fuel: 'Gorivo',
    deadlines: 'Rokovi',
    documents: 'Dokumenti',
    costs: 'Troškovi',
    settings: 'Postavke',
    km: 'km',
    lPer100: 'l/100km',
    currency: '€',
    name: 'Naziv',
    make: 'Marka',
    model: 'Model',
    year: 'Godina',
    plate: 'Registracija',
    vin: 'VIN',
    number: 'Broj',
    expiryDate: 'Datum isteka',
    remindKm: 'Podsjetnik (km)',
    remindMonths: 'Podsjetnik (mjeseci)',
    pricePerLiter: 'Cijena po litri',
    totalLiters: 'Ukupno litara',
    newService: 'Novi servis',
    newFuel: 'Novo gorivo',
    newDeadline: 'Novi rok',
    newVehicle: 'Novo vozilo',
    newDocument: 'Novi dokument',
    editService: 'Uredi servis',
    editFuel: 'Uredi gorivo',
    editDeadline: 'Uredi rok',
    editVehicle: 'Uredi vozilo',
    editDocument: 'Uredi dokument',
    confirmDeleteService: 'Obrisati ovaj servis?',
    confirmDeleteFuel: 'Obrisati ovaj unos goriva?',
    confirmDeleteDeadline: 'Obrisati ovaj rok?',
    confirmDeleteVehicle: 'Obrisati ovo vozilo? Svi njegovi podaci bit će obrisani.',
    confirmDeleteDocument: 'Obrisati ovaj dokument?',
    saved: 'Spremljeno',
    deleted: 'Obrisano',
    activeSet: 'Aktivno vozilo postavljeno',
    exportSuccess: 'Podaci izvezeni',
    importSuccess: 'Podaci uvezeni',
    importError: 'Neispravna datoteka',
    importConfirm: 'Uvoz će zamijeniti sve postojeće podatke. Nastaviti?',
    resetDone: 'Svi podaci obrisani',
    saveError: 'Greška pri spremanju',
    nameRequired: 'Unesite naziv',
    litersRequired: 'Unesite litre',
    dateRequired: 'Unesite datum',
    costBreakdown: 'Pregled po kategorijama',
    fuelCost: 'Gorivo',
    serviceCost: 'Servisi',
    deadlineCost: 'Rokovi',
    chart: 'Grafikon',
    noVehiclesYet: 'Još nema vozila',
    addFirstVehicle: 'Dodaj prvo vozilo',
    noActiveVehicle: 'Nema aktivnog vozila',
    selectVehicle: 'Odaberi vozilo',
    noServices: 'Nema servisa',
    noFuel: 'Nema unosa goriva',
    noDeadlines: 'Nema rokova',
    noDocuments: 'Nema dokumenata',
    noCosts: 'Nema troškova',
    close: 'Zatvori',
    photoAdded: 'Fotografija dodana',
    photoRemoved: 'Fotografija uklonjena',
    noPhoto: 'Nema fotografije',
    monthNames: ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
  },
  en: {
    appName: 'AutoServis',
    tabHome: 'Home',
    tabServices: 'Services',
    tabFuel: 'Fuel',
    tabDeadlines: 'Deadlines',
    tabMore: 'More',
    menuVehicles: 'Vehicles',
    menuCosts: 'Costs',
    menuDocuments: 'Documents',
    menuSettings: 'Settings',
    addService: 'Add service',
    addFuel: 'Add fuel',
    addDeadline: 'Add deadline',
    addVehicle: 'Add vehicle',
    addDocument: 'Add document',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    active: 'Active',
    setActive: 'Set active',
    noVehicles: 'No vehicles',
    noData: 'No data',
    nextService: 'Next service',
    noNextService: 'No upcoming service',
    dueKm: 'in {km} km',
    dueDate: 'by {date}',
    overdue: 'Overdue',
    daysLeft: '{days} days',
    expired: 'Expired',
    today: 'Today',
    lastService: 'Last service',
    avgConsumption: 'Avg consumption',
    totalCost: 'Total cost',
    thisYear: 'This year',
    thisMonth: 'This month',
    totalAll: 'All time',
    liters: 'Liters',
    price: 'Price',
    mileage: 'Mileage',
    date: 'Date',
    cost: 'Cost',
    notes: 'Notes',
    type: 'Type',
    fullTank: 'Full tank',
    consumption: 'Consumption',
    serviceTypes: {
      oil: 'Oil & filters',
      brakes: 'Brakes',
      tires: 'Tires',
      battery: 'Battery',
      inspection: 'Inspection',
      other: 'Other'
    },
    deadlineTypes: {
      registration: 'Registration',
      insurance: 'Insurance',
      technical: 'Inspection',
      license: 'Driving license',
      custom: 'Other'
    },
    documentTypes: {
      registration: 'Registration',
      insurance: 'Insurance',
      technical: 'Inspection',
      license: 'Driving license',
      other: 'Other'
    },
    language: 'Language',
    exportData: 'Export data',
    importData: 'Import data',
    resetData: 'Delete all data',
    confirmReset: 'Are you sure? All data will be permanently deleted.',
    confirmDelete: 'Are you sure you want to delete?',
    version: 'Version',
    newVersion: 'A new version is available',
    reload: 'Reload',
    photo: 'Photo',
    addPhoto: 'Add photo',
    removePhoto: 'Remove photo',
    vehicles: 'Vehicles',
    services: 'Services',
    fuel: 'Fuel',
    deadlines: 'Deadlines',
    documents: 'Documents',
    costs: 'Costs',
    settings: 'Settings',
    km: 'km',
    lPer100: 'l/100km',
    currency: '€',
    name: 'Name',
    make: 'Make',
    model: 'Model',
    year: 'Year',
    plate: 'Plate',
    vin: 'VIN',
    number: 'Number',
    expiryDate: 'Expiry date',
    remindKm: 'Reminder (km)',
    remindMonths: 'Reminder (months)',
    pricePerLiter: 'Price per liter',
    totalLiters: 'Total liters',
    newService: 'New service',
    newFuel: 'New fuel entry',
    newDeadline: 'New deadline',
    newVehicle: 'New vehicle',
    newDocument: 'New document',
    editService: 'Edit service',
    editFuel: 'Edit fuel entry',
    editDeadline: 'Edit deadline',
    editVehicle: 'Edit vehicle',
    editDocument: 'Edit document',
    confirmDeleteService: 'Delete this service?',
    confirmDeleteFuel: 'Delete this fuel entry?',
    confirmDeleteDeadline: 'Delete this deadline?',
    confirmDeleteVehicle: 'Delete this vehicle? All of its data will be deleted.',
    confirmDeleteDocument: 'Delete this document?',
    saved: 'Saved',
    deleted: 'Deleted',
    activeSet: 'Active vehicle set',
    exportSuccess: 'Data exported',
    importSuccess: 'Data imported',
    importError: 'Invalid file',
    importConfirm: 'Import will replace all existing data. Continue?',
    resetDone: 'All data deleted',
    saveError: 'Save error',
    nameRequired: 'Enter a name',
    litersRequired: 'Enter liters',
    dateRequired: 'Enter a date',
    costBreakdown: 'Breakdown by category',
    fuelCost: 'Fuel',
    serviceCost: 'Services',
    deadlineCost: 'Deadlines',
    chart: 'Chart',
    noVehiclesYet: 'No vehicles yet',
    addFirstVehicle: 'Add your first vehicle',
    noActiveVehicle: 'No active vehicle',
    selectVehicle: 'Select a vehicle',
    noServices: 'No services',
    noFuel: 'No fuel entries',
    noDeadlines: 'No deadlines',
    noDocuments: 'No documents',
    noCosts: 'No costs',
    close: 'Close',
    photoAdded: 'Photo added',
    photoRemoved: 'Photo removed',
    noPhoto: 'No photo',
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
};

// ==== STATE ====
const state = {
  data: null,          // autoservis_data object (localStorage)
  db: null,            // IndexedDB handle for photos
  currentView: 'home',
  editingId: null,     // id of record being edited in an overlay (null = add mode)
  pendingPhoto: null,  // dataURL of photo selected in document overlay
  pendingPhotoId: null // photoId that will be stored on the document
};

// ==== UTILS ====
function byId(id) {
  return document.getElementById(id);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function t(key, vars) {
  const lang = (state.data && state.data.settings && state.data.settings.lang) || 'hr';
  const lookup = function (dict) {
    return key.split('.').reduce(function (o, p) {
      return o == null ? undefined : o[p];
    }, dict);
  };
  let val = lookup(I18N[lang]);
  if (val == null) val = lookup(I18N.en);
  if (val == null) val = key;
  if (typeof val === 'string' && vars) {
    val = val.replace(/\{(\w+)\}/g, function (m, k) {
      return vars[k] != null ? vars[k] : m;
    });
  }
  return val;
}

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

function addMonths(iso, months) {
  const d = parseDate(iso);
  if (!d) return iso;
  d.setMonth(d.getMonth() + months);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = parseDate(iso);
  if (!d) return iso;
  const locale = state.data.settings.lang === 'hr' ? 'hr-HR' : 'en-GB';
  return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtNum(n, decimals) {
  const num = Number(n) || 0;
  const locale = state.data.settings.lang === 'hr' ? 'hr-HR' : 'en-GB';
  return num.toLocaleString(locale, { maximumFractionDigits: decimals == null ? 2 : decimals });
}

function fmtKm(n) {
  return fmtNum(Math.round(Number(n) || 0), 0) + ' ' + t('km');
}

function fmtMoney(n) {
  const num = Number(n) || 0;
  const locale = state.data.settings.lang === 'hr' ? 'hr-HR' : 'en-GB';
  return num.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + t('currency');
}

function statLabel(label, value) {
  return '<span class="stat-label">' + escapeHtml(label) + '</span><span class="stat-value">' + value + '</span>';
}

// ==== STORAGE ====
function defaultData() {
  return {
    version: 1,
    settings: { lang: 'hr' },
    activeVehicleId: null,
    vehicles: [],
    services: [],
    deadlines: [],
    fuel: [],
    documents: []
  };
}

function normalizeData(raw) {
  const d = defaultData();
  if (!raw || typeof raw !== 'object') return d;
  d.settings = { lang: raw.settings && raw.settings.lang === 'en' ? 'en' : 'hr' };
  d.activeVehicleId = typeof raw.activeVehicleId === 'string' ? raw.activeVehicleId : null;
  ['vehicles', 'services', 'deadlines', 'fuel', 'documents'].forEach(function (k) {
    d[k] = Array.isArray(raw[k]) ? raw[k] : [];
  });
  return d;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.data = raw ? normalizeData(JSON.parse(raw)) : defaultData();
  } catch (err) {
    state.data = defaultData();
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
  } catch (err) {
    toast(t('saveError'));
  }
}

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
  if (!state.data.vehicles.length) {
    state.data.activeVehicleId = null;
    return;
  }
  const hasActive = state.data.vehicles.some(function (v) { return v.id === state.data.activeVehicleId; });
  if (!hasActive) {
    state.data.activeVehicleId = state.data.vehicles[0].id;
    saveData();
  }
}

function requireActiveVehicle() {
  const v = getActiveVehicle();
  if (!v) toast(t('noActiveVehicle'));
  return v;
}

// ==== PHOTOS (IndexedDB) ====
function openDB() {
  return new Promise(function (resolve, reject) {
    if (!('indexedDB' in window)) { resolve(null); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function () {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
    };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
}

function idbPut(db, key, value) {
  return new Promise(function (resolve, reject) {
    if (!db) { resolve(); return; }
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = function () { reject(tx.error); };
  });
}

function idbGet(db, key) {
  return new Promise(function (resolve, reject) {
    if (!db) { resolve(null); return; }
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(key);
    req.onsuccess = function () { resolve(req.result || null); };
    req.onerror = function () { reject(req.error); };
  });
}

function idbDelete(db, key) {
  return new Promise(function (resolve, reject) {
    if (!db) { resolve(); return; }
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = function () { reject(tx.error); };
  });
}

function idbClear(db) {
  return new Promise(function (resolve, reject) {
    if (!db) { resolve(); return; }
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).clear();
    tx.oncomplete = resolve;
    tx.onerror = function () { reject(tx.error); };
  });
}

function putPhoto(photoId, dataUrl) {
  return idbPut(state.db, photoId, dataUrl);
}

function getPhoto(photoId) {
  return idbGet(state.db, photoId);
}

function deletePhoto(photoId) {
  return idbDelete(state.db, photoId);
}

function clearPhotos() {
  return idbClear(state.db);
}

function compressImage(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        const scale = Math.min(1, PHOTO_MAX_SIZE / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', PHOTO_QUALITY));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==== TOAST ====
let toastTimer = null;

function toast(message) {
  const el = byId('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('toast--show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    el.classList.remove('toast--show');
  }, 2500);
}

// ==== CONFIRM DIALOG ====
function confirmDialog(opts) {
  return new Promise(function (resolve) {
    const dlg = byId('confirm-dialog');
    if (!dlg) { resolve(false); return; }
    dlg.innerHTML =
      '<div class="confirm-backdrop"></div>' +
      '<div class="confirm-panel" role="dialog" aria-modal="true">' +
        '<div class="confirm-title">' + escapeHtml(opts.title || t('confirmDelete')) + '</div>' +
        '<div class="confirm-text">' + escapeHtml(opts.text || '') + '</div>' +
        '<div class="confirm-actions">' +
          '<button type="button" class="btn" data-confirm="cancel">' + escapeHtml(opts.cancelText || t('cancel')) + '</button>' +
          '<button type="button" class="btn btn--danger" data-confirm="ok">' + escapeHtml(opts.okText || t('delete')) + '</button>' +
        '</div>' +
      '</div>';
    dlg.classList.add('confirm-dialog--open');
    const done = function (val) {
      dlg.classList.remove('confirm-dialog--open');
      dlg.innerHTML = '';
      resolve(val);
    };
    const okBtn = dlg.querySelector('[data-confirm="ok"]');
    const cancelBtn = dlg.querySelector('[data-confirm="cancel"]');
    const backdrop = dlg.querySelector('.confirm-backdrop');
    if (okBtn) okBtn.addEventListener('click', function () { done(true); });
    if (cancelBtn) cancelBtn.addEventListener('click', function () { done(false); });
    if (backdrop) backdrop.addEventListener('click', function () { done(false); });
  });
}

// ==== UPDATE BANNER ====
function showUpdateBanner() {
  const banner = byId('update-banner');
  if (!banner) return;
  banner.innerHTML =
    '<span class="update-banner-text">' + escapeHtml(t('newVersion')) + '</span>' +
    '<button type="button" class="btn btn--small" id="update-banner-reload">' + escapeHtml(t('reload')) + '</button>';
  banner.classList.add('update-banner--show');
  const btn = byId('update-banner-reload');
  if (btn) btn.addEventListener('click', function () { location.reload(); });
}

function hideUpdateBanner() {
  const banner = byId('update-banner');
  if (!banner) return;
  banner.classList.remove('update-banner--show');
}

// ==== VERSION CHECK ====
function checkVersion() {
  fetch('version.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('version fetch failed');
      return r.json();
    })
    .then(function (json) {
      if (json && json.version && json.version !== APP_VERSION) showUpdateBanner();
    })
    .catch(function () {
      // offline or missing file — ignore, banner only shows on mismatch
    });
}

// ==== ROUTER ====
const VIEW_RENDERERS = {
  home: renderHome,
  services: renderServices,
  fuel: renderFuel,
  deadlines: renderDeadlines,
  more: renderMore,
  vehicles: renderVehicles,
  costs: renderCosts,
  documents: renderDocuments,
  settings: renderSettings
};

const VIEW_MAP = {
  home: 'view-home',
  services: 'view-services',
  fuel: 'view-fuel',
  deadlines: 'view-deadlines',
  more: 'view-more',
  vehicles: 'view-vehicles',
  costs: 'view-costs',
  documents: 'view-documents',
  settings: 'view-settings'
};

const TAB_MAP = {
  home: 'tab-home',
  services: 'tab-services',
  fuel: 'tab-fuel',
  deadlines: 'tab-deadlines',
  more: 'tab-more'
};

function showView(id) {
  state.currentView = id;
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('view--active'); });
  const view = byId(VIEW_MAP[id]);
  if (view) view.classList.add('view--active');

  document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('tab--active'); });
  const tabId = TAB_MAP[id];
  const tab = byId(tabId || 'tab-more');
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
  document.querySelectorAll('.overlay').forEach(function (el) {
    el.style.height = vh + 'px';
  });
}

function openOverlay(id) {
  const el = byId(id);
  if (!el) return;
  el.classList.add('overlay--open');
  fixOverlayHeight();
  document.body.classList.add('body--overlay');
}

function closeOverlay(id) {
  const el = byId(id);
  if (!el) return;
  el.classList.remove('overlay--open');
  if (!document.querySelector('.overlay--open')) document.body.classList.remove('body--overlay');
}

function populateSelect(select, values, labelKey, selected) {
  if (!select) return;
  select.innerHTML = values.map(function (v) {
    return '<option value="' + v + '">' + escapeHtml(t(labelKey + '.' + v)) + '</option>';
  }).join('');
  if (selected) select.value = selected;
}

// ==== REMINDERS & COUNTDOWN ====
function deadlineStatus(expiryDate) {
  const days = daysBetween(todayISO(), expiryDate);
  if (days < 0) return { cls: 'danger', label: t('expired') };
  if (days === 0) return { cls: 'danger', label: t('today') };
  if (days < 7) return { cls: 'danger', label: t('daysLeft', { days: days }) };
  if (days <= 30) return { cls: 'warn', label: t('daysLeft', { days: days }) };
  return { cls: 'ok', label: t('daysLeft', { days: days }) };
}

function isServiceDue(service, vehicle) {
  if (service.remindKm && (service.mileage + service.remindKm) <= vehicle.mileage) return true;
  if (service.remindMonths && daysBetween(todayISO(), addMonths(service.date, service.remindMonths)) <= 0) return true;
  return false;
}

// Earliest upcoming reminder across services of the active vehicle.
// km and date reminders are compared on a normalized scale (1000 km ~ 30 days).
function getNextService(vehicle) {
  let best = null;
  filterByVehicle(state.data.services).forEach(function (s) {
    if (!s.remindKm && !s.remindMonths) return;
    const nextKm = s.remindKm ? s.mileage + s.remindKm : null;
    const nextDate = s.remindMonths ? addMonths(s.date, s.remindMonths) : null;
    const kmRemaining = nextKm != null ? nextKm - vehicle.mileage : null;
    const daysRemaining = nextDate != null ? daysBetween(todayISO(), nextDate) : null;
    let metric = null;
    let value = null;
    let score = null;
    if (kmRemaining != null && daysRemaining != null) {
      const kmScore = kmRemaining / 1000;
      const dateScore = daysRemaining / 30;
      score = Math.min(kmScore, dateScore);
      metric = kmScore <= dateScore ? 'km' : 'date';
      value = metric === 'km' ? kmRemaining : daysRemaining;
    } else if (kmRemaining != null) {
      metric = 'km';
      value = kmRemaining;
      score = kmRemaining / 1000;
    } else if (daysRemaining != null) {
      metric = 'date';
      value = daysRemaining;
      score = daysRemaining / 30;
    }
    if (metric == null) return;
    if (!best || score < best.score) {
      best = { service: s, metric: metric, value: value, nextKm: nextKm, nextDate: nextDate, score: score };
    }
  });
  return best;
}

// ==== FUEL CONSUMPTION ====
// Consumption for a fill-up = liters / (mileage − prevFillupMileage) * 100,
// only when `full` is checked and a previous entry exists.
function computeConsumptions(fuelEntries) {
  const sorted = fuelEntries.slice().sort(function (a, b) {
    const da = (a.date || '') + String(a.mileage || 0).padStart(10, '0');
    const db = (b.date || '') + String(b.mileage || 0).padStart(10, '0');
    return da.localeCompare(db);
  });
  const map = new Map();
  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];
    if (!cur.full) continue;
    const prev = sorted[i - 1];
    if (!prev) continue;
    const delta = (cur.mileage || 0) - (prev.mileage || 0);
    if (delta <= 0) continue;
    map.set(cur.id, ((cur.liters || 0) / delta) * 100);
  }
  return map;
}

// ==== COSTS ====
function getCostEntries() {
  const entries = [];
  filterByVehicle(state.data.services).forEach(function (s) {
    entries.push({ date: s.date, cost: s.cost || 0, category: 'service', type: s.type });
  });
  filterByVehicle(state.data.fuel).forEach(function (f) {
    entries.push({ date: f.date, cost: (f.liters || 0) * (f.pricePerLiter || 0), category: 'fuel', type: 'fuel' });
  });
  filterByVehicle(state.data.deadlines).forEach(function (d) {
    entries.push({ date: d.expiryDate, cost: d.cost || 0, category: 'deadline', type: d.type });
  });
  return entries;
}

function sumCosts(entries) {
  return entries.reduce(function (sum, e) { return sum + (e.cost || 0); }, 0);
}

function renderCostsChart(entries) {
  const container = byId('costs-chart');
  if (!container) return;
  const now = new Date();
  const year = now.getFullYear();
  const monthly = new Array(12).fill(0);
  entries.forEach(function (e) {
    const d = parseDate(e.date);
    if (d && d.getFullYear() === year) monthly[d.getMonth()] += e.cost || 0;
  });
  const hasData = monthly.some(function (v) { return v > 0; });
  if (!hasData) {
    container.innerHTML = '<div class="empty">' + t('noCosts') + '</div>';
    return;
  }
  const max = Math.max.apply(null, monthly.concat([1]));
  const W = 320;
  const H = 150;
  const padL = 10;
  const padR = 10;
  const padT = 12;
  const padB = 24;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const barW = plotW / 12;
  let bars = '';
  monthly.forEach(function (v, i) {
    const h = v > 0 ? Math.max(2, (v / max) * plotH) : 0;
    const x = padL + i * barW + barW * 0.18;
    const w = barW * 0.64;
    const y = padT + plotH - h;
    bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="2" class="chart-bar' + (v > 0 ? '' : ' chart-bar--empty') + '"></rect>';
    bars += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" class="chart-label">' + escapeHtml(t('monthNames')[i]) + '</text>';
  });
  container.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="costs-chart-svg" role="img" aria-label="' + escapeHtml(t('chart')) + '">' + bars + '</svg>';
}

function renderCostsBreakdown(entries) {
  const container = byId('costs-breakdown');
  if (!container) return;
  const groups = new Map();
  entries.forEach(function (e) {
    let label;
    if (e.category === 'fuel') label = t('fuelCost');
    else if (e.category === 'service') label = t('serviceTypes.' + e.type);
    else label = t('deadlineTypes.' + e.type);
    const key = e.category + ':' + e.type;
    const existing = groups.get(key);
    groups.set(key, { label: label, total: (existing ? existing.total : 0) + (e.cost || 0) });
  });
  const sorted = Array.from(groups.values()).sort(function (a, b) { return b.total - a.total; });
  if (!sorted.length) {
    container.innerHTML = '<div class="empty">' + t('noCosts') + '</div>';
    return;
  }
  container.innerHTML = sorted.map(function (g) {
    return '<div class="bd-row"><span class="bd-label">' + escapeHtml(g.label) + '</span><span class="bd-value">' + fmtMoney(g.total) + '</span></div>';
  }).join('');
}

// ==== VIEW: HOME ====
function renderHome() {
  const row = byId('home-vehicle-row');
  const card = byId('home-vehicle-card');
  const next = byId('home-next-service');
  const deadlines = byId('home-deadlines');
  const statLast = byId('home-stat-last-service');
  const statCons = byId('home-stat-consumption');
  const statCost = byId('home-stat-cost');

  const vehicles = state.data.vehicles;
  if (!vehicles.length) {
    if (row) row.innerHTML = '';
    if (card) card.innerHTML = '<div class="empty-state"><p>' + t('noVehicles') + '</p><button type="button" class="btn" data-action="add-vehicle">' + t('addVehicle') + '</button></div>';
    if (next) next.innerHTML = '';
    if (deadlines) deadlines.innerHTML = '';
    if (statLast) statLast.innerHTML = statLabel(t('lastService'), '—');
    if (statCons) statCons.innerHTML = statLabel(t('avgConsumption'), '—');
    if (statCost) statCost.innerHTML = statLabel(t('totalCost'), '—');
    return;
  }

  const active = getActiveVehicle();
  if (!active) return;

  if (row) {
    row.innerHTML = vehicles.map(function (v) {
      return '<button type="button" class="chip' + (v.id === active.id ? ' chip--active' : '') + '" data-action="set-active" data-id="' + v.id + '">' + escapeHtml(v.name) + '</button>';
    }).join('');
  }

  if (card) {
    card.innerHTML =
      '<div class="vc-name">' + escapeHtml(active.name) + '</div>' +
      (active.plate ? '<div class="vc-plate">' + escapeHtml(active.plate) + '</div>' : '') +
      '<div class="vc-mileage">' + fmtKm(active.mileage) + '</div>';
  }

  if (next) {
    const ns = getNextService(active);
    if (ns) {
      const overdue = ns.value <= 0;
      const typeLabel = t('serviceTypes.' + ns.service.type);
      const title = overdue ? t('overdue') : t('nextService');
      let detail;
      let days;
      if (ns.metric === 'km') {
        detail = typeLabel + ' — ' + t('dueKm', { km: fmtNum(Math.max(0, Math.round(ns.value)), 0) });
        days = fmtKm(Math.max(0, Math.round(ns.value)));
      } else {
        detail = typeLabel + ' — ' + t('dueDate', { date: fmtDate(ns.nextDate) });
        days = ns.value <= 0 ? t('expired') : t('daysLeft', { days: ns.value });
      }
      next.innerHTML =
        '<div class="ns-title">' + title + '</div>' +
        '<div class="ns-detail">' + detail + '</div>' +
        '<div class="ns-days">' + days + '</div>';
    } else {
      next.innerHTML = '<div class="ns-title">' + t('nextService') + '</div><div class="ns-detail">' + t('noNextService') + '</div>';
    }
  }

  if (deadlines) {
    const dls = filterByVehicle(state.data.deadlines).slice().sort(function (a, b) {
      return (a.expiryDate || '').localeCompare(b.expiryDate || '');
    });
    if (dls.length) {
      deadlines.innerHTML = dls.map(function (d) {
        const st = deadlineStatus(d.expiryDate);
        const label = d.type === 'custom' && d.label ? d.label : t('deadlineTypes.' + d.type);
        return '<button type="button" class="chip chip--' + st.cls + '" data-action="goto-deadlines">' + escapeHtml(label) + ' · ' + st.label + '</button>';
      }).join('');
    } else {
      deadlines.innerHTML = '<div class="empty-inline">' + t('noDeadlines') + '</div>';
    }
  }

  const services = filterByVehicle(state.data.services).slice().sort(function (a, b) {
    return (b.date || '').localeCompare(a.date || '');
  });
  const lastService = services[0];
  if (statLast) statLast.innerHTML = statLabel(t('lastService'), lastService ? fmtDate(lastService.date) : '—');

  const consumptions = computeConsumptions(filterByVehicle(state.data.fuel));
  const avg = consumptions.size ? Array.from(consumptions.values()).reduce(function (a, b) { return a + b; }, 0) / consumptions.size : null;
  if (statCons) statCons.innerHTML = statLabel(t('avgConsumption'), avg != null ? avg.toFixed(1) + ' ' + t('lPer100') : '—');

  if (statCost) statCost.innerHTML = statLabel(t('totalCost'), fmtMoney(sumCosts(getCostEntries())));
}

// ==== VIEW: SERVICES ====
function renderServices() {
  const container = byId('services-list');
  if (!container) return;
  if (!state.data.vehicles.length) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noVehicles') + '</p><button type="button" class="btn" data-action="add-vehicle">' + t('addVehicle') + '</button></div>';
    return;
  }
  const vehicle = getActiveVehicle();
  if (!vehicle) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noActiveVehicle') + '</p></div>';
    return;
  }
  const list = filterByVehicle(state.data.services).slice().sort(function (a, b) {
    return (b.date || '').localeCompare(a.date || '');
  });
  if (!list.length) {
    container.innerHTML = '<div class="empty">' + t('noServices') + '</div>';
    return;
  }
  container.innerHTML = list.map(function (s) {
    const due = isServiceDue(s, vehicle);
    let reminder = '';
    if (s.remindKm) {
      const remaining = (s.mileage + s.remindKm) - vehicle.mileage;
      reminder = '<div class="sv-item-reminder">' + t('dueKm', { km: fmtNum(Math.max(0, remaining), 0) }) + '</div>';
    }
    if (s.remindMonths) {
      reminder += '<div class="sv-item-reminder">' + t('dueDate', { date: fmtDate(addMonths(s.date, s.remindMonths)) }) + '</div>';
    }
    return '<div class="card sv-item">' +
      '<div class="sv-item-head">' +
        '<span class="sv-item-type">' + escapeHtml(t('serviceTypes.' + s.type)) + '</span>' +
        (due ? '<span class="badge badge--due">' + t('overdue') + '</span>' : '') +
      '</div>' +
      '<div class="sv-item-meta">' + fmtDate(s.date) + ' · ' + fmtKm(s.mileage) + '</div>' +
      (s.cost ? '<div class="sv-item-cost">' + fmtMoney(s.cost) + '</div>' : '') +
      (s.notes ? '<div class="sv-item-notes">' + escapeHtml(s.notes) + '</div>' : '') +
      reminder +
      '<div class="item-actions">' +
        '<button type="button" class="btn btn--ghost" data-action="edit" data-id="' + s.id + '">' + t('edit') + '</button>' +
        '<button type="button" class="btn btn--ghost btn--danger-text" data-action="delete" data-id="' + s.id + '">' + t('delete') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openServiceOverlay(id) {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  state.editingId = id || null;
  const title = byId('overlay-service-title');
  const del = byId('sv-delete');
  const typeSel = byId('sv-type');
  const dateIn = byId('sv-date');
  const mileageIn = byId('sv-mileage');
  const costIn = byId('sv-cost');
  const notesIn = byId('sv-notes');
  const remindKmIn = byId('sv-remind-km');
  const remindMonthsIn = byId('sv-remind-months');
  if (title) title.textContent = id ? t('editService') : t('newService');
  if (del) del.style.display = id ? '' : 'none';
  if (typeSel) populateSelect(typeSel, SERVICE_TYPES, 'serviceTypes', null);
  if (id) {
    const s = state.data.services.find(function (x) { return x.id === id; });
    if (!s) return;
    if (typeSel) typeSel.value = s.type;
    if (dateIn) dateIn.value = s.date || '';
    if (mileageIn) mileageIn.value = s.mileage != null ? s.mileage : '';
    if (costIn) costIn.value = s.cost != null ? s.cost : '';
    if (notesIn) notesIn.value = s.notes || '';
    if (remindKmIn) remindKmIn.value = s.remindKm != null ? s.remindKm : '';
    if (remindMonthsIn) remindMonthsIn.value = s.remindMonths != null ? s.remindMonths : '';
  } else {
    if (typeSel) typeSel.value = SERVICE_TYPES[0];
    if (dateIn) dateIn.value = todayISO();
    if (mileageIn) mileageIn.value = vehicle.mileage != null ? vehicle.mileage : '';
    if (costIn) costIn.value = '';
    if (notesIn) notesIn.value = '';
    if (remindKmIn) remindKmIn.value = '';
    if (remindMonthsIn) remindMonthsIn.value = '';
  }
  openOverlay('overlay-service');
}

function saveService() {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  const type = byId('sv-type') ? byId('sv-type').value : SERVICE_TYPES[0];
  const date = byId('sv-date') ? byId('sv-date').value : todayISO();
  const mileage = byId('sv-mileage') ? parseNum(byId('sv-mileage').value) : 0;
  const cost = byId('sv-cost') ? parseNum(byId('sv-cost').value) : 0;
  const notes = byId('sv-notes') ? byId('sv-notes').value.trim() : '';
  const remindKm = byId('sv-remind-km') ? parseNum(byId('sv-remind-km').value) : 0;
  const remindMonths = byId('sv-remind-months') ? parseNum(byId('sv-remind-months').value) : 0;
  const existing = state.editingId ? state.data.services.find(function (x) { return x.id === state.editingId; }) : null;
  const rec = {
    id: state.editingId || uid(),
    vehicleId: vehicle.id,
    type: type,
    date: date || todayISO(),
    mileage: mileage,
    cost: cost,
    notes: notes,
    remindKm: remindKm > 0 ? remindKm : null,
    remindMonths: remindMonths > 0 ? remindMonths : null,
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };
  if (existing) {
    state.data.services = state.data.services.map(function (x) { return x.id === rec.id ? rec : x; });
  } else {
    state.data.services.push(rec);
  }
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

// ==== VIEW: FUEL ====
function renderFuel() {
  const container = byId('fuel-list');
  const statAvg = byId('fuel-stat-avg');
  const statTotal = byId('fuel-stat-total');
  const statLiters = byId('fuel-stat-liters');
  if (!container) return;
  if (!state.data.vehicles.length) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noVehicles') + '</p><button type="button" class="btn" data-action="add-vehicle">' + t('addVehicle') + '</button></div>';
    if (statAvg) statAvg.innerHTML = statLabel(t('avgConsumption'), '—');
    if (statTotal) statTotal.innerHTML = statLabel(t('totalCost'), fmtMoney(0));
    if (statLiters) statLiters.innerHTML = statLabel(t('totalLiters'), '0 L');
    return;
  }
  const vehicle = getActiveVehicle();
  if (!vehicle) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noActiveVehicle') + '</p></div>';
    return;
  }
  const all = filterByVehicle(state.data.fuel);
  const consumptions = computeConsumptions(all);
  const avg = consumptions.size ? Array.from(consumptions.values()).reduce(function (a, b) { return a + b; }, 0) / consumptions.size : null;
  const totalLiters = all.reduce(function (sum, f) { return sum + (f.liters || 0); }, 0);
  const totalCost = all.reduce(function (sum, f) { return sum + (f.liters || 0) * (f.pricePerLiter || 0); }, 0);
  if (statAvg) statAvg.innerHTML = statLabel(t('avgConsumption'), avg != null ? avg.toFixed(1) + ' ' + t('lPer100') : '—');
  if (statTotal) statTotal.innerHTML = statLabel(t('totalCost'), fmtMoney(totalCost));
  if (statLiters) statLiters.innerHTML = statLabel(t('totalLiters'), fmtNum(totalLiters, 1) + ' L');

  const list = all.slice().sort(function (a, b) {
    return (b.date || '').localeCompare(a.date || '');
  });
  if (!list.length) {
    container.innerHTML = '<div class="empty">' + t('noFuel') + '</div>';
    return;
  }
  container.innerHTML = list.map(function (f) {
    const cons = consumptions.get(f.id);
    return '<div class="card fl-item">' +
      '<div class="fl-item-head">' +
        '<span>' + fmtDate(f.date) + '</span>' +
        (f.full ? '<span class="badge badge--ok">' + t('fullTank') + '</span>' : '') +
      '</div>' +
      '<div class="fl-item-meta">' + fmtKm(f.mileage) + '</div>' +
      '<div class="fl-item-detail">' + fmtNum(f.liters, 2) + ' L · ' + fmtNum(f.pricePerLiter, 2) + ' ' + t('currency') + '/L · ' + fmtMoney((f.liters || 0) * (f.pricePerLiter || 0)) + '</div>' +
      (cons != null ? '<div class="fl-item-cons">' + t('consumption') + ': ' + cons.toFixed(1) + ' ' + t('lPer100') + '</div>' : '') +
      '<div class="item-actions">' +
        '<button type="button" class="btn btn--ghost" data-action="edit" data-id="' + f.id + '">' + t('edit') + '</button>' +
        '<button type="button" class="btn btn--ghost btn--danger-text" data-action="delete" data-id="' + f.id + '">' + t('delete') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openFuelOverlay(id) {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  state.editingId = id || null;
  const title = byId('overlay-fuel-title');
  const del = byId('fl-delete');
  if (title) title.textContent = id ? t('editFuel') : t('newFuel');
  if (del) del.style.display = id ? '' : 'none';
  if (id) {
    const f = state.data.fuel.find(function (x) { return x.id === id; });
    if (!f) return;
    if (byId('fl-date')) byId('fl-date').value = f.date || '';
    if (byId('fl-mileage')) byId('fl-mileage').value = f.mileage != null ? f.mileage : '';
    if (byId('fl-liters')) byId('fl-liters').value = f.liters != null ? f.liters : '';
    if (byId('fl-price')) byId('fl-price').value = f.pricePerLiter != null ? f.pricePerLiter : '';
    if (byId('fl-full')) byId('fl-full').checked = !!f.full;
  } else {
    if (byId('fl-date')) byId('fl-date').value = todayISO();
    if (byId('fl-mileage')) byId('fl-mileage').value = vehicle.mileage != null ? vehicle.mileage : '';
    if (byId('fl-liters')) byId('fl-liters').value = '';
    if (byId('fl-price')) byId('fl-price').value = '';
    if (byId('fl-full')) byId('fl-full').checked = true;
  }
  openOverlay('overlay-fuel');
}

function saveFuel() {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  const liters = byId('fl-liters') ? parseNum(byId('fl-liters').value) : 0;
  if (liters <= 0) {
    toast(t('litersRequired'));
    return;
  }
  const existing = state.editingId ? state.data.fuel.find(function (x) { return x.id === state.editingId; }) : null;
  const rec = {
    id: state.editingId || uid(),
    vehicleId: vehicle.id,
    date: byId('fl-date') ? byId('fl-date').value : todayISO(),
    mileage: byId('fl-mileage') ? parseNum(byId('fl-mileage').value) : 0,
    liters: liters,
    pricePerLiter: byId('fl-price') ? parseNum(byId('fl-price').value) : 0,
    full: byId('fl-full') ? byId('fl-full').checked : false,
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };
  if (existing) {
    state.data.fuel = state.data.fuel.map(function (x) { return x.id === rec.id ? rec : x; });
  } else {
    state.data.fuel.push(rec);
  }
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

// ==== VIEW: DEADLINES ====
function renderDeadlines() {
  const container = byId('deadlines-list');
  if (!container) return;
  if (!state.data.vehicles.length) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noVehicles') + '</p><button type="button" class="btn" data-action="add-vehicle">' + t('addVehicle') + '</button></div>';
    return;
  }
  const vehicle = getActiveVehicle();
  if (!vehicle) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noActiveVehicle') + '</p></div>';
    return;
  }
  const list = filterByVehicle(state.data.deadlines).slice().sort(function (a, b) {
    return (a.expiryDate || '').localeCompare(b.expiryDate || '');
  });
  if (!list.length) {
    container.innerHTML = '<div class="empty">' + t('noDeadlines') + '</div>';
    return;
  }
  container.innerHTML = list.map(function (d) {
    const st = deadlineStatus(d.expiryDate);
    const label = d.type === 'custom' && d.label ? d.label : t('deadlineTypes.' + d.type);
    return '<div class="card dl-item dl-item--' + st.cls + '">' +
      '<div class="dl-item-head">' +
        '<span class="dl-item-label">' + escapeHtml(label) + '</span>' +
        '<span class="dl-count">' + st.label + '</span>' +
      '</div>' +
      '<div class="dl-item-meta">' + fmtDate(d.expiryDate) + (d.cost ? ' · ' + fmtMoney(d.cost) : '') + '</div>' +
      (d.notes ? '<div class="dl-item-notes">' + escapeHtml(d.notes) + '</div>' : '') +
      '<div class="item-actions">' +
        '<button type="button" class="btn btn--ghost" data-action="edit" data-id="' + d.id + '">' + t('edit') + '</button>' +
        '<button type="button" class="btn btn--ghost btn--danger-text" data-action="delete" data-id="' + d.id + '">' + t('delete') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openDeadlineOverlay(id) {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  state.editingId = id || null;
  const title = byId('overlay-deadline-title');
  const del = byId('dl-delete');
  const typeSel = byId('dl-type');
  const labelIn = byId('dl-label');
  if (title) title.textContent = id ? t('editDeadline') : t('newDeadline');
  if (del) del.style.display = id ? '' : 'none';
  if (typeSel) populateSelect(typeSel, DEADLINE_TYPES, 'deadlineTypes', null);
  if (id) {
    const d = state.data.deadlines.find(function (x) { return x.id === id; });
    if (!d) return;
    if (typeSel) typeSel.value = d.type;
    if (labelIn) {
      labelIn.value = d.label || '';
      labelIn.hidden = d.type !== 'custom';
    }
    if (byId('dl-date')) byId('dl-date').value = d.expiryDate || '';
    if (byId('dl-cost')) byId('dl-cost').value = d.cost != null ? d.cost : '';
    if (byId('dl-notes')) byId('dl-notes').value = d.notes || '';
  } else {
    if (typeSel) typeSel.value = DEADLINE_TYPES[0];
    if (labelIn) { labelIn.value = ''; labelIn.hidden = true; }
    if (byId('dl-date')) byId('dl-date').value = '';
    if (byId('dl-cost')) byId('dl-cost').value = '';
    if (byId('dl-notes')) byId('dl-notes').value = '';
  }
  openOverlay('overlay-deadline');
}

function saveDeadline() {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  const type = byId('dl-type') ? byId('dl-type').value : DEADLINE_TYPES[0];
  const label = byId('dl-label') ? byId('dl-label').value.trim() : '';
  const expiryDate = byId('dl-date') ? byId('dl-date').value : '';
  if (!expiryDate) {
    toast(t('dateRequired'));
    return;
  }
  if (type === 'custom' && !label) {
    toast(t('nameRequired'));
    return;
  }
  const existing = state.editingId ? state.data.deadlines.find(function (x) { return x.id === state.editingId; }) : null;
  const rec = {
    id: state.editingId || uid(),
    vehicleId: vehicle.id,
    type: type,
    label: type === 'custom' ? label : '',
    expiryDate: expiryDate,
    cost: byId('dl-cost') ? parseNum(byId('dl-cost').value) : 0,
    notes: byId('dl-notes') ? byId('dl-notes').value.trim() : '',
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };
  if (existing) {
    state.data.deadlines = state.data.deadlines.map(function (x) { return x.id === rec.id ? rec : x; });
  } else {
    state.data.deadlines.push(rec);
  }
  saveData();
  closeOverlay('overlay-deadline');
  renderCurrentView();
  toast(t('saved'));
}

async function deleteDeadline(id) {
  const recId = id || state.editingId;
  const ok = await confirmDialog({ title: t('delete'), text: t('confirmDeleteDeadline') });
  if (!ok) return;
  state.data.deadlines = state.data.deadlines.filter(function (x) { return x.id !== recId; });
  saveData();
  closeOverlay('overlay-deadline');
  renderCurrentView();
  toast(t('deleted'));
}

// ==== VIEW: MORE ====
function renderMore() {
  const el = byId('more-version');
  if (el) el.innerHTML = '<span class="version-label">' + t('version') + '</span> <span class="version-value">' + APP_VERSION + '</span>';
}

// ==== VIEW: VEHICLES ====
function renderVehicles() {
  const container = byId('vehicles-list');
  if (!container) return;
  const list = state.data.vehicles;
  if (!list.length) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noVehicles') + '</p><button type="button" class="btn" data-action="add-vehicle">' + t('addVehicle') + '</button></div>';
    return;
  }
  container.innerHTML = list.map(function (v) {
    const isActive = v.id === state.data.activeVehicleId;
    const meta = [v.make, v.model, v.year].filter(Boolean).join(' ');
    return '<div class="card vh-item' + (isActive ? ' vh-item--active' : '') + '">' +
      '<div class="vh-item-name">' + escapeHtml(v.name) + (isActive ? ' <span class="badge badge--ok">' + t('active') + '</span>' : '') + '</div>' +
      (meta ? '<div class="vh-item-meta">' + escapeHtml(meta) + (v.plate ? ' · ' + escapeHtml(v.plate) : '') + '</div>' : (v.plate ? '<div class="vh-item-meta">' + escapeHtml(v.plate) + '</div>' : '')) +
      '<div class="vh-item-mileage">' + fmtKm(v.mileage) + '</div>' +
      '<div class="item-actions">' +
        (!isActive ? '<button type="button" class="btn btn--ghost" data-action="set-active" data-id="' + v.id + '">' + t('setActive') + '</button>' : '') +
        '<button type="button" class="btn btn--ghost" data-action="edit" data-id="' + v.id + '">' + t('edit') + '</button>' +
        '<button type="button" class="btn btn--ghost btn--danger-text" data-action="delete" data-id="' + v.id + '">' + t('delete') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openVehicleOverlay(id) {
  state.editingId = id || null;
  const title = byId('overlay-vehicle-title');
  const del = byId('vh-delete');
  const setActiveBtn = byId('vh-set-active');
  if (title) title.textContent = id ? t('editVehicle') : t('newVehicle');
  if (del) del.style.display = id ? '' : 'none';
  if (setActiveBtn) setActiveBtn.style.display = (id && id !== state.data.activeVehicleId) ? '' : 'none';
  if (id) {
    const v = state.data.vehicles.find(function (x) { return x.id === id; });
    if (!v) return;
    if (byId('vh-name')) byId('vh-name').value = v.name || '';
    if (byId('vh-make')) byId('vh-make').value = v.make || '';
    if (byId('vh-model')) byId('vh-model').value = v.model || '';
    if (byId('vh-year')) byId('vh-year').value = v.year || '';
    if (byId('vh-plate')) byId('vh-plate').value = v.plate || '';
    if (byId('vh-vin')) byId('vh-vin').value = v.vin || '';
    if (byId('vh-mileage')) byId('vh-mileage').value = v.mileage != null ? v.mileage : '';
    if (byId('vh-notes')) byId('vh-notes').value = v.notes || '';
  } else {
    if (byId('vh-name')) byId('vh-name').value = '';
    if (byId('vh-make')) byId('vh-make').value = '';
    if (byId('vh-model')) byId('vh-model').value = '';
    if (byId('vh-year')) byId('vh-year').value = '';
    if (byId('vh-plate')) byId('vh-plate').value = '';
    if (byId('vh-vin')) byId('vh-vin').value = '';
    if (byId('vh-mileage')) byId('vh-mileage').value = '';
    if (byId('vh-notes')) byId('vh-notes').value = '';
  }
  openOverlay('overlay-vehicle');
}

function saveVehicle() {
  const name = byId('vh-name') ? byId('vh-name').value.trim() : '';
  if (!name) {
    toast(t('nameRequired'));
    return;
  }
  const existing = state.editingId ? state.data.vehicles.find(function (x) { return x.id === state.editingId; }) : null;
  const rec = {
    id: state.editingId || uid(),
    name: name,
    make: byId('vh-make') ? byId('vh-make').value.trim() : '',
    model: byId('vh-model') ? byId('vh-model').value.trim() : '',
    year: byId('vh-year') ? byId('vh-year').value.trim() : '',
    plate: byId('vh-plate') ? byId('vh-plate').value.trim() : '',
    vin: byId('vh-vin') ? byId('vh-vin').value.trim() : '',
    mileage: byId('vh-mileage') ? parseNum(byId('vh-mileage').value) : 0,
    notes: byId('vh-notes') ? byId('vh-notes').value.trim() : '',
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };
  if (existing) {
    state.data.vehicles = state.data.vehicles.map(function (x) { return x.id === rec.id ? rec : x; });
  } else {
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
  const vehicle = state.data.vehicles.find(function (v) { return v.id === recId; });
  if (!vehicle) return;
  const docPhotos = state.data.documents
    .filter(function (d) { return d.vehicleId === recId && d.photoId; })
    .map(function (d) { return d.photoId; });
  state.data.vehicles = state.data.vehicles.filter(function (v) { return v.id !== recId; });
  state.data.services = state.data.services.filter(function (x) { return x.vehicleId !== recId; });
  state.data.fuel = state.data.fuel.filter(function (x) { return x.vehicleId !== recId; });
  state.data.deadlines = state.data.deadlines.filter(function (x) { return x.vehicleId !== recId; });
  state.data.documents = state.data.documents.filter(function (x) { return x.vehicleId !== recId; });
  if (state.data.activeVehicleId === recId) state.data.activeVehicleId = null;
  docPhotos.forEach(function (pid) { deletePhoto(pid); });
  saveData();
  ensureActiveVehicle();
  closeOverlay('overlay-vehicle');
  renderCurrentView();
  toast(t('deleted'));
}

function setActiveVehicle(id) {
  state.data.activeVehicleId = id;
  saveData();
  renderCurrentView();
  toast(t('activeSet'));
}

// ==== VIEW: COSTS ====
function renderCosts() {
  const totalEl = byId('cost-total');
  const yearEl = byId('cost-year');
  const monthEl = byId('cost-month');
  if (!state.data.vehicles.length) {
    const container = byId('costs-chart');
    if (container) container.innerHTML = '<div class="empty-state"><p>' + t('noVehicles') + '</p><button type="button" class="btn" data-action="add-vehicle">' + t('addVehicle') + '</button></div>';
    if (byId('costs-breakdown')) byId('costs-breakdown').innerHTML = '';
    if (totalEl) totalEl.innerHTML = statLabel(t('totalAll'), fmtMoney(0));
    if (yearEl) yearEl.innerHTML = statLabel(t('thisYear'), fmtMoney(0));
    if (monthEl) monthEl.innerHTML = statLabel(t('thisMonth'), fmtMoney(0));
    return;
  }
  const vehicle = getActiveVehicle();
  if (!vehicle) {
    const container = byId('costs-chart');
    if (container) container.innerHTML = '<div class="empty-state"><p>' + t('noActiveVehicle') + '</p></div>';
    return;
  }
  const entries = getCostEntries();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const yearEntries = entries.filter(function (e) {
    const d = parseDate(e.date);
    return d && d.getFullYear() === year;
  });
  const monthEntries = entries.filter(function (e) {
    const d = parseDate(e.date);
    return d && d.getFullYear() === year && d.getMonth() === month;
  });
  if (totalEl) totalEl.innerHTML = statLabel(t('totalAll'), fmtMoney(sumCosts(entries)));
  if (yearEl) yearEl.innerHTML = statLabel(t('thisYear'), fmtMoney(sumCosts(yearEntries)));
  if (monthEl) monthEl.innerHTML = statLabel(t('thisMonth'), fmtMoney(sumCosts(monthEntries)));
  renderCostsChart(entries);
  renderCostsBreakdown(entries);
}

// ==== VIEW: DOCUMENTS ====
function renderDocuments() {
  const container = byId('documents-list');
  if (!container) return;
  if (!state.data.vehicles.length) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noVehicles') + '</p><button type="button" class="btn" data-action="add-vehicle">' + t('addVehicle') + '</button></div>';
    return;
  }
  const vehicle = getActiveVehicle();
  if (!vehicle) {
    container.innerHTML = '<div class="empty-state"><p>' + t('noActiveVehicle') + '</p></div>';
    return;
  }
  const list = filterByVehicle(state.data.documents).slice().sort(function (a, b) {
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
  if (!list.length) {
    container.innerHTML = '<div class="empty">' + t('noDocuments') + '</div>';
    return;
  }
  container.innerHTML = list.map(function (d) {
    return '<div class="card dc-item">' +
      '<div class="dc-item-head">' +
        '<span class="dc-item-name">' + escapeHtml(d.name) + '</span>' +
        '<span class="dc-item-type">' + escapeHtml(t('documentTypes.' + d.type)) + '</span>' +
      '</div>' +
      (d.number ? '<div class="dc-item-meta">' + escapeHtml(d.number) + '</div>' : '') +
      (d.expiryDate ? '<div class="dc-item-meta">' + t('expiryDate') + ': ' + fmtDate(d.expiryDate) + '</div>' : '') +
      '<div class="dc-item-photo" data-action="view-photo" data-id="' + d.id + '" data-photo-id="' + (d.photoId || '') + '">' + t('noPhoto') + '</div>' +
      '<div class="item-actions">' +
        '<button type="button" class="btn btn--ghost" data-action="edit" data-id="' + d.id + '">' + t('edit') + '</button>' +
        '<button type="button" class="btn btn--ghost btn--danger-text" data-action="delete" data-id="' + d.id + '">' + t('delete') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
  loadDocumentThumbs();
}

function loadDocumentThumbs() {
  filterByVehicle(state.data.documents).forEach(function (d) {
    if (!d.photoId) return;
    getPhoto(d.photoId).then(function (dataUrl) {
      if (!dataUrl) return;
      const el = document.querySelector('.dc-item-photo[data-id="' + d.id + '"]');
      if (el) el.innerHTML = '<img src="' + dataUrl + '" alt="' + escapeHtml(d.name) + '">';
    }).catch(function () {});
  });
}

function renderPhotoPreview() {
  const preview = byId('dc-photo-preview');
  if (!preview) return;
  if (state.pendingPhoto) {
    preview.innerHTML =
      '<div class="dc-preview">' +
        '<img src="' + state.pendingPhoto + '" alt="' + t('photo') + '">' +
        '<button type="button" class="dc-preview-remove" id="dc-photo-remove">' + t('removePhoto') + '</button>' +
      '</div>';
    const removeBtn = byId('dc-photo-remove');
    if (removeBtn) removeBtn.addEventListener('click', removePhoto);
  } else {
    preview.innerHTML = '<div class="dc-preview dc-preview--empty">' + t('addPhoto') + '</div>';
  }
}

function openDocumentOverlay(id) {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  state.editingId = id || null;
  state.pendingPhoto = null;
  state.pendingPhotoId = null;
  const title = byId('overlay-document-title');
  const del = byId('dc-delete');
  const typeSel = byId('dc-type');
  if (title) title.textContent = id ? t('editDocument') : t('newDocument');
  if (del) del.style.display = id ? '' : 'none';
  if (typeSel) populateSelect(typeSel, DOCUMENT_TYPES, 'documentTypes', null);
  if (id) {
    const d = state.data.documents.find(function (x) { return x.id === id; });
    if (!d) return;
    if (typeSel) typeSel.value = d.type;
    if (byId('dc-name')) byId('dc-name').value = d.name || '';
    if (byId('dc-number')) byId('dc-number').value = d.number || '';
    if (byId('dc-date')) byId('dc-date').value = d.expiryDate || '';
    if (byId('dc-notes')) byId('dc-notes').value = d.notes || '';
    state.pendingPhotoId = d.photoId || null;
    if (d.photoId) {
      getPhoto(d.photoId).then(function (dataUrl) {
        if (dataUrl) {
          state.pendingPhoto = dataUrl;
          renderPhotoPreview();
        }
      }).catch(function () {});
    }
  } else {
    if (typeSel) typeSel.value = DOCUMENT_TYPES[0];
    if (byId('dc-name')) byId('dc-name').value = '';
    if (byId('dc-number')) byId('dc-number').value = '';
    if (byId('dc-date')) byId('dc-date').value = '';
    if (byId('dc-notes')) byId('dc-notes').value = '';
  }
  renderPhotoPreview();
  openOverlay('overlay-document');
}

function onPhotoSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  compressImage(file).then(function (dataUrl) {
    // Replace any previously attached photo (delete old one from IndexedDB).
    if (state.pendingPhotoId) deletePhoto(state.pendingPhotoId);
    state.pendingPhoto = dataUrl;
    state.pendingPhotoId = uid();
    renderPhotoPreview();
    toast(t('photoAdded'));
  }).catch(function () {
    toast(t('importError'));
  });
}

function removePhoto() {
  if (state.pendingPhotoId) deletePhoto(state.pendingPhotoId);
  state.pendingPhoto = null;
  state.pendingPhotoId = null;
  renderPhotoPreview();
  toast(t('photoRemoved'));
}

async function saveDocument() {
  const vehicle = requireActiveVehicle();
  if (!vehicle) return;
  const name = byId('dc-name') ? byId('dc-name').value.trim() : '';
  if (!name) {
    toast(t('nameRequired'));
    return;
  }
  const existing = state.editingId ? state.data.documents.find(function (x) { return x.id === state.editingId; }) : null;
  // Persist pending photo to IndexedDB before saving the record.
  if (state.pendingPhoto && state.pendingPhotoId) {
    try {
      await putPhoto(state.pendingPhotoId, state.pendingPhoto);
    } catch (e) {
      toast(t('importError'));
      return;
    }
  }
  const rec = {
    id: state.editingId || uid(),
    vehicleId: vehicle.id,
    name: name,
    type: byId('dc-type') ? byId('dc-type').value : DOCUMENT_TYPES[0],
    number: byId('dc-number') ? byId('dc-number').value.trim() : '',
    expiryDate: byId('dc-date') ? byId('dc-date').value : '',
    notes: byId('dc-notes') ? byId('dc-notes').value.trim() : '',
    photoId: state.pendingPhotoId,
    createdAt: existing ? existing.createdAt : new Date().toISOString()
  };
  if (existing) {
    state.data.documents = state.data.documents.map(function (x) { return x.id === rec.id ? rec : x; });
  } else {
    state.data.documents.push(rec);
  }
  saveData();
  closeOverlay('overlay-document');
  renderCurrentView();
  toast(t('saved'));
}

async function deleteDocument(id) {
  const recId = id || state.editingId;
  const ok = await confirmDialog({ title: t('delete'), text: t('confirmDeleteDocument') });
  if (!ok) return;
  const doc = state.data.documents.find(function (x) { return x.id === recId; });
  if (doc && doc.photoId) deletePhoto(doc.photoId);
  state.data.documents = state.data.documents.filter(function (x) { return x.id !== recId; });
  saveData();
  closeOverlay('overlay-document');
  renderCurrentView();
  toast(t('deleted'));
}

function openPhotoViewer(photoId) {
  if (!photoId) return;
  getPhoto(photoId).then(function (dataUrl) {
    if (!dataUrl) return;
    const viewer = byId('photo-viewer');
    if (!viewer) return;
    viewer.innerHTML =
      '<div class="photo-viewer-backdrop"></div>' +
      '<div class="photo-viewer-body">' +
        '<img src="' + dataUrl + '" alt="' + t('photo') + '" class="photo-viewer-img">' +
        '<button type="button" class="photo-viewer-close" aria-label="' + t('close') + '">×</button>' +
      '</div>';
    viewer.classList.add('photo-viewer--open');
  }).catch(function () {});
}

function closePhotoViewer() {
  const viewer = byId('photo-viewer');
  if (!viewer) return;
  viewer.classList.remove('photo-viewer--open');
  viewer.innerHTML = '';
}

// ==== VIEW: SETTINGS ====
function renderSettings() {
  const versionEl = byId('set-version');
  if (versionEl) versionEl.innerHTML = '<span class="version-label">' + t('version') + '</span> <span class="version-value">' + APP_VERSION + '</span>';
  const hrBtn = byId('set-lang-hr');
  const enBtn = byId('set-lang-en');
  const lang = state.data.settings.lang;
  if (hrBtn) hrBtn.classList.toggle('btn--active', lang === 'hr');
  if (enBtn) enBtn.classList.toggle('btn--active', lang === 'en');
}

function setLang(lang) {
  state.data.settings.lang = lang;
  saveData();
  applyI18n();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'autoservis-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast(t('exportSuccess'));
}

async function importData(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;
  const ok = await confirmDialog({ title: t('importData'), text: t('importConfirm'), okText: t('save') });
  if (!ok) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.vehicles)) throw new Error('invalid');
    state.data = normalizeData(parsed);
    saveData();
    ensureActiveVehicle();
    applyI18n();
    toast(t('importSuccess'));
  } catch (err) {
    toast(t('importError'));
  }
}

async function resetData() {
  const ok = await confirmDialog({ title: t('resetData'), text: t('confirmReset'), okText: t('delete') });
  if (!ok) return;
  state.data = defaultData();
  saveData();
  clearPhotos();
  applyI18n();
  showView('home');
  toast(t('resetDone'));
}

// ==== I18N APPLY ====
function applyI18n() {
  const lang = state.data.settings.lang;
  document.documentElement.lang = lang;
  document.title = t('appName');
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  renderCurrentView();
}

// ==== EVENT WIRING ====
function delegateList(containerId, handler) {
  const el = byId(containerId);
  if (!el) return;
  el.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn || !el.contains(btn)) return;
    handler(btn.getAttribute('data-action'), btn.getAttribute('data-id'), btn);
  });
}

function onServiceAction(action, id) {
  if (action === 'edit') openServiceOverlay(id);
  else if (action === 'delete') deleteService(id);
}

function onFuelAction(action, id) {
  if (action === 'edit') openFuelOverlay(id);
  else if (action === 'delete') deleteFuel(id);
}

function onDeadlineAction(action, id) {
  if (action === 'edit') openDeadlineOverlay(id);
  else if (action === 'delete') deleteDeadline(id);
}

function onVehicleAction(action, id) {
  if (action === 'set-active') setActiveVehicle(id);
  else if (action === 'edit') openVehicleOverlay(id);
  else if (action === 'delete') deleteVehicle(id);
}

function onDocumentAction(action, id) {
  if (action === 'edit') openDocumentOverlay(id);
  else if (action === 'delete') deleteDocument(id);
  else if (action === 'view-photo') {
    const doc = state.data.documents.find(function (x) { return x.id === id; });
    if (doc && doc.photoId) openPhotoViewer(doc.photoId);
  }
}

function onHomeChipAction(action, id) {
  if (action === 'set-active') setActiveVehicle(id);
  else if (action === 'goto-deadlines') showView('deadlines');
}

function wireEvents() {
  // Tabs
  ['home', 'services', 'fuel', 'deadlines', 'more'].forEach(function (v) {
    const tab = byId('tab-' + v);
    if (tab) tab.addEventListener('click', function () { showView(v); });
  });

  // More menu
  const menuVehicles = byId('menu-vehicles');
  if (menuVehicles) menuVehicles.addEventListener('click', function () { showView('vehicles'); });
  const menuCosts = byId('menu-costs');
  if (menuCosts) menuCosts.addEventListener('click', function () { showView('costs'); });
  const menuDocuments = byId('menu-documents');
  if (menuDocuments) menuDocuments.addEventListener('click', function () { showView('documents'); });
  const menuSettings = byId('menu-settings');
  if (menuSettings) menuSettings.addEventListener('click', function () { showView('settings'); });

  // Add buttons
  const btnAddService = byId('btn-add-service');
  if (btnAddService) btnAddService.addEventListener('click', function () { openServiceOverlay(); });
  const btnAddFuel = byId('btn-add-fuel');
  if (btnAddFuel) btnAddFuel.addEventListener('click', function () { openFuelOverlay(); });
  const btnAddDeadline = byId('btn-add-deadline');
  if (btnAddDeadline) btnAddDeadline.addEventListener('click', function () { openDeadlineOverlay(); });
  const btnAddVehicle = byId('btn-add-vehicle');
  if (btnAddVehicle) btnAddVehicle.addEventListener('click', function () { openVehicleOverlay(); });
  const btnAddDocument = byId('btn-add-document');
  if (btnAddDocument) btnAddDocument.addEventListener('click', function () { openDocumentOverlay(); });
  const btnQuickService = byId('btn-quick-service');
  if (btnQuickService) btnQuickService.addEventListener('click', function () { openServiceOverlay(); });
  const btnQuickFuel = byId('btn-quick-fuel');
  if (btnQuickFuel) btnQuickFuel.addEventListener('click', function () { openFuelOverlay(); });

  // Empty-state CTA (any view)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action="add-vehicle"]');
    if (btn) openVehicleOverlay();
  });

  // Service overlay
  const svSave = byId('sv-save');
  if (svSave) svSave.addEventListener('click', saveService);
  const svCancel = byId('sv-cancel');
  if (svCancel) svCancel.addEventListener('click', function () { closeOverlay('overlay-service'); });
  const svDelete = byId('sv-delete');
  if (svDelete) svDelete.addEventListener('click', function () { deleteService(); });

  // Fuel overlay
  const flSave = byId('fl-save');
  if (flSave) flSave.addEventListener('click', saveFuel);
  const flCancel = byId('fl-cancel');
  if (flCancel) flCancel.addEventListener('click', function () { closeOverlay('overlay-fuel'); });
  const flDelete = byId('fl-delete');
  if (flDelete) flDelete.addEventListener('click', function () { deleteFuel(); });

  // Deadline overlay
  const dlSave = byId('dl-save');
  if (dlSave) dlSave.addEventListener('click', saveDeadline);
  const dlCancel = byId('dl-cancel');
  if (dlCancel) dlCancel.addEventListener('click', function () { closeOverlay('overlay-deadline'); });
  const dlDelete = byId('dl-delete');
  if (dlDelete) dlDelete.addEventListener('click', function () { deleteDeadline(); });
  const dlType = byId('dl-type');
  const dlLabel = byId('dl-label');
  if (dlType && dlLabel) {
    dlType.addEventListener('change', function () {
      dlLabel.hidden = dlType.value !== 'custom';
    });
  }

  // Vehicle overlay
  const vhSave = byId('vh-save');
  if (vhSave) vhSave.addEventListener('click', saveVehicle);
  const vhCancel = byId('vh-cancel');
  if (vhCancel) vhCancel.addEventListener('click', function () { closeOverlay('overlay-vehicle'); });
  const vhDelete = byId('vh-delete');
  if (vhDelete) vhDelete.addEventListener('click', function () { deleteVehicle(); });
  const vhSetActive = byId('vh-set-active');
  if (vhSetActive) {
    vhSetActive.addEventListener('click', function () {
      if (state.editingId) {
        setActiveVehicle(state.editingId);
        closeOverlay('overlay-vehicle');
      }
    });
  }

  // Document overlay
  const dcSave = byId('dc-save');
  if (dcSave) dcSave.addEventListener('click', saveDocument);
  const dcCancel = byId('dc-cancel');
  if (dcCancel) dcCancel.addEventListener('click', function () { closeOverlay('overlay-document'); });
  const dcDelete = byId('dc-delete');
  if (dcDelete) dcDelete.addEventListener('click', function () { deleteDocument(); });
  const dcPhoto = byId('dc-photo');
  if (dcPhoto) dcPhoto.addEventListener('change', onPhotoSelected);

  // Photo viewer
  const photoViewer = byId('photo-viewer');
  if (photoViewer) {
    photoViewer.addEventListener('click', function (e) {
      if (e.target === photoViewer || e.target.classList.contains('photo-viewer-backdrop') || e.target.classList.contains('photo-viewer-close')) {
        closePhotoViewer();
      }
    });
  }

  // Settings
  const setLangHr = byId('set-lang-hr');
  if (setLangHr) setLangHr.addEventListener('click', function () { setLang('hr'); });
  const setLangEn = byId('set-lang-en');
  if (setLangEn) setLangEn.addEventListener('click', function () { setLang('en'); });
  const btnExport = byId('btn-export');
  if (btnExport) btnExport.addEventListener('click', exportData);
  const btnImport = byId('btn-import');
  if (btnImport) btnImport.addEventListener('change', importData);
  const btnReset = byId('btn-reset');
  if (btnReset) btnReset.addEventListener('click', resetData);

  // List delegation
  delegateList('services-list', onServiceAction);
  delegateList('fuel-list', onFuelAction);
  delegateList('deadlines-list', onDeadlineAction);
  delegateList('vehicles-list', onVehicleAction);
  delegateList('documents-list', onDocumentAction);
  delegateList('home-vehicle-row', onHomeChipAction);

  // Overlay backdrop close
  document.querySelectorAll('.overlay').forEach(function (ov) {
    ov.addEventListener('click', function (e) {
      if (e.target === ov) closeOverlay(ov.id);
    });
  });

  // Overlay header close (×) buttons
  document.querySelectorAll('.overlay__close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const ov = btn.closest('.overlay');
      if (ov) closeOverlay(ov.id);
    });
  });
}

// ==== PWA ====
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(function () {
      // SW registration failure is non-fatal (e.g. http:// file:// contexts)
    });
  }
}

// ==== INIT ====
function init() {
  loadData();
  ensureActiveVehicle();
  openDB().then(function (db) {
    state.db = db;
  }).catch(function () {
    state.db = null;
  });
  applyI18n();
  wireEvents();
  checkVersion();
  registerSW();
  showView('home');
  fixOverlayHeight();
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fixOverlayHeight);
  window.addEventListener('resize', fixOverlayHeight);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}