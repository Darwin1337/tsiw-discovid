import LojaController from '../controllers/LojaController.js';
import UserController from '../controllers/UserController.js';
import EncomendasController from '../controllers/EncomendasController.js';
import LocaleController from '../controllers/LocaleController.js';
import GamificacoesController from '../controllers/GamificacoesController.js';

export default class LojaView {
  constructor() {
    // Instanciar o LojaController para ser possível aceder ao métodos dos utilizadores
    this.lojaController = new LojaController();
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();
    // Instanciar o EncomendasController para ser possível aceder ao métodos dos utilizadores
    this.encomendasController = new EncomendasController();
    // Instanciar o LocaleController para ser possível aceder ao métodos dos utilizadores
    this.localeController = new LocaleController();
    // Instanciar o GamificacoesController para ser possível aceder ao métodos dos utilizadores
    this.gamificacoesController = new GamificacoesController();

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
        btn.setAttribute('value', btn.value);
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
        document.getElementById("radio-usar-pontos").checked=false
        document.getElementById("pontos-encomenda").innerHTML="0"
        $("#finalizar-encomenda").modal("show")
        const x2=this.userController.getAllNormalEnderecos();
        const x1=this.userController.getAllNormalUsers();
        document.getElementById("preco-total-encomenda").innerHTML=document.getElementById("preco-total").innerHTML
        for (let d = 0; d< x2.length; d++) {
          for (let i = 0; i< x1.length; i++) {
            if (x2[d].id_utilizador==this.userController.getLoggedInUserData().id && x1[i].id==this.userController.getLoggedInUserData().id) {
              document.getElementById("morada-a-enviar").value=`${x2[d].morada}, ${x2[d].cod_postal}, ${this.localeController.GetNameById(x2[d].id_localidade).nome}`
                document.getElementById("radio-usar-pontos").addEventListener("click", ()=>{
                  if (document.getElementById("radio-usar-pontos").checked==true) {
                    if (x1[i].pontos>parseFloat(document.getElementById("preco-total").innerHTML.split("€",1))*100) {
                      Swal.fire('Erro!', "Os pontos são superiores ao valor da compra, por favor adicione algo mais ao seu carrinho", 'error');
                      document.getElementById("radio-usar-pontos").checked=false
                    }
                    else{
                      document.getElementById("radio-usar-pontos").checked=true
                      document.getElementById("pontos-encomenda").innerHTML=document.getElementById("pontos-user-usar").value
                      document.getElementById("preco-total-encomenda").innerHTML=parseFloat(document.getElementById("preco-total").innerHTML.split("€",1))-parseFloat(document.getElementById("pontos-encomenda").innerHTML/100)+"€"
                    }
                  }
                  else{
                    document.getElementById("pontos-encomenda").innerHTML="0"
                    document.getElementById("preco-total-encomenda").innerHTML=document.getElementById("preco-total").innerHTML
                  }
                })
              document.getElementById("pontos-user").innerHTML=`${x1[i].pontos} = ${parseFloat(x1[i].pontos)/100}€`
              document.getElementById("pontos-user-usar").value=`${x1[i].pontos}`
              break;
              }
            }
          }
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
      let morada=""
      let tlm=""
      let cp=""
      let localidade=""
      const x=this.lojaController.getAllProdutos();
      const x1=this.userController.getAllNormalUsers();
      const x2=this.userController.getAllNormalEnderecos();
      const x3=this.encomendasController.GetAllLocalidades();
      //Acabar adicionar encomenda
      //Acabar adicionar encomenda
      //Acabar adicionar encomenda
      //Acabar adicionar encomenda

      // //ir buscar a data
      const currentDate = new Date();
      if (parseInt(currentDate.getMonth())+1 < 10) {
        data= `${currentDate.getDate()}-0${parseInt(currentDate.getMonth())+1}-${currentDate.getFullYear()}`
      }
      else{
        data= `${currentDate.getDate()}-${parseInt(currentDate.getMonth())+1}-${currentDate.getFullYear()}`
      }

      //Guardar informações do utilizador logado
      for (let d = 0; d< x2.length; d++) {
        for (let i = 0; i< x1.length; i++) {
          for (let z = 0; z< x3.length; z++) {
            if (x1[i].id==this.userController.getLoggedInUserData().id && x2[d].id_utilizador==x1[i].id && x2[d].id_localidade==x3[z].id) {
              tlm=x1[i].tlm
              morada=x2[d].morada
              cp=x2[d].cod_postal
              localidade=x3[z].nome
            }
          }
        }
      }

      //Verificar qual o radio button selecionado
      var radios = document.getElementsByName('pagamento-metodo');
      for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          for(let i=0; i<x.length;i++){
            for(let z=0; z<this.array.length;z++){
              if (x[i].id==this.array[z]) {
                quantidade=document.querySelector(`#quantidade-produto-${x[i].id}`).value
                preco_total=parseFloat(document.getElementById("preco-total-encomenda").innerHTML.split("€",1))
                //adicionar novo detalhes encomenda
                this.encomendasController.AddNewDetalhesEncomenda(this.encomendasController.encomendas[this.encomendasController.encomendas.length - 1].id_encomenda + 1,this.array[z], parseInt(quantidade))
              }
            }
          }
          //adicionar nova encomenda
          this.encomendasController.AddNewEncomenda(this.userController.getLoggedInUserData().id,data,parseFloat(preco_total),morada,cp,localidade,radios[i].value,tlm)
          if (document.getElementById("radio-usar-pontos").checked==true) {
            this.userController.RemoveUserPoints()
            this.userController.UpdateUserPoints(this.gamificacoesController.pontos_encomenda[0].pontos)
          }
          else{
            this.userController.UpdateUserPoints(this.gamificacoesController.pontos_encomenda[0].pontos)
          }
          break;
        }
      }


      Swal.fire('Sucesso!', "Encomenda realizada com sucesso", 'success');
      setTimeout(function(){ window.location.replace("encomendas.html"); }, 2000);
    });
  }
}
