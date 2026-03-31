const pool = require("../database/db");

let usuarios = [];
let proximoId = 1;


/* -------------------------
   FUNÇÕES DE LÓGICA
-------------------------- */


async function listarUsuarios() {

    const resultado = await pool.query(
        "SELECT * FROM usuarios ORDER BY id"
    );

    return resultado.rows;
}



async function criarUsuario(nome, email) {
    // Validação de nome vazio
    if (!nome || nome.trim() === "") {
        throw new Error("Nome é obrigatório");
    }

    // Nome deve ter no mínimo 3 caracteres
    if (nome.trim().length < 3) {
        throw new Error("Nome deve ter no mínimo 3 caracteres");
    }

   

    // Email obrigatório
    if (!email || email.trim() === "") {
        throw new Error("Email é obrigatório");
    }

    // Email deve conter @
    if (!email.includes("@")) {
        throw new Error("Email deve conter @");
    }

    const resultado = await pool.query(
        `
        INSERT INTO usuarios (nome, email)
        VALUES ($1, $2)
        RETURNING *
        `,
        [nome, email]
    );

    return resultado.rows[0];
}

async function atualizarUsuario(id, nome, email) {
    const usuario = await buscarUsuarioPorId(id);

    if (!usuario) {
        return null;
    }

    // Validação de nome
    if (nome !== undefined && nome !== null) {
        if (nome.trim() === "") {
            throw new Error("Nome é obrigatório");
        }
        if (nome.trim().length < 3) {
            throw new Error("Nome deve ter no mínimo 3 caracteres");
        }
        usuario.nome = nome.trim();
    }

   

    // Validação de email
    if (email !== undefined && email !== null) {
        if (email.trim() === "") {
            throw new Error("Email é obrigatório");
        }
        if (!email.includes("@")) {
            throw new Error("Email deve conter @");
        }
        usuario.email = email.trim();
    }

    const resultado = await pool.query(
        `
        UPDATE usuarios
        SET nome = COALESCE($1, nome),
            email = COALESCE($3, email)
        WHERE id = $4
        RETURNING *
        `,
        [nome, email, id]
    );

    return resultado.rows[0];
}

async function deletarUsuario(id) {

    const resultado = await pool.query(
        "DELETE FROM usuarios WHERE id = $1",
        [id]
    );

    return resultado.rowCount > 0;
}

module.exports = {
    listarUsuarios,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};
