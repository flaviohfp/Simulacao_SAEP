const fs = require("fs");
const path = require("path");

let Pool;

try {
  ({ Pool } = require("pg"));
} catch (erro) {
  ({ Pool } = require(path.join(__dirname, "..", "backend", "node_modules", "pg")));
}

const schemaPath = path.join(__dirname, "schema.sql");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || undefined,
  database: process.env.PGDATABASE || "saep",
});

let bancoInicializado = false;

async function inicializarBanco() {
  if (bancoInicializado) {
    return;
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
