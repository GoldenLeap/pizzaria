window.onload = ()=>{
    const hash = window.location.hash;
    if(hash && hash !=="#"){
        exibirSecao(hash)
    }else{
        exibirSecao("#inicio")
    }

}

window.onhashchange = ()=>{
     const hash = window.location.hash;
    if(hash && hash !=="#"){
        exibirSecao(hash)
    }else{
        exibirSecao("#inicio")
    }
 }
function exibirSecao(secao){
    document.getElementById("inicio").classList.add("hidden")
    document.getElementById("sobre").classList.add("hidden")
    document.getElementById("contato").classList.add("hidden")
    document.getElementById("cardapio").classList.add("hidden")
    document.getElementById("adm").classList.add("hidden")
    document.getElementById("alterar").classList.add("hidden")
    document.getElementById("adicionar").classList.add("hidden")
    document.getElementById("lista").classList.add("hidden")
    
    document.querySelector(secao).classList.remove("hidden")
}

