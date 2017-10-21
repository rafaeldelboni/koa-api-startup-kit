const Koa = require('koa')
const body = require('koa-bodyparser')
const logger = require('./middlewares/logger')

require('./database')

// Routes
const Router = require('koa-router')
const users = require('./users/routes')
const index = new Router()
index.get('/', function (ctx, next) {
  ctx.body = 'Hello World!'
})

const app = new Koa()

app
  .use(body())
  .use(logger())
  .use(index.routes())
  .use(users.routes)

module.exports = app
