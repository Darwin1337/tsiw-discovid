import {PontosEncomenda, PontosAvatar, PontosAvaliacao,PercentagemPremio,QuantidadeParaTesteGratis} from "../models/PontosModel.js"
export default class GamificacoesController {
    constructor() {
        this.pontos_encomenda = localStorage.pontos_encomenda ? JSON.parse(localStorage.pontos_encomenda) : [];
        this.pontos_avatar = localStorage.pontos_avatar ? JSON.parse(localStorage.pontos_avatar) : [];
        this.pontos_avaliacao = localStorage.pontos_avaliacao ? JSON.parse(localStorage.pontos_avaliacao) : [];
        this.percentagem_premio = localStorage.percentagem_premio ? JSON.parse(localStorage.percentagem_premio) : [];
        this.quantidade_para_teste_gratis = localStorage.quantidade_para_teste_gratis ? JSON.parse(localStorage.quantidade_para_teste_gratis) : [];

    }
    //Encomendas
    EditPontosEncomenda(pontos){
        this.pontos_encomenda[0].pontos=pontos
        localStorage.removeItem("pontos_encomenda");
        localStorage.setItem("pontos_encomenda", JSON.stringify(this.pontos_encomenda));
    }

    AddPontosEncomenda(pontos) {
        this.pontos_encomenda.push(new PontosEncomenda(pontos));
        localStorage.setItem("pontos_encomenda", JSON.stringify(this.pontos_encomenda));
    }

    //Avatar
    AddPontosAvatar(pontos) {
        this.pontos_avatar.push(new PontosAvatar(pontos));
        localStorage.setItem("pontos_avatar", JSON.stringify(this.pontos_avatar));
    }

    EditPontosAvatar(pontos){
        this.pontos_avatar[0].pontos=pontos
        localStorage.removeItem("pontos_avatar");
        localStorage.setItem("pontos_avatar", JSON.stringify(this.pontos_avatar));
    }

    //Avaliação
    AddPontosAvaliacao(pontos) {
        this.pontos_avaliacao.push(new PontosAvaliacao(pontos));
        localStorage.setItem("pontos_avaliacao", JSON.stringify(this.pontos_avaliacao));
    }

    EditPontosAvaliacao(pontos){
        this.pontos_avaliacao[0].pontos=pontos
        localStorage.removeItem("pontos_avaliacao");
        localStorage.setItem("pontos_avaliacao", JSON.stringify(this.pontos_avaliacao));
    }

    //Premio
    AddPercentagemPremio(percentagem,produtos) {
        this.percentagem_premio.push(new PercentagemPremio(percentagem,produtos));
        localStorage.setItem("percentagem_premio", JSON.stringify(this.percentagem_premio));
    }

    EditPercentagemPremio(percentagem,produtos){
        this.percentagem_premio[0].percentagem=percentagem;
        this.percentagem_premio[0].produtos_oferta=produtos;
        localStorage.removeItem("percentagem_premio");
        localStorage.setItem("percentagem_premio", JSON.stringify(this.percentagem_premio));
    }

    //Teste gratis
    AddTesteGratis(quantidade) {
        this.quantidade_para_teste_gratis.push(new QuantidadeParaTesteGratis(quantidade));
        localStorage.setItem("quantidade_para_teste_gratis", JSON.stringify(this.quantidade_para_teste_gratis));
    }

    EditTesteGratis(quantidade){
        this.quantidade_para_teste_gratis[0].quantidade=quantidade;
        localStorage.removeItem("quantidade_para_teste_gratis");
        localStorage.setItem("quantidade_para_teste_gratis", JSON.stringify(this.quantidade_para_teste_gratis));
    }

    GetAllGamificacoes(){
        return [this.pontos_encomenda, this.pontos_avatar, this.pontos_avaliacao, this.percentagem_premio,this.quantidade_para_teste_gratis];
    }
}
