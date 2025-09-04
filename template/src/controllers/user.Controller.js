import User from "../models/User.model.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendMailWithAttachment, SendOTP } from "../utils/sendEmail.js";
import { hashPassword, comparePassword } from "../utils/encryptDecrypt.js";
import { generateToken } from "../config/jwt.config.js";
import { s3Upload, s3Delete, safeUnlink } from "../config/s3.js";
import { generateUserExcel, parseUserExcel } from "../utils/excel.util.js";
const FOLDER = "ProfilePhoto";

// Register
export const registerUser = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, email, password, phone, role, isAdmin } = body;

    const existingUser = await User.findOne({ email });
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
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role,
      isAdmin,
      profilePhoto,
    });

    res.status(201).json({ message: "User registered", User: newUser });
  } catch (err) {
    safeUnlink(req.file?.path);
    console.error("  Error registering User:", err);
    res
      .status(500)
      .json({ message: "Error registering User", error: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User not found" });
    const isValid = await comparePassword(password, existingUser.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(existingUser);

    res.json({ token, existingUser });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Forgot password (send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    console.log(otp);

    existingUser.otp = otp;
    existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await existingUser.save();

    // Send OTP on email
    // await sendMailWithAttachment(email, "Your OTP", `Your OTP is: ${otp}`);
    await SendOTP(email, otp);

    res.status(201).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const existingUser = await User.findOne({ email });

    if (
      !existingUser ||
      existingUser.otp !== otp ||
      existingUser.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(201).json({ message: "OTP verified" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: err.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (
      !existingUser ||
      existingUser.otp !== otp ||
      existingUser.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    existingUser.password = await hashPassword(newPassword);
    existingUser.otp = null;
    existingUser.otpExpires = null;

    await existingUser.save();

    res.status(201).json({ message: "Password reset successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Password reset failed", error: err.message });
  }
};

// Get all Users
export const getAllUsers = async (req, res) => {
  try {
    const existingUsers = await User.find().select("-password");
    res.json(existingUsers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching Users", error: err.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id).select("-password");
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    res.json(existingUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching User", error: err.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      name,
      phone,
      password,
      email,
      role,
      department,
      isActive,
      isAdmin,
    } = body;

    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      safeUnlink(req.file?.path);
      return res.status(404).json({ message: "User not found" });
    }

    const update = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (role) update.role = role;
    if (department) update.department = department;

    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      update.email = email;
    }

    if (body.hasOwnProperty("isActive")) {
      update.isActive = isActive;
    }
    if (body.hasOwnProperty("isAdmin")) {
      update.isAdmin = isAdmin;
    }

    if (password) update.password = await hashPassword(password);

    if (req.file) {
      const uploaded = await s3Upload(req.file, FOLDER);
      safeUnlink(req.file.path);

      const oldKey = existingUser.profilePhoto?.[0]?.publicId;
      if (oldKey) {
        try {
          await s3Delete(oldKey);
        } catch {}
      }
      update.profilePhoto = [{ publicId: uploaded.key, url: uploaded.url }];
    }

    const newUser = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json({ message: "User updated", User: newUser });
  } catch (err) {
    safeUnlink(req.file?.path);
    console.error("  Error in updateUser:", err);
    res
      .status(500)
      .json({ message: "Error updating User", error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const existingUser = await User.findByIdAndDelete(req.params.id);
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const key = existingUser.profilePhoto?.[0]?.publicId;
    if (key) {
      try {
        await s3Delete(key);
      } catch (e) {
        console.warn("⚠️ Could not delete S3 object:", e?.message);
      }
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("  Error deleting User:", err);
    res
      .status(500)
      .json({ message: "Error deleting User", error: err.message });
  }
};

//  Export Users to Excel
export const exportUsersToExcel = async (req, res) => {
  try {
    const users = await User.find();
    const workbook = await generateUserExcel(users);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("  Error exporting users:", err);
    res
      .status(500)
      .json({ message: "Error exporting users", error: err.message });
  }
};
//  Import Users from Excel
export const importUsersFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an Excel file" });
    }

    const usersData = await parseUserExcel(req.file.path);

    const insertedUsers = [];
    const skippedUsers = [];

    for (const userData of usersData) {
      if (!userData.email) continue; // skip rows without email

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        skippedUsers.push(userData.email);
        continue;
      }

      const newUser = await User.create(userData);
      insertedUsers.push(newUser);
    }

    // Cleanup uploaded file
    safeUnlink(req.file.path); // remove local temp

    res.status(201).json({
      message: "Users imported successfully",
      insertedCount: insertedUsers.length,
      skippedCount: skippedUsers.length,
      skippedUsers,
      insertedUsers,
    });
  } catch (err) {
    console.error("❌ Error importing users:", err);
    res
      .status(500)
      .json({ message: "Error importing users", error: err.message });
  }
};
