'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('cursos', 'professor_id', {
       allowNull: true,
    type: Sequelize.INTEGER,
    references: {
      model: 'professores',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
    });

 
  },


  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('cursos', 'professor_id');

  }
};
