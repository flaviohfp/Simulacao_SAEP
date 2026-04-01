const pool = require("../../database/db");

function criarErro(mensagem, statusCode = 400) {
  const erro = new Error(mensagem);
  erro.statusCode = statusCode;
  return erro;
}

function validarId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw criarErro("ID de usuario invalido.");
  }
}

function validarNome(nome) {
  if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
    throw criarErro("Informe um nome com pelo menos 3 caracteres.");
  }

  return nome.trim();
}

function validarEmail(email) {
  const emailNormalizado = String(email || "").trim().toLowerCase();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(emailNormalizado)) {
    throw criarErro("Informe um e-mail valido.");
  }

  return emailNormalizado;
}

function tratarErroBanco(erro) {
  if (erro.code === "23505") {
    throw criarErro("Ja existe um usuario cadastrado com este e-mail.", 409);
  }

  if (erro.code === "23503") {
    throw criarErro(
      "Nao e possivel remover este usuario porque ele possui tarefas vinculadas.",
      409
    );
  }

  throw erro;
}

async function listarUsuarios() {
  const resultado = await pool.query(
    `SELECT id, nome, email
     FROM usuarios
     ORDER BY nome ASC`
  );

  return resultado.rows;
}

async function buscarUsuarioPorId(id) {
  validarId(id);

  const resultado = await pool.query(
    `SELECT id, nome, email
     FROM usuarios
     WHERE id = $1`,
    [id]
  );

  return resultado.rows[0] || null;
}

async function criarUsuario(dados) {
  const nome = validarNome(dados.nome);
  const email = validarEmail(dados.email);

  try {
    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email)
       VALUES ($1, $2)
       RETURNING id, nome, email`,
      [nome, email]
    );

    return resultado.rows[0];
  } catch (erro) {
    tratarErroBanco(erro);
  }
}

async function atualizarUsuario(id, dados) {
  validarId(id);

  const usuarioAtual = await buscarUsuarioPorId(id);
  if (!usuarioAtual) {
    return null;
  }

  const nome = validarNome(dados.nome);
  const email = validarEmail(dados.email);

  try {
    const resultado = await pool.query(
      `UPDATE usuarios
       SET nome = $1,
           email = $2
       WHERE id = $3
       RETURNING id, nome, email`,
      [nome, email, id]
    );

    return resultado.rows[0] || null;
  } catch (erro) {
    tratarErroBanco(erro);
  }
}

async function deletarUsuario(id) {
  validarId(id);

  try {
    const resultado = await pool.query(
      `DELETE FROM usuarios
       WHERE id = $1`,
      [id]
    );

    return resultado.rowCount > 0;
  } catch (erro) {
    tratarErroBanco(erro);
  }
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
};
