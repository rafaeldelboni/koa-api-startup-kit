const dotenv = require('dotenv')
dotenv.config()

jest.mock('koa2-winston', () => {
  return { logger: jest.fn(() => jest.fn((ctx, next) => next())) }
})

const jsonwebtoken = require('jsonwebtoken')
const app = require('../../src/app')
const supertest = require('supertest')
const database = require('../../src/database')
const repository = require('../../src/users/repository')

const appSecret = process.env.APP_SECRET
const cryptPass = '$2a$06$/S0FLSPCz01ov4s4qeQ1qe5o0EYP0hT/tFlQ.HejoyFjC.4MtOfk2'
let userFactory = (attrs = {}) => ({
  firstName: attrs.firstName || 'first',
  lastName: attrs.lastName || 'last',
  username: attrs.username || `username${Date.now()}`,
  email: attrs.email || `email${Date.now()}@email.cc`,
  password: attrs.password || cryptPass,
  passwordConfirm: attrs.passwordConfirm || cryptPass
})

describe('acceptance', () => {
  const request = supertest.agent(app.listen())
  beforeEach(async () => {
    return database.table('users').truncate()
  })
  afterAll(async () => {
    await database.destroy()
  })
  describe('users', () => {
    it('POST /login should return token', async function () {
      await repository.create(
        userFactory({
          username: 'loginuser',
          email: 'test@test.cc'
        })
      )

      const result = await request
        .post('/users/login')
        .send({ username: 'loginuser', password: 'pass' })

      const decoded = jsonwebtoken.verify(result.body.token, appSecret)

      expect(result.status).toBe(200)
      expect(decoded).toMatchSnapshot()
    })
    it('POST /signup should return token', async function () {
      const result = await request.post('/users/signup').send(
        userFactory({
          username: 'signupuser',
          email: 'test@test.cc',
          password: 'test1234',
          passwordConfirm: 'test1234'
        })
      )

      const decoded = jsonwebtoken.verify(result.body.token, appSecret)

      expect(result.status).toBe(200)
      expect(decoded).toMatchSnapshot()
    })
    it('GET / should return user', async function () {
      const signupResult = await request.post('/users/signup').send(
        userFactory({
          username: 'getuser',
          email: 'test@test.cc',
          password: 'test1234',
          passwordConfirm: 'test1234'
        })
      )

      const result = await request
        .get('/users')
        .set('Authorization', `Bearer ${signupResult.body.token}`)

      expect(result.status).toBe(200)
      expect(result.body).toMatchSnapshot()
    })
    it('DELETE / should delete user', async function () {
      const signupResult = await request.post('/users/signup').send(
        userFactory({
          username: 'deleteuser',
          email: 'test@test.cc',
          password: 'test1234',
          passwordConfirm: 'test1234'
        })
      )

      const decoded = jsonwebtoken.verify(signupResult.body.token, appSecret)

      const result = await request
        .delete(`/users/${decoded.id}`)
        .set('Authorization', `Bearer ${signupResult.body.token}`)

      const checkDb = await repository.getById(decoded.id)

      expect(checkDb).toBeUndefined()
      expect(result.status).toBe(200)
      expect(result.body).toMatchSnapshot()
    })
    it('PUT / should update user', async function () {
      const signupResult = await request.post('/users/signup').send(
        userFactory({
          username: 'updateuser',
          email: 'test@test.cc',
          password: 'test1234',
          passwordConfirm: 'test1234'
        })
      )

      const decoded = jsonwebtoken.verify(signupResult.body.token, appSecret)

      const result = await request
        .put(`/users/${decoded.id}`)
        .send({ username: 'username2' })
        .set('Authorization', `Bearer ${signupResult.body.token}`)

      const checkDb = await repository.getById(decoded.id)

      expect(checkDb.username).toEqual('username2')
      expect(result.status).toBe(200)
      expect(result.body).toMatchSnapshot()
    })
  })
})
