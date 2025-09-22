const bcrypt = require('bcrypt');

async function generatePasswords() {
  try {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    console.log('Ì¥ê Contrase√±as hasheadas generadas:');
    console.log('Admin (admin123):', adminPassword);
    console.log('User (user123):', userPassword);
    
    console.log('\nÌ≥ã Actualiza los archivos JSON con estas contrase√±as hasheadas');
  } catch (error) {
    console.error('Error:', error);
  }
}

generatePasswords();
