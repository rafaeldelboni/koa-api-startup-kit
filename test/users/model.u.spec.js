const userModel = require('../../src/users/model')
const plainText = 'pass'
const cryptText = '$2a$06$/S0FLSPCz01ov4s4qeQ1qe5o0EYP0hT/tFlQ.HejoyFjC.4MtOfk2'

describe('unit', () => {
  describe('users', () => {
    describe('model', () => {
      it('compare valid bcrypt password', async function () {
        const validation = await userModel.checkCryptedPassword(
          plainText,
          cryptText
        )
        expect(validation).toBe(true)
      })
      it('compare invalid bcrypt password', async function () {
        const validation = await userModel.checkCryptedPassword(
          plainText,
          plainText
        )
        expect(validation).toBe(false)
      })
    })
  })
})
