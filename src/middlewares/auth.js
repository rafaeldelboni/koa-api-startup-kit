const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')

const { getByUsernamePassword, getById } = require('../users/model')

async function generateJwt (ctx, next, error, user) {
  if (error) {
    ctx.throw(401, error)
  } else if (!user) {
    ctx.throw(400, 'User not found.')
  } else {
    ctx.state.token = jwt.sign(user, process.env.JWT_SECRET)
    await next()
  }
}

async function validateJwt (ctx, next, error, user) {
  if (error) {
    ctx.throw(401, error)
  } else if (!user) {
    ctx.throw(400, 'Invalid token.')
  } else {
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

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function (payload, callback) {
      try {
        const user = await getById(payload.id)
        callback(null, user)
      } catch (error) {
        callback(error)
      }
    }
  )
)

exports.local = () => {
  return async (ctx, next) => {
    return passport.authenticate(['local'], { session: false }, async function (
      error,
      user
    ) {
      await generateJwt(ctx, next, error, user)
    })(ctx, next)
  }
}

exports.jwt = () => {
  return async (ctx, next) => {
    return passport.authenticate(['jwt'], { session: false }, async function (
      error,
      user
    ) {
      await validateJwt(ctx, next, error, user)
    })(ctx, next)
  }
}
