const calUser = 'sammymintzer'

/** Sammy's Cal.com profile. It lists each consult, so it works as the booking page without JavaScript. */
export const bookingUrl = `https://cal.com/${calUser}`

export const consults = [
	{
		key: 'skin',
		side: 'Side A',
		name: 'Skin consultation',
		minutes: 45,
		body: 'Your skin, your routine, and your goals, with a plan made just for you.',
		calLink: `${calUser}/virtual-skin-consultation`,
	},
	{
		key: 'acne',
		side: 'Side B',
		name: 'Acne consultation',
		minutes: 60,
		body: 'A deeper look at your breakouts, what sets them off, and how to calm them.',
		calLink: `${calUser}/virtual-acne-consultation`,
	},
] as const

/** The hidden follow-up event. Only past clients get this link. */
export const followUpBookingUrl =
	'https://cal.com/sammymintzer/virtual-skin-follow-up'

export const contactEmail = 'sammy@skingroove.studio'

export const instagramHandle = 'beautybysmintz'

export const instagramUrl = `https://www.instagram.com/${instagramHandle}/`
