const plainText = 'pass'
const cryptText = '$2a$06$/S0FLSPCz01ov4s4qeQ1qe5o0EYP0hT/tFlQ.HejoyFjC.4MtOfk2'

const mockUser = { id: 123, name: 'test', password: cryptText }
const mockStatus = { status: 'ok' }

const mockGetById = jest.fn()
const mockGetByUsername = jest.fn()
const mockCreate = jest.fn()
const mockUpdate = jest.fn()
const mockRemoveById = jest.fn()

jest.mock('../../src/users/repository', () => {
  return {
    getById: mockGetById,
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
        mockGetById.mockReturnValue(mockUser)
        mockGetByUsername.mockReturnValue(mockUser)
        mockCreate.mockReturnValue(mockStatus)
        mockUpdate.mockReturnValue(mockStatus)
        mockRemoveById.mockReturnValue(mockStatus)
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
    })
  })
})
