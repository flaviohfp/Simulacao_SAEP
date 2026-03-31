const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "SAEP",
    password: "root",
    port: 5432
});

pool.query("SELECT NOW()", (err, res) => {

    if (err) {
        console.error("Erro ao conectar no banco", err);
    } else {
        console.log("Conectado ao PostgreSQL:", res.rows[0]);
    }

});

module.exports = pool;