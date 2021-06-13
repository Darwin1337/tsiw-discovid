import GamificacoesController from '../controllers/GamificacoesController.js';

export default class AdminGamificacoesView {
  constructor() {
    // Instanciar o GamificacoesController
    this.gamificacoesController = new GamificacoesController();
    this.ListAllProducts()
  }

  ListAllProducts() {
    // Lista todos os utilizadores registados
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("tabela-gamificacoes").innerHTML += `
    <tr class="align-middle text-center">
      <td>Pontos Encomenda</td>
      <td>${x[0][0].pontos}</td>
      <td><span class="icon-remover-edit" data-bs-toggle="modal" data-bs-target="#admin-edit-gamificao-encomenda" ><i class="far fa-edit"></i></span></td>
    </tr>`;
    
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
