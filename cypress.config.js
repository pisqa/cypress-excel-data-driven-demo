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
        var sheet = workbook.Sheets[workbook.SheetNames[0]]
        var sheetAsJson = { testSuite: xlsx.utils.sheet_to_json(sheet) }
        console.log('sheetAsJson: ' + JSON.stringify(sheetAsJson))

        fs.writeFile('cypress/fixtures/testSuite.json', JSON.stringify(sheetAsJson), function (err) {
          if (err) throw err;
          console.log('Saved!');
        });

      })
    }
  }
});
