const requestDB = require("../requests/requestModel");

const validateFriendID = (req, res, next) => {
  const id = Number(req.params.requestid);
  // console.log("MIDDLEWARE ENTER", id);
  requestDB.findFriendStatusBy(id).then(request => {
    if (!request) {
      res.status(404).json({
        error: `A request with the id ${id} does not exist in the database`
      }); // ✅
    } else {
      // console.log("MIDDLEWARE NEXT", request);
      next(); // ✅
    }
  });
};

module.exports = validateFriendID;
