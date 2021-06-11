export class EncomendasModel {
    constructor(id_encomenda, id_utilizador, data_compra, preco_total,endereco_envio, cp_envio, localidade_envio, metodo_pagamento,contacto) {
      this.id_encomenda = id_encomenda;
      this.id_utilizador = id_utilizador;
      this.data_compra = data_compra;
      this.preco_total = preco_total;
      this.endereco_envio = endereco_envio;
      this.cp_envio = cp_envio;
      this.localidade_envio = localidade_envio;
      this.metodo_pagamento = metodo_pagamento;
      this.contacto = contacto;
    }
}
export class DetalhesEncomenda {
    constructor(id_encomenda, id_produto, quantidade) {
      this.id_encomenda = id_encomenda;
      this.id_produto = id_produto;
      this.quantidade = quantidade;
    }
}
