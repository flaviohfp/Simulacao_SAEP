const usuariosService = require("../services/usuariosService");

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuariosService.listarUsuarios();
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: "Nao foi possivel listar os usuarios." });
  }
}

async function buscarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const usuario = await usuariosService.buscarUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuario nao encontrado." });
    }

    return res.json(usuario);
  } catch (erro) {
    return res.status(400).json({ erro: erro.message });
  }
}

async function criarUsuario(req, res) {
  try {
    const usuario = await usuariosService.criarUsuario(req.body);

    res.status(201).json({
      mensagem: "Usuario cadastrado com sucesso.",
      usuario,
    });
  } catch (erro) {
    const status = erro.statusCode || 400;
    res.status(status).json({ erro: erro.message });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const usuario = await usuariosService.atualizarUsuario(id, req.body);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuario nao encontrado." });
    }

    return res.json({
      mensagem: "Usuario atualizado com sucesso.",
      usuario,
    });
  } catch (erro) {
    const status = erro.statusCode || 400;
    return res.status(status).json({ erro: erro.message });
  }
}

async function deletarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const removido = await usuariosService.deletarUsuario(id);

    if (!removido) {
      return res.status(404).json({ erro: "Usuario nao encontrado." });
    }

    return res.status(204).send();
  } catch (erro) {
    const status = erro.statusCode || 500;
    return res.status(status).json({ erro: erro.message });
  }
}

module.exports = {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
};
