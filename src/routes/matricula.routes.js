const {Router} = require('express');
const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.
//const Aluno = require('../models/Aluno');
//const Curso = require('../models/Curso');
const Matricula = require('../models/Matricula');
const MatriculaController = require('../controllers/MatriculaController')
const matriculaRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
const { auth } = require('../middleware/auth');




matriculaRoutes.post('/', auth, MatriculaController.cadastrar)



/* _____________ MATRICULAS  _______________ */

    //cria matricula
matriculaRoutes.post('/', auth, MatriculaController.cadastrar)


//lista matriculas
matriculaRoutes.get('/', auth, async (req,res) => {// async await é para cada função
  try {  
  const matriculas = await Matricula.findAll()   //aqui, findAll() busca todos os alunos 
     res.status(200).json(matriculas)
    } catch (error) {
      console.error(`Erro ao tentar listar: ${error}`);
      return res.status(500).json({error: 'Erro interno do servidor'});
    }
    })

//        deleta por ID  valida se existe

matriculaRoutes.delete('/:id', auth, async (req,res) => {   //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
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
    matriculaRoutes.delete('/:id', auth, (req,res) => {   const id = req.params.id    //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
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


module.exports = matriculaRoutes  //exporta 
// é o mesmo que: export default routes