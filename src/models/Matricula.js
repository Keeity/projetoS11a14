// Esse arquivo serve para conectar à tabela que quer mexer.

const { DataTypes } = require('sequelize') //IMPORTA SEQUELIZE
// variável connection é que faz conexão com banco de dados
const { connection } = require('../database/connection')  //aqui, diz que quer chamar a variável connection, na pasta dta base
const Aluno = require('./Aluno')
const Curso = require('./Curso')


//Define a variável Matricula que representa a conexão com o banco de dados, com a tabela alunos
const Matricula = connection.define('matriculas', { //aqui, diz que quer conectar ao banco de dados, à tabela 'alunos'.
aluno_id: { //define cada coluna da tabela que se quer manipular - visualizar ou acessar. ID não precisa
    type: DataTypes.INTEGER, //EU TINHA COLOCADO NUMBER
    references: {   //faz referência.
        model: Aluno,
        key: 'id'
    }
},
curso_id: {
    type: DataTypes.INTEGER,
    references: {  //faz referência.
        model: Curso,
        key: 'id'
    }
}
}

,{paranoid: true}

);

//chave estrangeira
Aluno.hasMany( Matricula, {foreignKey: 'aluno_id'}) //modelo de um para muitos. aluno tem muitas matriculas
Curso.hasMany( Matricula, {foreignKey: 'curso_id'}) //modelo de um para muitos. Curso tem muitas matriculas
Matricula.belongsTo(Aluno, {foreignKey: 'aluno_id'}) // Uma matrícula pertence a um aluno
Matricula.belongsTo(Curso, {foreignKey: 'curso_id'})// Uma matrícula pertence a um curso

//para usar em qualquer lugar, exporta
module.exports = Matricula //Model coloca com A maiúsculo.
