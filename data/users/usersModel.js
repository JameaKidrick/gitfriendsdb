const db = require('../dbConfig');

module.exports = {
  find,
  findById,
  findByIdShort,
  findByEmail,
  findByUsername,
  add,
  update,
  updateRole,
  updatePassword,
  remove
}

// GET ALL USERS
function find(){
  return db('users')
    .select('user_id', 'username', 'first_name', 'last_name', 'email', 'date_of_birth', 'role', 'created_at')
}

// GET SPECIFIC USER BY ID
function findById(id){
  return db('users')
    .select('users.user_id', 'username', 'first_name', 'last_name', 'email', 'role', 'date_of_birth', 'profile.profile_id')
    .join('profile', 'profile.user_id', '=', 'users.user_id')
    .where({ 'users.user_id':id })
    .first()
}

// GET SPECIFIC USER BY ID (ONLY FOR CREATE PROFILE PAGE 1)
function findByIdShort(id){
  return db('users')
    .select('users.user_id', 'username', 'first_name', 'last_name', 'email', 'role', 'date_of_birth')
    .where({ 'users.user_id':id })
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
    .then(user => {
      return findById(id)
    })
}

function updateRole(id, role){
  return db('users')
    .update({ 'role': role })
    .where({ 'user_id':id })
    .then(user => {
      return findById(id)
    })
}

function updatePassword(id, password){
  return db('users')
    .update({ 'password': password})
    .where({ 'user_id':id })
    .then(user => {
      return findById(id)
    })
}

// DELETE USER
function remove(id){
  return findById(id)
    .then(user => {
      return db('users')
        .del()
        .where({ 'user_id':id })
        .then(deleted => {
          return user
        })
    })
}