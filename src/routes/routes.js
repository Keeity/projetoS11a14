const { Router } = require("express");
const alunosRoutes = require("./alunos.routes");
const cursosRoutes = require("./cursos.routes");
const loginRoutes = require("./login.routes");
const matriculaRoutes = require("./matricula.routes");
const professoresRoutes = require("./professores.routes");

const routes = Router()

//Se prevê assim, não precisa acrescentar /alunos lá em alunos
routes.use('/alunos', alunosRoutes) 
routes.use('/cursos', cursosRoutes)
routes.use('/login', loginRoutes)
routes.use('/matriculas', matriculaRoutes) 
routes.use('/professores', professoresRoutes)



module.exports = routes