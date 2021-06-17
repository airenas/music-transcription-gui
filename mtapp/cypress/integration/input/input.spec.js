import 'cypress-file-upload';
/// <reference types="Cypress" />

context('FileInputs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/')
  })

  it('when no file', () => {
    cy.get('#dropInfo').should('be.visible');
    cy.get('#transcribeButton').should('be.disabled');
    cy.get('#audio').should('not.be.visible');
  })

  it('when added file', () => {
    cy.get('#fileInput').attachFile('audio.wav');
    cy.get('#audio').should('be.visible');
    cy.get('#dropInfo').should('not.be.visible');
    cy.get('#transcribeButton').should('not.be.disabled');
  })
})
