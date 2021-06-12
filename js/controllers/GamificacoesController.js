import {PontosEncomenda, PontosAvatar, PontosAvaliacao} from "../models/PontosModel.js"
export default class GamificacoesController {
    constructor() {
        this.pontos_encomenda = localStorage.pontos_encomenda ? JSON.parse(localStorage.pontos_encomenda) : [];
    }
    EditPontosEncomenda(pontos){
        this.pontos_encomenda[0].pontos=pontos
        localStorage.removeItem("pontos_encomenda");
        localStorage.setItem("pontos_encomenda", JSON.stringify(this.pontos_encomenda));
    }

    AddPontosEncomenda(pontos) {
        this.pontos_encomenda.push(new PontosEncomenda(pontos));
        localStorage.setItem("pontos_encomenda", JSON.stringify(this.pontos_encomenda));
    }
}
