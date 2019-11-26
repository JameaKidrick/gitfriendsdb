const db = require('../dbConfig');

module.exports = {
  find,
  findById,
  findByUserId,
  findByPostId,
  findByUserIdFull,
  findByPostIdFull,
  add,
  update,
  remove
}

// GET ALL COMMENTS (USERS AND ADMIN)
function find(){
  return db('comments')
}

// GET SPECIFIC COMMENT (USERS AND ADMIN)
function findById(commentid){
  return db('comments')
    .where({ 'comment_id':commentid })
    .first();
}

// GET COMMENTS BY USER ID (USERS AND ADMIN)
function findByUserId(userid){
  return db('comments')
    .where({ 'user_id':userid })
}

// GET COMMENTS BY POST ID (USERS AND ADMIN)
function findByPostId(postid){
  return db('comments')
    .where({ 'post_id':postid })
}

// GET COMMENTS BY USER ID FULL (WITH USER INFO) (USERS AND ADMIN)
function findByUserIdFull(userid){
  return db('comments')
    .where({ 'user_id':userid })
    .then(comments => {
      return db('users')
        .select('user_id', 'username')
        .where({ 'user_id':userid })
        .then(user => {
          return {user: user, comment: comments}
        })
    })
}

// GET COMMENTS BY POST ID FULL (WITH POST INFO) (USERS AND ADMIN)
function findByPostIdFull(postid){
  return db('comments')
    .where({ 'post_id':postid })
    .then(comments => {
      return db('posts')
        .where({ 'post_id':postid })
        .then(post => {
          return {post: [post], comment: comments}
        })
    })
}

// ADD NEW COMMENT (OWNER)
function add(comment){
  return db('comments')
    .insert(comment, 'comment_id')
    .then(ids => {
      return findById(ids[0])
    })
}

// UPDATE COMMENT (OWNER)
function update(commentid, changes){
  return db('comments')
    .update(changes)
    .where({ 'comment_id':commentid })
    .then(updated => {
      return findById(commentid)
    })
}

// DELETE COMMENT (OWNER AND ADMIN)
function remove(commentid){
  return findById(commentid)
    .then(comment => {
      return db('comments')
        .del()
        .where({ 'comment_id':commentid })
        .then(deleted => {
          return comment
        })
    })
}
