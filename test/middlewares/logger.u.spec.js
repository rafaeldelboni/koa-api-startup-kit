class MockedCtx {
  constructor (ctx = {}) {
    this.throw = jest.fn()
    this.state = {}
  }
}

jest.mock('winston', () => {
  return {
    transports: { Console: jest.fn() },
    createLogger: jest.fn(() => {
      return { error: jest.fn() }
    })
  }
})

jest.mock('koa2-winston', () => {
  return { logger: jest.fn(() => jest.fn((ctx, next) => next())) }
})

const logger = require('../../src/middlewares/logger')

describe('unit', () => {
  describe('middlewares', () => {
    describe('logger', () => {
      describe('logAndThrow', () => {
        it('fn be called', async function () {
          const next = jest.fn()
          const ctx = new MockedCtx()

          logger()(ctx, next)
          ctx.logAndThrow('test', 404)
          expect(ctx.throw).toHaveBeenCalledWith(404, 'test', { expose: true })
        })
      })
    })
  })
})
