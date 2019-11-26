const profile = require('../dummyData/profile');

exports.seed = function(knex) {
  return knex('profile')
    .then(function () {
      return knex('profile').insert(profile);
    });
};
