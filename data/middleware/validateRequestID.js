const requestDB = require('../requests/requestModel');

const validateRequestID = (req, res, next) => {
  const id = Number(req.params.requestid)
console.log(id)
  requestDB.findBy(id)
    .then(request => {
      if(!request){
        res.status(404).json({ error: `A request with the id ${id} does not exist in the database` }) // ✅
      }else{
        next(); // ✅
      }
    })
}

module.exports = validateRequestID;