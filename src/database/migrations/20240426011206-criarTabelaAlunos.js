'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('alunos', {
       id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
       },
       nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      data_nascimento: {
        allowNull: false,
        type: Sequelize.DATE
      },
      celular: {
        type: Sequelize.STRING,
        allowNull: true
      },
        email: {
        type: Sequelize.STRING,
        allowNull: false,
             },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
         },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
       updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('alunos');
  }
};
