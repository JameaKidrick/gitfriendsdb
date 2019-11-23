const express = require('express');

const verifyToken = require('../authorization/authMiddleware');

const requestDB = require('./requestModel');
const authDB = require('../authorization/authModel');

const router = express.Router();

router.get('/requests', (req, res) => {
  requestDB.find()
    .then(requests => {
      res.status(200).json(requests)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

router.get('/requests/:id', (req, res) => {
  requestDB.findBy(req.params.id)
    .then(request => {
      res.status(200).json(request)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

router.get('/users/:id/requests', (req, res) => {
  requestDB.findByUser(req.params.id)
    .then(userRequests => {
      res.status(200).json(userRequests)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

router.post('/users/:id/requests', [verifyToken], (req, res) => {
  const friend_id = req.params.id;
  
  authDB.findByUsername(req.decodeJwt.username)
    .then(user => {
      if(user.user_id < friend_id){
        request = {
          "user1_id": user.user_id,
          "user2_id": friend_id,
          "requestor_id": user.user_id
        }
      }else{
        request = {
          "user1_id": friend_id,
          "user2_id": user.user_id,
          "requestor_id": user.user_id
        }
      }
      
      requestDB.send(request)
        .then(friendRequest => {
          console.log(friendRequest)
          res.status(201).json({ message: 'Friend request sent' })
        })
    })

})

module.exports = router;