const db = require('../dbConfig');

module.exports = {
  findByUsername,
  findByEmail,
  add
}

function add(user){
  return db('users')
    .insert(user)
}

function findByUsername(username){
  return db('users')
    .where({'users.username': username})
    .first()
}

function findByEmail(email){
  return db('users')
    .where({'users.email': email})
    .first()
}