function exibirMensagem(texto, tipo){
    const mensagem = document.getElementById("mensagem")
    mensagem.textContent = texto
    
    mensagem.className = `mensagem ${tipo}`
    mensagem.classList.remove("hidden")

    setTimeout(()=>{
        mensagem.classList.add("hidden")
    }, 2500)
}


function validarLogin(){
    const usuario = document.getElementById("usuario").value
    const senha = document.getElementById("senha").value

   /* Usuario fixo para exemplo */
   const usuarioTeste = "usuarioLegal"
   const senhaTeste = "senhaLegal"
   
   if(usuario === usuarioTeste && senha === senhaTeste){
    exibirMensagem("Login realizado", "sucesso")
    setTimeout(()=>{
        
        window.location.href = "/index.html"
    }, 1000)
    
   }else{
    exibirMensagem("Usuario/email ou senha incorretos", "erro")
   }

}
