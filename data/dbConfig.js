const knex = require('knex');
const configure = require('../knexfile');

module.exports = knex(configure.development);