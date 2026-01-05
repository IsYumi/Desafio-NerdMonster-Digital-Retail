import { all, get, run } from "../db/connection.js";

const ERRO_INTERNO = { erro: "Erro no servidor" };

const SELECT_PONTO = `
  SELECT
    id,
    latitude,
    longitude,
    COALESCE(titulo, '') AS nome,
    titulo,
    descricao,
    criado_em
  FROM pontos
`;

function getUsuarioId(req, res) {
  const usuarioId = req.usuario?.usuarioId;
  if (!usuarioId) {
    res.status(401).json({ erro: "Não autenticado." });
    return null;
  }
  return usuarioId;
}

function parseId(valor, mensagem, res) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ erro: mensagem });
    return null;
  }
  return id;
}

async function validarMapaDoUsuario(mapaId, usuarioId, res) {
  const mapa = await get(
    "SELECT id FROM mapas WHERE id = ? AND usuario_id = ?",
    [mapaId, usuarioId]
  );
  if (!mapa) {
    res.status(404).json({ erro: "Mapa não encontrado." });
    return false;
  }
  return true;
}

async function validarPontoDoUsuario(pontoId, usuarioId, res) {
  const ponto = await get(
    "SELECT id FROM pontos WHERE id = ? AND usuario_id = ?",
    [pontoId, usuarioId]
  );
  if (!ponto) {
    res.status(404).json({ erro: "Ponto não encontrado." });
    return false;
  }
  return true;
}


export async function listarPontos(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const mapaId = parseId(req.params.mapaId, "ID do mapa inválido.", res);
    if (!mapaId) return;

    const ok = await validarMapaDoUsuario(mapaId, usuarioId, res);
    if (!ok) return;

    const pontos = await all(
      `
      ${SELECT_PONTO}
      WHERE mapa_id = ? AND usuario_id = ?
      ORDER BY criado_em DESC
      `,
      [mapaId, usuarioId]
    );

    return res.json(pontos);
  } catch (erro) {
    console.error("Erro ao listar pontos:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}


export async function criarPonto(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const mapaId = parseId(req.params.mapaId, "ID do mapa inválido.", res);
    if (!mapaId) return;

    const ok = await validarMapaDoUsuario(mapaId, usuarioId, res);
    if (!ok) return;

    const nome = String(req.body?.nome ?? "").trim();
    if (!nome) return res.status(400).json({ erro: "Nome do ponto é obrigatório." });

    const lat = Number(req.body?.latitude);
    const lng = Number(req.body?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ erro: "Latitude e longitude inválidas." });
    }

    const resultado = await run(
      `
      INSERT INTO pontos (mapa_id, usuario_id, latitude, longitude, titulo)
      VALUES (?, ?, ?, ?, ?)
      `,
      [mapaId, usuarioId, lat, lng, nome]
    );

    const pontoId = resultado?.lastID ?? resultado?.ultimoId ?? resultado?.id;

    const pontoCriado = await get(
      `
      ${SELECT_PONTO}
      WHERE id = ? AND usuario_id = ?
      `,
      [pontoId, usuarioId]
    );

    return res.status(201).json(pontoCriado);
  } catch (erro) {
    console.error("Erro ao criar ponto:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}

export async function editarPonto(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const pontoId = parseId(req.params.id, "ID do ponto inválido.", res);
    if (!pontoId) return;

    const nome = String(req.body?.nome ?? "").trim();
    if (!nome) return res.status(400).json({ erro: "Nome do ponto é obrigatório." });

    const ok = await validarPontoDoUsuario(pontoId, usuarioId, res);
    if (!ok) return;

    await run(
      "UPDATE pontos SET titulo = ? WHERE id = ? AND usuario_id = ?",
      [nome, pontoId, usuarioId]
    );

    const atualizado = await get(
      `
      ${SELECT_PONTO}
      WHERE id = ? AND usuario_id = ?
      `,
      [pontoId, usuarioId]
    );

    return res.json(atualizado);
  } catch (erro) {
    console.error("Erro ao editar ponto:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}


export async function deletarPonto(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const pontoId = parseId(req.params.id, "ID do ponto inválido.", res);
    if (!pontoId) return;

    const ok = await validarPontoDoUsuario(pontoId, usuarioId, res);
    if (!ok) return;

    await run("DELETE FROM pontos WHERE id = ? AND usuario_id = ?", [pontoId, usuarioId]);
    return res.json({ ok: true });
  } catch (erro) {
    console.error("Erro ao deletar ponto:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}

export async function deletarTodosPontos(req, res) {
  try {
    const usuarioId = getUsuarioId(req, res);
    if (!usuarioId) return;

    const mapaId = parseId(req.params.mapaId, "ID do mapa inválido.", res);
    if (!mapaId) return;

    const ok = await validarMapaDoUsuario(mapaId, usuarioId, res);
    if (!ok) return;

    await run("DELETE FROM pontos WHERE mapa_id = ? AND usuario_id = ?", [mapaId, usuarioId]);
    return res.json({ ok: true });
  } catch (erro) {
    console.error("Erro ao deletar todos os pontos:", erro);
    return res.status(500).json(ERRO_INTERNO);
  }
}
