const listas = {
  "a fazer": document.getElementById("lista-afazer"),
  fazendo: document.getElementById("lista-fazendo"),
  pronto: document.getElementById("lista-pronto"),
};

const contadores = {
  "a fazer": document.getElementById("contador-afazer"),
  fazendo: document.getElementById("contador-fazendo"),
  pronto: document.getElementById("contador-pronto"),
};

const mensagemBoard = document.getElementById("mensagemBoard");
const totalTarefas = document.getElementById("totalTarefas");
const totalUsuarios = document.getElementById("totalUsuarios");
const formEdicao = document.getElementById("formEdicao");
const modalEdicao = new bootstrap.Modal(document.getElementById("modalEdicao"));
const selectEdicaoUsuario = document.getElementById("edicaoUsuario");

let usuariosCache = [];
let tarefasCache = [];

function mostrarMensagem(texto, tipo) {
  mensagemBoard.textContent = texto;
  mensagemBoard.className = `alert alert-${tipo}`;
  mensagemBoard.classList.remove("d-none");
}

function limparMensagem() {
  mensagemBoard.classList.add("d-none");
}

function formatarData(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data));
}

function classePrioridade(prioridade) {
  return `priority-${prioridade}`;
}

function classeStatus(status) {
  return `status-${status.replaceAll(" ", "-")}`;
}

function preencherSelectUsuarios() {
  selectEdicaoUsuario.innerHTML = "";

  usuariosCache.forEach((usuario) => {
    const option = document.createElement("option");
    option.value = usuario.id;
    option.textContent = `${usuario.nome} - ${usuario.email}`;
    selectEdicaoUsuario.appendChild(option);
  });
}

function criarCardTarefa(tarefa) {
  const card = document.createElement("article");
  card.className = "task-card";
  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
      <h3>${tarefa.descricao}</h3>
      <span class="priority-badge ${classePrioridade(tarefa.prioridade)}">${tarefa.prioridade}</span>
    </div>
    <div class="task-meta">
      <span><strong>Setor:</strong> ${tarefa.setor}</span>
      <span><strong>Usuario:</strong> ${tarefa.usuario_nome}</span>
      <span><strong>Status:</strong> <span class="status-badge ${classeStatus(tarefa.status)}">${tarefa.status}</span></span>
      <span><strong>Cadastro:</strong> ${formatarData(tarefa.data_cadastro)}</span>
    </div>
    <div class="task-actions">
      <select class="form-select form-select-sm" data-action="status">
        <option value="a fazer" ${tarefa.status === "a fazer" ? "selected" : ""}>A fazer</option>
        <option value="fazendo" ${tarefa.status === "fazendo" ? "selected" : ""}>Fazendo</option>
        <option value="pronto" ${tarefa.status === "pronto" ? "selected" : ""}>Pronto</option>
      </select>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary btn-sm w-100" data-action="editar">Editar</button>
        <button class="btn btn-outline-danger btn-sm w-100" data-action="excluir">Excluir</button>
      </div>
    </div>
  `;

  card.querySelector('[data-action="status"]').addEventListener("change", async (event) => {
    try {
      await atualizarStatus(tarefa.id, event.target.value);
      await carregarDados();
      mostrarMensagem("Status da tarefa atualizado com sucesso.", "success");
    } catch (erro) {
      mostrarMensagem(erro.message, "danger");
      event.target.value = tarefa.status;
    }
  });

  card.querySelector('[data-action="editar"]').addEventListener("click", () => {
    abrirModalEdicao(tarefa);
  });

  card.querySelector('[data-action="excluir"]').addEventListener("click", async () => {
    const confirmado = window.confirm(`Deseja realmente excluir a tarefa "${tarefa.descricao}"?`);

    if (!confirmado) {
      return;
    }

    try {
      await excluirTarefa(tarefa.id);
      await carregarDados();
      mostrarMensagem("Tarefa excluida com sucesso.", "success");
    } catch (erro) {
      mostrarMensagem(erro.message, "danger");
    }
  });

  return card;
}

function renderizarKanban() {
  Object.values(listas).forEach((lista) => {
    lista.innerHTML = "";
  });

  const grupos = {
    "a fazer": [],
    fazendo: [],
    pronto: [],
  };

  tarefasCache.forEach((tarefa) => {
    grupos[tarefa.status].push(tarefa);
  });

  Object.entries(grupos).forEach(([status, tarefas]) => {
    contadores[status].textContent = String(tarefas.length);

    if (!tarefas.length) {
      listas[status].innerHTML = '<div class="empty-state">Nenhuma tarefa nesta coluna.</div>';
      return;
    }

    tarefas.forEach((tarefa) => {
      listas[status].appendChild(criarCardTarefa(tarefa));
    });
  });

  totalTarefas.textContent = String(tarefasCache.length);
  totalUsuarios.textContent = String(usuariosCache.length);
}

async function carregarUsuarios() {
  const resposta = await fetch("/api/usuarios");
  usuariosCache = await resposta.json();
  preencherSelectUsuarios();
}

async function carregarTarefas() {
  const resposta = await fetch("/api/tarefas");
  tarefasCache = await resposta.json();
}

async function carregarDados() {
  limparMensagem();
  await Promise.all([carregarUsuarios(), carregarTarefas()]);
  renderizarKanban();
}

function abrirModalEdicao(tarefa) {
  document.getElementById("edicaoId").value = tarefa.id;
  document.getElementById("edicaoDescricao").value = tarefa.descricao;
  document.getElementById("edicaoSetor").value = tarefa.setor;
  document.getElementById("edicaoUsuario").value = String(tarefa.id_usuario);
  document.getElementById("edicaoPrioridade").value = tarefa.prioridade;
  document.getElementById("edicaoStatus").value = tarefa.status;
  modalEdicao.show();
}

async function atualizarStatus(id, status) {
  const resposta = await fetch(`/api/tarefas/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!resposta.ok) {
    const dados = await resposta.json();
    throw new Error(dados.erro || "Nao foi possivel atualizar o status.");
  }
}

async function excluirTarefa(id) {
  const resposta = await fetch(`/api/tarefas/${id}`, {
    method: "DELETE",
  });

  if (!resposta.ok) {
    const dados = await resposta.json();
    throw new Error(dados.erro || "Nao foi possivel excluir a tarefa.");
  }
}

formEdicao.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!formEdicao.reportValidity()) {
    return;
  }

  const id = document.getElementById("edicaoId").value;
  const payload = {
    descricao: document.getElementById("edicaoDescricao").value.trim(),
    setor: document.getElementById("edicaoSetor").value.trim(),
    id_usuario: Number(document.getElementById("edicaoUsuario").value),
    prioridade: document.getElementById("edicaoPrioridade").value,
    status: document.getElementById("edicaoStatus").value,
  };

  try {
    const resposta = await fetch(`/api/tarefas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Nao foi possivel atualizar a tarefa.");
    }

    modalEdicao.hide();
    await carregarDados();
    mostrarMensagem(dados.mensagem, "success");
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
});

carregarDados().catch(() => {
  mostrarMensagem("Nao foi possivel carregar o painel. Verifique a API e o banco de dados.", "danger");
});
