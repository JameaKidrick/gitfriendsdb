
exports.up = function(knex) {
  return knex.schema.createTable('posts', table => {
    table
      .increments('post_id');
    
    table
      .integer('user_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE'); // SET NULL

    table
      .varchar('title', 128);

    table
      .varchar('post', 255).notNullable();

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('posts');
};