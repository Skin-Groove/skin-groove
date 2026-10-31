import shadcn from '@shadcn/lint'
import tsParser from '@typescript-eslint/parser'
import * as astroParser from 'astro-eslint-parser'
import { defineConfig } from 'eslint/config'

// Oxlint reads only the frontmatter of .astro files. ESLint parses the template
// markup, so the @shadcn/lint class rules also check Astro markup.
export default defineConfig({
	files: ['src/**/*.astro'],
	languageOptions: {
		parser: astroParser,
		parserOptions: { parser: tsParser, extraFileExtensions: ['.astro'] },
	},
	plugins: { shadcn },
	rules: {
		'no-restricted-syntax': [
			'error',
			{
				selector:
					'AstroTemplateLiteralAttribute[name.name="class"], JSXAttribute[name.name="class"] TemplateLiteral',
				message:
					'Do not build class with template literals. Use cn() from "@/lib/utils/ui" instead.',
			},
		],
		'shadcn/no-raw-colors': 'error',
		// The site styles itself with hand-written CSS outside the Tailwind theme.
		'shadcn/no-unknown-classes': [
			'error',
			{
				allow: [
					'about-*',
					'gv',
					'gv-*',
					'hero',
					'hero-*',
					'home-*',
					'is-*',
					'lg-*',
				],
			},
		],
		'shadcn/no-arbitrary-values': ['error', { allow: ['layout'] }],
	},
})
