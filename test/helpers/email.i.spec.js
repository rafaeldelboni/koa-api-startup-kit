jest.setTimeout(10000)

const dotenv = require('dotenv')
dotenv.config()

const email = require('../../src/helpers/email')

describe('integration', () => {
  describe('helpers', () => {
    describe('email', () => {
      it('should send email directly', async function () {
        let mailOptions = {
          from: `"Sample Example" <${email.transport.options.auth.user}>`,
          to: 'friend@example.com, coleague@example.com',
          subject: 'Hello is me!',
          text: 'Hello world?',
          html: '<b>Hello world?</b>'
        }
        let result = await email.transport.sendMail(mailOptions)
        expect(result.response.includes('250')).toBe(true)
      })
      it('should send email via helper send', async function () {
        const result = await email.send({
          to: 'send@helper.cc',
          subject: 'Helper test',
          template: 'test-helper',
          data: {}
        })
        expect(result.response.includes('250')).toBe(true)
      })
    })
  })
})
