const users = require('../dummyData/users');

exports.seed = function(knex) {
  return knex('users')
    .then(function () {
      return knex('users').insert(users);
    });
};
