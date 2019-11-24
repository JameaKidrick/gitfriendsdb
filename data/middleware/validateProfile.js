const validateProfile = (req, res, next) => {
  const profile = req.body;

  if(!profile.avatar){
    res.status(400).json({ error: 'Please choose an avatar' }) // ✅
  }else if(!profile.dob_display){
    res.status(400).json({ error: 'Please choose your date of birth display setting' }) // ✅
  }else{
    next(); // ✅
  }
}

module.exports = validateProfile;