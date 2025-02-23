import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { TrackPage } from '@/components/ATInternetTracking'
import { CompanyDetails } from '@/components/company/Details'
import PageHeader from '@/components/PageHeader'
import { SimulateurCard } from '@/components/SimulateurCard'
import { useEngine } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { ClockIcon } from '@/design-system/icons'
import { Container, Grid, Spacing } from '@/design-system/layout'
import PopoverConfirm from '@/design-system/popover/PopoverConfirm'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Body, Intro, SmallBody } from '@/design-system/typography/paragraphs'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'
import { resetCompany } from '@/store/actions/companyActions'

import { useNextStep } from './_components/useSteps'
import créerSvg from './_illustrations/créer.svg'

export default function AccueilChoixStatut() {
	const simulateurData = useSimulatorsData()
	const nextStep = useNextStep()
	const choixStatutPath =
		useSitePaths().absoluteSitePaths.assistants['choix-du-statut']
	const existingCompany = useEngine().evaluate('entreprise . SIREN').nodeValue!
	const dispatch = useDispatch()
	const { t } = useTranslation()

	return (
		<>
			<TrackPage name="accueil" />

			<PageHeader picture={créerSvg}>
				<Intro>
					<Trans i18nKey="choix-statut.home.intro">
						La première étape pour créer votre entreprise consiste à{' '}
						<Strong>choisir un statut juridique adapté à votre activité</Strong>
						. Les démarches administratives changent en fonction de ce dernier.
					</Trans>
				</Intro>
				{!existingCompany ? (
					<>
						<Spacing md />

						<Grid container spacing={3} style={{ alignItems: 'center' }}>
							<Grid item xs={12} sm={'auto'}>
								<Button size="XL" to={choixStatutPath[nextStep]}>
									<Trans i18nKey="choix-statut.home.find-statut">
										Trouver le bon statut
									</Trans>
								</Button>
							</Grid>

							<Grid item>
								<SmallBody
									grey
									css={`
										display: flex;
										gap: 0.5rem;
									`}
								>
									<ClockIcon />
									<Trans i18nKey="choix-statut.home.estimated-duration">
										Durée estimée : 10 minutes.
									</Trans>
								</SmallBody>
							</Grid>
						</Grid>
					</>
				) : (
					<>
						<Message type="info" border={false}>
							<Trans i18nKey="choix-statut.home.warning-entreprise-existante">
								<H3>Une entreprise a déjà renseignée</H3>
								<Body>
									Pour accéder à l'assistant, il vous faut réinitialiser les
									données
								</Body>
							</Trans>
						</Message>
						<CompanyDetails headingTag="h3" />
						<PopoverConfirm
							trigger={(buttonProps) => (
								<Button
									light
									aria-label={t('Réinitialiser la situation enregistrée')}
									{...buttonProps}
								>
									{t('Réinitialiser')}
								</Button>
							)}
							onConfirm={() => dispatch(resetCompany())}
							small
							title={t(
								'Êtes-vous sûr de vouloir réinitialiser la situation enregistrée ?'
							)}
						/>
					</>
				)}
			</PageHeader>
			<Spacing xxl />
			<div
				css={`
					flex: 1;
				`}
			></div>
			<Container
				backgroundColor={(theme) =>
					theme.darkMode
						? theme.colors.bases.primary[800]
						: theme.colors.bases.primary[100]
				}
			>
				<H3 as="h2">
					<Trans i18nKey="common.useful-resources">Ressources utiles</Trans>
				</H3>

				<Grid container spacing={3} role="list">
					<SimulateurCard
						small
						role="listitem"
						{...simulateurData['coût-création-entreprise']}
					/>
					<SimulateurCard
						small
						role="listitem"
						{...simulateurData['comparaison-statuts']}
					/>
				</Grid>
				<Spacing xl />
			</Container>
		</>
	)
}
