jest.setTimeout(10000)

const dotenv = require('dotenv')
dotenv.config()

process.env.APP_NAME = 'your-super-app-name'

const mockTemplate = jest.fn(() => '<p><b>App Name</b> User Name</p>')
jest.mock('../../src/helpers/template', () => {
  return mockTemplate
})

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
          layout: 'test-helper',
          data: { user: { name: 'userName' } }
        })
        expect(result.response.includes('250')).toBe(true)
      })
    })
  })
})
