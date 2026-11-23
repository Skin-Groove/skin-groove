# Skin Groove

This is an Astro site with Tailwind v4 and Vite+. Astro owns the dev server and
the build. Vite+ owns formatting, lint, and Vitest. Prettier and ESLint check
`.astro` files. The dev server runs as a pitchfork daemon (see `pitchfork.toml`)
that starts and stops when you enter or leave the directory. Run
`mise run bootstrap` after a fresh clone.

Cloudflare Workers serves `dist/client` as static assets. One route,
`/api/cal-webhook`, runs on the Worker. Workers Builds deploys `main` and gives
each pull request a Preview URL. Varlock manages environment variables;
`.env.schema` documents each one. See `README.md` for hosting and integration
details, and `PRODUCT.md` for product context.

## Commands

- `vp run dev` — start development (usually managed by pitchfork instead)
- `pitchfork list` / `pitchfork logs dev` / `pitchfork tui` — inspect the dev
  daemon
- `vp run check` — run `vp check`, Prettier, ESLint, and `astro check`.
  `vp check` alone skips the `.astro` steps.
- `vp run build` — build the site. `vp build` does not run Astro.
- `vp run preview` — serve the build with `wrangler dev`. This uses the Workers
  routing rules and runs the webhook route.
- `pnpm exec varlock run -- vp run deploy` — build and deploy with the account
  token in `.env.local`. Workers Builds usually does this.
- `vp run test:unit` — run Vitest unit tests (`{src,scripts}/**/*.unit.test.ts`)
- `BASE_URL=<url> vp run e2e` — run Playwright smoke tests. Playwright starts no
  server.
- `BASE_URL=<url> vp run test:visual` — compare the site with the CI baselines
- `vp run dead-code` — find unused exports with fallow
- `pnpm exec varlock run -- node scripts/intake/sync-forms.ts` — push the intake
  forms in `scripts/intake/forms.ts` to Tally
- `node scripts/email/render-assets.ts` — render the email images into
  `public/email`. The dev server previews each client email at `/emails`.

Use `pnpm` through Vite+ (`vp i`, `vp run <script>`).

Record visual baselines only on the `ubuntu-24.04` CI runner. See "Visual
baselines" in `README.md`.

## Architecture decisions

Do not reverse these decisions without a request from Sahand.

- Skin Groove is a virtual esthetics practice. The site is mostly static
  marketing pages. Cal.com handles booking and payment. Shopify handles the shop
  and checkout.
- The site uses no database. Shopify, Cal.com, and the intake form tool hold all
  data.
- Clients send health data and skin photos in an external intake form after
  booking. Cal.com has no file-upload field. Read `docs/privacy-and-intake.md`
  before you change booking, intake, analytics, or legal pages.
- HIPAA does not apply. Design for Washington's My Health My Data Act, which
  lets clients sue.
- The Tally forms do not deploy with the site. After a PR that changes
  `scripts/intake/` or `src/lib/intake.ts` merges, run the form sync from `main`
  without a prompt. Until the sync runs, clients see the old forms.
- Keep health data out of Cal.com booking questions.
- Add no analytics, ad pixels, or session replay to the site, the booking flow,
  or the intake form.
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
- The Astro API route `src/pages/api/cal-webhook.ts` receives the Cal.com
  webhook and sends client emails through Resend. `@astrojs/cloudflare` builds
  it into the Worker.
- The Worker reads its secrets from `cloudflare:workers`, and
  `wrangler secret put` sets them. The site does not use the varlock Astro
  integration. Its Cloudflare deploy replaces every Worker secret from local
  files, and Workers Builds has no local files.
- Client emails use no black or near-black. Garnet takes the place of ink.

## Workers limits

- The Free plan allows 100,000 Worker requests a day and 10 ms of CPU for each
  request.
- Static asset requests do not count toward these limits.
- `run_worker_first` sends matching asset requests through the Worker, and those
  requests count. Match only the paths that need the Worker.

## Hosting notes

- A Cloudflare custom domain cannot replace a web DNS record. If the hostname
  has an `A`, `AAAA`, or `CNAME` record, `wrangler deploy` fails with error
  100117, even with `override_existing_dns_record`. Delete only that record
  first. Keep the `MX` and `TXT` records, because email depends on them.
- Workers routing uses a 307 for a trailing slash. `public/_redirects` makes
  `/about/` and `/logo/` use a 301.
- `_headers` rules match only on the URL, so a 404 under `/_astro/` also gets
  the one-year cache header.
- Previews return a bare `Not found` for a missing page. Production serves
  `dist/404.html`.
- Do not use `wrangler login`. It cannot create a zone or edit DNS.
- A Worker version with no script drops every Worker secret. A static-only
  deploy on 2026-11-20 deleted both secrets. If the site ever ships without the
  webhook route, set the secrets again after the next deploy that adds a script.

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
