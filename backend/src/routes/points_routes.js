import { Router } from "express";
import { autenticar } from "../middleware/auth_middleware.js";
import {
  listarPontos,
  criarPonto,
  editarPonto,
  deletarPonto,
  deletarTodosPontos
} from "../controllers/points_controller.js";

const router = Router();

router.use(autenticar);

router.get("/mapas/:mapaId/pontos", listarPontos);
router.post("/mapas/:mapaId/pontos", criarPonto);
router.delete("/mapas/:mapaId/pontos", deletarTodosPontos);

router.put("/pontos/:id", editarPonto);
router.delete("/pontos/:id", deletarPonto);

export default router;
