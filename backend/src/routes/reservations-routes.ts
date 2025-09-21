import { Router } from 'express';
import {
  getAllForUser,
  getById,
  createReservation,
  updateReservation,
  removeReservation
} from '../controllers/reservations-controller.js';
import { authenticateToken } from '../middleware/auth-middleware.js';
import { validateReservation } from '../middleware/validate-middleware.js';

const router = Router();

router.get('/', authenticateToken, getAllForUser);
router.get('/:id', authenticateToken, getById);
router.post('/', authenticateToken, validateReservation, createReservation);
router.put('/:id', authenticateToken, validateReservation, updateReservation);
router.delete('/:id', authenticateToken, removeReservation);

export default router;
