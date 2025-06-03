// Elementos do DOM
const btn = document.querySelector(".registerBtn");
const passErro = document.getElementById("passErro");
const userErro = document.getElementById("userErro");
const mailErro = document.getElementById("mailErro");

function erro(node, msg){
    node.textContent = msg;
    node.classList.remove("hidden");
    btn.disabled = true;
    btn.classList.add("disabled");
}

function checkUser(){
    const usuario = document.getElementById("usuario").value
    let regex = /[a-zA-Z0-9_]$/
    console.log(regex.test(usuario))
    if(!regex.test(usuario) || usuario.indexOf(" ") >= 0){
        erro(userErro, "O usuario não pode conter caracteres invalidos ou espaços.")
    }
    else if(usuario == ""){
        erro(userErro, "O usuario não pode ficar vazio.")
    }
    else{
        userErro.classList.add("hidden");
        btn.disabled = false;
        btn.classList.remove("disabled");
    }
}
// Verifica se as senhas coincidem e habilita/desabilita o botão
function checkPass() {
    const senha = document.getElementById("senha").value;
    const confSenha = document.getElementById("confirmarSenha").value;
    if(!senha){
        erro(passErro, "O campo de senha não pode estar vazio")
    }
    else if(senha.length < 8){
        erro(passErro, "A senha deve conter no minimo 8 caracteres");
    }
    else if (senha !== confSenha) {
        erro(passErro, "As senhas não coincidem")
    } else {
        passErro.classList.add("hidden");
        btn.disabled = false;
        btn.classList.remove("disabled");
    }
}

// Cadastra um novo usuário
function cadastrarUsuario(usuarios, nome, usuario, email, senha) {
    usuarios.push({
        nomeCompleto: nome,
        usuario: usuario,
        email: email,
        senha: senha
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Pega a lista de usuários do localStorage
function pegarListaUsuarios() {
    const lista = localStorage.getItem("usuarios");
    return lista ? JSON.parse(lista) : [];
}

// Valida formato do e-mail
function checkMail() {
    email = document.getElementById("email").value
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)){
        erro(mailErro, "Insira um email válido");
    }else{
        mailErro.classList.add("hidden")
        btn.disabled = false;
        btn.classList.remove("disabled");
    }
}


// Valida todos os campos e realiza o cadastro
function validarCadastro() {
    const usuarios = pegarListaUsuarios();
    const nome = document.getElementById("nome").value;
    const usuario = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Verifica se todos os campos estão preenchidos
    if (!nome || !usuario || !email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Verifica se usuário já existe
    const existeUsuario = usuarios.find(u => u.usuario === usuario);
    const existeEmail = usuarios.find(u => u.email === email);
    if (existeUsuario || existeEmail) {
        alert("Este nome de usuário/email já está em uso.");
        return;
    }

    // cadastra o usuário
    cadastrarUsuario(usuarios, nome, usuario, email, senha);
    window.location.href = "./login.html"
}
