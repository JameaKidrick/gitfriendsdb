const friend_request = require('../dummyData/friend_request');

exports.seed = function(knex) {
  return knex('friend_request')
    .then(function () {
      return knex('friend_request').insert(friend_request);
    });
};
