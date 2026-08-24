import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all user management routes
router.use(protect);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', admin, deleteUser);

export default router;
