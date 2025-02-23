const express = require('express');

const validateUserID = require('../middleware/validateUserID');
const validateRequestID = require('../middleware/validateRequestID');
const validateFriendID = require('../middleware/validateFriendID');

const requestDB = require('./requestModel');

const router = express.Router();

// GET ALL REQUESTS (ADMIN ONLY)
router.get('/requests', (req, res) => {
  if(req.decodeJwt.role === 'admin'){
    requestDB.find()
      .then(requests => {
        res.status(200).json(requests) // ✅
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', error })
      })
  }else{
    res.status(403).json({ message: `You do not have the authorization to go further. Authorization needed: administrator` }) // ✅
  }
})

// GET ALL FRIENDS (ADMIN ONLY)
router.get('/friends', (req, res) => {
  if(req.decodeJwt.role === 'admin'){
    requestDB.findFriends()
      .then(friends => {
        res.status(200).json(friends) // ✅
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', error })
      })
  }else{
    res.status(403).json({ message: `You do not have the authorization to go further. Authorization needed: administrator` }) // ✅
  }
})

// GET SPECIFIC REQUEST
router.get('/requests/:requestid', [validateRequestID], (req, res) => {
    requestDB.findBy(req.params.requestid)
      .then(request => {
        res.status(200).json(request) // ✅
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', error })
      })
})

// GET LIST OF ALL USER'S REQUESTS (USER AND ADMIN ONLY)
router.get('/users/:userid/requests', [validateUserID], (req, res) => {
  if(req.decodeJwt.role === 'admin' || req.decodeJwt.id === Number(req.params.userid)){
  requestDB.findByUser(req.params.userid)
    .then(userRequests => {
      if(!userRequests.length){
        res.status(400).json({ error: 'No new requests' }) // ✅
      }else{
          res.status(200).json(userRequests)
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
  }else{
    res.status(403).json({ error: 'Unauthorized' }) // ✅
  }
})

// GET LIST OF ALL USER'S FRIENDS (USER AND ADMIN ONLY)
router.get('/users/:userid/friends', [validateUserID], (req, res) => {
  if(req.decodeJwt.role === 'admin' || req.decodeJwt.id === Number(req.params.userid)){
    requestDB.findFriendsByUser(req.params.userid)
      .then(userRequests => {
        if(!userRequests.length){
          res.status(400).json({ message: 'User has no friends （；´д｀）' }) // ✅
        }else{
          res.status(200).json(userRequests) // ✅
        }
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', error })
      })
  }else{
    res.status(403).json({ error: 'Unauthorized' }) // ✅
  }
})

// GET FRIEND REQUEST BY PAIR
router.get('/users/:userid/status/:friendid', [validateUserID], (req, res) => {
  const firstUser_id = Number(req.params.userid);
  const secondUser_id = Number(req.params.friendid);
  console.log(req.params.userid, req.params.friendid)
  requestDB.findByPair(firstUser_id, secondUser_id)
    .then(request => {
      console.log(request)
      res.status(200).json(request)
    })
})

// SEND FRIEND REQUEST (USER ONLY)
router.post('/users/:userid/requests', [validateUserID], (req, res) => {
  const friend_id = Number(req.params.userid);
  console.log(req.params.userid)

  if(req.decodeJwt.id === friend_id){
    request = 0;
  }else if(req.decodeJwt.id < friend_id){
    request = {
      "user1_id": req.decodeJwt.id,
      "user2_id": friend_id,
      "requestor_id": req.decodeJwt.id
    }
  }else{
    request = {
      "user1_id": friend_id,
      "user2_id": req.decodeJwt.id,
      "requestor_id": req.decodeJwt.id
    }
  }

  if(request === 0){
    res.status(400).json({ error: 'User can not send a friend request to theirself' }) // ✅
  }else{
    requestDB.findByPair(request.user1_id, request.user2_id)
    .then(pair => {
      if(!pair){
        requestDB.send(request)
          .then(friendRequest => {
            res.status(201).json({ message: 'Friend request sent' }) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }else{
        res.status(400).json({ message: 'Friend request was already sent, please wait for a response' }) // ✅
      }
    })
  }
})

// REPLY TO FRIEND REQUEST (USER ONLY)
router.put('/users/:userid/requests/:requestid', [validateUserID, validateRequestID], (req, res) => {
  const user_id = Number(req.params.userid);
  const request_id = Number(req.params.requestid);
  const status = req.body;

  if(req.decodeJwt.id === user_id){ // verify user
  requestDB.findBy(request_id)
    .then(request => {
      if(user_id != request.requestor_id && (user_id) === request.user1_id || user_id === request.user2_id){ // verify user is not requestor, but is one of the users
        requestDB.decide(request_id, status)
          .then(updateRequest => {
            if(updateRequest.request_status === 2){ // sets mutual friendship when friend request is accepted
              res.status(201).json({'Friend Request Accepted': updateRequest}) // ✅
            }else if(updateRequest.request_status === 3){ // removes friend request when friend request is denied
              requestDB.remove(request_id)
                .then(deletedRequest => {
                  res.status(201).json({'Friend Request Denied and Request Deleted': updateRequest}) // ✅
                })
            }
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }else{
        res.status(400).json({ error: 'User does not have the authorization to accept or decline request - 2' }) // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
  }else{
    res.status(403).json({ error: 'User does not have the authorization to alter this friend request - 1' }) // ✅
  }
})

// DELETE FRIEND REQUEST (USER AND ADMIN ONLY)
router.delete('/requests/:requestid', [validateRequestID], (req, res) => {
  const request_id = req.params.requestid;

  requestDB.findBy(request_id)
    .then(request => {
      if((req.decodeJwt.id === request.requestor_id) || (req.decodeJwt.role === 'admin')){
        requestDB.remove(request_id)
          .then(deletedRequest => {
            res.status(201).json({ 'DELETED':deletedRequest }) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }else{
        res.status(400).json({ error: 'User does not have the authorization to delete this request' })
      }
    })
})

// DELETE FRIEND (USER AND ADMIN ONLY)
router.delete('/friends/:requestid', [validateFriendID], (req, res) => {
  const request_id = Number(req.params.requestid);

  requestDB.findFriendStatusBy(request_id)
    .then(request => {
      if((req.decodeJwt.id === request.user1_id) || (req.decodeJwt.id === request.user2_id)  || (req.decodeJwt.role === 'admin')){
        requestDB.remove(request_id)
          .then(deletedFriend => {
            res.status(201).json({ 'DELETED':deletedFriend }) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }else{
        res.status(400).json({ error: 'User does not have the authorization to delete this request' })
      }
    })
})

module.exports = router;