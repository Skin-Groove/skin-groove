# Privacy and intake

This file records the research and decisions for the consultation intake form
and client health data. The research date is 2026-11-13. This file is not legal
advice. A Pennsylvania lawyer must review the privacy policy and the consent
forms before launch.

## Business facts

- Skin Groove LLC owns the practice. It has a separate bank account.
- Sammy holds esthetician licenses in Pennsylvania and Louisiana. She works from
  Pennsylvania.
- Sammy works independently and takes cash payment. She does not work under a
  physician, a dermatologist, or a medical spa. She does not prescribe.
- Sammy keeps her license active. Professional brands sell only to licensed
  estheticians, and a future employer can require the license.

## Legal summary

### HIPAA

HIPAA does not apply. It covers health plans, clearinghouses, and providers that
bill insurance electronically. Skin Groove is none of these. If the business
starts to bill insurance or to work under a covered provider, read this section
again.

### State consumer health data laws

These laws have no size threshold. Intake answers, medications, skin conditions,
and skin photos are consumer health data.

| Law                                      | Scope                                                  | Enforcement                                                       |
| ---------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| Washington My Health My Data Act (MHMDA) | Washington residents, and data collected in Washington | Private lawsuits under the Washington Consumer Protection Act; AG |
| Nevada SB 370                            | Businesses that do business in or target Nevada        | Attorney General only                                             |
| Connecticut CTDPA consumer health data   | Controllers of consumer health data                    | Attorney General only                                             |

Design for MHMDA. Its rules also satisfy the Nevada and Connecticut rules.

- Get consent before collection. Keep it separate from other terms.
- Get a separate consent before the business shares data with anyone other than
  its processors.
- Never sell consumer health data.
- Link the consumer health data privacy policy from the homepage. The Washington
  AG says that this policy is a separate page, with its own homepage link, and
  holds only what MHMDA requires. The site keeps it at `/health-data`, apart
  from the general policy at `/privacy`. The policy names no state law. Its
  rules apply to each client, so a list of states adds nothing for the reader.
- Delete data when a client asks.
- Sign a data processing agreement (DPA) with each processor.

MHMDA lawsuits so far target companies that sent health data to ad trackers. The
first class action, against Amazon, ended in 2025 with no ruling.

Watch these bills:

- New York Health Information Privacy Act. The governor vetoed it in
  December 2025. A new version waited for her signature in November 2026.
- Pennsylvania HB 78, a general privacy law. It has not passed. Its thresholds
  are far above the size of this business.

### Pennsylvania State Board of Cosmetology

- The Cosmetology Law defines esthetics as hands-on acts: face massage,
  application of cosmetic preparations, hair removal, and lash and brow dye.
  Virtual advice and product recommendations are not in this definition.
- Section 8 requires licensed acts to occur in a licensed salon. Virtual
  consults perform no licensed act, so they need no salon license. In-person
  services need one.
- The research found no board rule about virtual consults, consent forms, or
  client record retention.
- For services to clients in other states, the client location usually controls.
  Describe the service as consultation and education. Do not use "diagnose",
  "treat", or "telehealth".

### Federal rules

- **FTC Act Section 5.** The privacy policy must match actual practice. The FTC
  cases against GoodRx and BetterHelp punished health data sent to advertisers.
- **FDA.** A claim to treat a condition makes a product a drug. Product copy
  uses appearance claims only, for example "helps skin look clearer", not
  "treats acne".
- **FTC Consumer Reviews and Testimonials Rule.** Do not publish fake or
  incentivized reviews. A paid or gifted endorsement needs a clear disclosure.
- **COPPA.** Accept no clients under 13.
- **CAN-SPAM and TCPA.** Marketing email needs an unsubscribe link and a postal
  address. SMS reminders need opt-in consent.
- **Pennsylvania breach law.** Since 2024, medical data is in scope only for
  state agencies and their contractors. Reasonable security is still required
  under MHMDA and the FTC Act.

### Insurance and liability

The LLC and the separate bank account limit claims to business assets. An LLC
does not shield an owner from claims about her own acts. Insurance covers that
gap.

| Coverage               | What it covers                                   | Example                                    |
| ---------------------- | ------------------------------------------------ | ------------------------------------------ |
| Professional liability | Harm from advice or services                     | A recommended routine causes a burn        |
| Product liability      | Harm from a product that the business sells      | A client reacts to a product from the shop |
| General liability      | Bodily injury, property damage, advertising harm | A site photo infringes a copyright         |
| Cyber or privacy       | Data breach and privacy claims                   | A lawsuit under a health data law          |

- Pennsylvania applies strict liability to each seller of a defective product
  (Restatement (Second) § 402A, adopted in Webb v. Zern). A reseller can be
  liable without fault. Get product liability coverage before the shop opens.
- An ASCP membership costs about $259 a year. Reports say that it includes
  professional, general, and product liability, with $2 million for each
  occurrence and $6 million for each year. Confirm these points in writing:
  1. The policy covers virtual consults.
  2. The policy covers online product sales shipped to other states.
  3. The policy protects Skin Groove LLC, not only Sammy.
  4. The policy covers products under her own label, if she adds them.
- Cyber or privacy coverage is optional at launch. Get a quote. The site rules
  below keep the privacy risk low.
- Sign contracts as Skin Groove LLC, and keep business and personal money apart.

## Intake form tool

Cal.com has no file-upload field. Its `fieldTypeEnum` lists text, textarea,
number, email, phone, address, select, multiselect, checkbox, radio, boolean,
and URL fields only. The intake form uses an external tool.

**Decision:** Tally Free. The total cost is $0. Upgrade to Tally Pro ($24 a
month with annual billing) only to remove the Tally badge or to add a custom
domain.

The table uses the vendor pages on 2026-11-13. Prices are monthly with annual
billing.

|                          | forms.app                                  | Tally                                                    | Fillout                                |
| ------------------------ | ------------------------------------------ | -------------------------------------------------------- | -------------------------------------- |
| Hosting                  | Google Cloud, Belgium                      | Europe                                                   | AWS, United States                     |
| Security audit           | ISO 27001 and ISO 27701                    | None published                                           | SOC 2 Type II                          |
| Photo uploads            | 10 MB total on Free; 100 MB a file on Grow | 10 MB a file on Free; no limit on Pro                    | 20 MB a file                           |
| Signature field          | Free                                       | Free                                                     | Starter, $15                           |
| Remove branding          | Grow, $12.50                               | Pro, $24                                                 | Pro, $40                               |
| Custom domain            | Scale, $19                                 | Pro, $24                                                 | Business, $75                          |
| Automatic retention      | Grow, $12.50                               | Business, $74, or the free API                           | Not found                              |
| Access to uploaded files | Not documented                             | Dashboard needs a login; integration links carry a token | Links work from a cache after deletion |
| DPA                      | Request form, signed by both parties       | Accepted with the terms                                  | All plans                              |
| Two-factor login         | Yes                                        | Yes                                                      | Yes                                    |
| HIPAA BAA                | None listed                                | No                                                       | Enterprise only                        |

Reasons for Tally Free:

- It costs nothing. The free plan has unlimited submissions, signatures, hidden
  fields, and file uploads up to 10 MB a file. A phone photo is usually 2 to 5
  MB.
- Uploaded photos have signed links. A link opens only with its token, so no one
  can guess it. Anyone who has the full link can open it, so never forward one.
- Two-factor login and a DPA come with the free plan.

Limits of Tally Free:

- The form shows a "Made with Tally" badge.
- The form URL uses `tally.so`.
- Styling is basic. Custom CSS needs Pro.
- Tally publishes no security audit.
- Deleted submissions stay in the Tally trash for 90 days. Sammy can empty the
  trash sooner.

Reasons against the others:

- **forms.app:** the free plan holds 10 MB of files in total, which fills after
  a few submissions. Paid plans start at $12.50 a month.
- **Fillout:** the free plan has no signature field. Its file links appear to
  work without a login. Its Cal.com page moves payment into Fillout, which
  conflicts with the Cal.com payment decision.

### Forms as code

`scripts/intake/forms.ts` defines the three Tally forms, consent text included.
Change the forms only in that file, so that each change goes through review.
`src/lib/intake.ts` holds the form IDs.

| Form                    | Tally ID | Link                      |
| ----------------------- | -------- | ------------------------- |
| Full intake (`consult`) | `lae2yB` | https://tally.so/r/lae2yB |
| Acne intake (`acne`)    | `M1NW5M` | https://tally.so/r/M1NW5M |
| Check-in (`followUp`)   | `RWMe0d` | https://tally.so/r/RWMe0d |

The acne intake is the full intake plus the breakout questions. The full intake
keeps "Acne/breakouts" as a concern, without those questions. Sammy decided this
on 2026-11-14.

After a change, run
`pnpm exec varlock run -- node scripts/intake/sync-forms.ts`. The script
replaces the blocks of each form and publishes it. Each question UUID comes from
the form key, the block type, and the block key. Each option UUID also comes
from the option text, so a reorder keeps each answer on its option. A sync
therefore keeps old answers attached to their questions. Do not rename the key
of a question that has answers, and do not change its type. Do not reword an
option that has answers. Add a new option instead.

A consent text in a form is part of the record of what a client agreed to. The
git history of `scripts/intake/forms.ts` keeps each consent text, and each
submission has its submission time. So merge a consent change before the sync.
The script prints a line for each form when that form goes live, with the time
and the commit. Copy each line to the log, also after a run that stops early. A
client who opened the form before that time can still send it after that time,
so the submission time does not prove which text the client saw. A minor consent
change that adds no use, recipient, or retention can still update the form in
place. A consent change that adds a use or a recipient of health data, or keeps
health data longer, goes in a new form instead:

1. List each form that the change affects. A shared consent text can affect all
   three forms.
2. Set the ID of each affected form in `src/lib/intake.ts` to an empty string,
   and commit. Do this for all of them before the first sync, or the sync
   updates an old form in place.
3. Run the sync. It creates each new form and prints its ID. Commit those IDs.
4. Change the form links in each Cal.com event description and in the tables
   above.
5. Find each upcoming booking whose client has not yet sent the affected form.
   Send that client the new link, because the confirmation email and the
   calendar invite hold the old link.
6. Close each old form in Tally, and never sync it again. A submission to it
   then keeps the old text.
7. Add each old form ID and its last commit to the log.

The form ID of a submission then names the text that the client saw. The same
change to `/privacy` or `/health-data` also needs new consent. Ask each
returning client to fill in a new full intake before the change applies to them.
`/privacy` promises this.

Tally emails each submission to the account address at `skingroove.studio`. The
email holds the answers and the signed photo links. Clients get no copy, because
Cal.com already confirms the booking.

#### Source of the questions

Sammy supplied the full intake as "Client Intake and Consent" on 2026-11-14. The
form follows its questions, sections, consent text, and policies. These items
differ from that document:

- The health information consent is added. MHMDA requires a consent to collect
  health data that is separate from other terms. Sammy's accuracy statement does
  not count as that consent.
- The age question and the parent or guardian consent for clients 13 to 17 are
  added.
- The prescription follow-up asks for oral medications, such as isotretinoin
  (Accutane), because they change what is safe to recommend.
- The signature is a typed full name, for the client and for a guardian. The
  Tally drawn signature does not work with a keyboard or a screen reader
  ([Tally accessibility](https://tally.so/help/accessibility)). A typed name is
  a valid electronic signature under the ESIGN Act. Decided 2026-11-18.
- The date line of the signature block is left out. Tally records the submission
  date.
- The optional photo permission is a single choice that is not required. No
  answer means that the photos stay private.

Sammy reviewed the live form on 2026-11-14. She kept the full date of birth. The
breakout questions are in the acne intake only, and every acne client answers
them. All habit questions are required, except the last lifestyle question.

Sammy's document has no check-in. The check-in form is from this repository.

#### Tally API behavior

- Option UUIDs must carry version 4 bits. The Tally form treats a selected
  option with another UUID version as an "Other" answer.
- A logic condition compares a question with one option UUID. Use `CONTAINS` for
  a checkbox question and `IS` for a single-choice question. Tally rejects
  `IS_ANY_OF`.
- A shown question needs `isHidden` on its title, its input, and each option.
  `showWhen()` in `form-blocks.ts` does this.
- Tally text blocks drop HTML lists. Each paragraph is its own block.
- A date field needs `format: 'MM/dd/yyyy'`, or it uses the day-first format.
- A file upload sends the photo to Tally as soon as the client picks it, before
  the form is sent. So the consent questions come on a page before the photo
  uploads in each form, and the intake parent or guardian section comes with
  them. The check-in repeats the health data disclosure from the intake above
  its consent checkbox. The check-in does not ask the age again: the guardian
  consents in the intake, and Sammy checks the intake before she confirms a
  follow-up. Sahand decided on 2026-11-18 to keep extra questions out of the
  check-in, because the law does not require them.

### Retention

Skin Groove keeps intake submissions, and the email copies of them, until a
client asks for deletion. The decision on 2026-11-14 replaced an earlier daily
job that deleted a client 12 months after the latest submission. No law sets a
period. MHMDA requires a published retention policy and deletion on request.

To delete the data of a client:

1. Log the request: the date that it arrived, the client, and its scope. The
   scope is all of their data, or only the items that they name, such as one
   photo. Describe each item in general terms, such as "one intake answer" or
   "one photo". Keep health details out of the log. If the scope is not clear,
   ask the client. The 45-day answer period starts on the date of the request.
2. Confirm the identity of the requester before you delete anything. A sender
   address can be faked, so a matching address is not enough. Send a new message
   to the email address or the phone number on the intake form, and ask the
   requester to confirm the request in a reply to it. For a client with no
   intake, use the email address on their Cal.com booking. For a client under
   18, the parent or guardian on the form can ask. For a request from the parent
   or guardian, send the message to the guardian email on the form. Log the
   check. The time of this check counts toward the 45 days.
3. Before you delete anything, record in the log the ID of each Tally submission
   and each Cal.com booking of the client. The notices in step 7 need them. For
   a full deletion, cancel each upcoming booking of the client in Cal.com, so
   that its cancellation email arrives before the Gmail cleanup in step 5. For a
   request with a narrow scope, do steps 4 to 7 only for the named items and
   their copies. The Tally dashboard deletes only whole submissions. If a named
   item is a photo or an answer in a Tally submission, ask Tally support to
   delete only that item. If Tally cannot, tell the requester, and ask whether
   to delete the whole submission. If the requester says no, finish the other
   named items. Then tell the requester in writing which item stays and why, and
   how to appeal. Close the request on that answer. Cancel a booking only when
   the client asks for that, and notify only the companies that hold the named
   items.
4. Delete each of their submissions to the `consult`, `acne`, and `followUp`
   forms in the Tally dashboard, and to each closed form in the log. Deleted
   submissions stay recoverable in the Tally Trash for 90 days. Tally can only
   empty the whole Trash, so first look at what else it holds. Restore each
   other item that Sammy wants to keep. Then empty the Trash.
5. In Gmail, delete each Tally notification email for those submissions. Also
   delete each email from the client, each reply to the client, and each Cal.com
   email about a booking from step 3, including the cancellation emails, in the
   inbox and in Sent Mail. Then remove them from the Gmail trash, which keeps
   them for 30 days. If the client made an access request, also delete its
   Google Drive folder, and remove it from the Drive trash.
6. Delete the text messages and photos from the client on Sammy's phone, and
   from its backups. Also delete each saved copy of a marketing photo of the
   client, and each edited version, wherever Sammy keeps it. Delete any files
   from an access request that are still on her computer, and empty its trash.
   If a computer backup copied those files, delete them from the backup too.
7. Notify each processor and third party that received the data of the request.
   MHMDA requires this notice in addition to the deletion. Send Tally support a
   written notice that names the request and the submission IDs from step 3,
   with no health data in it. Ask Tally to delete any upload from the client in
   a form that was not submitted. Tally receives a photo when the client picks
   it, and Tally does not document what it keeps from a form that is not sent.
   Send Cal.com support a written request to delete each booking from step 3.
   For Google Workspace, delete the calendar events of the client, then remove
   them from the Calendar trash, which keeps them for 30 days. That deletion and
   the ones in step 5 are the instruction under its data processing terms. Send
   Stripe support the same notice. Stripe and Skin Groove keep the payment
   records that tax and payment law require. If the client allowed marketing
   photos, remove the posts that Sammy controls. Record each notice in the log.
8. Finish steps 3 to 7 within 30 days of the identity check in step 2. Nevada
   law sets this deadline for the deletion and the notices, and an extension of
   the answer does not move it. Wait for Cal.com support to confirm the deletion
   of the bookings. Also wait for Tally support to answer the notice in step 7,
   and to confirm each item that step 3 asked it to delete. Then delete the
   emails with Cal.com and Tally support about the request, and remove them from
   the Gmail trash. The log keeps the date of each notice. Then tell the
   requester that the deletion is done, within 45 days of step 1. Name the
   records that the law requires Skin Groove to keep, such as payment records.
   If a deletion is still pending near day 45, tell the requester why before
   day 45. The deadline then moves out by 45 more days.

A requester can appeal a refusal or a partial answer by a reply, as
`/health-data` says. Log the appeal. Answer it in writing within 45 days, and
explain the decision. If the decision stays, include the complaint page of the
Washington State Attorney General (https://www.atg.wa.gov/file-complaint), as
MHMDA requires. Also name the attorney general of the requester's state, as
Nevada law requires.

The lawyer review covers this procedure.

A client who withdraws the health information consent also asks for deletion.
Follow the same steps. A client who withdraws only the marketing photo
permission keeps the rest of their data: remove the posts that Sammy controls,
delete the saved marketing copies, and log the date.

### Access requests

A client can ask whether Skin Groove holds their consumer health data, for a
copy of it, and for a list of each recipient. For a client under 18, the parent
or guardian on the form can ask too. To answer an access request:

1. Log the request: the date that it arrived, and the client. The request
   arrives by email to `sammy@skingroove.studio`, as `/health-data` says.
2. Confirm the identity of the requester, as in step 2 of the deletion steps.
   Log the check.
3. Collect the data: each Tally submission of the client with its photos, the
   emails and texts with the client, the Cal.com bookings of the client, and the
   Cal.com emails about those bookings. Also collect each saved copy of a
   marketing photo of the client, each edited version, and the links to its
   posts. Download the files to one folder on Sammy's computer, and upload them
   from there. Use a folder that the computer does not back up, such as one
   outside iCloud Drive that Time Machine excludes.
4. Share the copy in a Google Drive folder that only the verified requester can
   open: the email address of the client, or of the parent or guardian on the
   form. Do not attach health data or photos to an email. A requester without a
   Google Account opens the folder as a Drive visitor: they confirm their email
   address with a code, and the access lasts 7 days. After 7 days, they confirm
   the code again. If the requester cannot open the folder, send the copy as an
   encrypted ZIP file, and give the password by phone. After the share, delete
   the local folder and empty the computer trash. If a backup copied the folder,
   delete it from the backup too. Delete the Drive folder 30 days after the
   answer, and remove it from the Drive trash. Log the deletion.
5. Add the list of recipients, with the privacy contact of each from its privacy
   policy. Name only the companies that received data of this client: Tally for
   a form that the client sent or started, and Google Workspace for the emails
   and calendar events. Name Cal.com and Stripe for a booking. Name the public
   posts and Meta only if Sammy posted a photo of the client. Name the mobile
   carriers, and Apple for iMessage, if the client sent texts.
6. Answer the requester within 45 days of step 1. If more time is necessary,
   tell the requester why before day 45. The deadline then moves out by 45 more
   days. Log the answer.

### Text messages

Sammy texts with clients between consultations, for example for acne check-ins
(decided 2026-11-15). Clients can send updates and skin photos by text, so the
texts hold consumer health data. Both policies say so: `/privacy` names texting
and its retention, and `/health-data` names texts as a source and names the
carriers that carry them. The intake "Communication" consent covers messages
through the contact methods that the client gives.

- Keep client texts on a phone with a passcode and two-factor login for its
  account backup.
- Send no marketing texts. TCPA requires separate opt-in consent for them.

### Acceptance test

Tests on 2026-11-14 passed for these items:

- A full intake and a check-in, submitted in Chromium with test photos and a
  signature.
- Prefill of the name and the email from URL parameters (`attendeeName`,
  `email`, `uid`).
- A deletion through the API.
- Photo links: a link without its token returns `400`.

Run these items before launch:

1. Upload a photo from an iPhone and from an Android phone. Make sure that each
   photo opens in the dashboard. iPhone HEIC files often fail to preview.
2. In each intake, select "13 to 17". Make sure that the parent or guardian
   fields and the guardian's typed signature show and are required. Select "18
   or older", and make sure that they stay hidden.
3. Book a test consultation and a test follow-up. Make sure that the
   confirmation email and the calendar invite show the form link and a Google
   Meet link.

## Intake flow

Clients must be 13 or older. COPPA rules out clients under 13. For a client 13
to 17, a parent or guardian completes the age part of the intake: name, email,
consent for the child, and a typed signature. Cal.com's terms do not let a
person under 18 use a booking page. So the parent or guardian of a client under
18 makes the booking. Each event description ends with "Clients under 18 need a
parent or guardian to book for them." The name field of each event reads
"Client's name", so the meeting shows the client's name. Sammy checks the age
and the birth date on the intake before she confirms a booking. If they do not
match, she asks the client. The client states the age, and the question offers
no choice under 13. COPPA applies to a site for children, or when Skin Groove
knows that a client is under 13. So the site needs no stronger age check. If
Sammy learns in the consult that a client is under 13, she declines the client
and deletes the data. Sahand decided this on 2026-11-19.

1. The client books and pays in Cal.com, in the popup on the site or on cal.com.
2. The description of each event holds the link to its Tally form. Cal.com shows
   the description on the booking page, in the confirmation email, and in the
   calendar invite.
3. Sammy confirms the booking. Both events require confirmation.
4. Sammy reads submissions only in the Tally dashboard.

The forms keep the hidden fields `uid`, `email`, and `attendeeName`. A link with
these URL parameters fills in the name and the email. No link sends them yet.

The site has no hand-off script. Cal.com fires `bookingSuccessfulV2` before
payment and sends no event after payment, so a script could cover the Stripe
checkout.

### Cal.com plan limits

Sammy uses the Cal.com Free plan. These limits shape the flow:

- "Redirect on booking" needs a Team plan. The API refuses `successRedirectUrl`
  with a `403`.
- Workflows work, but email steps on Free send the default template text. The
  API accepts a custom message and replaces it with the default. So a workflow
  cannot send a form link or the follow-up link.
- The event description is free, and Cal.com emails include it. It carries the
  form links.

### Cal.com event settings

All events use Google Meet, require confirmation, need 24 hours of notice, and
add a 15-minute buffer after the event. All write to the
`sammy@skingroove.studio` Google calendar and hide the guests field.

| Event                     | Slug                        | ID      | Visibility | Form link in the description |
| ------------------------- | --------------------------- | ------- | ---------- | ---------------------------- |
| Virtual Skin Consultation | `virtual-skin-consultation` | 7436556 | Public     | https://tally.so/r/lae2yB    |
| Virtual Acne Consultation | `virtual-acne-consultation` | 7916454 | Public     | https://tally.so/r/M1NW5M    |
| Virtual Skin Follow Up    | `virtual-skin-follow-up`    | 7909647 | Hidden     | https://tally.so/r/RWMe0d    |

All events hide the notes field, so that symptoms and skin details stay out of
Cal.com. The forms ask the same question. The booking itself still names the
event, for example `Virtual Acne Consultation`, next to the identity of the
client. Data that identifies a consumer who seeks health care services can be
consumer health data under RCW 19.373.010(8)(b)(xii). The site therefore treats
each booking as consumer health data. It collects the booking because the client
asks for the consultation. Both policies name Cal.com and the Google calendar as
processors. `/health-data` names Stripe as a third party, because Stripe also
uses payment data for its own purposes. The lawyer review confirms this.

### New and returning clients

Cal.com has three event types, and each event description links to its own Tally
form. The event decides the form, so the client does not choose it.

| Cal.com event | Who can book                  | Length     | Form path                                                                   |
| ------------- | ----------------------------- | ---------- | --------------------------------------------------------------------------- |
| Consultation  | Anyone, from the site         | 45 minutes | Full intake: health history, baseline photos, all consents, signature       |
| Acne          | Anyone, from Cal.com          | 60 minutes | Acne intake: the full intake plus the breakout questions                    |
| Follow-up     | Clients with the private link | 30 minutes | Check-in: changes since the last visit, progress photos, consent checkboxes |

- The follow-up event is hidden from the Cal.com profile, but anyone with the
  link can book it. Before Sammy confirms a follow-up request, she checks that
  the client has a full intake on file, with the guardian consent for a client
  13 to 17. If not, she declines the request and sends the consultation link.
- Sammy gives the follow-up link to the client at the end of the consultation,
  for example in the Google Meet chat. Cal.com Free cannot send it
  automatically. See "Cal.com plan limits".
- Acne follow-ups use the same event and the same check-in. Their timing varies,
  so Sammy and the client book the next one together during the call: she pastes
  the link in the Meet chat, and the client picks the date and pays.
- The check-in asks what changed since the last visit: medications, pregnancy,
  allergies, skin conditions, or treatments.
- Each check-in repeats the health data consent and the photo consent as
  checkboxes. A client who skips the full intake still gives consent.
- Sammy asks a client for a new full intake once a year.

### Photos for marketing

MHMDA requires a separate consent before the business shares health data. The
optional photo permission in the intake tells Sammy who is open to marketing
use. Before she posts a photo, she gets a yes from the client. A spoken yes, on
a call or in person, is enough. MHMDA asks for a clear yes, and a written one is
optional (decided 2026-11-18):

- For a client under 18, ask the parent or guardian on the form, not the client.
- When she asks, name the photo and where it goes, for example Instagram or the
  newsletter. Say that the client can say no later, and that Sammy then removes
  the posts that she controls. MHMDA requires these points in each consent
  request.
- Note the date and the yes in her own records. The client does nothing more.
- If the client changes their mind, remove the posts that Sammy controls. Sent
  newsletters cannot be recalled.

## Site rules

- Keep intake answers out of Cal.com. Booking questions collect the name, the
  email, and the phone number only. The name field reads "Client's name",
  because a parent or guardian books for a client under 18.
- Add no analytics, ad pixels, or session replay to the site, the booking flow,
  or the intake form. Attach no analytics app to the Cal.com event.
- Send intake submissions only to the Tally notification email. Send none to
  spreadsheets or other integrations, and never forward a photo link.
- Name Skin Groove LLC in the footer and in the privacy policy.
- Link the privacy policy and the consumer health data privacy policy from the
  footer of each page.
- Keep the Content Security Policy in `astro.config.ts`. Allow only the known
  script and frame origins. Astro hashes inline scripts into a meta tag.

## Site work

Done:

- The privacy policy page at `/privacy`.
- The consumer health data privacy policy page at `/health-data`.
- The footer, with the privacy link and "© Skin Groove LLC".
- The Content Security Policy.
- Both intake forms, with consent text, as code.

Not done:

- Booking copy about the intake. Sammy writes the site copy, so she supplies it.

## Shop credit

None. Sammy dropped the $50 shop credit on 2026-11-14, because clients could
abuse it and its duration was not known.

## Open items

### Sahand

- Set the prices in Cal.com after the Stripe setup: $75 for the acne
  consultation. The site shows no prices.
- Attach no analytics apps to the Cal.com events.
- Run the remaining acceptance tests.
- Before #13 merges, turn on two-factor login for Tally, Cal.com, Google
  Workspace, Stripe, Shopify, and Resend. `/privacy` says that each account uses
  it, and the merge publishes that page.
- Ask Tally support how long it keeps a photo from a form that is not submitted,
  and how to delete it. Record the answer in this document.
- Turn on Drive visitor sharing in the Google Admin console before the first
  access request. Without it, a requester without a Google Account cannot open
  the access folder.

### Sammy

- Get professional, product, and general liability insurance, for example
  through ASCP. Confirm the four points in "Insurance and liability".
- Get a quote for cyber or privacy coverage.
- Email the board at ra-cosmetology@pa.gov. Ask it to confirm that virtual
  consults need no salon license.
- Get a lawyer review of the privacy policy (`/privacy`), the consumer health
  data privacy policy (`/health-data`), and the form text
  (https://tally.so/r/lae2yB, https://tally.so/r/M1NW5M, and
  https://tally.so/r/RWMe0d). Include the parent or guardian consent for clients
  13 to 17.
- Make the Cal.com cancellation and refund settings match the policies in the
  form: 24 hours of notice, and no refund after a completed consultation.
- Open the follow-up and acne events in Cal.com once, and make sure that Google
  Meet is their location.
- Decide whether the site shows the acne consultation. Cal.com lists it on the
  profile page, but the site links only the regular consultation.
- Edit the wording of the form links in the event descriptions if needed.
- Supply booking copy about the intake for the site.
- Before the shop opens, read the online resale policy of each brand. Many
  professional brands restrict online sales and set minimum advertised prices.

## Sources

- [Cal.com field types](https://github.com/calcom/cal.com/blob/main/packages/features/form-builder/fieldTypes.ts)
- [IAPP: MHMDA overview](https://iapp.org/resources/article/washington-my-health-my-data-act-overview)
- [Stoel Rives: MHMDA FAQ](https://www.stoel.com/insights/publications/faq-washington-states-my-health-my-data-act)
- [Baker: MHMDA private right of action](https://www.bakerdatacounsel.com/blogs/examining-the-private-right-of-action-in-washingtons-my-health-my-data-act/)
- [NatLawReview: MHMDA consent](https://natlawreview.com/article/my-health-my-data-act-consent-requirements)
- [Nevada SB 370 enrolled text](https://legiscan.com/NV/text/SB370/id/2825632/Nevada-2023-SB370-Enrolled.pdf)
- [Manatt: Connecticut consumer health data](https://www.manatt.com/insights/newsletters/privacy-and-data-security/connecticuts-new-law-on-consumer-health-data-is-n)
- [Healthcare Brew: New York veto](https://www.healthcare-brew.com/stories/2026/01/12/new-york-governor-vetoes-health-data-privacy-bill)
- [PA Cosmetology Law](https://www.pa.gov/content/dam/copapwp-pagov/en/dos/department-and-offices/bpoa/cosmetology/COSMETOLOGY-LAW.pdf)
- [BakerHostetler: PA breach law](https://www.bakerlaw.com/insights/pennsylvania-makes-significant-changes-to-its-data-breach-notification-law)
- [FDA: Cosmetic, drug, or both](https://www.fda.gov/cosmetics/laws-regulations/it-cosmetic-drug-or-both-or-it-soap)
- [Morgan Lewis: FTC reviews rule](https://www.morganlewis.com/pubs/2024/08/ftc-issues-final-rule-on-consumer-reviews-and-testimonials)
- [ASCP FAQ](https://www.ascpskincare.com/faq)
- [Marshall Dennehey: Pennsylvania product liability](https://marshalldennehey.com/articles/product-liability-pennsylvania)
- [Tally API: delete a submission](https://developers.tally.so/api-reference/endpoint/forms/submissions/delete)
- [Tally: delete and recover data](https://tally.so/help/how-to-delete-and-recover-form-data)
- [forms.app pricing](https://forms.app/en/pricing)
- [forms.app security](https://forms.app/en/security)
- [Tally pricing](https://tally.so/pricing)
- [Tally file uploads](https://tally.so/help/file-uploads)
- [Tally GDPR](https://tally.so/help/gdpr)
- [Fillout pricing](https://www.fillout.com/pricing)
- [Fillout security](https://www.fillout.com/help/security)
- [Fillout file deletion](https://www.fillout.com/help/delete-a-form-submission)
