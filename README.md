# Skin Groove

The website for Skin Groove, a virtual esthetics practice. Built with Astro,
Tailwind CSS 4, and Vite+.

Production: https://skingroove.studio

## Local development

Install [mise](https://mise.jdx.dev/getting-started.html), then run:

```sh
mise trust
mise run bootstrap
```

[Pitchfork](https://pitchfork.jdx.dev) starts the dev server when you enter the
project directory. Without Pitchfork, run `vp run dev`. This command fails if
the Pitchfork daemon already holds the port.

| Command                             | Purpose                                 |
| ----------------------------------- | --------------------------------------- |
| `vp run check`                      | Run format, lint, and type checks       |
| `vp run test:unit`                  | Run unit tests                          |
| `vp run build`                      | Build the site into `dist/`             |
| `vp run preview`                    | Serve `dist/` after a build, on :8787   |
| `BASE_URL=<url> vp run e2e`         | Run smoke tests against a running site  |
| `BASE_URL=<url> vp run test:visual` | Compare a running site with screenshots |

## Hosting

Merging to `main` deploys the site. Each pull request gets its own Preview link.
Smoke tests run on each Preview and on the live site after a merge.

To deploy from your machine, run `pnpm exec varlock run -- vp run deploy`. This
needs the Cloudflare token in `.env.local`.

These commands are set in the Cloudflare dashboard, under the Worker's build
settings:

| Setting                   | Command                      |
| ------------------------- | ---------------------------- |
| Build                     | `pnpm run build`             |
| Deploy                    | `pnpm exec wrangler deploy`  |
| Non-production deployment | `pnpm exec wrangler preview` |

## Domain and DNS

Porkbun is the registrar, so renew the domain there. Cloudflare hosts DNS, so
change records there.

| Address                  | Destination                        |
| ------------------------ | ---------------------------------- |
| `skingroove.studio`      | The website, on Cloudflare Workers |
| `www.skingroove.studio`  | Redirects to `skingroove.studio`   |
| `shop.skingroove.studio` | The Shopify store                  |
| Email                    | Google Workspace                   |

The `www` redirect and the redirect from http to https are Cloudflare settings,
not code.

## Environment variables

[Varlock](https://varlock.dev) manages environment variables, and `.env.schema`
documents each one. Local secrets live in `.env.local`, encrypted with
`varlock encrypt`. The build needs no secrets.

## Visual baselines

`vp run test:visual` compares `/`, `/about`, and `/logo` with the screenshots in
`e2e/__screenshots__`. Screenshots depend on the OS and fonts, so record them
only on the `ubuntu-24.04` CI runner. Never commit local screenshots.

If a screenshot changes, the `test-visual` job fails and uploads two artifacts:

- `visual-test-report` shows each image diff.
- `visual-baselines` holds a full set of new screenshots.

If the change is intentional, extract `visual-baselines` into
`e2e/__screenshots__` and commit the result.

## Integrations

- **Booking:**
  [Cal.com](https://cal.com/sammymintzer/virtual-skin-consultation). The Cal.com
  Stripe app takes the $50 consultation payment.
- **Shop:** Shopify. The store exists, but the site does not connect to it yet.
  After a consultation, a Cal.com webhook will give the client a $50 Shopify
  discount code.
- **Email:** Google Workspace, `sammy@skingroove.studio`.
