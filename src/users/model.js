async function getByUsernamePassword (username, password) {
  if (username === 'rafael') {
    if (password === 'corgi') {
      return { id: 123 }
    } else {
      throw new Error('Wrong Password')
    }
  } else {
    throw new Error('User not found')
  }
}

module.exports = {
  getByUsernamePassword
}
