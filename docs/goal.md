# AutoServis — Goal

## Vision
A personal car maintenance tracker PWA for Alen. Track services, deadlines (registration/insurance/technical inspection), fuel consumption, costs, and documents — all offline-first on the phone, installable via Add to Home Screen on iPhone 13 Pro.

## Users
- Single user (Alen), beginner-friendly, Croatian primary language, English secondary.

## Core Requirements
1. Vanilla HTML/CSS/JS — no frameworks, no build tools, no npm.
2. PWA installable on iPhone 13 Pro (390x844 CSS px) via Add to Home Screen.
3. Bilingual HR/EN, default HR.
4. Data stored locally (localStorage; document photos in IndexedDB).
5. Multiple vehicles supported.
6. Version system: APP_VERSION + version.json + cache busting + update detection.
7. Deploy: GitHub repo + CloudFlare Pages (project: autoservis).
8. Clean, non-generic design (warm light theme, burnt-orange automotive accent, Manrope).

## Features (v0.0.1)
- **Servisi** — service records (oil, brakes, tires, battery, inspection, other) with date/mileage/cost/notes + reminders (km interval and/or months).
- **Rokovi** — registration, insurance, technical inspection, driving license, custom — expiry dates with countdown (green/amber/red).
- **Gorivo** — fill-ups with liters, price, mileage; computed consumption l/100km; stats.
- **Troškovi** — aggregated costs (all/year/month), monthly bar chart, category breakdown.
- **Dokumenti** — document records (name, type, number, expiry, notes) with optional photo stored in IndexedDB.
- **Vozila** — multiple vehicles, active selection, edit/delete.
- **Postavke** — language toggle, data export/import JSON, reset, version info.

## Out of Scope (v0.0.1)
- Cloud sync, reminders notifications (push), multi-user, fuel price history charts.