const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    experimentalInteractiveRunEvents: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:run', (details) => {

        var fs = require('fs');
        var xlsx = require('xlsx');
        var workbook = xlsx.readFile('cypress/fixtures/testSuite.xlsx');

        //load the xPath tests
        var sheet = workbook.Sheets['xPath-tests']
        var sheetAsJson = xlsx.utils.sheet_to_json(sheet)
        var wrapper = {testSuite: sheetAsJson}

        fs.writeFile('cypress/fixtures/xPathTestSuite.json', JSON.stringify(wrapper), function (err) {
          if (err) throw err;
          console.log('Saved!');
        });

        //load the css tests
        // sheet = workbook.Sheets[workbook.SheetNames['css-tests']]
        // sheetAsJson = { testSuite: xlsx.utils.sheet_to_json(sheet) }

        // fs.writeFile('cypress/fixtures/cssTestSuite.json', JSON.stringify(sheetAsJson), function (err) {
        //   if (err) throw err;
        //   console.log('Saved!');
        // });

      })
    }
  }
});
