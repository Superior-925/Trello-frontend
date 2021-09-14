let randomNumber = Math.floor(100000 + Math.random() * 900000);
let email = "a" + randomNumber + "@mail.ru";
let password = randomNumber;
let board = "Some board №" + randomNumber;
let text = "Testing text " + randomNumber;

describe('Registration page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Checking the registration of user', () => {

    cy.get('input[id="form-login"]').type(email);
    cy.get('input[id="form-password"]').type(password.toString());

    cy.get('[id="submit-button"]').click();

    cy.wait(1000);

    cy.get('div[class="log-out-button-block"]').should('exist');

  });

});

describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Checking the login of user and checks if a board and task can be added', () => {

    cy.get('input[id="form-login"]').type(email);
    cy.get('input[id="form-password"]').type(password.toString());

    cy.get('[id="submit-button"]').click();

    cy.wait(1000);

    cy.get('div[class="log-out-button-block"]').should('exist');

    cy.get('input[id="board-add-form"]').type(board);

    cy.wait(1000);

    cy.get('[id="submit-button"]').click();

    cy.wait(1000);

    cy.get('input[name="board-name"]').should('have.value', board);

    cy.get('[id="add-task-button-testing-list"]').click();

    cy.get('input[id="input-form-testing-list"]').type(text);

    cy.get('[id="add-task-form-button-testing-list"]').click();

    cy.wait(1000);

    cy.get('div[class="testing-list-task-title"]').should('exist');

  });

});

