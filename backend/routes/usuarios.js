const express = require("express");

const usuariosController = require("../controllers/usuariosController");

const router = express.Router();

router.get("/", usuariosController.listarUsuarios);
router.get("/:id", usuariosController.buscarUsuario);
router.post("/", usuariosController.criarUsuario);
router.put("/:id", usuariosController.atualizarUsuario);
router.delete("/:id", usuariosController.deletarUsuario);

module.exports = router;
