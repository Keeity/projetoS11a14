const {Router, query} = require('express');

const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.

const Aluno = require('../models/Aluno');

//const { sign }  = require ('jsonwebtoken')
 const alunosRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
//const { secret } = require('../config/database.config');
const { auth } = require('../middleware/auth');
const AlunoController = require('../controllers/AlunoController');


/* _____________ ALUNOS  _______________ */

//cadastrar aluno na tabela de banco de dados
alunosRoutes.post('/', AlunoController.cadastrar)


//lista alunos com possibilidade de filtro
alunosRoutes.get('/', auth, AlunoController.listarAlunos)

//filtrar aluno por id route params
alunosRoutes.get('/:id', auth, AlunoController.listarUm)

// // //Lista alunos simples
// routes.get('/', async (req,res) => {// async await é para cada função
// try {
//   const alunos = await Aluno.findAll()   //aqui, findAll() busca todos os alunos
//  res.status(201).json(alunos)
// }
// catch(){}
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
// é o mesmo que: export default alunosroutes