import fs from 'fs';
import path from 'path';
import * as bcrypt from 'bcrypt';

// Ruta al archivo JSON donde guardamos usuarios
const filePath = path.join(__dirname, '..', 'database', 'users.json');

// Interfaz que coincide con el modelo de MongoDB
export interface IUser {
  _id: string;
  username: string;
  password: string;
  email: string;
  name?: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Leer usuarios (síncrono por simplicidad)
const readUsers = (): IUser[] => {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
};

// Guardar usuarios
const saveUsers = (users: IUser[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Generar ID único
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

class UserModel {
  // Crear un nuevo usuario
  async create(userData: Partial<IUser>): Promise<IUser> {
    const users = readUsers();
    const now = new Date();
    
    const newUser: IUser = {
      _id: generateId(),
      username: userData.username!,
      password: userData.password!,
      email: userData.email!,
      name: userData.name || '',
      phone: userData.phone || '',
      role: userData.role || 'user',
      createdAt: now,
      updatedAt: now
    };
    
    users.push(newUser);
    saveUsers(users);
    return newUser;
  }

  // Buscar usuario por username
  async findByUsername(username: string): Promise<IUser | null> {
    const users = readUsers();
    return users.find((u: IUser) => u.username === username) || null;
  }

  // Buscar usuario por email
  async findByEmail(email: string): Promise<IUser | null> {
    const users = readUsers();
    return users.find((u: IUser) => u.email === email) || null;
  }

  // Buscar usuario por ID
  async findById(id: string): Promise<IUser | null> {
    const users = readUsers();
    return users.find((u: IUser) => u._id === id) || null;
  }

  // Obtener todos los usuarios
  async findAll(): Promise<IUser[]> {
    return readUsers();
  }

  // Actualizar usuario
  async findByIdAndUpdate(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const users = readUsers();
    const index = users.findIndex((u: IUser) => u._id === id);
    
    if (index === -1) return null;
    
    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date()
    };
    
    saveUsers(users);
    return users[index];
  }

  // Eliminar usuario
  async findByIdAndDelete(id: string): Promise<boolean> {
    const users = readUsers();
    const filtered = users.filter((u: IUser) => u._id !== id);
    
    if (filtered.length === users.length) return false;
    
    saveUsers(filtered);
    return true;
  }

  // Verificar si existe un usuario con el username o email
  async findOne(query: any): Promise<IUser | null> {
    const users = readUsers();
    
    if (query.$or) {
      // Buscar por username o email
      return users.find((u: IUser) => 
        query.$or.some((condition: any) => 
          Object.keys(condition).some(key => u[key as keyof IUser] === condition[key])
        )
      ) || null;
    }
    
    // Búsqueda simple
    return users.find((u: IUser) => 
      Object.keys(query).every(key => u[key as keyof IUser] === query[key])
    ) || null;
  }

  // Método para obtener datos públicos del usuario
  toPublicJSON(user: IUser): any {
    const { password, ...publicUser } = user;
    return publicUser;
  }
}

export const userModel = new UserModel();
