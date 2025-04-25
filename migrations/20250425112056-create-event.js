'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.STRING
      },
      timestamp: {
        type: Sequelize.DATE
      },
      source: {
        type: Sequelize.STRING
      },
      eventType: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      headers: {
        type: Sequelize.JSON
      },
      payload: {
        type: Sequelize.JSON
      },
      token: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};