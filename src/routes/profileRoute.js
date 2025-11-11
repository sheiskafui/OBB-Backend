import express from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/change-password', protect, changePassword);
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

export default router;