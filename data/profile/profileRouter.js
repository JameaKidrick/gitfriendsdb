const express = require('express');

const verifyToken = require('../authorization/authMiddleware');
const validateProfileID = require('../middleware/validateProfileID');
const validateProfile = require('../middleware/validateProfile');
const validateUserID = require('../middleware/validateUserID');

const profileDB = require('./profileModel');

const router = express.Router();

// GET ALL PROFILES
router.get('/profiles', (req, res) => {
  profileDB.find()
    .then(profiles => {
      res.status(200).json(profiles) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET PROFILE BY ID
router.get('/profiles/:profileid', [verifyToken, validateProfileID], (req, res) => {
  profileDB.findBy(req.params.profileid)
    .then(profile => {
      res.status(200).json(profile) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET PROFILE BY USER ID
router.get('/users/:userid/profile', [verifyToken, validateUserID], (req, res) => {
  profileDB.findByUser(req.params.userid)
    .then(profile => {
      res.status(200).json(profile) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// ADD PROFILE
router.post('/users/:userid/profile', [verifyToken, validateProfile, validateUserID], (req, res) => {
  const profile = req.body;
  const id = Number(req.params.userid);
  profile.user_id = id;

  if(req.decodeJwt.id === id){
    profileDB.findByUser(id)
    .then(userProfile => {
      if(userProfile){
        res.status(400).json({ error: 'User already has a profile' }) // ✅
      }else{
        profileDB.add(req.body)
          .then(newProfile => {
            res.status(201).json(newProfile) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
  }else{
    res.status(403).json({ error: 'User does not have authorization to alter this profile' }) // ✅
  }
})

router.put('/profiles/:profileid', [verifyToken, validateProfileID], (req, res) => {
  const id = Number(req.params.profileid);

  profileDB.findByUser(req.decodeJwt.id)
  .then(profile => {
    if(profile.profile_id === id){
      profileDB.update(id, req.body)
      .then(updatedProfile => {
        res.status(201).json(updatedProfile) // ✅
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', error })
      })
    }else{
      res.status(403).json({ error: 'User is not authorized to update this profile' }) // ✅
    }
  })
})

router.delete('/profiles/:profileid', [verifyToken, validateProfileID], (req, res) => {
  const id = Number(req.params.profileid);

  profileDB.findByUser(req.decodeJwt.id)
    .then(profile => {
      if(profile.profile_id === id){
        profileDB.remove(req.params.profileid)
        .then(deletedProfile => {
          res.status(201).json({'DELETED':deletedProfile}) // ✅
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal server error', error })
        })
      }else{
        res.status(403).json({ error: 'User is not authorized to update this profile' }) // ✅
      }
    })
})

module.exports = router;