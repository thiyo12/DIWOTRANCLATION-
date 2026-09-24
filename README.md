# Ssaaxcy Solutions — Swiss Digital Concierge Platform

A complete platform to book professional interpreters in Switzerland and manage the
business from an admin panel. Combines a public booking website, a premium
**Swiss Life Concierge** service (letters, phone calls, appointments, translation)
and a full-featured admin panel.

- **Backend:** Node.js (Express) + SQLite via Node's built-in `node:sqlite` — no native builds.
- **Frontend:** plain HTML/CSS/JS — no framework, no build step.

---

## Requirements

- Node.js **22.5+** (uses built-in `node:sqlite`)

## Quick start

```bash
npm install
npm start
```

Then open:

| URL | What |
| --- | --- |
| `http://localhost:4000/` | Public website (book interpreters, Life Concierge) |
| `http://localhost:4000/admin` | Admin panel (password required) |

### Admin login

Development fallback only: `ssaaxcy-admin`. **Production refuses to start unless `ADMIN_PASSWORD` is explicitly configured.**

Change it via environment `.env`:

```bash
cp .env.example .env
# edit ADMIN_PASSWORD
```

The `.env` file also supports `PORT`.

### Seed / reset

```bash
npm run seed      # re-seed services, languages, durations and catalog defaults (no fake worker roster)
rm -rf data       # delete the SQLite database entirely (fresh start)
```

---

## Pages

**Public site**
- `/` — landing page
- `/services.html` — services & prices (filterable)
- `/booking.html` — 5-step interpreter booking wizard
- `/concierge.html` — Swiss Life Concierge (request help)
- `/confirmation.html` — booking confirmation by reference

**Admin panel** (`/admin`, password-protected)
- `login.html` — sign-in
- `dashboard.html` — stats, upcoming appointments, top services/languages
- `bookings.html` — manage bookings (confirm / complete / cancel / reschedule / delete)
- `concierge.html` — Life Concierge request inbox
- `interpreters.html` — interpreter profiles
- `catalog.html` — edit services & prices, languages, travel fee, brand
- `finance.html` — payments log, refunds, printable invoices

---

## Booking flow

1. Select an **enabled language** from the Admin-managed catalog (currently German, English and Tamil by default)
2. Select **situation / service** (doctor, hospital, police, immigration, Gemeinde, school, bank, insurance, job interview, government…)
3. Choose **date & time** (Sundays excluded, past times disabled) + duration (30 / 60 / 90 / 120 min)
4. Choose **online video or on-site** interpreter + contact details
5. Select **TWINT or bank transfer** → Admin approves the request → customer pays → Admin confirms payment

Pricing: `hourly rate × duration factor (0.5 / 1 / 1.4 / 1.8)`; on-site adds a flat travel fee
(editable in Admin → Catalog).

---

## REST API

Public endpoints (no auth):

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/catalog` | services, languages, durations, settings |
| POST | `/api/bookings` | create a booking |
| GET | `/api/bookings/:ref` | fetch a booking by reference |
| POST | `/api/concierge` | submit a concierge request |

Admin endpoints (require the `ssx_session` cookie set at `/admin/api/login`):

| Method | Path | Description |
| --- | --- | --- |
| POST | `/admin/api/login` · `/logout` | sessions |
| GET | `/admin/api/me` | who am I |
| GET | `/admin/api/dashboard` | stats & analytics |
| GET | `/admin/api/bookings` | list (query: `status`, `mode`) |
| PATCH | `/admin/api/bookings/:id` | update booking fields |
| DELETE | `/admin/api/bookings/:id` | delete booking |
| GET | `/admin/api/concierge` | list requests |
| PATCH/DELETE | `/admin/api/concierge/:id` | update / delete |
| GET/POST/PATCH/DELETE | `/admin/api/interpreters…` | interpreter CRUD |
| GET/POST/PATCH/DELETE | `/admin/api/services…` · `/languages` · `/settings` | catalog CRUD |
| GET/PATCH | `/admin/api/payments` | payments list / refund |

---

## Project structure

```
.
├── server.js            # Express server, REST API, admin auth
├── db.js                # SQLite schema + seed data
├── package.json
├── .env.example
├── data/                # ssaaxcy.db (created at runtime)
├── index.html           # landing page
├── services.html        # services & prices
├── booking.html         # booking wizard
├── concierge.html       # Life Concierge
├── confirmation.html    # booking confirmation
├── css/style.css        # public design system
├── js/main.js           # shared data + helpers
├── js/booking.js        # booking wizard logic
├── admin/               # admin panel
│   ├── css/admin.css
│   ├── js/admin.js      # admin shell + API client
│   └── *.html           # login, dashboard, bookings, concierge,
│                        # interpreters, catalog, finance
```

---

## Notes

- **Launch payments use manual TWINT / bank-transfer confirmation.** A real TWINT Payment Link may be configured; later this can be replaced with a PSP/webhook integration.
  (e.g. Stripe, Braintree, Saferpay) behind `POST /api/bookings` when going live.
- Booking created through the site is stored in **SQLite**; when the backend
  is not running, the booking wizard falls back to `localStorage`.
- Debug logging appears in the terminal; the server never crashes on bad input
  (global error handler → 500 JSON).
## Current booking model

Ssaaxcy is a service company, not a worker marketplace.

- With no worker roster configured, the system behaves as a single-owner calendar.
- When staff are added in Admin, the primary worker is preferred first.
- If the primary worker is busy, another active worker supporting the requested language can take the slot.
- Customers book Ssaaxcy, not an individual worker.
- Admin can reassign a booking manually.

## Secure customer access

New bookings, document requests and concierge requests receive a private high-entropy access token. The token is stored server-side only as a SHA-256 hash. Status pages and customer file downloads require that token. If the customer loses the secure link, they can recover access using the matching reference and email address.

## Production storage

Persist both:
- the SQLite database file
- `data/uploads`

Do not run those on ephemeral serverless storage.
