const comments = require('../dummyData/comments');

exports.seed = function(knex) {
  return knex('comments')
    .then(function () {
      return knex('comments').insert(comments);
    });
};
