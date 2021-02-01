const URouter = require('express').Router()
const bcrypt = require('bcrypt')
const UserDb = require('../Db-Models/user')
const Pnote = require('../Db-Models/notes')



URouter.get('/', async (request, response, next) => {
  const users = await UserDb.find({}).populate('UserDb')
    
  response.json(users)
})



URouter.post('/', async (req, res, next) => {


 try{

    const passwordHash = await bcrypt.hash(req.body.password, 10)

    const Cuser = new UserDb({

            username : req.body.username,
            name : req.body.name,
            passwordHash,
    })

    const savedUser = await Cuser.save()
    res.status(200).json(savedUser)

    }
catch(err){

    next(err)

}

})











module.exports = URouter