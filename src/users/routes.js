const jwt = require('../middlewares/jwt')
const auth = require('../middlewares/auth')

const router = require('koa-router')({ prefix: '/user(s\\b|\\b)' })

async function postLogin (ctx) {
  ctx.body = 'Token: ' + ctx.state.token
}

async function postLogout (ctx) {
  ctx.body = 'Logout'
}

async function postSignup (ctx) {
  ctx.body = 'Signup'
}

async function getProfile (ctx) {
  ctx.body = 'Protected Profile ' + JSON.stringify(ctx.state)
}

router
  .post('/login', auth(), postLogin)
  .post('/logout', postLogout)
  .post('/signup', postSignup)
  .get('/profile', jwt(), getProfile)

module.exports = router
