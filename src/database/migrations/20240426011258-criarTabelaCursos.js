'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cursos', {
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
      duracao_horas: {
       allowNull: false,
       type: Sequelize.INTEGER
     },

    professor_id: {
      allowNull: false,
   type: Sequelize.INTEGER,
   references: {
     model: 'professores',
     key: 'id'
   },
   onUpdate: 'CASCADE',
   onDelete: 'CASCADE'
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

    await queryInterface.dropTable('cursos');
  }
};
