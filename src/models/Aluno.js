// Esse arquivo serve para conectar à tabela que quer mexer.

const { DataTypes } = require('sequelize') //IMPORTA SEQUELIZE
// variável connection é que faz conexão com banco de dados
const { connection } = require('../database/connection')  //aqui, diz que quer chamar a variável connection, na pasta dta base

//Define a variável Aluno que representa a conexão com o banco de dados, com a tabela alunos
const Aluno = connection.define('alunos', { //aqui, diz que quer conectar ao banco de dados, à tabela 'alunos'.
email: {
    type: DataTypes.STRING
},
password: {
    type: DataTypes.STRING
},
    nome: { //define cada coluna da tabela que se quer manipular - visualizar ou acessar. ID não precisa
    type: DataTypes.STRING //esse DataTypes importa do sequelize. Ao invés do varchar, coloca STRING
},
data_nascimento: {
    type: DataTypes.DATE 
} ,
celular: {
    type: DataTypes.STRING //o número de telefone é uma string e pode incluir caracteres significativos, como colchetes () , hífens - ou caracteres
}
})

//para usar em qualquer lugar, exporta

module.exports = Aluno //Model coloca com A maiúsculo.
