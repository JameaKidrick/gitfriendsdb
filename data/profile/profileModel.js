const db = require('../dbConfig');

module.exports = {
  find,
  findBy,
  findByUser,
  add,
  update,
  remove
}

function find(){
  return db('profile')
}

function findBy(id){
  return db('profile')
    .where({ 'profile_id':id })
    .first()
}

function findByUser(id){
  return db('profile')
    .join('users', 'users.user_id', '=', 'profile.user_id')
    .where({ 'users.user_id':id })
    .first()
}

function add(profile){
  return db('profile')
    .insert(profile, 'profile_id')
    .then(id => {
      return findBy(id[0])
    })
}

function update(id, changes){
  return db('profile')
    .update(changes)
    .where({ 'profile_id':id })
    .then(updated => {
      return findBy(id)
        .then(profile => {
          return profile
        })
    })
}

function remove(id){
  return findBy(id)
    .then(profile => {
      return db('profile')
        .del()
        .where({ 'profile_id':id })
        .then(deleted => {
          return profile
        })
    })
}