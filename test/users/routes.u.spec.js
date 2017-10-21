let mockUser = { id: 123, name: 'test', password: 'teste' }

const mockLogAndThrow = jest.fn()
const ctx = {
  state: {
    token: 'token'
  },
  request: {
    body: mockUser
  },
  logAndThrow: mockLogAndThrow
}

const mockGetById = jest.fn()
const mockCreate = jest.fn()

jest.mock('../../src/users/model', () => {
  return {
    getById: mockGetById,
    create: mockCreate
  }
})

const mockLocal = jest.fn(() => jest.fn())
const mockJwt = jest.fn(() => jest.fn())
const mockSignJwt = jest.fn()

jest.mock('../../src/middlewares/auth', () => {
  return {
    local: mockLocal,
    jwt: mockJwt,
    signJwt: mockSignJwt
  }
})

const userRoutes = require('../../src/users/routes')

describe('unit', () => {
  describe('users', () => {
    describe('routes', () => {
      beforeEach(() => {
        ctx.body = null
        mockUser = { id: 123, name: 'test', password: 'teste' }
        mockGetById.mockReturnValue(mockUser)
        mockCreate.mockReturnValue({ user: mockUser })
        mockSignJwt.mockReturnValue('token')
        mockGetById.mockClear()
        mockCreate.mockClear()
        mockSignJwt.mockClear()
      })
      describe('postLogin', () => {
        it('should return ctx.token in body', async function () {
          await userRoutes.postLogin(ctx)
          expect(ctx.body).toEqual('token')
        })
      })
      describe('postSignup', () => {
        it('should return ctx.token in body', async function () {
          await userRoutes.postSignup(ctx)
          expect(ctx.body).toEqual('token')
          expect(mockCreate.mock.calls).toEqual([[mockUser]])
          expect(mockSignJwt.mock.calls).toEqual([[mockUser]])
        })
        it('should logAndThrow error', async function () {
          mockCreate.mockImplementation(async () => {
            throw new Error('Test error')
          })
          await userRoutes.postSignup(ctx)
          expect(mockLogAndThrow.mock.calls[0][0].message).toEqual('Test error')
        })
      })
      describe('getProfile', () => {
        it('should return user in body', async function () {
          ctx.state.user = { id: 123 }
          await userRoutes.getProfile(ctx)
          expect(ctx.body).toEqual(mockUser)
        })
        it('should logAndThrow error', async function () {
          mockGetById.mockImplementation(async () => {
            throw new Error('Test error')
          })
          await userRoutes.getProfile(ctx)
          expect(mockLogAndThrow.mock.calls[0][0].message).toEqual('Test error')
        })
      })
    })
  })
})
