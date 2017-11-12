const auth = require('../middlewares/auth')
const validation = require('../middlewares/koa-joi')
const email = require('../helpers/email')

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

async function putForgotPassword (ctx) {
  const payload = ctx.request.body
  try {
    const resetToken = await model.updatePasswordResetToken(payload.email)
    await email.send({
      to: payload.email,
      subject: 'Reset your password',
      layout: 'password-reset',
      data: resetToken
    })
    ctx.body = { status: resetToken.status }
  } catch (error) {
    ctx.logAndThrow(error)
  }
}

async function putResetPassword (ctx) {
  const payload = ctx.request.body
  try {
    const reset = await model.updatePasswordReset(
      payload.email,
      payload.token,
      payload.password
    )
    await email.send({
      to: payload.email,
      subject: 'Your password has changed',
      layout: 'password-changed',
      data: reset
    })
    ctx.body = { status: reset.status }
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
  user.id = parseInt(ctx.params.id)
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
  .post('/login', validation(model.schemaLogin), auth.local(), postLogin)
  .post('/signup', validation(model.schemaSignup), postSignup)
  .put('/forgot', validation(model.schemaForgotPassword), putForgotPassword)
  .put('/reset', validation(model.schemaResetPassword), putResetPassword)
  .get('/', auth.jwt(), get)
  .put('/:id', validation(model.schemaUpdate), auth.jwt(), put)
  .delete('/:id', auth.jwt(), remove)

module.exports = {
  postLogin,
  postSignup,
  putForgotPassword,
  putResetPassword,
  get,
  put,
  remove,
  routes: router.routes()
}
