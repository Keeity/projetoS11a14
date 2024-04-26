const {Router} = require('express');
const loginRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes).
const { auth } = require('../middleware/auth');
const LoginController = require('../controllers/LoginController')
 
/* _____________ LOGIN/ PASSWORD  _______________ */

//Fazer Login
loginRoutes.post('/', LoginController.login)

// //alterar senha 
loginRoutes.put('/alterarsenha', LoginController.alterarSenha)

module.exports = loginRoutes  //exporta 
// é o mesmo que: export default routes