// Esse arquivo serve para conectar à tabela que quer mexer.

const { DataTypes } = require('sequelize') //IMPORTA SEQUELIZE
// variável connection é que faz conexão com banco de dados
const { connection } = require('../database/connection')  //aqui, diz que quer chamar a variável connection, na pasta dta base

//Define a variável Aluno que representa a conexão com o banco de dados, com a tabela alunos
const Matricula = connection.define('matriculas', { //aqui, diz que quer conectar ao banco de dados, à tabela 'alunos'.
aluno_id: { //define cada coluna da tabela que se quer manipular - visualizar ou acessar. ID não precisa
    type: DataTypes.NUMBER},
curso_id: {
    type: DataTypes.NUMBER
} 
})

//para usar em qualquer lugar, exporta

module.exports = Matricula //Model coloca com A maiúsculo.
