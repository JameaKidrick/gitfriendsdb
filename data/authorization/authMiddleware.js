const jwt = require('jsonwebtoken');
const authDB = require('./authModel');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if(token){
    const secret = process.env.JWT_SECRET

    jwt.verify(token, secret, (err, decodedToken) => {
      if(err){
        res.status(401).json({ error: 'Invalid credentials' })
      }else{
        authDB.findByUsername(decodedToken.username)
        .then(user => {
          req.user_id = user.user_id 
          req.decodeJwt = decodedToken;
          next();
        })
      }
    })
  }else{
    res.status(400).json({ error: 'Please provide credentials' })
  }
}