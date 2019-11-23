
exports.up = function(knex) {
  return knex.schema.createTable('fave_language', table => {
    table
      .increments('fave_language_id'); // equivalent to user_id
    
    table
      .integer('profile_id')
      .unsigned()
      .references('profile_id')
      .inTable('profile')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('fave_language');
};
