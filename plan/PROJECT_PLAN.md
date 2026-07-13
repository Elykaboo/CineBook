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

- [ ] Movie listing page (`/movies`) — grid of posters, title, genre, rating
- [ ] Filter/tab by status: Now Showing vs Coming Soon
- [ ] Movie detail page (`/movies/[id]`) — description, duration, rating, showtimes
- [ ] Showtime list on detail page grouped by date
- [ ] Empty/loading states for movie fetches
- [ ] Basic search or genre filter (stretch)

---

## Phase 3 — Seat Selection & Booking Flow

- [ ] Showtime page (`/showtimes/[id]`) — seat map rendered from hall rows/columns
- [ ] Seat map reflects REGULAR vs PREMIUM pricing/styling
- [ ] Real-time-ish seat availability (query already-booked seats for that showtime)
- [ ] Seat selection state (multi-select, running total price)
- [ ] Booking confirmation step (selected seats + total price review)
- [ ] `createBooking` server action:
  - [ ] Validates seats still available (transaction-safe against unique constraint)
  - [ ] Creates Booking + BookingSeat rows atomically
  - [ ] Sets status PENDING → CONFIRMED (or CONFIRMED directly for MVP)
  - [ ] Handles race condition failure gracefully (seat taken mid-selection)
- [ ] Booking success page / confirmation screen

---

## Phase 4 — User Dashboard

- [ ] `/dashboard/bookings` — list of the logged-in user's bookings
- [ ] Booking detail view (movie, showtime, seats, total, status)
- [ ] Cancel booking action (sets status CANCELLED, frees seats)
- [ ] Empty state for no bookings yet

---

## Phase 5 — Admin Dashboard

- [ ] `/dashboard/admin` — overview (counts: movies, showtimes, bookings today)
- [ ] Movie management: create/edit/delete movie (form + server actions)
- [ ] Cinema hall management: create hall (rows/columns → auto-generate seats)
- [ ] Showtime management: create/edit/delete showtime (movie + hall + time + price)
- [ ] Bookings view: list all bookings across users, filter by status/date
- [ ] Admin-only route guard (role check beyond just "logged in")

---

## Phase 6 — Polish & Cross-Cutting Concerns

- [ ] Consistent loading/skeleton states across data-fetching pages
- [ ] Consistent error boundaries / error.tsx per route group
- [ ] Form validation error messaging pattern (shared component)
- [ ] Responsive layout pass (mobile seat map is the tricky one)
- [ ] Accessibility pass (labels, focus states, keyboard nav on seat map)
- [ ] Toast/notification system for action feedback (booking success, errors)

---

## Phase 7 — Testing & Hardening

- [ ] Manual test pass: full booking flow end-to-end
- [ ] Manual test pass: concurrent booking of the same seat (double-booking guard)
- [ ] Manual test pass: role-based access (USER can't reach admin routes)
- [ ] Seed script re-run idempotency check
- [ ] Review server actions for auth checks (every mutating action verifies session)

---

## Phase 8 — Deployment

- [ ] Production Postgres confirmed (Neon prod branch or separate DB)
- [ ] Environment variables set in hosting provider (DATABASE_URL, AUTH_SECRET)
- [ ] Deploy to Vercel (or chosen host)
- [ ] Run migrations against production DB
- [ ] Smoke test production deployment
- [ ] Final README with setup instructions for grading/demo

---

## Notes

- Auth (Phase 1) unlocks meaningful testing of Phases 3–5, so it's the recommended next step.
- Booking creation (Phase 3) is the highest-risk piece technically — the seat double-booking guard needs to be verified under concurrent requests, not just happy path.
