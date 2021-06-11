import {EncomendasModel, DetalhesEncomenda} from "../models/EncomendasModel.js"
export default class EncomendasController {
    constructor() {
      this.encomendas = localStorage.encomendas? JSON.parse(localStorage.encomendas) : [];
      this.detalhes_encomenda = localStorage.detalhes_encomenda? JSON.parse(localStorage.detalhes_encomenda) : [];

    }
    GetAllEncomendas() {
        return this.encomendas;
    }

    GetAllDetalhesEncomenda() {
        return this.detalhes_encomenda;
    }

    AddNewEncomenda(id_utilizador, data_compra, preco_total){
        const newId = this.encomendas.length > 0 ? this.encomendas[this.encomendas.length - 1].id_encomenda + 1 : 1;
        this.encomendas.push(new EncomendasModel(newId, id_utilizador, data_compra, preco_total));
        localStorage.setItem("encomendas", JSON.stringify(this.encomendas));
    }
    AddNewDetalhesEncomenda(id_encomenda, id_produto, quantidade){
        this.detalhes_encomenda.push(new DetalhesEncomenda(id_encomenda, id_produto, quantidade));
        localStorage.setItem("detalhes_encomenda", JSON.stringify(this.detalhes_encomenda));
    }
}
