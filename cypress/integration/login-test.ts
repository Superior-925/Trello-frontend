describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  let randomNumber = Math.floor(100000 + Math.random() * 900000);
  let email = "a" + randomNumber + "@mail.ru";
  let password = randomNumber;

  it('Checking the error output when sending incorrect mail or password to the server', () => {

    cy.get('input[id="form-login"]').type(email);
    cy.get('input[id="form-password"]').type(password.toString());

    cy.get('[id="submit-button"]').click();

    cy.wait(3000);

    cy.get('div[class="submit-data-error"]').should('exist');

  });

});
