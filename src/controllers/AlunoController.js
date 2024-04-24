//utiliza classe para criar controller. Classe é bem flexível.
//dentro da classe, consegue ter 1) Construtor - primeira coisa que é executada quando chama a classe; 2) Métodos - ex listar(), 3) Atributos - variáveis
const {Router} = require('express');
const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.
const Aluno = require("../models/Aluno")

class AlunoController {

// Método - dentro de uma classe, para criar um método, não precisa iniciar com function, bastando colocar o nome

async cadastrar(req,res) { // aqui, coloca desde o try até o catch
    try {
        const email = req.body.email
       const password = req.body.password
       const nome = req.body.nome //puxa variável nome, para capturar quando preencherem
         const data_nascimento = req.body.data_nascimento //tem que passar ano-mês-dia. O sequelize exporta ao BDD como data.
       const celular = req.body.celular
   
   if(!email) {
     return res.status(400).json({message:'O email é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
   }
   
   if(!password) {
     return res.status(400).json({message:'A senha é obrigatória!'}) //return - encerra o código por aí mesmo . 400 é bad request
   }
   
   if(!nome) { //!nome é o mesmo que nome === "". se quisesse incluir outro, colocaria ||
   return res.status(400).json({message:'O nome é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
   }
   
   if(!data_nascimento) {
     return res.status(400).json({message:'A data de nascimento é obrigatória!'}) //return - encerra o código por aí mesmo . 400 é bad request
   }
     // Rejex - é recurso nativo = verificar se uma data está no formato "aaaa-mm-dd"
     if(!(data_nascimento.match(/\d{4}-\d{2}-\d{2}/gm))) {
       return res.status(400).json({message:'A data de nascimento não está no formato correto!'})
     }
     //para criptografar senha com bcrypt
    //  const salt = await bcrypt.genSalt(10);
    //  const hashedPassword = await bcrypt.hash(password, salt);

     const aluno = await Aluno.create({ //usa wait na frente do que quer esperar.
      email: email, 
      password: password,
       nome: nome,
           data_nascimento: data_nascimento,
           celular: celular

   }) 
   res.status(201).json(aluno) //Vai exibir o objeto aluno. Quando coloca variável no json, só coloca entre parêntes
   } catch (error) { //catch pega o que não é previsível.. mais fatal. Tem gente que inclui o previsível no catch também, mas daí tinha que fazer uns ajustes mais avançados.
   console.log(error.message) //retorna o erro aqui (mensagem técnica)
     res.status(500).json({error: 'Não foi possível cadastrar o aluno'})
   }
   
} 

// //Lista alunos com filtro
async listarAlunos (req, res) {
  try {
    let params = {};
    if(req.query.nome) {
      params = {...params, nome: { [Op.iLike]: '%' + req.query.nome + '%' }} //ilike ignora maiuscula/minuscula
    }
    const alunos = await Aluno.findAll({ where: params });

    if(alunos.length > 0)  {
      console.log(`Listando ${req.query.nome ? 'apenas os alunos filtrados a partir de ' + req.query.nome : 'todos os alunos'}`); //expressão ternária que substitui if else - Se req.query.nome for verdadeiro, retorna 'apenas os alunos filtrados a partir de ' + req.query.nome. Caso contrário, retorna 'todos os alunos'.
      return res.status(200).json(alunos);
    } else {
      console.log(`Nenhum aluno encontrado com o parâmetro fornecido (${req.query.nome}).`);
      return res.status(404).json({error: 'Nenhum aluno encontrado'});
    }
  }
   catch (error) {
    console.error(`Erro ao filtrar alunos: ${error}`)
    return res.status(500).json({error: 'Erro interno do servidor'})
  }
}


async listarUm (req,res) {
  try {
    const { id} = req.params
    const aluno = await Aluno.findByPk(id)
    if(!aluno) {
      return res.status(404).json({ message: "Usuário não encontrado!"})
    }
  res.json(aluno) //se não escreve nada, ele reconhece 200
  
  } catch (error) {
    console.error(`Erro ao buscar alunos: ${error}`);
    return res.status(500).json({error: 'Erro interno do servidor'});
  }

}



}

module.exports = new AlunoController() //já exportar a classe com New, porque daí ela já fica pronta para uso.