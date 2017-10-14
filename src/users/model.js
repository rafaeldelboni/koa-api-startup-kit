const Joi = require('joi')
const bcrypt = require('bcrypt')
const saltRounds = 10

const repository = require('./repository')

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
  const user = repository.getByUsername(username)
  if (!user) {
    throw new Error('User not found')
  }
  if (!checkCryptedPassword(password, user.password)) {
    throw new Error('Incorrect password')
  }
  return user
}

async function getById (id) {
  const user = repository.getById(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

async function getByUsername (username) {
  const user = repository.getByUsername(username)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

async function save (user) {
  await repository.create(user)
  return { status: 'ok' }
}

async function update (user) {
  await repository.update(user)
  return { status: 'ok' }
}

async function removeById (id) {
  await repository.removeById(id)
  return { status: 'ok' }
}

module.exports = {
  schema,
  checkCryptedPassword,
  generateCryptedPassword,
  getByUsernamePassword,
  getByUsername,
  getById,
  save,
  update,
  removeById
}
