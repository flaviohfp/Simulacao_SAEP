
const usuariosService = require("../services/usuariosService");

/* -------------------------
   ROTAS - CONTROLLERS
-------------------------- */

async function listarUsuarios(req, res) {
    try {
        const usuarios = await usuariosService.listarUsuarios();
        res.json(usuarios);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}









async function criarUsuario(req, res) {
    try {
        const { nome, idade, email } = req.body;

        const usuario = await usuariosService.criarUsuario(nome, idade, email);

        res.status(201).json({
            mensagem: "Usuário criado com sucesso",
            usuario
        });

    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

async function atualizarUsuario(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ erro: "ID inválido" });
        }
        const { nome, idade, email } = req.body;

        const usuario = await usuariosService.atualizarUsuario(id, nome, idade, email);

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        res.json({
            mensagem: "Usuário atualizado com sucesso",
            usuario
        });

    } catch (erro) {
        res.status(400).json({
            erro: erro.message
        });
    }
}

async function deletarUsuario(req, res) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ erro: "ID inválido" });
        }
        const removido = await usuariosService.deletarUsuario(id);

        if (!removido) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        res.status(204).send();
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = {
    listarUsuarios,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};

