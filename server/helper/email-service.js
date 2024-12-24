const nodemailer = require('nodemailer');
const User = require('../model/user-model');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'siva638302@gmail.com', // Replace with your email
    pass: 'myei eejg sodx tkin', // Replace with your email app password
  },
});

exports.generateAndSendPasswordToEmail = async (email) => {
  try {
    const password = Math.random().toString(36).slice(-6).toUpperCase();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    user.password = password;
    await user.save();

    const mailOptions = {
      from: 'siva638302@gmail.com',
      to: email,
      subject: 'Your Sign Up Password',
      html: `
        <h1>Welcome!</h1>
        <p>Your account has been created successfully. Here is your password:</p>
        <p><strong>Password: ${password}</strong></p>
        <p>Please keep this password safe and secure.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Password generated and sent to email successfully' };
  } catch (error) {
    console.error('Error generating and sending password:', error);
    return { success: false, message: 'Failed to generate and send password' };
  }
};


exports.SendForgotPasswordToEmail = async (email) => {
  try {
    const password = Math.random().toString(36).slice(-6).toUpperCase();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    user.password = password;
    await user.save();

    const mailOptions = {
      from: 'siva638302@gmail.com',
      to: email,
      subject: 'Your Sign Up Password',
      html: `
        <h1>Welcome!</h1>
        <p>Here is your password:</p>
        <p><strong>Password: ${password}</strong></p>
        <p>Please keep this password safe and secure.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Password is sent to email successfully' };
  } catch (error) {
    console.error('Error fetching password:', error);
    return { success: false, message: 'Failed to fetch password' };
  }
};

