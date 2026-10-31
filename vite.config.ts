import { fmt, lint, mergeToolkitConfig } from '@aamini/config/vite-plus'
import { defineConfig } from 'vite-plus'

// Astro owns the dev server and build; Vite+ owns checks and tests.
export default defineConfig(
	mergeToolkitConfig(
		{
			fmt,
			lint: lint('astro'),
			test: { include: ['src/**/*.unit.test.ts'] },
		},
		{
			staged: {
				'*.astro': 'prettier --write',
				'*': 'vp check --fix',
			},
			fmt: { ignorePatterns: (preset) => [...preset, '.astro/**'] },
			lint: { ignorePatterns: (preset) => [...preset, '.astro/**'] },
		},
	),
)
