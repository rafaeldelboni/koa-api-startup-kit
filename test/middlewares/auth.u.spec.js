process.env.APP_SECRET = 'secret'

class MockedCtx {
  constructor (ctx = {}) {
    this.logAndThrow = jest.fn()
    this.state = {}
  }
}

jest.mock('../../src/users/model', () => jest.fn())
const auth = require('../../src/middlewares/auth')

describe('unit', () => {
  describe('middlewares', () => {
    describe('auth', () => {
      describe('generateJwt', () => {
        it('inner error be proxied', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = 'error123'

          await auth.generateJwt(ctx, next, error, null)
          expect(ctx.logAndThrow).toHaveBeenCalledWith(error, 401)
        })
        it('user not found error triggered', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = null
          const user = null

          await auth.generateJwt(ctx, next, error, user)
          expect(ctx.logAndThrow).toHaveBeenCalledWith('User not found.', 400)
        })
        it('next called when no errors', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = null
          const user = { id: 1, name: 'user' }

          await auth.generateJwt(ctx, next, error, user)
          expect(ctx.state.token).toMatch(
            'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6InVzZXIifQ.QRNHzmI2IQZr_J60pt6zUrRjPlnxUt5N6FYYdaR8bXs'
          )
          expect(next).toHaveBeenCalledWith()
        })
      })
      describe('validateJwt', () => {
        it('inner error be proxied', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = 'error123'

          await auth.validateJwt(ctx, next, error, null)
          expect(ctx.logAndThrow).toHaveBeenCalledWith(error, 401)
        })
        it('user not found error triggered', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = null
          const user = null

          await auth.validateJwt(ctx, next, error, user)
          expect(ctx.logAndThrow).toHaveBeenCalledWith('Invalid token.', 400)
        })
        it('next called when no errors', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = null
          const user = { id: 1, name: 'user' }

          await auth.validateJwt(ctx, next, error, user)
          expect(next).toHaveBeenCalledWith()
        })
      })
    })
  })
})
