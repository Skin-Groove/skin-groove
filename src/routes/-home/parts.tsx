import { PlusIcon } from '@phosphor-icons/react'

import { cn } from '@/lib/utils/ui'

import { galleryRows, questions } from './content'

export function FaqList() {
	return (
		<div className="gv-faq">
			{questions.map((item) => (
				<details key={item.question}>
					<summary>
						{item.question}
						<PlusIcon aria-hidden="true" />
					</summary>
					<p>{item.answer}</p>
				</details>
			))}
		</div>
	)
}

export function GalleryRows() {
	return (
		<div className="gv-rows" aria-hidden="true">
			{galleryRows.map((row, rowIndex) => (
				<div
					className={cn('gv-row', rowIndex % 2 === 1 && 'is-reverse')}
					key={rowIndex}
				>
					{[...row, ...row].map((image, index) => (
						<img
							alt=""
							height="360"
							key={index}
							loading="lazy"
							src={`/images/groove/${image}.webp`}
							width="270"
						/>
					))}
				</div>
			))}
		</div>
	)
}
