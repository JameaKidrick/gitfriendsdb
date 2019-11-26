
exports.up = function(knex) {
  return knex.schema.createTable('admin', table => {
    table
      .increments('admin_status_id');

    table
      .integer('requestor_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('assigned_admin_id')
      .unsigned()
      .references('user_id')
      .inTable('users')
      .defaultTo(11)
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .varchar('role').defaultTo('pending admin');
      
    table
      .integer('request_status').defaultTo(1);

    table
      .integer('approved_by'); // on update for approval, add error code for notNullable

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('admin')
};

// use same logic as friend request to approve new admin accounts
  // when a new request to create an admin profile is made, I get an email/request to approve or disapprove
    // pending = 
      // adds userid to table (NEW) for pending admins and has message after form submission: "pending admin"
      // user account is added to users with role 'pending admin', but it has the same privileges as a 'member'
    // approved = updates user role to 'admin' and sends them email of approval
    // denied = deletes user request from pending admins table, switches 'pending admin' role to 'member', and sends them email of denial