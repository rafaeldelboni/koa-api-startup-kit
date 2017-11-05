const Joi = require('joi')
const moment = require('moment')
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4')

const saltRounds = parseInt(process.env.APP_SALT_ROUNDS)

const repository = require('./repository')

const schemaLogin = Joi.object().keys({
  username: Joi.alternatives([
    Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
    Joi.string()
      .email()
      .required()
  ]).required(),
  password: Joi.string().required()
})

const schemaSignup = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
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
    .max(25)
    .required(),
  passwordConfirm: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .options({
      language: {
        any: {
          allowOnly: 'Passwords must be the same'
        }
      }
    })
    .strip()
})

const schemaUpdate = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .optional(),
  lastName: Joi.string()
    .required()
    .optional(),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .optional(),
  email: Joi.string()
    .email()
    .required()
    .optional()
})

const removeSensitiveData = user => {
  delete user.password
  delete user.passwordResetToken
  delete user.passwordResetExpires
  return user
}

const isEmail = usernameOrEmail =>
  Joi.validate(
    usernameOrEmail,
    Joi.string().email(),
    (err, value) => err === null
  )

const checkCryptedPassword = (plainTextPassword, hashPassword) =>
  bcrypt.compare(plainTextPassword, hashPassword)

const generateCryptedPassword = plainTextPassword =>
  bcrypt.hash(plainTextPassword, saltRounds)

async function getById (id) {
  const user = await repository.getById(id)
  if (!user) {
    throw new Error('User not found')
  }

  return removeSensitiveData(user)
}

async function getByEmail (username) {
  const user = await repository.getByEmail(username)

  if (!user) {
    throw new Error('Email not found')
  }

  return removeSensitiveData(user)
}

async function getByUsername (username) {
  const user = await repository.getByUsername(username)

  if (!user) {
    throw new Error('Username not found')
  }

  return removeSensitiveData(user)
}

async function getByUsernameOrEmailAndPassword (usernameOrEmail, password) {
  const user = isEmail(usernameOrEmail)
    ? await repository.getByEmail(usernameOrEmail)
    : await repository.getByUsername(usernameOrEmail)

  if (!user) {
    throw new Error('User not found')
  }

  if (!await checkCryptedPassword(password, user.password)) {
    throw new Error('Incorrect password')
  }

  return removeSensitiveData(user)
}

async function getByEmailAndPasswordResetToken (email, token) {
  const user = await repository.getByEmail(email)

  if (!user) {
    throw new Error('Email not found')
  } else if (
    user.passwordResetToken !== token ||
    user.passwordResetExpires < moment().format()
  ) {
    throw new Error('Invalid or Expired token')
  }

  return removeSensitiveData(user)
}

async function create (user) {
  if (await repository.getByEmail(user.email)) {
    throw new Error('Email already exists')
  }
  if (await repository.getByUsername(user.username)) {
    throw new Error('Username already exists')
  }

  user.password = await generateCryptedPassword(user.password)

  const created = await repository.create(user)
  return {
    status: 'ok',
    user: removeSensitiveData(created[0])
  }
}

async function update (user) {
  await getById(user.id)

  if (user.email) {
    const existingUser = await repository.getByEmail(user.email)
    if (existingUser && existingUser.id !== user.id) {
      throw new Error('Email already exists')
    }
  }

  if (user.username) {
    const existingUser = await repository.getByUsername(user.username)
    if (existingUser && existingUser.id !== user.id) {
      throw new Error('Username already exists')
    }
  }

  if (user.password) {
    user.password = await generateCryptedPassword(user.password)
  }

  await repository.update(user)

  return { status: 'ok' }
}

async function updatePasswordResetToken (email) {
  const existingUser = await getByEmail(email)

  const user = {
    id: existingUser.id,
    passwordResetToken: uuidv4(),
    passwordResetExpires: moment()
      .add(1, 'hour')
      .format()
  }
  await repository.update(user)

  return {
    status: 'ok',
    token: user.passwordResetToken,
    expires: user.passwordResetExpires
  }
}

async function updatePasswordReset (email, token, password) {
  const existingUser = await getByEmailAndPasswordResetToken(email, token)

  const user = {
    id: existingUser.id,
    password,
    passwordResetToken: null,
    passwordResetExpires: null
  }
  await repository.update(user)

  return { status: 'ok' }
}

async function removeById (id) {
  await getById(id)
  await repository.removeById(id)

  return { status: 'ok' }
}

module.exports = {
  schemaLogin,
  schemaSignup,
  schemaUpdate,
  checkCryptedPassword,
  generateCryptedPassword,
  getById,
  getByEmail,
  getByUsername,
  getByUsernameOrEmailAndPassword,
  getByEmailAndPasswordResetToken,
  create,
  update,
  updatePasswordResetToken,
  updatePasswordReset,
  removeById
}
