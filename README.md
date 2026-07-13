# CineBook

A cinema ticket reservation system — browse movies, pick seats, book tickets. Built with Next.js 15 (App Router), TypeScript, PostgreSQL, Prisma, NextAuth v5, and Tailwind CSS.

See [plan/PROJECT_CONTEXT.md](plan/PROJECT_CONTEXT.md) for architecture details and [plan/PROJECT_PLAN.md](plan/PROJECT_PLAN.md) for the build-out checklist.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — a PostgreSQL connection string (this project was built against [Neon](https://neon.tech))
- `AUTH_SECRET` — generate one with `npx auth secret`

### 3. Run migrations and seed the database

```bash
npx prisma migrate dev
npm run db:seed
```

The seed script resets and recreates: 8 movies, 2 cinema halls (with generated seats), showtimes, and two test accounts:

| Role  | Email                | Password      |
|-------|-----------------------|----------------|
| Admin | admin@cinebook.dev    | password123    |
| User  | user@cinebook.dev     | password123    |

**Note:** `npm run db:seed` wipes and recreates all movies/halls/showtimes/bookings each time it runs (it's idempotent by resetting, not by skipping). Don't run it against a database with real user data you want to keep.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  (auth)/login, (auth)/register   — public auth pages
  (public)/movies, showtimes      — public browsing + seat selection
  (dashboard)/bookings            — user's booking history
  (dashboard)/admin               — admin CRUD (movies, halls, showtimes, bookings)
  api/auth/[...nextauth]          — NextAuth route handler
actions/                          — Server Actions (auth.ts, bookings.ts, admin.ts)
lib/                              — Prisma client singleton, zod validation schemas
prisma/                           — schema, migrations, seed script
components/                       — shared UI (navbar, form error display)
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Reset and reseed the database |

## Deployment

This app is set up to deploy on any Node.js host that supports Next.js (e.g. Vercel).

1. Push the repo to GitHub (already done — this is a GitHub-backed project).
2. Import the project into your hosting provider.
3. Set the environment variables (`DATABASE_URL`, `AUTH_SECRET`) in the provider's dashboard — use production values, not the ones in your local `.env`.
4. Run `npx prisma migrate deploy` against the production database (not `migrate dev`, which is for local development).
5. Deploy.

**Before deploying:** decide whether production uses the same Neon database as development or a separate one. Sharing one database between dev and prod means your local testing affects what graders/users see live — a separate Neon branch or project is safer for a course submission.
