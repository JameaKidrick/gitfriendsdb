
exports.up = function(knex) {
  return knex.schema.createTable('auth', table => {
    table
      .increments();

    table
      .varchar('username', 65).notNullable().unique();

    table
      .varchar('password', 65).notNullable();

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('auth');
};
