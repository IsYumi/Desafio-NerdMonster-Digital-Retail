import { Router } from "express";
import * as authController from "../controllers/auth_controller.js";

const router = Router();

router.post("/usuarios", authController.cadastrar);
router.post("/login", authController.login);

export default router;
