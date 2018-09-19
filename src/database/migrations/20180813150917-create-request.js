module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Requests', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    },
    origin: {
      allowNull: false,
      type: Sequelize.STRING
    },
    destination: {
      allowNull: false,
      type: Sequelize.STRING
    },
    manager: {
      allowNull: false,
      type: Sequelize.STRING
    },
    gender: {
      allowNull: false,
      type: Sequelize.STRING
    },
    department: {
      allowNull: false,
      type: Sequelize.STRING
    },
    role: {
      allowNull: false,
      type: Sequelize.STRING
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'Open'
    },
    userId: {
      allowNull: false,
      type: Sequelize.STRING
    },
    departureDate: {
      allowNull: false,
      type: Sequelize.DATEONLY
    },
    arrivalDate: {
      allowNull: false,
      type: Sequelize.DATEONLY
    },
    tripType: {
      allowNull: false,
      type: Sequelize.ENUM,
      values: ['return', 'oneWay', 'multi']
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Requests')
};
