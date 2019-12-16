const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const usersDB = require('./usersModel');

const validateUserID = require('../middleware/validateUserID');
const validateUsername = require('../middleware/validateUsername');
const validateEmail = require('../middleware/validateEmail');

// GET ALL USERS (USER AND ADMIN)
router.get('/', (req, res) => {
  usersDB.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC USER
router.get('/user', (req, res) => {

  usersDB.findById(req.decodeJwt.id)
    .then(user => {
      res.status(200).json({ userid:req.decodeJwt.id, username:req.decodeJwt.username, role:req.decodeJwt.role, profileid:user.profile_id })
    })
    // .catch(error => {
    //   res.status(500).json({ error: 'Internal server error', error })
    // })
})

// GET SPECIFIC USER (ONLY FOR CREATE PROFILE PAGE 1)
router.get('/user/create', (req, res) => {

  usersDB.findByIdShort(req.decodeJwt.id)
    .then(user => {
      
        res.status(200).json({ userid:req.decodeJwt.id, username:req.decodeJwt.username, role:req.decodeJwt.role })
    })
    // .catch(error => {
    //   res.status(500).json({ error: 'Internal server error', error })
    // })
})

// UPDATE USER (PASSWORD => USER NEEDS TO GO THROUGH CONFIRMATION FIRST)
router.put('/:userid', [validateUserID, validateUsername, validateEmail], (req, res) => {
  const userid = Number(req.params.userid);
  let changes = req.body;

  if(req.decodeJwt.id === userid){ // if logged in user is user that owns account
    if(changes.password){ // if user is trying to change password(pw)
      if(!changes.confirmpassword){ // if there is confirm pw is missing
        res.status(401).json({ message: 'Please confirm your password' })
      }else{
        usersDB.findById(userid)
          .then(findUser => {
            if(bcrypt.compareSync(changes.confirmpassword, findUser.password)){ // compare confirmpassword to encrypted pw
              delete changes.confirmpassword
              const hash = bcrypt.hashSync(changes.password, 10); 
              changes.password = hash;
              usersDB.update(userid, changes)
                .then(update => {
                  res.status(201).json(update)
                })
            }else{
              res.status(401).json({ message: 'Invalid credentials' })
            }
          })
      }
    }else{
      usersDB.update(userid, changes)
        .then(update => {
          res.status(201).json(update)
        })
    }
  }else{
    res.status(403).json({ error: 'User does not have authorization to alter this account' })
  }
})

// DELETE USER (USER OR ADMIN)
router.delete('/:userid', [validateUserID], (req, res) => {
  const userid = Number(req.params.userid);

  if(req.decodeJwt.id === userid || (req.decodeJwt.role === 'admin')){
    usersDB.remove(userid)
      .then(deleted => {
        res.status(201).json({ DELETED: deleted })
      })
  }else{
    res.status(403).json({ error: 'User does not have authorization to delete this account' })
  }
})

module.exports = router;