//routes.js  vai concentrar todas as rotas (ednpoints)

//disponibiliza o kit inicial para desenvolver o backend. Importa a função chamada "Router" (letra maiscula) lá da biblioteca express
//Router permite criar as rotas
const {Router} = require('express');
const { Op } = require("sequelize"); //Op é importado do sequelize .  Op é usado na definição da rota para especificar o operador de consulta do Sequelize.
const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const Matricula = require('../models/Matricula');
const Professor = require('../models/Professor');
const { sign }  = require ('jsonwebtoken')
 const routes = new Router; //Router é uma classe no javascript. Atribui a uma variável (aqui é a routes). 
const { secret } = require('../config/database.config');
const { auth } = require('../middleware/auth');

//criar a primeira rota.existem 4 tipos de rotas: GET, POST, PUT, DELETE,// 1o) define o tipo de rota; 2o) define o path ('/')
routes.get('/bem_vindo', (req,res) => {
try {
  res.json({name:"Bem vindo!"})
} catch (error) {
  console.error(`Erro ao tentar abrir: ${error}`);
  return res.status(500).json({error: 'Erro interno do servidor'});
}
})

/* _____________ ROTAS DE LOGIN  _______________ */
 

routes.post('/login', async (req, res) => {
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

/* _____________ ALUNOS  _______________ */

//cadastrar aluno na tabela de banco de dados
routes.post('/alunos', async (req,res) => { //coloca o async na frente da função que vai ser executada completamente antes 

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





//filtra alunos por parte do nome e validação maiúsculas ou LISTA alunos se não indicar filtro

//eu fiz abaixo. copilot fez o da sequencia

// routes.get('/alunos', async (req, res) => {
//   let params = {}
//   if(!req.query.nome) {
//     const alunos = await Aluno.findAll()   //aqui, findAll() busca todos os alunos
//       //   res.status(201).json(cursos)
//       //  })
//       console.log(`Listando todos os alunos`)
//       return res.status(201).json(alunos)
//     }

//   params = {...params, nome: { [Op.iLike]: '%' + req.query.nome + '%' }} //ilike ignora maiuscula/minuscula
//  const alunos = await Aluno.findAll({
//       where: params
// })
// if(req.query.nome && !(alunos==""))  {
// console.log(`Listando apenas os alunos filtrados a partir de ${req.query.nome}`)
// return res.status(201).json(alunos)
// }

// console.log(`O parâmetro fornecido (${req.query.nome}) é inválido.`)
// return res.status(404).json({error: 'Parâmetro inválido'})

// })

//filtrar aluno por id route params

routes.get('/alunos/:id', auth, async (req, res) => {
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
routes.get('/alunos', auth, async (req, res) => {
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

routes.put('/alunos/:id', auth, async (req,res) => {

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

routes.put('/alunos/alterarsenha', auth, async (req,res) => {

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
routes.patch('/alunos/:id', auth, async (req, res) => {
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
  routes.delete('/alunos/:id', auth, async (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
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
  routes.delete('/alunos/:id', auth, (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
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
    
/* _____________ CURSOS  _______________ */

//cria curso
routes.post('/cursos', auth, async (req,res) => {
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
//routes.get('/cursos', async (req,res) => {// async await é para cada função
  //  const cursos = await Curso.findAll()   //aqui, findAll() busca todos os alunos
  //   res.status(201).json(cursos)
  //  })
  

//filtra cursos por parte do nome e validação maiúsculas ou LISTA CURSOS

routes.get('/cursos', async (req, res) => {
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

routes.put('/cursos/:id', async (req,res) => {
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



// //PUT - altera curso por id - forma 2

// routes.put('/cursos/:id', async (req,res) => {
//   const id = req.params.id;
// const data = req.body;
// try{
//   const [curso] = await Curso.update(
// data, { where: { id : id }}
//   );
  
//   if(!curso){
//     return res.status(404).json({error: 'Curso não encontrado.'})
//   }
//    console.log("Alteração realizada com sucesso!")
//   res.status(200).json({message: `ID ${id} atualizado!`})
// }
// catch (error) {
//   console.error("Erro ao atualizar:", error)
//   res.status(500).json({error: 'Erro ao atualizar o curso.'})
// } 
// });
  

// Atualização parcial de um Curso - professor
routes.patch('/cursos/:id', auth, async (req, res) => {
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
  routes.delete('/cursos/:id', (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
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

routes.delete('/cursos/:id', async (req,res) => {
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

/* _____________ MATRICULAS  _______________ */

    //cria matricula
routes.post('/matriculas', async (req,res) => {
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
routes.get('/matriculas', async (req,res) => {// async await é para cada função
  try {  
  const matriculas = await Matricula.findAll()   //aqui, findAll() busca todos os alunos
     res.status(200).json(matriculas)
    } catch (error) {
      console.error(`Erro ao tentar listar: ${error}`);
      return res.status(500).json({error: 'Erro interno do servidor'});
    }
    })

//        deleta por ID  valida se existe

routes.delete('/matriculas/:id', async (req,res) => {   //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
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
    routes.delete('/matriculas/:id', (req,res) => {   const id = req.params.id    //o que se coloca depois dos : (ex: /:id) é o que usa depois do params.
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

/* _____________ PROFESSORES  _______________ */        

//cadastrar professor
routes.post('/professores', async (req,res) => { 
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

routes.get('/professores', async (req, res) => {
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
routes.put('/professores/:id', async (req,res) => {
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
routes.patch('/professores/:id', async (req, res) => {
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
  routes.delete('/professores/:id', async (req,res) => { //deletar pela rota. Vai deletar o que estiver /cursos/3
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

module.exports = routes  //exporta 
// é o mesmo que: export default routes