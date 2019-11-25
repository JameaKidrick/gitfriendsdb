const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const verifyToken = require('../data/authorization/authMiddleware');

const authRouter = require('../data/authorization/authRouter');
const requestRouter = require('../data/requests/requestRouter');
const profileRouter = require('../data/profile/profileRouter');
const adminRouter = require('../data/admin/adminRouter');

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api', requestRouter);
server.use('/api', profileRouter);
server.use('/api/admin', [verifyToken], adminRouter);

server.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = server;