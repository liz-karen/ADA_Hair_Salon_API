import fs from 'fs';
import path from 'path';

// Ruta al archivo JSON donde guardamos reservas
const filePath = path.join(__dirname, '..', 'database', 'reservations.json');

// Interfaz que coincide con el modelo de MongoDB
export interface IReservation {
  _id: string;
  date: string;
  time: string;
  service: string;
  notes?: string;
  status: string;
  price?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Leer reservas
const readReservations = (): IReservation[] => {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

// Guardar reservas
const saveReservations = (reservations: IReservation[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2));
};

// Generar ID único
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

class ReservationModel {
  // Crear una nueva reserva
  async create(reservationData: Partial<IReservation>): Promise<IReservation> {
    const reservations = readReservations();
    const now = new Date();
    
    const newReservation: IReservation = {
      _id: generateId(),
      date: reservationData.date!,
      time: reservationData.time!,
      service: reservationData.service!,
      notes: reservationData.notes || '',
      status: reservationData.status || 'confirmado',
      price: reservationData.price,
      userId: reservationData.userId!,
      createdAt: now,
      updatedAt: now
    };
    
    reservations.push(newReservation);
    saveReservations(reservations);
    return newReservation;
  }

  // Obtener todas las reservas
  async find(): Promise<IReservation[]> {
    return readReservations();
  }

  // Obtener reservas por usuario
  async findByUserId(userId: string): Promise<IReservation[]> {
    const reservations = readReservations();
    return reservations.filter((r: IReservation) => r.userId === userId);
  }

  // Buscar reserva por ID
  async findById(id: string): Promise<IReservation | null> {
    const reservations = readReservations();
    return reservations.find((r: IReservation) => r._id === id) || null;
  }

  // Actualizar reserva
  async findByIdAndUpdate(id: string, reservationData: Partial<IReservation>): Promise<IReservation | null> {
    const reservations = readReservations();
    const index = reservations.findIndex((r: IReservation) => r._id === id);
    
    if (index === -1) return null;
    
    reservations[index] = {
      ...reservations[index],
      ...reservationData,
      updatedAt: new Date()
    };
    
    saveReservations(reservations);
    return reservations[index];
  }

  // Eliminar reserva
  async findByIdAndDelete(id: string): Promise<boolean> {
    const reservations = readReservations();
    const filtered = reservations.filter((r: IReservation) => r._id !== id);
    
    if (filtered.length === reservations.length) return false;
    
    saveReservations(filtered);
    return true;
  }

  // Obtener reservas por fecha
  async findByDate(date: string): Promise<IReservation[]> {
    const reservations = readReservations();
    return reservations.filter((r: IReservation) => r.date === date);
  }

  // Obtener reservas por estado
  async findByStatus(status: string): Promise<IReservation[]> {
    const reservations = readReservations();
    return reservations.filter((r: IReservation) => r.status === status);
  }

  // Verificar disponibilidad en una fecha y hora específica
  async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    const reservations = readReservations();
    const existingReservation = reservations.find((r: IReservation) => 
      r.date === date && r.time === time && ['confirmado', 'pendiente'].includes(r.status)
    );
    return !existingReservation;
  }

  // Método estático para verificar disponibilidad
  static async isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    const reservations = readReservations();
    const existingReservation = reservations.find((r: IReservation) => 
      r.date === date && r.time === time && ['confirmado', 'pendiente'].includes(r.status)
    );
    return !existingReservation;
  }
}

export const reservationModel = new ReservationModel();
