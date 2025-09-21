import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";

const users: any[] = []; // simulamos la BD

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: "Usuario registrado", user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "secreto_default",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
