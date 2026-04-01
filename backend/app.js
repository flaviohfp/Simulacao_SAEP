const express = require("express");
const path = require("path");

const usuariosRoutes = require("./routes/usuarios");
const tarefasRoutes = require("./routes/tarefas");

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(publicDir, "cadastro.html"));
});

app.get("/tarefas", (req, res) => {
  res.sendFile(path.join(publicDir, "tarefas.html"));
});

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/tarefas", tarefasRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota nao encontrada." });
});

const porta = Number(process.env.PORT) || 3000;

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
