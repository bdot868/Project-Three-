//User Model
const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  List = require('../models/List.js'),
  userSchema = new mongoose.Schema({
    local: {
      firstname: String,
      lastname: String,
      email: String,
      password: String,
    },
    facebook: {
      id: String,
      token: String,
      email: String,
      name: String,
      username: String,
    },
    isAdmin: {type: Boolean, default: false},
    lists: [{type: mongoose.Schema.Types.ObjectId, ref: 'List'}]

  })

  userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
  }

  module.exports = mongoose.model('User', userSchema)
