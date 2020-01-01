const db = require('../dbConfig');
const requestDB = require('../requests/requestModel');

module.exports = {
  find,
  findUserProfileFull,
  findAllUsersProfileFull,
  findAllUsersProfileRequest,
  findUsers,
  findBy,
  findByUser,
  add,
  update,
  remove
}

function find(){
  return db('profile')
}

function findUserProfileFull(user_id){
  return db('profile')
    .where({'user_id':user_id})
    .then(profile => {
      return db('users')
        .select('user_id', 'username', 'role', 'date_of_birth')
        .where({'user_id':user_id})
        .then(user => {
          return {user:user[0], profile:profile[0]}
        })
    })
}

function findAllUsersProfileFull(query){
  // console.log(query)
  let { page = 1, limit = 40, sortby = 'users.user_id', sortdir = 'asc' } = query;
  const offset = limit * (page - 1);

  return db('profile')
    .select('users.user_id', 'users.username as username', 'users.first_name', 'users.last_name', 'users.role', 'profile.profile_id', 'profile.avatar', 'profile.location', 'profile.about_me', 'profile.dob_display')
    .join('users', 'users.user_id', '=', 'profile.user_id')
    .orderBy(sortby, sortdir)
    .limit(limit)
    .offset(offset)
    // .then(profiles => {
    //   // console.log(query)
    //   return({profiles, query})
    // })
}

function findAllUsersProfileRequest(userid){
  return findAllUsersProfileFull()
    .then(profile => {
      return profile.forEach(item => {
        
        return requestDB.findByPair(userid, item.user_id)
          .then(requests => {
            return requests
          })
      })
    })
}

function findUsers(){
  return db('users')
    .select('user_id', 'username')
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