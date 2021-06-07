export class UtilizadorEntidadeModel {
  constructor(id, nome, nif, email, password, website, horario_inicio, horario_fim, intervalo_consulta, drive_thru, call_me) {
    this.id = id;
    this.nome = nome;
    this.nif = nif;
    this.email = email;
    this.password = password;
    this.website = website;
    this.horario_inicio = horario_inicio;
    this.horario_fim = horario_fim;
    this.intervalo_consulta = intervalo_consulta;
    this.drive_thru = drive_thru;
    this.call_me = call_me;
    this.registado = true;
    this.verificado = false;
    this.id_verificador = null;
    this.data_criacao = new Date();
  }
}

export class EnderecoEntidadeModel {
  constructor(id_endereco, id_entidade, morada, cod_postal, id_localidade, lat, long) {
    this.id_endereco = id_endereco;
    this.id_entidade = id_entidade;
    this.morada = morada;
    this.cod_postal = cod_postal;
    this.id_localidade = id_localidade;
    this.lat = lat;
    this.long = long;
  }
}

export class TesteEntidadeModel {
  constructor(id_entidade, id_teste, preco) {
    this.id_entidade = id_entidade;
    this.id_teste = id_teste;
    this.preco = preco;
  }
}
