import {
	contactEmail,
	instagramHandle,
	instagramUrl,
} from '@/components/site/links'

import { html, type Html } from './html'

// Email clients ignore CSS variables and most stylesheets, so each block sets
// inline styles with these values. They come from `:root` in global.css. The
// emails use no black or near-black, so garnet takes the place of ink.
const colors = {
	sand: '#f6e3cd',
	cream: '#fbf1e1',
	paper: '#fff8ec',
	garnet: '#4f1420',
	muted: '#6b4234',
	apricot: '#f4b98e',
	burnt: '#b8461b',
	rust: '#9a3714',
	amber: '#f2b54a',
}

const display = "Caprasimo, Georgia, 'Times New Roman', serif"

const body = "Manrope, 'Helvetica Neue', Helvetica, Arial, sans-serif"

const site = 'https://skingroove.studio'

export interface EmailContext {
	/** The origin that serves `public/email`. Previews use the dev server. */
	origin: string
}

export interface Email {
	subject: string
	/** The summary that inboxes show after the subject. */
	preheader: string
	content: Html
	/** Why the client got the email. The footer shows it. */
	reason: string
}

const asset = (context: EmailContext, name: string) =>
	`${context.origin}/email/${name}`

// ===== Blocks =====

export const heading = (text: string) =>
	html` <h1
		class="sg-h1"
		style="margin:0 0 16px; font-family:${display}; font-size:36px; font-weight:400; line-height:1.1; color:${colors.garnet};"
	>
		${text}
	</h1>`

export const subheading = (text: string) =>
	html` <h2
		style="margin:32px 0 12px; font-family:${display}; font-size:24px; font-weight:400; line-height:1.2; color:${colors.rust};"
	>
		${text}
	</h2>`

export const paragraph = (content: Html | string) =>
	html` <p
		style="margin:0 0 16px; font-family:${body}; font-size:16px; line-height:1.65; color:${colors.muted};"
	>
		${content}
	</p>`

export const note = (content: Html | string) =>
	html` <p
		style="margin:0 0 16px; font-family:${body}; font-size:14px; line-height:1.6; color:${colors.muted};"
	>
		${content}
	</p>`

/** A pill link. The table cell keeps its color in clients that drop link padding. */
export const button = (label: string, href: string) =>
	html` <table
		role="presentation"
		cellpadding="0"
		cellspacing="0"
		border="0"
		style="margin:8px 0 24px;"
	>
		<tr>
			<td
				style="border-radius:999px; background:${colors.amber}; box-shadow:0 4px 0 ${colors.rust};"
			>
				<a
					href="${href}"
					style="display:inline-block; padding:15px 30px; border-radius:999px; font-family:${body}; font-size:16px; font-weight:700; line-height:1; color:${colors.garnet}; text-decoration:none;"
					>${label} &rarr;</a
				>
			</td>
		</tr>
	</table>`

export const details = (rows: [label: string, value: Html | string][]) =>
	html` <table
		role="presentation"
		width="100%"
		cellpadding="0"
		cellspacing="0"
		border="0"
		style="margin:8px 0 24px; border:2px solid ${colors.apricot}; border-radius:20px; background:${colors.paper};"
	>
		${rows.map(
			([label, value], index) =>
				html` <tr>
					<td
						style="padding:${index === 0 ? '18px' : '0'} 22px ${index === rows.length - 1 ? '18px' : '10px'};"
					>
						<p
							style="margin:0; font-family:${body}; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:${colors.burnt};"
						>
							${label}
						</p>
						<p
							style="margin:2px 0 0; font-family:${body}; font-size:16px; font-weight:600; line-height:1.4; color:${colors.garnet};"
						>
							${value}
						</p>
					</td>
				</tr>`,
		)}
	</table>`

export const list = (items: (Html | string)[]) =>
	html` <table
		role="presentation"
		cellpadding="0"
		cellspacing="0"
		border="0"
		style="margin:0 0 16px;"
	>
		${items.map(
			(item) =>
				html` <tr>
					<td
						valign="top"
						style="width:28px; padding:2px 0 10px; font-family:${display}; font-size:18px; line-height:1.4; color:${colors.burnt};"
					>
						&#10047;
					</td>
					<td
						style="padding:0 0 10px; font-family:${body}; font-size:16px; line-height:1.65; color:${colors.muted};"
					>
						${item}
					</td>
				</tr>`,
		)}
	</table>`

const image = (
	context: EmailContext,
	name: string,
	alt: string,
	width: number,
	height: number,
) =>
	html` <img
		src="${asset(context, name)}"
		alt="${alt}"
		width="${width}"
		height="${height}"
		style="display:block; margin:0 auto; border:0; max-width:100%; height:auto;"
	/>`

const signOff = (context: EmailContext) =>
	html` <table
		role="presentation"
		width="100%"
		cellpadding="0"
		cellspacing="0"
		border="0"
		style="margin-top:24px;"
	>
		<tr>
			<td align="center" style="padding-top:8px;">
				${image(context, 'rainbow.png', '', 100, 50)}
				<p
					style="margin:12px 0 0; font-family:${body}; font-size:15px; color:${colors.muted};"
				>
					xo,
				</p>
				<p
					style="margin:2px 0 0; font-family:${display}; font-size:30px; line-height:1.1; color:${colors.burnt};"
				>
					Sammy
				</p>
				<p
					style="margin:4px 0 0; font-family:${body}; font-size:13px; color:${colors.muted};"
				>
					Esthetician &amp; founder, Skin Groove
				</p>
			</td>
		</tr>
	</table>`

// ===== Document =====

const footerLink = (label: string, href: string) =>
	html` <a
		href="${href}"
		style="color:${colors.rust}; text-decoration:underline;"
		>${label}</a
	>`

/** Four palette stripes, as in the Swoosh mark. Table rows need no image. */
const stripes = html`<table
	role="presentation"
	width="100%"
	cellpadding="0"
	cellspacing="0"
	border="0"
>
	${[colors.apricot, colors.amber, colors.burnt, colors.garnet].map(
		(color) =>
			html`<tr>
					<td
						height="6"
						style="height:6px; font-size:0; line-height:0; background:${color};"
					>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td height="3" style="height:3px; font-size:0; line-height:0;">
						&nbsp;
					</td>
				</tr>`,
	)}
</table>`

export function render(email: Email, context: EmailContext) {
	const fonts = asset(context, 'fonts')

	const document = html`<!doctype html>
		<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="x-apple-disable-message-reformatting" />
				<meta name="color-scheme" content="light only" />
				<meta name="supported-color-schemes" content="light only" />
				<title>${email.subject}</title>
				<style>
					@font-face {
						font-family: Caprasimo;
						font-weight: 400;
						src: url(${fonts}/caprasimo.woff2) format('woff2');
					}
					@font-face {
						font-family: Manrope;
						font-weight: 200 800;
						src: url(${fonts}/manrope.woff2) format('woff2');
					}
					body {
						margin: 0;
						padding: 0;
						background: ${colors.sand};
					}
					a {
						color: ${colors.burnt};
					}
					@media (max-width: 620px) {
						.sg-page {
							padding: 12px 8px 24px !important;
						}
						.sg-body {
							padding: 8px 22px 8px !important;
						}
						.sg-h1 {
							font-size: 30px !important;
						}
					}
				</style>
			</head>
			<body style="margin:0; padding:0; background:${colors.sand};">
				<div
					style="display:none; max-height:0; overflow:hidden; opacity:0; color:${colors.sand};"
				>
					${email.preheader}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;
				</div>
				<table
					role="presentation"
					width="100%"
					cellpadding="0"
					cellspacing="0"
					border="0"
					style="background:${colors.sand};"
				>
					<tr>
						<td class="sg-page" align="center" style="padding:32px 16px 40px;">
							<table
								role="presentation"
								width="600"
								cellpadding="0"
								cellspacing="0"
								border="0"
								style="width:100%; max-width:600px; border-radius:28px; overflow:hidden; background:${colors.cream};"
							>
								<tr>
									<td align="center" style="padding:36px 24px 20px;">
										<a href="${site}"
											><img
												src="${asset(context, 'logo-swoosh.png')}"
												alt="Skin Groove"
												width="440"
												height="130"
												style="display:block; max-width:100%; height:auto; border:0; font-family:${display}; font-size:36px; color:${colors.garnet};"
										/></a>
									</td>
								</tr>
								<tr>
									<td class="sg-body" style="padding:12px 48px 8px;">
										${email.content} ${signOff(context)}
									</td>
								</tr>
								<tr>
									<td style="padding-top:28px;">${stripes}</td>
								</tr>
							</table>
							<table
								role="presentation"
								width="600"
								cellpadding="0"
								cellspacing="0"
								border="0"
								style="width:100%; max-width:600px;"
							>
								<tr>
									<td
										align="center"
										style="padding:28px 24px 0; font-family:${body}; font-size:13px; line-height:1.7; color:${colors.muted};"
									>
										<p
											style="margin:0 0 4px; font-family:${display}; font-size:22px; color:${colors.rust};"
										>
											Skin Groove
										</p>
										<p style="margin:0 0 12px;">Find your skincare rhythm.</p>
										<p style="margin:0 0 16px;">
											${footerLink('skingroove.studio', site)}
											&nbsp;&middot;&nbsp;
											${footerLink(`@${instagramHandle}`, instagramUrl)}
											&nbsp;&middot;&nbsp;
											${footerLink(contactEmail, `mailto:${contactEmail}`)}
										</p>
										<p style="margin:0;">${email.reason}</p>
										<p style="margin:4px 0 0;">
											${footerLink('Privacy policy', `${site}/privacy`)}
										</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>`

	return { subject: email.subject, html: document.toString() }
}
