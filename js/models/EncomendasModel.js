export class EncomendasModel {
    constructor(id_encomenda, id_utilizador, data_compra, preco_total) {
      this.id_encomenda = id_encomenda;
      this.id_utilizador = id_utilizador;
      this.data_compra = data_compra;
      this.preco_total = preco_total;
    }
}
export class DetalhesEncomenda {
    constructor(id_encomenda, id_produto, quantidade) {
      this.id_encomenda = id_encomenda;
      this.id_produto = id_produto;
      this.quantidade = quantidade;
    }
}