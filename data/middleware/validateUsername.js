const userDB = require('../users/usersModel');

const validateUsername = (req, res, next) => {
  if(req.body.username){
    userDB.findByUsername(req.body.username)
    .then(username => {
      if(username){
        res.status(400).json({ error: 'Username is already in the database' }) // ✅
      }else{
        next()
      }
    })
  }else{
    next()
  }
}

module.exports = validateUsername;