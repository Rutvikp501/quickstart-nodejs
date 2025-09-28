import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  publicId: { type: String, required: false },
  url: { type: String, required: true },
}, { _id: false });


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String,},
  phone: String,
  otp: String,
  otpExpires: Date,
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  appleId: { type: String, unique: true, sparse: true },
  role: { type: String,default: 'user'},
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, },
  createdAt: { type: Date, default: Date.now },
  profilePhoto: [PhotoSchema],
  location: String,
});

const User = mongoose.model('User', userSchema);
export default User;
