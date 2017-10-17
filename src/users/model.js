const Joi = require('joi')
const bcrypt = require('bcrypt')
const saltRounds = 10

const repository = require('./repository')

const schema = Joi.object().keys({
  first_name: Joi.string(),
  last_name: Joi.string(),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .required()
})

function isEmail (usernameOrEmail) {
  return Joi.validate(
    usernameOrEmail,
    Joi.string().email(),
    (err, value) => err === null
  )
}

async function checkCryptedPassword (plainTextPassword, hashPassword) {
  return bcrypt.compare(plainTextPassword, hashPassword)
}

async function generateCryptedPassword (plainTextPassword) {
  return bcrypt.hash(plainTextPassword, saltRounds)
}

async function getById (id) {
  const user = await repository.getById(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

async function getByEmail (username) {
  const user = await repository.getByEmail(username)
  if (!user) {
    throw new Error('Email not found')
  }
  return user
}

async function getByUsername (username) {
  const user = await repository.getByUsername(username)
  if (!user) {
    throw new Error('Username not found')
  }
  return user
}

async function getByUsernameOrEmailAndPassword (usernameOrEmail, password) {
  const user = isEmail(usernameOrEmail)
    ? await getByEmail(usernameOrEmail)
    : await getByUsername(usernameOrEmail)

  if (!await checkCryptedPassword(password, user.password)) {
    throw new Error('Incorrect password')
  }
  return user
}

async function create (user) {
  if (await repository.getByEmail(user.email)) {
    throw new Error('Email already exists')
  }
  if (await repository.getByUsername(user.username)) {
    throw new Error('Username already exists')
  }
  user.password = await generateCryptedPassword(user.password)
  await repository.create(user)
  return { status: 'ok' }
}

async function update (user) {
  await getById(user.id)
  await repository.update(user)
  return { status: 'ok' }
}

async function removeById (id) {
  await getById(id)
  await repository.removeById(id)
  return { status: 'ok' }
}

module.exports = {
  schema,
  checkCryptedPassword,
  generateCryptedPassword,
  getById,
  getByEmail,
  getByUsername,
  getByUsernameOrEmailAndPassword,
  create,
  update,
  removeById
}
