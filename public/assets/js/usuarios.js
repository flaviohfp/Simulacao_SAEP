const formCadastro = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");
const listaUsuarios = document.getElementById("listaUsuarios");
const atualizarListaBtn = document.getElementById("atualizarListaUsuarios");

function exibirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `alert alert-${tipo}`;
  mensagem.classList.remove("d-none");
}

function esconderMensagem() {
  mensagem.classList.add("d-none");
}

function criarItemUsuario(usuario) {
  const item = document.createElement("article");
  item.className = "list-group-item custom-user-item";
  item.innerHTML = `
    <div class="d-flex justify-content-between align-items-start gap-3">
      <div>
        <h3 class="h6 mb-1">${usuario.nome}</h3>
        <p class="mb-0 text-secondary">${usuario.email}</p>
      </div>
      <span class="status-pill">#${usuario.id}</span>
    </div>
  `;
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
    carregarUsuarios();
  } catch (erro) {
    exibirMensagem(erro.message, "danger");
  }
});

atualizarListaBtn.addEventListener("click", carregarUsuarios);

carregarUsuarios().catch(() => {
  exibirMensagem("Nao foi possivel carregar os usuarios.", "danger");
});
