const { Op } = require('sequelize');
const User = require('../model/user-model');
const UserInterest = require('../model/user-interest-model');
const { generateAndSendPasswordToEmail, SendForgotPasswordToEmail } = require('../helper/email-service');
const {error, success} = require('../helper/api-response')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
exports.createUser = async (req, res) => {
  try {
    const { email, interests } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json(
        error("Email already exist. Try to Login", res.statusCode)
      );
    }

    const newUser = await User.create({ email });

    const userInterests = interests.map(interest => ({
      userId: newUser.id,
      categoryId: interest.id,
    }));
    await UserInterest.bulkCreate(userInterests);

    const passwordResponse = await generateAndSendPasswordToEmail(email);
    if (!passwordResponse.success) {
      return res.status(500).json(
        error(passwordResponse.message, res.statusCode)
      );
    }
    return res.status(201).json(
      success("User created successfully. Password has been sent to the email.", res.statusCode)
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json(
      error('Internal server error', res.statusCode)
    );
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Corrected from `req.bod`
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json(error("User not found", res.statusCode));
    }

    if (user.password !== password) {
      return res.status(400).json(error("Incorrect Password", res.statusCode));
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        password: user.password
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json(success("Logged in successfully", {token:token}, res.statusCode));
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json(error('Internal server error', res.statusCode));
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; 
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json(error("User not found", res.statusCode));
    }
    SendForgotPasswordToEmail(email)
    
    return res.status(200).json(success("Password Sent to your email", res.statusCode));
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json(error('Internal server error', res.statusCode));
  }
};


exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    const { id } = decode;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json(error("Unauthorized/Try to login", res.statusCode));
    }

    return res.status(200).json(success("Authorized", res.statusCode));
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('Token expired:', error);
      return res.status(401).json({ message: 'Token has expired' });
    } else {
      console.error('Error during verification:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    // Find the user based on the decoded token's user ID
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile data (username and email)
    return res.status(200).json({
      username: user.username,
      email: user.email,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
