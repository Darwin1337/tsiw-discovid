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
      this.MostrarEncomendas();
      this.SetInfoEncomenda();
    }
  }

  MostrarEncomendas(){
    const x = this.encomendasController.GetAllEncomendas();
    let first=true
    for (let i = 0; i < x.length; i++) {
      if (first==true) {
        document.getElementById("encomenda-cartao").innerHTML += `
        <div class="col-md-9 encomenda " >
          <div class="row d-flex align-items-center">
            <div class="col-md-6 color-azul-princ">
              <h5 class="color-laranja">Encomenda #${x[i].id_encomenda}</h5>
              <p class="pt-4 mb-1">Encomenda realizada a ${x[i].data_compra}</p>
            </div>
            <div class="col-md-3 color-azul-princ ">
              <p><b>Estado: </b>Processado</p>
            </div>
            <div class="col-md-3">
              <button class="ver-encomenda" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#modal-detalhes-encomenda" id="${x[i].id_encomenda}">Ver encomenda <span><i class="fas fa-arrow-right"></i></span> </button>
            </div>
          </div>
        </div>
        <div class="col-md-3 color-azul-princ ">
          <h5 class="color-laranja">Ordenar por data</h5>
          <div class="d-flex align-items-center pt-3">
            <input type="checkbox" class="check-style"><span class="span-checkbox">Mais recente para mais antigo</span>
          </div>
          <div class="d-flex align-items-center pt-3 pb-3">
            <input type="checkbox" class="check-style"><span class="span-checkbox">Mais antigo para mais recente</span>
          </div>
        </div>
          `
        first=false
      }
      else{
        document.getElementById("encomenda-cartao").innerHTML += `
        <div class="col-md-9 encomenda mt-3" >
          <div class="row d-flex align-items-center">
            <div class="col-md-6 color-azul-princ">
              <h5 class="color-laranja" id="numero-encomenda">Encomenda #${x[i].id_encomenda}</h5>
              <p class="pt-4 mb-1" id="dia-encomenda">Encomenda realizada a ${x[i].data_compra}</p>
              
            </div>
            <div class="col-md-3 color-azul-princ ">
              <p><b>Estado: </b>Processado</p>
            </div>
            <div class="col-md-3">
              <button class="ver-encomenda" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#modal-detalhes-encomenda" id="${x[i].id_encomenda}">Ver encomenda <span><i class="fas fa-arrow-right"></i></span> </button>
            </div>
          </div>
        </div>
          `
      }
    }
  }

  SetInfoEncomenda(){
    for (const btnVerEncomenda of document.getElementsByClassName("ver-encomenda")) {
      btnVerEncomenda.addEventListener("click", () => {

        document.getElementById("produtos-encomenda").innerHTML=""
        document.getElementById("data-encomenda").innerHTML=""
        document.getElementById("numero-encomenda-modal").innerHTML=""
        document.getElementById("subtotal").innerHTML=""
        document.getElementById("preco-total").innerHTML=""

        const x = this.encomendasController.GetAllEncomendas();
        const x1 = this.lojaController.getAllProdutos();
        const x2 = this.encomendasController.GetAllDetalhesEncomenda();
        for (let i = 0; i < x.length; i++) {
          if(btnVerEncomenda.id==x[i].id_encomenda){
            let total=parseInt(x[i].preco_total) + parseInt(2);
            document.getElementById("numero-encomenda-modal").innerHTML += `Encomenda #${x[i].id_encomenda}`;
            document.getElementById("data-encomenda").innerHTML += `Encomenda realizada a ${x[i].data_compra}`;
            document.getElementById("subtotal").innerHTML += `${x[i].preco_total}€`;
            document.getElementById("preco-total").innerHTML += `${total}€`;
          }
        }
        for (let s = 0; s < x1.length; s++) {
          for (let d = 0; d < x2.length; d++) {
            if (x1[s].id==x2[d].id_encomenda) {
              if(btnVerEncomenda.id==x2[d].id_encomenda){
                let sub=x1[s].preco * x2[d].quantidade;
                document.getElementById("produtos-encomenda").innerHTML += `
                <div class="row">
                  <div class="col-2">
                    <img src="../img/loja/M01.png" class="w-100" alt="">
                  </div>
                  <div class="col-8">
                    <p><span class="color-laranja"><b>${x2[d].quantidade}x</b> </span><b class="color-azul-princ">${x1[s].nome}</b></p>
                    <p id="id-produto">#0001 <span>${x1[s].preco}€</span></p>
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
}
