const usersDB = require('../users/usersModel');

const validateUserID = (req, res, next) => {
  usersDB.findById(req.params.id)
    .then(user => {
      if(!user){
        res.status(404).json({ error: `A user with the id ${req.params.id} does not exist in the database` })
      }else{
        next();
      }
    })
}

module.exports = validateUserID;