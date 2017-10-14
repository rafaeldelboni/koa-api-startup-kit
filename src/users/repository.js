const mockUser = {
  id: 123,
  first_name: 'Rafael',
  username: 'rafael',
  email: 'r@r.c',
  pass: ''
}

async function getByUsername (username) {
  return mockUser
}

async function getByEmail (email) {
  return mockUser
}

async function getById (id) {
  return mockUser
}

async function create (user) {
  return true
}

async function update (user) {
  return true
}

async function removeById (id) {
  return true
}

module.exports = {
  getByUsername,
  getByEmail,
  getById,
  create,
  update,
  removeById
}
