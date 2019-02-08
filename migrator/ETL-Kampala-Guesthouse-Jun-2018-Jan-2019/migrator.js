/* globals migrationLogger, delimiterLogger */
// Requiring logger because it defines global variables
const json2csv = require('json2csv').Parser;
const fs = require('fs');
const { failedLogger } = require('./logger');
const helper = require('./helpers');
const constants = require('./constants');
const data = require('./data/kampalaGuesthouseData.json');
const mockData = require('./__tests__/__mocks__/mockData');

const failedMigrations = [];

async function getTravelaUserObject(andelaUser, bambooHRUser) {
  const userLocation = await helper.getAndelaCenters(bambooHRUser.location);
  if (bambooHRUser) {
    const travelaUser = {
      fullName: andelaUser.name,
      email: andelaUser.email,
      userId: andelaUser.id,
      passportName: andelaUser.name,
      department: bambooHRUser.department,
      occupation: bambooHRUser.occupation,
      location: userLocation,
      picture: andelaUser.picture,
      gender: andelaUser.gender || bambooHRUser.gender,
      supervisor_id: bambooHRUser.supervisorEId,
    };
    return travelaUser;
  }
}

function getTripObject(excelRow, requestId, andelaUser, bedId) {
  const trip = {
    requestId,
    origin: andelaUser.location,
    destination: 'Kampala, Uganda',
    bedId,
    departureDate: helper.generateGoodDate(excelRow.D),
    returnDate: helper.generateGoodDate(excelRow.E)
  };
  return trip;
}

function getApprovalObject(request) {
  const approval = {
    requestId: request.id,
    approverId: request.manager
  };
  return approval;
}

function createFailedMigration(row, reason) {
  failedLogger(reason);
  const failedMigrationObject = {
    name: row.B,
    gender: row.C,
    arrivalDate: row.D,
    departureDate: row.E,
    guestHouse: row.G,
    roomAssigned: row.H,
    reasonForFailure: reason,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  failedMigrations.push(failedMigrationObject);
  delimiterLogger();
}

async function doMigration(row, index) {
  migrationLogger(`Migrating details: #${index} of ${row.B}`);
  let reason;

  // Create failed Migration for Brice
  if (row.B === 'Brice Nkengsa' && row.E === '2018-11-04T21:00:00.000Z') {
    reason = `Since ${row.B} does not have a departure date, we assume that Mahad Walusimbi's arrival date is his departure date.`;
    createFailedMigration(row, reason);
  }

  // get user record from Andela API
  const andelaUser = await helper.getUserFromAndela(row.B, 'name');
  if (!andelaUser) {
    reason = `${row.B} not found in production`;
    createFailedMigration(row, reason);
    return;
  }
  const bedId = await helper.getBedId(row.G, row.H, 'Kampala, Uganda', constants.defaultUser);
  if (bedId === 'failed') {
    reason = `${row.B}'s room is not defined.`;
    createFailedMigration(row, reason);
    failedLogger(reason);
    return;
  }

  // get user record from bambooHR
  const bambooHRUser = await helper.getUserFromBambooHR(andelaUser.bamboo_hr_id);

  // get Travela User object
  let travelaUser = {};
  if (bambooHRUser && (await helper.getAndelaCenters(bambooHRUser.location))) {
    andelaUser.gender = row.C === 'M' || row.C === 'Male' ? 'Male' : 'Female';
    travelaUser = await getTravelaUserObject(andelaUser, bambooHRUser);
  } else {
    reason = bambooHRUser === null ? `${row.B} not found in Bamboo HR` : `${row.B} Location is not an Andelan Center`;
    createFailedMigration(row, reason);
    failedLogger(reason);
    return;
  }

  if (travelaUser) {
    migrationLogger(`Attempting to retrieve ${row.B}'s manager...`);
    // get manager record from andela production API with bamboo_hr_id
    const andelaUserManager = await helper.getUserFromAndela(
      travelaUser.supervisor_id,
      'bamboo_hr_id'
    );

    let bambooHRUserManager = {};
    let travelaUserManager = {};
    let savedManager = {};
    let savedRequester = {};
    // if user is Jeremy, then he is a manager to himself... i.e, he has no manager. This means that we should not create a manager for him
    if (travelaUser.fullName === 'Jeremy Johnson') {
      savedRequester = await helper.createUser(
        travelaUser,
        { name: 'Jeremy Johnson' },
        'Requester'
      );
    } else {
      if (andelaUserManager) {
        // get manager record from bambooHR
        bambooHRUserManager = await helper.getUserFromBambooHR(andelaUserManager.bamboo_hr_id);
        andelaUserManager.gender = null;
        travelaUserManager = bambooHRUserManager
          && (await getTravelaUserObject(andelaUserManager, bambooHRUserManager));
        // create travela manager in the database
        savedManager = andelaUserManager && (await helper.createUser(travelaUserManager, bambooHRUserManager.manager, 'Manager'));
        migrationLogger(`Successfully created/updated ${row.B}'s manager.`);
      } else {
        failedLogger('Manager not found in production');
      }
      // create travela requester in the database
      savedRequester = await helper.createUser(travelaUser, andelaUserManager, 'Requester');
    }

    if (!savedManager || !savedRequester) {
      reason = `An error occured while saving ${row.B}`;
      createFailedMigration(row, reason);
      failedLogger(reason);
      return;
    }
    migrationLogger('User successfully created: ', row.B);
    // create user request
    let trip = getTripObject(row, 'userRequest.id', travelaUser, bedId);
    let userRequest;
    if (savedRequester.manager !== 'undefined' && savedRequester.manager !== null) {
      const tripType = !row.E ? 'oneWay' : 'return';
      userRequest = await helper.createUserRequest(savedRequester, tripType, row, trip);
    } else {
      createFailedMigration(row, 'Manager not found in production');
    }
    if (!userRequest) {
      reason = 'An error occurred while saving the request';
      createFailedMigration(row, reason);
      failedLogger(reason);
      return null;
    }
    trip = getTripObject(row, userRequest.id, travelaUser, bedId);
    await helper.createRequestTrips(trip, row);

    // create request approver
    const requestApproval = getApprovalObject(userRequest);
    await helper.createApprovals(requestApproval);
    delimiterLogger();
  }
}

// istanbul ignore next
async function beginMigration() {
  // Start Migrating Data
  migrationLogger('Migration Started...');
  await helper.createDefaultSuperUser(constants.defaultUser);
  /* eslint-disable */
  if(process.env.NODE_ENV === 'test') {
    for (const [index, row] of mockData.entries()) {
      await doMigration(row, index + 1);
    }
  } else {
    for (const [index, row] of data.entries()) {
      await doMigration(row, index + 1);
      delimiterLogger();
    }
  }
  const fields = [
    'name',
    'gender',
    'arrivalDate',
    'departureDate',
    'guestHouse',
    'roomAssigned',
    'reasonForFailure',
    'createdAt',
    'updatedAt'
  ];
  const failedMigrationJSON = JSON.stringify(failedMigrations, null, 2);

  // Create a json file for failed migrations
  fs.writeFile(
    './migrator/ETL-Kampala-Guesthouse-Jun-2018-Jan-2019/failedMigrations.json',
    failedMigrationJSON,
    (err) => {
      if (err) console.log(err);
      console.log('Saved Failed Migration as a JSON file!');
    }
  );

  // Create a csv file for failed migrations
  const parser = new json2csv({ fields });
  const csv = parser.parse(failedMigrations);

  fs.writeFile('./migrator/ETL-Kampala-Guesthouse-Jun-2018-Jan-2019/failedMigrations.csv', csv, err => {
    if (err) console.log(err);
    console.log('Saved Failed Migration as a CSV file!');
  });

  console.log('Migration Completed');
}

/*istanbul ignore next*/
module.exports = {
  getTripObject,
  getTravelaUserObject,
  getApprovalObject,
  doMigration,
  beginMigration
};
