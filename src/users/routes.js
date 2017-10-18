const auth = require('../middlewares/auth')
const validation = require('../middlewares/koa-joi')
const router = require('koa-router')({ prefix: '/user(s\\b|\\b)' })

const model = require('./model')

async function postLogin (ctx) {
  ctx.body = ctx.state.token
}

async function postSignup (ctx) {
  const user = ctx.request.body
  try {
    const created = await model.create(user)
    ctx.body = await auth.signJwt(created.user)
  } catch (error) {
    ctx.logAndThrow(error)
  }
}

async function getProfile (ctx) {
  try {
    ctx.body = await model.getById(ctx.state.user.id)
  } catch (error) {
    ctx.logAndThrow(error)
  }
}

router
  .post('/login', auth.local(), postLogin)
  .post('/signup', validation(model.schema), postSignup)
  .get('/profile', auth.jwt(), getProfile)

module.exports = router
