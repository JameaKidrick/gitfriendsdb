const commentsDB = require('../comments/commentsModel');

const validateCommentID = (req, res, next) => {
  const id = Number(req.params.commentid);

  commentsDB.findById(id)
    .then(comment => {
      if(!comment){
        res.status(404).json({ error: `A comment with the id ${id} does not exist in the database` })
      }else{
        next();
      }
    })
}

module.exports = validateCommentID;