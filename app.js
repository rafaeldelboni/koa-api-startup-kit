const Koa = require('koa')
const Router = require('koa-router')

const logger = require('./middlewares/logger')

const app = new Koa()

app.use(logger())

const router = new Router()

router.get('/', function (ctx, next) {
  ctx.body = 'Hello World!'
})

app
  .use(router.routes())
  .use(router.allowedMethods())

module.exports = app
