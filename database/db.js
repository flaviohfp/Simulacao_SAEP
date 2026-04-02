const fs = require("fs");
const path = require("path");

let Pool;

try {
  ({ Pool } = require("pg"));
} catch (erro) {
  ({ Pool } = require(path.join(__dirname, "..", "backend", "node_modules", "pg")));
}

const schemaPath = path.join(__dirname, "schema.sql");
const envPath = path.join(__dirname, "..", ".env");

function carregarEnv() {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const linhas = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  linhas.forEach((linha) => {
    const texto = linha.trim();

    if (!texto || texto.startsWith("#")) {
      return;
    }

    const separador = texto.indexOf("=");

    if (separador === -1) {
      return;
    }

    const chave = texto.slice(0, separador).trim();
    const valorBruto = texto.slice(separador + 1).trim();
    const valor = valorBruto.replace(/^['"]|['"]$/g, "");

    if (!(chave in process.env)) {
      process.env[chave] = valor;
    }
  });
}

carregarEnv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD ?? "",
  database: process.env.PGDATABASE || "saep",
});

let bancoInicializado = false;

async function inicializarBanco() {
  if (bancoInicializado) {
    return;
  }

  if (!process.env.DATABASE_URL && !process.env.PGPASSWORD) {
    throw new Error(
      "Defina a senha do PostgreSQL no arquivo .env da raiz do projeto ou use DATABASE_URL."
    );
  }

  const schemaSql = fs.readFileSync(schemaPath, "utf8");
  await pool.query(schemaSql);
  bancoInicializado = true;
  console.log("Banco PostgreSQL inicializado com sucesso.");
}

async function query(sql, params = []) {
  return pool.query(sql, params);
}

module.exports = {
  query,
  pool,
  inicializarBanco,
};
