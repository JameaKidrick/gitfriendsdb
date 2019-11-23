const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('../data/authorization/authRouter');
const requestRouter = require('../data/requests/requestRouter');

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api', requestRouter);

server.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = server;