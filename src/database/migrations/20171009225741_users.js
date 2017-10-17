exports.up = function (knex, Promise) {
  return createUsersTable()

  function createUsersTable () {
    return knex.schema.createTable('users', function (table) {
      table
        .increments('id')
        .unsigned()
        .unique()
        .primary()

      // User settings
      table.string('first_name', 50)
      table.string('last_name', 50)
      table.string('username', 30).notNullable()
      table.string('email', 250).notNullable()

      // Password related stuff
      table.string('password').notNullable()
      table.string('password_reset_token')
      table.date('password_reset_expires')

      // Utils
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())

      // Unique
      table.unique('username')
      table.unique('email')

      // Index
      table.index('id')
    })
  }
}

exports.down = function (knex, Promise) {
  return dropUsersTable()

  function dropUsersTable () {
    return knex.dropTableIfExists('users')
  }
}
