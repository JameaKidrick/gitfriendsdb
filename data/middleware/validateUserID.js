const usersDB = require('../users/usersModel');

const validateUserID = (req, res, next) => {
  const id = req.params.userid

  usersDB.findByIdShort(id)
    .then(user => {
      if(!user){
        res.status(404).json({ error: `A user with the id ${id} does not exist in the database` }) // ✅
      }else{
        next(); // ✅
      }
    })
}

module.exports = validateUserID;