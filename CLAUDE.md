# CLAUDE.md

Design system of NothingEats: vendored soren-ui, the NothingEats theme, domain components, Storybook. The cross-repo plan and session rules live in `../CLAUDE.md` (workspace root), if present — read it first.

## Commands

Package manager: **pnpm** (version pinned in `package.json`), Node from the workspace `mise.toml` (`mise exec -- pnpm …`).

- `pnpm dev` — Storybook on port 6006
- `pnpm test` — stories as Vitest browser tests (Chromium via Playwright, `pnpm exec playwright install chromium` once), with axe checks that fail on violations
- `pnpm lint` — ESLint (`@antfu/eslint-config`, 4 spaces, single quotes, semicolons, like soren-ui) and Stylelint
- `pnpm typecheck`, `pnpm build` (library into `dist/`, types into `dist/types`)
- `pnpm sync:soren-ui --ref <ref>` / `pnpm check:soren-ui` — vendor soren-ui / verify the vendored files (needs the soren-ui checkout at `../../soren-ui-astro-starlight` or `SOREN_UI_DIR`)

## Rules

- **Never edit `src/soren/`, `src/soren-ui.ts` or `SOREN_UI.md` by hand.** Fixes go upstream into soren-ui (`~/private-projects/soren-ui-astro-starlight`), then sync. `pnpm check:soren-ui` must pass.
- Domain components follow soren-ui's component contract: `'use client'` first, `ref` as a prop, variants with `cva`, classes merged with `clsx`, one folder with `<Name>.tsx`, `<Name>.module.scss` and `<Name>.stories.tsx`.
- Colours only through tokens (`src/theme/_tokens.scss`); NothingEats additions are prefixed `--ne-`. Every text pair meets WCAG AA in light and dark.
- User-facing strings of domain components live in `src/components/strings.ts` in German and English; numbers, money and times are formatted with React Aria's formatters (locale from `I18nProvider`).
- Every new component gets stories with `play` assertions, and a dark story when it has its own colours.
- Domain components are presentational: data in through props (shaped like the catalog API), events out through callbacks. No fetching, no app i18n library, no router import.
