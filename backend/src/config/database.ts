import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ada_hair_salon';
    
    await mongoose.connect(mongoUri);
    
    console.log('‚úÖ Base de datos MongoDB conectada exitosamente');
    console.log(`Ì≥ä Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('‚ùå Error conectando a MongoDB:', error);
    throw error;
  }
};

// Manejar eventos de conexi√≥n
mongoose.connection.on('error', (error) => {
  console.error('‚ùå Error de MongoDB:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('‚ö†Ô∏è MongoDB desconectado');
});

// Cerrar conexi√≥n cuando la aplicaci√≥n se cierre
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Ì¥å Conexi√≥n a MongoDB cerrada');
  process.exit(0);
});
