
const shortid = require('shortid');
const axios = require('axios');
const moment = require('moment');
const { dbLogger, axiosLogger } = require('./logger');
const db = require('./dbConnection');
const constants = require('./constants');

function generateUniqueId() {
  return shortid.generate();
}

const generateGoodDate = (rawDate) => {
  const goodDate = moment(rawDate).format('lll');
  return moment(goodDate).format('YYYY-MM-DD, HH:MM:SS');
};

async function clearFailedMigration() {
  try {
    const sql = 'TRUNCATE TABLE "FailedMigrations";';
    await db.query(sql);
  } catch (error) {
    console.log('error at clearFailedMigration:', error);
    return null;
  }
}

function createFailedMigration(row, reason) {
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
  return failedMigrationObject;
}

async function createUserRole(userId, roleId) {
  try {
    dbLogger('Attempting to retrieve user\'s role...');
    let userRole = await db
      .query(`SELECT * FROM "UserRoles" where "userId"='${userId}' AND "roleId"='${roleId}';`);
    if (userRole.rowCount > 0) {
      dbLogger('Found user\'s role in the database.');
      return userRole.rows[0];
    }
    dbLogger('Could not find user\'s role in the database.');
    const sql = 'INSERT INTO "UserRoles" ("userId", "roleId", "createdAt", "updatedAt")'
    + ' VALUES ($1, $2, $3, $4) RETURNING *';
    dbLogger('Attempting to create user\'s role...');
    userRole = await db.query(sql, [userId, roleId, new Date(), new Date()]);
    dbLogger('Successfully created user\'s role...');
    return userRole.rows[0];
  } catch (error) {
    dbLogger(`Could not create user's role because of ${error.toString()}`);
    return null;
  }
}

async function createDefaultSuperUser(user) {
  try {
    dbLogger('Attempting to retrieve super user from the database...');
    let defaultUser = await db.query(`SELECT * FROM "Users" where "email"='${user.email}';`);
    if (defaultUser.rowCount > 0) {
      dbLogger('Found super user in the database.');
      await createUserRole(defaultUser.rows[0].id, 10948);
      return defaultUser.rows[0];
    }

    dbLogger('Creating super user in the database...');
    const sql = 'INSERT INTO "Users" ("fullName", "email", "userId", "passportName", "department", "occupation",'
    + '"manager", "gender", "location", "picture", "createdAt", "updatedAt")'
    + ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;';
    defaultUser = await db.query(sql, [
      user.fullName, user.email, user.userId, user.passportName, user.department, user.occupation,
      user.manager, user.gender, user.location, user.picture, new Date(), new Date()
    ]);
    await createUserRole(defaultUser.rows[0].id, 10948);
    dbLogger('Successfully created super user...');
    return defaultUser.rows[0];
  } catch (error) {
    dbLogger(`Could not create super user because of ${error.toString()}`);
    return null;
  }
}

async function createBed(roomId, bedName) {
  try {
    const existingBed = await db.query(`SELECT * FROM "Beds" WHERE "roomId" ILIKE '${roomId}'`);
    if (existingBed.rows.length) {
      return existingBed;
    }
    const sql = 'INSERT INTO "Beds" ("bedName", "roomId", "createdAt", "updatedAt")'
    + ' VALUES ($1, $2, $3, $4) RETURNING *;';
    const bed = await db.query(sql, [
      bedName, roomId, new Date(), new Date()
    ]);

    return bed;
  } catch (error) {
    console.log('error at createBed:', error);
    return null;
  }
}

async function createRoom(guestHouseId, roomName) {
  try {
    const selectSql = `SELECT * FROM "Rooms" WHERE "guestHouseId" = '${guestHouseId}' AND "roomName" = '${roomName}';`;
    let rooms = await db.query(selectSql);
    if (rooms.rowCount > 0) {
      const beds = await db.query(`SELECT * FROM "Beds" where "roomId" = '${rooms.rows[0].id}'`);
      const bed = await createBed(rooms.rows[0].id,
        `bed ${beds.rowCount + 1}`);
      return bed;
    }
    const sql = 'INSERT INTO "Rooms" ("id", "roomName", "roomType", "bedCount", "guestHouseId", "createdAt", "updatedAt")'
    + ' VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;';
    rooms = await db.query(sql, [
      generateUniqueId(), roomName, 'Ensuite', 1, guestHouseId, new Date(), new Date()
    ]);
    const bed = await createBed(rooms.rows[0].id,
      'bed 1');
    return bed;
  } catch (error) {
    console.log('error at createRoom:', error);
    return null;
  }
}

async function createAccommodation(accommodation, roomAssigned, location, superUser) {
  try {
    const selectSql = `SELECT * FROM "GuestHouses" WHERE "houseName" = '${accommodation}';`;
    let guestHouses = await db.query(selectSql);
    if (guestHouses.rowCount > 0) {
      const room = await createRoom(guestHouses.rows[0].id, roomAssigned);
      return room;
    }
    const sql = 'INSERT INTO "GuestHouses" ("id", "houseName", "location", "bathRooms",'
    + '"userId", "imageUrl", "createdAt", "updatedAt")'
    + ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;';
    guestHouses = await db.query(sql, [
      generateUniqueId(), accommodation, location, 2, superUser.userId, '', new Date(), new Date()
    ]);
    const room = await createRoom(guestHouses.rows[0].id, roomAssigned);
    return room;
  } catch (error) {
    console.log('error at createAccommodation:', error);
    return null;
  }
}

async function getBedId(accommodation, roomAssigned, location, superUser) {
  if (!accommodation || accommodation === '' || accommodation.toLowerCase() === 'hotel') {
    return null;
  }
  if (!roomAssigned) {
    return 'failed';
  }
  const room = roomAssigned;
  const bed = await createAccommodation(accommodation, room, location, superUser);

  return bed.rows[0].id;
}

async function getUserFromAndela(search, type) {
  try {
    if (!search) return null;
    axiosLogger(`Attempting to find ${type}=${search} from Andela...`);
    const response = await axios.get(`${constants.productionAPI}/users?${type}=${search}`, {
      headers: {
        Authorization: `Bearer ${constants.jwtToken}`
      }
    });
    if (response.data.values.length) {
      const andelaUser = response.data.values.filter(value => value.bamboo_hr_id !== 0);
      axiosLogger(`Successfully retrieved ${type}=${search} from Andela.`);
      return andelaUser[0];
    }
  } catch (error) {
    axiosLogger(`Could not find ${type}=${search} from Andela`, error);
    return null;
  }
}

async function getUserFromBambooHR(bambooHRId) {
  try {
    if (!bambooHRId) return null;
    const url = constants.bambooHRAPI.replace('{bambooHRId}', bambooHRId);
    axiosLogger(`Attempting to find id=${bambooHRId} from BambooHR...`);
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json'
      }
    });
    axiosLogger(`Successfully retrieved id=${bambooHRId} from BambooHR.`);
    const {
      location, jobTitle, supervisor, department, firstName, lastName, supervisorEId
    } = response.data;
    return {
      firstName,
      lastName,
      department,
      occupation: jobTitle,
      gender: 'Male',
      manager: supervisor,
      location,
      supervisorEId
    };
  } catch (error) {
    axiosLogger(`User with BambooHR ID ${bambooHRId} not found.`);
    return null;
  }
}

async function updateUserManager(userId, manager) {
  try {
    const sql = 'UPDATE "Users" SET "manager" = $1 WHERE "userId" = $2  RETURNING *;';
    return db.query(sql, [manager.name, userId]);
  } catch (error) {
    dbLogger(`Could not update the manager because ${error.toString()}`);
    return null;
  }
}

async function createUser(user, manager, type) {
  try {
    let roleId = 53019;
    const managerName = manager ? manager.name || manager : null;

    if (type === 'Requester' && user.fullName !== 'Jeremy Johnson') {
      roleId = 401938;
    }

    const selectSql = `SELECT * FROM "Users" WHERE "userId" = '${user.userId}';`;
    let userFromDB = await db.query(selectSql);
    if (userFromDB.rowCount > 0) {
      let updatedUser = userFromDB;
      if (!userFromDB.rows[0].gender && user.gender) {
        dbLogger(`Attempting to update ${user.fullName}'s gender in the database...`);
        updatedUser = await db.query(
          'UPDATE "Users" set gender = $1 where "userId" = $2 AND gender IS NULL RETURNING *;',
          [user.gender, user.userId]
        );
        dbLogger(
          `Successfully updated ${user.fullName}'s gender to ${updatedUser.rows[0].gender}.`
        );
      }

      if (!updatedUser.rows[0].manager && type === 'Requester') {
        dbLogger(`Attempting to update ${user.fullName}'s manager in the database...`);
        updatedUser = await updateUserManager(userFromDB.rows[0].userId, manager);
        dbLogger(`Successfully updated ${user.fullName}'s gender to ${updatedUser.rows[0].manager}.`);
        return updatedUser && updatedUser.rows[0];
      }
      if (type === 'Manager') {
        await createUserRole(updatedUser.rows[0].id, 53019);
      }
      return updatedUser.rows[0];
    }

    const sql = 'INSERT INTO "Users" ("fullName", "email", "userId", "passportName", "department", "occupation",'
    + '"manager", "gender", "location", "picture", "createdAt", "updatedAt")'
    + ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;';
    dbLogger(`Attempting to create ${user.fullName} in the database...`);
    userFromDB = await db.query(sql, [
      user.fullName, user.email, user.userId, user.passportName, user.department, user.occupation,
      managerName, user.gender, user.location, user.picture, new Date(), new Date()
    ]);
    await createUserRole(userFromDB.rows[0].id, roleId);
    return userFromDB.rows[0];
  } catch (error) {
    console.log('error at createUser:', error);
    return null;
  }
}

const generateCheckData = (trip) => {
  let checkStatus = 'Not Checked In';
  let checkInDate = null;
  let checkOutDate = null;
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const currentDateString = `${currentDate.getFullYear()}-${month}-${date}`;
  if (moment(trip.departureDate).isSameOrBefore(currentDateString)) {
    checkStatus = 'Checked In';
    checkInDate = trip.departureDate;
  }
  if (moment(trip.returnDate).isSameOrBefore(currentDateString)) {
    checkStatus = 'Checked Out';
    checkOutDate = trip.returnDate;
  }

  return { checkStatus, checkInDate, checkOutDate };
};

async function createUserRequest(user, tripType, row) {
  try {
    const sqlQuery = 'SELECT "Requests".id FROM "Requests" '
      + 'JOIN "Trips" ON "Trips"."requestId" = "Requests"."id"'
      + ' WHERE "Requests"."userId" = $1 AND "Trips"."departureDate" = $2;';
    const existingRequest = await db.query(sqlQuery, [user.userId, generateGoodDate(row.D)]);

    if (existingRequest.rows.length) {
      dbLogger('Request Updated Created:', row.B);
      return existingRequest.rows[0];
    }
    const sql = 'INSERT INTO "Requests" ("id", "name", "manager", "gender", "department", "role",'
      + '"status", "userId", "tripType", "picture", "createdAt", "updatedAt")'
      + ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;';
    const requestFromDb = await db.query(sql, [
      generateUniqueId(), user.fullName, user.manager, user.gender, user.department,
      user.occupation, 'Verified', user.userId, tripType, user.picture,
      new Date(), new Date()
    ]);
    dbLogger('Request Successfully Created', row.B);
    return requestFromDb.rows[0];
  } catch (error) {
    console.log('error at createUserRequest:', error);
    return null;
  }
}

async function createRequestTrips(trip, row) {
  try {
    const sqlQuery = `SELECT * FROM  "Trips" WHERE "requestId" = '${trip.requestId}' AND "departureDate" = '${trip.departureDate}';`;
    const existingTrip = await db.query(sqlQuery);
    if (existingTrip.rows.length) {
      const {
        bedId, checkStatus: status, checkInDate: checkIn, checkOutDate: checkOut
      } = existingTrip.rows[0];

      if (!bedId) {
        let updatedTrip;
        if (!status || !checkIn || !checkOut) {
          const { checkStatus, checkInDate, checkOutDate } = generateCheckData(trip);
          const query = 'UPDATE "Trips"'
          + ' SET "bedId" = $1, "checkInDate" = $2 , "checkOutDate" = $3, "checkStatus" = $4'
          + ' WHERE "requestId" = $5 AND "departureDate" = $6 RETURNING *;';
          updatedTrip = await db.query(query, [trip.bedId, checkInDate, checkOutDate, checkStatus, trip.requestId, trip.departureDate]);
        }

        if (row.G && row.G.toLowerCase() === 'hotel') {
          const sql = 'UPDATE "Trips"'
            + ' SET "accommodationType" = $1'
            + ' WHERE "requestId" = $2 AND "departureDate" = $3 RETURNING *;';
          updatedTrip = await db.query(sql, ['Hotel Booking', trip.requestId, trip.departureDate]);
        }
        dbLogger('Trip updated successfully:', row.B);
      } else {
        dbLogger('Trip for this request already Exists:', row.B);
      }
    } else {
      const { checkStatus, checkInDate, checkOutDate } = generateCheckData(trip);

      const sql = 'INSERT INTO "Trips" ("id", "requestId", "origin", "destination", "departureDate", "returnDate",'
      + '"bedId", "travelCompletion", "checkStatus", "checkInDate", "checkOutDate", "createdAt", "updatedAt")'
      + ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;';
      const tripsFromDb = await db.query(sql, [
        generateUniqueId(), trip.requestId, trip.origin, trip.destination, trip.departureDate,
        trip.returnDate, trip.bedId, true, checkStatus, checkInDate, checkOutDate,
        new Date(), new Date()
      ]);
      dbLogger('Trip created successfully:', row.B);
      return tripsFromDb.rows[0];
    }
  } catch (error) {
    dbLogger('Error at createRequestTrips:', error);
    return null;
  }
}

async function createApprovals(approval) {
  try {
    const sql = `SELECT * FROM "Approvals" WHERE "requestId" = \'${approval.requestId}\';`;
    const existingApproval = await db.query(sql);
    if (existingApproval.rows.length) {
      dbLogger('Approval for this request already exists');
    } else {
      const sql = 'INSERT INTO "Approvals" ("requestId", "status", "approverId",'
      + '"createdAt", "updatedAt")'
      + ' VALUES ($1, $2, $3, $4, $5) RETURNING *;';
      const approvalsFromDb = await db.query(sql, [
        approval.requestId, 'Verified',
        approval.approverId, new Date(), new Date()
      ]);
      return approvalsFromDb.rows[0];
    }
  } catch (error) {
    dbLogger('error at createApprovals:', error);
    return null;
  }
}

async function getAndelaCenters(location) {
  const locationRegex = new RegExp(`${location}$`);
  const sql = 'SELECT * FROM "Centers"';
  const { rows } = await db.query(sql);
  switch (location) {
    case 'US-NY':
    case 'NY':
    case 'US-IL':
    case 'US-MA':
      return 'New York, United States';
    case 'US-CA':
      return 'San Francisco, United States';
    case 'US-DC':
      return 'Washington DC, United States';
    case 'Ghana':
    case 'Cameroon':
      return 'Lagos, Nigeria';
    case 'Kigali':
      return 'Kigali, Rwanda';
    case 'Cairo':
      return 'Nairobi, Kenya';
    default:
      let center = rows.find((item) => locationRegex.test(item.location));
      if (center === undefined) center = { location: undefined };
      return center.location;
  }
}

/* istanbul ignore next */
module.exports = {
  createUserRole,
  createDefaultSuperUser,
  getBedId,
  getUserFromAndela,
  getUserFromBambooHR,
  createUser,
  createUserRequest,
  createRequestTrips,
  createApprovals,
  createFailedMigration,
  clearFailedMigration,
  getAndelaCenters,
  generateGoodDate
};
