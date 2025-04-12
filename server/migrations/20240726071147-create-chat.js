'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chats', {
      chat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user1_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      user2_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    });

    await queryInterface.addConstraint('chats', {
      fields: ['user1_id', 'user2_id'],
      type: 'unique',
      name: 'unique_user_pair'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('chats');
  }
};