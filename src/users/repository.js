const mockUser = { id: 123, name: 'Rafael', pass: '' }

async function getByUsername (username) {
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
  getById,
  create,
  update,
  removeById
}
