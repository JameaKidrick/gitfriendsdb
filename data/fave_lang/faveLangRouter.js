const express = require('express');

const router = express.Router();

const faveLangDB = require('./faveLangModel');
const profileDB = require('../profile/profileModel');

const validateProfileID = require('../middleware/validateProfileID')

/******************************* Middleware *******************************/
const validateJxnID = (req, res, next) => {
  faveLangDB.findBy(req.params.id)
    .then(jxn => {
      if(!jxn){
        res.status(400).json({ error: `There is no favorite language jxn with id ${req.params.id} in the database` }) // ✅
      }else{
        next() // ✅
      }
    })
}

/******************************* Route Handlers *******************************/

// GET LANGUAGE LIST
router.get('/fave', (req, res) => {
  faveLangDB.find()
    .then(languages => {
      res.status(200).json(languages) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// GET SPECIFIC FAVORITE LANGUAGE JXN BY ID
router.get('/fave/:id', [validateJxnID], (req, res) => {
  faveLangDB.findBy(req.params.id)
    .then(faveJxn => {
      res.status(200).json(faveJxn) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// GET FAVE LANGUAGE LIST BY PROFILE ID
router.get('/profiles/:profileid/fave', [validateProfileID], (req, res) => {
  faveLangDB.findByProfile(req.params.profileid)
    .then(findList => {
      res.status(201).json(findList) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// UPDATE LANGUAGE(S)
router.post('/profiles/:profileid/updateFave', [validateProfileID], (req, res) => {
  const profile_id = Number(req.params.profileid);
  const newLanguage = req.body;
  newLanguage.profile_id = profile_id;

  profileDB.findBy(profile_id)
  .then(profile => {
      if(req.decodeJwt.id === profile.user_id){
        faveLangDB.update(profile_id, newLanguage)
        .then(language => {
          console.log(language)
          res.status(201).json(language)
        })
          // .catch(error => {
          //   res.status(500).json({ error: 'Internal server error ', error }) // ✅
          // })  
      }else{
        res.status(403).json({ error: 'User does not have the authorization to alter language list' }) // ✅
      }
    })
    // .catch(error => {
    //   res.status(500).json({ error: 'Internal server error ', error })
    // })
})

// ADD LANGUAGE
router.post('/profiles/:profileid/fave', [validateProfileID], (req, res) => {
  const profile_id = Number(req.params.profileid);
  const newLanguage = req.body;
  newLanguage.profile_id = profile_id;

  profileDB.findBy(profile_id)
  .then(profile => {
      if(req.decodeJwt.id === profile.user_id){
        faveLangDB.findByProfileCompare(profile_id, newLanguage.language_id)
          .then(jxn => {
            if(jxn[0]){
              res.status(400).json({ error: `You have already added the language: ${jxn[0].language}` })
            }else{
              console.log(newLanguage)
              if(!newLanguage){
                res.status(400).json({ error: 'Please add at least one language' })
              }else{
                faveLangDB.add(newLanguage)
                  .then(language => {
                    res.status(201).json(language)
                  })
                  .catch(error => {
                    res.status(500).json({ error: 'Internal server error ', error }) // ✅
                  })
              }
            }
          })
      }else{
        res.status(403).json({ error: 'User does not have the authorization to alter language list' }) // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// DELETE LANGUAGE
router.delete('/fave/:id', [validateJxnID], (req, res) => {
  faveLangDB.findBy(req.params.id)
    .then(jxn => {
      profileDB.findBy(jxn.profile_id)
        .then(profile => {
          if(req.decodeJwt.id === profile.user_id){
            faveLangDB.remove(req.params.id)
              .then(deleted => {
                res.status(201).json({ DELETED: deleted })
              })
              .catch(error => {
                res.status(500).json({ error: 'Internal server error ', error }) // ✅
              })
          }else{
            res.status(403).json({ error: 'User does not have the authorization to alter language list' }) // ✅
          }
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal server error ', error })
        })
    })
})

module.exports = router;