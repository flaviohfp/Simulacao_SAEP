const formTarefa = document.getElementById("formTarefa");
const selectUsuario = document.getElementById("idUsuario");
const mensagemTarefa = document.getElementById("mensagemTarefa");

function exibirMensagem(texto, tipo) {
  mensagemTarefa.textContent = texto;
  mensagemTarefa.className = `alert alert-${tipo}`;
  mensagemTarefa.classList.remove("d-none");
}

async function carregarUsuarios() {
  const resposta = await fetch("/api/usuarios");
  const usuarios = await resposta.json();

  selectUsuario.innerHTML = '<option value="">Selecione</option>';

  usuarios.forEach((usuario) => {
    const option = document.createElement("option");
    option.value = usuario.id;
    option.textContent = `${usuario.nome} - ${usuario.email}`;
    selectUsuario.appendChild(option);
  });
}

formTarefa.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!formTarefa.reportValidity()) {
    return;
  }

  const payload = {
    descricao: document.getElementById("descricao").value.trim(),
    setor: document.getElementById("setor").value.trim(),
    id_usuario: Number(document.getElementById("idUsuario").value),
    prioridade: document.getElementById("prioridade").value,
  };

  try {
    const resposta = await fetch("/api/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Nao foi possivel cadastrar a tarefa.");
    }

    exibirMensagem(dados.mensagem, "success");
    formTarefa.reset();
  } catch (erro) {
    exibirMensagem(erro.message, "danger");
  }
});

carregarUsuarios().catch(() => {
  exibirMensagem(
    "Cadastre pelo menos um usuario antes de criar tarefas.",
    "warning"
  );
});
