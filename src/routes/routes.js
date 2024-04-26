const { Router } = require("express");
const alunoRoutes = require("./aluno.routes");
const cursoRoutes = require("./curso.routes");
const loginRoutes = require("./login.routes");
const matriculaRoutes = require("./matricula.routes");
const professorRoutes = require("./professor.routes");

const routes = Router()

//Se previr assim, não precisa acrescentar /alunos lá em alunos
routes.use('/alunos', alunoRoutes) 
routes.use('/cursos', cursoRoutes)
routes.use('/login', loginRoutes)
routes.use('/matriculas', matriculaRoutes) 
routes.use('/professores', professorRoutes)



module.exports = routes