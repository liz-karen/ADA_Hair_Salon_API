"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.findById = exports.findByUsername = exports.addUser = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ruta al archivo JSON donde guardamos usuarios
const filePath = path_1.default.join(__dirname, '..', 'database', 'users.json');
// Leer usuarios (síncrono por simplicidad)
const readUsers = () => {
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
};
// Guardar usuarios
const saveUsers = (users) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(users, null, 2));
};
// Agregar usuario (se espera password ya hasheada)
const addUser = (userData) => {
    const users = readUsers();
    const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = { id: nextId, ...userData };
    users.push(newUser);
    saveUsers(users);
    return newUser;
};
exports.addUser = addUser;
// Buscar por username
const findByUsername = (username) => {
    const users = readUsers();
    return users.find((u) => u.username === username);
};
exports.findByUsername = findByUsername;
// Buscar por id
const findById = (id) => {
    const users = readUsers();
    return users.find((u) => u.id === id);
};
exports.findById = findById;
// Obtener todos los usuarios
const getAllUsers = () => {
    return readUsers();
};
exports.getAllUsers = getAllUsers;
