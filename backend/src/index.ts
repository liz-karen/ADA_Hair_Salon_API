// Importamos las dependencias principales
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Importamos la conexión a MongoDB
import { connectDatabase } from "./config/database";

// Importamos middlewares personalizados
import { errorHandler } from "./middleware/error-handler";

// Importamos las rutas
import userRoutes from "./routes/users-routes";
import reservationRoutes from "./routes/reservations-routes";

// Cargamos las variables de entorno
dotenv.config();

// Inicializamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
const publicPath = path.resolve(__dirname, "../../public");
app.use(express.static(publicPath));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

// Ruta raíz
app.get("/", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Manejo de errores
app.use(errorHandler);

// Iniciamos el servidor CON MongoDB Atlas
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Conectado a MongoDB Atlas`); 
      console.log(`💾 Datos guardándose en la nube (Atlas)`); 
    });
    
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};


startServer();

