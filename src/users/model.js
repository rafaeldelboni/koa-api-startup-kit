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
  getByUsernamePassword,
  getById
}