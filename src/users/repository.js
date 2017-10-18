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
  return db
    .insert({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      created_at: new Date().toUTCString(),
      updated_at: new Date().toUTCString()
    })
    .table('users')
    .returning(COLUMNS)
}

async function update (user) {
  return db
    .update({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      updated_at: new Date().toUTCString()
    })
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
