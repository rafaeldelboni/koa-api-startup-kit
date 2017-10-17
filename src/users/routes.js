const auth = require('../middlewares/auth')
const joi = require('../middlewares/koa-joi')
const router = require('koa-router')({ prefix: '/user(s\\b|\\b)' })

const model = require('./model')

async function postLogin (ctx) {
  ctx.body = ctx.state.token
}

async function postSignup (ctx) {
  const user = ctx.request.body
  try {
    ctx.body = await model.create(user)
  } catch (error) {
    throw ctx.throw(500, error, { expose: true })
  }
}

async function getProfile (ctx) {
  try {
    ctx.body = await model.getById(ctx.state.user.id)
  } catch (error) {
    ctx.throw(500, error, { expose: true })
  }
}

router
  .post('/login', auth.local(), postLogin)
  .post('/signup', joi(model.schema), postSignup)
  .get('/profile', auth.jwt(), getProfile)

module.exports = router
