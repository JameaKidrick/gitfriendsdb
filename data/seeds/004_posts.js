const posts = require('../dummyData/posts');

exports.seed = function(knex) {
  return knex('posts')
    .then(function () {
      return knex('posts').insert(posts);
    });
};
