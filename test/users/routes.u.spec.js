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
const mockUpdatePasswordResetToken = jest.fn()
const mockUpdatePasswordReset = jest.fn()
const mockRemoveById = jest.fn()

jest.mock('../../src/users/model', () => {
  return {
    getById: mockGetById,
    create: mockCreate,
    update: mockUpdate,
    updatePasswordResetToken: mockUpdatePasswordResetToken,
    updatePasswordReset: mockUpdatePasswordReset,
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

const mockSend = jest.fn()

jest.mock('../../src/helpers/email', () => {
  return {
    send: mockSend
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
        mockUpdatePasswordResetToken.mockReturnValue({
          status: mockStatus.status,
          user: mockUser
        })
        mockUpdatePasswordReset.mockReturnValue({
          status: mockStatus.status,
          user: mockUser
        })
        mockRemoveById.mockReturnValue(mockStatus)
        mockSignJwt.mockReturnValue('token')
        mockGetById.mockClear()
        mockCreate.mockClear()
        mockUpdate.mockClear()
        mockUpdatePasswordResetToken.mockClear()
        mockUpdatePasswordReset.mockClear()
        mockRemoveById.mockClear()
        mockSignJwt.mockClear()
        mockLogAndThrow.mockClear()
        mockSend.mockClear()
      })
      describe('postLogin', () => {
        it('should return ctx.token in body', async function () {
          await userRoutes.postLogin(ctx)
          expect(ctx.body).toEqual({ token: 'token' })
        })
      })
      describe('postSignup', () => {
        it('should return ctx.token in body', async function () {
          await userRoutes.postSignup(ctx)
          expect(ctx.body).toEqual({ token: 'token' })
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
      describe('putForgotPassword', () => {
        it('should send email and return ok in body', async function () {
          ctx.request.body.email = 'rwar@email.cc'
          await userRoutes.putForgotPassword(ctx)
          expect(ctx.body).toEqual({ status: 'ok' })
          expect(mockUpdatePasswordResetToken.mock.calls).toEqual([
            ['rwar@email.cc']
          ])
          expect(mockSend.mock.calls).toEqual([
            [
              {
                data: {
                  status: 'ok',
                  user: {
                    id: 123,
                    name: 'test',
                    password: 'teste'
                  }
                },
                subject: 'Reset your password',
                layout: 'password-reset',
                to: 'rwar@email.cc'
              }
            ]
          ])
        })
        it('should logAndThrow error', async function () {
          mockUpdatePasswordResetToken.mockImplementation(async () => {
            throw new Error('Test error')
          })
          await userRoutes.putForgotPassword(ctx)
          expect(mockLogAndThrow.mock.calls[0][0].message).toEqual('Test error')
          expect(mockUpdatePasswordResetToken.mock.calls.length).toEqual(1)
        })
      })
      describe('putResetPassword', () => {
        it('should send email and return ok in body', async function () {
          ctx.request.body = {
            email: 'rwar@email.cc',
            token: 'token',
            password: 'password'
          }
          await userRoutes.putResetPassword(ctx)
          expect(ctx.body).toEqual({ status: 'ok' })
          expect(mockUpdatePasswordReset.mock.calls).toEqual([
            ['rwar@email.cc', 'token', 'password']
          ])
          expect(mockSend.mock.calls).toEqual([
            [
              {
                data: {
                  status: 'ok',
                  user: {
                    id: 123,
                    name: 'test',
                    password: 'teste'
                  }
                },
                subject: 'Your password has changed',
                layout: 'password-changed',
                to: 'rwar@email.cc'
              }
            ]
          ])
        })
        it('should logAndThrow error', async function () {
          mockUpdatePasswordReset.mockImplementation(async () => {
            throw new Error('Test error')
          })
          await userRoutes.putResetPassword(ctx)
          expect(mockLogAndThrow.mock.calls[0][0].message).toEqual('Test error')
          expect(mockUpdatePasswordReset.mock.calls.length).toEqual(1)
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
