import { checkA11Y } from '../../support/utils'

const searchInputPath = '[data-test-id=company-search-input]'
const searchResultsPath = '[data-test-id=company-search-results]'
const currentCompanyPath = '[data-test-id=currently-selected-company]'

const FIXTURES_FOLDER = 'cypress/fixtures/landing'

describe('Landing page', function () {
	it('should not crash', function () {
		cy.visit('/')
	})

	it('should display logo', function () {
		cy.visit('/')
		cy.get('[data-test-id="logo img"]').should('be.visible')
	})

	// TODO : SKIPING WHILE SEARCH IS DOWN BECAUSE FIXTURES WERE NOT SAVED
	it('should provide the company search flow', function () {
		let pendingRequests = new Set()
		let responses = {}
		const hostnamesToRecord = [
			'api.recherche-entreprises.fabrique.social.gouv.fr',
			'geo.api.gouv.fr',
		]
		cy.clearLocalStorage() // Try to avoid flaky tests

		pendingRequests = new Set()
		responses = {}
		cy.setInterceptResponses(
			pendingRequests,
			responses,
			hostnamesToRecord,
			FIXTURES_FOLDER
		)

		cy.visit('/')

		cy.get(currentCompanyPath).should('not.exist')

		cy.get(searchInputPath).should('have.attr', 'placeholder')
		cy.get(searchInputPath).invoke('attr', 'type').should('equal', 'search')
		cy.get(searchInputPath).first().type('noima')

		cy.intercept(
			{
				method: 'GET',
				hostname: 'api.recherche-entreprises.fabrique.social.gouv.fr',
				url: '/api/v1/search?*',
			},
			(req) => {
				req.responseTimeout = 10 * 1000
				req.continue()
			}
		).as('search')

		cy.wait('@search')

		cy.get(searchResultsPath).children().should('have.length', 6)
		cy.get(searchResultsPath).children().first().click()

		cy.url().should('include', '/pour-mon-entreprise')

		cy.go('back')

		cy.get(currentCompanyPath).should('exist')
		cy.get('[data-test-id="cta-see-custom-simulators"]').click()

		cy.url().should('include', '/pour-mon-entreprise')

		cy.writeInterceptResponses(pendingRequests, responses, FIXTURES_FOLDER)
	})

	it('should be RGAA compliant', function () {
		cy.visit('/')
		checkA11Y()
	})
})
