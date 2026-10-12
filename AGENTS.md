# Skin Groove

This is a TanStack Start application using React 19, Vite+, Tailwind v4, and
shadcn. The dev server runs as a pitchfork daemon (see `pitchfork.toml`) that
auto-starts/stops when entering or leaving the directory. Run
`mise run bootstrap` after a fresh clone.

Railway hosts production and PR environments. Varlock manages environment
variables; `.env.schema` documents each one. See `README.md` for hosting and
integration details, and `PRODUCT.md` for product context.

## Commands

- `vp dev` — start development (usually managed by pitchfork instead)
- `pitchfork list` / `pitchfork logs dev` / `pitchfork tui` — inspect the dev
  daemon
- `vp check` — format, lint, and type-check
- `vp test run` — run Vitest projects
- `vp run e2e` — run Playwright smoke tests
- `vp run dead-code` — find unused exports with fallow

Use `pnpm` through Vite+ (`vp i`, `vp run <script>`).

## Style rules

### Always build `className` with `cn()`

Compose conditional or combined classes with `cn()` from `@/lib/utils/ui`
(exported from `src/lib/utils/ui`). Never interpolate classes with template
literals or string concatenation — an oxlint `no-restricted-syntax` rule rejects
template literals in `className`.

Bad:

```tsx
const className = `flex border-2 ${active ? 'bg-kitchen-yolk' : 'bg-card'} ${
	disabled ? 'opacity-35' : ''
}`
return <Link className={`${className} focus-visible:outline-2`} />
```

Good:

```tsx
const className = cn(
	'flex border-2',
	active ? 'bg-kitchen-yolk' : 'bg-card',
	disabled && 'opacity-35',
)
return <Link className={cn(className, 'focus-visible:outline-2')} />
```
