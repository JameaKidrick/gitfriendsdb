const db = require('../dbConfig');

module.exports = {
  find,
  findById,
  findByEmail,
  findByUsername,
  add,
  update,
  remove
}

// GET ALL USERS
function find(){
  return db('users')
}

// GET SPECIFIC USER
function findById(id){
  return db('users')
    .where({ 'user_id':id })
    .first()
}

// GET SPECIFIC USER BY EMAIL
function findByEmail(email){
  return db('users')
  .where({'email': email})
  .first()
}

// GET SPECIFIC USER BY USERNAME
function findByUsername(username){
  return db('users')
  .where({'username': username})
  .first()
}

// ADD NEW USER
function add(user){
  return db('users')
    .insert(user, 'user_id')
}

// EDIT USER
function update(id, changes){
  return db('users')
    .update(changes)
    .where({ 'user_id':id })
}

// DELETE USER
function remove(id){
  return db('users')
    .del()
    .where({ 'user_id':id })
}