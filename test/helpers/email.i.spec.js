jest.setTimeout(10000)

const dotenv = require('dotenv')
dotenv.config()

const email = require('../../src/helpers/email')

describe('integration', () => {
  describe('helpers', () => {
    describe('email', () => {
      it('it should send email', async function () {
        let mailOptions = {
          from: `"Sample Example" <${email.options.auth.user}>`,
          to: 'friend@example.com, coleague@example.com',
          subject: 'Hello is me!',
          text: 'Hello world?',
          html: '<b>Hello world?</b>'
        }
        let result = await email.sendMail(mailOptions)
        expect(result.response.includes('250')).toBe(true)
      })
    })
  })
})
