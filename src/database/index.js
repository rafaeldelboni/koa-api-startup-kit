const knex = require('knex')
const config = require('./config')
const pool = knex(config)

module.exports = pool || knex(config)
