pizzas = [];
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
function adicionarPizza() {
    const sabor = document.getElementById("sabor").value;
    const preco = parseFloat(document.getElementById("preco").value.replace(",", "."));
    const ingredientes = document.getElementById("ingredientes").value
        .split(/[,;:.]/) // Divide a string por qualquer vírgula, ponto e vírgula, dois pontos ou ponto
        .map(e => e.trim()) // Remove espaços extras de cada ingrediente
        .filter(e => e !== ''); // Remove elementos vazios

    // Verifica se o preço é um valor numérico válido
    if (isNaN(preco)) {
        alert("Insira um preço válido.");
        return;
    }

    // Verifica se os campos foram preenchidos
    if (sabor && preco && ingredientes.length > 0) {
        alert(`Pizza de ${sabor} com preço R$${preco.toFixed(2)} cadastrada com sucesso.`);
        alert(`Ingredientes: ${ingredientes.join(", ")}`); // Exibe ingredientes como uma lista formatada
        pizzas.push({ sabor, preco, ingredientes });
        
        //W.I.P Guarda a lista no armazenamento local, para poder ser usado em outras páginas

        //
        document.getElementById("sabor").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("ingredientes").value = "";
        atualizarLista(); // Atualiza a lista de pizzas na página
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

    if(pizzaAlterar){
        document.getElementById("novoSabor").value = pizzaAlterar.sabor;
        document.getElementById("novoPreco").value = pizzaAlterar.preco;
        document.getElementById("novoIngrediente").value = pizzaAlterar.ingredientes
    } else {
        alert("Pizza não encontrada");
    }
}


function alterarPizza(){
    if (pizzaAlterar){
        const novoSabor = document.getElementById("novoSabor").value;
        const novoPreco = parseFloat(document.getElementById("novoPreco").value.replace(",", "."));
        const novoIngrediente = document.getElementById("novoIngrediente").value
        .split(/[,;:]/) // Divide a string por qualquer vírgula, ponto e vírgula ou dois pontos
        .map(e => e.trim()) // Remove espaços extras de cada ingrediente
        .filter(e => e !== '');;
        console.log(novoPreco   )
        if(isNaN(novoPreco)){
            alert("Informe um preço valido")
            return;
        }
        if(novoSabor && novoPreco && novoIngrediente){
            pizzaAlterar.sabor = novoSabor
            pizzaAlterar.preco = novoPreco
            pizzaAlterar.ingredientes = novoIngrediente

            atualizarLista();
            alert("Pizza alterada com sucesso")
            document.getElementById("alterarForm").classList.add("hidden");
        }else{
            alert("Por favor, preencha todos os campos")
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