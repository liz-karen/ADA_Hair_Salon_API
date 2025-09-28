const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Importar modelos
const User = require('../backend/dist/models/User').User;
const Reservation = require('../backend/dist/models/Reservation').Reservation;

const seedData = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ada_hair_salon');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes
    await User.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Datos existentes eliminados');

    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      password: adminPassword,
      email: 'admin@adahairsalon.com',
      name: 'Administrador',
      phone: '1234567890',
      role: 'admin'
    });
    await admin.save();
    console.log('Usuario administrador creado');

    // Crear usuario de prueba
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      username: 'valeria',
      password: userPassword,
      email: 'valeria@example.com',
      name: 'Valeria García',
      phone: '0987654321',
      role: 'user'
    });
    await user.save();
    console.log('Usuario de prueba creado');

    // Crear reservas de prueba
    const reservations = [
      {
        date: '2024-12-25',
        time: '10:30',
        service: 'Corte de cabello',
        notes: 'Corte moderno',
        price: 25.00,
        userId: user._id,
        status: 'confirmado'
      },
      {
        date: '2024-12-26',
        time: '14:00',
        service: 'Tinte y mechas',
        notes: 'Color rubio claro',
        price: 80.00,
        userId: user._id,
        status: 'confirmado'
      }
    ];

    for (const reservationData of reservations) {
      const reservation = new Reservation(reservationData);
      await reservation.save();
    }
    console.log('Reservas de prueba creadas');

    console.log('\n Datos de prueba insertados exitosamente!');
    console.log('\n Credenciales de prueba:');
    console.log('Admin - Usuario: admin, Contraseña: admin123');
    console.log('Usuario - Usuario: valeria, Contraseña: user123');

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  }
};

seedData();
