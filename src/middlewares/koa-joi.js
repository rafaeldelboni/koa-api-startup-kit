const Joi = require('joi')

module.exports = schema => async (ctx, next) => {
  let { error } = Joi.validate(ctx.request.body, schema)
  if (error) {
    ctx.throw(500, error.details)
    return
  }
  return next()
}
