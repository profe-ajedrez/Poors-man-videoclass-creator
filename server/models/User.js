const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { stringify } = require('querystring')

const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  }
})

const User = (module.exports = mongoose.model('User', UserSchema))

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback)
}

module.exports.getUserByUsername = (username, callback) => {
  const query = { username }
  User.findOne(query, callback)
}

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (error, hash) => {
      if (error) {
        throw error
      }

      newUser.password = hash
      newUser.save(callback)
    })
  })
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, arePasswordMatching) => {
    if (err) {
      throw err
    }

    callback(null, arePasswordMatching)
  })
}


