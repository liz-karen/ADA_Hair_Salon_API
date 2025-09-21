"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeReservation = exports.updateReservation = exports.createReservation = exports.getById = exports.getAllForUser = void 0;
const reservation_model_js_1 = require("../models/reservation-model.js");
// Obtener todas las reservas de un usuario
const getAllForUser = (req, res) => {
    try {
        const userId = req.user.id;
        const allReservations = (0, reservation_model_js_1.getAllReservations)();
        const userReservations = allReservations.filter((r) => r.userId === userId);
        res.json(userReservations);
    }
    catch (error) {
        console.error("Error obteniendo reservas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getAllForUser = getAllForUser;
// Obtener una reserva por ID
const getById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;
        const reservation = (0, reservation_model_js_1.findReservationById)(id);
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
    }
    catch (error) {
        console.error("Error obteniendo reserva:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getById = getById;
// Crear una reserva
const createReservation = (req, res) => {
    try {
        const userId = req.user.id;
        const { date, time, service, notes } = req.body;
        if (!date || !time || !service) {
            res.status(400).json({ error: "Fecha, hora y servicio son requeridos" });
            return;
        }
        const newReservation = (0, reservation_model_js_1.addReservation)({
            date,
            time,
            service,
            notes: notes || "",
            userId,
            status: "confirmado"
        });
        res.status(201).json(newReservation);
    }
    catch (error) {
        console.error("Error creando reserva:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.createReservation = createReservation;
// Actualizar una reserva existente
const updateReservation = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;
        const updatedFields = req.body;
        // Verificar que la reserva exista y pertenezca al usuario
        const existingReservation = (0, reservation_model_js_1.findReservationById)(id);
        if (!existingReservation) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (existingReservation.userId !== userId) {
            res.status(403).json({ error: "No tienes permiso para modificar esta reserva" });
            return;
        }
        const updatedReservation = (0, reservation_model_js_1.updateReservation)(id, updatedFields);
        if (!updatedReservation) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        res.json(updatedReservation);
    }
    catch (error) {
        console.error("Error actualizando reserva:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.updateReservation = updateReservation;
// Eliminar una reserva
const removeReservation = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req.user.id;
        // Verificar que la reserva exista y pertenezca al usuario
        const existingReservation = (0, reservation_model_js_1.findReservationById)(id);
        if (!existingReservation) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        if (existingReservation.userId !== userId) {
            res.status(403).json({ error: "No tienes permiso para eliminar esta reserva" });
            return;
        }
        const success = (0, reservation_model_js_1.deleteReservation)(id);
        if (!success) {
            res.status(404).json({ error: "Reserva no encontrada" });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Error eliminando reserva:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.removeReservation = removeReservation;
