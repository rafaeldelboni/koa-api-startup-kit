const snakeCase = require('snakecase-keys')
const moment = require('moment')
const db = require('../database')

const COLUMNS = [
  'users.id',
  'users.first_name as firstName',
  'users.last_name as lastName',
  'users.username',
  'users.email',
  'users.password',
  'users.password_reset_token as passwordResetToken',
  'users.password_reset_expires as passwordResetExpires'
]

async function getByUsername (username) {
  return db
    .select(COLUMNS)
    .from('users')
    .where('users.username', username)
    .first()
}

async function getByEmail (email) {
  return db
    .select(COLUMNS)
    .from('users')
    .where('users.email', email)
    .first()
}

async function getById (id) {
  return db
    .select(COLUMNS)
    .from('users')
    .where('users.id', id)
    .first()
}

async function create (user) {
  delete user.passwordConfirm

  user.createdAt = moment().format()
  user.updatedAt = moment().format()

  return db
    .insert(snakeCase(user))
    .table('users')
    .returning(COLUMNS)
}

async function update (user) {
  delete user.passwordConfirm

  user.updatedAt = moment().format()

  return db
    .update(snakeCase(user))
    .table('users')
    .where('users.id', user.id)
    .returning(COLUMNS)
}

async function removeById (id) {
  return db
    .del()
    .table('users')
    .where('users.id', id)
}

module.exports = {
  getByUsername,
  getByEmail,
  getById,
  create,
  update,
  removeById
}
