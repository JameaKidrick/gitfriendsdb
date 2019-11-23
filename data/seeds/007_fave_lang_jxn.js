const faves = require('../dummyData/fave_lang_jxn');

exports.seed = function(knex) {
  return knex('jxn')
    .then(function () {
      return knex('jxn').insert(faves);
    });
};
