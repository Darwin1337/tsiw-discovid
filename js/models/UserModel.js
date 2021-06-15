export class UtilizadorNormalModel {
  constructor(id, pnome, unome, email, password, tlm, nif, data_nasc, consentimento_email) {
    this.id = id;
    this.pnome = pnome;
    this.unome = unome;
    this.email = email;
    this.password = password;
    this.data_usessao = new Date();
    this.tlm = tlm;
    this.nif = nif;
    this.data_nasc = data_nasc;
    this.pontos = 0;
    this.avatar = "https://i.ibb.co/BZTyP4Z/icon.png";
    this.avatar_mudado = false;
    this.data_criacao = new Date();
    this.consentimento_email = consentimento_email;
    this.admin = false;
    this.quant_marcacoes = 0;
    this.bloqueado=false;
  }
}

export class EnderecoNormalModel {
  constructor(id_endereco, id_utilizador, morada, cod_postal, id_localidade, lat, long, etiqueta, predefinido) {
    this.id_endereco = id_endereco;
    this.id_utilizador = id_utilizador;
    this.morada = morada;
    this.cod_postal = cod_postal;
    this.id_localidade = id_localidade;
    this.lat = lat;
    this.long = long;
    this.etiqueta = etiqueta;
    this.predefinido = predefinido;
  }
}
