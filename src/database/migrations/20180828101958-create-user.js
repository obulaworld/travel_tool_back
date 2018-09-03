module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    roleId: {
      type: Sequelize.INTEGER,
      onDelete: 'set null',
      allowNull: false,
      defaultValue: 401938,
      references: {
        model: 'Roles',
        key: 'id',
        as: 'roleId',
      },
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
