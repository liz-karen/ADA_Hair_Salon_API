// Modelo sencillo para usuarios (base de datos JSON)
import fs from 'fs';
import path from 'path';

// ruta al archivo JSON donde guardamos usuarios
const filePath = path.join(__dirname, '..', 'database', 'users.json');

// Leer usuarios (síncrono por simplicidad)
const readUsers = () => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

// Guardar usuarios
const saveUsers = (users: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Agregar usuario (se espera password ya hasheada)
const addUser = (userData: any) => {
  const users = readUsers();
  const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = { id: nextId, ...userData };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Buscar por username
const findByUsername = (username: string) => {
  const users = readUsers();
  return users.find((u: any) => u.username === username);
};

// Buscar por id
const findById = (id: number) => {
  const users = readUsers();
  return users.find((u: any) => u.id === id);
};

export { readUsers, saveUsers, addUser, findByUsername, findById };
