describe('Pole emploi test', function() {
	it('should display an iframe of the simulateur', function() {
		cy.on('uncaught:exception', err => {
			return !err.message.contains('Unexpected token <')
		})
		cy.visit('https://entreprise.pole-emploi.fr/cout-salarie/')
		cy.reload(true)
		cy.get('#simulateurEmbauche')
			.iframe()
			.contains('Touché par le salarié')
	})
})
