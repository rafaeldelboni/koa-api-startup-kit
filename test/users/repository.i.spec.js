const database = require('../../src/database')
const repository = require('../../src/users/repository')

let userFactory = (attrs = {}) => ({
  firstName: attrs.firstName || 'first',
  lastName: attrs.lastName || 'last',
  username: attrs.username || `username${Date.now()}`,
  email: attrs.email || `email${Date.now()}@email.cc`,
  password: attrs.password || 'password'
})

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
      describe('getById', () => {
        let testUserOne = null
        let testUserTwo = null
        beforeEach(async () => {
          testUserOne = (await repository.create(userFactory()))[0]
          testUserTwo = (await repository.create(userFactory()))[0]
        })
        it('it should find id', async function () {
          const userOne = await repository.getById(testUserOne.id)
          expect(userOne.id).toEqual(testUserOne.id)
          expect(userOne.name).toEqual(testUserOne.name)
          expect(userOne.username).toEqual(testUserOne.username)
          expect(userOne.email).toEqual(testUserOne.email)

          const userTwo = await repository.getById(testUserTwo.id)
          expect(userTwo.id).toEqual(testUserTwo.id)
          expect(userTwo.name).toEqual(testUserTwo.name)
          expect(userTwo.username).toEqual(testUserTwo.username)
          expect(userTwo.email).toEqual(testUserTwo.email)
        })
        it('it should not find id', async function () {
          const user = await repository.getByUsername(999)
          expect(user).toBeUndefined()
        })
      })
      describe('create', () => {
        it('it should create user', async function () {
          const testUserOne = (await repository.create(userFactory()))[0]
          const userOne = await repository.getById(testUserOne.id)
          expect(userOne.id).toEqual(testUserOne.id)
          expect(userOne.name).toEqual(testUserOne.name)
          expect(userOne.username).toEqual(testUserOne.username)
          expect(userOne.email).toEqual(testUserOne.email)
        })
        it('it should not create user', async function () {
          expect.assertions(1)
          try {
            await repository.create(
              userFactory({
                email: 'user111@email.cc'
              })
            )
            await repository.create(
              userFactory({
                email: 'user111@email.cc'
              })
            )
          } catch (err) {
            expect(err.detail).toEqual(
              'Key (email)=(user111@email.cc) already exists.'
            )
          }
        })
      })
      describe('update', () => {
        let testUserOne = null
        beforeEach(async () => {
          testUserOne = (await repository.create(userFactory()))[0]
        })
        it('it should update', async function () {
          const userChanged = {
            id: testUserOne.id,
            firstName: 'newFirst',
            lastName: 'newLast',
            username: 'newUsername',
            email: 'new@email.cc'
          }
          await repository.update(userChanged)
          const userUpdated = await repository.getById(testUserOne.id)
          expect(userUpdated.id).toEqual(userChanged.id)
          expect(userUpdated.name).toEqual(userChanged.name)
          expect(userUpdated.username).toEqual(userChanged.username)
          expect(userUpdated.email).toEqual(userChanged.email)
        })
        it('it should not update', async function () {
          await repository.create(userFactory({ email: 'some@email.cc' }))
          const userChanged = {
            id: testUserOne.id,
            email: 'some@email.cc'
          }
          expect.assertions(1)
          try {
            await repository.update(userChanged)
          } catch (err) {
            expect(err.detail).toEqual(
              'Key (email)=(some@email.cc) already exists.'
            )
          }
        })
      })
      describe('removeById', () => {
        let testUserOne = null
        let testUserTwo = null
        beforeEach(async () => {
          testUserOne = (await repository.create(userFactory()))[0]
          testUserTwo = (await repository.create(userFactory()))[0]
        })
        it('it should remove', async function () {
          expect(await repository.removeById(testUserOne.id)).toBe(1)
          expect(await repository.removeById(testUserTwo.id)).toBe(1)
        })
        it('it should not remove', async function () {
          expect(await repository.removeById(999)).toBe(0)
        })
      })
    })
  })
})
