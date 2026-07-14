# CineBook — Project Plan

Cinema Ticket Reservation System. Next.js 15 (App Router), TypeScript, PostgreSQL, Prisma, Tailwind CSS, Server Actions, NextAuth v5.

---

## Phase 0 — Foundation

- [x] Next.js 15 project scaffolded (App Router, TypeScript, Tailwind)
- [x] Prisma schema: User, Movie, CinemaHall, Seat, Showtime, Booking, BookingSeat
- [x] Double-booking prevention via unique constraint on (showtimeId, seatId)
- [x] NextAuth v5 credentials provider with bcrypt password hashing
- [x] Role-based session data (ADMIN | USER) via JWT callbacks
- [x] Middleware protecting `/dashboard` routes
- [x] Route groups: `(auth)`, `(public)`, `(dashboard)`
- [x] `/actions` folder convention for Server Actions
- [x] Seed script: 8 movies, 2 halls, generated seats, admin + sample user
- [x] Connected to hosted Postgres (Neon), migration applied, seed run
- [x] Git repo set up with main/stage/kyle branch workflow

---

## Phase 1 — Authentication UI

- [x] Login page: form (email/password) wired to `signIn()`
- [x] Register page: form wired to `registerUser` server action
- [x] Form validation + inline error display (using existing zod schemas)
- [x] Redirect logic after login (ADMIN → `/admin`, USER → `/bookings`)
- [x] Logout action/button
- [x] Session-aware navbar (shows user name/role, login/logout state)
- [x] Protect register page from already-logged-in users
- [x] Fixed middleware route protection (`/admin`, `/bookings`) — `(dashboard)` route group doesn't add a URL prefix, so the original `/dashboard` check never matched anything

---

## Phase 2 — Public Movie Browsing

- [x] Movie listing page (`/movies`) — grid of posters, title, genre, rating
- [x] Filter/tab by status: Now Showing vs Coming Soon
- [x] Movie detail page (`/movies/[id]`) — description, duration, rating, showtimes
- [x] Showtime list on detail page grouped by date
- [x] Empty/loading states for movie fetches (empty-category message; 404 via `notFound()` for bad IDs)
- [ ] Basic search or genre filter (stretch)

---

## Phase 3 — Seat Selection & Booking Flow

- [x] Showtime page (`/showtimes/[id]`) — seat map rendered from hall rows/columns
- [x] Seat map reflects REGULAR vs PREMIUM styling (single price per showtime, not per seat type — matches current schema)
- [x] Real-time-ish seat availability (query already-booked seats for that showtime)
- [x] Seat selection state (multi-select, running total price)
- [x] Booking confirmation step (selected seats + total price review)
- [x] `createBooking` server action:
  - [x] Validates seats still available (transaction-safe against unique constraint)
  - [x] Creates Booking + BookingSeat rows atomically
  - [x] Sets status CONFIRMED directly (MVP — no payment step exists yet)
  - [x] Handles race condition failure gracefully (seat taken mid-selection) — verified with a concurrent-request test
- [x] Booking success page / confirmation screen (`/bookings/[id]`)

---

## Phase 4 — User Dashboard

- [x] `/bookings` — list of the logged-in user's bookings
- [x] Booking detail view (movie, showtime, seats, total, status)
- [x] Cancel booking action (sets status CANCELLED, frees seats) — verified: cancelling flips status and the seat immediately shows available again on the showtime page
- [x] Empty state for no bookings yet
- [x] Cancel restricted to future, non-cancelled showtimes (button hidden otherwise)

---

## Phase 5 — Admin Dashboard

- [x] `/admin` — overview (counts: movies, halls, showtimes, bookings today, active bookings)
- [x] Movie management: create/edit/delete movie (form + server actions)
- [x] Cinema hall management: create hall (rows/columns → auto-generate seats) — verified 3×5 hall generates exactly 15 seats, last row PREMIUM
- [x] Showtime management: create/delete showtime (movie + hall + time + price) — edit intentionally omitted (delete+recreate covers it, avoids seat-map/booking conflicts an edit would need to handle)
- [x] Bookings view: list all bookings across users, filter by status via query param
- [x] Admin-only route guard (role check beyond just "logged in") — verified all `/admin/*` sub-routes 302 away for a non-admin session; every mutating action also re-checks role server-side (defense in depth beyond middleware)

---

## Phase 6 — Polish & Cross-Cutting Concerns

Visual polish (responsive/accessibility/styling) deliberately deferred — UI is a functional placeholder pending a design pass, per user decision on 2026-07-13. Only structural/functional items done now.

- [x] Consistent loading states across data-fetching pages (`loading.tsx` for movies, movie detail, showtime, bookings, booking detail, admin section)
- [x] Consistent error boundaries — global `app/error.tsx` + `app/not-found.tsx`
- [x] Form validation error messaging pattern (shared `FormError`/`FieldError` components, used across all 6 forms: login, register, movie, hall, showtime, seat-map booking)
- [ ] Responsive layout pass (mobile seat map is the tricky one) — deferred to design pass
- [ ] Accessibility pass (labels, focus states, keyboard nav on seat map) — deferred to design pass
- [ ] Toast/notification system for action feedback — deferred to design pass (inline error text covers functional feedback for now)

---

## Phase 7 — Testing & Hardening

- [x] Manual test pass: full booking flow end-to-end (verified live during Phase 3/4 build-out: browse → seat select → book → confirm → cancel → seat freed)
- [x] Manual test pass: concurrent booking of the same seat (double-booking guard) — two simultaneous requests for the same seat: one succeeds, one cleanly rejected by the unique constraint, exactly one `BookingSeat` row persists
- [x] Manual test pass: role-based access (USER can't reach admin routes) — verified every `/admin/*` sub-route 302s away for a non-admin session
- [x] Seed script re-run idempotency check — **found and fixed a real bug**: re-running `db:seed` duplicated movies/halls (8→16, 2→4) since only users were upsert-safe; added a reset (`deleteMany` on Movie/CinemaHall, cascades handle the rest) so re-running now reliably returns to the exact same seeded state
- [x] Review server actions for auth checks — audited all 8 mutating actions; every one checks session/role appropriately (`createBooking`/`cancelBooking` check session + ownership, all `admin.ts` mutations call `requireAdmin()`)
- [x] Known limitation noted: pages calling `notFound()` render the correct content but return HTTP 200 instead of 404 in dev, due to Next.js App Router streaming semantics (status can't change after the shell has started streaming). Cosmetic for real users, would only affect SEO crawlers — not fixed, out of scope.

---

## Phase 8 — Deployment

- [ ] Production Postgres confirmed (Neon prod branch or separate DB) — currently dev and "prod" would share the same Neon DB; recommended to split before a real deploy, left as a decision for the user
- [x] Environment variables documented (`DATABASE_URL`, `AUTH_SECRET`) — checklist in README
- [ ] Deploy to Vercel (or chosen host) — requires user's hosting account, not something that can be done without their credentials/access
- [x] Migration command for production documented (`prisma migrate deploy`, distinct from local `migrate dev`)
- [ ] Smoke test production deployment — blocked on an actual deployed URL existing
- [x] Final README with setup instructions for grading/demo — rewritten with real project docs, setup steps, seed warning, and deployment steps
- [x] Production build verified locally (`npm run build`) — all 18 routes compile successfully, correctly all-dynamic (no bad static prerendering of session-dependent pages)

---

## Design Implementation

Source: `plan/design/README.md` (full handoff spec) + `plan/design/tokens/*.css` (verbatim token
values) + `plan/design/CineBook.dc.html` (visual reference only — layout/spacing/color/copy, not
code to copy). Fonts: Lora (display/headings), DM Sans (UI/body), JetBrains Mono (status pills,
seat labels, prices, timestamps). This replaces the plain-Tailwind placeholder UI from Phase 6.

Each phase below is scoped to one session's worth of work so it can be done independently —
foundation must go first, everything else can happen in any order after that.

### Design Phase A — Foundation (must be done first) — ✅ Complete

- [x] Add Lora, DM Sans, JetBrains Mono via `next/font/google` (`app/layout.tsx`)
- [x] Port color tokens into Tailwind `@theme` (`app/globals.css`) — brand teal scale, neutrals, semantic fg/surface/border aliases, status colors, seat-state colors, poster tint palette (all as real Tailwind utilities, e.g. `bg-surface-2`, `text-fg-1`, verified in compiled CSS output, not just defined)
- [x] Port typography (px-accurate sizes overriding Tailwind defaults, line-heights, letter-spacing), radius, and shadow tokens into `@theme`
- [x] Build base primitives: `Button` (primary/secondary/ghost/danger × sm/md/lg), `Input`/`Textarea`/`Select` (label/error/helperText), `Card`, `Badge`, `Avatar` (initials, deterministic auto-color) — all under `components/ui/`
- [x] Install Lucide Icons (`lucide-react`)
- [x] Global page shell: `bg-surface-2` background, `text-fg-1` warm-black text on `<body>` in `app/layout.tsx`
- [x] Verified via a temporary smoke-test route (removed after): all primitives render correct classes/content, and spot-checked the actually-served compiled CSS to confirm tokens resolve to real values (e.g. `.rounded-card { border-radius: 14px }`), not just present in source
- [x] Production build passes with the new token system in place

### Design Phase B — Shared Components — ✅ Complete

- [x] `Navbar` — role-aware (guest: Log in/Register · user: My bookings + avatar · admin: Admin link + violet avatar), logo (clapperboard icon + "CineBook" in Lora) — verified live: guest/user/admin sessions each render the correct nav state
- [x] `StatusPill` — CONFIRMED (green) / PENDING (amber, pulsing dot via `.status-dot-pulse`) / CANCELLED (gray) — built, not yet wired into a real page (happens in Phases G/H/M)
- [x] `PosterTile` — typographic poster, tint bg deterministically derived from movie title (no `tint` field in the schema, matches the `Avatar` auto-color pattern), genre eyebrow + Lora title + rating chip — built, wired in Phase D/E
- [x] `SeatButton` — 4 states (regular/premium/selected/taken), 26×28px (`h-6.5 w-7`), asymmetric `7px 7px 5px 5px` radius via `--radius-seat` — built, wired in Phase F
- [x] `SeatMap` — rows × N cols with an aisle gap at the horizontal midpoint (generalized from the handoff's "12 cols, gap after col 6" example since real hall column counts vary), horizontal scroll on mobile, screen bar — built, wired in Phase F
- [x] `AdminSubnav` — Overview / Movies / Halls / Showtimes / Bookings tabs with active-tab highlighting — verified live, all 5 tabs render and wired into `app/(dashboard)/admin/layout.tsx`
- [x] Shared states: shimmer skeletons matching each page's real layout (`Skeleton` primitive) for movies/movie-detail/showtime/bookings/booking-detail/admin; global `error.tsx` (`triangle-alert` in red circle) and `not-found.tsx` (Lora "404") restyled — verified live (404 renders correct copy and a real HTTP 404 status)

### Design Phase C — Auth Pages — ✅ Complete

- [x] Login (`app/(auth)/login`) — centered 400px card (`max-w-100`), Lora "Welcome back", inline red error banner with `circle-alert` icon and exact handoff copy ("That email and password don't match. Check them and try again.") — verified live: page renders correctly, a real login still succeeds and establishes the correct session after the copy change
- [x] Register (`app/(auth)/register`) — same card pattern, per-field validation copy from the handoff (email format message, password helper text) wired into `lib/validations/auth.ts` zod messages — verified live

### Design Phase D — Movie Listing (`app/(public)/movies`)

- [ ] "What's on" header, Now showing / Coming soon segmented tabs
- [ ] Poster grid using `PosterTile`
- [ ] Empty state per tab (film icon, copy from handoff)

### Design Phase E — Movie Detail (`app/(public)/movies/[id]`)

- [ ] Two-column layout: poster tile + title/meta/description
- [ ] Showtimes grouped by date, outlined time+hall buttons with teal hover state
- [ ] Empty state ("No upcoming showtimes scheduled")

### Design Phase F — Seat Selection (`app/(public)/showtimes/[id]`) — most complex, budget extra time

- [ ] Header (movie title + hall/date/time in mono)
- [ ] `SeatMap` integration with legend (Regular $12 / Premium $18 / Selected / Taken)
- [ ] Sticky summary bar (seat count, labels, total, "Book selected seats")
- [ ] Guest state (teal prompt card instead of book button)
- [ ] Race-condition error banner (seat taken mid-selection — action already returns this, just needs styling)
- [ ] Mobile horizontal scroll for the seat grid

### Design Phase G — Booking Confirmation (`app/(dashboard)/bookings/[id]`)

- [ ] Centered 480px success layout, teal check circle
- [ ] Ticket card: poster chip, movie, `StatusPill`, Hall/Showtime/Seats/Total grid, dashed perforation, mono confirmation code
- [ ] "Browse more movies" + conditional "Cancel booking" (danger, upcoming only)

### Design Phase H — My Bookings (`app/(dashboard)/bookings`)

- [ ] Booking card list (poster chip, mono hall/time, `StatusPill`, price, conditional Cancel)
- [ ] Empty state (ticket icon, copy from handoff, "Browse movies" CTA)

### Design Phase I — Admin Overview (`app/(dashboard)/admin`)

- [ ] Stat tiles (teal-50 icon chip + Lora number + label) for movies/halls/showtimes/bookings-today/active-bookings

### Design Phase J — Admin Movies (`app/(dashboard)/admin/movies`)

- [ ] Two-column: list rows (poster chip, mono meta, status chip, edit/delete icon buttons) + create/edit form

### Design Phase K — Admin Halls (`app/(dashboard)/admin/halls`)

- [ ] Table (Hall | Rows×Cols | Seats | Showtimes | delete) + create form with the "auto-generated seat grid" info note

### Design Phase L — Admin Showtimes (`app/(dashboard)/admin/showtimes`)

- [ ] Table (Movie | Hall | Date/time | Price | delete) + create form

### Design Phase M — Admin Bookings (`app/(dashboard)/admin/bookings`)

- [ ] Segmented status filter (All/Pending/Confirmed/Cancelled) + table (Movie/Customer/Hall-time/Seats/StatusPill/Price)

### Design Phase N — Cross-Page QA Pass (do last)

- [ ] Consistency check across all screens (spacing, type scale, color usage matches tokens exactly)
- [ ] Responsive pass on every screen, especially the seat map
- [ ] Favicon/app icon (teal clapperboard mark)
- [ ] Verify animation timing (120–150ms micro-interactions, PENDING dot 1.6s pulse, button press `scale(0.982)`) — no decorative motion anywhere

---

## Notes

- Auth (Phase 1) unlocks meaningful testing of Phases 3–5, so it's the recommended next step.
- Booking creation (Phase 3) is the highest-risk piece technically — the seat double-booking guard needs to be verified under concurrent requests, not just happy path.
- Actual deployment (picking a host, connecting the account, going live) needs the user directly — an agent shouldn't be creating/configuring third-party hosting accounts unsupervised.
- Design Phase A (foundation/tokens) is a hard prerequisite for every other Design Phase — do it first, in its own session, before touching any individual page.
- `CineBook.dc.html` is a visual reference only, built on a throwaway component runtime — read it for layout/spacing/color/copy, never copy its markup/JS directly into the Next.js app.
