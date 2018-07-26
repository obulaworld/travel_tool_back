module.exports = {
  up: queryInterface => Promise.all([
    queryInterface.renameColumn('users', 'first_name', 'firstName'),
    queryInterface.renameColumn('users', 'last_name', 'lastName'),
  ]),

  down: queryInterface => Promise.all([
    queryInterface.renameColumn('users', 'firstName', 'first_name'),
    queryInterface.renameColumn('users', 'lastName', 'last_name'),
  ]),
};
