const profileDB = require('../profile/profileModel');

const validateProfileID = (req, res, next) => {
  profileDB.findBy(req.params.profileid)
    .then(profile => {
      if(!profile){
        res.status(404).json({ error: `A profile with the id ${req.params.profileid} does not exist in the database` }) // ✅
      }else{
        next(); // ✅
      }
    })
}

module.exports = validateProfileID;