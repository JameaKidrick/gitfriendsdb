const languages = require('../dummyData/languages');

exports.seed = function(knex) {
  return knex('languages')
    .then(function () {
      return knex('languages').insert(languages);
    });
};
