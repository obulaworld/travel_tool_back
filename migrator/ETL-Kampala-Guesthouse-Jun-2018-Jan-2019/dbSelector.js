/* istanbul ignore file */
const db = require('./dbConnection');

async function getUsers() {
  const users = await db.query('SELECT * FROM "Users";');
  console.log('users:', users);
}

getUsers();
