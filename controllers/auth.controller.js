const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
// const nodemailer = require("nodemailer");
require("dotenv").config();

// Register account
const createAccount = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const user = await User.findOne({ email });
    if (user) res.json({ message: "A user with this email is already exist" });

    await bcrypt.genSalt(10, async (err, salt) => {
      await bcrypt.hash(password, salt, async (err, hash) => {
        const newUser = await User.create({
          name,
          email,
          username,
          password: hash,
        });
        res.status(200).json({ success: true, user: newUser, message: "Successfully registered" });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login account
const loginAccount = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return res.status(201).json({ success: false, message: "User with this email not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(201)
        .json({ success: false, message: "Your Password is Incorrect password" });
    }

    const token = await jwt.sign({ email: user.email }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ success: true, token, user, message: "Successfully logged in" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// const forgetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       res.status(404).json({ message: "User is not exist", success: false });

//     const token = await jwt.sign({ email: user.email }, process.env.JWT_KEY, {
//       expiresIn: "1d",
//     });

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       secure: true,
//       auth: {
//         user: `${process.env.MY_GMAIL}`,
//         pass: `${process.env.MY_PASSWORD}`,
//       },
//     });

//     const mailOptions = {
//       from: `${process.env.MY_GMAIL}`,
//       to: email,
//       subject: "Reset Your Password",
//       text: `Click on this link to reset your password : http://localhost:5173/reset-password/${token}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res
//       .status(200)
//       .json({
//         message: "Verification Link Has Been Send To Your Email",
//         success: true,
//       });
//   } catch (error) {
//     res.status(404).json({ message: "Something Went Wrong", success: false });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     const decode = await jwt.verify(token, process.env.JWT_KEY);
//     console.log(token, password, decode);
//     const user = await User.findOne({ email: decode.email })

//     if (user) {
//       const newpassword = await bcrypt.hash(password, 12);
//       const updatedUser = await User.findOneAndUpdate(
//         { email: decode.email },
//         { password: newpassword },
//         { new: true }
//       );
//       updatedUser.save();
//       res
//         .status(200)
//         .json({
//           message: "Password Has Been Saved Succcessfully",
//           success: true,
//         });
//     } else {
//       res.status(200).json({ message: "User not found", success: false });
//     }
//   } catch (error) {
//     res.status(404).json({ message: "Something Went Wrong", success: false });
//   }
// };

module.exports = { createAccount, loginAccount };
