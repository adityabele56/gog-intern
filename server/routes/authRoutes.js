import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteAccount
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/signup', upload.single('profileImage'), signup);
router.post('/login', login);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.delete('/delete', protect, deleteAccount);

export default router;
