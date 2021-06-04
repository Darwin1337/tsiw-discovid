import Localidade from "../models/LocalidadesModel.js"

export default class LocaleController {
  constructor() {
    this.localidades = localStorage.localidades ? JSON.parse(localStorage.localidades) : [];
  }

  GetAllLocales() {
    return this.localidades;
  }

  SearchLocaleByName(nome) {
    // Se não encontrar retorna undefined
    return this.localidades.find(localidade => localidade.nome.toLowerCase() === nome.toLowerCase());
  }
}
