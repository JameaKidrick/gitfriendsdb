const authDB = require('../authorization/authModel');

const validateRegister = (req, res, next) => {
  const user = req.body

  if(!user.username){
    res.status(400).json({ error: 'Please provide a username' }) // ✅
  }else if(!user.password){
    res.status(400).json({ error: 'Please provide a password' }) // ✅
  }else if(!user.first_name){
    res.status(400).json({ error: 'Please provide a first_name' }) // ✅
  }else if(!user.last_name){
    res.status(400).json({ error: 'Please provide a last_name' }) // ✅
  }else if(!user.email){
    res.status(400).json({ error: 'Please provide a email' }) // ✅
  }else if(!user.date_of_birth){
    res.status(400).json({ error: 'Please provide a date_of_birth' }) // ✅
  }else{
    authDB.findByUsername(user.username)
      .then(username => {
        if(username){
          res.status(400).json({ error: 'Username is already in the database' }) // ✅
        }else{
          authDB.findByEmail(user.email)
            .then(email => {
              if(email){
                res.status(400).json({ error: 'Email is already in the database' }) // ✅
              }else{
                req.user = user;
                next(); // ✅
              }
            })
        }
      })
  }
}

module.exports = validateRegister;