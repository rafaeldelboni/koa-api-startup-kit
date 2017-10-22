let mockUser = { id: 123, name: 'test', password: 'teste' }

const mockStatus = { status: 'ok' }
const mockLogAndThrow = jest.fn()
const ctx = {
  state: {
    token: 'token'
  },
  request: {
    body: mockUser
  },
  params: {},
  logAndThrow: mockLogAndThrow
}

const mockGetById = jest.fn()
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
const mockRemoveById = jest.fn()

jest.mock('../../src/users/model', () => {
  return {
    getById: mockGetById,
    create: mockCreate,
    update: mockUpdate,
    removeById: mockRemoveById
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
        ctx.state.user = { id: 123 }
        ctx.params.id = 123
        mockUser = { id: 123, name: 'test', password: 'teste' }
        mockGetById.mockReturnValue(mockUser)
        mockCreate.mockReturnValue({ user: mockUser })
        mockUpdate.mockReturnValue(mockStatus)
        mockRemoveById.mockReturnValue(mockStatus)
        mockSignJwt.mockReturnValue('token')
        mockGetById.mockClear()
        mockCreate.mockClear()
        mockUpdate.mockClear()
        mockRemoveById.mockClear()
        mockSignJwt.mockClear()
        mockLogAndThrow.mockClear()
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
          expect(mockCreate.mock.calls.length).toEqual(1)
        })
      })
      describe('get', () => {
        it('should return user in body', async function () {
          await userRoutes.get(ctx)
          expect(ctx.body).toEqual(mockUser)
          expect(mockGetById.mock.calls.length).toEqual(1)
        })
        it('should logAndThrow error', async function () {
          mockGetById.mockImplementation(async () => {
            throw new Error('Test error')
          })
          await userRoutes.get(ctx)
          expect(mockLogAndThrow.mock.calls[0][0].message).toEqual('Test error')
          expect(mockGetById.mock.calls.length).toEqual(1)
        })
      })
      describe('put', () => {
        it('should return user in body', async function () {
          await userRoutes.put(ctx)
          expect(ctx.body).toEqual(mockStatus)
          expect(mockUpdate.mock.calls.length).toEqual(1)
        })
        it('should logAndThrow error', async function () {
          mockUpdate.mockImplementation(async () => {
            throw new Error('Test error')
          })
          await userRoutes.put(ctx)
          expect(mockLogAndThrow.mock.calls[0][0].message).toEqual('Test error')
          expect(mockUpdate.mock.calls.length).toEqual(1)
        })
        it('should logAndThrow 403 unauthorized error', async function () {
          ctx.state.user = { id: 456 }
          await userRoutes.put(ctx)
          expect(mockLogAndThrow.mock.calls[0][0]).toEqual(
            "You don't have access to this action"
          )
          expect(mockLogAndThrow.mock.calls[0][1]).toEqual(403)
          expect(mockUpdate.mock.calls.length).toEqual(0)
        })
      })
      describe('remove', () => {
        it('should return user in body', async function () {
          await userRoutes.remove(ctx)
          expect(ctx.body).toEqual(mockStatus)
          expect(mockRemoveById.mock.calls.length).toEqual(1)
        })
        it('should logAndThrow error', async function () {
          mockRemoveById.mockImplementation(async () => {
            throw new Error('Test error')
          })
          await userRoutes.remove(ctx)
          expect(mockLogAndThrow.mock.calls[0][0].message).toEqual('Test error')
          expect(mockRemoveById.mock.calls.length).toEqual(1)
        })
        it('should logAndThrow 403 unauthorized error', async function () {
          ctx.params.id = 456
          await userRoutes.remove(ctx)
          expect(mockLogAndThrow.mock.calls[0][0]).toEqual(
            "You don't have access to this action"
          )
          expect(mockLogAndThrow.mock.calls[0][1]).toEqual(403)
          expect(mockRemoveById.mock.calls.length).toEqual(0)
        })
      })
    })
  })
})
