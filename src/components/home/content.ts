// Copy from Sammy, the founder. Keep her wording. Fields with `<em>` render with
// `set:html`.

export const pillars = [
	{
		title: 'Skincare with soul.',
		body: [
			'Skin Groove is a virtual esthetics practice built around personalized skincare guidance, because finding the right routine shouldn’t require endless guessing, wasted money, and a shelf full of products you don’t know how to use.',
			'Through one-on-one consultations, intentional education, and carefully curated product recommendations, I help you build a routine you can feel confident in, tailored to your skin, lifestyle, and goals.',
		],
	},
	{
		title: 'Progress without compromise.',
		body: [
			'I believe you can work toward real results without constantly pushing your skin to its limit. Skin barrier health is at the center of my approach, with corrective ingredients introduced intentionally based on what your skin actually needs.',
		],
	},
	{
		title: 'Professional guidance, from wherever you are.',
		body: [
			'Virtual doesn’t mean impersonal. We’ll look closely and thoroughly at your skin, your current routine, your history, your concerns, and what you actually want to accomplish.',
			'From there, we’ll figure out what’s working, what might be getting in the way, and what your routine is missing. No one-size-fits-all protocols. No starting over just for the sake of starting over. Just thoughtful changes with a reason behind every one.',
		],
	},
]

export const expectations = [
	{
		title: 'A routine that feels uniquely yours',
		motif: 'flowers',
		body: 'Your routine recommendations are made based on your individual skin concerns, history, current routine, and goals. Not a trend or template, and definitely not someone else’s routine.',
	},
	{
		title: 'Education without the overwhelm',
		motif: 'waves',
		body: 'You deserve to know <em>why</em> something is in your routine. Education is a huge part of my approach, so you’ll never leave with a list of products and no understanding of what they’re doing. I want you to understand what you’re using, why you’re using it, and what it’s actually doing for your skin.',
	},
	{
		title: 'A reason behind every recommendation',
		motif: 'rings',
		body: 'If something you already own is a great fit for your skin and goals, there’s no reason to replace it. We’ll keep what makes sense, rethink what doesn’t, and fill in the gaps where needed.',
	},
] as const

export const sammyIntro = [
	'I’m an esthetician and cosmetologist with a deep love for skincare, ingredient knowledge, and figuring out the <em>why</em> behind what’s happening on the surface.',
	'I believe skincare should feel custom, approachable, and a lot less confusing. I’m especially passionate about skin barrier health, acne, sensitive skin, and rosacea, but more than anything, I love helping people understand their skin and feel confident in the choices they’re making for it.',
	'My approach is never about chasing perfection or convincing you that you need a ten-step routine with no explanation. It’s about looking at the full picture, making sure you understand the function behind each product you use, and creating a routine that feels intentional, realistic, and completely your own.',
]

export const services = [
	{
		name: 'The consult',
		image: '/images/groove/37-lg.webp',
		kind: '$50 · 45-minute virtual consult',
		body: 'A one-on-one virtual consultation about your skin, your current routine, your history, and your goals.',
	},
	{
		name: 'The routine edit',
		image: '/images/groove/43-lg.webp',
		kind: 'Included with every consult',
		body: 'A practical plan that keeps what works, rethinks what doesn’t, and explains every step.',
	},
	{
		name: 'The shelf',
		image: '/images/groove/06-lg.webp',
		kind: '$50 shop credit after your consult · Opening soon',
		body: 'A small, considered product edit chosen to support your routine without adding clutter.',
	},
]

export const questions = [
	{
		question: 'How much does it cost?',
		answer:
			'A consultation is $50. Afterward, you get a $50 code for the Skin Groove shop. The shop opens soon.',
	},
	{
		question: 'How does a virtual consultation work?',
		answer:
			'Book a 45-minute time online, and we’ll meet virtually from wherever you are. We’ll look closely and thoroughly at your skin, your current routine, your history, your concerns, and what you actually want to accomplish.',
	},
	{
		question: 'Do I need to overhaul my entire routine?',
		answer:
			'Probably not. If something you already own is a great fit for your skin and goals, there’s no reason to replace it. No starting over just for the sake of starting over.',
	},
	{
		question: 'What do I leave with?',
		answer:
			'A routine you can feel confident in, plus an understanding of what each product is doing and why it’s there.',
	},
]

// Mood photography from docs/esti_vision_board, resized into public/images/groove.
// Each row holds 12 images. The tile shapes repeat every 3 images, so both copies of a row in the marquee match.
export const galleryRows = [
	['01', '13', '37', '05', '41', '49', '43', '02', '50', '27', '15', '53'],
	['44', '03', '47', '52', '16', '38', '11', '42', '55', '25', '14', '66'],
]
