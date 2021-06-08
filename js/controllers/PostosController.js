import { UtilizadorEntidadeModel, EnderecoEntidadeModel, TesteEntidadeModel } from "../models/PostosModel.js"

export default class PostosController {
  constructor() {
    this.postos = localStorage.utilizadores_entidades ? JSON.parse(localStorage.utilizadores_entidades) : [];
    this.enderecos = localStorage.enderecos_entidade ? JSON.parse(localStorage.enderecos_entidade) : [];
    this.localidades = localStorage.localidades ? JSON.parse(localStorage.localidades) : [];
  }

  GetAllPostos() {
    return this.postos;
  }
  GetAllEnderecos() {
    return this.enderecos;
  }
  GetAllLocalidades() {
    return this.localidades;
  }

  // AddTest(nome) {
  //   const newId = this.testes.length > 0 ? this.testes[this.testes.length - 1].id_teste + 1 : 1;
  //   this.testes.push(new Postos(newId, nome));
  //   localStorage.setItem("testes", JSON.stringify(this.testes));
  // }
}
