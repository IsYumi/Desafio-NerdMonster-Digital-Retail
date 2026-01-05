import bcrypt from "bcrypt";

export async function gerarHashSenha(senha) {
  return bcrypt.hash(senha, 10);
}

export async function compararSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}
