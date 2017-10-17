const Joi = require('joi')

module.exports = schema => async (ctx, next) => {
  let { error } = Joi.validate(ctx.request.body, schema)
  if (error) {
    ctx.throw(500, JSON.stringify(error), { expose: true })
    return
  }
  return next()
}
