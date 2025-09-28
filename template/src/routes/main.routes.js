import express from 'express';
const router = express.Router();

import sampleRoutes from './sample.routes.js';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
// import googleMapRoutes from './googleMap.routes.js';

// router.use('/', sampleRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
// router.use('/google-map', googleMapRoutes);

// ✅ Basic check route (after API)
router.get('/', (req, res) => {
  res.send('Main Route is working ✅');
});

export default router;
