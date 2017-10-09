const auth = require('../middlewares/auth')

const router = require('koa-router')({ prefix: '/user(s\\b|\\b)' })

async function postLogin (ctx) {
  ctx.body = ctx.state.token
}

async function postSignup (ctx) {
  ctx.body = 'Signup'
}

async function getProfile (ctx) {
  ctx.body = 'Protected Profile ' + JSON.stringify(ctx.state)
}

router
  .post('/login', auth.local(), postLogin)
  .post('/signup', postSignup)
  .get('/profile', auth.jwt(), getProfile)

module.exports = router
