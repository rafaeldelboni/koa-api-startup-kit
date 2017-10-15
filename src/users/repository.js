const db = require('../database').pool()

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
}

async function getByEmail (email) {
  return db
    .select(COLUMNS)
    .from('users')
    .where('users.email', email)
}

async function getById (id) {
  return db
    .select(COLUMNS)
    .from('users')
    .where('users.id', id)
}

async function create (user) {
  return db
    .insert({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      created_at: Date.now(),
      updated_at: Date.now()
    })
    .table('users')
}

async function update (user) {
  return db
    .update({
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      email: user.email,
      password: user.password,
      updated_at: Date.now()
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
