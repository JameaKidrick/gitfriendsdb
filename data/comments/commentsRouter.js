const express = require('express'); 

const router = express.Router();

const commentsDB = require('./commentsModel');

const validateCommentID = require('../middleware/validateCommentID');
const validateUserID = require('../middleware/validateUserID');
const validatePostID = require('../middleware/validatePostID');

// GET ALL COMMENTS (USERS AND ADMIN)
router.get('/comments', (req, res) => {
  commentsDB.find()
    .then(comments => {
      res.status(200).json(comments)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET SPECIFIC COMMENT (USERS AND ADMIN)
router.get('/comments/:commentid', [validateCommentID], (req, res) => {
  commentsDB.findById(req.params.commentid)
    .then(comment => {
      res.status(200).json(comment)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET COMMENTS BY USER ID (USERS AND ADMIN)
router.get('/users/:userid/comments', [validateUserID], (req, res) => {
  commentsDB.findByUserId(req.params.userid)
    .then(comments => {
      res.status(200).json(comments)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET COMMENTS BY POST ID (USERS AND ADMIN)
router.get('/posts/:postid/comments', [validatePostID], (req, res) => {
  commentsDB.findByPostId(req.params.postid)
    .then(comments => {
      res.status(200).json(comments)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET COMMENTS BY USER ID FULL (WITH USER INFO) (USERS AND ADMIN)
router.get('/users/:userid/comments/full', [validateUserID], (req, res) => {
  commentsDB.findByUserIdFull(req.params.userid)
    .then(comments => {
      res.status(200).json(comments)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// GET COMMENTS BY POST ID FULL (WITH POST INFO) (USERS AND ADMIN)
router.get('/posts/:postid/comments/full', [validatePostID], (req, res) => {
  commentsDB.findByPostIdFull(req.params.postid)
    .then(comments => {
      res.status(200).json(comments)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// ADD NEW COMMENT (OWNER)
router.post('/posts/:postid/comments', [validatePostID], (req, res) => {
  const comment = req.body;
  comment.user_id = req.decodeJwt.id;
  const postid = req.params.postid;
  comment.post_id = postid;

  if(!comment.comment){
    res.status(400).json({ error: 'Please add a comment' })
  }else{
    commentsDB.add(comment)
      .then(newComment => {
        res.status(201).json(newComment)
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error', error })
      })
  }
})

// UPDATE COMMENT (OWNER)
router.put('/comments/:commentid', [validateCommentID], (req, res) => {
  const id = Number(req.params.commentid);
  const changes = req.body;

  commentsDB.findById(id)
    .then(comment => {
      if(req.decodeJwt.id === comment.user_id){
        commentsDB.update(id, changes)
        .then(updatedComment => {
          res.status(201).json({ UPDATED: updatedComment })
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal server error', error })
        })
      }else{
        res.status(403).json({ error: 'User is not authorized to update this comment' })
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

// DELETE COMMENT (OWNER AND ADMIN)
router.delete('/comments/:commentid', [validateCommentID], (req, res) => {
  const id = Number(req.params.commentid);

  commentsDB.findById(id)
    .then(comment => {
      if(req.decodeJwt.id === comment.user_id || req.decodeJwt.role === 'admin'){
        commentsDB.remove(id)
          .then(deletedComment => {
            res.status(201).json({ DELETED: deletedComment })
          })
          .catch(error => {
            res.status(500).json({ error: 'Internal server error', error })
          })
      }else{
        res.status(403).json({ error: 'User is not authorized to delete this comment' })
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error', error })
    })
})

module.exports = router;