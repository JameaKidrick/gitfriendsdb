const knex = require('knex');
const configure = require('../knexfile');

const environment = process.env.DB || 'development'

module.exports = knex(configure[environment]);