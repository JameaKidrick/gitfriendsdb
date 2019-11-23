const express = require('express');

const profileDB = require('./profileModel');

const router = express.Router();

router.get('/profiles', (req, res) => {
  profileDB.find()
    .then(profiles => {
      res.status(200).json(profiles)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

router.get('/profiles/:id', (req, res) => {
  profileDB.findBy(req.params.id)
    .then(profile => {
      res.status(200).json(profile)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

router.get('/users/:id/profile', (req, res) => {
  profileDB.findByUser(req.params.id)
    .then(profile => {
      res.status(200).json(profile)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

router.post('/users/:id/profile', (req, res) => {
  const profile = req.body;
  const id = req.params.id;
  profile.user_id = id;

  profileDB.add(req.body)
    .then(newProfile => {
      res.status(201).json(newProfile)
    })
})

router.put('/profiles/:id', (req, res) => {
  profileDB.update(req.params.id, req.body)
    .then(updatedProfile => {
      res.status(201).json(updatedProfile)
    })
})

router.delete('/profiles/:id', (req, res) => {
  profileDB.remove(req.params.id)
    .then(deletedProfile => {
      res.status(201).json({'DELETED':deletedProfile})
    })
})

module.exports = router;