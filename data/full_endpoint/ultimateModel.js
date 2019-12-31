const db = require('../dbConfig');

module.exports = {
  findFullUser
};

function findFullUser(user_id) {
  return db('users')
    .select('user_id', 'username', 'first_name', 'last_name', 'email', 'date_of_birth', 'role', 'created_at', 'updated_at')
    .where({ 'users.user_id': user_id })
    .first()
    .then(user => {
      return db('friend_request')
      .where({ 'user1_id':user_id })
      .orWhere({ 'user2_id':user_id })
      .then(friend_requests => {
        return db('profile')
          .where({ 'profile.user_id': user_id })
          .first()
          .then(profile => {
            return db('posts')
              .where({ 'posts.user_id': user_id })
              .then(posts => {
                return db('comments')
                  .where({ 'comments.user_id': user_id })
                  .then(comments => {
                    return db('jxn')
                      .where({ 'jxn.profile_id': profile.profile_id })
                      .then(jxn => {
                        return ({ user: { userInfo: user, profile, posts, comments, fave_languages: jxn, friend_requests } })
                      })
                  })
              })
          })
      })
    })
}