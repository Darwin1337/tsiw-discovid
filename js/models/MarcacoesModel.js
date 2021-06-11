export class MarcacoesModel {
    constructor(id_marcacao, id_utilizador, id_entidade, data_criacao, data_marcacao, id_teste, cancelamente_requerido, call_me, id_estado, id_resultado) {
      this.id_marcacao = id_marcacao;
      this.id_utilizador = id_utilizador;
      this.id_entidade = id_entidade;
      this.data_criacao = data_criacao;
      this.data_marcacao = data_marcacao;
      this.id_teste = id_teste;
      this.cancelamente_requerido = cancelamente_requerido;
      this.call_me = call_me;
      this.id_estado = id_estado;
      this.id_resultado = id_resultado;
    }
}
export class DetalhesEstadoModel {
    constructor(id_estado, nome) {
      this.id_estado = id_estado;
      this.nome = nome;
    }
}
export class DetalhesResultado {
    constructor(id_resultado, nome_resultado) {
      this.id_resultado = id_resultado;
      this.nome = nome_resultado;
    }
}