import express from 'express';
import {registerUser,loginUser,getAllUsers,getUserById,updateUser,deleteUser,
         forgotPassword,verifyOtp,resetPassword,} from '../controllers/user.Controller.js';

import { authenticateJWT, checkRole } from '../middlewares/authenticateJWT.js';
const router = express.Router();

// ✅ Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// ✅ Protected routes (require JWT)
router.get('/', authenticateJWT,checkRole('admin'), getAllUsers);
router.get('/:id', authenticateJWT, getUserById);
router.put('/:id', authenticateJWT, updateUser);
router.delete('/:id', authenticateJWT, checkRole('admin'), deleteUser);
export default router;
