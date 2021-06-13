import { MarcacoesModel, DetalhesEstadoModel, DetalhesResultado } from "../models/MarcacoesModel.js"

export default class MarcacoesController {
    constructor() {
      this.marcacoes = localStorage.marcacoes ? JSON.parse(localStorage.marcacoes) : [];
      this.estados = localStorage.estados ? JSON.parse(localStorage.estados) : [];
      this.resultados = localStorage.resultados ? JSON.parse(localStorage.resultados) : [];
    }

    AddEstado(nome) {
      const newId = this.estados.length > 0 ? this.estados[this.estados.length - 1].id_estado + 1 : 1;
      this.estados.push(new DetalhesEstadoModel(newId, nome));
      localStorage.setItem("estados", JSON.stringify(this.estados));
    }

    AddResultado(nome) {
      const newId = this.resultados.length > 0 ? this.resultados[this.resultados.length - 1].id_resultado + 1 : 1;
      this.resultados.push(new DetalhesResultado(newId, nome));
      localStorage.setItem("resultados", JSON.stringify(this.resultados));
    }

    AddNewMarcacao(id_utilizador, id_entidade, data_marcacao, id_teste, call_me){
      const newId = this.marcacoes.length > 0 ? this.marcacoes[this.marcacoes.length - 1].id_marcacao + 1 : 1;
      this.marcacoes.push(new MarcacoesModel(newId, id_utilizador, id_entidade, data_marcacao, id_teste, call_me));
      localStorage.setItem("marcacoes", JSON.stringify(this.marcacoes));
    }
}
