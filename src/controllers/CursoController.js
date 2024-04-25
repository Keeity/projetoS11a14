const Curso = require("../models/Curso");
//const {Router} = require('express');

class CursoController {

    async cadastrar(req,res) {
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
    }

    async listar(req,res) {
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
    }

    async alterar(req,res) {
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
    }

    async alterarParcial(req,res) {
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
    }

    async deletar(req,res) {

        try{
            const { id } = req.params; // ou   const id = req.params.id  
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
    }


}

module.exports = new CursoController()