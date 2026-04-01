const pool = require("../../database/db");

function criarErro(mensagem, statusCode = 400) {
  const erro = new Error(mensagem);
  erro.statusCode = statusCode;
  return erro;
}

function validarId(id, campo) {
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro(`ID de ${campo} invalido.`);
  }
}

function validarTextoObrigatorio(valor, campo, minimo = 2) {
  if (!valor || typeof valor !== "string" || valor.trim().length < minimo) {
    throw criarErro(`Informe ${campo} com pelo menos ${minimo} caracteres.`);
  }

  return valor.trim();
}

function validarPrioridade(prioridade) {
  const valor = String(prioridade || "").trim().toLowerCase();
  const prioridades = ["baixa", "media", "alta"];

  if (!prioridades.includes(valor)) {
    throw criarErro("Informe uma prioridade valida: baixa, media ou alta.");
  }

  return valor;
}

function validarStatus(status, obrigatorio = true) {
  const valor = String(status || "").trim().toLowerCase();
  const statusValidos = ["a fazer", "fazendo", "pronto"];

  if (!valor && !obrigatorio) {
    return null;
  }

  if (!statusValidos.includes(valor)) {
    throw criarErro("Informe um status valido: a fazer, fazendo ou pronto.");
  }

  return valor;
}

async function validarUsuarioExistente(idUsuario) {
  validarId(idUsuario, "usuario");

  const resultado = await pool.query(
    `SELECT id
     FROM usuarios
     WHERE id = $1`,
    [idUsuario]
  );

  if (resultado.rowCount === 0) {
    throw criarErro("Selecione um usuario cadastrado.", 404);
  }
}

async function listarTarefas() {
  const resultado = await pool.query(
    `SELECT
        t.id,
        t.id_usuario,
        t.descricao,
        t.setor,
        t.prioridade,
        t.data_cadastro,
        t.status,
        u.nome AS usuario_nome,
        u.email AS usuario_email
     FROM tarefas t
     INNER JOIN usuarios u ON u.id = t.id_usuario
     ORDER BY
       CASE t.status
         WHEN 'a fazer' THEN 1
         WHEN 'fazendo' THEN 2
         ELSE 3
       END,
       CASE t.prioridade
         WHEN 'alta' THEN 1
         WHEN 'media' THEN 2
         ELSE 3
       END,
       t.data_cadastro DESC`
  );

  return resultado.rows;
}

async function buscarTarefaPorId(id) {
  validarId(id, "tarefa");

  const resultado = await pool.query(
    `SELECT
        t.id,
        t.id_usuario,
        t.descricao,
        t.setor,
        t.prioridade,
        t.data_cadastro,
        t.status,
        u.nome AS usuario_nome,
        u.email AS usuario_email
     FROM tarefas t
     INNER JOIN usuarios u ON u.id = t.id_usuario
     WHERE t.id = $1`,
    [id]
  );

  return resultado.rows[0] || null;
}

async function criarTarefa(dados) {
  const idUsuario = Number(dados.id_usuario);
  const descricao = validarTextoObrigatorio(dados.descricao, "a descricao da tarefa", 5);
  const setor = validarTextoObrigatorio(dados.setor, "o setor", 2);
  const prioridade = validarPrioridade(dados.prioridade);
  const status = validarStatus(dados.status || "a fazer");

  await validarUsuarioExistente(idUsuario);

  const resultado = await pool.query(
    `INSERT INTO tarefas (
        id_usuario,
        descricao,
        setor,
        prioridade,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
    [idUsuario, descricao, setor, prioridade, status]
  );

  return buscarTarefaPorId(resultado.rows[0].id);
}

async function atualizarTarefa(id, dados) {
  validarId(id, "tarefa");

  const tarefaAtual = await buscarTarefaPorId(id);
  if (!tarefaAtual) {
    return null;
  }

  const idUsuario = Number(dados.id_usuario);
  const descricao = validarTextoObrigatorio(dados.descricao, "a descricao da tarefa", 5);
  const setor = validarTextoObrigatorio(dados.setor, "o setor", 2);
  const prioridade = validarPrioridade(dados.prioridade);
  const status = validarStatus(dados.status);

  await validarUsuarioExistente(idUsuario);

  await pool.query(
    `UPDATE tarefas
     SET id_usuario = $1,
         descricao = $2,
         setor = $3,
         prioridade = $4,
         status = $5
     WHERE id = $6`,
    [idUsuario, descricao, setor, prioridade, status, id]
  );

  return buscarTarefaPorId(id);
}

async function atualizarStatusTarefa(id, status) {
  validarId(id, "tarefa");
  const statusValidado = validarStatus(status);

  const resultado = await pool.query(
    `UPDATE tarefas
     SET status = $1
     WHERE id = $2
     RETURNING id`,
    [statusValidado, id]
  );

  if (resultado.rowCount === 0) {
    return null;
  }

  return buscarTarefaPorId(id);
}

async function deletarTarefa(id) {
  validarId(id, "tarefa");

  const resultado = await pool.query(
    `DELETE FROM tarefas
     WHERE id = $1`,
    [id]
  );

  return resultado.rowCount > 0;
}

module.exports = {
  listarTarefas,
  buscarTarefaPorId,
  criarTarefa,
  atualizarTarefa,
  atualizarStatusTarefa,
  deletarTarefa,
};
