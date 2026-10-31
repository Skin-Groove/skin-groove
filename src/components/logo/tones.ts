// Each mark paints with the `lg-*` tone classes, so one SVG adapts to every surface.

export const fill = {
	ink: 'lg-ink',
	paper: 'lg-paper',
	vinyl: 'lg-vinyl',
	garnet: 'lg-garnet',
	burnt: 'lg-burnt',
	amber: 'lg-amber',
	apricot: 'lg-apricot',
	avocado: 'lg-avocado',
}

export const stroke = {
	ink: 'lg-stroke-ink',
	paper: 'lg-stroke-paper',
	vinyl: 'lg-stroke-vinyl',
	garnet: 'lg-stroke-garnet',
	burnt: 'lg-stroke-burnt',
	amber: 'lg-stroke-amber',
	apricot: 'lg-stroke-apricot',
	avocado: 'lg-stroke-avocado',
}

export type Tone = keyof typeof fill

let lastId = 0

/** A page shows each mark several times, and each copy needs its own SVG ids. */
export function uniqueId() {
	lastId += 1

	return `lg-${lastId}`
}

/** A full circle path that starts at the left and runs clockwise over the top. */
export function circlePath(cx: number, cy: number, r: number) {
	return `M ${cx - r} ${cy} a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 ${-r * 2} 0`
}
