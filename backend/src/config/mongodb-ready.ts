// Configuración de MongoDB lista para cuando quieras migrar
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ada_hair_salon';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ Base de datos MongoDB conectada exitosamente');
    console.log(`��� Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
};

// Manejar eventos de conexión
mongoose.connection.on('error', (error) => {
  console.error('❌ Error de MongoDB:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

// Cerrar conexión cuando la aplicación se cierre
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('��� Conexión a MongoDB cerrada');
  process.exit(0);
});

// Para migrar a MongoDB en el futuro:
// 1. Descomenta la línea en index.ts: import { connectDatabase } from "./config/mongodb-ready";
// 2. Descomenta la línea: await connectDatabase();
// 3. Reemplaza los modelos JSON con los modelos de Mongoose
// 4. Actualiza las variables de entorno
