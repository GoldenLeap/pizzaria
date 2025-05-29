function exibirMensagem(texto, tipo) {
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = texto;

  mensagem.className = `mensagem ${tipo}`;
  mensagem.classList.remove("hidden");

  setTimeout(() => {
    mensagem.classList.add("hidden");
  }, 2500);
}

function mostrarSenha(id) {
  var input = document.getElementById(id);
  var tipo = input.type;

  if (tipo === "password") {
    input.type = "text";
  } else {
    input.type = "password";
  }
}

function validarLogin() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuarios")) || [];

  // Tenta encontrar o usuário no localStorage
  const uObj = usuariosRegistrados.find((u) => u.usuario === usuario);

  // Caso usuário seja encontrado e senha correta
  if (uObj && uObj.senha === senha) {
    exibirMensagem("Login realizado com sucesso", "sucesso");
    setTimeout(() => {
      window.location.href = "./index.html"; // ou outro destino
    }, 1000);
    return; // impede execução do restante
  }

  // Usuário e senha de teste 
  const usuarioTeste = "usuarioLegal";
  const senhaTeste = "senhaLegal";
  
  // Usuario e senha adm(para testes)
  const usuarioAdm = "adm"
  const senhaAdm = "adm123"

  if (usuario === usuarioTeste && senha === senhaTeste) {
    exibirMensagem("Login realizado com sucesso", "sucesso");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);
    return;
  }
  if(usuario === usuarioAdm && senha === senhaAdm){
    exibirMensagem("Login realizado com sucesso", "sucesso")
    setTimeout(() => {
        window.location.href = "./admin.html";
    }, 1000);
    return
}

  // Se nenhuma das opções funcionou, exibe erro
  exibirMensagem("Usuário ou senha incorretos", "erro");
}
