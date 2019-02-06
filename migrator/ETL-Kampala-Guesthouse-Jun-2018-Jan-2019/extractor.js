const fs = require('fs');
const path = require('path');
const excelToJson = require('convert-excel-to-json');
const moment = require('moment');
const { extractLogger } = require('./logger');

extractLogger('Starting extractions...');

const handleTimeLoss = (data) => {
  const extractedData = data.CUMMULATIVE;
  extractedData.map((entry) => {
    extractLogger('Modifying date for time zones');
    const modifiedArrivalDate = new Date(entry.D).getTime() + 86400000;
    const modifiedDepartureDate = new Date(entry.E).getTime() + 86400000;
    entry.D = new Date(modifiedArrivalDate);
    entry.E = new Date(modifiedDepartureDate);
    extractLogger('Successfully modified date');
  });
};

const extractGuesthouseData = async () => {
  const data = excelToJson({
    sourceFile: path.resolve(__dirname, './data/Kampala guest house.xlsx'),
    header: { rows: 1 },
  });

  handleTimeLoss(data);

  await fs.writeFile(
    path.resolve(__dirname, './data/kampalaGuesthouseData.json'),
    JSON.stringify(data.CUMMULATIVE, null, 2), (err) => {
      if (err) throw err;
      extractLogger('Successfully extracted this excel file to json');
    }
  );
};

extractGuesthouseData();
