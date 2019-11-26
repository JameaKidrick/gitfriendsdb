const postsDB = require('../posts/postsModel');

const validatePostID = (req, res, next) => {
  const id = Number(req.params.postid);
  postsDB.findById(id)
    .then(post => {
      if(!post){
        res.status(404).json({ error: `Post with the id ${id} has not been found in the database` });
      }else{
        next();
      }
    })
}

module.exports = validatePostID;