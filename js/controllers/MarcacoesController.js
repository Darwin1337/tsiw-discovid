import { MarcacoesModel, DetalhesEstadoModel, DetalhesResultado } from "../models/MarcacoesModel.js"

export default class MarcacoesController {
    constructor() {
      this.marcacoes = localStorage.marcacoes ? JSON.parse(localStorage.marcacoes) : [];
      this.estados = localStorage.estados ? JSON.parse(localStorage.estados) : [];
      this.resultados = localStorage.resultados ? JSON.parse(localStorage.resultados) : [];
    }

    GetAllMarcacoes(){
      return this.marcacoes;
    }

    GetAllEstados(){
      return this.estados;
    }

    GetAllResultados(){
      return this.resultados;
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

    AddNewMarcacao(id_utilizador, id_entidade, data_marcacao, id_teste, call_me, preco){
      const newId = this.marcacoes.length > 0 ? this.marcacoes[this.marcacoes.length - 1].id_marcacao + 1 : 1;
      this.marcacoes.push(new MarcacoesModel(newId, id_utilizador, id_entidade, data_marcacao, id_teste, preco, call_me));
      localStorage.setItem("marcacoes", JSON.stringify(this.marcacoes));
    }

    CancelarMarcacao(id){
      for (let i = 0; i < this.marcacoes.length; i++) {
        if (this.marcacoes[i].id_marcacao == id) {
          this.marcacoes[i].id_estado = 4;
        }
      }
      localStorage.removeItem("marcacoes");
      localStorage.setItem("marcacoes", JSON.stringify(this.marcacoes));
    }
    UpdateEstadoMarcacao(id_marcacao, id_estado){
      for (let i = 0; i < this.marcacoes.length; i++) {
        if (this.marcacoes[i].id_marcacao == id_marcacao) {
          this.marcacoes[i].id_estado=id_estado
        }
      }
      localStorage.removeItem("marcacoes");
      localStorage.setItem("marcacoes", JSON.stringify(this.marcacoes));
    }
    UpdateResultadoMarcacao(id_marcacao, id_resultado){
      for (let i = 0; i < this.marcacoes.length; i++) {
        if (this.marcacoes[i].id_marcacao == id_marcacao) {
          this.marcacoes[i].id_resultado=id_resultado
        }
      }
      localStorage.removeItem("marcacoes");
      localStorage.setItem("marcacoes", JSON.stringify(this.marcacoes));
    }
}
