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
vp run start
BASE_URL=<site url> vp run e2e
BASE_URL=<site url> vp run test:visual
```

Playwright starts no server, so each Playwright command needs `BASE_URL`.

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
`.env.local`, encrypted with `varlock encrypt`. Production values live in
Railway service variables.

## Hosting

[Railway](https://railway.com) hosts the app in the Skin Groove workspace.
Railway builds the `skin-groove` service with Railpack. The build runs
`astro build`, and `pnpm start` runs:

```sh
HOST=0.0.0.0 varlock run -- node dist/server/entry.mjs
```

`dist/server/entry.mjs` is the `@astrojs/node` standalone server. It serves the
prerendered pages from `dist/client`, and it can run server routes. It reads
Railway's `PORT`. `HOST` overrides the `127.0.0.1` dev host in
`astro.config.ts`.

`railpack.json` makes mise ignore `mise.toml` in the container. That file
declares a development plugin that mise clones from GitHub. Without this
setting, each container start needs GitHub, and a failed clone stops the start.

- A push to `main` deploys the `production` environment.
- Each pull request gets a Railway PR environment. The E2E workflow runs the
  Playwright smoke tests against it.
- Porkbun hosts DNS. The apex domain is an `ALIAS` record to the Railway
  service. Porkbun forwards `www` to the apex domain.

## Integrations

- **Email:** Google Workspace, `sammy@skingroove.studio`.
- **Booking:**
  [Cal.com](https://cal.com/sammymintzer/virtual-skin-consultation). The Cal.com
  Stripe app takes the $50 consultation payment.
- **Shop:** Shopify. The store exists at `shop.skingroove.studio`, but the site
  integration does not exist yet. After a completed consultation, the client
  gets a $50 Shopify discount code. A Cal.com webhook triggers the code.
