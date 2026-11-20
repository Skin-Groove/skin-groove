import { fmt, lint, mergeToolkitConfig } from '@aamini/config/vite-plus'
import { defineConfig } from 'vite-plus'

// Astro owns the dev server and build; Vite+ owns checks and tests.
export default defineConfig(
	mergeToolkitConfig(
		{
			fmt,
			lint: lint('astro'),
			// Tests import modules that use the `@/` path alias from tsconfig.json.
			resolve: { tsconfigPaths: true },
			test: { include: ['{src,scripts}/**/*.unit.test.ts'] },
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
