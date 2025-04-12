'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(30)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      firstname: {
        type: Sequelize.STRING(30)
      },
      lastname: {
        type: Sequelize.STRING(30)
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(255),
        unique: true
      },
      url: {
        type: Sequelize.STRING(255)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};