const bcrypt = require('bcrypt');

async function generatePasswords() {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    console.log('Contraseñas hasheadas generadas:');
    console.log('Admin (admin123):', adminPassword);
    console.log('User (user123):', userPassword);
    
    console.log('\n Actualiza los archivos JSON con estas contraseñas hasheadas');
  } catch (error) {
    console.error('Error:', error);
  }
}

generatePasswords();
