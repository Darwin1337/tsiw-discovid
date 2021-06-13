import AvaliacoesModel from "../models/AvaliacoesModel.js"

export default class LocaleController {
  constructor() {
    this.avaliacoes = localStorage.avaliacoes ? JSON.parse(localStorage.avaliacoes) : [];
  }

  RegisterReview(id_utilizador, id_entidade, id_marcacao, avaliacao, comentario) {
    const newId = this.avaliacoes.length > 0 ? this.avaliacoes[this.avaliacoes.length - 1].id + 1 : 1;
    this.avaliacoes.push(new AvaliacoesModel(
      newId,
      id_entidade,
      id_utilizador,
      id_marcacao,
      avaliacao,
      comentario
    ));
    localStorage.setItem("avaliacoes", JSON.stringify(this.avaliacoes));
  }
}
