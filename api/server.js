const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const verifyToken = require('../data/authorization/authMiddleware');

const authRouter = require('../data/authorization/authRouter');
const requestRouter = require('../data/requests/requestRouter');
const profileRouter = require('../data/profile/profileRouter');
const adminRouter = require('../data/admin/adminRouter');
const usersRouter = require('../data/users/usersRouter');
const faveLangRouter = require('../data/fave_lang/faveLangRouter');
const postsRouter = require('../data/posts/postsRouter');
const commentsRouter = require('../data/comments/commentsRouter');

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api', [verifyToken], requestRouter);
server.use('/api', [verifyToken], profileRouter);
server.use('/api/admin', [verifyToken], adminRouter);
server.use('/api/users', [verifyToken], usersRouter);
server.use('/api', [verifyToken], faveLangRouter);
server.use('/api', [verifyToken], postsRouter);
server.use('/api', [verifyToken], commentsRouter);

server.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = server;