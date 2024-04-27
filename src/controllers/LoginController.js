const { sign }  = require ('jsonwebtoken')
const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.
const { secret } = require('../config/database.config');
const Aluno = require('../models/Aluno');
const { compare, hash } = require("bcryptjs") //para comparar senha criptografada com a passada pelo usuário
const {Router} = require('express');

class LoginController {

async login(req,res) {
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
            where: {email:email}
        })
  
        if(!aluno){
            return res.status(404).json({ messagem: 'Nenhum aluno corresponde a email e senha fornecidos!' })
        }
  
        
        const hashSenha = await compare(password, aluno.password)

        if(hashSenha === false) {
            return res.status(403).json({mensagem: 'Email e/ou senha não conferem'})
        }
        const payload = {sub: aluno.id, email: aluno.email, nome: aluno.nome} //sub é usado para representar o sujeito (é normalmente ID). Essas informações estarão no corpo do token
        const token = sign(payload, secret, {expiresIn: "24h"}) // usa função sign do JWT. cria token padrão token jwt (Usando algoritmo HS256 - a mesma chave é usada para assinar e verificar o token) . puxa password do .env. --> importou lá em cima do database.config
                     // ao invés de secret poderia utilizar process.env.SECRET_JWT
                     // se não acrescente o terceiro, não expira nunca. se acrescenta "expiresIn: """ daí expira em 24h ou "2 days"
        res.status(200).json({token: token})
  
    } catch (error) {
        return res.status(500).json({ error: error, message: 'Algo deu errado!' })
    }

}
//alterar senha - utilizando id constante no payload
async alterarSenha (req,res) { 
    try {
        const id = req.payload.sub //usando o que há no payload.
       const password = req.body.password //pega a nova senha do corpo da requisição
       const aluno = await Aluno.findByPk(id)
     
     if(!aluno){
       return res.status(404).json({error: 'Aluno não encontrado.'})
     }

   //  const hashSenha = await compare(password, aluno.password)

     //if(hashSenha) {
      //  return res.status(403).json({mensagem: 'A senha é idêntica à já cadastrada'})
    //}

//aluno.password = await hash(password, 8) // criptografa o password antes de salvar. se não usar o beforeSave como há abaixo, que vale para todas as rotas, pode escrever a linha como essa.
aluno.password = password
await aluno.save();
     console.log("Alteração de senha realizada com sucesso!")
     res.status(200).json({message: "Alteração de senha realizada com sucesso!"})
     } catch (error) {
       console.error(`Erro ao tentar alterar: ${error}`);
       return res.status(500).json({error: 'Erro interno do servidor'});
     }
}

}

module.exports = new LoginController()