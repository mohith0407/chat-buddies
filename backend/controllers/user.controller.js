import asyncHandler from "express-async-handler"
import User from "../models/user.model.js";
import generateToken from "../config/generateToken.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import Chat from "../models/chat.model.js";

// --------------------------Register------------------------------

const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,avatar}=req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("All feilds mandatory ")
    }
    const existedUser=await User.findOne({email});
    if(existedUser){
        res.status(400);
        throw new Error("User exits");
    }
    console.log("REQ BODY:", req.body);
console.log("REQ FILE:", req.file);
    let avatarUrl = "";
    if (req.file) {
        avatarUrl = await uploadToCloudinary(req.file.buffer)
    }
    const user=await User.create({
        name,email,password,avatar:avatarUrl
    })
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            token:generateToken(user._id)
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to create user");
    }
})

// --------------------------Login------------------------------

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// --------------------------Get All users------------------------------

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

// --------------------------Update User Profile------------------------------

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    
    // If a new file is provided, upload and update
    if (req.file) {
      const avatarUrl = await uploadToCloudinary(req.file.buffer);
      user.avatar = avatarUrl;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// --------------------------Change Password------------------------------

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword; // Ensure your User model has pre-save middleware to hash this
    await user.save();
    res.status(200).send({ message: "Password updated successfully" });
  } else {
    res.status(400);
    throw new Error("Invalid old password");
  }
});

// --------------------------Delete User Account------------------------------

const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Optional: Remove user from all Group Chats they are part of
    await Chat.updateMany(
      { users: req.user._id },
      { $pull: { users: req.user._id } }
    );

    // Delete the user
    await User.findByIdAndDelete(req.user._id);
    
    res.json({ message: "User account deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
export {registerUser,authUser,allUsers,updateUserProfile,updatePassword,deleteUserAccount}