import { Router } from "express";
import { register, login, getProfile, updateProfile } from "../controllers/users-controller";
import { authenticateToken } from "../middleware/auth-middleware";

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);

export default router;
