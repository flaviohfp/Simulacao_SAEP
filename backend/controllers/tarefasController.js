const tarefasService = require("../services/tarefasService");

async function listarTarefas(req, res) {
  try {
    const tarefas = await tarefasService.listarTarefas();
    res.json(tarefas);
  } catch (erro) {
    res.status(500).json({ erro: "Nao foi possivel listar as tarefas." });
  }
}

async function buscarTarefa(req, res) {
  try {
    const id = Number(req.params.id);
    const tarefa = await tarefasService.buscarTarefaPorId(id);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa nao encontrada." });
    }

    return res.json(tarefa);
  } catch (erro) {
    return res.status(400).json({ erro: erro.message });
  }
}

async function criarTarefa(req, res) {
  try {
    const tarefa = await tarefasService.criarTarefa(req.body);

    return res.status(201).json({
      mensagem: "Tarefa cadastrada com sucesso.",
      tarefa,
    });
  } catch (erro) {
    const status = erro.statusCode || 400;
    return res.status(status).json({ erro: erro.message });
  }
}

async function atualizarTarefa(req, res) {
  try {
    const id = Number(req.params.id);
    const tarefa = await tarefasService.atualizarTarefa(id, req.body);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa nao encontrada." });
    }

    return res.json({
      mensagem: "Tarefa atualizada com sucesso.",
      tarefa,
    });
  } catch (erro) {
    const status = erro.statusCode || 400;
    return res.status(status).json({ erro: erro.message });
  }
}

async function atualizarStatus(req, res) {
  try {
    const id = Number(req.params.id);
    const tarefa = await tarefasService.atualizarStatusTarefa(id, req.body.status);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa nao encontrada." });
    }

    return res.json({
      mensagem: "Status atualizado com sucesso.",
      tarefa,
    });
  } catch (erro) {
    const status = erro.statusCode || 400;
    return res.status(status).json({ erro: erro.message });
  }
}

async function deletarTarefa(req, res) {
  try {
    const id = Number(req.params.id);
    const removida = await tarefasService.deletarTarefa(id);

    if (!removida) {
      return res.status(404).json({ erro: "Tarefa nao encontrada." });
    }

    return res.status(204).send();
  } catch (erro) {
    const status = erro.statusCode || 500;
    return res.status(status).json({ erro: erro.message });
  }
}

module.exports = {
  listarTarefas,
  buscarTarefa,
  criarTarefa,
  atualizarTarefa,
  atualizarStatus,
  deletarTarefa,
};
