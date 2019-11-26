const admin = require('../dummyData/admins');

exports.seed = function(knex) {
  return knex('admin')
    .then(function () {
      return knex('admin').insert(admin);
    });
};
