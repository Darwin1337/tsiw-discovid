export class MarcacoesModel {
    constructor(id_marcacao, id_utilizador, id_entidade, data_marcacao, id_teste, preco, call_me) {
      this.id_marcacao = id_marcacao;
      this.id_utilizador = id_utilizador;
      this.id_entidade = id_entidade;
      this.data_criacao = new Date();
      this.data_marcacao = data_marcacao;
      this.id_teste = id_teste;
      this.preco_teste = preco;
      this.cancelamente_requerido = false;
      this.call_me = call_me;
      this.id_estado = 1; // Agendado
      this.id_resultado = 1; // Pendente
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
