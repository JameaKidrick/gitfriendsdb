// check if status already pending from user

const adminDB = require('../admin/adminModel');

const validateAdminStatusExistence = (req, res, next) => {
  const user = req.user;
  adminDB.findByUsername(user.username)
    .then(request => {
      if(request && request_status === 1){
        res.status(400).json({ error: `There is already a pending request under this username. If you want an update on your application, please contact the head admin, Mea, about admin request number ${request.admin_status_id}` })
      }else if(request && request_status === 2){
        res.status(400).json({ error: 'User is already an admin' })
      }else{
        next();
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
}

module.exports = validateAdminStatusExistence;