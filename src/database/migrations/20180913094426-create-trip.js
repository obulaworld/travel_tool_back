module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Trips', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    requestId: {
      allowNull: false,
      type: Sequelize.STRING,
      references: {
        model: 'Requests',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    origin: {
      allowNull: false,
      type: Sequelize.STRING
    },
    destination: {
      allowNull: false,
      type: Sequelize.STRING
    },
    departureDate: {
      allowNull: false,
      type: Sequelize.DATE
    },
    returnDate: {
      allowNull: true,
      type: Sequelize.DATE
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
  down: queryInterface => queryInterface.dropTable('Trips')
};
