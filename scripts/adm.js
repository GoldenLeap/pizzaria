 pizzas = localStorage.getItem("pizzas") ? JSON.parse(localStorage.getItem("pizzas")) : []
pizzaAlterar = null;
vendas = [];
function mostrarSecao(secao){
    secoes = ["adicionar", "alterar", "lista", "venda", "relatorio"]
    // Esconde todas as seções

    secoes.forEach(
        s=>{
            document.getElementById(s).classList.add("hidden");
        }
    )
    // Exibe seção selecionada
    document.getElementById(secao).classList.remove("hidden");

}
async function adicionarPizza() {
    // Recuperando as pizzas do localStorage
    pizzas = JSON.parse(localStorage.getItem("pizzas")) || [];

    // Capturando os dados do formulário
    const sabor = document.getElementById("sabor").value;
    const preco = parseFloat(document.getElementById("preco").value.replace(",", "."));
    const ingredientes = document.getElementById("ingredientes").value
        .split(/[,;:.]/) // Divide a string por qualquer vírgula, ponto e vírgula, dois pontos ou ponto
        .map(e => e.trim()) // Remove espaços extras de cada ingrediente
        .filter(e => e !== ''); // Remove elementos vazios

    // Verificando se foi selecionada uma imagem
    const imagem = document.getElementById("imagem").files[0];
    let imageData = '';
    
    // Se uma imagem foi selecionada, converte ela para base64, caso contrário usa o placeholder
    if (imagem) {
        imageData = await getBase64Img(imagem);
    } else {
        imageData = "./images/pizzas/placeholder.jpg"; // Placeholder
    }

    // Validação de preço
    if (isNaN(preco)) {
        alert("Insira um preço válido.");
        return;
    }

    // Validação dos campos do formulário
    if (sabor && preco && ingredientes.length > 0) {
        // Adiciona a pizza à lista
        pizzas.push({ sabor, preco, ingredientes, "imagem": imageData });

        // Atualiza o localStorage com a nova lista de pizzas
        localStorage.setItem("pizzas", JSON.stringify(pizzas));

        // Limpa os campos do formulário
        document.getElementById("sabor").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("ingredientes").value = "";
        document.getElementById("imagem").value = null;
        console.log(pizzas)

        // Atualiza a lista de pizzas exibida
        atualizarLista();

        alert(`Pizza de ${sabor} com preço R$${preco.toFixed(2)} cadastrada com sucesso.`);
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}



function buscarPizza(){
    const busca = document.getElementById("busca").value.toLowerCase();
    const resultados = pizzas.filter(pizza => pizza.sabor.toLowerCase().includes(busca));

    atualizarLista(resultados)
}

function buscarPizzaParaAlterar(){

    const busca = document.getElementById("buscaAlterar").value.toLowerCase();
    pizzaAlterar = pizzas.find((pizza) => 
        pizza.sabor.toLowerCase().includes(busca)
    );
    console.log(pizzaAlterar);
    if(pizzaAlterar){
        document.getElementById("novoSabor").value = pizzaAlterar.sabor;
        document.getElementById("novoPreco").value = pizzaAlterar.preco;
        document.getElementById("novoIngrediente").value = pizzaAlterar.ingredientes;
        document.getElementById("previewNovaPizza").src =pizzaAlterar["imagem"];
        document.getElementById("previewNovaPizza").style.opacity = 100;
    } else {
        alert("Pizza não encontrada");
    }
}

async function alterarPizza() {
    if (pizzaAlterar) {
        const novoSabor = document.getElementById("novoSabor").value;
        const novoPreco = parseFloat(document.getElementById("novoPreco").value.replace(",", "."));
        const novoIngrediente = document.getElementById("novoIngrediente").value
            .split(/[,;:]/)
            .map(e => e.trim())
            .filter(e => e !== '');

        const novaImagem = document.getElementById("novaImagem").files[0]

        if (isNaN(novoPreco)) {
            alert("Informe um preço válido");
            return;
        }

        if (novoSabor && novoPreco && novoIngrediente) {
            pizzaAlterar.sabor = novoSabor;
            pizzaAlterar.preco = novoPreco;
            pizzaAlterar.ingredientes = novoIngrediente;

            // Se uma nova imagem foi selecionada, converte ela para base64
            if (novaImagem) {
                pizzaAlterar.imagem = await getBase64Img(novaImagem);
            }

            // Atualiza o localStorage com a pizza alterada
            let pizzas = JSON.parse(localStorage.getItem("pizzas")) || [];
            const index = pizzas.findIndex(pizza => pizza.sabor === pizzaAlterar.sabor);
            pizzas[index] = pizzaAlterar;  // Substitui a pizza alterada

            localStorage.setItem("pizzas", JSON.stringify(pizzas));

            alert("Pizza alterada com sucesso");
            atualizarLista();
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    }
}


function atualizarLista(lista=pizzas){

    const tabela = document.getElementById("listaPizzas")
    tabela.innerHTML = "";
    lista.forEach(e => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
        <td>${e.sabor}</td>
        <td>R$${parseFloat(e.preco.toFixed(2))}</td>
        <td>${e.ingredientes}</td>
        `;
        tabela.appendChild(linha);
    });
    localStorage.setItem("pizzas", JSON.stringify(pizzas));
    
}

function registrarVenda(){
    const sabor = document.getElementById("vendaSabor").value;
    const preco = document.getElementById("vendaPreco").value.replace(",", ".");
    const cliente = document.getElementById("vendaCliente").value;

    if(isNaN(parseFloat(preco))){
        alert("Insira um preço valido");
        return
    }
    if(sabor && preco && cliente){
        const listaVendas = document.getElementById('listaVendas');
        const item = document.createElement('li');
        item.textContent = `Sabor: ${sabor} Preço: ${parseFloat(preco).toFixed(2)} Cliente: ${cliente}`
        listaVendas.appendChild(item);

        vendas.push({sabor, preco, cliente})

        document.getElementById('vendaSabor').value = ' '
        document.getElementById('vendaPreco').value = ' '
        document.getElementById('vendaCliente').value = ' '
    }
}

function gerarRelatorio(){
    const tabelaRelatorio = document.getElementById('tabelaRelatorio');
    tabelaRelatorio.innerHTML = '';
    if(vendas.length === 0){
        alert("Nenhuma venda registrada");
        return
    }

    let totalVendas = 0;
    if (totalVendas.length === 0){
        alert('Valor de vendas não registrado')
        return
    }
    vendas.forEach( v=>{
        const linha = document.createElement('tr');
        linha.innerHTML= `
        <td>${v.sabor}</td>
        <td>R$${parseFloat(v.preco).toFixed(2)}</td>
        <td>${v.cliente}</td>
        `
        tabelaRelatorio.appendChild(linha)

        totalVendas += parseFloat(v.preco)
    })
    const linhaTotal = document.createElement('tr');
    linhaTotal.innerHTML = `<td><strong>Total</strong></td>
    <td><strong>R$${totalVendas.toFixed(2).toString().replace(".", ",")}</td>
    <td></td>`
    tabelaRelatorio.appendChild(linhaTotal);

    document.getElementById('relatorio').classList.remove("hidden");
}

function deslogar(){
    document.cookie = "auth=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setTimeout(() => {
        window.location.href = "./index.html"
    }, (500));
}

function getBase64Img(imagem){
    return new Promise((resolve, reject)=>{
        const fileReader = new FileReader()
        fileReader.onload = ()=>{
            resolve(fileReader.result);
        }
        
        fileReader.onerror = (error)=>{
            reject(error);
        }
        if(imagem){
            fileReader.readAsDataURL(imagem);
        }
    
    }

)
    
}
function mudarImagem(){
    document.getElementById("imagem").click()
}

function atualizarPreview() {
    const preview = document.getElementById("preview");
    const file = document.getElementById("imagem").files[0];
    if (file) {
        const image = URL.createObjectURL(file);
        preview.src = image;
        preview.onload = () => URL.revokeObjectURL(preview.src); // Libera o URL da imagem quando carregada
    }else{
        preview.src = "/images/pizzas/placeholder.jpg"
    }
}
function atualizarNovoPreview() {
    const preview = document.getElementById("previewNovaPizza");
    const file = document.getElementById("novaImagem").files[0];
    if (file) {
        const image = URL.createObjectURL(file);
        preview.src = image;
        preview.onload = () => URL.revokeObjectURL(preview.src); // Libera o URL da imagem quando carregada
    }else{
        preview.src = "/images/pizzas/placeholder.jpg"
    }
}
