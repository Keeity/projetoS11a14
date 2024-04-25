const {Router} = require('express'); //Router permite criar as rotas
 const cursoRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
 const { auth } = require('../middleware/auth');
const CursoController = require('../controllers/CursoController');

/* _____________ CURSOS  _______________ */

//cria curso
cursoRoutes.post('/', auth, CursoController.cadastrar)   

//filtra cursos por parte do nome e validação maiúsculas ou LISTA CURSOS
cursoRoutes.get('/', CursoController.listar);

//PUT - altera curso por id
cursoRoutes.put('/:id', auth, CursoController.alterar)

// Atualização parcial de um Curso - professor
cursoRoutes.patch('/:id', auth, CursoController.alterarParcial);

//deleta cursos  com validação prévia
cursoRoutes.delete('/:id', auth, CursoController.deletar)

module.exports = cursoRoutes  //exporta 
