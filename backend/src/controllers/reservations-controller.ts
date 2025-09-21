import { Request, Response } from "express";

// simulamos reservas en memoria
let reservations: any[] = [];

// Obtener todas las reservas de un usuario
export const getAllForUser = (req: Request, res: Response) => {
  const userId = (req as any).user.id; // del token
  const userReservations = reservations.filter(r => r.userId === userId);
  res.json(userReservations);
};

// Obtener una reserva por ID
export const getById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const reservation = reservations.find(r => r.id === id);
  if (!reservation) return res.status(404).json({ error: "Reserva no encontrada" });
  res.json(reservation);
};

// Crear una reserva
export const createReservation = (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const newReservation = { id: reservations.length + 1, userId, ...req.body };
  reservations.push(newReservation);
  res.status(201).json(newReservation);
};

// Actualizar una reserva existente
export const updateReservation = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = reservations.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: "Reserva no encontrada" });

  reservations[index] = { ...reservations[index], ...req.body };
  res.json(reservations[index]);
};

// Eliminar una reserva
export const removeReservation = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const filtered = reservations.filter(r => r.id !== id);
  if (filtered.length === reservations.length) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }
  reservations = filtered;
  res.status(204).send();
};
