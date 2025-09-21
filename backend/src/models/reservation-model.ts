import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '..', 'database', 'reservations.json');

// Leer reservas
const readReservations = (): any[] => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

// Guardar reservas
const saveReservations = (reservations: any[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2));
};

// Obtener todas
export const getAllReservations = (): any[] => readReservations();

// Agregar reserva
export const addReservation = (reservationData: any): any => {
  const reservations = readReservations();
  const nextId = reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1;
  const newReservation = { id: nextId, ...reservationData };
  reservations.push(newReservation);
  saveReservations(reservations);
  return newReservation;
};

// Buscar por id
export const findReservationById = (id: number): any => {
  const reservations = readReservations();
  return reservations.find((r: any) => r.id === id);
};

// Actualizar
export const updateReservation = (id: number, updatedFields: any): any => {
  const reservations = readReservations();
  const index = reservations.findIndex((r: any) => r.id === id);
  if (index === -1) return null;
  reservations[index] = { ...reservations[index], ...updatedFields };
  saveReservations(reservations);
  return reservations[index];
};

// Eliminar
export const deleteReservation = (id: number): boolean => {
  const reservations = readReservations();
  const filtered = reservations.filter((r: any) => r.id !== id);
  if (filtered.length === reservations.length) return false;
  saveReservations(filtered);
  return true;
};