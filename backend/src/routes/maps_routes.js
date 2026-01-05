import { Router } from "express";
import { autenticar } from "../middleware/auth_middleware.js";
import {
  listarMapas,
  obterMapa,
  criarMapa,
  deletarMapa,
} from "../controllers/maps_controller.js";

const router = Router();

router.use(autenticar);

router.get("/mapas", listarMapas);
router.get("/mapas/:id", obterMapa);
router.post("/mapas", criarMapa);
router.delete("/mapas/:id", deletarMapa);

export default router;
