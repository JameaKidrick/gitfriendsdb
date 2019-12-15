
exports.up = function(knex) {
  return knex.schema.alterTable('profile', table => {
    table.varchar('dobFormat', 68).defaultTo('')
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('profile', table => {
    table.dropColumn('dobFormat')
  })
};
