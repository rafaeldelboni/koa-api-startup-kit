const auth = require('../middlewares/auth')
const validation = require('../middlewares/koa-joi')
const router = require('koa-router')({ prefix: '/user(s\\b|\\b)' })

const model = require('./model')

async function postLogin (ctx) {
  ctx.body = { token: ctx.state.token }
}

async function postSignup (ctx) {
  const user = ctx.request.body
  try {
    const created = await model.create(user)
    ctx.body = {
      token: await auth.signJwt(created.user)
    }
  } catch (error) {
    ctx.logAndThrow(error)
  }
}

async function get (ctx) {
  try {
    ctx.body = await model.getById(ctx.state.user.id)
  } catch (error) {
    ctx.logAndThrow(error)
  }
}

async function put (ctx) {
  const user = ctx.request.body
  try {
    if (ctx.state.user.id !== user.id) {
      throw ctx.logAndThrow("You don't have access to this action", 403)
    }
    ctx.body = await model.update(user)
  } catch (error) {
    ctx.logAndThrow(error)
  }
}

async function remove (ctx) {
  const userId = parseInt(ctx.params.id)
  try {
    if (ctx.state.user.id !== userId) {
      throw ctx.logAndThrow("You don't have access to this action", 403)
    }
    ctx.body = await model.removeById(userId)
  } catch (error) {
    ctx.logAndThrow(error)
  }
}

router
  .post('/login', auth.local(), postLogin)
  .post('/signup', validation(model.schema), postSignup)
  .get('/', auth.jwt(), get)
  .put('/', auth.jwt(), put)
  .delete('/:id', auth.jwt(), remove)

module.exports = {
  postLogin,
  postSignup,
  get,
  put,
  remove,
  routes: router.routes()
}
