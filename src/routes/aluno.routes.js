const {Router, query} = require('express');
const alunoRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
const { auth } = require('../middleware/auth');
const AlunoController = require('../controllers/AlunoController');
//const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.
//const Aluno = require('../models/Aluno');


/* _____________ ALUNOS  _______________ */

//cadastrar aluno na tabela de banco de dados
alunoRoutes.post('/', AlunoController.cadastrar)

//lista alunos com possibilidade de filtro
alunoRoutes.get('/', auth, AlunoController.listarAlunos)

//filtrar aluno por id route params
alunoRoutes.get('/:id', auth, AlunoController.listarUm)

//PUT - altera aluno por id
alunoRoutes.put('/:id', auth, AlunoController.alterar)

// Atualização parcial de um Aluno - celular
alunoRoutes.patch('/:id', auth, AlunoController.alterarParcial);

//deleta aluno por id - com validação
alunoRoutes.delete('/:id', auth, AlunoController.deletar)  

//exporta
module.exports = alunoRoutes // é o mesmo que: export default alunoRoutes