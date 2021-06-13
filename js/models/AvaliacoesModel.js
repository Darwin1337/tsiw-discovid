export default class AvaliacoesModel {
    constructor(id_avaliacao, id_entidade, id_utilizador, id_marcacao, avaliacao, comentario) {
      this.id_avaliacao = id_avaliacao;
      this.id_entidade = id_entidade;
      this.id_utilizador = id_utilizador;
      this.id_marcacao = id_marcacao;
      this.avaliacao = avaliacao;
      this.comentario = comentario;
      this.data = new Date();
    }
}
