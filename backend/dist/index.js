"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importamos las dependencias principales
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Importamos middlewares personalizados
const error_handler_js_1 = require("./middleware/error-handler.js");
// Importamos las rutas
const users_routes_js_1 = __importDefault(require("./routes/users-routes.js"));
const reservations_routes_js_1 = __importDefault(require("./routes/reservations-routes.js"));
// Cargamos las variables de entorno
dotenv_1.default.config();
// Inicializamos la aplicación Express
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir archivos estáticos
const publicPath = path_1.default.resolve(__dirname, "../public");
app.use(express_1.default.static(publicPath));
// Rutas
app.use("/api/users", users_routes_js_1.default);
app.use("/api/reservations", reservations_routes_js_1.default);
// Ruta raíz
app.get("/", (_req, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
// Manejo de errores
app.use(error_handler_js_1.errorHandler);
// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
