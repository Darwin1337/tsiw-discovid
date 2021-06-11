import {MarcacoesModel, DetalhesEstadoModel, DetalhesResultado} from "../models/MarcacoesModel.js"
export default class MarcacoesController {
    constructor() {
      this.marcacoes = localStorage.marcacoes ? JSON.parse(localStorage.marcacoes) : [];
    }
    GetAllMarcacoes() {
        return this.marcacoes;
    }
    AddNewMarcacao(id_utilizador, id_entidade, data_criacao, data_marcacao, id_teste, cancelamente_requerido, call_me, id_estado, id_resultado){
        const newId = this.postos.length > 0 ? this.postos[this.postos.length - 1].id + 1 : 1;
        this.marcacoes.push(new MarcacoesModel(newId, id_utilizador, id_entidade, data_criacao, data_marcacao, id_teste, cancelamente_requerido, call_me, id_estado, id_resultado));
        localStorage.setItem("marcacoes", JSON.stringify(this.marcacoes));
    }
}
