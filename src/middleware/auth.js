//verifica se o token que a pessoa informou é válido.
const { verify } = require('jsonwebtoken')
const { secret } = require('../config/database.config')  //ali embaixo, ao invés de "process.env.SECRET_JWT", usa apenas secret

async function auth(req, res, next){ //parâmetros padrões de middleware
try {
console.log("Entramos no middleware")
const { authorization } = req.headers //vvai colocar o token aqui. Headers é o cabeçalho da requisição. REQ é json e tem vários objetos...

req['payload'] = verify(authorization, secret) //cria um novo objeto chamado payload. Depois verifica o toke. Usa a função verify do próprio JWT. Precisa passar a chave secreta.
//cria um novo item de requisição, que é o payload.
//verify - se não preencher os requisitos, cai.
 
next() //pula para a próxima middleware ou, se não tiver, passa para a rota
} catch(error){
return res.status(401).send({message: "Autenticação falhou", //se fala send, o navgador é que tem que descobrir o que é. Aqui, pode colocar send ou json.
cause: error.message  //traz o erro
})

}
}



//daí, se quiser exigir autenticação em alguma rota, é só colocar o middleware entre req res da rota.  req, auth, res
module.exports = { auth }