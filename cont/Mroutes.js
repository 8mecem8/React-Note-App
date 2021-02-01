const Router = require('express').Router()
const Pnote = require('../Db-Models/notes')
const cool = require('cool-ascii-faces')
const UserDb = require('../Db-Models/user')
const jwt = require('jsonwebtoken')
require('dotenv/config')



//------------------------------------------------------------


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}



//------------------------------------------------------------






Router.get('/cool', (req, res) => res.send(cool()))

Router.get('/', (req, res, next) => {res.send('<h1>----This is a test Express Server----</h1><br/><h2>You can check other sub-directories</h2> <br/> <ul> <li>/cool </li> <li>/notes </li> <li>/notes/ any id </li></ul>')})

Router.get('/notes/:id', (req, res, next) => {let rId = req.params.id; Pnote.findById(rId).then(re => {
    
    if(re) {
      res.json(re)}
      else {
        res.status(404).end()
      }
  }).catch(error => next(error))
 // let rId = +req.params.id; let note = notes.find(at => at.id === rId); if(note) {res.json(note)} else{res.status(404).end()}
})



Router.get('/notes', (req, res, next) => {
  
  Pnote.find({})
  .then(re => res.status(200).json(re))
  .catch(error => next(error))

})





Router.delete('/notes/:id', (req, res, next) => {let rId = req.params.id;Pnote.findByIdAndDelete(rId).then(re => res.status(204).end()).catch(err => next(err))
//  notes = notes.filter(at => at.id !== rId); res.status(204).end()
})





Router.post('/notes', async (req, res, next) => {


       if (req.body.content === undefined) {
       return res.status(400).json({ error: 'content missing' })
        }


    try {

   
const token = getTokenFrom(req)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }


  const user = await UserDb.findById(decodedToken.id)

console.log(user)


const note = new Pnote ({
  content : req.body.content,
  date : new Date(),
  important: req.body.important === undefined ? false : req.body.important,
  user: user.id
})

const SavedNote = await note.save()
user.notes = await user.notes.concat(SavedNote._id)
await user.save()

res.status(200).json(SavedNote)




}
catch(err) {next(err)}



  /*let maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0


  if(!req.body.content){res.status(404).json({error : 'content missing'})}

  let note = {
    id: maxId + 1,
    content: req.body.content,
    important: req.body.important ,
    date: new Date(),

  }


  notes = notes.concat(note)

  res.json(note)
  console.log('New added note is:', note)
  
  
  
  
  
    const Userİnfo = await UserDb.findById(req.body.userİd)


if (Userİnfo === null) {
    return res.status(400).json({ error: 'user_id missing' })
  }

console.log('userinfo is ======',Userİnfo)


  
  
  
  
  
  
  
  
  */
})




Router.put('/notes/:id', (req, res, next) => {
  

  const note = {
    content: req.body.content,
    important: req.body.important,
  }

  Pnote.findByIdAndUpdate(req.params.id,note, { new: true })
    .then(re => {
      res.json(re)
    })
    .catch(error => next(error))
})





module.exports = Router