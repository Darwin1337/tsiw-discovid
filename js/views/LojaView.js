import LojaController from '../controllers/LojaController.js';
import UserController from '../controllers/UserController.js';
import EncomendasController from '../controllers/EncomendasController.js';

export default class LojaView {
  constructor() {
    // Instanciar o LojaController para ser possível aceder ao métodos dos utilizadores
    this.lojaController = new LojaController();
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();
    // Instanciar o EncomendasController para ser possível aceder ao métodos dos utilizadores
    this.encomendasController = new EncomendasController();

    this.array=[]

    this.currentPage = document.querySelector("body");
    if (this.currentPage.id=="loja") {
      if(this.userController.getLoggedInUserType()=="posto"){
        // Se não for user normal mostrar uma mensagem de erro
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
        this.ListAllProducts()
        this.AddToCart()
        this.VerificarCarrinho()
      }
    }
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
        for (const btn1 of document.getElementsByClassName("remover-carrinho")) {
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
              <div class="row linha-produto" id="${x[i].id}">
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
                  <span class="remover-carrinho" id="${x[i].id}"><i class="far fa-trash-alt remover"></i></span>
                </div>
                <hr>
              </div>

              `
              this.array.push(x[i].id)
              break
            }
          }
          this.QuantidadeAlterada()
        }

        this.CalcularTotal()
        this.RemoverProdutoCarrinho()
        aux=false
        
      });
    }
  }

  QuantidadeAlterada(){
    for (const btn of document.getElementsByClassName("quantidade-produto")) {
      btn.addEventListener("change", () => {
        this.CalcularTotal()
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

  RemoverProdutoCarrinho(){
    for (const btnRemove of document.getElementsByClassName("remover-carrinho")) {
      btnRemove.addEventListener("click", () => {
        for (const row of document.getElementsByClassName("linha-produto")) {
          if (btnRemove.id==row.id) {
            row.remove();
            this.CalcularTotal();
            for(let i=0; i<this.array.length;i++){
              if(btnRemove.id==this.array[i]){
                this.array.splice(i,1)
              }
            }
          }
        }
      });
    }
  }

  VerificarCarrinho(){
  //verificar se carrinho tem produtos
    document.getElementById("finalizar-encomenda-botao").addEventListener("click", ()=>{
      if(this.array.length==0){
        Swal.fire('Erro!', "Para finalizar uma encomenda tem de ter algum produto no carrinho!", 'error');
      }
      else{
        $("#finalizar-encomenda").modal("show")
        this.FinalizarCompra()
      }
    });
    
  }

  FinalizarCompra(){
    document.getElementById("form-encomenda").addEventListener("submit", event=>{
      event.preventDefault();
      let data=""
      let preco_total=0
      let quantidade=0
      const x=this.lojaController.getAllProdutos();
      //Acabar adicionar encomenda
      //Acabar adicionar encomenda
      //Acabar adicionar encomenda
      //Acabar adicionar encomenda
      const currentDate = new Date();
      if (parseInt(currentDate.getMonth())+1 < 10) {
        data= `${currentDate.getDate()}-0${parseInt(currentDate.getMonth())+1}-${currentDate.getFullYear()}`
      }
      else{
        data= `${currentDate.getDate()}-${parseInt(currentDate.getMonth())+1}-${currentDate.getFullYear()}`
      }
      var radios = document.getElementsByName('pagamento-metodo');
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          for(let i=0; i<x.length;i++){
            for(let z=0; z<this.array.length;z++){
              if (x[i].id==this.array[z]) {
                quantidade=document.querySelector(`#quantidade-produto-${x[i].id}`).value
                preco_total+=parseFloat(x[i].preco)*parseFloat(quantidade)
                this.encomendasController.AddNewDetalhesEncomenda(this.encomendasController.encomendas[this.encomendasController.encomendas.length - 1].id_encomenda + 1,this.array[z], parseInt(quantidade))
              }
            }
          }
          this.encomendasController.AddNewEncomenda(this.userController.getLoggedInUserData().id,data,preco_total,"teste","4122-222","porto",radios[i].value,document.getElementById("n_telemovel").value)
          break;
        }
      }
      Swal.fire('Sucesso!', "Encomenda realizada com sucesso", 'success');
      setTimeout(function(){ window.location.replace("encomendas.html"); }, 2000);
    });
  }  
}
