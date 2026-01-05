import { validarToken } from "../utils/token.js";

export function autenticar(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token ausente" });
  }

  const token = auth.slice(7);

  try {
    const payload = validarToken(token);
    req.usuario = payload;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}
