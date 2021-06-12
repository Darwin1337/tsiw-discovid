import EncomendasController from '../controllers/EncomendasController.js';
import UserController from '../controllers/UserController.js';
import LojaController from '../controllers/LojaController.js';

export default class EncomendasView {
  constructor() {
    // Instanciar o EncomendasController para ser possível aceder ao métodos dos utilizadores
    this.encomendasController = new EncomendasController();
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();
    // Instanciar o LojaController para ser possível aceder ao métodos dos utilizadores
    this.lojaController = new LojaController();

    this.currentPage = document.querySelector("body");
    if (this.currentPage.id=="encomendas") {
      if(this.userController.getLoggedInUserType()=="posto"){
        // Se não for administrador mostrar uma mensagem de erro
        this.currentPage.innerHTML = `
        <div class="container text-center d-flex justify-content-center flex-column" style="min-height: 100vh;">
          <div style="font-size: 3rem;">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h1>A página requisitada não está disponível</h1>
          <div>
            <button class="btn btn-laranja">Página Inicial</button>
          </div>
        </div>`;

      document.querySelector("button").addEventListener('click', event => {
        window.location.replace("..\\..\\");
      });
      }
      else{
        this.MostrarEncomendas(1);
        this.SetInfoEncomenda();
        this.OrdenarEncomendas();
      }
    }
  }

  MostrarEncomendas(ordem){
    document.getElementById("encomenda-cartao").innerHTML=""
    const encomendas = this.encomendasController.GetAllEncomendas();
    let first=true
    if (ordem==1) {
      for (let i = 0; i < encomendas.length; i++) {
        if (encomendas[i].id_utilizador==this.userController.getLoggedInUserData().id) {
          if (first==true) {
            document.getElementById("encomenda-cartao").innerHTML += `
            <div class="col-md-12 encomendas-cartoes-display">
              <div class="col-xl-9 col-xs-12 encomenda " >
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">Encomenda #${encomendas[i].id_encomenda}</h5>
                    <p class="pt-4 mb-1">Encomenda realizada a ${encomendas[i].data_compra}</p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>Processado</p>
                  </div>
                  <div class="col-md-3">
                    <button class="ver-encomenda" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#modal-detalhes-encomenda" id="${encomendas[i].id_encomenda}">Ver encomenda <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
            
              <div class="col-md-3 color-azul-princ p-3">
                <h5 class="color-laranja">Ordenar por data</h5>
                <div class="d-flex align-items-center pt-3">
                  <input type="radio"  name="ordem" value="recente-antigo" id="ordem-2" class="check-style"><span class="span-checkbox">Mais recente para mais antigo</span>
                </div>
                <div class="d-flex align-items-center pt-3 pb-3">
                  <input type="radio" checked name="ordem" value="antigo-recente" id="ordem-1" class="check-style"><span class="span-checkbox">Mais antigo para mais recente</span>
                </div>
              </div>
            </div>
            `
            

          first=false
          }
          else{
            document.getElementById("encomenda-cartao").innerHTML += `
            <div class="col-md-12 encomendas-cartoes-display">
              <div class="col-xl-9 col-xs-12 encomenda mt-3" >
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja" id="numero-encomenda">Encomenda #${encomendas[i].id_encomenda}</h5>
                    <p class="pt-4 mb-1" id="dia-encomenda">Encomenda realizada a ${encomendas[i].data_compra}</p>
      
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>Processado</p>
                  </div>
                  <div class="col-md-3">
                    <button class="ver-encomenda" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#modal-detalhes-encomenda" id="${encomendas[i].id_encomenda}">Ver encomenda <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
            </div>
              `
          }
        }
      }
    }
    else{
      for (let i = parseInt(encomendas.length)-1; i > -1; i--) {
        if (encomendas[i].id_utilizador==this.userController.getLoggedInUserData().id) {
          if (first==true) {
            document.getElementById("encomenda-cartao").innerHTML += `
            <div class="col-md-12 encomendas-cartoes-display">
              <div class="col-xl-9 col-xs-12 encomenda " >
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">Encomenda #${encomendas[i].id_encomenda}</h5>
                    <p class="pt-4 mb-1">Encomenda realizada a ${encomendas[i].data_compra}</p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>Processado</p>
                  </div>
                  <div class="col-md-3">
                    <button class="ver-encomenda" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#modal-detalhes-encomenda" id="${encomendas[i].id_encomenda}">Ver encomenda <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
            
              <div class="col-md-3 color-azul-princ p-3">
                <h5 class="color-laranja">Ordenar por data</h5>
                <div class="d-flex align-items-center pt-3">
                  <input type="radio"  name="ordem" value="recente-antigo" id="ordem-2" class="check-style"><span class="span-checkbox">Mais recente para mais antigo</span>
                </div>
                <div class="d-flex align-items-center pt-3 pb-3">
                  <input type="radio" checked name="ordem" value="antigo-recente" id="ordem-1" class="check-style"><span class="span-checkbox">Mais antigo para mais recente</span>
                </div>
              </div>
            </div>
            `
            

          first=false
          }
          else{
            document.getElementById("encomenda-cartao").innerHTML += `
            <div class="col-md-12 encomendas-cartoes-display">
              <div class="col-xl-9 col-xs-12 encomenda mt-3" >
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja" id="numero-encomenda">Encomenda #${encomendas[i].id_encomenda}</h5>
                    <p class="pt-4 mb-1" id="dia-encomenda">Encomenda realizada a ${encomendas[i].data_compra}</p>
      
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>Processado</p>
                  </div>
                  <div class="col-md-3">
                    <button class="ver-encomenda" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#modal-detalhes-encomenda" id="${encomendas[i].id_encomenda}">Ver encomenda <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
            </div>
              `
          }
        }
      }
    }
    this.OrdenarEncomendas()
    this.SetInfoEncomenda()
  }

  SetInfoEncomenda(){
    //Atribuir os valores do localstorage aos campos
    for (const btnVerEncomenda of document.getElementsByClassName("ver-encomenda")) {
      btnVerEncomenda.addEventListener("click", () => {

        document.getElementById("produtos-encomenda").innerHTML=""
        document.getElementById("data-encomenda").innerHTML=""
        document.getElementById("numero-encomenda-modal").innerHTML=""
        document.getElementById("subtotal").innerHTML=""
        document.getElementById("preco-total").innerHTML=""
        document.getElementById("metodo-pagamento").innerHTML=""
        document.getElementById("rua-envio").innerHTML = "";
        document.getElementById("cp-envio").innerHTML = "";
        document.getElementById("localidade-envio").innerHTML = "";
        document.getElementById("contacto-envio").innerHTML = "";

        const encomendas = this.encomendasController.GetAllEncomendas();
        const produtos = this.lojaController.getAllProdutos();
        const detalhes_encomenda = this.encomendasController.GetAllDetalhesEncomenda();
        for (let i = 0; i < encomendas.length; i++) {
          if(btnVerEncomenda.id==encomendas[i].id_encomenda){
            let total=parseInt(encomendas[i].preco_total) + parseInt(2);
            document.getElementById("numero-encomenda-modal").innerHTML += `Encomenda #${encomendas[i].id_encomenda}`;
            document.getElementById("data-encomenda").innerHTML += `Encomenda realizada a ${encomendas[i].data_compra}`;
            document.getElementById("subtotal").innerHTML += `${encomendas[i].preco_total}€`;
            document.getElementById("preco-total").innerHTML += `${total}€`;
            document.getElementById("metodo-pagamento").innerHTML += `${encomendas[i].metodo_pagamento}`;
            document.getElementById("rua-envio").innerHTML += `${encomendas[i].endereco_envio}`;
            document.getElementById("cp-envio").innerHTML += `${encomendas[i].cp_envio}`;
            document.getElementById("localidade-envio").innerHTML += `${encomendas[i].localidade_envio}`;
            document.getElementById("contacto-envio").innerHTML += `${encomendas[i].contacto}`;
          }
        }
        for (let d = 0; d < detalhes_encomenda.length; d++) {
          for (let s = 0; s < produtos.length; s++) {
            if (produtos[s].id==detalhes_encomenda[d].id_produto) {
              if(btnVerEncomenda.id==detalhes_encomenda[d].id_encomenda){
                console.log(detalhes_encomenda[d].quantidade)
                let sub=produtos[s].preco * detalhes_encomenda[d].quantidade;
                document.getElementById("produtos-encomenda").innerHTML += `
                <div class="row">
                  <div class="col-2">
                    <img src="../img/loja/M01.png" class="w-100" alt="">
                  </div>
                  <div class="col-8">
                    <p><span class="color-laranja"><b>${detalhes_encomenda[d].quantidade}x</b> </span><b class="color-azul-princ">${produtos[s].nome}</b></p>
                    <p id="id-produto">#${produtos[s].id} <span>${produtos[s].preco}€</span></p>
                  </div>
                  <div class="col-2 d-flex justify-content-end ">
                    <p id="preco-total-produto">${sub}€</p>
                  </div>
                </div>
                <hr>`

              }
            }
          }
        }
      });
    }
  }

  OrdenarEncomendas(){
    //Ordenar encomendas por data
    document.getElementById("ordem-1").addEventListener("click",()=>{
      this.MostrarEncomendas(1)
      document.getElementById("ordem-1").checked=true
    })
    document.getElementById("ordem-2").addEventListener("click",()=>{
      this.MostrarEncomendas(2)
      document.getElementById("ordem-2").checked=true
    })
  }
}
