import { Request, Response, NextFunction } from "express";

// Middleware global de manejo de errores
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error detectado:", err);

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "JSON mal formado" });
  }

  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
};
