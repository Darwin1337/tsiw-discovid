import LojaController from '../controllers/LojaController.js';

export default class LojaView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.lojaController = new LojaController();
    this.ListAllProducts()
    this.AddToCart()
  }

  ListAllProducts() {
    //Listar todos os produtos registados
    const x = this.lojaController.getAllProdutos();
    for (let i = 0; i < x.length; i++) {
      document.getElementById("produtos-section").innerHTML += `
      <div class="col-xl-3 col-md-6 col-xs-12">
          <div class="card-product">
            <div class="card">
              <img class="card-img-top mx-auto" src="${x[i].imagem}">
              <div class="card-body">
                <h5 class="card-title">${x[i].nome}</h5>
                <p class="card-text">${x[i].preco} €</p>
                <a class="ver-descricao-button" data-bs-toggle="collapse" href="#collapse${x[i].id}" role="button" aria-expanded="false">Ver descrição</a>
                <div class="collapse" id="collapse${x[i].id}">
                  <div class="card card-body">
                    ${x[i].descricao}
                  </div>
                </div>
                <div class="pt-4">
                  <button class="add-cart-button" id="${x[i].id}">Adicionar ao carrinho</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }
  }

  AddToCart(){
    let aux=false
    for (const btn of document.getElementsByClassName("add-cart-button")) {
      btn.addEventListener("click", () => {
        const x = this.lojaController.getAllProdutos();
        for (const btn1 of document.getElementsByClassName("remover")) {
          if(btn.id==btn1.id){
            aux=true
            //Adicionar mais um ao valor que está na inputbox
            document.getElementById(`quantidade-produto-${btn.id}`).value=parseInt(document.getElementById(`quantidade-produto-${btn.id}`).value)+parseInt(1)
            document.getElementById(`quantidade-produto-${btn.id}`).setAttribute("value",parseInt(document.getElementById(`quantidade-produto-${btn.id}`).value))
            break
          }
        }

        if (aux==false) {
          for (let i = 0; i < x.length; i++) {
            if(x[i].id==btn.id){
              document.getElementById("carrinho-de-compras").innerHTML+=`
              <div class="row">
                <div class="col-3 col-md-3">
                  <img class="img-cart" src="${x[i].imagem}">
                </div>
                <div class="col-9 col-md-3 d-flex align-items-center justify-content-center">
                  <p class="titulo-cart mb-0">${x[i].nome}</p>
                </div>
                <div class="col d-flex align-items-center justify-content-center">
                  <input class="form-control quantidade-produto" id="quantidade-produto-${btn.id}" type="number" min="1" max="100" value="1">
                </div>
                <div class="col d-flex align-items-center justify-content-center">
                  <p class="preco-cart" id="preco-${x[i].id}">${x[i].preco}€</p>
                </div>
                <div class="col d-flex align-items-center justify-content-center">
                  <span><i class="far fa-trash-alt remover" id="${x[i].id}"></i></span>
                </div>
              </div>
              <hr>
              `
              break
            }
          }
          this.QuantidadeAlterada()
        }

        this.CalcularTotal()
        aux=false
      });
    }
  }

  QuantidadeAlterada(){
    for (const btn of document.getElementsByClassName("quantidade-produto")) {
      btn.addEventListener("change", () => {
        alert("Falta acabar")
      });
    }
  }

  CalcularTotal(){
    let total=0
    const x = this.lojaController.getAllProdutos();
    for (const btn1 of document.getElementsByClassName("quantidade-produto")) {
      for (let i = 0; i < x.length; i++) {
        if(x[i].id==btn1.id.split("-",3)[2]){
          total+=parseFloat(x[i].preco)*parseFloat(btn1.value)

        }
      }
    }
    document.querySelector(".preco-total-cart").innerHTML=`${total}€`
  }
}
