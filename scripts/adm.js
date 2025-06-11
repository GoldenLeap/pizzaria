const LIMITE_PIZZAS = 20;
pizzaAlterar = null;
vendas = [];

window.onload = desativarForm

function desativarForm() {
    if (pegarPizzas().length >= LIMITE_PIZZAS) {
        ["sabor", "preco", "ingredientes", "imagem"].forEach(e => {
            document.getElementById(e).disabled = true;
        })
    }
}

function removerPizza(id) {
    let pizzas = pegarPizzas()
    let index = pizzas.findIndex(p => p.id === id)
    if (index !== -1) {
        pizzas.splice(index, 1);
        definirPizzas(pizzas)
        atualizarLista()
    } else {
        console.log("aaa")
    }
}

function pegarPizzas() {
    return JSON.parse(localStorage.getItem("pizzas")) || [];
}

function pegarValor(id) {
    return document.getElementById(id).value;
}

function definirPizzas(pizzas) {
    localStorage.setItem("pizzas", JSON.stringify(pizzas));
}

function limparFormulario() {
    ["sabor", "preco", "ingredientes", "imagem", "novoSabor", "novoPreco", "novosIngredientes", "novaImagem"].forEach(id => {
        const e = document.getElementById(id);
        if (e) {
            if (e.type === "file") {
                e.value = null;
            } else {
                e.value = "";
            }
        }

    })
    let imagem = document.getElementById("preview") || document.getElementById("novoPreview");
    if (imagem) {
        imagem.src = './images/pizzas/placeholder.jpg'
    }
}


function mostrarSecao(secao) {
    secoes = ["adicionar", "alterar", "lista", "venda", "relatorio"]
    // Esconde todas as seções

    secoes.forEach(
        s => {
            document.getElementById(s).classList.add("hidden");
        }
    )
    // Exibe seção selecionada
    document.getElementById(secao).classList.remove("hidden");

}

async function adicionarPizza() {
    // Recuperando as pizzas do localStorage
    let pizzas = pegarPizzas();

    desativarForm()

    // Capturando os dados do formulário
    const sabor = pegarValor("sabor");
    const preco = parseFloat(pegarValor("preco").replace(",", "."));
    const ingredientes = pegarValor("ingredientes")
        .split(/[,;:.]/) // Divide a string por qualquer vírgula, ponto e vírgula, dois pontos ou ponto
        .map(e => e.trim()) // Remove espaços extras de cada ingrediente
        .filter(e => e !== ''); // Remove elementos vazios

    // Verificando se foi selecionada uma imagem
    const imagem = document.getElementById("imagem").files[0];

    // Se uma imagem foi selecionada, redimensiona e converte ela para base64, caso contrário usa o placeholder
    const imageData = imagem ? await reduzirImagem(imagem, 311, 180) : "./images/pizzas/placeholder.jpg"

    // Validação de preço
    if (isNaN(preco)) {
        exibirMensagem("Insira um preço válido", 500, "erro");
        return;
    }

    // Validação dos campos do formulário
    if (sabor && preco && ingredientes.length > 0) {
        // Adiciona a pizza à lista
        pizzas.push({ "id": Date.now(), sabor, preco, ingredientes, "imagem": imageData });

        // Atualiza o localStorage com a nova lista de pizzas
        localStorage.setItem("pizzas", JSON.stringify(pizzas));

        // Limpa os campos do formulário


        // Atualiza a lista de pizzas exibida
        atualizarLista();
        exibirMensagem("Pizza adicionada com sucesso", 500, "sucesso")
        limparFormulario();
    }

}

function buscarPizza() {
    const busca = pegarValor("busca").toLowerCase();
    const resultados = pegarPizzas().filter(pizza => pizza.sabor.toLowerCase().includes(busca));

    atualizarLista(resultados)
}

function buscarPizzaParaAlterar() {

    const busca = pegarValor(("buscaAlterar")).toLowerCase();
    pizzaAlterar = pegarPizzas().find((pizza) => pizza.sabor.toLowerCase().includes(busca));
    console.log(pizzaAlterar);
    if (pizzaAlterar) {
        document.getElementById("novoSabor").value = pizzaAlterar.sabor;
        document.getElementById("novoPreco").value = pizzaAlterar.preco;
        document.getElementById("novoIngrediente").value = pizzaAlterar.ingredientes;
        document.getElementById("previewNovaPizza").src = pizzaAlterar["imagem"];
        document.getElementById("previewNovaPizza").style.opacity = 100;
    } else {
        exibirMensagem("Pizza não encontrada", "erro")
        limparFormulario()
    }
}

async function alterarPizza() {
    if (!pizzaAlterar) return;

    const novoSabor = pegarValor("novoSabor");
    const novoPreco = parseFloat(pegarValor("novoPreco").replace(",", "."));
    const novoIngrediente = pegarValor("novoIngrediente")
        .split(/[,;:.]/)
        .map(e => e.trim())
        .filter(e => e);
    const novaImagem = document.getElementById("novaImagem").files[0];

    if (!novoSabor || isNaN(novoPreco) || novoIngrediente.length === 0) {
        exibirMensagem("Preencha todos os campos corretamente.", "erro");
        return;
    }

    const pizzas = pegarPizzas();
    const index = pizzas.findIndex(p => p.id === pizzaAlterar.id);
    if (index === -1) return;

    pizzaAlterar.sabor = novoSabor;
    pizzaAlterar.preco = novoPreco;
    pizzaAlterar.ingredientes = novoIngrediente;
    if (novaImagem) {
        pizzaAlterar.imagem = await reduzirImagem(novaImagem, 500, 500);
    }

    pizzas[index] = pizzaAlterar;
    definirPizzas(pizzas);
    atualizarLista();
    exibirMensagem("Pizza alterada com sucesso.");
}



function atualizarLista(lista = pegarPizzas()) {
    let pizzas = pegarPizzas()
    const tabela = document.getElementById("listaPizzas")
    tabela.innerHTML = "";
    lista.forEach(e => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
        <td>${e.id}</td>
        <td>${e.sabor}</td>
        <td>R$${parseFloat(e.preco.toFixed(2))}</td>
        <td>${e.ingredientes}</td>
        <td><button onclick="removerPizza(${e.id})" class="remover">🗑️ Remover</button></td>
        `;
        tabela.appendChild(linha);
    });
    definirPizzas(pizzas)

}

function registrarVenda() {
    const sabor = pegarValor("vendaSabor");
    const preco = pegarValor("vendaPreco").replace(",", ".");
    const cliente = pegarValor("vendaCliente");

    if (isNaN(parseFloat(preco))) {
        exibirMensagem("Insira um preço valido", "erro");
        return
    }

    if (sabor && preco && cliente) {
        const listaVendas = document.getElementById('listaVendas');
        const item = document.createElement('li');
        item.textContent = `Sabor: ${sabor} Preço: ${parseFloat(preco).toFixed(2)} Cliente: ${cliente}`
        listaVendas.appendChild(item);

        vendas.push({ sabor, preco, cliente })

        document.getElementById('vendaSabor').value = ' '
        document.getElementById('vendaPreco').value = ' '
        document.getElementById('vendaCliente').value = ' '
    }
}

function gerarRelatorio() {
    const tabela = document.getElementById("tabelaRelatorio");
    tabela.innerHTML = '';
    if (vendas.length === 0) {
        exibirMensagem("Nenhuma venda registrada.", "erro");
        return;
    }

    let total = 0;
    vendas.forEach(v => {
        const linha = document.createElement("tr");
        linha.innerHTML = `<td>${v.sabor}</td><td>R$${parseFloat(v.preco).toFixed(2)}</td><td>${v.cliente}</td>`;
        tabela.appendChild(linha);
        total += parseFloat(v.preco);
    });

    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `<td><strong>Total</strong></td><td><strong>R$${total.toFixed(2).replace(".", ",")}</strong></td><td></td>`;
    tabela.appendChild(totalRow);
    document.getElementById("relatorio").classList.remove("hidden");
}

function deslogar() {
    document.cookie = "auth=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setTimeout(() => {
        window.location.href = "./index.html"
    }, (500));
}

function reduzirImagem(imagem, maxLargura, maxAltura) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            img.src = reader.result;
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Calcula a proporção para manter a relação da imagem
            const proporcao = Math.min(maxLargura / img.width, maxAltura / img.height);
            const largura = img.width * proporcao;
            const altura = img.height * proporcao;

            canvas.width = largura;
            canvas.height = altura;
            ctx.drawImage(img, 0, 0, largura, altura);

            // Converte para base64 após redimensionar
            const resizedBase64 = canvas.toDataURL(imagem.type);
            resolve(resizedBase64);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(imagem);
    });
}


function mudarImagem() {
    document.getElementById("imagem").click()
}

function atualizarPreview() {
    const file = document.getElementById("imagem").files[0];
    const preview = document.getElementById("preview");
    if (file) {
        reduzirImagem(file, 311, 180).then(resized => preview.src = resized);
    } else {
        preview.src = "./images/pizzas/placeholder.jpg";
    }
}


function atualizarNovoPreview() {
    const file = document.getElementById("novaImagem").files[0];
    const preview = document.getElementById("previewNovaPizza");
    if (file) {
        reduzirImagem(file, 311, 180).then(resized => preview.src = resized);
    } else {
        preview.src = "./images/pizzas/placeholder.jpg";
    }
}


function exibirMensagem(mensagem, duracao = 500, estado = "sucesso") {
    if (typeof duracao === "string" && estado === undefined) {
        estado = duracao;
        duracao = 500;
    }
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${estado}`;
    toast.innerHTML = `
    ${mensagem}
    <div class="progress"></div>
  `;

    container.appendChild(toast);

    // Define duração da barra de progresso
    const progress = toast.querySelector(".progress");
    progress.style.animationDuration = `${duracao}ms`;

    // Remove toast após a duração
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 500);
    }, duracao);
}

