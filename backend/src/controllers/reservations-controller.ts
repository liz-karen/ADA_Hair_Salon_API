import { Request, Response } from "express";
import { reservationModel, IReservation } from "../models/reservation-model";

// Obtener todas las reservas de un usuario
export const getAllForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const userReservations = await reservationModel.findByUserId(userId);
    res.json(userReservations);
  } catch (error: any) {
    console.error("Error obteniendo reservas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener una reserva por ID
export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = (req as any).user.id;
    
    const reservation = await reservationModel.findById(id);
    
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
export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { date, time, service, notes, price } = req.body;

    if (!date || !time || !service) {
      res.status(400).json({ error: "Fecha, hora y servicio son requeridos" });
      return;
    }

    // Verificar disponibilidad del horario
    const isAvailable = await reservationModel.isTimeSlotAvailable(date, time);
    if (!isAvailable) {
      res.status(400).json({ error: "El horario seleccionado no está disponible" });
      return;
    }

    const newReservation = await reservationModel.create({
      date,
      time,
      service,
      notes: notes || "",
      price: price || undefined,
      userId: userId,
      status: "confirmado"
    });

    res.status(201).json(newReservation);
  } catch (error: any) {
    console.error("Error creando reserva:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar una reserva existente
export const updateReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = (req as any).user.id;
    const updatedFields = req.body;

    // Verificar que la reserva exista y pertenezca al usuario
    const existingReservation = await reservationModel.findById(id);
    if (!existingReservation) {
      res.status(404).json({ error: "Reserva no encontrada" });
      return;
    }

    if (existingReservation.userId !== userId) {
      res.status(403).json({ error: "No tienes permiso para modificar esta reserva" });
      return;
    }

    // Si se está cambiando la fecha o hora, verificar disponibilidad
    if (updatedFields.date || updatedFields.time) {
      const checkDate = updatedFields.date || existingReservation.date;
      const checkTime = updatedFields.time || existingReservation.time;
      
      const isAvailable = await reservationModel.isTimeSlotAvailable(checkDate, checkTime);
      if (!isAvailable && (checkDate !== existingReservation.date || checkTime !== existingReservation.time)) {
        res.status(400).json({ error: "El nuevo horario no está disponible" });
        return;
      }
    }

    const updatedReservation = await reservationModel.findByIdAndUpdate(id, updatedFields);
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
export const removeReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = (req as any).user.id;

    // Verificar que la reserva exista y pertenezca al usuario
    const existingReservation = await reservationModel.findById(id);
    if (!existingReservation) {
      res.status(404).json({ error: "Reserva no encontrada" });
      return;
    }

    if (existingReservation.userId !== userId) {
      res.status(403).json({ error: "No tienes permiso para eliminar esta reserva" });
      return;
    }

    const success = await reservationModel.findByIdAndDelete(id);
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

// Obtener reservas por fecha (para administradores)
export const getByDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const reservations = await reservationModel.findByDate(date);
    res.json(reservations);
  } catch (error: any) {
    console.error("Error obteniendo reservas por fecha:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las reservas (para administradores)
export const getAllReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = (req as any).user.role;
    
    if (userRole !== 'admin') {
      res.status(403).json({ error: "No tienes permisos de administrador" });
      return;
    }

    const reservations = await reservationModel.find();
    res.json(reservations);
  } catch (error: any) {
    console.error("Error obteniendo todas las reservas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
