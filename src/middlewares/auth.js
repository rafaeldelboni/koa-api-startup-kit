const passport = require('koa-passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { getByUsernamePassword } = require('../users/model')

async function afterAuthenticate (ctx, next, error, user) {
  if (error) {
    ctx.throw(401, error)
  } else if (!user) {
    ctx.throw(400, 'User not found.')
  } else {
    ctx.state.token = 'a'
    await next()
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user',
      passwordField: 'pass'
    },
    async function (username, password, callback) {
      try {
        const user = await getByUsernamePassword(username, password)
        callback(null, user)
      } catch (error) {
        callback(error)
      }
    }
  )
)

async function local (ctx, next) {
  return passport.authenticate(['local'], { session: false }, async function (
    error,
    user
  ) {
    await afterAuthenticate(ctx, next, error, user)
  })(ctx, next)
}

module.exports = () => {
  return async (ctx, next) => {
    await local(ctx, next)
  }
}
