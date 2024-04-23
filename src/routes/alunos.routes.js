const {Router, query} = require('express');

const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.

const Aluno = require('../models/Aluno');

//const { sign }  = require ('jsonwebtoken')
 const alunosRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
//const { secret } = require('../config/database.config');
const { auth } = require('../middleware/auth');


/* _____________ ALUNOS  _______________ */

//cadastrar aluno na tabela de banco de dados
alunosRoutes.post('/', async (req,res) => { //coloca o async na frente da função que vai ser executada completamente antes 
//não precisa mais prever '/alunos', por conta da previsão em routes.js
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

     //para toda  variável string é possível colocar um .match, que retorna true ou false. Dentro dos parenteses, coloca um rejexs)

  //para trabalhar com datas (até tal data...), melhor trabalhar com biblioteca - momentJs date-fns

  const aluno = await Aluno.create({ //usa wait na frente do que quer esperar.
   email: email, 
   password: password,
    nome: nome,
        data_nascimento: data_nascimento,
        celular: celular
  // res.json({name: `Aluno Criado: ${aluno}!`})
}) 
res.status(201).json(aluno) //Vai exibir o objeto aluno. Quando coloca variável no json, só coloca entre parêntes
} catch (error) { //catch pega o que não é previsível.. mais fatal. Tem gente que inclui o previsível no catch também, mas daí tinha que fazer uns ajustes mais avançados.
console.log(error.message) //retorna o erro aqui (mensagem técnica)
  res.status(500).json({error: 'Não foi possível cadastrar o aluno'})
}

  })   




//filtrar aluno por id route params

alunosRoutes.get('/:id', auth, async (req, res) => {
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
})

//melhorado pelo copilot
alunosRoutes.get('/', auth, async (req, res) => {
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
  } catch (error) {
    console.error(`Erro ao alterar alunos: ${error}`);
    return res.status(500).json({error: 'Erro interno do servidor'});
  }
});

// //Lista alunos simples
// routes.get('/alunos', async (req,res) => {// async await é para cada função
// const alunos = await Aluno.findAll()   //aqui, findAll() busca todos os alunos
//  res.status(201).json(alunos)
// })

//PUT - altera aluno por id

alunosRoutes.put('/:id', auth, async (req,res) => {

  try {
  const id = req.params.id;
const aluno = await Aluno.findByPk(id)

if(!aluno){
  return res.status(404).json({error: 'Aluno não encontrado.'})
}
aluno.update(req.body)
await aluno.save()
console.log("Alteração realizada com sucesso!")
res.status(200).json(aluno)
} catch (error) {
  console.error(`Erro ao tentar alterar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
})

//alterar senha - utilizando id constante no payload

alunosRoutes.put('/alterarsenha', auth, async (req,res) => {

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


// Atualização parcial de um Aluno - celular
alunosRoutes.patch('/:id', auth, async (req, res) => {
try {
  const  id = req.params.id;
const celular = req.body.celular;
 const aluno = await Aluno.findByPk(id)

  if (!aluno) {
return  res.status(404).json({ error: 'Aluno não encontrado.'})
  }
//curso.update(req.body);     . O método .update() é útil quando você quer atualizar vários campos de uma vez a partir de um objeto
aluno.celular = celular;
await aluno.save()
console.log("Alteração realizada com sucesso!")
res.status(200).json({ message: `Aluno id ${id} teve o celular alterado para ${celular} com sucesso!`});
} catch (error) {
  console.error(`Erro ao tentar atualizar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
});



//deleta aluno por id - com validação
alunosRoutes.delete('/:id', auth, async (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
try{
    const { id } = req.params;   //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
   const aluno = await Aluno.findByPk(id);
   if(!aluno) {
    return res.status(404).json({error:`Aluno ID ${id} não encontrado.`})
     }
   await aluno.destroy() //ele deleta usando sequelize.
    
    res.status(204).json({message: `Aluno ID ${id} deletado com sucesso!`})
  } catch (error) {
    console.error(`Erro ao tentar excluir: ${error}`);
    return res.status(500).json({error: 'Erro interno do servidor'});
  }

  })  

  //deleta aluno por id - route params - sem validação
  alunosRoutes.delete('/:id', auth, (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
   try {
    const id = req.params.id    //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
    Aluno.destroy({
      where: { id: id //aqui, pode colocar onde começa em x...
      }
    }) //ele deleta usando sequelize.
    
    res.status(204).json({message: `Aluno ID ${id} deletado com sucesso!`})
  } catch (error) {
    console.error(`Erro ao tentar excluir: ${error}`);
    return res.status(500).json({error: 'Erro interno do servidor'});
  }   
  })  


module.exports = alunosRoutes  //exporta 
// é o mesmo que: export default routes