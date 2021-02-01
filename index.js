const express = require("express")
const app = express()
const cors = require('cors')
const cool = require('cool-ascii-faces');
const mongoose = require('mongoose')
const Mroutes = require('./cont/Mroutes')
const URouter = require('./cont/users')
const Pnote = require ('./Db-Models/notes')
const UserDb = require('./Db-Models/user')
const loginRouter = require('./cont/login')

require('dotenv/config')



// Middlewares-------------------------------------------------------------------------

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use('/',Mroutes)
app.use('/users',URouter)
app.use('/login', loginRouter)

//-------------------------------------------------------------------------------------


let dbUrl = process.env.NODE_ENV === 'test' ? process.env.TESTR_DB_C : process.env.DB_C


//Database------------------------------------------------------------------------------


mongoose.connect(dbUrl,{ useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('Database is being connected'))

 

// Routes--------------------------------------------------------------------------------


// Error Handler Middlewares-------------------------------------------------------------


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }



  console.error(error.message)

  next(error)
}

app.use(errorHandler)






//-----------------------------------------------------------------------------------------

const PORT = process.env.PORT || 3003

app.listen(PORT, () => {console.log(`Server is running on port:${PORT}`)})

