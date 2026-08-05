# HistoricStays

A Booking.com-style stay search and booking app, built as a take-home project. Guests can browse historic stays across a handful of European cities, view details/reviews/availability, and complete a mocked checkout end to end against a real backend.

## Stack

- **Framework:** Next.js 16 (App Router) — route handlers double as the backend API, no separate server
- **Language:** TypeScript (strict mode)
- **UI:** Tailwind CSS v4, Radix UI primitives (Dialog, Popover, Tabs, DropdownMenu, Toggle), `react-day-picker`, `lucide-react`
- **Server state:** TanStack React Query
- **Client state:** Zustand (`persist` for the session)
- **Database:** SQLite via `@libsql/client` — a local file (`file:local.db`) in development, [Turso](https://turso.tech) in production, same client either way
- **i18n:** custom dictionary-based setup, English/Portuguese/Spanish throughout
- **Tests:** Vitest + Testing Library
- **CI:** GitHub Actions (lint, typecheck, test, build)

## Getting started

```bash
npm install
cp .env.example .env.local   # defaults to a local SQLite file, no editing needed
npm run db:seed              # creates local.db and loads the seed data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Everything — frontend and API — runs from this one command.

## Features

- **Search & browse** — home page with a destination/dates/guests search bar, a curated "available stays" grid, and per-stay cards with photo, price, and rating.
- **Stay details** — photo gallery with a full-screen modal viewer, historic note, description, amenities, and address.
- **Reviews** — guests can read existing reviews for a stay and submit their own (validated and sanitized like any other form).
- **Availability & live pricing** — a date-range calendar on the stay page that disables already-booked and blocked dates (fetched per stay, not just the static seed data). As soon as valid check-in/check-out dates are picked, the UI calculates and shows nights × nightly price = total live, before the guest reserves.
- **Checkout** — 3-step flow (trip details → payment → confirmation) with a progress stepper, real-time field validation and error messaging (including card number/expiry/CVV formatting), and a booking confirmation screen.
- **Backend API** — every screen is backed by real Next.js route handlers (stays, availability, bookings, reviews, auth) persisting to SQLite, not mock/static data.
- **Double-booking protection** — enforced both in the UI (calendar) and independently in the API (a booking request for an already-taken range is rejected server-side), so the UI check is a convenience, not the source of truth.
- **Auth** — register/login with route guards that redirect an already-logged-in user away from `/login` and `/register`.
- **My bookings** — a list of the logged-in user's bookings, with an in-page prompt to log in if not authenticated.
- **Internationalization** — every screen and string in English, Portuguese, and Spanish, with a language switcher in the header.
- **Responsive design** — usable from mobile to desktop.
- **Loading, empty, and error states** — spinners on data-dependent screens (notably the stay detail page), empty states for no results, and inline error messaging on form/API failures.
- **Input security** — shared length limits and XSS sanitization applied to every form field, enforced both client-side (immediate feedback) and server-side (never trusting the client alone).
- **Accessibility** — labeled form fields with `aria-invalid`/`aria-describedby` wiring, keyboard-operable Radix primitives (dialog, popover, dropdown, tabs).

## Design inspiration

The UI/UX takes direct inspiration from Booking.com — the search bar layout, the stay card grid, the checkout stepper, and the overall information hierarchy on the stay detail page were all modeled after how Booking.com structures the same flows, adapted to this app's own visual identity (colors, typography, historic-stays framing) rather than copied verbatim.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the app locally |
| `npm run build` / `npm start` | Production build / run |
| `npm run db:seed` | (Re)create the SQLite file and load seed data |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Run the test suite (Vitest) |
| `npm run format` / `format:check` | Prettier |

## Architecture

```
app/
  api/          route handlers = the backend (stays, bookings, auth, favorites, reviews, availability)
  stays/[id]/   stay detail page
  checkout/[id]/  3-step checkout (details -> payment -> confirmation)
  login/ register/ bookings/
components/     UI, grouped by feature (stay, checkout, bookings, auth, layout, ui)
lib/
  db.ts         libsql client (env-driven: local file or Turso)
  mappers.ts    DB row <-> API type mapping
  availability.ts  booking-conflict / date-range logic
  forms/        shared validation constants, sanitization, payment formatting
  http.ts       route-handler error wrapper used by every API route
  stores/       Zustand session store
db/
  schema.sql, seed.ts
```

Data flow: pages/components call the route handlers through small fetch wrappers (`lib/api`), cached and invalidated with React Query. The only client-side state is the logged-in user (Zustand, persisted to `localStorage`).

## Decisions & trade-offs

Given the timebox, scope was deliberately cut in a few places:

- **Auth is intentionally simplified.** No password hashing, no JWT/server session — the "session" is just the logged-in user's public data kept in `localStorage`. This was a conscious call to spend the available time on the booking flow instead of building real auth infrastructure. Route guards on `/login` and `/register` are therefore client-side only.
- **`/bookings` has no route guard** — it shows an in-page "please log in" prompt instead of redirecting, by design (not every protected-feeling page needed the same treatment).
- **Payment is mocked.** Card fields are formatted and validated client-side, but nothing is charged or sent to a real processor.
- **Map and breadcrumbs were cut from the stay detail page**; the address shown is illustrative, not geocoded.
- **Favorites (the heart icon on stay cards) is out of scope** — confirmed as non-essential against the brief, so the booking flow got the time instead.
- **Double-booking is prevented on both ends:** the calendar UI disables already-booked/blocked ranges (fetched live per stay), and the API independently rejects overlapping bookings — the UI check is a convenience, not the source of truth.

## Testing

The suite covers the highest-value logic rather than aiming for full coverage: booking-conflict/availability rules, payment formatting/validation, data mappers (including that user API responses never leak the password field), input sanitization, the shared API error handling, and a handful of components with non-trivial behavior (form validation UX, the checkout stepper, translated amenities, auth-aware header, stay info formatting).

**This is deliberately a thin slice, not full coverage** — given the timebox, breadth of tests was traded off against finishing the product itself. Notably missing: API route/integration tests (hitting the route handlers directly), end-to-end tests of the full booking flow, and broader component coverage. This is the area I'd invest in first with more time — see below.

Run with `npm run test`.

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: lint → typecheck → test → build. No secrets required — the build and tests don't touch a real database.

## Next steps

With more time, in rough priority order:

1. **Deeper test coverage** — API route tests, end-to-end coverage of the booking flow, more component tests (this was the most consciously under-scoped area, see Testing above).
2. Real authentication (hashed passwords, server-side sessions).
3. Favorites.
4. A real map on the stay detail page.
5. Deploy pipeline to Vercel + Turso for production.

## Note on LLM usage

This project was built collaboratively with an AI coding assistant (Claude Code) — pair-programming style, with plans reviewed and confirmed before each implementation step. All product and architecture decisions, and the final code, were reviewed by me.
