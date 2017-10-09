import knex from 'knex'
import bookshelf from 'bookshelf'
import config from './config'

// plugins
import schema from './schema'

export const Knex = knex(config)
const Bookshelf = bookshelf(Knex)
Bookshelf.plugin(schema)

export default Bookshelf
