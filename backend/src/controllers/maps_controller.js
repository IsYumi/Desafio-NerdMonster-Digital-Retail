import { all, get, run } from "../db/connection.js";

const ERRO_INTERNO = { erro: "Erro no servidor" };

function getUsuarioId(req, res) {
  const usuarioId = req.usuario?.usuarioId;
  if (!usuarioId) {
    res.status(401).json({ erro: "Não autenticado." });
    return null;
  }
  return usuarioId;
}

function parseId(valor, res) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ erro: "ID do mapa inválido." });
    return null;
  }
  return id;
}

export async function listarMapas(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const mapas = await all(
      `
      SELECT 
        m.id,
        m.nome,
        m.criado_em,
        COUNT(p.id) AS qtd_pontos
      FROM mapas m
      LEFT JOIN pontos p ON p.mapa_id = m.id
      WHERE m.usuario_id = ?
      GROUP BY m.id
      ORDER BY m.criado_em DESC
      `,
      [usuarioId]
    );

    return res.json(mapas);
  } catch (erro) {
    console.error("Erro ao listar mapas:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}

export async function obterMapa(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const mapaId = parseId(req.params.id, res);
    if (!mapaId) return;

    const mapa = await get(
      "SELECT id, nome, criado_em FROM mapas WHERE id = ? AND usuario_id = ?",
      [mapaId, usuarioId]
    );

    if (!mapa) return res.status(404).json({ erro: "Mapa não encontrado." });

    return res.json(mapa);
  } catch (erro) {
    console.error("Erro ao obter mapa:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}

export async function criarMapa(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const nome = String(req.body?.nome ?? "").trim();
    if (!nome) return res.status(400).json({ erro: "Digite o nome do mapa." });

    const resultado = await run(
      "INSERT INTO mapas (usuario_id, nome) VALUES (?, ?)",
      [usuarioId, nome]
    );

    const novoId = resultado?.lastID ?? resultado?.ultimoId ?? resultado?.id;

    const mapaCriado = await get(
      "SELECT id, nome, criado_em FROM mapas WHERE id = ? AND usuario_id = ?",
      [novoId, usuarioId]
    );

    return res.status(201).json({ ...mapaCriado, qtd_pontos: 0 });
  } catch (erro) {
    console.error("Erro ao criar mapa:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}

export async function deletarMapa(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const mapaId = parseId(req.params.id, res);
    if (!mapaId) return;

    const mapa = await get(
      "SELECT id FROM mapas WHERE id = ? AND usuario_id = ?",
      [mapaId, usuarioId]
    );

    if (!mapa) return res.status(404).json({ erro: "Mapa não encontrado." });

    await run("DELETE FROM mapas WHERE id = ? AND usuario_id = ?", [
      mapaId,
      usuarioId,
    ]);

    return res.json({ ok: true });
  } catch (erro) {
    console.error("Erro ao deletar mapa:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}
