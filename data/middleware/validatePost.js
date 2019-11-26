const validatePost = (req, res, next) => {
  if(!req.body.post){
    res.status(400).json({ error: 'Please add a body to your post' }); // ✅
  }else{
    next(); // ✅
  }
}

module.exports = validatePost;