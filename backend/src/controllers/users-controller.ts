import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User, IUser } from "../models/User";
import { Reservation } from "../models/Reservation";

// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email, name, phone, role } = req.body;

    if (!username || !password || !email) {
      res.status(400).json({ error: "Faltan datos obligatorios" });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      const field = existingUser.username === username ? 'usuario' : 'email';
      res.status(400).json({ error: `El ${field} ya está registrado` });
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      name: name || "",
      phone: phone || "",
      role: role || "user"
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Usuario registrado exitosamente",
      user: newUser.toPublicJSON() 
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

    const user = await User.findOne({ username });
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
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "secreto_default",
      { expiresIn: "24h" }
    );

    res.json({ 
      message: "Login exitoso", 
      token,
      user: user.toPublicJSON() 
    });
  } catch (error: any) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener perfil del usuario
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json(user.toPublicJSON()); 
  } catch (error: any) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, phone, email } = req.body;

    // Verificar si el email ya existe en otro usuario
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        res.status(400).json({ error: "El email ya está registrado por otro usuario" });
        return;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { name, phone, email },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({
      message: "Perfil actualizado exitosamente",
      user: updatedUser.toPublicJSON() 
    });
  } catch (error: any) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Eliminar usuario
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    await Reservation.deleteMany({ userId: userId });
    
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Cuenta eliminada exitosamente" });
  } catch (error: any) {
    console.error("Error eliminando cuenta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
