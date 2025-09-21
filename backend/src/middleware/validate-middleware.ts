import { Request, Response, NextFunction } from 'express';

// Valida que date, time y service estén presentes y con formato básico
export const validateReservation = (req: Request, res: Response, next: NextFunction) => {
  const { date, time, service } = req.body;
  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'date es obligatorio y debe ser texto YYYY-MM-DD' });
  }
  if (!time || typeof time !== 'string') {
    return res.status(400).json({ error: 'time es obligatorio y debe ser texto HH:MM' });
  }
  if (!service || typeof service !== 'string') {
    return res.status(400).json({ error: 'service es obligatorio y debe ser texto' });
  }

  // regex básicos
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({ error: 'Formato de date inválido. Use YYYY-MM-DD' });
  }
  if (!timeRegex.test(time)) {
    return res.status(400).json({ error: 'Formato de time inválido. Use HH:MM' });
  }
  next();
};