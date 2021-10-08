describe('Registration page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Checking the registration of user', () => {

    let randomNumber = Math.floor(100000 + Math.random() * 900000);
    let email = "a" + randomNumber + "@mail.ru";
    let password = randomNumber;

    cy.get('input[id="form-login"]').type(email);
    cy.get('input[id="form-password"]').type(password.toString());

    cy.get('[id="submit-button"]').click();

    cy.wait(1000);

    cy.get('div[class="trello-logo"]').should('exist');

  });

  it('Checking the registration of user and checks if a board can be added', () => {

    let randomNumber = Math.floor(100000 + Math.random() * 900000);
    let email = "a" + randomNumber + "@mail.ru";
    let password = randomNumber;
    let board = "Some board №" + randomNumber;

    cy.get('input[id="form-login"]').type(email);
    cy.get('input[id="form-password"]').type(password.toString());

    cy.get('[id="submit-button"]').click();

    cy.wait(1000);

    cy.get('[id="open-modal-button"]').click();

    cy.wait(1000);

    cy.get('input[id="board-add-form"]').type(board);

    cy.get('[id="submit-button"]').click();

    cy.wait(1000);

    cy.get('[id="close-modal-button"]').click();

    cy.wait(1000);

    cy.get('button[class="btn btn-warning user-board-item"]').contains(board).should('exist');

  });

});
