interface WavyOutline {
	width: number
	height: number
	amplitude: number
	waves: number
}

type Point = readonly [x: number, y: number]

const samplesPerWave = 8

const format = ([x, y]: Point) =>
	`${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`

const midpoint = (a: Point, b: Point): Point => [
	(a[0] + b[0]) / 2,
	(a[1] + b[1]) / 2,
]

/**
 * Traces a stadium with a ripple along its normal, like a 1970s wavy mirror.
 * The trace starts at the top center, so the left and right sides match.
 */
export function wavyOutlinePath({
	width,
	height,
	amplitude,
	waves,
}: WavyOutline) {
	const radius = width / 2 - amplitude
	const side = height - 2 * amplitude - 2 * radius
	const arc = Math.PI * radius
	const perimeter = 2 * side + 2 * arc
	const centerX = width / 2
	const topY = height / 2 - side / 2
	const bottomY = height / 2 + side / 2

	const pointAt = (distance: number): Point => {
		const reach =
			radius +
			amplitude * Math.cos((2 * Math.PI * waves * distance) / perimeter)

		if (distance < arc / 2) {
			const angle = distance / radius

			return [centerX + reach * Math.sin(angle), topY - reach * Math.cos(angle)]
		}

		if (distance < arc / 2 + side) {
			return [centerX + reach, topY + distance - arc / 2]
		}

		if (distance < (3 * arc) / 2 + side) {
			const angle = (distance - arc / 2 - side) / radius

			return [
				centerX + reach * Math.cos(angle),
				bottomY + reach * Math.sin(angle),
			]
		}

		if (distance < (3 * arc) / 2 + 2 * side) {
			return [centerX - reach, bottomY - (distance - (3 * arc) / 2 - side)]
		}

		const angle = (distance - perimeter) / radius

		return [centerX + reach * Math.sin(angle), topY - reach * Math.cos(angle)]
	}

	const samples = waves * samplesPerWave

	const points = Array.from({ length: samples }, (_, index) =>
		pointAt((index * perimeter) / samples),
	)

	// Each sample is a control point between two midpoints, which keeps the curve smooth.
	const curves = points.map((point, index) => {
		const next = points[(index + 1) % samples] ?? point

		return `Q${format(point)} ${format(midpoint(point, next))}`
	})

	const start = midpoint(points.at(-1) ?? [0, 0], points[0] ?? [0, 0])

	return `M${format(start)}${curves.join('')}Z`
}
