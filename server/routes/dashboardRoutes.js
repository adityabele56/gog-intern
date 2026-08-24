import express from 'express';
import {
  getDashboardData,
  getDashboardStats,
  getRecentActivities
} from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all dashboard routes
router.use(protect);

router.get('/', getDashboardData);
router.get('/stats', getDashboardStats);
router.get('/recent', getRecentActivities);

export default router;
