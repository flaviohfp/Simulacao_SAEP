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
const modalEdicao = document.getElementById("modalEdicao");
const selectEdicaoUsuario = document.getElementById("edicaoUsuario");

let usuariosCache = [];
let tarefasCache = [];

function mostrarMensagem(texto, tipo) {
  mensagemBoard.textContent = texto;
  mensagemBoard.className = `message message-${tipo}`;
}

function limparMensagem() {
  mensagemBoard.textContent = "";
  mensagemBoard.className = "message hidden";
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

function criarCampoMeta(rotulo, valor) {
  const item = document.createElement("span");
  item.textContent = `${rotulo}: ${valor}`;
  return item;
}

function criarTag(texto, classe) {
  const tag = document.createElement("span");
  tag.className = `tag ${classe}`;
  tag.textContent = texto;
  return tag;
}

function abrirModal() {
  modalEdicao.classList.remove("hidden");
  modalEdicao.setAttribute("aria-hidden", "false");
}

function fecharModal() {
  modalEdicao.classList.add("hidden");
  modalEdicao.setAttribute("aria-hidden", "true");
}

function criarCardTarefa(tarefa) {
  const card = document.createElement("article");
  card.className = "task-card";

  const titulo = document.createElement("h3");
  titulo.className = "task-card-title";
  titulo.textContent = tarefa.descricao;

  const meta = document.createElement("div");
  meta.className = "meta-list";
  meta.appendChild(criarCampoMeta("Setor", tarefa.setor));
  meta.appendChild(criarCampoMeta("Usuario", tarefa.usuario_nome));
  meta.appendChild(criarCampoMeta("Data", formatarData(tarefa.data_cadastro)));

  const tags = document.createElement("div");
  tags.className = "tag-row";
  tags.appendChild(criarTag(`Prioridade: ${tarefa.prioridade}`, classePrioridade(tarefa.prioridade)));
  tags.appendChild(criarTag(`Status: ${tarefa.status}`, classeStatus(tarefa.status)));

  const selectStatus = document.createElement("select");
  selectStatus.className = "select-control";

  ["a fazer", "fazendo", "pronto"].forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    option.selected = tarefa.status === status;
    selectStatus.appendChild(option);
  });

  selectStatus.addEventListener("change", async (event) => {
    try {
      await atualizarStatus(tarefa.id, event.target.value);
      await carregarDados();
      mostrarMensagem("Status da tarefa atualizado com sucesso.", "success");
    } catch (erro) {
      mostrarMensagem(erro.message, "danger");
      event.target.value = tarefa.status;
    }
  });

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.className = "button-secondary";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => {
    abrirModalEdicao(tarefa);
  });

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "button-danger";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", async () => {
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

  const acoes = document.createElement("div");
  acoes.className = "card-actions";
  acoes.appendChild(botaoEditar);
  acoes.appendChild(botaoExcluir);

  card.appendChild(titulo);
  card.appendChild(meta);
  card.appendChild(tags);
  card.appendChild(selectStatus);
  card.appendChild(acoes);

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
  abrirModal();
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

modalEdicao.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) {
    fecharModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalEdicao.classList.contains("hidden")) {
    fecharModal();
  }
});

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

    fecharModal();
    await carregarDados();
    mostrarMensagem(dados.mensagem, "success");
  } catch (erro) {
    mostrarMensagem(erro.message, "danger");
  }
});

carregarDados().catch(() => {
  mostrarMensagem("Nao foi possivel carregar o painel. Verifique a API e o banco de dados.", "danger");
});
