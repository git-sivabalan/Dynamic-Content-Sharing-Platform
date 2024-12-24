const fs = require('fs');
const path = require('path');
const multer = require('multer');
const User = require('../model/user-model');
const Post = require('../model/post-model');
const UserInterest = require('../model/user-interest-model');
const jwt = require('jsonwebtoken'); // Ensure this is imported
const InterestCategory = require('../model/interest-category-model');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});

const upload = multer({ storage: storage });
// Create a new post
exports.createPost = [
  upload.single('image'),
  async (req, res) => {
    try {
      // Extract token from the Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid' });
      }
      const token = authHeader.split(' ')[1];

      // Verify and decode the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;

      // Find the user in the database
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Extract other data from the request
      const { content, categoryId } = req.body;
      const imagePath = req.file ? req.file.path : null;

      // Create the post
      const post = await Post.create({
        userId,
        content,
        imagePath,
        categoryId,
      });

      return res.status(201).json({
        message: 'Post created successfully',
        post,
      });
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
];

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'email'],
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'email'],
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePostById = [
  upload.single('image'),
  async (req, res) => {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file); 

    try {
      const { id } = req.params;
      const { content, categoryId } = req.body;
      const imagePath = req.file ? req.file.path : null;

      if (!req.file) {
        console.error('No file was uploaded');
      }

      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (imagePath && post.imagePath) {
        fs.unlinkSync(post.imagePath); 
      }

      post.content = content || post.content;
      post.categoryId = categoryId || post.categoryId;
      post.imagePath = imagePath || post.imagePath;
      await post.save();

      return res.status(200).json({
        message: 'Post updated successfully',
        post,
      });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
];

// Delete a post by ID
exports.deletePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If the post has an image, remove the image from the server
    if (post.imagePath) {
      fs.unlinkSync(post.imagePath);
    }

    await post.destroy();

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.fetchPostForUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { id } = decoded;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please try logging in.' });
    }

    // Fetch user's interests
    const userInterests = await UserInterest.findAll({ where: { userId: id } });
    if (userInterests.length === 0) {
      return res.status(404).json({ message: 'No interests found for this user' });
    }
    
    const categoryIds = userInterests.map(interest => interest.categoryId);

    // Fetch posts for those categories
    const posts = await Post.findAll({
      where: {
        categoryId: categoryIds
      },
      include: [
        { model: User, as: 'user' },
        { model: InterestCategory, as: 'category' }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Error during fetchPostForUser:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPostByUser = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    console.log(token);

    // Validate the token
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { id } = decoded;

    // Find the user by id
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please try logging in." });
    }

    // Find the posts of the user
    const posts = await Post.findAll({ where: { userId: user.id } });

    // If posts are found, map them to include username and email
    if (posts.length > 0) {
      const postsWithUserInfo = posts.map((post) => ({
        ...post.toJSON(), // Convert post object to plain JavaScript object
        user: {
          username: user.email.split("@")[0], // Deriving username from email
          email: user.email,
        },
      }));

      return res.status(200).json({ posts: postsWithUserInfo });
    } else {
      return res.status(404).json({ message: "No posts found for this user." });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
