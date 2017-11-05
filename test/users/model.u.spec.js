const moment = require('moment')
const joi = require('joi')

const plainText = 'pass'
const cryptText = '$2a$06$/S0FLSPCz01ov4s4qeQ1qe5o0EYP0hT/tFlQ.HejoyFjC.4MtOfk2'

let mockUser = { id: 123, name: 'test', password: cryptText }
const mockStatus = { status: 'ok' }

const mockGetById = jest.fn()
const mockGetByEmail = jest.fn()
const mockGetByUsername = jest.fn()
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
const mockRemoveById = jest.fn()

jest.mock('../../src/users/repository', () => {
  return {
    getById: mockGetById,
    getByEmail: mockGetByEmail,
    getByUsername: mockGetByUsername,
    create: mockCreate,
    update: mockUpdate,
    removeById: mockRemoveById
  }
})

const userModel = require('../../src/users/model')

describe('unit', () => {
  describe('users', () => {
    describe('model', () => {
      beforeEach(() => {
        mockUser = { id: 123, name: 'test', password: cryptText }
        mockGetById.mockReturnValue(mockUser)
        mockGetByEmail.mockReturnValue(mockUser)
        mockGetByUsername.mockReturnValue(mockUser)
        mockCreate.mockReturnValue([mockUser])
        mockUpdate.mockReturnValue(mockStatus)
        mockRemoveById.mockReturnValue(mockStatus)
        mockGetById.mockClear()
        mockGetByEmail.mockClear()
        mockGetByUsername.mockClear()
        mockCreate.mockClear()
        mockUpdate.mockClear()
        mockRemoveById.mockClear()
      })
      describe('checkCryptedPassword', () => {
        it('compare valid bcrypt password', async function () {
          const validation = await userModel.checkCryptedPassword(
            plainText,
            cryptText
          )
          expect(validation).toBe(true)
        })
        it('compare invalid bcrypt password', async function () {
          const validation = await userModel.checkCryptedPassword(
            plainText,
            plainText
          )
          expect(validation).toBe(false)
        })
      })
      describe('generateCryptedPassword', () => {
        it('generate a password and test if is a valid', async function () {
          const hashPassword = await userModel.generateCryptedPassword(
            plainText
          )
          expect(typeof hashPassword).toEqual('string')
          const validation = await userModel.checkCryptedPassword(
            plainText,
            hashPassword
          )
          expect(validation).toBe(true)
        })
        it('generate a password and test if is a valid', async function () {
          const hashPassword = await userModel.generateCryptedPassword(
            plainText
          )
          expect(typeof hashPassword).toEqual('string')
          const validation = await userModel.checkCryptedPassword(
            'notTheActualPassword',
            hashPassword
          )
          expect(validation).toBe(false)
        })
      })
      describe('getById', () => {
        it('get user by id', async function () {
          const user = await userModel.getById(1)
          expect(user).toBe(mockUser)
        })
        it('dont get user by id', async function () {
          mockGetById.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.getById(1)
          } catch (error) {
            expect(error.message).toBe('User not found')
          }
        })
      })
      describe('getByEmail', () => {
        it('get user by email', async function () {
          const user = await userModel.getByEmail('user@mail.co')
          expect(user).toBe(mockUser)
        })
        it('dont get user by email', async function () {
          mockGetByEmail.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.getByEmail('user@mail.co')
          } catch (error) {
            expect(error.message).toBe('Email not found')
          }
        })
      })
      describe('getByUsername', () => {
        it('get user by username', async function () {
          const user = await userModel.getByUsername('username')
          expect(user).toBe(mockUser)
        })
        it('dont get user by username', async function () {
          mockGetByUsername.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.getByUsername('username')
          } catch (error) {
            expect(error.message).toBe('Username not found')
          }
        })
      })
      describe('getByUsernameOrEmailAndPassword', () => {
        it('get user by username and password', async function () {
          const user = await userModel.getByUsernameOrEmailAndPassword(
            'username',
            plainText
          )
          expect(user).toBe(mockUser)
          expect(mockGetByUsername.mock.calls.length).toBe(1)
          expect(mockGetByEmail.mock.calls.length).toBe(0)
        })
        it('get user by email and password', async function () {
          const user = await userModel.getByUsernameOrEmailAndPassword(
            'username@email.test',
            plainText
          )
          expect(user).toBe(mockUser)
          expect(mockGetByUsername.mock.calls.length).toBe(0)
          expect(mockGetByEmail.mock.calls.length).toBe(1)
        })
        it('dont get non existing user', async function () {
          mockGetByUsername.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.getByUsernameOrEmailAndPassword(
              'username',
              plainText
            )
          } catch (error) {
            expect(error.message).toBe('User not found')
          }
        })
        it('dont get user by username and incorrect pwd', async function () {
          expect.assertions(3)
          try {
            await userModel.getByUsernameOrEmailAndPassword(
              'username',
              'notTheActualPassword'
            )
          } catch (error) {
            expect(error.message).toBe('Incorrect password')
            expect(mockGetByUsername.mock.calls.length).toBe(1)
            expect(mockGetByEmail.mock.calls.length).toBe(0)
          }
        })
        it('dont get user by email and incorrect pwd', async function () {
          expect.assertions(3)
          try {
            await userModel.getByUsernameOrEmailAndPassword(
              'username@email.test',
              'notTheActualPassword'
            )
          } catch (error) {
            expect(error.message).toBe('Incorrect password')
            expect(mockGetByUsername.mock.calls.length).toBe(0)
            expect(mockGetByEmail.mock.calls.length).toBe(1)
          }
        })
      })
      describe('getByEmailAndPasswordResetToken', () => {
        it('get user by email and pass reset token', async function () {
          mockUser.passwordResetToken = 'super-secret-token'
          mockUser.passwordResetExpires = moment()
            .add(1, 'hours')
            .format()

          const user = await userModel.getByEmailAndPasswordResetToken(
            'user@mail.co',
            'super-secret-token'
          )
          expect(user).toBe(mockUser)
        })
        it('dont get user by invalid email', async function () {
          mockGetByEmail.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.getByEmailAndPasswordResetToken(
              'user@mail.co',
              'super-secret-token'
            )
          } catch (error) {
            expect(error.message).toBe('Email not found')
          }
        })
        it('dont get user by email and invalid token', async function () {
          mockUser.passwordResetToken = 'super-secret-token'
          mockUser.passwordResetExpires = moment()
            .add(1, 'hours')
            .format()

          expect.assertions(1)
          try {
            await userModel.getByEmailAndPasswordResetToken(
              'user@mail.co',
              'super-invalid-token'
            )
          } catch (error) {
            expect(error.message).toBe('Invalid or Expired token')
          }
        })
        it('dont get user by email and expired token', async function () {
          mockUser.passwordResetToken = 'super-secret-token'
          mockUser.passwordResetExpires = moment()
            .subtract(1, 'hours')
            .format()

          expect.assertions(1)
          try {
            await userModel.getByEmailAndPasswordResetToken(
              'user@mail.co',
              'super-secret-token'
            )
          } catch (error) {
            expect(error.message).toBe('Invalid or Expired token')
          }
        })
      })
      describe('create', () => {
        it('create user', async function () {
          mockGetByEmail.mockReturnValueOnce(null)
          mockGetByUsername.mockReturnValueOnce(null)
          const result = await userModel.create({
            first_name: 'First',
            username: 'username',
            email: 'email@test.com',
            password: 'blabla123'
          })
          expect(result).toEqual({
            status: 'ok',
            user: {
              id: 123,
              name: 'test'
            }
          })
        })
        it('dont create existing username', async function () {
          mockGetByEmail.mockReturnValueOnce(null)
          mockGetByUsername.mockReturnValueOnce(mockUser)
          expect.assertions(1)
          try {
            await userModel.create({
              first_name: 'First',
              username: 'username',
              email: 'email@test.com',
              password: 'blabla123'
            })
          } catch (error) {
            expect(error.message).toBe('Username already exists')
          }
        })
        it('dont create existing email', async function () {
          mockGetByEmail.mockReturnValueOnce(mockUser)
          mockGetByUsername.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.create({
              first_name: 'First',
              username: 'username',
              email: 'email@test.com',
              password: 'blabla123'
            })
          } catch (error) {
            expect(error.message).toBe('Email already exists')
          }
        })
      })
      describe('update', () => {
        it('should update', async function () {
          mockGetById.mockReturnValueOnce(mockUser)
          const result = await userModel.update({
            id: 123,
            first_name: 'First',
            username: 'username',
            email: 'email@test.com',
            password: 'blabla123'
          })
          expect(result).toEqual({ status: 'ok' })
        })
        it('should not update non existing user', async function () {
          mockGetById.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.update({
              id: 123,
              first_name: 'First',
              username: 'username',
              email: 'email@test.com',
              password: 'blabla123'
            })
          } catch (error) {
            expect(error.message).toBe('User not found')
          }
        })
        it('should not update user with existing email', async function () {
          mockGetByEmail.mockReturnValueOnce({
            id: 456,
            email: 'email.@test.com'
          })
          expect.assertions(1)
          try {
            await userModel.update({
              id: 123,
              first_name: 'First',
              username: 'username',
              email: 'email@test.com',
              password: 'blabla123'
            })
          } catch (error) {
            expect(error.message).toBe('Email already exists')
          }
        })
        it('should not update user with existing username', async function () {
          mockGetByUsername.mockReturnValueOnce({
            id: 456,
            username: 'username'
          })
          expect.assertions(1)
          try {
            await userModel.update({
              id: 123,
              first_name: 'First',
              username: 'username',
              password: 'blabla123'
            })
          } catch (error) {
            expect(error.message).toBe('Username already exists')
          }
        })
      })
      describe('updatePasswordResetToken', () => {
        it('should update user with reset token', async function () {
          mockGetByEmail.mockReturnValueOnce({
            id: 123,
            name: 'test',
            password: cryptText,
            email: 'email@email.cc'
          })
          const result = await userModel.updatePasswordResetToken(
            'email@email.cc'
          )
          const validation = joi.validate(
            result,
            joi.object().keys({
              expires: joi
                .date()
                .min('now')
                .required(),
              status: joi.string().required(),
              token: joi
                .string()
                .guid()
                .required()
            })
          )
          expect(validation.error).toBeNull()
        })
        it('should not reset token for non existing user', async function () {
          mockGetByEmail.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.updatePasswordResetToken('email@email.cc')
          } catch (error) {
            expect(error.message).toBe('Email not found')
          }
        })
      })
      describe('updatePasswordReset', () => {
        it('should update password', async function () {
          const resetUser = await userModel.updatePasswordResetToken(
            'email@email.cc'
          )
          mockGetByEmail.mockReturnValueOnce({
            id: 123,
            name: 'test',
            password: cryptText,
            email: 'email@email.cc',
            passwordResetToken: resetUser.token,
            passwordResetExpires: resetUser.expires
          })
          const result = await userModel.updatePasswordReset(
            'email@email.cc',
            resetUser.token,
            'hyper-new-pass'
          )
          expect(result).toEqual({ status: 'ok' })
          expect(mockUpdate.mock.calls[1][0]).toEqual({
            id: 123,
            password: 'hyper-new-pass',
            passwordResetToken: null,
            passwordResetExpires: null
          })
        })
        it('should not update password', async function () {
          const resetUser = await userModel.updatePasswordResetToken(
            'email@email.cc'
          )
          mockGetByEmail.mockReturnValueOnce({
            id: 123,
            name: 'test',
            password: cryptText,
            email: 'email@email.cc',
            passwordResetToken: resetUser.token,
            passwordResetExpires: resetUser.expires
          })
          expect.assertions(1)
          try {
            await userModel.updatePasswordReset(
              'email@email.cc',
              'very-not-the-token',
              'hyper-new-pass'
            )
          } catch (error) {
            expect(error.message).toBe('Invalid or Expired token')
          }
        })
      })
      describe('removeById', () => {
        it('should removeById', async function () {
          mockGetById.mockReturnValueOnce(mockUser)
          const result = await userModel.removeById(123)
          expect(result).toEqual({ status: 'ok' })
        })
        it('should not remove non existing user', async function () {
          mockGetById.mockReturnValueOnce(null)
          expect.assertions(1)
          try {
            await userModel.update(123)
          } catch (error) {
            expect(error.message).toBe('User not found')
          }
        })
      })
    })
  })
})
