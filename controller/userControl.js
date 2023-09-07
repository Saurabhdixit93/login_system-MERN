const UserModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/generateJWT");

const userSignup = async (req, res) => {
  const { userName, name, email, password, profileImage } = req.body;
  if (!userName || !email || !password || !name) {
    return res.json({
      success: false,
      message: "All fields Required .",
    });
  }
  const validEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!hashedPassword) {
    return res.json({
      success: false,
      message: "Error In Hashing Password !",
    });
  }
  try {
    const user = await UserModel.findOne({
      $or: [{ userName }, { email: validEmail }],
    });
    if (user) {
      return res.json({
        message: "Username or email already exists",
        success: false,
      });
    }
    const newUser = new UserModel({
      userName,
      name,
      email: validEmail,
      password: hashedPassword,
      profileImage,
    });
    await newUser.save();
    return res.json({
      success: true,
      message: "Account Created Successfully ",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};

const userLogin = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.json({
      success: false,
      message: "All fields Required .",
    });
  }
  try {
    const user = await UserModel.findOne({
      $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found. !",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({
        success: false,
        message: "Wrong Password ! ",
      });
    }
    const payload = {
      userId: user._id,
    };
    const secretKey = process.env.SECRETKEY;
    const expiresIn = "7d";
    const token = await generateToken(payload, secretKey, expiresIn);
    return res.json({
      success: true,
      message: "User Logged in successfully.",
      token,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};
const userCurrent = async (req, res) => {
  const { userId } = req.params;
  try {
    const userDetails = await UserModel.findById(userId).select("-password");
    if (!userDetails) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    // Send the user details without the password
    return res.json({
      success: true,
      userDetails,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal Server Error .",
    });
  }
};

const userUpdate = async (req, res) => {
  const  {userId} = req.params;
  const updateData = req.body;
  try {
    const result = await UserModel.updateOne(
      { _id: userId },
      { $set: updateData }
    );
    if (result.nModified === 0) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

const userDelete = async (req, res) => {
  const {userId} = req.params;
  try {
    const result = await UserModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userUpdate,
  userDelete,
};
