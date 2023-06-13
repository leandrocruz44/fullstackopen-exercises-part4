const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URL)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB ', error.message)
  })

app.use(cors())
app.use(express.json())
morgan.token('content', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app