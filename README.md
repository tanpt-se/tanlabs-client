# TanLabs Client

React + Vite + Hono + Cloudflare Workers web client with full auth (login, register, Google OAuth, i18n, session management).

## Architecture

```
Browser → tanlabs-client Worker (/api/*) → tanlabs-api
```

Same-origin API proxy avoids CORS. The Worker forwards requests with `X-Auth-Client: web`.

## Prerequisites

- Node.js 20+
- [tanlabs-api](https://github.com/tanpt-se/tanlabs-api) running locally on port **8787**

## Local development

**Terminal 1 — API:**

```bash
cd ../tanlabs-api
pnpm install
pnpm dev          # http://localhost:8787
pnpm seed-auth    # user@example.com / Password123!
```

**Terminal 2 — Client:**

```bash
npm install
cp .dev.vars.example .dev.vars   # optional; wrangler defaults API_ORIGIN to :8787
cp .env.example .env             # optional Vite public env
npm run dev                      # http://localhost:5101
```

## Environment

| File | Purpose |
|------|---------|
| `.dev.vars` | Worker secret `API_ORIGIN` (dev: `http://localhost:8787`) |
| `.env` | Vite public vars (`VITE_*`) — see `.env.example` |

Production Worker vars are in `wrangler.json` → `env.production.vars.API_ORIGIN`.

## Auth routes

| Path | Description |
|------|-------------|
| `/login` | Email/password + Google OAuth |
| `/register` | Sign up + email verification flow |
| `/verify-email` | OTP verification after register |
| `/forgot-password` | Password recovery |
| `/my-account` | 2FA, Google link, session revoke |
| `/auth/session-ended` | Session terminated notice |

## i18n

Supported locales: **en**, **vi**, **ja**, **ko** (locale cookie: `client_authlab_locale`).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server (port 5101) |
| `npm run build` | Typecheck + production build |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run cf-typegen` | Regenerate Worker `Env` types |

## Deploy

```bash
npm run build && npm run deploy
```

Ensure `tanlabs-api` production CORS includes your client origin (`APP_ORIGIN`).
