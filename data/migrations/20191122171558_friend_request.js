
exports.up = function(knex) {
  return knex.schema.createTable('friend_request', table => {
    table
      .increments('request_id');

    table
      .integer('requestor_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('friend_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table // status of request: 1 = waiting; 2 = accepted, delete from table and secure friendship; 3 = declined, delete from table
      .integer('request_status').defaultTo(1)

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('friend_request');
};

