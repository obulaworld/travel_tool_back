module.exports = {
  up: (queryInterface, Sequelize) => { //eslint-disable-line
    queryInterface.sequelize.query(
      'drop type if exists "enum_Approvals_status";'
    );
    return queryInterface.addColumn('Approvals', 'status', {
      type: Sequelize.ENUM('Open', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Open'
    });
  },

  down: (queryInterface, Sequelize) => {//eslint-disable-line
    return queryInterface.removeColumn('Approvals', 'status');
  }
};
