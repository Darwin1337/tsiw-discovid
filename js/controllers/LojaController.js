import { ProdutoModel} from "../models/LojaModel.js"

export default class LojaController {
  constructor() {
    this.produtos = localStorage.produtos ? JSON.parse(localStorage.produtos) : [];
  }

  getAllProdutos() {
    return this.produtos;
  }
  
  ProdutoAdd(nome, descricao, preco, imagem) {
    const newId = this.produtos.length > 0 ? this.produtos[this.produtos.length - 1].id + 1 : 1;
    this.produtos.push(new ProdutoModel(newId,descricao,preco,nome,imagem));
    localStorage.setItem("produtos", JSON.stringify(this.produtos));
  }

  ProdutoRemove(id) {
    const x = this.getAllProdutos();
    let t=false
    let aRemover=0
    for (let i = 0; i < x.length; i++) {
      if(id==x[i].id){
        t=true;
        aRemover=i
      }
    }
    if (t){
      this.produtos.splice(aRemover,1);
      localStorage.removeItem("produtos");
      localStorage.setItem("produtos", JSON.stringify(this.produtos));
      Swal.fire('Sucesso!', 'O produto foi removido com sucesso!', 'success');
      setTimeout(function(){location.reload()},1500);
    }
  }

  Atualizar(id,imagem, nome, preco, descricao) {
    let x=false
    for (let i = 0; i < this.produtos.length; i++) {
      if (this.produtos[i]["nome"]==nome && this.produtos[i]["id"] != id) {
        x=true
      }     
      if (x==false) {
        if (this.produtos[i]["id"] == id) {
          this.produtos[i].imagem = imagem;
          this.produtos[i].nome = nome;
          this.produtos[i].descricao = descricao;
          this.produtos[i].preco = preco;
          break;
        }
      }    
    }  
    if(x==true){
      Swal.fire('Erro!', 'O produto não foi alterado!', 'error');
        event.preventDefault()
        setTimeout(function(){location.reload()},1500);
    }
    else{
      localStorage.removeItem("produtos");
      localStorage.setItem("produtos", JSON.stringify(this.produtos));
      Swal.fire('Sucesso!', 'O produto foi alterado com sucesso!', 'success');
      event.preventDefault()
      setTimeout(function(){location.reload()},1500);
    }
    
  }
}
