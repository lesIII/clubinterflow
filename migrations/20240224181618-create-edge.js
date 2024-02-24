'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Edges', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      source: {
        allowNull: false,
        type: Sequelize.STRING
      },
      target: {
        allowNull: false,
        type: Sequelize.STRING
      },
      animated: {
        type: Sequelize.BOOLEAN
      },
      style: {
        type: Sequelize.JSON
      },
      due: {
        type: Sequelize.STRING
      },
      eventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Events',
          key: 'id'
        },
        onDelete: 'cascade'
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
    await queryInterface.dropTable('Edges');
  }
};