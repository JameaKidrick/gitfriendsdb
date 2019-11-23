
exports.up = function(knex) {
  return knex.schema.createTable('profile', table => {
    table
      .increments('profile_id');

    table
      .integer('user_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .varchar('avatar', 128).notNullable();

    table
      .varchar('location', 128);

    table
      .varchar('about_me', 255);
      
    table
      .varchar('dob_display', 128).notNullable();

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('profile');
};