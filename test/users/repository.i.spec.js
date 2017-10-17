const database = require('../../src/database')
const repository = require('../../src/users/repository')

const getRandomInt = () => Math.floor(Math.random() * 9999 + 1)

let userFactory = attrs => ({
  firstName: attrs.firstName || 'first',
  lastName: attrs.lastName || 'last',
  username: attrs.username || `username${getRandomInt()}`,
  email: attrs.email || `email${getRandomInt()}@email.cc`,
  password: attrs.password || 'password'
})

/*
  getByEmail,
  getById,
  create,
  update,
  removeById
*/

describe('integration', () => {
  beforeEach(async () => {
    return database.table('users').truncate()
  })
  afterAll(async () => {
    return database.destroy()
  })
  describe('users', () => {
    describe('repository', () => {
      describe('getByUsername', () => {
        let testUserOne = null
        let testUserTwo = null
        beforeEach(async () => {
          testUserOne = (await repository.create(
            userFactory({
              username: 'user111'
            })
          ))[0]
          testUserTwo = (await repository.create(
            userFactory({
              username: 'user222'
            })
          ))[0]
        })
        it('it should find username', async function () {
          const userOne = await repository.getByUsername('user111')
          expect(userOne.id).toEqual(testUserOne.id)
          expect(userOne.name).toEqual(testUserOne.name)
          expect(userOne.username).toEqual(testUserOne.username)
          expect(userOne.email).toEqual(testUserOne.email)

          const userTwo = await repository.getByUsername('user222')
          expect(userTwo.id).toEqual(testUserTwo.id)
          expect(userTwo.name).toEqual(testUserTwo.name)
          expect(userTwo.username).toEqual(testUserTwo.username)
          expect(userTwo.email).toEqual(testUserTwo.email)
        })
        it('it should not find username', async function () {
          const user = await repository.getByUsername('user333')
          expect(user).toBeUndefined()
        })
      })
      describe('getByEmail', () => {
        let testUserOne = null
        let testUserTwo = null
        beforeEach(async () => {
          testUserOne = (await repository.create(
            userFactory({
              email: 'user111@email.cc'
            })
          ))[0]
          testUserTwo = (await repository.create(
            userFactory({
              email: 'user222@email.cc'
            })
          ))[0]
        })
        it('it should find email', async function () {
          const userOne = await repository.getByEmail('user111@email.cc')
          expect(userOne.id).toEqual(testUserOne.id)
          expect(userOne.name).toEqual(testUserOne.name)
          expect(userOne.username).toEqual(testUserOne.username)
          expect(userOne.email).toEqual(testUserOne.email)

          const userTwo = await repository.getByEmail('user222@email.cc')
          expect(userTwo.id).toEqual(testUserTwo.id)
          expect(userTwo.name).toEqual(testUserTwo.name)
          expect(userTwo.username).toEqual(testUserTwo.username)
          expect(userTwo.email).toEqual(testUserTwo.email)
        })
        it('it should not find email', async function () {
          const user = await repository.getByUsername('user333@email.cc')
          expect(user).toBeUndefined()
        })
      })
    })
  })
})
