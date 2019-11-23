const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authDB = require('./authModel');

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


router.post('/register', (req, res) => {
  let user = req.body;

  if(!user.username || !user.password){
    res.status(400).json({ error: 'Please provide a username and password' })
  }else{
    const hash = bcrypt.hashSync(user.password, 10); 
    user.password = hash;
  }

  return authDB.findByUsername(user.username)
    .then(findUser => {
      if(findUser){
        res.status(400).json({ error: 'Username is already in the database' })
      }else{
        authDB.add(user)
          .then(store => {
            authDB.findByUsername(user.username)
              .then(newUser => {
                const token = getJwtToken(user.id, user.username)
                res.status(201).json({ 'New User Created': user.username, token })
              })
              .catch(error => {
                res.status(500).json({ error: 'Internal server error ', error })
              })
          })
      }
    })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if(!username || !password){
    res.status(400).json({ error: 'Please provide a username and password' })
  }else{
    authDB.findByUsername(username)
      .then(findUser => {
        if(findUser && bcrypt.compareSync(password, findUser.password)){
          const token = getJwtToken(findUser.id, findUser.username)
          res.status(200).json({ message: `Welcome ${findUser.username}!`, token })
        }else{
          res.status(401).json({ message: 'Invalid credentials' })
        }
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error ', error })
      });
  }
})

module.exports = router;