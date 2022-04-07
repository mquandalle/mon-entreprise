import './smarttag.js'

// Ci-dessous les indicateurs personnalisés de site et de page
// https://developers.atinternet-solutions.com/javascript-fr/contenus-javascript-fr/indicateurs-de-site-et-de-page-javascript-fr/
export const INDICATOR = {
	SITE: {
		LANGAGE: 1,
		EMBARQUÉ: 2,
	},
	PAGE: {},
} as const

type PageHit = {
	name?: string
	chapter1?: string
	chapter2?: string
	chapter3?: string
}

type ClickHit = {
	click?: string
	click_chapter1?: string
	click_chapter2?: string
	click_chapter3?: string
}

export interface ATTracker {
	setProp(prop: 'env_language', value: 'fr' | 'en', persistant: true): void
	setProp(prop: 'simulateur_embarque', value: boolean, persistant: true): void
	setProp(
		prop: 'evenement_type',
		value: 'telechargement',
		persistant: false
	): void

	events: {
		send(type: 'page.display', data: PageHit): void
		send(
			type: 'demarche.document',
			data: { click: 'demande_formulaire_a1' }
		): void
		send(
			type:
				| 'click.action'
				| 'click.navigation'
				| 'click.download'
				| 'click.exit',
			data: ClickHit
		): void
	}

	privacy: {
		setVisitorMode(authority: 'cnil', type: 'exempt'): void
		setVisitorOptout(): void
		getVisitorMode(): { name: 'exempt' | 'optout' }
	}
}

type ATTrackerClass = { new (options: { site: number }): ATTracker }

declare global {
	const ATInternet: {
		Tracker: { Tag: ATTrackerClass }
	}
}

export function createTracker(siteId?: string, doNotTrack = false) {
	const site = siteId ? +siteId : 0
	if (Number.isNaN(site)) {
		throw new Error('expect string siteId to be of number form')
	}
	const BaseTracker: ATTrackerClass =
		siteId && !import.meta.env.SSR ? ATInternet?.Tracker.Tag : Log
	class Tag extends BaseTracker {
		constructor(options: { language: 'fr' | 'en' }) {
			super({ site })
			this.setProp('env_language', options.language, true)

			this.setProp(
				'simulateur_embarque',
				document.location.pathname.includes('/iframes/'),
				true
			)

			if (import.meta.env.MODE === 'production' && doNotTrack) {
				this.privacy.setVisitorOptout()
			} else {
				this.privacy.setVisitorMode('cnil', 'exempt')
			}
		}
	}

	return Tag
}

export class Log implements ATTracker {
	constructor(options?: Record<string, string | number>) {
		console.debug('ATTracker::new', options)
	}
	setProp(name: string, value: boolean | string, persistent: boolean): void {
		console.debug('ATTracker::setProp', { name, value, persistent })
	}

	events = {
		send(name: string, data: Record<string, unknown>): void {
			console.debug('ATTracker::events.send', name, data)
		},
	}
	privacy: ATTracker['privacy'] = {
		setVisitorMode(...args) {
			console.debug('ATTracker::privacy.setVisitorMode', ...args)
		},
		setVisitorOptout() {
			console.debug('ATTracker::setVisitorOptout')
		},
		getVisitorMode() {
			console.debug('ATTracker::privacy.getVisitorMode')

			return { name: 'exempt' }
		},
	}
	dispatch(): void {
		console.debug('ATTracker::dispatch')
	}
}
