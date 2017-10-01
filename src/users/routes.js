const router = require('koa-router')(
  { prefix: '/user(s\\b|\\b)' }
)

async function postLogin (ctx) {
  ctx.body = 'Login'
}

async function postLogout (ctx) {
  ctx.body = 'Logout'
}

router
  .post('/login', postLogin)
  .post('/logout', postLogout)

module.exports = router
