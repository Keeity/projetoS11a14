const {Router} = require('express');
const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.
const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const Matricula = require('../models/Matricula');

const matriculasRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
const { auth } = require('../middleware/auth');


/* _____________ MATRICULAS  _______________ */

    //cria matricula
matriculasRoutes.post('/', auth, async (req,res) => {
try {
    const curso_id = req.body.curso_id //puxa variável nome, para capturar quando preencherem
      const aluno_id = req.body.aluno_id 

      if(!curso_id) { 
        return res.status(400).json({message:'O id do Curso é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
        }
        
        if(!aluno_id) {
          return res.status(400).json({message:'O id do aluno é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
        }
const matricula = await Matricula.create({
        aluno_id: aluno_id,
        curso_id: curso_id
    })  
   res.status(201).json({name: 'Matrícula Criada!'})
  }
catch (error) { //catch pega o que não é previsível.. mais fatal. Tem gente que inclui o previsível no catch também, mas daí tinha que fazer uns ajustes mais avançados.
    console.log(error.message) //retorna o erro aqui (mensagem técnica)
      res.status(500).json({error: 'Não foi possível cadastrar a matrícula.'})
}
})   

//lista matriculas
matriculasRoutes.get('/', auth, async (req,res) => {// async await é para cada função
  try {  
  const matriculas = await Matricula.findAll()   //aqui, findAll() busca todos os alunos
     res.status(200).json(matriculas)
    } catch (error) {
      console.error(`Erro ao tentar listar: ${error}`);
      return res.status(500).json({error: 'Erro interno do servidor'});
    }
    })

//        deleta por ID  valida se existe

matriculasRoutes.delete('/:id', auth, async (req,res) => {   //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
try {
  const {id} = req.params; 
const matricula = await Matricula.findByPk(id);
if (!matricula) {
return res.status(404).json({ error: 'ID não encontrado'})
}     
  
await matricula.destroy();
return res.status(204).json({message: `Matrícula ID ${id} deletada com sucesso!`})
} catch (error) {
  console.error(`Erro ao tentar deletar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}   
})  


    //deleta por ID - simples
    matriculasRoutes.delete('/:id', auth, (req,res) => {   const id = req.params.id    //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
   try {
    Matricula.destroy({
        where: { id: id //aqui, pode colocar onde começa em x...
        }
      }) //ele deleta usando sequelize.
      
      res.status(204).json({message: `Matrícula ID ${id} deletado com sucesso!`})
    } catch (error) {
      console.error(`Erro ao tentar excluir: ${error}`);
      return res.status(500).json({error: 'Erro interno do servidor'});
    }   
    })  


module.exports = matriculasRoutes  //exporta 
// é o mesmo que: export default routes