# CineBook — Project Context

A Cinema Ticket Reservation System, built as a university final project.

## Purpose

Lets users browse movies, view showtimes, pick seats, and book tickets. Admins manage movies, cinema halls, showtimes, and view all bookings. Built to demonstrate a full-stack app with authentication, relational data modeling, and a real booking/concurrency problem (preventing the same seat being sold twice).

## Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL, hosted on Neon
- **ORM:** Prisma 6 (`prisma-client-js` generator — deliberately not v7, to stay on the widely-documented setup)
- **Auth:** NextAuth v5 (Auth.js), Credentials provider, bcrypt password hashing, JWT sessions carrying `id` + `role`
- **Data mutations:** Server Actions (`/actions`), not a separate REST API
- **Validation:** zod (`/lib/validations`)

## Repository & Branching

- Remote: `https://github.com/Elykaboo/CineBook.git`
- `main` and `stage` are protected — no direct commits.
- All work happens on branches named `kyle/...`, branched from the tip of `stage`.
- PRs target `stage`, not `main`.
- Current active branch: `kyle/scaffold-cinebook`.

## Data Model

Seven Prisma models: `User`, `Movie`, `CinemaHall`, `Seat`, `Showtime`, `Booking`, `BookingSeat`.

- A `CinemaHall` has a grid of `Seat`s (row × column), each `REGULAR` or `PREMIUM`.
- A `Showtime` pairs a `Movie` with a `CinemaHall` at a start time and price.
- A `Booking` belongs to a `User` and a `Showtime`, and has many `BookingSeat` join rows.
- **Double-booking guard:** `BookingSeat` has a unique constraint on `(showtimeId, seatId)`. Note `showtimeId` is denormalized onto `BookingSeat` (no direct relation, just a plain column) — it exists solely to make that composite unique constraint possible. Application code creating a booking must set it correctly and atomically alongside `bookingId`/`seatId`, in the same transaction as the `Booking` row.

## Auth Model

- `auth.config.ts` — edge-safe config (used by middleware): pages, `authorized` callback gating `/dashboard/*`, JWT/session callbacks attaching `id`/`role`.
- `auth.ts` — full config with the Credentials provider (needs Node runtime for bcrypt + Prisma).
- Middleware (`middleware.ts`) protects everything under `/dashboard`; unauthenticated users are redirected to `/login`.
- Session `role` is `ADMIN | USER`, read via `auth()` in Server Components/Actions to gate admin-only mutations.

## Folder Structure

```
app/
  (auth)/login, (auth)/register        — public auth pages
  (public)/movies                      — public browsing
  (dashboard)/admin, (dashboard)/bookings — authenticated views, gated by middleware
  api/auth/[...nextauth]               — NextAuth route handler
actions/                                — Server Actions (mutations)
lib/
  prisma.ts                            — Prisma client singleton
  validations/                         — zod schemas
prisma/
  schema.prisma
  seed.ts                              — 8 movies, 2 halls, generated seats, admin+sample user
types/next-auth.d.ts                   — session/JWT type augmentation
plan/                                  — project planning docs (this file + PROJECT_PLAN.md)
```

## Environment

- `.env` (gitignored) holds `DATABASE_URL` (Neon Postgres connection string) and `AUTH_SECRET`.
- `.env.example` is committed as the template — force-added since `.gitignore` blanket-ignores `.env*`.
- Seeded test accounts: `admin@cinebook.dev` / `user@cinebook.dev`, password `password123` for both — not usable yet since login/register UI hasn't been built.

## Current Status

Backend/schema fully scaffolded, migrated, and seeded against a live Neon database. No UI has been built beyond placeholder stub pages (`<div>Login</div>` etc.) — this was intentional, to confirm schema and structure before investing in UI. See `PROJECT_PLAN.md` for the phased build-out from here (auth UI → movie browsing → booking flow → dashboards → polish → testing → deployment).
