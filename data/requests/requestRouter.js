const express = require('express');

const verifyToken = require('../authorization/authMiddleware');

const requestDB = require('./requestModel');

const router = express.Router();

// GET ALL REQUESTS (ADMIN ONLY)
router.get('/requests', (req, res) => {
  requestDB.find()
    .then(requests => {
      res.status(200).json(requests)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC REQUEST (USER AND ADMIN ONLY)
router.get('/requests/:id', (req, res) => {
  requestDB.findBy(req.params.id)
    .then(request => {
      res.status(200).json(request)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET LIST OF ALL USER'S REQUESTS (USER AND ADMIN ONLY)
router.get('/users/:id/requests', [verifyToken], (req, res) => {
  requestDB.findByUser(req.params.id)
    .then(userRequests => {
      res.status(200).json(userRequests)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// SEND FRIEND REQUEST (USER ONLY)
router.post('/users/:id/requests', [verifyToken], (req, res) => {
  const friend_id = req.params.id;

  if(req.user_id < friend_id){
    request = {
      "user1_id": req.user_id,
      "user2_id": friend_id,
      "requestor_id": req.user_id
    }
  }else{
    request = {
      "user1_id": friend_id,
      "user2_id": req.user_id,
      "requestor_id": req.user_id
    }
  }
  
  requestDB.send(request)
    .then(friendRequest => {
      res.status(201).json({ message: 'Friend request sent' })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    }) 
})

// REPLY TO FRIEND REQUEST (USER ONLY)
router.put('/users/:userid/requests/:requestid', [verifyToken], (req, res) => {
  const user_id = req.params.userid;
  const request_id = req.params.requestid;
  const status = req.body;

  if(req.user_id === Number(user_id)){ // verify user
  requestDB.findBy(request_id)
    .then(request => {
      if(Number(user_id) != request.requestor_id && ( Number(user_id) === request.user1_id || Number(user_id) === request.user2_id)){ // verify user is not requestor, but is one of the users
        requestDB.decide(request_id, status)
          .then(updateRequest => {
            if(updateRequest.request_status === 2){ // sets mutual friendship when friend request is accepted
              res.status(201).json({'Friend Request Accepted': updateRequest})
            }else if(updateRequest.request_status === 3){ // removes friend request when friend request is denied
              requestDB.remove(request_id)
                .then(deletedRequest => {
                  res.status(201).json({'Friend Request Denied and Request Deleted': updateRequest})
                })
            }
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
    res.status(403).json({ error: 'User does not have authorization to alter this friend request' })
  }
})

// DELETE FRIEND REQUEST (USER AND ADMIN ONLY)
router.delete('/requests/:id', (req, res) => {
  const request_id = req.params.id;

  requestDB.remove(request_id)
    .then(deletedRequest => {
      res.status(201).json({ 'DELETED':deletedRequest })
    })
})

module.exports = router;