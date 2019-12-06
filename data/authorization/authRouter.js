const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authDB = require('../users/usersModel');
const adminDB = require('../admin/adminModel');
const profileDB = require('../profile/profileModel');

const validateRegister = require('../middleware/validateRegister');
const validateLogin = require('../middleware/validateLogin');
const validateAdminStatusExistence = require('../middleware/validateAdminStatusExistence');

const router = express.Router();

function getJwtToken(id, username, role){
  const payload = {
    id,
    username,
    role
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign({payload}, secret, options);
};

router.post('/register/checkUsername', (req, res) => {
  authDB.findByUsername(req.body.username)
    .then(username => {
      if(username){
        res.status(400).json({ error: 'Username is already in the database' }) // ✅
      }
    })
})

router.post('/register/checkEmail', (req, res) => {
  authDB.findByEmail(req.body.email)
    .then(email => {
      if(email){
        res.status(400).json({ error: 'Email is already in the database' }) // ✅
      }
    })
})

router.post('/register', [validateRegister], (req, res) => {
  const hash = bcrypt.hashSync(req.user.password, 10); 
  req.user.password = hash;
  
  if(req.user.role === 'pending admin'){
    validateAdminStatusExistence
    authDB.add(req.user) // add user to users table
      .then(store => {
        authDB.findByUsername(req.user.username) // find user in users table
          .then(newUser => {
            adminDB.add(newUser.user_id) // add user to admin table
              .then(newAdmin=> {
                const token = getJwtToken(newUser.user_id, newUser.username,newUser.role)
                res.status(201).json({ message: `Your request to be an admin has been successfully submitted. Your request id is: ${newAdmin[0]}. You will receive a notification upon approval or decline.`,'New User Created': newUser.username, 'ID':newUser.user_id, token }) // ✅
              })
              .catch(error => {
                res.status(500).json({ error: 'Internal server error ', error }) // ✅
              })
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error ', error }) // ✅
          })
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error ', error }) // ✅
      })
  }else{
    authDB.add(req.user)
      .then(store => {
        authDB.findByUsername(req.user.username)
          .then(newUser => {
            const token = getJwtToken(newUser.user_id, newUser.username,newUser.role)
            res.status(201).json({ 'username': newUser.username, 'userid':newUser.user_id, token }) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error ', error }) // ✅
          })
      })
  }
})

router.post('/login', [validateLogin], (req, res) => {
  const { username, password } = req.user;

  authDB.findByUsername(username)
    .then(findUser => {
      if(findUser && bcrypt.compareSync(password, findUser.password)){
        const token = getJwtToken(findUser.user_id, findUser.username,findUser.role)
        
        profileDB.findByUser(findUser.user_id)
          .then(findProfile => {
            res.status(201).json({ 'username': findUser.username, 'userid': findUser.user_id, 'profileid': findProfile.profile_id, token }) // ✅
          })
      }else{
        res.status(401).json({ error: 'Invalid credentials' }) // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    });
})

module.exports = router;