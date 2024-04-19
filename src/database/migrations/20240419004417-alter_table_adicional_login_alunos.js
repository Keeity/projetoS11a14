
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('alunos', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue:"email null" //quando cria uma coluna com allownull:false, vai ter que criar um padrão para aqueles cadastrados anteriormente (para não ficar true)
    });
    await queryInterface.addColumn('alunos', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue:"password null" 
    });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('alunos', 'email');
    await queryInterface.removeColumn('alunos', 'password');

  }
};
