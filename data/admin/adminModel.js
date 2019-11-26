const db = require('../dbConfig');

module.exports = {
  find,
  findById,
  findByUser,
  findByUsername,
  findPending,
  findApproved,
  add,
  update,
  remove
}

function find() {
  return db('admin')
}

function findById(id) {
  return db('admin')
    .where({ 'admin_status_id':id })
    .first()
}

function findByUser(userid) {
  return db('admin')
    .where({ 'requestor_id':userid })
    .first()
}

function findByUsername(username) {
  return db('admin')
    .join('users', 'users.user_id', '=', 'requestor_id')
    .where({ 'username': username })
}

function findPending() {
  return db('admin')
    .where({ 'request_status': 1 })
}

function findApproved() {
  return db('admin')
    .where({ 'request_status': 2 })
}


function add(user) {
  return db('admin')
    .insert({'requestor_id':user}, 'admin_status_id')
}

function update(id, decision) {
  return db('admin')
    .update(decision)
    .where({ 'admin_status_id':id })
    .then(request => {
      return findById(id)
    })
}

function remove(id) {
  return findById(id)
    .then(request => {
      return db('admin')
        .del()
        .where({ 'admin_status_id':id })
        .then(deleted => {
          return request
        })
    })
}