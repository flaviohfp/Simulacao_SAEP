const form = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
   
    const email = document.getElementById("email").value;

    const usuario = {
        nome,
        email
    };

    try {
        const resposta = await fetch("/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            // Mostrar erro real do servidor
            throw new Error(dados.erro || "Erro ao cadastrar usuário");
        }

        // Mostrar sucesso em verde
        mensagem.textContent = `Usuário ${dados.usuario.nome} cadastrado com sucesso!`;
        mensagem.className = "alert alert-success mt-3 text-center";
        mensagem.style.display = "block";

        form.reset();

        setTimeout(() => {
            window.location.href = "/lista";
        }, 1500);

    } catch (erro) {
        // Mostrar erro em vermelho
        mensagem.textContent = erro.message;
        mensagem.className = "alert alert-danger mt-3 text-center";
        mensagem.style.display = "block";
        console.error(erro);
    }
});