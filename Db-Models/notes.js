const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const NoMold = mongoose.Schema({
    
    content:{
      type: String,
      minlength: 5,
      requred: true,
      unique: true
    }, 
    date: {
      type: Date,
      default: Date.now
    },
    important: {
      type: Boolean,
      requred: true
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
})




NoMold.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }})



NoMold.plugin(uniqueValidator)


const Pnote = mongoose.model('Notes', NoMold)

module.exports = Pnote
