const perfil=document.querySelector("#pills-perfil-tab")
const marcacoes=document.querySelector("#pills-marcacoes-tab")
const encomendas=document.querySelector("#pills-encomendas-tab")
const notificacoes=document.querySelector("#pills-notificacoes-tab")

perfil.addEventListener("click",function(){
  perfil.classList.remove("tab-2")
  perfil.classList.add("tab-1")
  marcacoes.classList.remove("tab-1")
  marcacoes.classList.add("tab-2")
  encomendas.classList.add("tab-2")
  encomendas.classList.remove("tab-1")
  notificacoes.classList.add("tab-2")
  notificacoes.classList.remove("tab-1")
})
marcacoes.addEventListener("click",function(){
  perfil.classList.remove("tab-1")
  perfil.classList.add("tab-2")
  marcacoes.classList.remove("tab-2")
  marcacoes.classList.add("tab-1")
  encomendas.classList.add("tab-2")
  encomendas.classList.remove("tab-1")
  notificacoes.classList.add("tab-2")
  notificacoes.classList.remove("tab-1")
})
encomendas.addEventListener("click",function(){
  perfil.classList.remove("tab-1")
  perfil.classList.add("tab-2")
  marcacoes.classList.remove("tab-1")
  marcacoes.classList.add("tab-2")
  encomendas.classList.add("tab-1")
  encomendas.classList.remove("tab-2")
  notificacoes.classList.add("tab-2")
  notificacoes.classList.remove("tab-1")
})
notificacoes.addEventListener("click",function(){
  perfil.classList.remove("tab-1")
  perfil.classList.add("tab-2")
  marcacoes.classList.remove("tab-1")
  marcacoes.classList.add("tab-2")
  encomendas.classList.add("tab-2")
  encomendas.classList.remove("tab-1")
  notificacoes.classList.add("tab-1")
  notificacoes.classList.remove("tab-2")
})