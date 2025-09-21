import fs from 'fs';
import path from 'path';

// ruta al archivo JSON donde guardamos usuarios
const filePath = path.join(__dirname, '..', 'database', 'users.json');

// Leer usuarios (síncrono por simplicidad)
const readUsers = (): any[] => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

// Guardar usuarios
const saveUsers = (users: any[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Agregar usuario (se espera password ya hasheada)
export const addUser = (userData: any): any => {
  const users = readUsers();
  const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = { id: nextId, ...userData };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Buscar por username
export const findByUsername = (username: string): any => {
  const users = readUsers();
  return users.find((u: any) => u.username === username);
};

// Buscar por id
export const findById = (id: number): any => {
  const users = readUsers();
  return users.find((u: any) => u.id === id);
};

// Obtener todos los usuarios
export const getAllUsers = (): any[] => {
  return readUsers();
};