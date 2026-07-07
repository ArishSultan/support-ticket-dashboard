# Support Ticket Dashboard

A compact, production-minded support-ticket dashboard: view, create, update, filter,
and (for admins) delete customer support tickets. Built as an Nx monorepo with a
Next.js frontend, a NestJS REST API, and PostgreSQL for persistence.

---

## 1. Technologies used

**Monorepo / tooling**
- [Nx](https://nx.dev) 23 workspace, [pnpm](https://pnpm.io) package manager
- TypeScript end-to-end

**Frontend — `apps/portal`**
- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- [Tailwind CSS](https://tailwindcss.com) 4 with [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com) primitives
- [TanStack Query](https://tanstack.com/query) (data fetching/caching) + [TanStack Form](https://tanstack.com/form) (forms & validation)
- [`@dnd-kit`](https://dndkit.com) for the drag-and-drop Kanban board
- [better-auth](https://www.better-auth.com) client (cookie-based sessions) + [sonner](https://sonner.emilkowal.ski) toasts

**Backend — `apps/api`**
- [NestJS](https://nestjs.com) 11 (Express) with a global `/api` prefix
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL (`pg`)
- better-auth via [`@thallesp/nestjs-better-auth`](https://github.com/thallesp/nestjs-better-auth) (email/password, sessions, roles)
- `class-validator` request validation, Swagger/OpenAPI + [Scalar](https://scalar.com) API reference
- Socket.io gateway for live ticket updates

**Shared libraries**
- `libs/database` — Drizzle schema, enums, relations, and SQL migrations
- `libs/api-client` — typed React Query hooks generated from the API's OpenAPI spec via [Orval](https://orval.dev)

**Testing**
- [Playwright](https://playwright.dev) end-to-end tests (`apps/portal-e2e`)
- [Jest](https://jestjs.io) for unit / API tests

---

## 2. Project structure

```
apps/
  api/          NestJS REST API  (http://localhost:4000/api)
  portal/       Next.js frontend (http://localhost:3000)
  portal-e2e/   Playwright e2e tests
  api-e2e/      Jest API e2e tests
libs/
  database/     Drizzle schema + migrations  (@org/database)
  api-client/   Orval-generated typed API client (@org/api-client)
scripts/
  seed.mjs           Seed sample tickets
  promote-admin.mjs  Promote a user to the admin role
```

---

## 3. Prerequisites

- **Node.js 20+**
- **pnpm** (`npm i -g pnpm`)
- **PostgreSQL 14+** running locally (or a hosted URL)

---

## 4. Installation & setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create a database (any name; "support" is used below)
createdb support

# 3. Configure environment
cp apps/api/.env.example apps/api/.env
#    then edit apps/api/.env and set:
#      DB_URL=postgresql://<user>:<pass>@localhost:5432/support
#      BETTER_AUTH_SECRET=<a random 32+ character string>

# 4. Apply database migrations (Drizzle) — required before the first run
pnpm db:migrate

# 5. (Optional) Seed sample tickets so the list is populated
pnpm seed
```

### Database migrations (Drizzle)

Migrations live in `libs/database/migrations` and must be applied to the database
in your `apps/api/.env` `DB_URL` **before starting the app the first time** (and
after pulling new migrations):

```bash
pnpm db:migrate      # apply all pending migrations
```

If you change the schema (`libs/database/src/schema.ts`), generate a new migration
from the diff, then apply it:

```bash
pnpm db:generate     # write a new SQL migration from the schema changes
pnpm db:migrate      # apply it
```

Both scripts wrap `drizzle-kit` with the config at `libs/database/drizzle.config.ts`
(which reads `DB_URL` from `apps/api/.env`). To call `drizzle-kit` directly — e.g.
to inspect the DB with `drizzle-kit studio`:

```bash
pnpm -C libs/database exec drizzle-kit migrate
pnpm -C libs/database exec drizzle-kit studio
```

### Regenerating the API client (Orval)

The typed React Query hooks in `libs/api-client` are generated from the API's
OpenAPI spec by [Orval](https://orval.dev) (`orval.config.ts`) and are **committed**,
so a fresh clone needs no generation step. Regenerate them whenever the API's routes
or DTOs change:

```bash
# 1. Start the API — Orval reads its spec from http://localhost:4000/api/docs-json
pnpm exec nx serve @org/api

# 2. In another terminal, regenerate the client into libs/api-client/src/generated
pnpm exec orval
```

### Environment variables (`apps/api/.env`)

| Variable | Purpose | Example |
| --- | --- | --- |
| `APP_MODE` | `DEV` enables Swagger docs | `DEV` |
| `API_URL` | Public API URL | `http://localhost:4000` |
| `APP_URL` | Frontend URL (used for CORS) | `http://localhost:3000` |
| `API_HOST` / `API_PORT` | API bind host/port | `0.0.0.0` / `4000` |
| `DB_URL` | PostgreSQL connection string | `postgresql://localhost:5432/support` |
| `BETTER_AUTH_SECRET` | Session signing secret (32+ chars) | _random string_ |
| `BETTER_AUTH_SESSION_*` | Session lifetimes (have sensible defaults) | see `.env.example` |

The frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`).

---

## 5. Running the app

Run the API and the frontend in two terminals:

```bash
# Terminal 1 — backend API  → http://localhost:4000/api
pnpm exec nx serve @org/api

# Terminal 2 — frontend      → http://localhost:3000
pnpm exec nx dev @org/portal
```

Then open **http://localhost:3000**.

- API Swagger/OpenAPI JSON: `http://localhost:4000/api/docs-json`
- API reference (Scalar): `http://localhost:4000/reference`

### Authentication & roles

The app is protected by cookie-based sessions.

1. Open the app and **Sign up** (`/sign-up`). New users get the **`agent`** role.
2. Agents can view, create, and update tickets.
3. **Deleting** a ticket is **admin-only**. To grant yourself admin:

   ```bash
   pnpm promote-admin <your-email>
   ```

   Then sign out and back in — the "Delete Ticket" action appears on the ticket
   detail page.

---

## 6. Features (mapped to the brief)

| # | Requirement | Where |
| --- | --- | --- |
| 1 | **Ticket list** — title, customer, status, priority, created date | Table + Kanban views on `/` |
| 2 | **Create ticket** — validated form; status forced to `open` | "New Ticket" dialog |
| 3 | **Update status** from list/detail with success/error feedback; persisted | Status `Select` on detail page + inline edit |
| 4 | **Ticket details** — full description, customer info, priority, status, dates | `/tickets/:id` |
| 5 | **Filtering** — by status **and** priority (+ title/customer search, sorting) | Filter bar on `/` |
| 6 | _Nice-to-have:_ **drag-and-drop** Kanban that persists status | Board view (`?view=board`) |

**Extra / optional work included:** authentication + role-based access (admin delete),
search, column sorting, Swagger/OpenAPI docs, and WebSocket live updates.

### API surface

| Method | Route | Notes |
| --- | --- | --- |
| `GET` | `/api/tickets` | list with `status`, `priority`, `search`, `sortBy`, `sortOrder`, pagination |
| `GET` | `/api/tickets/:id` | single ticket (404 if missing) |
| `POST` | `/api/tickets` | create (validated; status forced to `open`) |
| `PATCH` | `/api/tickets/:id` | update fields incl. status |
| `DELETE` | `/api/tickets/:id` | **admin only** (403 otherwise) |
| `*` | `/api/auth/*` | better-auth (sign-up/in/out, session) |

Requests are validated (`class-validator`), return appropriate HTTP status codes,
and respond with JSON. Routing, business logic (services), and data access (Drizzle)
are kept in separate layers.

---

## 7. Running the tests

The most valuable coverage is the **Playwright end-to-end suite** in `apps/portal-e2e`,
which exercises the critical paths through the real UI, API, and database:

1. Unauthenticated users are redirected to sign-in.
2. A new user can sign up and **create a ticket** (appears in the list).
3. An **admin can delete a ticket** (admin-only flow, removed from the list).

The suite manages its **own servers** — you do **not** need to start the API or
portal first:

- Playwright boots its **own** API (port 4100, rate limiting disabled) and its
  **own** portal (port 3100, pointed at that API); both are torn down afterwards.
- `global-setup` **migrates + truncates** the test database; `global-teardown`
  cleans it and frees the ports.

Your dev servers on `:3000/:4000` are never touched. Runs on Chromium + Firefox.

The one thing you must supply is **`E2E_DATABASE_URL`** — a dedicated, disposable
Postgres database. The suite only migrates and truncates it (it never creates or
drops a database), so it works anywhere, including managed Postgres (Neon, Supabase,
RDS, …) that gives you a single database with ordinary privileges. In CI, set it as
an environment variable (a service-container database or a hosted test database).

```bash
# Create a throwaway test database once (local example)
createdb support_e2e

# End-to-end (Playwright) — starts/stops its own API + portal
E2E_DATABASE_URL="postgres://user:pass@localhost:5432/support_e2e" \
  pnpm exec nx e2e @org/portal-e2e

# ...or a single browser
E2E_DATABASE_URL="postgres://user:pass@localhost:5432/support_e2e" \
  pnpm exec nx e2e @org/portal-e2e -- --project=chromium

# Unit / component + API tests (Jest)
pnpm exec nx run-many -t test
```

**Also required:** no other portal dev server running (Next.js locks the project
directory per dev server).

> ⚠️ `E2E_DATABASE_URL` must be a **dedicated, disposable database** — the run
> truncates all of its `public` tables. Never point it at a database with real data.

> WebKit is intentionally excluded: its tracking-prevention blocks the auth cookie
> across the harness's cross-port origins (portal `:3100` ↔ API `:4100`), a
> local-only artifact rather than an application bug.

---

## 8. Assumptions & technical trade-offs

- **Auth is included** (an optional extra), so the app sits behind a login. There's
  no pre-seeded login (passwords are securely hashed by better-auth), so a reviewer
  **signs up** once and, if needed, self-promotes to admin via `pnpm promote-admin`.
  Seed data covers **tickets** so the list is immediately explorable after login.
- **PostgreSQL over SQLite** for closer production parity (enum columns, indexes,
  `uuidv7` keys). SQLite would have been accepted but Postgres better reflects intent.
- **Nx monorepo + Orval-generated client** gives end-to-end type safety from the
  NestJS DTOs down to the React hooks. Trade-off: more moving parts and setup steps
  than a single-package app.
- **E2E-first testing.** With a timebox, three reliable end-to-end tests protect the
  highest-value flows (auth, create, admin delete) more meaningfully than many shallow
  unit tests. The harness starts its own API + portal on separate ports and runs
  against a caller-provided disposable database (`E2E_DATABASE_URL`) that it migrates
  and truncates — isolated and repeatable, never touching dev data, and portable to
  managed Postgres. Rate limiting is disabled on the test API to avoid 429s under the
  rapid auth calls the flows drive.
- **No Docker / CI / deployment.** The stack is intentionally diverse (Next.js suits
  Vercel; NestJS needs a long-running VM / Cloud Run; cookie auth needs a shared
  domain), which makes a quick, free, single-command deploy and CI/CD disproportionately
  time-consuming for this timebox. These are documented as next steps rather than
  half-built.

---

## 9. What I'd improve with more time

- **Docker Compose** (Postgres + API + frontend) for one-command local startup.
- **Richer seed** that also provisions a ready-to-use admin account.
- **CI** (GitHub Actions) running lint, unit, and e2e on every push.
- **Deployment**: frontend on Vercel, API on Cloud Run, managed Postgres (e.g. Neon),
  with a shared cookie domain.
- **More automated tests**: NestJS service/controller unit tests, form-validation and
  data-rendering component tests, and an accessibility pass.
- **UX**: pagination UI (the API already supports it) and optimistic status updates.

---

## 10. Security note

- No secrets are committed. `.env` files are git-ignored; only `apps/api/.env.example`
  (placeholders) is tracked.
- Always set a strong, unique `BETTER_AUTH_SECRET` per environment.
