"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReservation = exports.updateReservation = exports.findReservationById = exports.addReservation = exports.getAllReservations = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filePath = path_1.default.join(__dirname, '..', 'database', 'reservations.json');
// Leer reservas
const readReservations = () => {
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
};
// Guardar reservas
const saveReservations = (reservations) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(reservations, null, 2));
};
// Obtener todas
const getAllReservations = () => readReservations();
exports.getAllReservations = getAllReservations;
// Agregar reserva
const addReservation = (reservationData) => {
    const reservations = readReservations();
    const nextId = reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1;
    const newReservation = { id: nextId, ...reservationData };
    reservations.push(newReservation);
    saveReservations(reservations);
    return newReservation;
};
exports.addReservation = addReservation;
// Buscar por id
const findReservationById = (id) => {
    const reservations = readReservations();
    return reservations.find((r) => r.id === id);
};
exports.findReservationById = findReservationById;
// Actualizar
const updateReservation = (id, updatedFields) => {
    const reservations = readReservations();
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1)
        return null;
    reservations[index] = { ...reservations[index], ...updatedFields };
    saveReservations(reservations);
    return reservations[index];
};
exports.updateReservation = updateReservation;
// Eliminar
const deleteReservation = (id) => {
    const reservations = readReservations();
    const filtered = reservations.filter((r) => r.id !== id);
    if (filtered.length === reservations.length)
        return false;
    saveReservations(filtered);
    return true;
};
exports.deleteReservation = deleteReservation;
