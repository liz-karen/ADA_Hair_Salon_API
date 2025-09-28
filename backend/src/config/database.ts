import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const connectDatabase = async (): Promise<void> => {
  try {
    // Verificar que la variable de entorno existe
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Base de datos MongoDB conectada exitosamente');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
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
  console.log('🔌 Conexión a MongoDB cerrada');
  process.exit(0);
});
