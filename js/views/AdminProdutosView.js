import LojaController from '../controllers/LojaController.js';

export default class AdminProdutosView {
  constructor() {
    // Instanciar o LojaController
    this.lojaController = new LojaController();
    this.currentPage = document.querySelector("body");
    if (this.currentPage.id=="admin-produtos") {
      this.LoadInputs()
      this.ListAllProducts()
      this.AddProducts()
      this.RemoverProduto()
      this.EditProduct()
      this.SetProdutosInfo()
    }
  }

  LoadInputs() {
    // Liga todos os inputs do produto a variáveis
    this.nomeProduto=document.getElementById("produto-nome")
    this.descricaoProduto=document.getElementById("produto-descricao")
    this.precoProduto=document.getElementById("produto-preco")
    this.imagemProduto=document.getElementById("imagem-produto-text")
  }

  AddProducts(){
    this.imagemProduto.addEventListener("change", () => {
      //alterar imagem ao escrever
      document.querySelector("#imagem-produto").src=this.imagemProduto.value
    });
    //evento do botao de adicionar
    document.querySelector("#produto-form").addEventListener("submit", () => {
      const x = this.lojaController.getAllProdutos();
      let t=false;
      //verificar se já existe algum produto registado
      if(x.length>0){
        for (let i = 0; i < x.length; i++) {
          if (this.nomeProduto.value==x[i].nome) {
            t=true
          }
        }
      }
      else{
        t=false
      }
      //registar produto
      if (t==false) {
        this.lojaController.ProdutoAdd(
          this.nomeProduto.value,
          this.descricaoProduto.value,
          this.precoProduto.value,
          this.imagemProduto.value
          )
        Swal.fire('Sucesso!', 'O produto foi adicionado com sucesso!', 'success');
        event.preventDefault()
        setTimeout(function(){location.reload()},1500);
      }
      else{
        Swal.fire('Erro!', 'O produto não foi adicionado!', 'error');
        event.preventDefault()
        setTimeout(function(){location.reload()},1500);
      }
    });
  }

  RemoverProduto(){
    for (const btnRemove of document.getElementsByClassName("remove-product")) {
      btnRemove.addEventListener("click", () => {
        this.lojaController.ProdutoRemove(btnRemove.id)
      });
    }
  }

  ListAllProducts() {
    // Lista todos os utilizadores registados
    const x = this.lojaController.getAllProdutos();
    for (let i = 0; i < x.length; i++) {
      document.getElementById("tabela-produtos").innerHTML += `
      <tr class="align-middle text-center">
        <td>${x[i].id}</td>
        <td>${x[i].nome}</td>
        <td>${x[i].descricao}</td>
        <td>${x[i].preco}</td>
        <td><span class="icon-remover-user remove-product" id="${x[i].id}"><i class="fas fa-trash"></i></span><button type="submit" data-bs-toggle="modal" data-bs-target="#admin-edit-produto" class="admin-edit-produto" style="color:black" id="${x[i].id}"><span class="icon-remover-edit"><i class="far fa-edit"></i></span></button></td>
      </tr>`;
    }
  }

  SetProdutosInfo() {
    for (const btnEdit of document.getElementsByClassName("admin-edit-produto")) {
      btnEdit.addEventListener("click", () => {
        const x = this.lojaController.getAllProdutos();
        for (let i = 0; i < x.length; i++) {
          if(x[i].id==btnEdit.id){
           //document.getElementById("nome-user-a-editar").innerHTML = x[i].pnome + " "+x[i].unome;
           document.getElementById("imagem-produto-edit").src = x[i].imagem;
           document.getElementById("imagem-produto-text-edit").value = x[i].imagem;
           document.getElementById("produto-nome-edit").value = x[i].nome;
           document.getElementById("produto-preco-edit").value = x[i].preco;
           document.getElementById("produto-descricao-edit").value = x[i].descricao;
           document.querySelector(".editar-produto").id = x[i].id;
          }
        }
      });
    }
  }

  EditProduct(){
    document.querySelector("#imagem-produto-text-edit").addEventListener("change", ()=>{
      document.getElementById("imagem-produto-edit").src=document.getElementById("imagem-produto-text-edit").value
    })
    document.querySelector("#produto-form-edit").addEventListener("submit", () => {
      this.lojaController.Atualizar(
        document.querySelector(".editar-produto").id,
        document.getElementById("imagem-produto-text-edit").value,
        document.getElementById("produto-nome-edit").value,
        document.getElementById("produto-preco-edit").value,
        document.getElementById("produto-descricao-edit").value
        );
    });
  }

}
