"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const user_model_js_1 = require("../models/user-model.js");
// Registro de usuario
const register = async (req, res) => {
    try {
        const { username, password, email, name, phone } = req.body;
        if (!username || !password || !email) {
            res.status(400).json({ error: "Faltan datos obligatorios" });
            return;
        }
        // Verificar si el usuario ya existe
        const existingUser = (0, user_model_js_1.findByUsername)(username);
        if (existingUser) {
            res.status(400).json({ error: "El usuario ya existe" });
            return;
        }
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        // Crear nuevo usuario
        const newUser = (0, user_model_js_1.addUser)({
            username,
            password: hashedPassword,
            email,
            name: name || "",
            phone: phone || ""
        });
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name
            }
        });
    }
    catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.register = register;
// Login de usuario
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: "Usuario y contraseña son requeridos" });
            return;
        }
        const user = (0, user_model_js_1.findByUsername)(username);
        if (!user) {
            res.status(401).json({ error: "Credenciales inválidas" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Credenciales inválidas" });
            return;
        }
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || "secreto_default", { expiresIn: "24h" });
        res.json({
            message: "Login exitoso",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.login = login;
