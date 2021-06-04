export default class UtilizadorEntidadeModel {
  constructor(id, nome, unome, email, password, tlm, nif, data_nasc, consentimento_email) {
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
    this.registado = registado;
    this.verificado = verificado;
    this.id_verificador = id_verificador;
    this.data_criacao = new Date();
  }

  RegistarEndereco(id_endereco, id_entidade, morada, cod_postal, id_localidade, lat, long, etiqueta, predefinido) {
    this.id_endereco = id_endereco;
    this.id_entidade = id_entidade;
    this.morada = morada;
    this.cod_postal = cod_postal;
    this.id_localidade = id_localidade;
    this.lat = lat;
    this.long = long;
    this.etiqueta = etiqueta;
    this.predefinido = predefinido;
  }
}
