# Skin Groove

This is an Astro site with Tailwind v4 and Vite+. Astro owns the dev server and
the build. Vite+ owns formatting, lint, and Vitest. Prettier and ESLint check
`.astro` files. The dev server runs as a pitchfork daemon (see `pitchfork.toml`)
that starts and stops when you enter or leave the directory. Run
`mise run bootstrap` after a fresh clone.

Railway hosts production and PR environments. Railway builds with Railpack and
runs `pnpm start`, which starts the `@astrojs/node` standalone server from
`dist/server/entry.mjs`. Varlock manages environment variables; `.env.schema`
documents each one. See `README.md` for hosting and integration details, and
`PRODUCT.md` for product context.

## Commands

- `vp run dev` — start development (usually managed by pitchfork instead)
- `pitchfork list` / `pitchfork logs dev` / `pitchfork tui` — inspect the dev
  daemon
- `vp run check` — run `vp check`, Prettier, ESLint, and `astro check`.
  `vp check` alone skips the `.astro` steps.
- `vp run build` — build the site. `vp build` does not run Astro.
- `vp run start` — run the production server after a build
- `vp run test:unit` — run Vitest unit tests (`src/**/*.unit.test.ts`)
- `BASE_URL=<url> vp run e2e` — run Playwright smoke tests. Playwright starts no
  server.
- `BASE_URL=<url> vp run test:visual` — compare the site with the CI baselines
- `vp run dead-code` — find unused exports with fallow

Use `pnpm` through Vite+ (`vp i`, `vp run <script>`).

Record visual baselines only on the `ubuntu-24.04` CI runner. See "Visual
baselines" in `README.md`.

## Architecture decisions

Do not reverse these decisions without a request from Sahand.

- Skin Groove is a virtual esthetics practice. The site is mostly static
  marketing pages. Cal.com handles booking and payment. Shopify handles the shop
  and checkout.
- The site uses no database. Shopify and Cal.com hold all data.
- The site has no custom user accounts or auth. Clients use guest checkout and
  Cal.com email links. If order history is needed, use Shopify hosted customer
  accounts.
- Pages ship no JavaScript by default. Use a small `<script>` from `src/scripts`
  when one can do the work. Use React only for interactive islands. The site has
  no island yet, so it has no React dependency. Add `@astrojs/react` with the
  first island.
- The future cart is a React island. It keeps a Shopify cart ID in a cookie.
- Future product pages render on the server with a short cache. All other pages
  stay prerendered. `output: 'static'` makes prerendering the default. Set
  `export const prerender = false` only on a route that needs the server.
- A future Astro API route receives the Cal.com webhook.
- Do not port `@astrojs/cloudflare`, `wrangler`, or other Cloudflare parts of
  the template.

## CSS order

`src/layouts/base.astro` imports the shared stylesheets. Page CSS overrides some
shared rules at equal specificity, so `.gv img` must load before `.gv-row img`.
Keep shared imports in the layout, and keep page imports in page components.
Import `Base` first on each page, because the dev server loads CSS in import
order.

## Style rules

### Always build `class` with `cn()`

Compose conditional or combined classes with `cn()` from `@/lib/utils/ui`
(exported from `src/lib/utils/ui`). Never interpolate classes with template
literals or string concatenation — an ESLint `no-restricted-syntax` rule rejects
template literals in `class`.

Bad:

```astro
<a class={`flex border-2 ${active ? 'bg-kitchen-yolk' : 'bg-card'}`}></a>
```

Good:

```astro
<a
	class={cn(
		'flex border-2',
		active ? 'bg-kitchen-yolk' : 'bg-card',
		disabled && 'opacity-35',
	)}
></a>
```
