const winston = require('winston')
const { logger } = require('koa2-winston')

const options = {
  transports: [new winston.transports.Console({ json: true, stringify: true })],
  level: 'info'
}

module.exports = () => {
  const loggerMiddleware = logger(options)
  return async (ctx, next) => {
    ctx.logAndThrow = logErrorFactory(ctx)
    try {
      return loggerMiddleware(ctx, next)
    } catch (ex) {
      ctx.logAndThrow(ex)
    }
  }
}

function logErrorFactory () {
  const logger = new winston.Logger(options)
  return function logAndThrow (error) {
    logger.error(error)
    this.throw(500, error, { expose: true })
  }
}
