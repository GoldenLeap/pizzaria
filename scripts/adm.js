pizzas = []
pizzaAlterar = null;
function mostrarSecao(secao){
    // Esconde todas as seções
    document.getElementById("adicionar").classList.add("hidden")
    document.getElementById("alterar").classList.add("hidden")
    document.getElementById("lista").classList.add("hidden")
    // Exibe seção selecionada
    document.getElementById(secao).classList.remove("hidden");

}

function adicionarPizza(){
    const sabor = document.getElementById("sabor").value
    const preco = parseFloat(document.getElementById("preco").value.replace(",", "."))
    // Verifica se o preço é um valor numerico valido
    if(isNaN(preco)){   
        alert("Insira um preço valido.")
        return
    }
    // verifica se os campos foram preenchidos
    if(sabor && preco){
        alert(`${sabor} com preço R$${preco.toFixed(2)} cadastrado com sucesso`)
        pizzas.push({sabor, preco})
        // Guarda a lista no armazenamento local, para poder ser usado em outras páginas
        document.getElementById("sabor").value = ""
        document.getElementById("preco").value = ""
        atualizarLista()
    }else{
        alert("Por favor, preencha todos os campos.")
    }
    
}

function buscarPizza(){
    console.log("oi")
    const busca = document.getElementById("busca").value.toLowerCase();
    console.log(busca)
    const resultados = pizzas.filter(pizza => pizza.sabor.toLowerCase().includes(busca));

    console.log(resultados)
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
    } else {
        alert("Pizza não encontrada");
    }
}


function alterarPizza(){
    if (pizzaAlterar){
        const novoSabor = document.getElementById("novoSabor").value;
        const novoPreco = parseFloat(document.getElementById("novoPreco").value.replace(",", "."));
        console.log(novoPreco   )
        if(isNaN(novoPreco)){
            alert("Informe um preço valido")
            return;
        }
        if(novoSabor && novoPreco){
            pizzaAlterar.sabor = novoSabor
            pizzaAlterar.preco = novoPreco

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
        `;
        tabela.appendChild(linha);
    });
}