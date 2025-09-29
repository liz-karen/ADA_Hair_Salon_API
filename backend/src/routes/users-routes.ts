import { Router } from "express";
import { register, login, getProfile, updateProfile, deleteAccount } from "../controllers/users-controller";
import { authenticateToken } from "../middleware/auth-middleware";

const router = Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.delete("/profile", authenticateToken, deleteAccount);

export default router;
