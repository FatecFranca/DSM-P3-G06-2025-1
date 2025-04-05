import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/users', usersRouter)

//////////////////////////////////////////////////////////////Rotas

import EmpresasRouter from './routes/empresas.js'
import VagasRouter from './routes/vagas.js'
import AlunoRouter from './routes/alunos.js'
import PlanosRouter from './routes/planos.js'
import CursosRouter from './routes/cursos.js'
import ProfessoresRouter from './routes/professores.js'

app.use('/empresas', EmpresasRouter)
app.use('/vagas', VagasRouter)
app.use('/alunos', AlunoRouter)
app.use('/planos', PlanosRouter)
app.use('/cursos', CursosRouter)
app.use('/professores', ProfessoresRouter)

//////////////////////////////////////////////////////////////


export default app
