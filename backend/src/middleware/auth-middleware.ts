import { Request, Response, NextFunction } from "express";
// Importamos jsonwebtoken como módulo completo
import * as jwt from "jsonwebtoken";

// Interfaz para indicar cómo será el payload de nuestro token
interface JwtPayload {
  id: number;
  username: string;
}

// Middleware para autenticar usuarios con JWT
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Obtenemos el header de autorización
  const authHeader = req.headers["authorization"];
  // Extraemos el token (sin la palabra "Bearer")
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    // Verificamos que el token sea válido
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secreto_default"
    ) as JwtPayload;

    // Guardamos la info del usuario en el request para usarlo después
    (req as any).user = decoded;

    // Pasamos al siguiente middleware o controlador
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
}