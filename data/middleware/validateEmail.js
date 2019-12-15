const userDB = require('../users/usersModel');

const validateEmail = (req, res, next) => {
  if(req.body.email){
    userDB.findByEmail(req.body.email)
    .then(email => {
      if(email){
        res.status(400).json({ error: 'Email is already in the database' }) // ✅
      }else{
        next()
      }
    })
  }else{
    next()
  }
}

module.exports = validateEmail;