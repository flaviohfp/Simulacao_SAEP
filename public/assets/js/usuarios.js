const formCadastro = document.getElementById("formCadastro");
const formEdicaoUsuario = document.getElementById("formEdicaoUsuario");
const mensagem = document.getElementById("mensagem");
const listaUsuarios = document.getElementById("listaUsuarios");
const atualizarListaBtn = document.getElementById("atualizarListaUsuarios");
const modalUsuario = document.getElementById("modalUsuario");

function exibirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `message message-${tipo}`;
}

function esconderMensagem() {
  mensagem.textContent = "";
  mensagem.className = "message hidden";
}

function abrirModalUsuario() {
  modalUsuario.classList.remove("hidden");
  modalUsuario.setAttribute("aria-hidden", "false");
}

function fecharModalUsuario() {
  modalUsuario.classList.add("hidden");
  modalUsuario.setAttribute("aria-hidden", "true");
}

function criarLinha(rotulo, valor) {
  const linha = document.createElement("span");
  linha.textContent = `${rotulo}: ${valor}`;
  return linha;
}

function preencherFormularioEdicao(usuario) {
  document.getElementById("edicaoUsuarioId").value = usuario.id;
  document.getElementById("edicaoUsuarioNome").value = usuario.nome;
  document.getElementById("edicaoUsuarioEmail").value = usuario.email;
}

function criarItemUsuario(usuario) {
  const item = document.createElement("article");
  item.className = "user-card";

  const titulo = document.createElement("h3");
  titulo.className = "user-card-title";
  titulo.textContent = usuario.nome;

  const meta = document.createElement("div");
  meta.className = "meta-list";
  meta.appendChild(criarLinha("E-mail", usuario.email));
  meta.appendChild(criarLinha("Codigo", usuario.id));

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.className = "button-secondary";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => {
    preencherFormularioEdicao(usuario);
    abrirModalUsuario();
  });

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "button-danger";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", async () => {
    const confirmado = window.confirm(`Deseja realmente excluir o usuario "${usuario.nome}"?`);

    if (!confirmado) {
      return;
    }

    try {
      const resposta = await fetch(`/api/usuarios/${usuario.id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        const dados = await resposta.json();
        throw new Error(dados.erro || "Nao foi possivel excluir o usuario.");
      }

      exibirMensagem("Usuario excluido com sucesso.", "success");
      await carregarUsuarios();
    } catch (erro) {
      exibirMensagem(erro.message, "danger");
    }
  });

  const acoes = document.createElement("div");
  acoes.className = "inline-actions";
  acoes.appendChild(botaoEditar);
  acoes.appendChild(botaoExcluir);

  item.appendChild(titulo);
  item.appendChild(meta);
  item.appendChild(acoes);

  return item;
}

async function carregarUsuarios() {
  const resposta = await fetch("/api/usuarios");
  const usuarios = await resposta.json();

  listaUsuarios.innerHTML = "";

  if (!usuarios.length) {
    listaUsuarios.innerHTML = '<div class="empty-state">Nenhum usuario cadastrado ainda.</div>';
    return;
  }

  usuarios.forEach((usuario) => {
    listaUsuarios.appendChild(criarItemUsuario(usuario));
  });
}

formCadastro.addEventListener("submit", async (event) => {
  event.preventDefault();
  esconderMensagem();

  if (!formCadastro.reportValidity()) {
    return;
  }

  const payload = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
  };

  try {
    const resposta = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Nao foi possivel cadastrar o usuario.");
    }

    exibirMensagem(dados.mensagem, "success");
    formCadastro.reset();
    await carregarUsuarios();
  } catch (erro) {
    exibirMensagem(erro.message, "danger");
  }
});

formEdicaoUsuario.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!formEdicaoUsuario.reportValidity()) {
    return;
  }

  const id = document.getElementById("edicaoUsuarioId").value;
  const payload = {
    nome: document.getElementById("edicaoUsuarioNome").value.trim(),
    email: document.getElementById("edicaoUsuarioEmail").value.trim(),
  };

  try {
    const resposta = await fetch(`/api/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Nao foi possivel atualizar o usuario.");
    }

    fecharModalUsuario();
    exibirMensagem(dados.mensagem, "success");
    await carregarUsuarios();
  } catch (erro) {
    exibirMensagem(erro.message, "danger");
  }
});

modalUsuario.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-user-modal")) {
    fecharModalUsuario();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modalUsuario.classList.contains("hidden")) {
    fecharModalUsuario();
  }
});

atualizarListaBtn.addEventListener("click", carregarUsuarios);

carregarUsuarios().catch(() => {
  exibirMensagem("Nao foi possivel carregar os usuarios.", "danger");
});
