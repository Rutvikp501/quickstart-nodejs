import express from 'express';
import {registerUser,loginUser,getAllUsers,getUserById,updateUser,deleteUser,
         forgotPassword,verifyOtp,resetPassword,
         exportUsersToExcel,
         importUsersFromExcel,} from '../controllers/user.Controller.js';

import { authenticateJWT, checkRole } from '../auth/jwt.auth.js';
import { uploadLocal } from '../config/s3.js';

const router = express.Router();

// ✅ Public routes
router.post('/register', uploadLocal.single("profilePhoto"),registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// ✅ Protected routes (require JWT)

router.get('/', authenticateJWT,checkRole('admin'), getAllUsers);
router.get('/:id', authenticateJWT, getUserById);
router.post('/update/:id', authenticateJWT, updateUser);
router.put('/:id', uploadLocal.single("profilePhoto"),authenticateJWT, updateUser);
router.delete('/:id', authenticateJWT, checkRole('admin'), deleteUser);
router.get("/export/excel", exportUsersToExcel);
router.post("/import/excel", uploadLocal.single("file"), importUsersFromExcel);
export default router;
