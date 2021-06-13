import {PontosEncomenda, PontosAvatar, PontosAvaliacao} from "../models/PontosModel.js"
export default class GamificacoesController {
    constructor() {
        this.pontos_encomenda = localStorage.pontos_encomenda ? JSON.parse(localStorage.pontos_encomenda) : [];
        this.pontos_avatar = localStorage.pontos_avatar ? JSON.parse(localStorage.pontos_avatar) : [];
        this.pontos_avaliacao = localStorage.pontos_avaliacao ? JSON.parse(localStorage.pontos_avaliacao) : [];

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
    GetAllGamificacoes(){
        return [this.pontos_encomenda, this.pontos_avatar, this.pontos_avaliacao];
    }
}
