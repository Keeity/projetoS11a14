const {Router} = require('express');
 const professorRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
const { auth } = require('../middleware/auth');
const ProfessorController = require('../controllers/ProfessorController');

/* _____________ PROFESSORES  _______________ */        

//cadastrar professor
professorRoutes.post('/', auth, ProfessorController.cadastrar)   

//filtra professores por parte do nome e validação maiúsculas ou LISTA professores se não indicar filtro
professorRoutes.get('/', ProfessorController.listar);

//PUT - altera professor por id (todos os campos)
professorRoutes.put('/:id', ProfessorController.alterar)

// Atualização parcial de um professor - celular
professorRoutes.patch('/:id', auth, ProfessorController.alterarParcial);

//deleta professor por id - com validação
  professorRoutes.delete('/:id', auth, ProfessorController.deletar)  

module.exports = professorRoutes  //exporta 
// é o mesmo que: export default routes