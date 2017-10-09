process.env.JWT_SECRET = 'secret'

class MockedCtx {
  constructor (ctx = {}) {
    this.throw = jest.fn()
    this.state = {}
  }
}

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
          expect(ctx.throw).toHaveBeenCalledWith(401, error)
        })
        it('user not found error triggered', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = null
          const user = null

          await auth.generateJwt(ctx, next, error, user)
          expect(ctx.throw).toHaveBeenCalledWith(400, 'User not found.')
        })
        it('next called when no errors', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = null
          const user = { id: 1, name: 'user' }

          await auth.generateJwt(ctx, next, error, user)
          expect(ctx.state.token).toMatch(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
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
          expect(ctx.throw).toHaveBeenCalledWith(401, error)
        })
        it('user not found error triggered', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()
          const error = null
          const user = null

          await auth.validateJwt(ctx, next, error, user)
          expect(ctx.throw).toHaveBeenCalledWith(400, 'Invalid token.')
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
