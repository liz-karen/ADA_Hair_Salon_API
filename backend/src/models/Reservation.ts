import mongoose, { Document, Schema, Types } from 'mongoose';

// Interfaz para el documento de reserva
export interface IReservation extends Document {
  date: string;
  time: string;
  service: string;
  notes?: string;
  status: string;
  price?: number;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema de reserva
const reservationSchema = new Schema<IReservation>({
  date: {
    type: String,
    required: [true, 'La fecha es requerida'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD']
  },
  time: {
    type: String,
    required: [true, 'La hora es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'La hora debe estar en formato HH:MM']
  },
  service: {
    type: String,
    required: [true, 'El servicio es requerido'],
    trim: true,
    maxlength: [100, 'El servicio no puede exceder 100 caracteres']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: ['confirmado', 'cancelado', 'completado', 'pendiente'],
    default: 'confirmado'
  },
  price: {
    type: Number,
    min: [0, 'El precio no puede ser negativo']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID del usuario es requerido']
  }
}, {
  timestamps: true, // Crea automáticamente createdAt y updatedAt
  versionKey: false // No incluir __v
});

// Índices para mejorar el rendimiento
reservationSchema.index({ userId: 1 });
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ status: 1 });

// Índice compuesto para verificar disponibilidad
reservationSchema.index({ date: 1, time: 1, status: 1 });

// Método para verificar si un horario está disponible
reservationSchema.statics.isTimeSlotAvailable = async function(date: string, time: string) {
  const existingReservation = await this.findOne({
    date,
    time,
    status: { $in: ['confirmado', 'pendiente'] }
  });
  return !existingReservation;
};

// Método para obtener reservas por usuario
reservationSchema.statics.findByUserId = function(userId: string) {
  return this.find({ userId }).populate('userId', 'username email name');
};

// Método para obtener reservas por fecha
reservationSchema.statics.findByDate = function(date: string) {
  return this.find({ date }).populate('userId', 'username email name phone');
};

// Modelo de reserva
export const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);
