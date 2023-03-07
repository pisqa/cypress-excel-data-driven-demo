import { testSuite } from '../fixtures/cssTestSuite.json'

const jsoupUrl = 'https://try.jsoup.org/'
const testUrl = 'https://bonigarcia.dev/selenium-webdriver-java/web-form.html';

describe('jsoup css data-driven tests', () => {

    it(`test case `, function () {

        // SUT throws an exception for some reason
        // https://docs.cypress.io/api/events/catalog-of-events#Uncaught-Exceptions
        // cy.on('uncaught:exception', (err, runnable) => {
        //     expect(err.message).to.include('is not a function')
        //     done()
        //     // return false
        //   })

        cy.visit(jsoupUrl);
        cy.get('#dialogFetchButton').click();
        cy.get('#myModalLabel').invoke('text').should('eq', 'Fetch HTML from URL');
        cy.get('input#fetchUrl').type(testUrl);
        cy.get('button#fetchButton').click();

        //enter css
        cy.get('input#selectInput').clear().type('input');


        //check # results
        cy.get('#selectOutput > div').should('have.length', 14)

        //check first result
        var exp = '<input  type="text" class="form-control" name="my-text" id="my-text-id" myprop="myvalue">';
        cy.log('EXP:')
        cy.log(exp)
        cy.get('#selectOutput code').eq(1).invoke('text')
            .should('eq', exp);






    })

})