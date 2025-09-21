import { Request, Response } from "express";
import { 
  getAllReservations, 
  addReservation, 
  findReservationById, 
  updateReservation as updateReservationModel, 
  deleteReservation 
} from "../models/reservation-model.js";

// Obtener todas las reservas de un usuario
export const getAllForUser = (req: Request, res: Response): void => {
  try {
    const userId = (req as any).user.id;
    const allReservations = getAllReservations();
    const userReservations = allReservations.filter((r: any) => r.userId === userId);
    res.json(userReservations);
  } catch (error: any) {
    console.error("Error obteniendo reservas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener una reserva por ID
export const getById = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user.id;
    
    const reservation = findReservationById(id);
    
    if (!reservation) {
      res.status(404).json({ error: "Reserva no encontrada" });
      return;
    }

    // Verificar que la reserva pertenezca al usuario
    if (reservation.userId !== userId) {
      res.status(403).json({ error: "No tienes permiso para ver esta reserva" });
      return;
    }
    
    res.json(reservation);
  } catch (error: any) {
    console.error("Error obteniendo reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear una reserva
export const createReservation = (req: Request, res: Response): void => {
  try {
    const userId = (req as any).user.id;
    const { date, time, service, notes } = req.body;

    if (!date || !time || !service) {
      res.status(400).json({ error: "Fecha, hora y servicio son requeridos" });
      return;
    }

    const newReservation = addReservation({
      date,
      time,
      service,
      notes: notes || "",
      userId,
      status: "confirmado"
    });

    res.status(201).json(newReservation);
  } catch (error: any) {
    console.error("Error creando reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar una reserva existente
export const updateReservation = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user.id;
    const updatedFields = req.body;

    // Verificar que la reserva exista y pertenezca al usuario
    const existingReservation = findReservationById(id);
    if (!existingReservation) {
      res.status(404).json({ error: "Reserva no encontrada" });
      return;
    }

    if (existingReservation.userId !== userId) {
      res.status(403).json({ error: "No tienes permiso para modificar esta reserva" });
      return;
    }

    const updatedReservation = updateReservationModel(id, updatedFields);
    if (!updatedReservation) {
      res.status(404).json({ error: "Reserva no encontrada" });
      return;
    }

    res.json(updatedReservation);
  } catch (error: any) {
    console.error("Error actualizando reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar una reserva
export const removeReservation = (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id);
    const userId = (req as any).user.id;

    // Verificar que la reserva exista y pertenezca al usuario
    const existingReservation = findReservationById(id);
    if (!existingReservation) {
      res.status(404).json({ error: "Reserva no encontrada" });
      return;
    }

    if (existingReservation.userId !== userId) {
      res.status(403).json({ error: "No tienes permiso para eliminar esta reserva" });
      return;
    }

    const success = deleteReservation(id);
    if (!success) {
      res.status(404).json({ error: "Reserva no encontrada" });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    console.error("Error eliminando reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};