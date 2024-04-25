const Matricula = require('../models/Matricula')
const Aluno = require('../models/Aluno')
const Curso = require('../models/Curso')

class MatriculaController {

async cadastrar (req,res) {
    try {
        const curso_id = req.body.curso_id //puxa variável nome, para capturar quando preencherem
          const aluno_id = req.body.aluno_id 
    
          if(!curso_id) { 
            return res.status(400).json({message:'O id do Curso é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
            }
            
            if(!aluno_id) {
              return res.status(400).json({message:'O id do aluno é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
            }  //poderia colocar if(!(curso_id && aluno_id)) e retornar uma mensagem...
   
   const alunoExistente = await Aluno.findByPk(aluno_id)
   const cursoExistente = await Curso.findByPk(curso_id)
if(!(alunoExistente && cursoExistente)) {
    return res.status(404).json({message: "O aluno e/ou o curso não existem"})
}
            const matricula = await Matricula.create({
            aluno_id: aluno_id,
            curso_id: curso_id //se o nome da varirável é o mesmo, pode só deixar curso_id
        })  
       res.status(201).json({name: 'Matrícula Criada!'})
      }
    catch (error) { //catch pega o que não é previsível.. mais fatal. Tem gente que inclui o previsível no catch também, mas daí tinha que fazer uns ajustes mais avançados.
        console.log(error.message) //retorna o erro aqui (mensagem técnica)
          res.status(500).json({error: 'Não foi possível cadastrar a matrícula.'})
    }
}


async listar(req,res) {
  try {  
    const matriculas = await Matricula.findAll()   //aqui, findAll() busca todos os alunos 
       res.status(200).json(matriculas)
      } catch (error) {
        console.error(`Erro ao tentar listar: ${error}`);
        return res.status(500).json({error: 'Erro interno do servidor'});
      }
}

async alterar(req,res) {
  try {
    const id = req.params.id;  // pode ser const { id} = req.params
    const matricula = await Matricula.findByPk(id)
    
    if(!matricula){
      console.error(`Erro ao buscar matricula: ${error}`);
      return res.status(404).json({error: 'Matrícula não encontrada.'})
    }
    matricula.update(req.body) //dados vêm do body. 
    await matricula.save()
    console.log("Alteração realizada com sucesso!")
    res.status(200).json(matricula)
  }
  catch (error) {
  console.log(error.message)
  res.status(500).json({ error: 'Não foi possível realizar a alteração.'})
  
  }
}

async deletar(req,res) {
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
}

}

module.exports = new MatriculaController()