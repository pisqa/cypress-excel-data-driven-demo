# Excel Data Driven Testing in Cypress

This project demonstrates Excel Data Driven Testing in Cypress. Regression tests are implemented for two popular online tools for testing XPath and CSS queries:

- [www.freeformatter.com/xpath-tester.html](https://www.freeformatter.com/xpath-tester.html)  
  
![xpath-tester](/images/xpath-tester.JPG)

- [try.jsoup.org/](https://try.jsoup.org/)  
  
![jsoup](/images/jsoup.JPG)


## Test Plan
### Freeformatter Xpath Query Tester

The objective is to verify that the SUT returns the correct results for various XPath expressions. We cover both copy-paste of the XML and XML file upload, and also "Include 'XML Item Type' in output" switched on/off.  
The test XML is at [/cypress/fixtures/testXpath.xml](/cypress/fixtures/testXpath.xml).
Test cases are defined in [/cypress/fixtures/testSuite.xlsx](/cypress/fixtures/testSuite.xlsx).
15 test cases are defined, which is by no means comprehensive coverage, but sufficient for demo purposes.
  
![excel-xpath](/images/excel-xpath.JPG)

### Jsoup CSS Query Tester
The objective is to verify that the SUT returns the correct results for various CSS Selector queries. We cover only the Fetch Url option (https://bonigarcia.dev/selenium-webdriver-java/web-form.html).
Test cases are defined in [/cypress/fixtures/testSuite.xlsx](/cypress/fixtures/testSuite.xlsx).
15 test cases are defined, which is by no means comprehensive coverage, but sufficient for demo purposes.
  
![excel-css](/images/excel-css.JPG)

## Implementation Notes
Some interesting aspects of the implementation:  
### Dynamic Test Generation
We use [SheetJS](https://www.npmjs.com/package/xlsx) to convert the excel test suite to json. This is coded in a before:run event listener in  [/cypress.config.js](/cypress.config.js). Note [experimentalInteractiveRunEvents](https://docs.cypress.io/guides/references/experiments) is enabled to permit execution in interactive mode (still experimental as of v12.8).  
Dynamic tests are generated from the the JSON fixture file as described in [Dynamic Tests From Cypress Fixture](https://glebbahmutov.com/blog/dynamic-tests-from-fixture/). 
For example, in [/cypress/e2e/jsoupCss.cy.js](/cypress/e2e/jsoupCss.cy.js):  
```
import { testSuite } from '../fixtures/cssTestSuite.json'
:
:
testSuite.forEach((tc, k) => {

```

### Managing Cookies
We use [cy.session](https://docs.cypress.io/api/commands/session) in BeforeEach() of [/cypress/e2e/freeformatterXpath.cy.js](/cypress/e2e/freeformatterXpath.cy.js) to preserve cookies, so that we only have to interact with the cookie popup for first test.

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
The extra 3 second wait is due to occasional test failures even waiting for the API request (delay in rendering results?).

### I'm not a robot, honest! :innocent:
Xpath-tester has bot detection which denies access when too-frequent requests are detected, so there is a 10 second delay in the beforeEach();

## Execution
To install and run the project:
```
npm install
npx cypress run
```

### Test Results
The results should be displayed at end of the test run: 
   
![run finished](/images/run-finished.JPG)
