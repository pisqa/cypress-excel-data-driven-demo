# cypress-data-driven-demo

This project demonstrates implementation of Data Driven Testing in Cypress.  
Regression tests are implemented for 2 SUTs:

- [www.freeformatter.com/xpath-tester.html](https://www.freeformatter.com/xpath-tester.html)  
![xpath-tester](/images/xpath-tester.JPG)
Test Xpath selectors
- [try.jsoup.org/](https://try.jsoup.org/)  
![jsoup](/images/jsoup.JPG)

Test CSS selectors



## Test Plan
### Xpath Selectors

The objective is to verify that the SUT returns the correct results for various XPath expressions. We cover both copy-paste of the XML and XML file upload, and also "Include 'XML Item Type' in output" switched on/off.  
The test XML is at [/cypress/fixtures/testXpath.xml](/cypress/fixtures/testXpath.xml)  
Test cases are defined in /cypress/fixtures/testSuite.xlsx.
15 test cases are defined, which is by no means comprehensive coverage, but sufficient for demo purposes.

![My Image](/images/excel-xpath.JPG)


## Implementation Notes
Some interesting aspects of the implementation:  
### Dynamic Test Generation
We use [SheetJS](https://www.npmjs.com/package/xlsx) to convert the excel test suite to json. We code this in a before:run event listener in  [/cypress.config.js](/cypress.config.js). Note we enable [experimentalInteractiveRunEvents](https://docs.cypress.io/guides/references/experiments) to permit execution in interactive mode (still experimental as of v12.8).  
Dynamic tests are generated from the the JSON fixture file as described in [Dynamic Tests From Cypress Fixture](https://glebbahmutov.com/blog/dynamic-tests-from-fixture/). 
For example, in [/cypress/e2e/jsoupCss.cy.js](/cypress/e2e/jsoupCss.cy.js):  
```
import { testSuite } from '../fixtures/cssTestSuite.json'
:
:
testSuite.forEach((tc, k) => {

```

### Managing Cookies
We use [cy.session](https://docs.cypress.io/api/commands/session) in BeforeEach() of [/cypress/e2e/freeformatterXpath.cy.js](/cypress/e2e/freeformatterXpath.cy.js) to preserve cookies, so that we only have to interact with the popup for first test.

### Waiting For Evaluation Results
- For the [/cypress/e2e/freeformatterXpath.cy.js](/cypress/e2e/freeformatterXpath.cy.js) tests its straightforward - the 'XPath Result' header is not visible until the expression is evaluated, so we just wait for that:
```
cy.get('h2').contains('XPath Result', { timeout: 10000 }).should('be.visible')
```

- For the [/cypress/e2e/jsoupCss.cy.js](/cypress/e2e/jsoupCss.cy.js) tests its a bit more tricky. We use [cy.intercept](https://docs.cypress.io/api/commands/intercept) to wait for the corresponding API call. However, the application issues a separate request as each character of the selector expression is typed in the Query text box. So we construct the url to wait for based on the current css selector:
```
var encodedCss = encodeURIComponent(tc.cssSelector).replace("%20", "+");
var selectUrl = `https://try.jsoup.org/select?selector=${encodedCss}**`;
cy.intercept('POST', selectUrl).as('postSelect');

//enter css
cy.get('input#selectInput').clear().type(tc.cssSelector);
cy.wait('@postSelect').its('response.statusCode').should('equal', 200).wait(3000);
```
Wait an extra 3 seconds because I was seeing occasional test fails only wait for the API request.

npm install

npx cypress run
