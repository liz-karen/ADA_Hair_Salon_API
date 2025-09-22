import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para el documento de usuario
export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema de usuario
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre de usuario no puede exceder 50 caracteres']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede exceder 20 caracteres']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true, // Crea automáticamente createdAt y updatedAt
  versionKey: false // No incluir __v
});

// Índices para mejorar el rendimiento
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Método para obtener datos públicos del usuario
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Modelo de usuario
export const User = mongoose.model<IUser>('User', userSchema);
