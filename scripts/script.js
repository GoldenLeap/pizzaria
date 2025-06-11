window.onload = () => {
    auth = getCookie("auth")
    pizzas = JSON.stringify(localStorage.getItem("pizzas")) || []
    console.log(pizzas)
    if (auth.length > 1) {
        document.getElementById("usuario").classList.remove("hidden");
        document.querySelector("#usuario p").innerHTML = `Logado como: ${auth[1]}`;
        usuarioLogado()

        if (auth[1] === "admin") {
            exibirSecao("#admin")
        }
    }

    const hash = window.location.hash;
    if (hash && hash !== "#") {
        exibirSecao(hash)
    } else {
        exibirSecao("#inicio")
    }
}

function usuarioLogado() {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("cadastro").classList.add("hidden");
    document.getElementById("deslogar").classList.remove("hidden");
    document.getElementById("usuario").classList.remove("hidden");
}

window.onhashchange = () => {
    const hash = window.location.hash;
    if (hash && hash !== "#") {
        exibirSecao(hash)
    } else {
        exibirSecao("#inicio")
    }
}
function exibirSecao(secao) {
    document.getElementById("inicio").classList.add("hidden")
    document.getElementById("sobre").classList.add("hidden")
    document.getElementById("contato").classList.add("hidden")
    document.getElementById("cardapio").classList.add("hidden")

    document.querySelector(secao).classList.remove("hidden")
}


function atualizarCardapio() {
    const menuContainer = document.getElementById("menuCardapio")

    obj`<div class=item>
          <img src="imagem" alt="Sabor pizza" />
          <h3>Sabor Pizza</h3>
          <p>Preço pizza</p>    
    </div>`
}


function getCookie(nome) {
    const val = `;${document.cookie}`;
    const p = val.split(`${nome}=`)
    return p
}

function deleteAllCookies() {
    document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
}
function deslogar() {
    document.cookie = "auth=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setTimeout(() => {
        window.location.href = "./index.html"
    }, (500));
}