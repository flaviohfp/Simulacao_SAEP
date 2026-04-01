const express = require("express");

const tarefasController = require("../controllers/tarefasController");

const router = express.Router();

router.get("/", tarefasController.listarTarefas);
router.get("/:id", tarefasController.buscarTarefa);
router.post("/", tarefasController.criarTarefa);
router.put("/:id", tarefasController.atualizarTarefa);
router.patch("/:id/status", tarefasController.atualizarStatus);
router.delete("/:id", tarefasController.deletarTarefa);

module.exports = router;
