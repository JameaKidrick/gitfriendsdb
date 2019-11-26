const knex = require('knex');
const configure = require('../knexfile');

const environment = process.env.DATABASE_ENV || 'development'

module.exports = knex(configure[environment]);