# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who want professional skincare guidance without visiting a treatment
room. They need help understanding their skin, simplifying their routine, and
choosing products with more confidence.

## Product Purpose

Skin Groove is a virtual esthetics practice. It offers remote skin
consultations, practical routine guidance, and a curated skincare shop. Success
means a visitor understands the virtual model, trusts the point of view, and
chooses either a consultation or a recommended product.

## Positioning

Skin Groove pairs individualized esthetician guidance with a focused retail
edit, helping clients build a useful home routine without crowded shelves or
generic product advice.

## Operating Context

Consultations happen virtually. Clients use the resulting guidance at home and
may purchase recommended skincare online.

## Capabilities and Constraints

- Clients book and pay through Cal.com, which takes payment with its Stripe app.
  The site shows no prices. Cal.com shows the price at booking.
- The site makes no shop credit or discount offer. Sammy dropped the $50 shop
  credit on 2026-11-14, because clients could abuse it and its duration was not
  known.
- Returning clients book a 30-minute follow-up for $25. The follow-up event is
  hidden from the public site. Sammy gives its link to each client at the end of
  the consultation.
- The acne consultation is 60 minutes for $75. Its intake adds the breakout
  questions. Acne follow-ups use the same follow-up event, and Sammy books the
  next one with the client during the call.
- Clients are 13 or older. A parent or guardian consents for a client under 18.
- Curated online retail runs on Shopify. The store exists, but the site
  integration does not exist yet, and the store is not open.
- Booking buttons open a picker with the skin and acne consultations. Each
  choice opens its Cal.com event in a popup. Shop controls remain placeholders
  until the Shopify integration goes live.
- Cloudflare Workers hosts the site.
- Skin Groove LLC owns the practice. Sammy holds esthetician licenses in
  Pennsylvania and Louisiana and works from Pennsylvania. She works
  independently and does not prescribe.
- After booking, clients complete an intake form with skin photos and consent
  forms. An external form tool holds the submissions. See
  `docs/privacy-and-intake.md`.
- Client health data needs explicit consent. The site never shares it with
  advertisers or analytics tools.

## Brand Commitments

- The brand name is Skin Groove.
- The voice is informed, warm, direct, and personality-led.
- The identity combines a 1970s sunken-lounge sensibility with soft, playful
  forms.
- The approved palette centers on apricot, deep brown, burnt orange, avocado
  green, and warm cream.
- The type system uses Caprasimo for display and Manrope for body text.
- The production domain is https://skingroove.studio.
- The contact email is sammy@skingroove.studio.
- The Instagram account is @beautybysmintz.

## Evidence on Hand

- A user-supplied vision board is stored in `docs/esti_vision_board/`.
- Existing site photography is stored in `public/images/`.
- Sammy, the founder, supplied the site copy and her biography. They live in
  `src/components/home/content.ts`, `src/components/about/content.ts`, and
  `src/components/faq/content.ts`. Keep her wording, and do not extend her
  biography beyond what she wrote.
- Sammy's portrait is `public/images/sammy.webp`.
- No testimonials, clinical outcome claims, product catalog, or product pricing
  have been provided. Future work must not fabricate them.

## Product Principles

- Make professional guidance feel approachable and personal.
- Prefer useful routines over crowded product shelves.
- Explain the virtual-care model clearly.
- Keep commerce and booking behind their own service boundaries.
- Treat skincare education as care, not correction.

## Accessibility & Inclusion

Use clear language, keyboard-accessible controls, reduced-motion support,
responsive layouts, and WCAG AA color contrast.
