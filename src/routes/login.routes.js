const {Router} = require('express');

const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.

const Aluno = require('../models/Aluno');

const { sign }  = require ('jsonwebtoken')
 const loginRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
const { secret } = require('../config/database.config');
const { auth } = require('../middleware/auth');

//criar a primeira rota.existem 4 tipos de rotas: GET, POST, PUT, DELETE,// 1o) define o tipo de rota; 2o) define o path ('/')
loginRoutes.get('/bem_vindo', (req,res) => {
try {
  res.json({name:"Bem vindo!"})
} catch (error) {
  console.error(`Erro ao tentar abrir: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
})

/* _____________ ROTAS DE LOGIN  _______________ */
 

loginRoutes.post('/', async (req, res) => {
  try {
      const email = req.body.email   //desestruturar {}  = pdia ser const {email, password} = req.body
      const password = req.body.password

      if (!email) {
          return res.status(400).json({ message: 'O email é obrigatório' })
       }

      if (!password) {
          return res.status(400).json({ message: 'O password é obrigatório' })
      }

      const aluno = await Aluno.findOne({
          where: {email:email, password:password}
      })

      if(!aluno){
          return res.status(404).json({ messagem: 'Nenhum aluno corresponde a email e senha fornecidos!' })
      }

      const payload = {sub: aluno.id, email: aluno.email, nome: aluno.nome} //sub é usado para representar o sujeito (é normalmente ID). Essas informações estarão no corpo do token
      const token = sign(payload, secret) // usa função sign do JWT. cria token padrão token jwt (Usando algoritmo HS256 - a mesma chave é usada para assinar e verificar o token) . puxa password do .env. --> importou lá em cima do database.config
                   // ao invés de secret poderia utilizar process.env.SECRET_JWT
      res.status(200).json({token: token})
//res.status(200).json({message: "Esse é o token"})

  } catch (error) {
      return res.status(500).json({ error: error, message: 'Algo deu errado!' })
  }
})

//alterar senha - utilizando id constante no payload

loginRoutes.put('/alterarsenha', auth, async (req,res) => {

  try {

   const id = req.payload.sub //usando o que há no payload.
  const password = req.body.password //pega a nova senha do corpo da requisição
  const aluno = await Aluno.findByPk(id)

if(!aluno){
  return res.status(404).json({error: 'Aluno não encontrado.'})
}

aluno.password = password;
await aluno.save();
console.log("Alteração de senha realizada com sucesso!")
res.status(200).json({message: "Alteração de senha realizada com sucesso!"})
} catch (error) {
  console.error(`Erro ao tentar alterar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
})



module.exports = loginRoutes  //exporta 
// é o mesmo que: export default routes