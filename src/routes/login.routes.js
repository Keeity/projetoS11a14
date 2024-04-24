const {Router} = require('express');
const loginRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes).
const { auth } = require('../middleware/auth');

const LoginController = require('../controllers/LoginController')
 

//Fazer Login
loginRoutes.post('/', LoginController.login)

// //alterar senha - utilizando id constante no payload
loginRoutes.put('/alterarsenha', auth, LoginController.alterarSenha)


module.exports = loginRoutes  //exporta 
// é o mesmo que: export default routes