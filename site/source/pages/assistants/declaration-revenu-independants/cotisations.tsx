import Conversation from '@/components/conversation/Conversation'
import Value, { Condition, WhenAlreadyDefined } from '@/components/EngineValue'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import { FromTop } from '@/components/ui/animate'
import Progress from '@/components/ui/Progress'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import { Message } from '@/design-system'
import { Container, Grid, Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H2, H3 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useSimulationProgress } from '@/hooks/useNextQuestion'

import { SimpleField } from '../components/Fields'
import { DéclarationRevenu } from './components/DéclarationRevenu'

export default function Cotisations() {
	const { numberCurrentStep, numberSteps } = useSimulationProgress()
	const engine = useEngine()

	return (
		<FromTop>
			<Grid container spacing={4}>
				<Grid item lg={10} xl={8}>
					<div className="print-hidden">
						<Intro>
							En 2023, vous paierez des <Strong>cotisations sociales</Strong> à
							l'Urssaf. Pour avoir une première estimation de leur montant, il
							vous reste une dernière question à répondre :
						</Intro>
						<SimpleField dottedName="DRI . cotisations . appelées en 2022" />
					</div>
				</Grid>
			</Grid>
			<Spacing lg />
			<WhenAlreadyDefined dottedName="DRI . cotisations . appelées en 2022">
				<Container
					forceTheme="dark"
					backgroundColor={(theme) => theme.colors.bases.primary[600]}
				>
					<FromTop>
						<Grid container columnSpacing={4} rowSpacing={2}>
							<Grid item lg={10} xl={8}>
								<FromTop>
									<H2>Estimation des cotisations à payer</H2>

									<Message icon border={false}>
										<Intro>
											<Condition expression="DRI . cotisations >= 0">
												En 2023, vous devrez payer à l'Urssaf{' '}
												<Strong>
													{' '}
													<Value expression="DRI . cotisations" />
												</Strong>{' '}
												de cotisations sociales.
											</Condition>
											<Condition expression="DRI . cotisations < 0">
												En 2023, l'Urssaf vous remboursera{' '}
												<Strong>
													{' '}
													<Value expression="DRI . cotisations * -1" />
												</Strong>{' '}
											</Condition>
										</Intro>
									</Message>
									<div className="print-hidden">
										<Body>
											Cette estimation a été calculée sur la base des éléments
											renseignés sur les pages précédentes.
										</Body>
										<Body>
											Vous pouvez{' '}
											<Strong>
												améliorer la précision de cette estimation
											</Strong>{' '}
											en répondant aux questions suivantes qui concernent{' '}
											<Strong>l'année 2022</Strong> :
										</Body>
									</div>
									<Message border={false}>
										<div
											css={`
												position: relative;
												top: -1px;
												margin: 0 -1.5rem;
											`}
										>
											<Progress
												progress={numberCurrentStep}
												maxValue={numberSteps}
											/>
										</div>

										<div
											css={`
												margin: -0.75rem 0;
											`}
										>
											<Conversation
												customSituationVisualisation={
													<Grid container>
														<DéclarationRevenu />
													</Grid>
												}
											/>
										</div>
									</Message>
								</FromTop>
							</Grid>

							<Grid item md={6} sm={12}>
								<H3>
									{engine.getRule('DRI . cotisations . provisionnelles').title}
								</H3>
								<Intro>
									<Value
										expression="dirigeant . indépendant . cotisations et contributions"
										displayedUnit="€"
									/>
								</Intro>
								<Markdown>
									{engine.getRule('DRI . cotisations . provisionnelles').rawNode
										.description ?? ''}
								</Markdown>{' '}
							</Grid>
							<Grid item md={6} sm={12}>
								<H3>
									{engine.getRule('DRI . cotisations . régularisation').title}
								</H3>
								<Intro>
									<Value expression="DRI . cotisations . régularisation" />
								</Intro>
								<Markdown>
									{engine.getRule('DRI . cotisations . régularisation').rawNode
										.description ?? ''}
								</Markdown>{' '}
							</Grid>
						</Grid>
						<ShareOrSaveSimulationBanner share print />
						<Spacing xl />
					</FromTop>
				</Container>
			</WhenAlreadyDefined>
		</FromTop>
	)
}
