// STATUS = 1: PENDING
// STATUS = 2: ACCEPTED
// STATUS = 3: DENIED => DELETE

const db = require('../dbConfig');

module.exports = {
  find,
  findFriends,
  findBy,
  findByUser,
  findFriendsByUser,
  findByPair,
  send,
  decide,
  remove
}

function find(){
  return db('friend_request')
    .where({ 'request_status': 1 })
}

function findBy(id){
  return db('friend_request')
    .where({ 'request_id':id })
    .andWhere({ 'request_status': 1 })
    .first();
}

function findStatus(id){
  return db('friend_request')
    .where({ 'request_id':id })
    .first();
}

function findFriends(){
  return db('friend_request')
    .where({ 'request_status': 2 })
}

function findByUser(id){
  return db('friend_request')
    .where({ 'user1_id':id })
    .andWhere({ 'request_status': 1 })
    .orWhere({ 'user2_id':id })
    .andWhere({ 'request_status': 1 })
}

function findFriendsByUser(id){
  return db('friend_request')
    .where({ 'user1_id':id })
    .andWhere({ 'request_status': 2 })
    .orWhere({ 'user2_id':id })
    .andWhere({ 'request_status': 2 })
}

function findByPair(firstUser_id, secondUser_id){
  return db('friend_request')
    .where({ 'user1_id':firstUser_id })
    .andWhere({ 'user2_id':secondUser_id })
    .first()
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
    .then(request => {
      return findStatus(id)
    })
}

function remove(id){
  return findStatus(id)
    .then(findRequest => {
      return db('friend_request')
        .del()
        .where({ 'request_id':id })
        .then(deleted => {
          return findRequest
        })
    })
}