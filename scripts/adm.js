const LIMITE_PIZZAS = 20;
pizzaAlterar = null;
vendas = [];

// Executa ao carregar a página
window.onload = desativarForm;

// Desativa o formulário se o limite de pizzas for atingido
function desativarForm() {
    if (pegarPizzas().length >= LIMITE_PIZZAS) {
        ["sabor", "preco", "ingredientes", "imagem"].forEach(e => {
            document.getElementById(e).disabled = true;
        });
    }
}

// Remove pizza com base no ID
function removerPizza(id) {
    let pizzas = pegarPizzas();
    let index = pizzas.findIndex(p => p.id === id);
    if (index !== -1) {
        pizzas.splice(index, 1);
        definirPizzas(pizzas);
        atualizarLista();
    } else {
        console.log("Pizza não encontrada");
    }
}

// Retorna array de pizzas do localStorage
function pegarPizzas() {
    return JSON.parse(localStorage.getItem("pizzas")) || [];
}

// Retorna valor de input pelo ID
function pegarValor(id) {
    return document.getElementById(id).value;
}

// Atualiza localStorage com pizzas
function definirPizzas(pizzas) {
    localStorage.setItem("pizzas", JSON.stringify(pizzas));
}

// Limpa os campos do formulário de cadastro/edição
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
    });

    // Reseta preview da imagem
    let imagem = document.getElementById("preview") || document.getElementById("novoPreview");
    if (imagem) {
        imagem.src = './images/pizzas/placeholder.jpg';
    }
}

// Controla qual seção do sistema está visível
function mostrarSecao(secao) {
    secoes = ["adicionar", "alterar", "lista", "venda", "relatorio"];
    secoes.forEach(s => document.getElementById(s).classList.add("hidden"));
    document.getElementById(secao).classList.remove("hidden");
}

// Adiciona nova pizza ao sistema
async function adicionarPizza() {
    let pizzas = pegarPizzas();
    desativarForm();

    const sabor = pegarValor("sabor");
    const preco = parseFloat(pegarValor("preco").replace(",", "."));
    const ingredientes = pegarValor("ingredientes")
        .split(/[,;:.]/)
        .map(e => e.trim())
        .filter(e => e !== '');

    const imagem = document.getElementById("imagem").files[0];
    const imageData = imagem ? await reduzirImagem(imagem, 311, 180) : "./images/pizzas/placeholder.jpg";

    if (isNaN(preco)) {
        exibirMensagem("Insira um preço válido", 500, "erro");
        return;
    }

    if (sabor && preco && ingredientes.length > 0) {
        pizzas.push({ id: Date.now(), sabor, preco, ingredientes, imagem: imageData });
        localStorage.setItem("pizzas", JSON.stringify(pizzas));
        atualizarLista();
        exibirMensagem("Pizza adicionada com sucesso", 500, "sucesso");
        limparFormulario();
    }
}

// Busca pizzas por sabor
function buscarPizza() {
    const busca = pegarValor("busca").toLowerCase();
    const resultados = pegarPizzas().filter(pizza => pizza.sabor.toLowerCase().includes(busca));
    atualizarLista(resultados);
}

// Busca pizza para edição
function buscarPizzaParaAlterar() {
    const busca = pegarValor("buscaAlterar").toLowerCase();
    pizzaAlterar = pegarPizzas().find(p => p.sabor.toLowerCase().includes(busca));

    if (pizzaAlterar) {
        document.getElementById("novoSabor").value = pizzaAlterar.sabor;
        document.getElementById("novoPreco").value = pizzaAlterar.preco;
        document.getElementById("novoIngrediente").value = pizzaAlterar.ingredientes;
        document.getElementById("previewNovaPizza").src = pizzaAlterar.imagem;
        document.getElementById("previewNovaPizza").style.opacity = 100;
    } else {
        exibirMensagem("Pizza não encontrada", "erro");
        limparFormulario();
    }
}

// Altera pizza selecionada
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

// Atualiza lista de pizzas exibida na interface
function atualizarLista(lista = pegarPizzas()) {
    let pizzas = pegarPizzas();
    const tabela = document.getElementById("listaPizzas");
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

    definirPizzas(pizzas);
}

// Registra uma venda no sistema
function registrarVenda() {
    const sabor = pegarValor("vendaSabor");
    const preco = pegarValor("vendaPreco").replace(",", ".");
    const cliente = pegarValor("vendaCliente");

    if (isNaN(parseFloat(preco))) {
        exibirMensagem("Insira um preço válido", "erro");
        return;
    }

    if (sabor && preco && cliente) {
        const listaVendas = document.getElementById("listaVendas");
        const item = document.createElement("li");
        item.textContent = `Sabor: ${sabor} Preço: ${parseFloat(preco).toFixed(2)} Cliente: ${cliente}`;
        listaVendas.appendChild(item);

        vendas.push({ sabor, preco, cliente });

        document.getElementById("vendaSabor").value = "";
        document.getElementById("vendaPreco").value = "";
        document.getElementById("vendaCliente").value = "";
    }
}

// Gera relatório com total de vendas
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

// Função para logout simulando expiração do cookie
function deslogar() {
    document.cookie = "auth=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 500);
}

// Reduz e converte imagem para base64
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

            const proporcao = Math.min(maxLargura / img.width, maxAltura / img.height);
            const largura = img.width * proporcao;
            const altura = img.height * proporcao;

            canvas.width = largura;
            canvas.height = altura;
            ctx.drawImage(img, 0, 0, largura, altura);

            const resizedBase64 = canvas.toDataURL(imagem.type);
            resolve(resizedBase64);
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imagem);
    });
}

// Atalhos para abrir e atualizar imagem
function mudarImagem(img) {
    document.getElementById(img).click();
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

// Mostra mensagens temporárias com animação (toast)
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

    const progress = toast.querySelector(".progress");
    progress.style.animationDuration = `${duracao}ms`;

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 500);
    }, duracao);
}
