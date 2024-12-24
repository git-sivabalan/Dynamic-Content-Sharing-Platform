const express = require('express');
const { createPost, getAllPosts, getPostById, updatePostById, deletePostById, fetchPostForUser, getPostByUser } = require('../controller/post-controller');

const postRouter = express.Router()

postRouter.post('/create', createPost);
postRouter.put('/update/:id', updatePostById);
postRouter.post('/getpostforuser', fetchPostForUser);
postRouter.get('/getAll', getAllPosts);
postRouter.get('/getById/:id', getPostById);
postRouter.delete('/:id', deletePostById);
postRouter.get("/getpostbyuser", getPostByUser)
module.exports = postRouter