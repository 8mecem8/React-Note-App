const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')



const userSchema =  mongoose.Schema({
  username:{
      type: String,
      required: true, 
      unique: true
  },
  name: {
      type: String,
      required: true, 
      unique: true
  },
  passwordHash: {
      type: String,
      required: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
})




userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)




const UserDb = mongoose.model('UserDb', userSchema)

module.exports = UserDb