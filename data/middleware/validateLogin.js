const validateLogin = (req, res, next) => {
  const user = req.body

  if(!user.username){
    res.status(400).json({ error: 'Please provide a username' }) // ✅
  }else if(!user.password){
    res.status(400).json({ error: 'Please provide a password' }) // ✅
  }else{
    req.user = user;
    next(); // ✅
  }
}

module.exports = validateLogin;