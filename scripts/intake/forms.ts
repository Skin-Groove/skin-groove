// The intake forms and their consent text. Sammy wrote the questions and the
// consent sections in "Client Intake and Consent". The health information
// consent and the age confirmation come from docs/privacy-and-intake.md. A
// lawyer reviews this file before launch. Run
// `pnpm exec varlock run -- node scripts/intake/sync-forms.ts` after a change.

import type { IntakeFormKey } from '../../src/lib/intake.ts'
import { type Block, FormBuilder, type FormSettings } from './form-blocks.ts'

const privacyLink =
	'<a href="https://skingroove.studio/privacy">privacy policy</a>'

const healthDataLink =
	'<a href="https://skingroove.studio/health-data">consumer health data privacy policy</a>'

const healthDataDisclosure = `My answers and photos include health information. Skin Groove collects it only to prepare for and hold my consultations, never sells it, and shares it only with the companies in the ${healthDataLink}. It uses a photo of me for marketing only with my separate permission. I can withdraw this consent or ask Skin Groove to delete my information at any time by email.`

// Prefill parameters, named as Cal.com forwards them on a booking redirect. The
// client emails send them through `intakeFormUrl` in src/lib/intake.ts. See
// https://cal.com/help/event-types/booking-success-page-query-params
function identity(form: FormBuilder) {
	const hidden = form.hiddenFields(['attendeeName', 'email', 'uid'])

	form.input('name', 'Full name', 'INPUT_TEXT', {
		required: true,
		...(hidden.attendeeName && { defaultFrom: hidden.attendeeName }),
	})

	return hidden
}

function email(form: FormBuilder, hidden: ReturnType<typeof identity>) {
	form.input('email', 'Email', 'INPUT_EMAIL', {
		required: true,
		...(hidden.email && { defaultFrom: hidden.email }),
	})
}

const yesNo = ['Yes', 'No'] as const

/** A yes or no question with a follow-up field that shows on yes. */
function yesThenExplain(
	form: FormBuilder,
	key: string,
	title: string,
	options: readonly string[],
	followUp: string,
) {
	const question = form.choice(key, title, options, { required: true })

	const explain = form.textarea(`${key}-details`, followUp, {
		required: true,
		hidden: true,
	})

	form.showWhen(
		`${key}-logic`,
		[{ question, option: options[0] ?? 'Yes' }],
		[explain],
	)
}

const photoTips =
	'<b>Photo tips:</b> Natural lighting whenever possible. No makeup, filters, portrait mode, or beauty settings. Don’t worry about getting a “flattering” picture — I want to see your skin as it actually looks.'

// ===== Initial consultations =====

/**
 * The full intake. The acne consultation adds the breakout questions. The
 * regular consultation keeps "Acne/breakouts" as a concern, without them.
 */
function initialIntake(kind: 'consult' | 'acne'): Block[] {
	const form = new FormBuilder(kind)

	form.title(
		kind === 'acne' ? 'Acne Consultation' : 'Initial Skin Consultation',
	)
	form.paragraphs('intro', [
		'This form helps me understand your skin, your routine, and what you want to work toward. Answer as honestly as you can, there are no “good” or “bad” answers!',
		`Your answers and photos stay private. Read the ${privacyLink}.`,
	])

	// 1. The basics
	form.heading('basics', 'The basics')
	const hidden = identity(form)
	form.input('date-of-birth', 'Date of birth', 'INPUT_DATE', { required: true })
	email(form, hidden)
	form.input('location', 'Where are you located?', 'INPUT_TEXT', {
		required: true,
		placeholder: 'City, state',
	})
	form.choice(
		'referral',
		'How did you hear about Skin Groove?',
		['Instagram', 'TikTok', 'Friend/referral', 'Google/search'],
		{ other: true },
	)

	// 2. Your skin, with 3. Breakouts on the acne form
	form.pageBreak('skin')
	form.heading('skin-heading', 'Tell me about your skin')

	form.checkboxes(
		'concerns',
		'What are your top skin concerns right now?',
		[
			'Acne/breakouts',
			'Clogged pores/texture',
			'Blackheads',
			'Redness',
			'Sensitivity/reactivity',
			'Dryness',
			'Excess oil',
			'Dark spots/post-acne marks',
			'Melasma/hyperpigmentation',
			'Fine lines/aging',
			'Dullness',
			'Uneven tone',
		],
		{ required: true, other: true },
	)

	form.input(
		'priority',
		'Of those concerns, which one is your #1 priority?',
		'INPUT_TEXT',
		{ required: true },
	)
	form.choice(
		'concern-duration',
		'How long have you been dealing with your main concern?',
		[
			'Less than 3 months',
			'3–6 months',
			'6–12 months',
			'1–3 years',
			'3+ years',
		],
		{ required: true },
	)
	form.choice(
		'end-of-day',
		'How would you describe your skin by the end of the day?',
		[
			'Dry/tight',
			'Comfortable/pretty balanced',
			'Oily mostly through my T-zone',
			'Oily all over',
			'It really depends on the day',
		],
		{ required: true },
	)
	form.checkboxes(
		'symptoms',
		'Do you experience any of the following? Select all that apply.',
		[
			'Tightness after cleansing',
			'Flaking',
			'Burning/stinging from products',
			'Frequent redness',
			'Itching',
			'Skin that feels hot easily',
			'Oiliness + dryness at the same time',
			'None of these',
		],
		{ required: true },
	)
	form.choice(
		'reactivity',
		'How often would you say your skin feels irritated or reactive?',
		['Rarely/never', 'Occasionally', 'Pretty often', 'Almost constantly'],
		{ required: true },
	)

	if (kind === 'acne') breakoutQuestions(form)

	// 4. Skin and health history
	form.pageBreak('health')
	form.heading('health-heading', 'Skin + health history')
	form.checkboxes(
		'conditions',
		'Have you ever been diagnosed with any skin conditions? Select all that apply.',
		[
			'Acne',
			'Rosacea',
			'Eczema/dermatitis',
			'Psoriasis',
			'Melasma',
			'Perioral dermatitis',
			'Seborrheic dermatitis',
			'None',
		],
		{ required: true, other: true },
	)
	form.textarea(
		'conditions-details',
		'If yes, tell me a little more, including whether you’re currently treating it.',
	)
	yesThenExplain(
		form,
		'dermatologist',
		'Are you currently under the care of a dermatologist for your skin?',
		yesNo,
		'What are you currently seeing them for?',
	)
	yesThenExplain(
		form,
		'prescriptions',
		'Are you currently using any prescription medications for your skin?',
		yesNo,
		'Please list the medication(s), how often you use them, and approximately how long you’ve been using them. Include oral medications, such as isotretinoin (Accutane) or spironolactone.',
	)
	form.choice(
		'pregnancy',
		'Are you pregnant, breastfeeding, or currently trying to conceive?',
		[
			'No',
			'Pregnant',
			'Breastfeeding',
			'Trying to conceive',
			'Prefer not to say',
		],
		{ required: true },
	)
	yesThenExplain(
		form,
		'allergies',
		'Do you have any known allergies or ingredient sensitivities that could affect your skincare recommendations?',
		['Yes — please explain below', 'No'],
		'Allergies/sensitivities',
	)
	yesThenExplain(
		form,
		'reactions',
		'Have you ever had a significant reaction to a skincare product or professional skin treatment?',
		['Yes — please explain below', 'No'],
		'Tell me what happened and, if you know, what product or treatment caused it.',
	)

	// 5. Current routine
	form.pageBreak('routine')
	form.heading('routine-heading', 'Your current routine')
	form.choice(
		'routine-style',
		'How would you describe your current skincare routine?',
		[
			'I don’t really have one',
			'Very simple — 1–3 products',
			'I have a routine, but I’m inconsistent',
			'I have a pretty established routine',
			'Skincare is basically my personality',
		],
		{ required: true },
	)
	form.heading('morning', 'Current morning routine ☀️', 3)
	form.input('am-cleanser', 'Cleanser', 'INPUT_TEXT', {
		placeholder: 'Product/brand + how often you use it',
	})
	form.input('am-toner', 'Toner/essence', 'INPUT_TEXT', {
		placeholder: 'Product/brand + how often',
	})
	form.textarea('am-serums', 'Serums/treatments', {
		placeholder: 'Products + how often',
	})
	form.input('am-moisturizer', 'Moisturizer', 'INPUT_TEXT')
	form.input('am-spf', 'SPF', 'INPUT_TEXT')
	form.input(
		'am-prescription',
		'Prescription products, if applicable',
		'INPUT_TEXT',
	)
	form.input('am-other', 'Anything else?', 'INPUT_TEXT')
	form.heading('evening', 'Current evening routine 🌙', 3)
	form.input('pm-cleanser', 'Cleanser', 'INPUT_TEXT', {
		placeholder: 'Product/brand + how often you use it',
	})
	form.input('pm-toner', 'Toner/essence', 'INPUT_TEXT', {
		placeholder: 'Product/brand + how often',
	})
	form.textarea('pm-serums', 'Serums/treatments', {
		placeholder: 'Products + how often',
	})
	form.input('pm-moisturizer', 'Moisturizer', 'INPUT_TEXT')
	form.input(
		'pm-prescription',
		'Prescription products, if applicable',
		'INPUT_TEXT',
	)
	form.input('pm-other', 'Anything else?', 'INPUT_TEXT')
	form.choice(
		'consistency',
		'How consistent are you with your routine?',
		[
			'Almost every day',
			'Most days',
			'A few days a week',
			'I’m all over the place',
		],
		{ required: true },
	)
	form.textarea(
		'favorites',
		'Are there any products in your current routine that you absolutely LOVE or don’t want to give up?',
	)
	form.textarea(
		'suspects',
		'Are there any products you’re suspicious might be making your skin worse?',
	)

	// 6. Actives
	form.pageBreak('actives')
	form.heading('actives-heading', 'Let’s talk actives')
	form.checkboxes(
		'actives',
		'Which of these are you currently using? Select all that apply.',
		[
			'Retinol/retinoid',
			'Tretinoin/adapalene',
			'Benzoyl peroxide',
			'Salicylic acid/BHA',
			'Glycolic acid',
			'Lactic acid',
			'Mandelic acid',
			'Azelaic acid',
			'Vitamin C',
			'Exfoliating pads/toners',
			'Physical scrubs',
			'I’m not sure',
			'None',
		],
		{ required: true },
	)
	form.textarea(
		'actives-details',
		'For anything selected above, tell me the product and how often you use it.',
	)

	// 7. What you already tried
	form.heading('tried-heading', 'What have you already tried?')
	form.textarea(
		'tried',
		'What have you tried in the past for your main skin concern?',
	)
	form.textarea('worked', 'Has anything worked particularly well for you?')
	form.textarea('worse', 'Has anything made your skin noticeably worse?')
	form.checkboxes(
		'treatments',
		'Have you had professional skin treatments within the last year?',
		[
			'Facials',
			'Chemical peels',
			'Microneedling',
			'Laser/IPL',
			'Hydradermabrasion/Hydrafacial-type treatments',
			'Dermaplaning',
			'None',
		],
		{ required: true, other: true },
	)
	form.textarea(
		'treatments-details',
		'If yes, tell me what you had done, approximately when, and how your skin responded.',
	)

	// 8. Habits
	form.pageBreak('habits')
	form.heading('habits-heading', 'Your habits')
	form.choice(
		'sun',
		'How often are you intentionally in the sun?',
		['Rarely', 'Occasionally', 'Frequently'],
		{ required: true },
	)
	form.choice(
		'sunscreen',
		'How often do you wear sunscreen?',
		[
			'Every day',
			'Most days',
			'Only when I’m going to be outside',
			'Rarely/never',
		],
		{ required: true },
	)
	form.choice(
		'makeup',
		'Do you regularly wear makeup?',
		['Yes', 'Sometimes', 'Rarely or never'],
		{ required: true },
	)
	form.input(
		'exercise',
		'How often do you exercise or sweat heavily?',
		'INPUT_TEXT',
		{ required: true },
	)
	form.choice(
		'stress',
		'Do you notice your skin changing during periods of high stress or poor sleep?',
		['Yes', 'No', 'Not sure'],
		{ required: true },
	)
	form.textarea(
		'lifestyle',
		'Anything else about your lifestyle that you think may be affecting your skin?',
	)

	// 9. Routine goals
	form.heading('goals-heading', 'Let’s build your routine')
	form.choice(
		'routine-feeling',
		'How do you feel about your current routine?',
		[
			'I basically like it and just need some guidance',
			'I’m open to changing a few things',
			'I’m ready for a major overhaul',
			'Please just tell me what to use 😭',
		],
		{ required: true },
	)
	form.choice(
		'routine-size',
		'What kind of routine would you realistically stick to?',
		[
			'Minimal — 3–4 steps',
			'Moderate — 4–6 steps',
			'I love skincare — give me the steps',
			'Whatever you think is best for my skin',
		],
		{ required: true },
	)

	// 10. Consent and policies. They come before the photos, because Tally
	// uploads a photo as soon as the client picks it, before the form is sent.
	form.pageBreak('consent')
	form.heading('consent-heading', 'Consent + policies')
	form.paragraphs('consent-intro', [
		'I want you to feel informed and comfortable throughout your Skin Groove experience. Please review the following before submitting your consultation form.',
	])
	consentSections(form)
	policies(form)
	form.heading('acknowledgment', 'Acknowledgment', 3)
	form.paragraphs('acknowledgment-text', [
		'By typing my full name below, I sign this form. I confirm that I have read and understand the information above. I have had the opportunity to ask questions and voluntarily agree to these terms.',
	])
	// Tally's drawn signature does not work with a keyboard or a screen reader,
	// so a typed name is the signature. https://tally.so/help/accessibility
	form.input('signature', 'Type your full name to sign', 'INPUT_TEXT', {
		required: true,
	})

	// 11. Photos
	form.pageBreak('photos')
	form.heading('photos-heading', 'Photos')
	form.paragraphs('photos-intro', [
		'Please submit 3 clear, makeup-free photos of your skin: front-facing, left side, and right side.',
		photoTips,
	])
	form.photos('photos', 'Your photos', 3)

	// 12. Last little bit
	form.heading('last-heading', 'Last little bit')
	form.textarea(
		'why-now',
		'What made you decide to get professional guidance with your skincare right now?',
	)
	form.textarea(
		'anything-else',
		'Is there anything else about your skin, routine, or previous skincare experiences that you want me to know before we meet?',
	)
	form.thankYouPage(
		'Thank you',
		'I’ll review your answers before your consultation. See you soon!',
	)

	return form.build()
}

function breakoutQuestions(form: FormBuilder) {
	form.heading('breakouts-heading', 'Your breakouts', 3)
	form.checkboxes(
		'breakout-areas',
		'Where do you typically break out?',
		[
			'Forehead',
			'Temples/hairline',
			'Cheeks',
			'Nose',
			'Around my mouth',
			'Chin',
			'Jawline',
			'Neck',
			'Chest/back',
		],
		{ required: true, other: true },
	)
	form.checkboxes(
		'breakout-types',
		'What do your breakouts typically look like? Select all that apply.',
		[
			'Small skin-colored bumps',
			'Blackheads',
			'Whiteheads',
			'Red/inflamed pimples',
			'Pustules',
			'Deep, painful bumps/cysts',
			'A mix / I’m not sure',
		],
		{ required: true },
	)
	form.choice(
		'breakout-frequency',
		'How frequently are you breaking out?',
		['Occasionally', 'A few breakouts every month', 'Most weeks', 'Constantly'],
		{ required: true },
	)
	form.checkboxes(
		'breakout-patterns',
		'Do your breakouts seem to follow a pattern?',
		[
			'Around my period/hormonal changes',
			'Stress',
			'Certain products',
			'Travel',
			'Seasonal/weather changes',
			'Diet',
			'I haven’t noticed a pattern',
		],
		{ required: true, other: true },
	)
	form.choice(
		'picking',
		'Do you tend to pick or pop your breakouts?',
		['Rarely/never', 'Sometimes', 'Frequently'],
		{ required: true },
	)
}

function consentSections(form: FormBuilder) {
	const section = (
		key: string,
		heading: string,
		text: readonly string[],
		agreement = 'I understand and agree.',
	) => {
		form.heading(key, heading, 3)
		form.paragraphs(`${key}-text`, text)
		form.consent(`${key}-consent`, agreement)
	}

	section('scope', 'Scope of skincare guidance', [
		'I understand that Skin Groove provides esthetic skincare education, routine guidance, and product recommendations within the scope of esthetic practice.',
		'Skin Groove does not provide medical care, diagnose or treat medical conditions, or replace care from a dermatologist, physician, or other licensed healthcare provider. If a concern appears to require medical evaluation or treatment, I may be encouraged to consult an appropriate healthcare professional.',
	])
	section('accuracy', 'My skin + health information', [
		'I confirm that the information I have provided about my skin, current products, medications, allergies or sensitivities, pregnancy/breastfeeding status, diagnosed skin conditions, and other relevant information is accurate to the best of my knowledge.',
		'I understand that this information helps guide my recommendations and agree to let Skin Groove know if something relevant changes.',
	])
	section(
		'health-data',
		'Use of my health information',
		[healthDataDisclosure],
		'I consent to Skin Groove collecting and using my health information as described.',
	)
	section('reactions-policy', 'Product recommendations + potential reactions', [
		'I understand that skincare is individual and that results and tolerance can vary from person to person. Even a product that is appropriate for my skin may potentially cause irritation, sensitivity, breakouts, dryness, or an allergic reaction.',
		'I agree to follow the usage instructions provided with my routine and to discontinue a product if I experience a concerning reaction. I understand that severe or persistent reactions should be evaluated by an appropriate healthcare professional.',
	])
	section('results', 'Results + routine changes', [
		'I understand that skincare takes time and that Skin Groove cannot guarantee specific results or a specific timeline.',
		'My recommendations are created based on the information I provide at the time of my consultation. Adding new products, increasing the frequency of active ingredients, or making other significant changes outside of my recommended routine may affect my skin’s response and my results.',
	])
	section(
		'photo-consent',
		'Consultation photos',
		[
			'I consent to submitting photos of my skin for the purpose of my consultation, routine recommendations, documentation, and progress tracking.',
			'These photos will not be posted publicly or used for marketing without my separate permission below.',
		],
		'I consent.',
	)
	photoPermission(form)
	section(
		'retail',
		'Product + retail disclosure',
		[
			'I understand that some products recommended during my consultation may be available for purchase through Skin Groove or an affiliated retail platform. Skin Groove may receive compensation or profit from products purchased through these channels.',
		],
		'I understand.',
	)
	section(
		'communication',
		'Communication',
		[
			'I consent to receiving communications related to my consultation, skincare routine, recommendations, and follow-up from Skin Groove through the contact methods I provide.',
			'I understand that electronic communication has inherent privacy limitations and will avoid sending urgent or emergency medical concerns through these channels.',
		],
		'I consent.',
	)
	ageAndGuardian(form)
}

/**
 * Clients 13 to 17 need a parent or guardian, who completes this part with
 * them. COPPA rules out clients under 13. See docs/privacy-and-intake.md.
 */
function ageAndGuardian(form: FormBuilder) {
	form.heading('age', 'Age', 3)
	form.paragraphs('age-text', [
		'Skin Groove works with clients 13 and older. Clients under 18 need a parent or guardian to book for them and to complete this part with them.',
	])

	const age = form.choice(
		'age-group',
		'How old are you?',
		['18 or older', '13 to 17'],
		{ required: true },
	)

	const guardian = [
		form.input(
			'guardian-name',
			'Parent or guardian’s full name',
			'INPUT_TEXT',
			{
				required: true,
				hidden: true,
			},
		),
		form.input('guardian-email', 'Parent or guardian’s email', 'INPUT_EMAIL', {
			required: true,
			hidden: true,
		}),
		form.consent(
			'guardian-consent',
			'I am this client’s parent or legal guardian. I have read this form, I agree to its terms for my child, and I consent to Skin Groove collecting and using my child’s health information and photos as described.',
			{ hidden: true },
		),
		form.input(
			'guardian-signature',
			'Parent or guardian: type your full name to sign',
			'INPUT_TEXT',
			{ required: true, hidden: true },
		),
	]

	form.showWhen(
		'guardian-logic',
		[{ question: age, option: '13 to 17' }],
		guardian,
	)
}

function photoPermission(form: FormBuilder) {
	form.heading('photo-permission', 'Optional photo + content permission', 3)
	form.paragraphs('photo-permission-text', [
		'This section is completely optional. My choice will not affect the care or recommendations I receive from Skin Groove.',
		'If my photos, results, or skincare journey may be helpful for educational or marketing purposes, I give Skin Groove permission to:',
	])
	form.choice('photo-permission-choice', 'Your choice', [
		'Share my photos/content, including identifiable features',
		'Share my photos/content only when identifying information/features are removed or obscured',
		'Please keep my photos and information completely private',
	])
	form.paragraphs('photo-permission-note', [
		'I understand that I can communicate with Skin Groove if I change my mind about future use of my content.',
	])
}

function policies(form: FormBuilder) {
	form.heading('policies', 'Consultation policies', 3)
	form.paragraphs('policies-text', [
		'<b>Rescheduling + cancellations.</b> If you need to reschedule or cancel your consultation or check in, please provide at least 24 hours’ notice whenever possible. Cancellations or rescheduling requests made within 24 hours of the appointment, as well as missed appointments, may result in the consultation/check in fee being forfeited.',
		'<b>Late arrivals.</b> Because appointment times are reserved specifically for you, arriving late may shorten the amount of time available for your appointment. Depending on how late you arrive, the appointment may need to be rescheduled.',
		'<b>Consultation fees + refunds.</b> Consultation fees cover the time spent reviewing your intake information, assessing your current routine, conducting your consultation, and creating your personalized recommendations. Once a consultation has been completed and personalized recommendations have been provided, consultation fees are non-refundable.',
	])
}

// ===== Follow-up check-in =====

function followUpCheckIn(): Block[] {
	const form = new FormBuilder('follow-up')

	form.title('Skin Check-In')
	form.paragraphs('intro', [
		`A quick update before your follow-up. It takes about 5 minutes. Your answers and photos stay private. Read the ${privacyLink}.`,
	])
	const hidden = identity(form)
	email(form, hidden)
	form.textarea('changes', 'What changed since your last visit?', {
		required: true,
		placeholder:
			'New medications, pregnancy, allergies, skin conditions, or treatments. Write none if nothing changed.',
	})
	form.textarea('progress', 'How is your skin responding to your routine?', {
		required: true,
	})
	form.textarea('focus', 'Anything you want to focus on this time?')
	form.heading('consent-heading', 'Consent', 3)
	form.paragraphs('health-data-text', [healthDataDisclosure])
	form.consent(
		'agreement-consent',
		'The consent + policies that I agreed to at my initial consultation still apply.',
	)
	form.consent(
		'health-data-consent',
		'I consent to Skin Groove collecting and using my health information and photos, as the consumer health data privacy policy describes.',
	)
	// Tally uploads a photo as soon as the client picks it, so the upload sits on
	// a later page than the consent.
	form.pageBreak('photos')
	form.paragraphs('photo-intro', [
		'Please submit 3 clear, makeup-free progress photos: front-facing, left side, and right side.',
		photoTips,
	])
	form.photos('photos', 'Your progress photos', 3)
	form.thankYouPage(
		'Thank you',
		'I’ll review your update before your follow-up. See you soon!',
	)

	return form.build()
}

export const intakeFormBlocks: Record<IntakeFormKey, () => Block[]> = {
	consult: () => initialIntake('consult'),
	acne: () => initialIntake('acne'),
	followUp: followUpCheckIn,
}

export const intakeFormSettings: FormSettings = {
	language: 'en',
	hasProgressBar: true,
	// Tally emails each submission to the account address. Clients get no copy,
	// because Cal.com already confirms the booking.
	hasSelfEmailNotifications: true,
	hasRespondentEmailNotifications: false,
	// Health questions come before the consent page. A partial submission would
	// keep those answers from a client who leaves before consenting.
	hasPartialSubmissions: false,
	// Tally saves unsent answers in the browser, so a client can finish a long
	// form later. Sahand kept this on 2026-11-19: the convenience outweighs the
	// risk that someone else opens the form on a shared device.
	saveForLater: true,
}
