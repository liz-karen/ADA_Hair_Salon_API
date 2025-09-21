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
exports.authenticateToken = authenticateToken;
// Importamos jsonwebtoken como módulo completo
const jwt = __importStar(require("jsonwebtoken"));
// Middleware para autenticar usuarios con JWT
function authenticateToken(req, res, next) {
    // Obtenemos el header de autorización
    const authHeader = req.headers["authorization"];
    // Extraemos el token (sin la palabra "Bearer")
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }
    try {
        // Verificamos que el token sea válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_default");
        // Guardamos la info del usuario en el request para usarlo después
        req.user = decoded;
        // Pasamos al siguiente middleware o controlador
        next();
    }
    catch (error) {
        return res.status(403).json({ error: "Token inválido" });
    }
}
