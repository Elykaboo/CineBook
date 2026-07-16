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
- [x] Search by title + genre filter + sort (Title A–Z / Shortest / Longest), all as URL query params so filters survive the Now Showing/Coming Soon tab switch — verified live: `q=iron` → "Iron Tide" only, `genre=Sci-Fi&status=COMING_SOON` → "Echoes of Tomorrow" only, `sort=duration-asc` → correct ascending order (96→134 min)
- [x] Search/genre/sort update live via `MovieFilters` client component (`app/(public)/movies/movie-filters.tsx`) using `router.replace()` — search is debounced 300ms so it doesn't fire per keystroke, genre/sort update immediately on change, no page reload

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

### Design Phase D — Movie Listing (`app/(public)/movies`) — ✅ Complete

- [x] "What's on" header (Lora), Now showing / Coming soon segmented pill tabs
- [x] Poster grid using `PosterTile` — replaces the earlier `next/image` photo posters with typographic tiles per the DS ("no photography"); real `posterUrl` data is now unused on this page but still exists on the model for a later swap if desired
- [x] Empty state per tab (film icon, copy from handoff) — verified live: both tabs render their correct real seeded titles ("Iron Tide"/"Midnight Heist" on Now Showing, "Echoes of Tomorrow" etc. on Coming Soon), poster tint and pill-radius utilities confirmed in compiled CSS

### Design Phase E — Movie Detail (`app/(public)/movies/[id]`) — ✅ Complete

- [x] Two-column layout: `PosterTile` (220px) + Lora title/meta badges/description
- [x] Showtimes grouped by date (mono eyebrow), outlined time+hall buttons with teal border/bg hover state
- [x] Empty state ("No upcoming showtimes scheduled") — verified live with real seeded data (Iron Tide, dates grouped correctly), hover and width utilities confirmed in compiled CSS

### Design Phase F — Seat Selection (`app/(public)/showtimes/[id]`) — ✅ Complete

- [x] Header (Lora movie title + hall/date/time in mono)
- [x] `SeatMap` integration with legend (Regular / Premium / Selected / Taken — no `$12`/`$18` numbers since the schema has one price per showtime, not per seat type; showing fake differentiated prices would misrepresent real data)
- [x] Sticky summary bar (seat count, mono seat labels, Lora total, "Book selected seats", fixed to viewport bottom)
- [x] Guest state (teal prompt card instead of book button) — verified live
- [x] Race-condition error banner — exact handoff copy, and now actually clears the selection on that specific error (via a new `clearSelection` flag on `BookingFormState`), matching "They've been cleared — pick again"
- [x] Mobile horizontal scroll for the seat grid (built into the shared `SeatMap` component)
- [x] **Consistency fix**: reconciled seat-label format across the whole app. The Phase B `SeatMap` component uses the handoff's row-letter/seat-number convention ("A1"), but the already-built booking confirmation/list pages used a different "1A" (number+letter) format from initial functional scaffolding. Added `lib/seat-label.ts` as the single source of truth and updated both booking pages — verified live end-to-end: the same physical seat now renders as "A3" identically on the seat map, the booking confirmation page, and the bookings list

### Design Phase G — Booking Confirmation (`app/(dashboard)/bookings/[id]`) — ✅ Complete

- [x] Centered 480px (`max-w-120`) success layout, teal check circle, "A confirmation has been sent to {email}" using the real session email
- [x] Ticket card: new `PosterChip` component (small tinted swatch, same hash-derived tint as `PosterTile`), movie title, `StatusPill`, Hall/Showtime/Seats/Total paid grid, dashed perforation, mono confirmation code (`CB-` + booking ID suffix) + decorative barcode strip
- [x] "Browse more movies" + conditional "Cancel booking" (danger, upcoming only) — verified live: all fields render correct real data (Hall 1, seat "A3", ₱275.00), `rounded-modal` and dashed-border utilities confirmed in compiled CSS

### Design Phase H — My Bookings (`app/(dashboard)/bookings`) — ✅ Complete

- [x] Booking card list (`PosterChip`, mono hall/time, `StatusPill`, Lora price, ghost-sm "Cancel" conditional on upcoming+not-cancelled)
- [x] Empty state (ticket icon, copy from handoff, "Browse movies" CTA) — verified live: all three statuses (CONFIRMED, PENDING would follow the same path, CANCELLED) confirmed rendering correctly with real DB data, including creating a fresh CONFIRMED booking specifically to verify that status/Cancel-button path (the existing test bookings had all drifted to CANCELLED from earlier manual testing)

### Design Phase I — Admin Overview (`app/(dashboard)/admin`) — ✅ Complete

- [x] Stat tiles (teal-50 icon chip + Lora number + label) for movies/halls/showtimes/bookings-today/active-bookings — auto-fill grid, each with a distinct Lucide icon (Film/Grid3x3/CalendarClock/TicketCheck/Receipt). Verified live against the actual database (including a moment where "Active bookings" showed 0 — double-checked the raw DB and confirmed that was correct real data, not a query bug)

### Design Phase J — Admin Movies (`app/(dashboard)/admin/movies`) — ✅ Complete

- [x] Two-column: list rows (`PosterChip`, mono meta, status badge, pencil/trash icon buttons) + inline "New movie" form on the same page
- [x] **Restructure**: the handoff puts the create form directly on the list page (matching the pattern already used for halls), not on a separate route — removed the now-redundant `/admin/movies/new` route entirely rather than leaving two ways to create a movie. Edit stays on its own route (`/admin/movies/[id]/edit`, restyled) since the handoff doesn't specify inline editing and it isn't worth the added client-state complexity
- [x] Verified live: list/form render correctly, old `/new` route now correctly 404s, and directly re-verified create/update/delete against the database after the restructuring (count returns to baseline after create+delete)

### Design Phase K — Admin Halls (`app/(dashboard)/admin/halls`) — ✅ Complete

- [x] Real `<table>` (Hall | Rows×Cols | Seats | Showtimes | delete) in a two-column layout with the create form on the right, matching Admin Movies' pattern + create form with the teal "auto-generated seat grid" info note (`info` icon)
- [x] Verified live: table renders correct real data (Hall 1: 8×10 = 80 seats, 9 showtimes), and directly re-verified the create/delete-hall transaction logic (auto-generated seat count correct) still works after restyling

### Design Phase L — Admin Showtimes (`app/(dashboard)/admin/showtimes`) — ✅ Complete

- [x] Real `<table>` (Movie | Hall | Date/time | Price | delete) + create form, same two-column pattern as Movies/Halls
- [x] Restructured to match: removed `/admin/showtimes/new`, form now inline on the list page (consistent with the Phase J/K decision)
- [x] Verified live: table and form render correctly, old `/new` route 404s, create/delete showtime logic re-verified directly against the database after restyling

### Design Phase M — Admin Bookings (`app/(dashboard)/admin/bookings`) — ✅ Complete

- [x] Segmented pill status filter (All/Pending/Confirmed/Cancelled) + real `<table>` (Movie | Customer name+mono email | Hall/time | Seats via `seatLabel()` | `StatusPill` | Price)
- [x] Verified live: table renders real seed data (correct emails, seat labels like "H5, H6, H7", all three statuses present), each status filter link returns 200 and correctly scopes results (PENDING filter returned exactly 1 row)

### Design Phase N — Cross-Page QA Pass (do last) — ✅ Complete

- [x] **Found and fixed a real gap**: `app/page.tsx` (the site root, `/`) was never covered by any Design Phase A–M and was still the unmodified `create-next-app` boilerplate (Vercel/Next.js logos, zinc dark-mode colors, "Deploy Now" button) — the most-visible page in the app had zero CineBook branding. Rewrote it as a real landing page: hero (Ticket icon mark, Lora headline, "Browse movies" / "Create an account" CTAs using existing `buttonVariants`) + a live "Now showing" preview strip (`PosterTile`, real `prisma.movie.findMany` data, empty state matches `/movies`). Verified live: 200 status, real seed movie titles rendering.
- [x] Consistency check across all screens — token usage (`bg-surface-*`, `text-fg-*`, `rounded-*`) confirmed consistent; only remaining raw Tailwind color usage (`bg-black/20` in `poster-tile.tsx`) is an intentional scrim overlay on a colored poster background, not a token gap
- [x] Responsive pass — seat map uses `overflow-x-auto` with `w-max` inner grid so wide halls scroll horizontally instead of squeezing; sticky booking bar (`fixed inset-x-0 bottom-0`) pairs with `pb-32` on the page container so content is never hidden behind it; grids use `repeat(auto-fill,minmax(...))` / responsive column counts across movies, admin overview, and the new landing page
- [x] Favicon/app icon — added `app/icon.svg`: teal-500 (`#1D9E75`) rounded-square mark with the same white clapperboard glyph used in the navbar logo (Next.js App Router auto-serves `app/icon.svg` as the site icon, confirmed 200 in the build's static route list)
- [x] Animation timing — confirmed in `app/globals.css` / `components/ui/button.tsx`: button transitions are `duration-150` (within the 120–150ms spec) with `active:scale-[0.982]`, PENDING status dot pulses via `@keyframes status-dot-pulse` at exactly `1.6s`; no decorative/gratuitous motion found anywhere else in the codebase
- [x] Final verification: `tsc --noEmit` clean, `eslint .` clean, `npm run build` succeeds with all expected routes present (including new `/icon.svg`)

---

## Notes

- Auth (Phase 1) unlocks meaningful testing of Phases 3–5, so it's the recommended next step.
- Booking creation (Phase 3) is the highest-risk piece technically — the seat double-booking guard needs to be verified under concurrent requests, not just happy path.
- Actual deployment (picking a host, connecting the account, going live) needs the user directly — an agent shouldn't be creating/configuring third-party hosting accounts unsupervised.
- Design Phase A (foundation/tokens) is a hard prerequisite for every other Design Phase — do it first, in its own session, before touching any individual page.
- `CineBook.dc.html` is a visual reference only, built on a throwaway component runtime — read it for layout/spacing/color/copy, never copy its markup/JS directly into the Next.js app.
