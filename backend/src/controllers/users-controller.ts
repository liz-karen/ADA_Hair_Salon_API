import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { findByUsername, addUser } from "../models/user-model.js";

// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email, name, phone } = req.body;

    if (!username || !password || !email) {
      res.status(400).json({ error: "Faltan datos obligatorios" });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = findByUsername(username);
    if (existingUser) {
      res.status(400).json({ error: "El usuario ya existe" });
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = addUser({
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
  } catch (error: any) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Usuario y contraseña son requeridos" });
      return;
    }

    const user = findByUsername(username);
    if (!user) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "secreto_default",
      { expiresIn: "24h" }
    );

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
  } catch (error: any) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};