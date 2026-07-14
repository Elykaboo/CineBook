# Handoff: CineBook — cinema ticket reservation app

## Overview
CineBook is a cinema ticket reservation web app. Users browse movies, view showtimes,
select seats on a visual seat map, and book tickets. Admins manage the catalog (movies,
halls, showtimes) and view all bookings. This package documents a complete visual design
system and every screen, applied consistently from the **ScribeRAG Design System**.

The target stack is **Next.js (React) + Tailwind CSS**. The app is already functional;
the job is to apply this design — not to change behavior.

## About the design files
`CineBook.dc.html` is a **design reference created in HTML** — a prototype showing intended
look and behavior. It is **not production code to copy**. Recreate these screens in your
Next.js + Tailwind codebase using its existing patterns (components, routing, data fetching).
The HTML uses a light in-house component runtime that is irrelevant to your app; read it for
layout, spacing, color, and copy only.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and states are final. Recreate the UI
pixel-accurately using the tokens below. Where this doc gives a hex/px value, use it exactly.

---

## Design tokens

Put these in your Tailwind theme (`tailwind.config.js` → `theme.extend`) and/or CSS variables.
They come verbatim from the ScribeRAG token files bundled here under `tokens/`.

### Color — brand + neutrals
| Token | Hex | Use |
|---|---|---|
| teal-50 | `#EBF7F2` | active nav bg, subtle brand fill, indexed/confirmed tint |
| teal-500 | `#1D9E75` | **brand primary** — CTAs, active nav, brand mark, focus ring |
| teal-600 | `#178A64` | primary button hover |
| teal-700 | `#107350` | active-nav text, brand text on light |
| neutral-0 | `#FFFFFF` | cards, panels, modals (`--surface-1`) |
| neutral-50 | `#F7F6F3` | page background (`--surface-2`) |
| neutral-100 | `#EEECEA` | subtle section (`--surface-3`), taken-seat bg |
| neutral-200 | `#E2DED9` | default border (`--border-1`) |
| neutral-300 | `#C8C4BE` | strong border (`--border-2`) |
| neutral-400 | `#A8A39C` | muted / placeholder text (`--fg-3`) |
| neutral-600 | `#5C5750` | secondary text (`--fg-2`) |
| neutral-900 | `#1A1714` | primary text (`--fg-1`) — warm black, never pure #000 |

Two surface levels only. **No gradients, no textures, no background images** in product UI.

### Color — status badges (CineBook booking statuses)
The DS ships amber/teal/gray statuses; per the brief we use an explicit green for CONFIRMED.
Pills are full-radius, JetBrains Mono, uppercase, with a 6px leading dot.

| Status | Bg | Text | Dot | Notes |
|---|---|---|---|---|
| CONFIRMED | `#E7F6EC` | `#15803D` | `#22C55E` | green (added for CineBook) |
| PENDING | `#FFF8EC` | `#B45309` | `#F59E0B` | dot pulses (1.6s ease-in-out opacity) |
| CANCELLED | `#EEECEA` | `#7D786F` | `#A8A39C` | neutral gray |

### Color — seat states (CineBook-specific)
Seat = 28×26px button, `border-radius: 7px 7px 5px 5px`, JetBrains Mono 8.5px, 1px border.
| State | Bg | Border | Text | Notes |
|---|---|---|---|---|
| Regular available | `#FFFFFF` | `#C8C4BE` | `#7D786F` | $12 |
| Premium available | `#FFF8EC` | `#FCD34D` | `#B45309` | $18 (gold) |
| Selected | `#1D9E75` | `#178A64` | `#FFFFFF` | any tier |
| Taken / unavailable | `#EEECEA` | `#E2DED9` | `#C8C4BE` | disabled, `cursor: not-allowed`, opacity .7 |

### Color — typographic poster tints (CineBook-specific)
Posters are typographic tiles (no photography). Each is a solid dark bg + light fg, 2:3 aspect.
| Tint | Bg | Fg |
|---|---|---|
| teal | `#0F3D30` | `#EBF7F2` |
| neutral | `#2A2622` | `#F7F6F3` |
| amber | `#4A2E08` | `#FFF8EC` |
| red | `#4A1616` | `#FEF2F2` |
| violet | `#2E1A52` | `#F5F3FF` |
| blue | `#16294A` | `#EFF6FF` |

### Typography
- **Display** — Lora (serif): hero headings, movie titles, screen headers. Max 2–3 per screen.
- **UI / body** — DM Sans (sans): all interface text, nav, labels, body, CTAs.
- **Metadata** — JetBrains Mono: status pills, seat labels, timestamps, prices, codes. Never body/CTAs.

Sentence case everywhere. Numeric always ("3 seats", not "three"). No emoji in product UI.

### Spacing, radii, borders, shadows
- 4px base grid. Content padding ~24px horizontal / 20px vertical.
- Radii: buttons 10px, inputs 10px, cards/panels 14px, modals 18px, badges/pills 9999px.
- Borders: default 1px `#E2DED9`; strong 1px `#C8C4BE`; focus 1px teal + 2px ring.
- Flat aesthetic — cards use **no** shadow by default, `shadow-xs` on hover only. Shadows only for
  dropdowns (`shadow-md`) and modals (`shadow-lg`).

### Animation
120–150ms micro-interactions, fast ease-out (never bouncy). Processing/PENDING dot: 1.6s
ease-in-out opacity pulse. Button press `scale(0.982)`. No decorative/looping animation.

### Icons
Lucide Icons only, `currentColor` stroke, 1.75px, rounded caps. 14–16px in nav/inline, 12px dense,
20px featured. Icons used across CineBook: `clapperboard`, `film`, `armchair`, `ticket`,
`ticket-check`, `receipt`, `calendar-clock`, `grid-3x3`, `layout-dashboard`, `log-in`, `user-plus`,
`shield`, `check`, `lock`, `alert-circle`, `alert-triangle`, `triangle-alert`, `info`, `pencil`,
`trash-2`, `file-question`, `loader`, `component`.

---

## Components to build
Reuse the ScribeRAG core components (props from the DS): `Button` (primary/secondary/ghost/danger ×
sm/md/lg), `Input` (label/error/helperText), `Card`, `Badge`, `Avatar`. CineBook adds:
- **StatusPill** — CONFIRMED/PENDING/CANCELLED per the status table above.
- **PosterTile** — typographic poster (tint bg, genre eyebrow in mono, title in Lora, rating chip).
- **SeatButton** — the four seat states above; disabled when taken.
- **SeatMap** — rows (letter label) × 12 columns with an aisle gap after column 6; horizontally
  scrollable on mobile; a curved "SCREEN" bar above.
- **Navbar** — logo + "Movies"; right side varies by role (see below).
- **AdminSubnav** — Overview / Movies / Halls / Showtimes / Bookings tabs.

---

## Screens / views

Global: persistent app navbar. Left sidebar in the prototype is a **design navigator only** — not
part of the product; ignore it when implementing.

### Navbar (role-aware)
- Logo (clapperboard in teal rounded square + "CineBook" in Lora) + "Movies" nav link.
- **Guest**: "Log in" (ghost) + "Register" (secondary/outline).
- **User**: "My bookings" link + avatar (initials, auto-color) + name + "Log out".
- **Admin**: "Admin" link (shield icon) + violet avatar + name + "Log out".

### 1. Login
Centered 400px card. Lora "Welcome back" + subtitle. Inputs: Email, Password. Primary full-width
"Log in". Inline error banner (red-50 bg, red-200 border, `alert-circle`): "That email and password
don't match. Check them and try again." Link: "New to CineBook? Create an account".

### 2. Register
Same card pattern. Inputs: Full name, Email, Password. Per-field validation — Email error
"Enter a valid email address, like you@example.com."; Password helper "Use 8 or more characters with
a mix of letters and numbers." Primary "Create account". Link to Login.

### 3. Movie listing
Header "What's on" (Lora) + segmented tabs **Now showing / Coming soon**. Grid of poster cards
(`auto-fill minmax(200px,1fr)`, 18px gap): PosterTile + title (DM Sans 14/600) + "{genre} · {duration}"
in mono. Click → detail. Empty state (per tab): `film` icon in a gray circle, "No movies in this
category yet", "Check back soon — new titles are added every week."

### 4. Movie detail
Two columns: left 220px poster tile (2:3); right title (Lora 30), meta pills (genre / duration /
rating), description paragraph (~60ch), then **Showtimes grouped by date**. Each date is a mono
eyebrow; showtimes are outlined buttons showing time (15/600) + hall name; hover → teal border +
teal-50 bg. Click → seat selection. Empty: "No upcoming showtimes scheduled".

### 5. Seat selection (most complex)
Header: movie title (Lora) + "Hall · date · time" in mono. Curved SCREEN bar. Seat map (rows A–H ×
12, aisle after col 6), legend (Regular $12 / Premium $18 / Selected / Taken). Sticky summary bar:
"{n} seats selected" + selected labels (mono) + Total (Lora) + primary "Book selected seats"
(disabled until ≥1 seat). **Guest** sees a teal prompt card ("Log in to reserve your seats…") with a
"Log in to book" button instead. **Race error** banner (red): "One or more of your selected seats were
just booked by someone else. They've been cleared — pick again…". Must scroll horizontally on mobile.

### 6. Booking confirmation
Centered 480px. Success check in teal circle, "You're booked", "A confirmation has been sent to …".
Ticket card (18px radius): poster chip + movie title + StatusPill; grid of Hall / Showtime / Seats /
Total paid; dashed perforation; mono confirmation code + barcode strip. Buttons: "Browse more movies"
(secondary) + "Cancel booking" (danger) — cancel shown only when the showtime is upcoming.

### 7. My bookings (user)
Header + list of booking cards: poster chip, movie, "{hall} · {when}" (mono), "Seats …", StatusPill,
price (Lora), "Cancel" (ghost sm) when upcoming & not cancelled. Empty: `ticket` icon, "You haven't
booked any tickets yet", "When you book a showtime, it'll show up here." + "Browse movies" primary.

### 8. Admin — overview
Stat tiles (`auto-fill minmax(180px,1fr)`): each = teal-50 icon chip + big Lora number + label.
Tiles: Total movies (12), Cinema halls (3), Showtimes (48), Bookings today (37), Active bookings (214).

### 9. Admin — movies
Two columns. Left: list rows (poster chip, title, "{genre} · {dur} · {rating}" mono, status chip
Now Showing/Coming Soon, edit `pencil` + delete `trash-2` icon buttons). Right: "New movie" form —
Title, Description (textarea), Genre + Duration, Poster URL, Rating select (PG/PG-13/R), Status select
(Now Showing/Coming Soon), primary "Save movie".

### 10. Admin — cinema halls
Left: table (Hall | Rows × Cols | Seats | Showtimes | delete). Right: "New hall" form — Hall name,
Rows + Columns (number), teal info note "The seat grid is generated automatically from rows ×
columns.", primary "Create hall".

### 11. Admin — showtimes
Left: table (Movie | Hall | Date/time | Price | delete). Right: "New showtime" form — Movie select,
Hall select, Date & time (`datetime-local`), Ticket price, primary "Add showtime".

### 12. Admin — bookings
Header + segmented filter **All / Pending / Confirmed / Cancelled**. Table: Movie | Customer
(name + email mono) | Hall / time | Seats | StatusPill | Price. Filter narrows rows by status.

### 13. Shared states
- **Loading**: shimmer skeletons matching the target layout (title bar + card grid). Copy names the
  operation, e.g. "Loading showtimes…".
- **Error**: centered `triangle-alert` in red circle, "Something went wrong", "We couldn't load this
  page. This is usually temporary — try again in a moment.", primary "Try again".
- **404**: big Lora "404" in teal, "We couldn't find that page", subtitle, "Back to movies".

---

## Interactions & behavior
- Navbar right side and the account link switch by role (guest / user / admin).
- Movie tabs filter the grid; empty state shows when a category has no titles.
- Showtime click → seat selection.
- Seat click toggles selection (taken seats are inert); running count + total update live; "Book"
  disabled at 0 seats; guests get the login prompt instead of the button.
- Booking "Cancel" only for upcoming, non-cancelled bookings.
- Admin bookings filter is client-side by status.
- Transitions 120–250ms ease-out; PENDING dot pulses; no decorative motion.

## State management
- `role`: guest | user | admin (drives navbar, seat-page CTA, account link).
- `movieTab`: now | coming.
- `selectedSeats`: set of seat ids; derive count + total (regular $12 / premium $18).
- `bookingFilter`: all | pending | confirmed | cancelled.
- Data: movies, showtimes (by date), halls, bookings (user + system-wide) from your existing API.

## Assets
- Favicon/app icon: reuse the teal clapperboard mark treatment.
- Posters: typographic tiles by tint (table above) — no photography. Swap to real poster images later
  by dropping an `<img>` into the tile if desired.
- Icons: Lucide (list above). Empty-state graphics are Lucide glyphs in a neutral circle.

## Files
- `CineBook.dc.html` — the full high-fidelity prototype (all screens + a component reference view).
- `tokens/` — the ScribeRAG token CSS (colors, typography, spacing, radius, shadows) to port into
  your Tailwind config / CSS variables.
