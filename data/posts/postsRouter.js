const express = require('express');

const router = express.Router();

const postsDB = require('./postsModel');

const validatePost = require('../middleware/validatePost');
const validatePostID = require('../middleware/validatePostID');
const validateUserID = require('../middleware/validateUserID');

// GET ALL POSTS (USERS AND ADMINS)
router.get('/posts', (req, res) => {
  postsDB.find()
    .then(posts => {
      res.status(200).json(posts) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC POST BY ID (USERS AND ADMINS)
router.get('/posts/:postid', [validatePostID], (req, res) => {
  postsDB.findById(req.params.postid)
    .then(post => {
      res.status(200).json(post) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET ALL POSTS BY USER ID OR PROFILE ID (USERS AND ADMINS)
router.get('/users/:userid/posts', [validateUserID], (req, res) => {
  postsDB.findByUser(req.params.userid)
    .then(posts => {
      if(!posts[0]){
        res.status(400).json({ message: 'User has no posts' }) // ✅
      }else{
        res.status(200).json(posts) // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET ALL POSTS BY USER ID AND SHOW USER (USERS AND ADMINS)
router.get('/users/:userid/posts/full', [validateUserID], (req, res) => {
  postsDB.findByUserFull(req.params.userid)
    .then(posts => {
      if(!posts.post[0]){
        res.status(400).json({ message: 'User has no posts' }) // ✅
      }else{
        res.status(200).json(posts) // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// ADD NEW POST (OWNER)
router.post('/posts', [validatePost], (req, res) => {
  const post = req.body;
  post.user_id = req.decodeJwt.id

  postsDB.add(post)
    .then(newPost => {
      res.status(201).json(newPost) // ✅
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// UPDATE POST (OWNER)
router.put('/posts/:postid', [validatePostID], (req, res) => {
  const id = Number(req.params.postid);

  postsDB.findById(id)
    .then(post => {
      if(post.user_id === req.decodeJwt.id){
        postsDB.update(req.params.postid, req.body)
          .then(updatedPost => {
            res.status(201).json({ UPDATED: updatedPost }) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }else{
        res.status(403).json({ error: 'User is not authorized to update this post' }) // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// DELETE POST (OWNER AND ADMIN)
router.delete('/posts/:postid', [validatePostID], (req, res) => {
  const id = Number(req.params.postid);
  
  postsDB.findById(id)
    .then(post => {
      if(post.user_id === req.decodeJwt.id || req.decodeJwt.role === 'admin'){
        postsDB.remove(req.params.postid)
          .then(deletedPost => {
            res.status(201).json({ DELETED: deletedPost }) // ✅
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }else{
        res.status(403).json({ error: 'User is not authorized to update this post' }) // ✅
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

module.exports = router;