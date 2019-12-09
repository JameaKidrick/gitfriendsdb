const db = require('../dbConfig');

module.exports = {
  find,
  findBy,
  findByProfile,
  findByProfileCompare,
  update,
  add,
  remove
}

function find() {
  return db('languages')
}

function findBy(id) {
  return db('jxn')
    .join('languages', 'languages.language_id', '=', 'jxn.language_id')
    .where({ 'jxn.id':id })
    .first()
}

function findByProfile(profileid) {
  return db('jxn')
    .select('jxn.id', 'profile.user_id', 'profile.profile_id', 'languages.language_id', 'languages.language')
    .join('profile', 'profile.profile_id', '=', 'jxn.profile_id')
    .join('languages', 'languages.language_id', '=', 'jxn.language_id')
    .where({ 'jxn.profile_id':profileid })
}

function findByProfileCompare(profileid, langid) {
  return db('jxn')
    .join('languages', 'languages.language_id', '=', 'jxn.language_id')
    .where({ 'jxn.profile_id':profileid })
    .andWhere({ 'jxn.language_id':langid })
}

// REMOVES ALL LANGUAGES THEN ADDS NEW LIST
function update(id, profileid){
  return db('jxn')
    .del()
    .where({ 'jxn.profile_id':profileid })
    .then(deleted => {
      return db('jxn')
        .insert(id, 'jxn.id')
        .then(ids => {
          return findBy(ids[0])
        })
    })
}

function add(id) {
  return db('jxn')
    .insert(id, 'jxn.id')
    .then(ids => {
      return findBy(ids[0])
    })
}

function remove(id) {
  return findBy(id)
    .then(languageJxn => {
      return db('jxn')
        .del()
        .where({ 'jxn.id':id })
        .then(deleted => {
          return languageJxn
        })
    })
}