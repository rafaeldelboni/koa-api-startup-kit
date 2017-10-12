const Joi = require('joi')
let bcrypt = require('bcrypt')

const saltRounds = 10

const schema = Joi.object().keys({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .required()
})

async function checkCryptedPassword (plainTextPassword, hashPassword) {
  return bcrypt.compare(plainTextPassword, hashPassword)
}

async function generateCryptedPassword (plainTextPassword) {
  return bcrypt.hash(plainTextPassword, saltRounds)
}

async function getByUsernamePassword (username, password) {
  if (username === 'rafael') {
    if (password === 'corgi') {
      return { id: 123, name: 'rafael' }
    } else {
      throw new Error('Wrong Password')
    }
  } else {
    throw new Error('User not found')
  }
}

async function getById (id) {
  if (id === 123) {
    return { id: 123, name: 'rafael' }
  } else {
    throw new Error('User not found')
  }
}

module.exports = {
  schema,
  checkCryptedPassword,
  generateCryptedPassword,
  getByUsernamePassword,
  getById
}
