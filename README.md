# cypress-data-driven-demo

This project demonstrates implementation of Data Driven Testing in Cypress.  
Regression tests are implemented for 2 SUTs:

- [www.freeformatter.com/xpath-tester.html](https://www.freeformatter.com/xpath-tester.html)  
Test Xpath selectors
- [try.jsoup.org/](https://try.jsoup.org/)  
Test CSS selectors



## Test Plan
### Xpath Selectors

The objective is to verify that the SUT returns the correct results for various XPath expressions. We cover both copy-paste of the XML and XML file upload, and also "Include 'XML Item Type' in output" switched on/off.  
The test XML is at [/cypress/fixtures/testXpath.xml](/cypress/fixtures/testXpath.xml)  
Test cases are defined in /cypress/fixtures/testSuite.xlsx.
15 test cases are defined, which is by no means comprehensive coverage, but sufficient for demo purposes.

![My Image](/images/excel-xpath.JPG)


## Implementation Notes


We use [SheetJS](https://www.npmjs.com/package/xlsx) to convert the excel test suite to json. We code this in a before:run event listener in  [/cypress.config.js](/cypress.config.js). Note we enable [experimentalInteractiveRunEvents](https://docs.cypress.io/guides/references/experiments) to permit execution in interactive mode (still experimental as of v12.8).  
Dynamic tests are generated from the the JSON fixture file as described in [Dynamic Tests From Cypress Fixture](https://glebbahmutov.com/blog/dynamic-tests-from-fixture/). 
For example, in [/cypress/e2e/jsoupCss.cy.js](/cypress/e2e/jsoupCss.cy.js):  
```
import { testSuite } from '../fixtures/cssTestSuite.json'
:
:
testSuite.forEach((tc, k) => {

```


npm install

npx cypress run
