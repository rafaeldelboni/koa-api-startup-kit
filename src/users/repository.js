const snakeCase = require('snakecase-keys')
const db = require('../database')

const COLUMNS = [
  'users.id',
  'users.first_name as firstName',
  'users.last_name as lastName',
  'users.username',
  'users.email',
  'users.password'
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

  user.created_at = new Date().toUTCString()
  user.updated_at = new Date().toUTCString()

  return db
    .insert(snakeCase(user))
    .table('users')
    .returning(COLUMNS)
}

async function update (user) {
  delete user.passwordConfirm

  user.updated_at = new Date().toUTCString()

  return db
    .update(snakeCase(user))
    .table('users')
    .where('users.id', user.id)
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
