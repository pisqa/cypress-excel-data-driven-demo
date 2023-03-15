import { testSuite } from '../fixtures/cssTestSuite.json'

const jsoupUrl = 'https://try.jsoup.org/'
const testUrl = 'https://bonigarcia.dev/selenium-webdriver-java/web-form.html';

describe('jsoup css data-driven tests', () => {

    beforeEach(() => {

        cy.visit(jsoupUrl);
        cy.get('#htmlInputContainer > h4').invoke('text').should('equals', 'Input HTML');
        cy.get('#dialogFetchButton').click();
        cy.get('#myModalLabel').invoke('text').should('eq', 'Fetch HTML from URL');
        cy.get('input#fetchUrl').type(testUrl);
        cy.get('button#fetchButton').click();
    })

    testSuite.forEach((tc, k) => {

        it(`test case ${k + 1}: ${tc.title}`, function () {

            //intercept and wait for the api request, so we are sure we do not check the results of the query too soon
            //jsoup sends a rq for each character entered in the query, so intercept the url that corresponds to the css query
            //jsoup encodes space as + 
            var encodedCss = encodeURIComponent(tc.cssSelector).replace("%20", "+");
            var selectUrl = `https://try.jsoup.org/select?selector=${encodedCss}**`;
            cy.intercept('POST', selectUrl).as('postSelect');

            //enter css
            cy.get('input#selectInput').clear().type(tc.cssSelector);
            cy.wait('@postSelect').its('response.statusCode').should('equal', 200).wait(3000);

            //check # results
            cy.get('#selectOutput > div').should('have.length', tc.expectedResultCount)

            //check first result                      
            cy.get(':nth-child(1) > .span10 > :nth-child(1) > code').invoke('text')
                .then((res) => {
                    // remove any duplicated whitespace
                    var res2 = res.replace(/\s\s+/g, " ")
                    var exp2 = tc.expectedFirstResult.replace(/\s\s+/g, " ")
                    cy.then(() => {
                        expect(res2).to.equal(exp2)
                    })
                })

        })
    })
})