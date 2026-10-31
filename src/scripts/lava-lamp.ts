const vertexShader = `
attribute vec2 position;
void main() {
	gl_Position = vec4(position, 0.0, 1.0);
}
`

// Metaballs: each blob adds r²/d² to a field. The wax edge sits where the field crosses 1.
const fragmentShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uBase;
uniform vec3 uWax;
uniform vec3 uHot;

void main() {
	vec2 uv = gl_FragCoord.xy / uResolution;
	float aspect = uResolution.x / uResolution.y;
	vec2 p = vec2(uv.x * aspect, uv.y);
	float t = uTime * 0.07;
	float field = 0.0;

	for (int i = 0; i < 8; i++) {
		float n = float(i);
		vec2 center = vec2(
			aspect * (0.06 + 0.88 * fract(n * 0.381 + 0.13) + 0.05 * sin(t * 1.3 + n * 2.1)),
			0.45 + 0.65 * sin(t * (0.55 + n * 0.09) + n * 1.7)
		);
		// Tall phone sections would otherwise stretch each blob across the screen.
		float radius = (0.09 + 0.04 * sin(n * 3.1)) * min(aspect, 1.0);
		vec2 d = p - center;
		field += radius * radius / dot(d, d);
	}

	// Heat pools at the bottom, like the base of a real lamp.
	field += 0.6 * smoothstep(0.3, 0.0, uv.y);

	float glow = smoothstep(0.3, 1.0, field);
	float wax = smoothstep(0.96, 1.04, field);
	// Wax glows hotter near the lamp base.
	float heat = 0.55 * (1.0 - uv.y);
	vec3 color = mix(uBase, uWax, glow * 0.18);
	color = mix(color, mix(uWax, uHot, clamp(heat, 0.0, 0.8)), wax);
	gl_FragColor = vec4(color, 1.0);
}
`

type Rgb = [number, number, number]

/** Converts `#rrggbb` to 0–1 channels. */
function hexToRgb(hex: string): Rgb {
	const value = Number.parseInt(hex.slice(1), 16)

	return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type)

	if (!shader) return null
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	return shader
}

const colors = { base: '#56622a', hot: '#f2b54a', wax: '#b8461b' }

/**
 * A slow lava-lamp background drawn with WebGL. It renders at half resolution,
 * because the wax is soft, and it pauses when it scrolls out of view.
 * Without WebGL, the canvas stays empty and the parent background shows.
 */
function startLavaLamp(canvas: HTMLCanvasElement) {
	const gl = canvas.getContext('webgl', { antialias: false })

	if (!gl) return

	const program = gl.createProgram()
	const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader)
	const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)

	if (!program || !vertex || !fragment) return
	gl.attachShader(program, vertex)
	gl.attachShader(program, fragment)
	gl.linkProgram(program)

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
	gl.useProgram(program)

	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([-1, -1, 3, -1, -1, 3]),
		gl.STATIC_DRAW,
	)
	const position = gl.getAttribLocation(program, 'position')
	gl.enableVertexAttribArray(position)
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

	gl.uniform3fv(gl.getUniformLocation(program, 'uBase'), hexToRgb(colors.base))
	gl.uniform3fv(gl.getUniformLocation(program, 'uWax'), hexToRgb(colors.wax))
	gl.uniform3fv(gl.getUniformLocation(program, 'uHot'), hexToRgb(colors.hot))
	const resolution = gl.getUniformLocation(program, 'uResolution')
	const time = gl.getUniformLocation(program, 'uTime')

	const reduceMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches

	// Reduced motion shows one still frame. This start time places blobs across the whole section.
	const stillTime = 40
	const frameInterval = 1000 / 30
	let frame = 0
	let lastDraw = 0
	let visible = false

	const draw = (now: number) => {
		gl.uniform1f(time, reduceMotion ? stillTime : stillTime + now / 1000)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	const loop = (now: number) => {
		// The wax moves slowly, so 30 fps looks the same and saves phone batteries.
		if (now - lastDraw >= frameInterval) {
			lastDraw = now
			draw(now)
		}

		frame = visible && !reduceMotion ? requestAnimationFrame(loop) : 0
	}

	const resize = new ResizeObserver(() => {
		const scale = Math.min(window.devicePixelRatio, 2) * 0.5
		canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale))
		canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale))
		gl.viewport(0, 0, canvas.width, canvas.height)
		gl.uniform2f(resolution, canvas.width, canvas.height)
		draw(performance.now())
	})

	const watch = new IntersectionObserver(([entry]) => {
		visible = entry?.isIntersecting ?? false

		if (visible && !frame) frame = requestAnimationFrame(loop)
	})

	resize.observe(canvas)
	watch.observe(canvas)
}

const canvas = document.querySelector('canvas.gv-lava')

if (canvas instanceof HTMLCanvasElement) startLavaLamp(canvas)
