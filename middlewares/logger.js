const winston = require('winston')
const { logger } = require('koa2-winston')

const options = {
  transports: [
    new winston.transports.Console({ json: true, stringify: true })
  ],
  level: 'info'
}

module.exports = () => {
  const loggerMiddleware = logger(options)
  return async (ctx, next) => {
    ctx.logError = logErrorFactory()
    try {
      return loggerMiddleware(ctx, next)
    } catch (ex) {
      ctx.logError(ex)
    }
  }
}

function logErrorFactory () {
  const logger = new winston.Logger(options)
  return function logError (error) {
    // Log in console
    logger.error(error)
  }
}
