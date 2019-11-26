// check if admin status id exists

const adminDB = require('../admin/adminModel');

const validateAdminStatusID = (req, res, next) => {
  const id = Number(req.params.id)
  adminDB.findById(id)
    .then(findStatus => {
      if(findStatus){
        next()
      }else{
        res.status(400).json({ error: `There is not status with the ID ${id} in the database` })
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
};

module.exports = validateAdminStatusID;