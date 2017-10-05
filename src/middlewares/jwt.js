const jwt = require('koa-jwt')

const jwtAuthMiddleware = jwt({ secret: process.env.JWT_SECRET })

module.exports = () => {
  return async (ctx, next) => {
    return jwtAuthMiddleware(ctx, next)
  }
}
