
exports.up = function(knex) {
  return knex.schema.alterTable('profile', table => {
    table.varchar('dobFormat', 68).notNullable().defaultTo('mm dd yyyy')
  })
};

exports.down = function(knex) {
  return knex.schema.dropColumnIfExists('dobFormat')
};
