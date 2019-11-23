const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authDB = require('./authModel');

const validateRegister = require('../middleware/validateRegister');
const validateLogin = require('../middleware/validateLogin');

const router = express.Router();

function getJwtToken(id, username){
  const payload = {
    id,
    username
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, secret, options);
};


router.post('/register', [validateRegister], (req, res) => {
  const hash = bcrypt.hashSync(req.user.password, 10); 
  req.user.password = hash;

    authDB.add(req.user)
      .then(store => {
        authDB.findByUsername(req.user.username)
          .then(newUser => {
            const token = getJwtToken(req.user.id, req.user.username)
            res.status(201).json({ 'New User Created': req.user.username, token }) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error ', error })
          })
      })
})

router.post('/login', [validateLogin], (req, res) => {
  const { username, password } = req.user;

  authDB.findByUsername(username)
    .then(findUser => {
      if(findUser && bcrypt.compareSync(password, findUser.password)){
        const token = getJwtToken(findUser.id, findUser.username)
        res.status(200).json({ message: `Welcome ${findUser.username}!`, token }) // ✅
      }else{
        res.status(401).json({ message: 'Invalid credentials' })
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    });

})

module.exports = router;