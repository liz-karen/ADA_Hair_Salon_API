import { Router } from 'express';
import {
  getAllForUser,
  getById,
  createReservation,
  updateReservation,
  removeReservation,
  getByDate,
  getAllReservations
} from '../controllers/reservations-controller';
import { authenticateToken } from '../middleware/auth-middleware';
import { validateReservation } from '../middleware/validate-middleware';

const router = Router();

// 🔹 Rutas para administradores primero
router.get('/admin/all', authenticateToken, getAllReservations);
router.get('/admin/date/:date', authenticateToken, getByDate);

// 🔹 Rutas para usuarios autenticados
router.get('/', authenticateToken, getAllForUser);
router.get('/:id', authenticateToken, getById);
router.post('/', authenticateToken, validateReservation, createReservation);
router.put('/:id', authenticateToken, validateReservation, updateReservation);
router.delete('/:id', authenticateToken, removeReservation);

export default router;

