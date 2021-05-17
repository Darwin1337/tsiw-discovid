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
    this.avatar = "https://i.imgur.com/LiVd4Tm.png";
    this.avatar_mudado = false;
    this.data_criacao = new Date();
    this.consentimento_email = consentimento_email;
    this.admin = false;
  }
}

export class UtilizadorEntidadeModel {
    constructor() {
      console.log("Importou os dois :)");
    }
}
