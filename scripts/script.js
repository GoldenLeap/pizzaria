// Executado ao carregar a página
window.onload = () => {
    // Recupera o cookie de autenticação
    auth = getCookie("auth");
    carregarPizzas()
    // Tenta pegar as pizzas salvas no localStorage como string
    pizzas = JSON.parse(localStorage.getItem("pizzas")) || [];

    console.log(pizzas); // Log para debug

    // Se o cookie estiver presente e tiver mais de um caractere (ex: ['','admin'])
    if (auth.length > 1) {
        // Exibe área do usuário logado
        document.getElementById("usuario").classList.remove("hidden");
        document.querySelector("#usuario p").innerHTML = `Logado como: ${auth[1]}`;
        usuarioLogado();

        // Se o usuário for admin, mostra seção de admin
        if (auth[1] === "admin") {
            exibirSecao("#admin");
        }
    }

    // Redirecionamento por hash da URL (ex: index.html#contato)
    const hash = window.location.hash;
    if (hash && hash !== "#") {
        exibirSecao(hash);
    } else {
        exibirSecao("#inicio");
    }
};

// Exibe ou oculta botões e seções baseados no estado "logado"
function usuarioLogado() {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("cadastro").classList.add("hidden");
    document.getElementById("deslogar").classList.remove("hidden");
    document.getElementById("usuario").classList.remove("hidden");
}

// Escuta mudanças no hash da URL (navegação SPA simulada)
window.onhashchange = () => {
    const hash = window.location.hash;
    if (hash && hash !== "#") {
        exibirSecao(hash);
    } else {
        exibirSecao("#inicio");
    }
};

// Mostra apenas uma seção por vez, escondendo todas as outras
function exibirSecao(secao) {
    const secoes = document.querySelectorAll("section");
    secoes.forEach(secao => secao.classList.add("hidden"));
    document.querySelector(secao).classList.remove("hidden");
}

// Recupera cookie específico por nome
function getCookie(nome) {
    const val = `;${document.cookie}`;
    const p = val.split(`${nome}=`);
    return p;
}

// Remove todos os cookies do navegador (útil para logout completo)
function deleteAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}

// Faz logout limpando o cookie "auth" e redirecionando para a homepage
function deslogar() {
    document.cookie = "auth=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 500);
}


function carregarPizzas() {
    let pizzas = pegarPizzas();
    const containerPizzas = document.querySelector("#menuCardapio");

    pizzas.forEach(p => {
        const pizzaCont = document.createElement("div");
        pizzaCont.classList.add("item");

        const img = document.createElement("img");
        img.src = p.imagem;

        const nomePizza = document.createElement("h3");
        nomePizza.innerText = p.sabor;

        const precoPizza = document.createElement("p");
        precoPizza.innerText = `R$${p.preco.toFixed(2).toString().replace(".", ",")}`;

        pizzaCont.appendChild(img);
        pizzaCont.appendChild(nomePizza);
        pizzaCont.appendChild(precoPizza);
        containerPizzas.appendChild(pizzaCont);
    });
}
