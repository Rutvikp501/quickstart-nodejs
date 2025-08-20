import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  publicId: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  otp: String,
  otpExpires: Date,
  role: { type: String,default: 'admin'},
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
   profilePhoto: [PhotoSchema],
});

const User = mongoose.model('User', userSchema);
export default User;
