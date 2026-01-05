import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

export function gerarToken(dados) {
  return jwt.sign(dados, SECRET, { expiresIn: "2h" });
}

export function validarToken(token) {
  return jwt.verify(token, SECRET);
}
