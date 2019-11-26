const db = require('../dbConfig');

module.exports = {
  find,
  findById,
  findByUser,
  findByUserFull,
  add,
  update,
  remove
}

// GET ALL POSTS
function find(){
  return db('posts')
}

// GET SPECIFIC POST BY ID (USERS AND ADMINS)
function findById(postid){
  return db('posts')
    .where({ 'post_id':postid })
    .first()
}

// GET ALL POSTS BY USER ID (USERS AND ADMINS)
function findByUser(userid){
  return db('posts')
    .where({ 'user_id':userid })
}

// GET ALL POSTS BY USER ID AND SHOW USER (USERS AND ADMINS)
function findByUserFull(userid){
  return db('posts')
    .where({ 'user_id':userid })
    .then(posts => {
      return db('users')
        .select('user_id', 'username')
        .where({ 'user_id':userid })
        .then(user => {
          return {user: user, post: posts}
        })
    })
}

// ADD NEW POST (OWNER)
function add(post){
  return db('posts')
    .insert(post, 'post_id')
    .then(ids => {
      return findById(ids[0])
    })
}

// UPDATE POST (OWNER)
function update(postid, changes){
  return db('posts')
    .update(changes)
    .where({ 'post_id':postid })
    .then(updated => {
      return findById(postid)
    })
}

// DELETE POST (OWNER AND ADMIN)
function remove(postid){
  return findById(postid)
    .then(post => {
      return db('posts')
        .del()
        .where({ 'post_id':postid })
        .then(deleted => {
          return post
        })
    })
}