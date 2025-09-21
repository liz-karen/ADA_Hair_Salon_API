"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Middleware global de manejo de errores
const errorHandler = (err, _req, res, _next) => {
    console.error("Error detectado:", err);
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({ error: "JSON mal formado" });
        return;
    }
    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor",
    });
};
exports.errorHandler = errorHandler;
