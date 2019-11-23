
exports.up = function(knex) {
  return knex.schema.createTable('comments', table => {
    table
      .increments('comment_id');
    
    table
      .integer('user_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('post_id')
      .unsigned()
      .references('post_id')
      .inTable('posts')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .varchar('comment', 255).notNullable();

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments');
};
