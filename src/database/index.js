const knex = require('knex')
const config = require('./config')

function initializePool () {
  console.info('Starting DB Connection Pool')
  return knex(config)
}
const pool = initializePool()

module.exports = {
  pool: () => {
    return pool || initializePool()
  }
}
