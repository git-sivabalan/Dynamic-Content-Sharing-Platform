const express = require('express')
const { createUser, login, forgotPassword, verifyToken, getUserProfile } = require('../controller/auth-controller');

const auth = express.Router()

auth.post('/signup', createUser);
auth.post('/login', login);
auth.post('/forgot-password', forgotPassword);
auth.post('/verify-token', verifyToken);
auth.get('/getuserprofile', getUserProfile)
module.exports = auth