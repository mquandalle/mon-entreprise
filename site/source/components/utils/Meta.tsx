import { useTranslation } from 'react-i18next'

import DefaultHelmet from './DefaultHelmet'

type PropType = {
	page: string
	title: string
	description: string
	ogDescription?: string
	ogTitle?: string
	ogImage?: string
}

export default function Meta({
	page,
	title,
	description,
	ogDescription,
	ogTitle,
	ogImage,
}: PropType) {
	const { t } = useTranslation()

	// TODO: refacto des traductions en évitant qu'elles soit dynamique
	const meta = {
		title,
		description: t(`${page}.description`, description) || description,
		ogDescription: ogDescription
			? t(`${page}.ogDescription`, ogDescription) || ogDescription
			: description,
		ogTitle: ogTitle ? t(`${page}.ogTitle`, ogTitle) || ogTitle : title,
		ogImage: ogImage ? t(`${page}.ogImage`, ogImage) || ogImage : null,
	}

	return (
		<DefaultHelmet>
			<title>{meta.title}</title>
			<meta name="description" content={meta.description} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={meta.ogTitle ?? meta.title} />
			<meta
				property="og:description"
				content={meta.ogDescription ?? meta.description}
			/>
			{meta.ogImage && (
				<meta
					property="og:image"
					content={
						meta.ogImage.startsWith('http')
							? meta.ogImage
							: (typeof window !== 'undefined' ? window.location.host : '') +
							  meta.ogImage
					}
				/>
			)}
		</DefaultHelmet>
	)
}
