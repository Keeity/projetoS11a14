//routes.js  vai concentrar todas as rotas (ednpoints)

//disponibiliza o kit inicial para desenvolver o backend. Importa a função chamada "Router" (letra maiscula) lá da biblioteca express
//Router permite criar as rotas
const {Router} = require('express');
//const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.

const Curso = require('../models/Curso');

//const { sign }  = require ('jsonwebtoken')
 const cursosRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
//const { secret } = require('../config/database.config');
const { auth } = require('../middleware/auth');


/* _____________ CURSOS  _______________ */

//cria curso
cursosRoutes.post('/', auth, async (req,res) => {
try{
    const nome = req.body.nome //puxa variável nome, para capturar quando preencherem
      const duracao_horas = req.body.duracao_horas 
      const professor_id = req.body.professor_id

      if(!nome) { //!nome é o mesmo que nome === . se quisesse incluir outro, colocaria ||
        return res.status(400).json({message:'O nome do curso é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
        }
        
     //   if(duracao_horas < 1 || duracao_horas > 500) {
if (!(duracao_horas >= 1 && duracao_horas <=500)) { //mais prático assim quando as validações começam a ser mais complexas...
          return res.status(400).json({message:'A duração do curso é obrigatória, entre 1 e 500h.'}) //return - encerra o código por aí mesmo . 400 é bad request
}
    const curso = await Curso.create({
        nome: nome,
        duracao_horas: duracao_horas,
        professor_id: professor_id
    })  
   res.status(201).json({name: 'Curso Criado!'}) //ou  res.json(cursoaluno)
  }
  catch (error) { //catch pega o que não é previsível.. mais fatal. Tem gente que inclui o previsível no catch também, mas daí tinha que fazer uns ajustes mais avançados.
      console.log(error.message) //retorna o erro aqui (mensagem técnica)
        res.status(500).json({error: 'Não foi possível cadastrar o curso.'})
  }
})   

//lista cursos
//cursosRoutes.get('/cursos', async (req,res) => {// async await é para cada função
  //  const cursos = await Curso.findAll()   //aqui, findAll() busca todos os alunos
  //   res.status(201).json(cursos)
  //  })
  

//filtra cursos por parte do nome e validação maiúsculas ou LISTA CURSOS

cursosRoutes.get('/', async (req, res) => {
  try {
    let params = {}; //começa vazio
    if(req.query.nome) {
      params = {...params, nome: { [Op.iLike]: '%' + req.query.nome + '%' }} //ilike ignora maiuscula/minuscula. Os ... significam que ele cria uma cópia (... params) com chaves e valores já existentes. essa linha significa params =  
    }
    if(req.query.duracao_horas) {
      params = {...params, duracao_horas: { [Op.iLike]: '%' + req.query.duracao_horas + '%' }} //ilike ignora maiuscula/minuscula
    }
    const cursos = await Curso.findAll({ where: params });

    if(cursos.length > 0)  {
     // console.log(`Listando ${req.query.nome ? 'apenas os cursos filtrados a partir de ' + req.query.nome : 'todos os cursos'}`); //expressão ternária que substitui if else - Se req.query.nome for verdadeiro, retorna 'apenas os professores filtrados a partir de ' + req.query.nome. Caso contrário, retorna 'todos os professores'.
     `Listando ${req.query.nome ? 'apenas os cursos filtrados a partir de ' + req.query.nome : 'todos os cursos'} ${req.query.duracao ? 'com duração de ' + req.query.duracao : ''}` //assim traz também duração
     return res.status(200).json(cursos);
    } else {
      console.log(`Nenhum curso encontrado com o parâmetro fornecido (${req.query.nome}).`);
      return res.status(404).json({error: 'Nenhum curso encontrado'});
    }
  } catch (error) {
    console.error(`Erro ao buscar cursos: ${error}`);
    return res.status(500).json({error: 'Erro interno do servidor'});
  }
});

//PUT - altera curso por id - forma 1

cursosRoutes.put('/:id', async (req,res) => {
  try {
  const id = req.params.id;  // pode ser const { id} = req.params
  const curso = await Curso.findByPk(id)
  
  if(!curso){
    console.error(`Erro ao buscar cursos: ${error}`);
    return res.status(404).json({error: 'Curso não encontrado.'})
  }
  curso.update(req.body) //dados vêm do body. 
  await curso.save()
  console.log("Alteração realizada com sucesso!")
  res.status(200).json(curso)
}
catch (error) {
console.log(error.message)
res.status(500).json({ error: 'Não foi possível realizar a alteração.'})

}
})

 

// Atualização parcial de um Curso - professor
cursosRoutes.patch('/:id', auth, async (req, res) => {
try {
  const  id = req.params.id;
const professor_id = req.body.professor_id;
 const curso = await Curso.findByPk(id)

  if (!curso) {
return  res.status(404).json({ error: 'Curso não encontrado.'})
  }
//curso.update(req.body);     . O método .update() é útil quando você quer atualizar vários campos de uma vez a partir de um objeto
curso.professor_id = professor_id;
await curso.save()
console.log("Alteração realizada com sucesso!")
res.status(200).json({ message: `Curso id ${id} teve o professor alterado para Professor ID ${professor_id} com sucesso!`});
} catch (error) {
  console.error(`Erro ao tentar atualizar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
});



  //deleta cursos POR ID route params
  cursosRoutes.delete('/:id', (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
try {
    const id = req.params.id    //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
Curso.destroy({
  where: { id: id //aqui, pode colocar onde começa em x...
  }
}) //ele deleta usando sequelize.

res.status(204)//.json({message: `Curso ID ${id} deletado com sucesso!`}) //em delete, se coloca 204 (padrão), ele não retorna nada. Mesmo que inclua mensagem aqui. Se quiser retornar mensagem, altera para 200
} catch (error) {
  console.error(`Erro ao tentar excluir: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
} 
})  


//deleta cursos  com validação prévia

cursosRoutes.delete('/:id', async (req,res) => {
try{
  const { id } = req.params;
const curso = await Curso.findByPk(id);
if (!curso) {
  return res.status(404).json({ error: 'Curso não encontrado.'})
}
await curso.destroy();
return res.status(204).json({})
} catch (error) {
  console.error(`Erro ao tentar deletar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
})


module.exports = cursosRoutes  //exporta 
// é o mesmo que: export default routes