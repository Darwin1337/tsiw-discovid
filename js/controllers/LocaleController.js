import Localidade from "../models/LocalidadesModel.js"

export default class LocaleController {
  constructor() {
    this.localidades = localStorage.localidades ? JSON.parse(localStorage.localidades) : [];
  }

  GetAllLocales() {
    return this.localidades;
  }

  GetNameById(id) {
    return this.localidades.find(localidade => localidade.id == id);
  }

  SearchLocaleByName(nome) {
    // Se não encontrar retorna undefined
    return this.localidades.find(localidade => localidade.nome.toLowerCase() === nome.toLowerCase());
  }
}
