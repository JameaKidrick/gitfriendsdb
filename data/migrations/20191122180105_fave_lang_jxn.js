
exports.up = function(knex) {
  return knex.schema.createTable('jxn', table => {
    table
      .increments();
    
    table
      .integer('profile_id')
      .unsigned()
      .references('profile_id')
      .inTable('profile')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('language_id')
      .unsigned()
      .references('language_id')
      .inTable('languages')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('jxn');
};