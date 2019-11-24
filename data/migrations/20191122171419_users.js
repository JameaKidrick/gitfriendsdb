
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table
      .increments('user_id');

    table
      .varchar('username', 65).notNullable().unique();

    table
      .varchar('password', 65).notNullable();

    table
      .varchar('first_name', 128).notNullable();
      
    table
      .varchar('last_name', 128).notNullable();

    table
      .varchar('email', 65).notNullable().unique();

    table
      .date('date_of_birth').notNullable();

    table
      .varchar('role', 65).notNullable().defaultTo('member'); 
      // use same logic as friend request to approve new admin accounts
        // when a new request to create an admin profile is made, I get an email to approve to disapprove
          // pending = 
            // adds userid to table (NEW) for pending admins with role 'pending admin' and has message after form submission pending approval
            // user account is added to users with role 'pending approval', but it has the same privileges as a 'member'
          // approved = updates user role to 'admin' and sends them email of approval
          // denied = deletes user request from pending admins table, switches 'pending admin' role to 'member', and sends them email of denial

    table
      .timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};