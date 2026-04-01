const path = require("path");
const { createRequire } = require("module");

const backendRequire = createRequire(
  path.join(__dirname, "..", "backend", "package.json")
);
const { Pool } = backendRequire("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "saep",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("Conexao com PostgreSQL realizada com sucesso.");
  })
  .catch((erro) => {
    console.error("Falha ao conectar ao PostgreSQL:", erro.message);
  });

module.exports = pool;
