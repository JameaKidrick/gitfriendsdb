
exports.up = function(knex) {
  return knex.schema.createTable('languages', table => {
    table
      .increments('language_id');
    
    table
      .varchar('language', 128);

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('languages');
};
