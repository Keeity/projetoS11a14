const {Router} = require('express');
const MatriculaController = require('../controllers/MatriculaController')
const matriculaRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
const { auth } = require('../middleware/auth');

/* _____________ MATRICULAS  _______________ */

//cria matricula
matriculaRoutes.post('/', auth, MatriculaController.cadastrar)

//lista matriculas
matriculaRoutes.get('/', auth, MatriculaController.listar)

// deleta por ID  valida se existe
matriculaRoutes.delete('/:id', auth, MatriculaController.deletar)  


module.exports = matriculaRoutes  //exporta 
// é o mesmo que: export default routes