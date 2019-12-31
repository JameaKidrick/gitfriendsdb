const express = require('express');
const router = express.Router();

const ultimateDB = require('./ultimateModel');

// router.get('/ultimate/user/:user_id', (req, res) => {
//   ultimateDB.findFullUser(req.params.user_id)
//     .then(user => {
//       res.status(200).json(user)
//     })
// })

module.exports = router;