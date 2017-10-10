let Joi = require('joi')
let validator = require('../../src/middlewares/koa-joi')
const schema = Joi.object().keys({
  username: Joi.string()
    .email()
    .required()
})

describe('unit', () => {
  describe('middlewares', () => {
    describe('koa-joi', () => {
      let validate
      let ctx = {}
      const next = jest.fn()
      let expectedError = [
        {
          context: {
            key: 'username',
            label: 'username',
            value: 'is not a email'
          },
          message: '"username" must be a valid email',
          path: ['username'],
          type: 'string.email'
        }
      ]

      beforeEach(() => {
        validate = validator(schema)
        ctx = {
          request: {
            body: { username: 'is not a email' }
          },
          throw: jest.fn()
        }
      })

      it('should be a function', () => {
        expect(typeof validator).toBe('function')
      })

      it('should validate wrong input body with `Invalid input` body error text', async () => {
        await validate(ctx)
        expect(ctx.throw).toHaveBeenCalledWith(500, expectedError)
      })

      it('should validate correct input calling next middleware', async () => {
        ctx.request.body.username = 'r.delboni@deskbookers.com'
        await validate(ctx, next)
        expect(ctx.throw.mock.calls.length).toBe(0)
        expect(next).toBeCalled()
      })
    })
  })
})
