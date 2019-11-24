const requestDB = require('../requests/requestModel');

const validateRequestID = (req, res, next) => {
  requestDB.findBy(req.params.requestid)
    .then(request => {
      if(!request){
        res.status(404).json({ error: `A request with the id ${req.params.id} does not exist in the database` }) // ✅
      }else{
        next(); // ✅
      }
    })
}

module.exports = validateRequestID;