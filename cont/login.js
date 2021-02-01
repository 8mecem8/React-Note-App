const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const UserDb = require('../Db-Models/user')
require('dotenv/config')

loginRouter.post('/', async (req, res, next) => {
  
try{
  const user = await UserDb.findOne({ username: req.body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(req.body.password, user.passwordHash)

  console.log('User in login =====',user)
  console.log('passwordC in login =====',passwordCorrect)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })

    }
    catch(err){next(err)}
})




module.exports = loginRouter