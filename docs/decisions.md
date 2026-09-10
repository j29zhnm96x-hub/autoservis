# AutoServis — Decisions

## [2026-09-10] Decision: Vanilla stack, no build tools
- **Context:** User's default project setup for all new apps.
- **Options considered:** React/Vue, build tools, vanilla.
- **Decision:** Vanilla HTML/CSS/JS, no npm, no build step.
- **Rationale:** Matches user's established pattern (Wowter, Murano, LearnGita); zero maintenance, direct deploy to CloudFlare Pages.
- **Trade-offs accepted:** No componentization; single app.js file.
- **Status:** active

## [2026-09-10] Decision: localStorage + IndexedDB for photos
- **Context:** Need offline persistence; document photos can be large.
- **Options considered:** localStorage only, IndexedDB only, Supabase sync.
- **Decision:** Structured data in localStorage; photos in IndexedDB (compressed JPEG ≤900px).
- **Rationale:** Simple, reliable, offline-first; photos compressed to stay small.
- **Trade-offs accepted:** No cloud backup in v0.0.1; export/import JSON covers data backup (photos excluded).
- **Status:** active

## [2026-09-10] Decision: Burnt-orange automotive theme
- **Context:** Avoid generic AI design (purple, gradients, glassmorphism).
- **Options considered:** Dark garage theme, blue, purple.
- **Decision:** Warm light theme, burnt orange accent (#D9480F), Manrope font.
- **Rationale:** Automotive personality (warning-light orange), light-first for readability, outside AI-default palette.
- **Trade-offs accepted:** No dark mode in v0.0.1.
- **Status:** active