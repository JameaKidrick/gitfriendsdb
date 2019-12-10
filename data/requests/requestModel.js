// STATUS = 1: PENDING
// STATUS = 2: ACCEPTED
// STATUS = 3: DENIED => DELETE

const db = require('../dbConfig');
const profileDB = require('../profile/profileModel');

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
    .select('friend_request.request_id',
    'friend_request.requestor_id', 
    'friend_request.request_status', 
    'friend_request.created_at', 
    'friend_request.user1_id', 
    'u1.username as user1_username', 
    'p1.avatar as user1_avatar',
    'u1.first_name as user1_first_name', 
    'u1.last_name as user1_last_name', 
    'u1.email as user1_email', 
    'u1.role as user1_role', 
    'friend_request.user2_id', 
    'u2.username as user2_username',
    'p2.avatar as user2_avatar',
    'u2.first_name as user2_first_name', 
    'u2.last_name as user2_last_name',
    'u2.email as user2_email', 
    'u2.role as user2_role')
    .innerJoin('users as u1', 'u1.user_id', '=', 'friend_request.user1_id')
    .leftJoin('users as u2', 'u2.user_id', '=', 'friend_request.user2_id')
    .join('profile as p1', 'p1.user_id', '=', 'u1.user_id')
    .join('profile as p2', 'p2.user_id', '=', 'u1.user_id')
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
    .orWhere({ 'user1_id':secondUser_id })
    .andWhere({ 'user2_id':firstUser_id })
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