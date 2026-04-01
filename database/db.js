const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const databasePath = path.join(__dirname, "saep.db");
const databaseExists = fs.existsSync(databasePath);

const db = new DatabaseSync(databasePath);

db.exec("PRAGMA foreign_keys = ON;");

function inicializarBanco() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      descricao TEXT NOT NULL,
      setor TEXT NOT NULL,
      prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta')),
      data_cadastro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'a fazer' CHECK (status IN ('a fazer', 'fazendo', 'pronto')),
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT
    );
  `);

  const totalUsuarios = db.prepare("SELECT COUNT(*) AS total FROM usuarios").get().total;

  if (totalUsuarios > 0) {
    return;
  }

  db.exec(`
    INSERT INTO usuarios (nome, email) VALUES
      ('Ana Souza', 'ana.souza@empresa.com'),
      ('Bruno Lima', 'bruno.lima@empresa.com'),
      ('Carla Mendes', 'carla.mendes@empresa.com');

    INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status) VALUES
      (1, 'Separar pedidos urgentes para expedicao', 'Logistica', 'alta', 'a fazer'),
      (2, 'Atualizar etiquetas do estoque refrigerado', 'Armazem', 'media', 'fazendo'),
      (3, 'Conferir registros do controle de qualidade', 'Qualidade', 'alta', 'pronto');
  `);
}

function normalizarSql(sql) {
  return sql.replace(/\$(\d+)/g, "?").trim();
}

function consultaRetornaLinhas(sql) {
  const texto = sql.trim().toUpperCase();
  return (
    texto.startsWith("SELECT") ||
    texto.startsWith("WITH") ||
    texto.startsWith("PRAGMA") ||
    texto.includes(" RETURNING ")
  );
}

async function query(sql, params = []) {
  const sqlNormalizado = normalizarSql(sql);
  const statement = db.prepare(sqlNormalizado);

  if (consultaRetornaLinhas(sqlNormalizado)) {
    const rows = statement.all(...params);
    return {
      rows,
      rowCount: rows.length,
    };
  }

  const resultado = statement.run(...params);
  return {
    rows: [],
    rowCount: resultado.changes,
    lastInsertRowid: resultado.lastInsertRowid,
  };
}

inicializarBanco();

if (!databaseExists) {
  console.log(`Banco SQLite criado em ${databasePath}`);
} else {
  console.log(`Banco SQLite carregado em ${databasePath}`);
}

module.exports = {
  query,
  path: databasePath,
};
