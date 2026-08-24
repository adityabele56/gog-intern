import express from 'express';
import {
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard
} from '../controllers/cardController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadCardFields } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Protect all card routes
router.use(protect);

router
  .route('/')
  .post(uploadCardFields, createCard)
  .get(getCards);

router
  .route('/:id')
  .get(getCardById)
  .put(uploadCardFields, updateCard)
  .delete(deleteCard);

export default router;
