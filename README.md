# Skin Groove

The website for Skin Groove, a virtual esthetics practice. Built with TanStack
Start, React 19, Tailwind CSS 4, and Vite+.

Production: https://skingroove.studio

## Local development

Prerequisites: [mise](https://mise.jdx.dev/getting-started.html).

```sh
mise trust
mise run bootstrap
vp dev
```

Useful commands:

```sh
vp check
vp test run
vp run e2e
vp build
```

## Environment variables

[Varlock](https://varlock.dev) manages environment variables. `.env.schema`
declares every variable and documents its purpose. Local secrets live in
`.env.local`, encrypted with `varlock encrypt`. Production values live in
Railway service variables.

## Hosting

[Railway](https://railway.com) hosts the app in the Skin Groove workspace.
Railway builds the `skin-groove` service with Railpack and starts it with
`pnpm start`.

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
- **Shop:** Shopify (not set up yet). After a completed consultation, the client
  gets a $50 Shopify discount code. A Cal.com webhook triggers the code.
