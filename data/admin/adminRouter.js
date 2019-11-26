const express = require('express');

const router = express.Router();

const adminDB = require('./adminModel');
const usersDB = require('../users/usersModel');

const validateAdminStatus = require('../middleware/validateAdminStatus')
const validateAdminStatusID = require('../middleware/validateAdminStatusID')
const validateUserID = require('../middleware/validateUserID')

/******************************* Middleware *******************************/
const validateAdminRole = (req, res, next) => {
  if(req.decodeJwt.role === 'admin'){
    next()
  }else{
    res.status(403).json({ error: 'User does not have the authorization to go further. Authorization needed: administrator' })
  }
}

/******************************* Route Handlers *******************************/

// GET ALL ADMINS
router.get('/', [validateAdminRole], (req, res) => {
  adminDB.find()
    .then(admins => {
      res.status(200).json(admins)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// GET SPECIFIC ADMIN STATUS BY ID
router.get('/:id', [validateAdminRole, validateAdminStatusID], (req, res) => {
  adminDB.findById(req.params.id)
    .then(admin => {
      res.status(200).json(admin)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// GET SPECIFIC ADMIN STATUS BY USERID
router.get('/users/:userid', [validateAdminRole, validateUserID], (req, res) => {
  adminDB.findByUser(req.params.userid)
    .then(admin => {
      res.status(200).json(admin)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// GET ALL PENDING ADMIN STATUSES
router.get('/requests/pending', [validateAdminRole], (req, res) => {
  console.log('MADE IT 0')
  adminDB.findPending()
    .then(admins => {
      res.status(200).json(admins)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// GET ALL APPROVED ADMIN STATUSES
router.get('/requests/approved', [validateAdminRole], (req, res) => {
  adminDB.findApproved()
    .then(admins => {
      res.status(200).json(admins)
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

// UPDATE CURRENT ADMIN STATUS
router.put('/:id', [validateAdminRole, validateAdminStatusID, validateAdminStatus], (req, res) => {
  const changes = req.body;
  const id = req.params.id;
  if(req.decodeJwt.role === 'admin'){ // user must be an admin
    adminDB.update(id, changes)
      .then(status => {
        if(changes.request_status === 3){ // if user is denied 
          usersDB.updateRole(status.requestor_id, changes.role)
            .then(update => {
              adminDB.remove(id)
                .then(deleted => {
                  res.status(201).json({ UPDATED: `${update.username}, (ID: ${status.requestor_id}) has ben denied for the ${changes.role} role by admin # ${changes.approved_by}. Request has been deleted.` })
                })
                .catch(error => {
                  res.status(500).json({ error: 'Internal server error ', error })
                })
            })
        }else{ // if user is approved (2)
          usersDB.updateRole(status.requestor_id, changes.role) // update user account with role
            .then(update => {
              res.status(201).json({ UPDATED: `${update.username}, (ID: ${status.requestor_id}) has ben approved for the ${changes.role} role by admin # ${changes.approved_by}` })
            })
            .catch(error => {
              res.status(500).json({ error: 'Internal server error ', error })
            })
        }
      })
      .catch(error => {
        res.status(500).json({ error: 'Internal server error ', error })
      })
  }else{
    res.status(403).json({ error: 'User does not have the authorization to alter request. Authorization needed: administrator' })
  }
})

// DELETE ADMIN STATUS
router.delete('/:id', [validateAdminRole, validateAdminStatusID], (req, res) => {
  adminDB.remove(req.params.id)
    .then(request => {
      res.status(201).json({ DELETED: request })
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal server error ', error })
    })
})

module.exports = router;