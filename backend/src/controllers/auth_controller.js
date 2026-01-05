import { get, run } from "../db/connection.js";
import { gerarHashSenha, compararSenha } from "../utils/password.js";
import { gerarToken } from "../utils/token.js";

const ERRO_INTERNO = { erro: "Erro no servidor" };
const ERRO_CREDENCIAIS = { erro: "Credenciais inválidas" };

function limparTexto(valor) {
  return String(valor ?? "").trim();
}

function normalizarEmail(email) {
  return limparTexto(email).toLowerCase();
}

export async function cadastrar(req, res) {
  try {
    const nome = limparTexto(req.body?.nome);
    const email = normalizarEmail(req.body?.email);
    const senha = req.body?.senha;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ erro: "nome, email e senha são obrigatórios" });
    }

    const usuarioExistente = await get(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarioExistente) {
      return res.status(409).json({ erro: "E-mail já cadastrado" });
    }

    const senha_criptografada = await gerarHashSenha(senha);

    const resultado = await run(
      "INSERT INTO usuarios (nome, email, senha_criptografada) VALUES (?, ?, ?)",
      [nome, email, senha_criptografada]
    );

    return res.status(201).json({ id: resultado.ultimoId, nome, email });
  } catch (erro) {
    console.error("Erro no cadastro:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}

export async function login(req, res) {
  try {
    const email = normalizarEmail(req.body?.email);
    const senha = req.body?.senha;

    if (!email || !senha) {
      return res.status(400).json({ erro: "email e senha são obrigatórios" });
    }

    const usuario = await get(
      "SELECT id, nome, senha_criptografada FROM usuarios WHERE email = ?",
      [email]
    );

    if (!usuario) return res.status(401).json(ERRO_CREDENCIAIS);

    const senhaOk = await compararSenha(senha, usuario.senha_criptografada);
    if (!senhaOk) return res.status(401).json(ERRO_CREDENCIAIS);

    const token = gerarToken({
      usuarioId: usuario.id,
      nome: usuario.nome,
      email,
    });

    return res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email },
    });
  } catch (erro) {
    console.error("Erro no login:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}
