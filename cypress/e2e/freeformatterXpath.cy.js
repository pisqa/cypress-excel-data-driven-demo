import { testSuite } from '../fixtures/testSuite.json'

const ffxpUrl = 'https://www.freeformatter.com/xpath-tester.html'

describe('freeformatter xpath data-driven tests', () => {

  beforeEach(() => {

    cy.fixture('testXpath.xml').as('testXpathXml');

    //use session to preserve cookies, only have to interact with the popup for first test
    cy.session('cookieSession', () => {
      cy.visit(ffxpUrl);

      //wait for cookies popup
      cy.get('button').contains('Manage Options', { timeout: 10000 }).should('be.visible').click();
      cy.get('button').contains('Confirm Choices').click();

    })
    //need to revisit because cy.session clears the page finally
    cy.visit(ffxpUrl);
    cy.get('.page-title-box').invoke('text').should('contain', 'XPath Tester - Evaluator');

    //delay between each request to avoid bot detection
    cy.wait(10000)


  })

  testSuite.forEach((tc, k) => {

    it(`test case ${k + 1}: ${tc.title}`, function () {

      const testXml = this.testXpathXml;

      //check xml load option
      if (tc.copyPaste) {
        //paste the test xml in the xml text area
        cy.get('textarea[name=xmlString]').invoke('val', testXml)
      } else {
        //upload file
        cy.get('input[type=file][name=xmlFile').selectFile('@testXpathXml')
      }

      //check the Include 'XML Item Type' in output option
      if (tc.includeXmlItemType) {
        cy.get('#includeItemType').check();
      } else {
        cy.get('#includeItemType').uncheck();
      }


      //enter the test XPath in the XPath expression text box
      cy.get('input[id=xpathExpression]').type(tc.xPath)
      cy.get('#formatBtn').click();

      //wait for result
      cy.get('h2').contains('XPath Result', { timeout: 10000 }).should('be.visible');
      cy.get('code.language-xml').eq(0).invoke('text').then((result) => {
        cy.log('===================================================ACTUAL:')
        cy.log(result)
        cy.log('===================================================EXPECTED:')
        cy.log(tc.expectedResult)


        var actual, expected;

        //strip any linebreaks before verification
        actual = result.replace(/\n|\r/g, "");
        expected = tc.expectedResult.toString().replace(/\n|\r/g, "");


        cy.log('===================================================ACTUAL2:')
        cy.log(actual)
        cy.log('===================================================EXPECTED2:')
        cy.log(expected)
        expect(actual).to.eq(expected);
      })
    })
  })
})