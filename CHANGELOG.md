# Changelog

All notable changes to **TanLabs Client** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Astryx design system integration (`@astryxdesign/core`, `@astryxdesign/theme-neutral`).
- Login UI from Astryx `login-card` template (`src/react-app/ui/login-card/`).
- Dashboard shell from Astryx `shell-side-nav` template (`src/react-app/ui/shell-side-nav/`).
- Thin app adapters in `src/react-app/lib/astryx/` for toast, form dialogs, and auth preference controls.
- Agent and editor guidance for Astryx (`AGENTS.md`, `.cursor/rules/astryx.mdc`).

### Changed

- Migrated to feature-first layout: `features/`, `shared/`, `ui/` under `src/react-app/`; removed `client/`, `lib/auth/`, `lib/ui/`, `lib/i18n/`, and duplicate folders.
- `@/` alias now maps to `src/react-app/` (was `client/`).
- Auth runtime and screens consolidated in `features/auth/`; shared config and i18n under `shared/`.
- `lib/platform/` reduced to browser infra only (`cookies`, `http`, `preferences`); session/routing/auth validation moved to `shared/` and `features/auth/lib/`.
- Tree slimmed for maintenance: removed dead modules (`features/access`, `shared/query`, `runtime-env` chain, `auth-mail`, `public-auth-screens`, unused Vite scaffold assets, template reference `page.tsx` files); merged password-recovery trio, runtime-access, and auth-notice into fewer `features/auth/lib` modules; `shared/api` folded into `shared/http`; `App.tsx` inlined into `main.tsx`.
- CSS aligned with Astryx defaults: layered imports, `tailwind-theme.css`, removed legacy shadcn `app-theme.css`.
- App wrapped in `<Theme theme={neutralTheme}>` for correct token injection and `data-theme` sync.
- Folder tree consolidated; removed duplicate login-card, `lib/components/`, and legacy Radix wrappers.
- Import aliases: `@/` → `src/react-app`, `@tanlabs/ui/*` → `ui/`, `@tanlabs/astryx` for adapters.
- Auth screens (login, register, verify email, forgot password) now use Astryx layout and form patterns.
- Dashboard home, my account, and shell navigation rebuilt with Astryx components.
- Toast notifications moved from Sonner to Astryx `Toast`.
- Navigation icons switched from Lucide to Heroicons.
- Vite dev server port set to **5101**.
- Path aliases updated: `@/` → `src/react-app`, `@tanlabs/astryx`, `@tanlabs/ui/*` → `ui/`.

- Admin references stripped — app is web/client only: removed `ADMIN_ROLE`, `SUPER_ADMIN_ROLE`, `isAdminAudience`, admin permission catalog, `adminTitle`/`adminPlaceholderEmail`, `PublicAuthApp` app switching ('admin' | 'web'), and admin wording in i18n messages.

### Removed

- Entire `src/react-app/lib/components/` barrel (Radix UI, shadcn-style wrappers).
- Dependencies: `@radix-ui/*`, `lucide-react`, `sonner`, `@base-ui/react`, `class-variance-authority`, `@tanstack/react-table`.

## [0.1.0] - 2026-03-XX

### Added

- Initial TanLabs Client: React 19 + Vite 7 + Hono on Cloudflare Workers.
- Same-origin `/api/*` proxy to `tanlabs-api`.
- Auth flows: login, register, email verification, forgot password, Google OAuth, 2FA, session watchdog.
- Dashboard shell with my account (password, Google link, 2FA, device logout).
- i18n (en, vi, ja, ko) and theme (light / dark / system) preferences.
- Astryx packages and agent docs scaffold (`591863b`).

### Changed

- Project restructured from source import to TanLabs Client layout (`cc395eb`).
- Dependency lockfile and dev tooling aligned with pnpm (`7442942`, `7aff130`).

[Unreleased]: https://github.com/tanpt-se/tanlabs-client/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tanpt-se/tanlabs-client/releases/tag/v0.1.0
