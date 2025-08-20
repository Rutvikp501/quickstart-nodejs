import User from '../models/User.model.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { sendMailWithAttachment, SendOTP } from '../utils/sendEmail.js';
import { hashPassword, comparePassword } from '../utils/encryptDecrypt.js';
import { generateToken } from '../utils/jwtUtils.js';
import { s3Upload,s3Delete ,safeUnlink   } from '../config/s3.js';

const FOLDER = "ProfilePhoto";

export const registerUser = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, email, password, phone, role, isUser } = body;

    const existingUser= await User.findOne({ email });
    if (existingUser) {
      safeUnlink(req.file?.path);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashPassword(password);
    let profilePhoto = [];
    if (req.file) {
      const uploaded = await s3Upload(req.file, FOLDER);
      profilePhoto.push({ publicId: uploaded.key, url: uploaded.url });
      safeUnlink(req.file.path); // remove local temp
    }
    const User = await User.create({
      name, email, phone,
      password: hashed,
      role, isUser,
      profilePhoto,
    });

    res.status(201).json({ message: "User registered", User });
  } catch (err) {
    safeUnlink(req.file?.path);
    console.error("❌ Error registering User:", err);
    res.status(500).json({ message: "Error registering User", error: err.message });
  }
};

// Login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    
    if (!existingUser) return res.status(404).json({ message: 'User not found' });
    const isValid = await comparePassword(password, existingUser.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(existingUser);
    

    res.json({ token, existingUser });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Forgot password (send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    console.log(otp);

    existingUser.otp = otp;
    existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await existingUser.save();

    // Send OTP on email
    await sendMailWithAttachment(email, 'Your OTP', `Your OTP is: ${otp}`);
    await SendOTP(email, otp);

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser || existingUser.otp !== otp || existingUser.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser || existingUser.otp !== otp || existingUser.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    existingUser.password = await hashPassword(newPassword);
    existingUser.otp = null;
    existingUser.otpExpires = null;

    await existingUser.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

// Get all Users
export const getAllUsers = async (req, res) => {
  try {
    const existingUsers = await User.find().select('-password');
    res.json(existingUsers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Users', error: err.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    
    const existingUser= await User.findById(req.params.id).select('-password');
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    res.json(existingUser);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching User', error: err.message });
  }
};

// Update User

export const updateUser = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, phone, password } = body;

    const existingUser= await User.findById(req.params.id);
    if (!existingUser) {
      safeUnlink(req.file?.path);
      return res.status(404).json({ message: "User not found" });
    }

    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (password) update.password = await hashPassword(password);

    if (req.file) {
      const uploaded = await s3Upload(req.file, FOLDER);
      safeUnlink(req.file.path); 

      const oldKey = existing.profilePhoto?.[0]?.publicId;
      if (oldKey) {
        try { await s3Delete(oldKey); } catch {}

      }

      update.profilePhoto = [{ publicId: uploaded.key, url: uploaded.url }];
    }

    const User = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: "User updated", User });
  } catch (err) {
    safeUnlink(req.file?.path);
    console.error("❌ Error in updateUser:", err);
    res.status(500).json({ message: "Error updating User", error: err.message });
  }
};


// Delete User
export const deleteUser = async (req, res) => {
  try {
    const existingUser = await User.findByIdAndDelete(req.params.id);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const key = existingUser.profilePhoto?.[0]?.publicId;
    if (key) {
      try { await s3Delete(key); } catch (e) {
        console.warn("⚠️ Could not delete S3 object:", e?.message);
      }
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("❌ Error deleting User:", err);
    res.status(500).json({ message: "Error deleting User", error: err.message });
  }
};
