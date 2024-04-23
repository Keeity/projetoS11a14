const {Router} = require('express');
const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.

const Professor = require('../models/Professor');

 const professoresRoutes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 

const { auth } = require('../middleware/auth');


/* _____________ PROFESSORES  _______________ */        

//cadastrar professor
professoresRoutes.post('/', async (req,res) => { 
  try {
    const nome = req.body.nome //puxa variável nome, para capturar quando preencherem
      const area_atuacao = req.body.area_atuacao
      const celular = req.body.celular
if(!(nome && nome.length >= 8)) { 
return res.status(400).json({message:'O nome completo é obrigatório!'}) //return - encerra o código por aí mesmo . 400 é bad request
}
  if(!celular) {
    return res.status(400).json({message:'A inclusão de celular é obrigatória!'})
  }
 const professor = await Professor.create({ 
       nome: nome,
       area_atuacao: area_atuacao,
        celular: celular
}) 
console.log(`Professor Criado: ${nome}!`)
res.status(201).json(professor)
} catch (error) { 
console.log(error.message) //retorna o erro aqui (mensagem técnica)
 res.status(500).json({error: 'Não foi possível cadastrar o professor'})
}
  })   



//filtra professores por parte do nome e validação maiúsculas ou LISTA professores se não indicar filtro

professoresRoutes.get('/', async (req, res) => {
  try {
    let params = {};
    if(req.query.nome) {
      params = {...params, nome: { [Op.iLike]: '%' + req.query.nome + '%' }} //ilike ignora maiuscula/minuscula
    }
    const professores = await Professor.findAll({ where: params });

    if(professores.length > 0)  {
      console.log(`Listando ${req.query.nome ? 'apenas os professores filtrados a partir de ' + req.query.nome : 'todos os professores'}`); //expressão ternária que substitui if else - Se req.query.nome for verdadeiro, retorna 'apenas os professores filtrados a partir de ' + req.query.nome. Caso contrário, retorna 'todos os professores'.
      return res.status(200).json(professores);
    } else {
      console.log(`Nenhum professor encontrado com o parâmetro fornecido (${req.query.nome}).`);
      return res.status(404).json({error: 'Nenhum professor encontrado'});
    }
  } catch (error) {
    console.error(`Erro ao buscar professores: ${error}`);
    return res.status(500).json({error: 'Erro interno do servidor'});
  }
});

//PUT - altera professor por id (todos os campos)
professoresRoutes.put('/:id', async (req,res) => {
try {
  const id = req.params.id;
const professor = await Professor.findByPk(id)

if(!professor){
  return res.status(404).json({error: 'Professor não encontrado.'})
}
professor.update(req.body)
await professor.save()
console.log("Alteração realizada com sucesso!")
res.status(200).json(professor)
} catch (error) {
  console.error(`Erro ao tentar atualizar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
})


// Atualização parcial de um professor - celular
professoresRoutes.patch('/:id', async (req, res) => {
try {
    const  id = req.params.id;
const celular = req.body.celular;
 const professor = await Professor.findByPk(id)

  if (!professor) {
return  res.status(404).json({ error: 'Professor não encontrado.'})
  }
//curso.update(req.body);     . O método .update() é útil quando você quer atualizar vários campos de uma vez a partir de um objeto
professor.celular = celular;
await professor.save()
console.log("Alteração realizada com sucesso!")
res.status(200).json({ message: `Professor id ${id} teve o celular alterado para ${celular} com sucesso!`});
} catch (error) {
  console.error(`Erro ao tentar atualizar: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
});


//deleta professor por id - com validação
  professoresRoutes.delete('/:id', async (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
 try {
     const { id } = req.params;   //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
   const professor = await Professor.findByPk(id);
   if(!professor) {
    return res.status(404).json({error:`Professor ID ${id} não encontrado.`})
     }
   await professor.destroy() //ele deleta usando sequelize.
    
    res.status(204).json({message: `Professor ID ${id} deletado com sucesso!`}) //na verdade, 204 não retorna nada. Assim, mesmo que tenha colocado assim, não vai aparecer nada no postman!!!
  } catch (error) {
    console.error(`Erro ao tentar excluir: ${error}`);
    return res.status(500).json({error: 'Erro interno do servidor'});
  }
  })  

module.exports = professoresRoutes  //exporta 
// é o mesmo que: export default routes