// STATUS = 1: PENDING
// STATUS = 2: ACCEPTED
// STATUS = 3: DENIED => DELETE

// SET REQUESTOR AS REQUESTOR_ID
// SET USER WITH SMALLER ID AS USER1

const db = require('../dbConfig');

module.exports = {
  find,
  findBy,
  findByUser,
  send,
  decide,
  remove
}

function find(){
  return db('friend_request')
}

function findBy(id){
  return db('friend_request')
    .where({ 'request_id':id })
    .first();
}

function findByUser(id){
  return db('friend_request')
    .where({ 'user1_id':id })
    .orWhere({ 'user2_id':id })
}

function send(request){
  return db('friend_request')
    .insert(request, 'request_id')
    .then(id => {
      return id[0]
    })
}

function decide(id, status){
  return db('friend_request')
    .update(status)
    .where({ 'request_id':id })
}

function remove(id){
  return db('friend_request')
    .del()
    .where({ 'request_id':id })
}