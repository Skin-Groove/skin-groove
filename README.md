# Skin Groove

The website for Skin Groove, a virtual esthetics practice. Built with Astro,
Tailwind CSS 4, and Vite+.

Production: https://skingroove.studio

## Local development

Prerequisites: [mise](https://mise.jdx.dev/getting-started.html).

```sh
mise trust
mise run bootstrap
```

[Pitchfork](https://pitchfork.jdx.dev) runs the dev server as a daemon. Without
Pitchfork, run `vp run dev`. `vp run dev` fails if the daemon already holds the
port.

Useful commands:

```sh
vp run check
vp run test:unit
vp run build
vp run preview
BASE_URL=<site url> vp run e2e
BASE_URL=<site url> vp run test:visual
```

Playwright starts no server, so each Playwright command needs `BASE_URL`.
`vp run preview` serves `dist/` at http://localhost:8787 with the Workers
routing rules.

## Visual baselines

`vp run test:visual` compares `/`, `/about`, and `/logo` with the screenshots in
`e2e/__screenshots__`. Baselines depend on the OS and fonts, so record them only
on the `ubuntu-24.04` CI runner. Never commit local screenshots.

If a screenshot is different or missing, the `test-visual` job fails. The job
then uploads two artifacts:

- `visual-test-report` holds the Playwright report with each image diff.
- `visual-baselines` holds a full set of new screenshots.

If the change is intentional, extract `visual-baselines` into
`e2e/__screenshots__`, then commit the result. The artifact already contains the
`visual.spec.ts` directory.

## Environment variables

[Varlock](https://varlock.dev) manages environment variables. `.env.schema`
declares every variable and documents its purpose. Local secrets live in
`.env.local`, encrypted with `varlock encrypt`. The build needs no variables, so
Workers Builds sets none. CI and Workers Builds run without
`CLOUDFLARE_API_TOKEN`.

## Hosting

[Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/)
serves `dist/` as static assets. The site has no Worker script, so
`wrangler.jsonc` has no `main`. Workers Builds uses these commands:

- Build command: `pnpm run build`
- Deploy command: `pnpm exec wrangler deploy`
- Non-production branch deploy command: `pnpm exec wrangler preview`

`main` is the production branch. Each pull request gets a Preview URL. The E2E
workflow runs the Playwright smoke tests against the Preview, and against the
live domain after a merge.

To deploy from your machine, run `pnpm exec varlock run -- vp run deploy`. This
uses the account token in `.env.local`. Do not use `wrangler login`.

These files set the routing rules:

- `html_handling` in `wrangler.jsonc` serves `/about` and `/logo` with no
  redirect.
- `public/_redirects` sends `/about/` and `/logo/` to the URL with no trailing
  slash, with a 301. Workers routing alone uses a 307.
- `not_found_handling` in `wrangler.jsonc` serves `dist/404.html` with a 404.
- `public/_headers` caches `/_astro/*` for a year. These file names contain a
  content hash.

Two limits apply:

- `_headers` rules match only on the URL, so a 404 under `/_astro/` also gets
  the one-year cache header. A browser asks for a missing hash only if it holds
  HTML from another deployment.
- Previews return a bare `Not found` for a missing page. The production Worker
  serves `dist/404.html`.

Porkbun is the registrar, and Cloudflare hosts DNS. `routes` in `wrangler.jsonc`
attaches the apex domain to the Worker. Cloudflare does not let a custom domain
replace a DNS record. If the hostname has a record, `wrangler deploy` fails with
error 100117, even when Wrangler sets `override_existing_dns_record`. To attach
a new hostname, delete its record first. A Cloudflare redirect rule sends `www`
to the apex domain with a 301, and keeps the path and query string. Always Use
HTTPS sends http requests to https with a 301. `shop.skingroove.studio` is a DNS
only record, because Shopify serves it.

## Integrations

- **Email:** Google Workspace, `sammy@skingroove.studio`.
- **Booking:**
  [Cal.com](https://cal.com/sammymintzer/virtual-skin-consultation). The Cal.com
  Stripe app takes the $50 consultation payment.
- **Shop:** Shopify. The store exists at `shop.skingroove.studio`, but the site
  integration does not exist yet. After a completed consultation, the client
  gets a $50 Shopify discount code. A Cal.com webhook triggers the code.
