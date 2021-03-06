import { UtilizadorNormalModel, EnderecoNormalModel } from "../models/UserModel.js"
import { UtilizadorEntidadeModel, EnderecoEntidadeModel, TesteEntidadeModel } from "../models/PostosModel.js"

export default class UserController {
  constructor() {
    // Utilizadores normais
    this.normalUsers = localStorage.utilizadores_normais ? JSON.parse(localStorage.utilizadores_normais) : [];
    this.endNormal = localStorage.enderecos_normal ? JSON.parse(localStorage.enderecos_normal) : [];

    // Utilizadores entidade
    this.entityUsers = localStorage.utilizadores_entidades ? JSON.parse(localStorage.utilizadores_entidades) : [];
    this.endEntidade = localStorage.enderecos_entidade ? JSON.parse(localStorage.enderecos_entidade) : [];
    this.testesEntidade = localStorage.testes_entidade ? JSON.parse(localStorage.testes_entidade) : [];
  }

  getAllNormalEnderecos() {
    return this.endNormal;
  }

  getAllEntityEnderecos() {
    return this.endEntidade;
  }

  getAllNormalUsers() {
    return this.normalUsers;
  }

  getAllEntityUsers() {
    return this.entityUsers;
  }

  isLoggedUserAnAdmin() {
    const user = this.getLoggedInUserData();
    if (user != null) {
      if (user["admin"] == true) {
        return true;
      } else {
        return false;
      }
    }
    return null;
  }

  isAnyUserLoggedIn() {
    return sessionStorage.getItem('loggedInUserInfo') !== null ? true : false;
  }

  getLoggedInUserType() {
    if (this.isAnyUserLoggedIn()) {
      return JSON.parse(sessionStorage.getItem('loggedInUserInfo'))["tipo"];
    }
    return null;
  }

  getLoggedInUserData() {
    if (this.isAnyUserLoggedIn()) {
      if (this.getLoggedInUserType() == "normal") {
        return this.normalUsers.find(user => parseInt(user.id) == parseInt(JSON.parse(sessionStorage.getItem('loggedInUserInfo'))["id"]));
      } else if (this.getLoggedInUserType() == "posto") {
        return this.entityUsers.find(user => parseInt(user.id) == parseInt(JSON.parse(sessionStorage.getItem('loggedInUserInfo'))["id"]));
      }
    }
    return null;
  }

  getNormalUserByEmail(email) {
    const userIdx = this.normalUsers.findIndex(user => user.email === email);
    if (userIdx != -1) {
      return this.normalUsers[userIdx];
    } else {
      return null;
    }
  }

  getEntityUserByEmail(email) {
    const userIdx = this.entityUsers.findIndex(user => user.email === email);
    if (userIdx != -1) {
      return this.entityUsers[userIdx];
    } else {
      return null;
    }
  }

  ChangeUserType(email, tipo) {
    const userIdx = this.normalUsers.findIndex(user => user.email === email);
    if (tipo == "admin") {
      this.normalUsers[userIdx]["admin"] = true;
    } else if (tipo == "user") {
      this.normalUsers[userIdx]["admin"] = false;
    }
    localStorage.removeItem("utilizadores_normais");
    localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers))
  }

  // Edi????o

  NormalUser_Edit(id, avatar, pnome, unome, email, password, tlm) {
    const userIdx = this.normalUsers.findIndex(user => parseInt(user.id) == parseInt(id));

    // Verificar se o e-mail foi alterado
    if (email != this.normalUsers[userIdx].email) {
      // Se sim, verificar se esse email j?? est?? a ser usado
      if (this.entityUsers.some(user => user.email == email) || this.normalUsers.some(user => user.email == email)) {
        throw Error("O e-mail introduzido j?? est?? a ser utilizado por outro utilizador!");
      }
    }

    if (this.normalUsers[userIdx].avatar == "https://i.ibb.co/BZTyP4Z/icon.png" && avatar != "https://i.ibb.co/BZTyP4Z/icon.png") {
      if (!this.normalUsers[userIdx].avatar_mudado) {
        console.log("?? a primeira vez que adciona foto")
        this.normalUsers[userIdx].pontos += 50;
        this.normalUsers[userIdx].avatar_mudado = true;
      }
    }
    this.normalUsers[userIdx].avatar = avatar;
    this.normalUsers[userIdx].pnome = pnome;
    this.normalUsers[userIdx].unome = unome;
    this.normalUsers[userIdx].email = email;
    this.normalUsers[userIdx].password = password;
    this.normalUsers[userIdx].tlm = tlm;

    localStorage.removeItem("utilizadores_normais");
    localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));

 }

  EntityUser_Edit(id, nome, email, password, website, horario_inicio, horario_fim, intervalo_consulta, drive_thru, call_me, morada, cod_postal, id_localidade, lat, long) {

   const userIdx = this.entityUsers.findIndex(user => parseInt(user.id) == parseInt(id));
   const addIdx = this.endEntidade.findIndex(morada => parseInt(morada.id_entidade) == parseInt(id));

   // Verificar se o e-mail foi alterado
   if (email != this.entityUsers[userIdx].email) {
     // Se sim, verificar se esse email j?? est?? a ser usado
     if (this.entityUsers.some(user => user.email == email) || this.normalUsers.some(user => user.email == email)) {
       throw Error("O e-mail introduzido j?? est?? a ser utilizado por outro utilizador!");
     }
   }

   // Informa????es gerais
   this.entityUsers[userIdx].nome = nome;
   this.entityUsers[userIdx].email = email;
   this.entityUsers[userIdx].password = password;
   this.entityUsers[userIdx].website = website;
   this.entityUsers[userIdx].horario_inicio = horario_inicio;
   this.entityUsers[userIdx].horario_fim = horario_fim;
   this.entityUsers[userIdx].intervalo_consulta = intervalo_consulta;
   this.entityUsers[userIdx].drive_thru = drive_thru;
   this.entityUsers[userIdx].call_me = call_me;

   // Informa????o da morada
   this.endEntidade[addIdx].morada = morada;
   this.endEntidade[addIdx].cod_postal = cod_postal;
   this.endEntidade[addIdx].id_localidade = id_localidade;
   this.endEntidade[addIdx].lat = lat;
   this.endEntidade[addIdx].long = long;

   localStorage.removeItem("enderecos_entidade");
   localStorage.setItem("enderecos_entidade", JSON.stringify(this.endEntidade));
   localStorage.removeItem("utilizadores_entidades");
   localStorage.setItem("utilizadores_entidades", JSON.stringify(this.entityUsers));
}

  // Registos

  NormalUser_Register(pnome, unome, email, password, tlm, nif, data_nasc, consentimento_email) {
    if (!this.normalUsers.some(user => user.email == email) && !this.normalUsers.some(user => user.nif == nif)) {
      const newId = this.normalUsers.length > 0 ? this.normalUsers[this.normalUsers.length - 1].id + 1 : 1;
      this.normalUsers.push(new UtilizadorNormalModel(newId, pnome, unome, email, password, tlm, nif, data_nasc, consentimento_email));
      localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
    } else {
      throw Error("Os dados introduzidos j?? est??o registados na plataforma.");
    }
  }

  NormalUser_RegisterAddress(id_utilizador, morada, cod_postal, id_localidade, lat, long, etiqueta, predefinido) {
    const newId = this.endNormal.length > 0 ? this.endNormal[this.endNormal.length - 1].id_endereco + 1 : 1;
    this.endNormal.push(new EnderecoNormalModel(newId, id_utilizador, morada, cod_postal, id_localidade, lat, long, etiqueta, predefinido));
    localStorage.setItem("enderecos_normal", JSON.stringify(this.endNormal));
  }

  EntityUser_RegisterAddress(id_utilizador, morada, cod_postal, id_localidade, lat, long) {
    const newId = this.endEntidade.length > 0 ? this.endEntidade[this.endEntidade.length - 1].id_endereco + 1 : 1;
    this.endEntidade.push(new EnderecoEntidadeModel(newId, id_utilizador, morada, cod_postal, id_localidade, lat, long));
    localStorage.setItem("enderecos_entidade", JSON.stringify(this.endEntidade));
  }

  EntityUser_Register(nome, nif, email, password, website, horario_inicio, horario_fim, intervalo_consulta, drive_thru, call_me, registado) {
    if (!this.entityUsers.some(user => user.email == email) && !this.entityUsers.some(user => nif != null && user.nif == nif)) {
      const newId = this.entityUsers.length > 0 ? this.entityUsers[this.entityUsers.length - 1].id + 1 : 1;
      this.entityUsers.push(new UtilizadorEntidadeModel(newId, nome, nif, email, password, website, horario_inicio, horario_fim, intervalo_consulta, drive_thru, call_me, registado));
      localStorage.setItem("utilizadores_entidades", JSON.stringify(this.entityUsers));
    } else {
      throw Error("Os dados introduzidos j?? est??o registados na plataforma.");
    }
  }

  EntityUser_RegisterTest(id_entidade, id_teste, preco_euros, preco_centimos) {
    const preco = parseFloat(String(preco_euros) + "." + String(preco_centimos)).toFixed(2);
    this.testesEntidade.push(new TesteEntidadeModel(id_entidade, id_teste, preco));
    localStorage.setItem("testes_entidade", JSON.stringify(this.testesEntidade));
  }

  EntityUser_RemoveTest(id_entidade, id_teste) {
    // Verificar se o utilizador fica com mais algum teste se este for removido
    let testsCount = 0;
    for (let i = 0; i < this.testesEntidade.length; i++) {
      if (parseInt(this.testesEntidade[i].id_entidade) == parseInt(id_entidade)) {
        testsCount++;
      }
    }

    if ((testsCount - 1) > 0) {
      for (let i = 0; i < this.testesEntidade.length; i++) {
        if ((parseInt(this.testesEntidade[i].id_entidade) == parseInt(id_entidade)) && (parseInt(this.testesEntidade[i].id_teste) == parseInt(id_teste))) {
          this.testesEntidade.splice(i, 1);
          break;
        }
      }
      localStorage.removeItem("testes_entidade");
      localStorage.setItem("testes_entidade", JSON.stringify(this.testesEntidade));
    } else {
      throw Error("Tem de ter pelo menos 1 teste adicionado!");
    }
  }

  EntityUser_Verify(id_admin, id_entidade) {
    const entidade = this.entityUsers.findIndex(user => parseInt(user.id) == parseInt(id_entidade));
    if (!this.entityUsers[entidade].verificado) {
      this.entityUsers[entidade].verificado = true;
      this.entityUsers[entidade].id_verificador = id_admin;
      localStorage.removeItem("utilizadores_entidades");
      localStorage.setItem("utilizadores_entidades", JSON.stringify(this.entityUsers));
    } else {
      throw Error("A entidade selecionada j?? est?? verificada!")
    }
  }

  EntityUser_Unverify(id_admin, id_entidade) {
    const entidade = this.entityUsers.findIndex(user => parseInt(user.id) == parseInt(id_entidade));
    if (this.entityUsers[entidade].verificado) {
      this.entityUsers[entidade].verificado = false;
      this.entityUsers[entidade].id_verificador = null;
      localStorage.removeItem("utilizadores_entidades");
      localStorage.setItem("utilizadores_entidades", JSON.stringify(this.entityUsers));
    } else {
      throw Error("A entidade selecionada j?? n??o est?? verificada!")
    }
  }

  NormalUser_Block(id_user) {
    const user = this.normalUsers.findIndex(user => parseInt(user.id) == parseInt(id_user));
    this.normalUsers[user].bloqueado = true;
    localStorage.removeItem("utilizadores_normais");
    localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
  }

  NormalUser_Unblock(id_user) {
    const user = this.normalUsers.findIndex(user => parseInt(user.id) == parseInt(id_user));
    this.normalUsers[user].bloqueado = false;
    localStorage.removeItem("utilizadores_normais");
    localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
  }

  EntityUser_Block(id_entidade) {
    const entidade = this.entityUsers.findIndex(user => parseInt(user.id) == parseInt(id_entidade));
    this.entityUsers[entidade].bloqueado = true;
    localStorage.removeItem("utilizadores_entidades");
    localStorage.setItem("utilizadores_entidades", JSON.stringify(this.entityUsers));
  }

  EntityUser_Unblock(id_entidade) {
    const entidade = this.entityUsers.findIndex(user => parseInt(user.id) == parseInt(id_entidade));
    this.entityUsers[entidade].bloqueado = false;
    localStorage.removeItem("utilizadores_entidades");
    localStorage.setItem("utilizadores_entidades", JSON.stringify(this.entityUsers));
  }

  // Login

  UserLogin(email, password) {
    // Adicionar possibilidade das entidades darem login tamb??m
    if (this.normalUsers.some(user => user.email === email && user.password === password)) {
      let user = this.normalUsers.find(user => user.email === email && user.password === password);
      let loggedInUserInfo = {
        'id': user.id,
        'tipo': 'normal'
      };
      sessionStorage.setItem('loggedInUserInfo', JSON.stringify(loggedInUserInfo));
    } else {
      if (this.entityUsers.some(user => user.email == email && user.registado == true)) {
        const user = this.entityUsers.find(user => user.email == email && user.registado == true);
        let loggedInUserInfo = {
          'id': user.id,
          'tipo': 'posto'
        };
        sessionStorage.setItem('loggedInUserInfo', JSON.stringify(loggedInUserInfo));
      } else {
        throw Error("Os dados introduzidos s??o inv??lidos");
      }
    }
  }

  UserLogout() {
    if (this.isAnyUserLoggedIn()) {
      sessionStorage.removeItem('loggedInUserInfo');
    }
  }

  // Misc

  UpdateUserPoints(pontos){
    //Atualizar pontos ao realizar uma compra
    let loggedUser=this.getLoggedInUserData().id
    for(let i=0; i<this.normalUsers.length;i++){
      if (loggedUser==this.normalUsers[i].id) {
        this.normalUsers[i].pontos+=pontos
        localStorage.removeItem("utilizadores_normais");
        localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
      }
    }
  }

  RemoveUserPoints(){
    //Atualizar pontos ao realizar uma compra
    let loggedUser=this.getLoggedInUserData().id
    for(let i=0; i<this.normalUsers.length;i++){
      if (loggedUser==this.normalUsers[i].id) {
        this.normalUsers[i].pontos=0
        localStorage.removeItem("utilizadores_normais");
        localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
      }
    }
  }

  AdicionarMarcacao(id) {
    const idx = this.normalUsers.findIndex(user => parseInt(user.id) == parseInt(id));
    this.normalUsers[idx].quant_marcacoes += 1;
    localStorage.removeItem("utilizadores_normais");
    localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
  }

  RemoveAllMarcacoes(id) {
    const idx = this.normalUsers.findIndex(user => parseInt(user.id) == parseInt(id));
    this.normalUsers[idx].quant_marcacoes = 0;
    localStorage.removeItem("utilizadores_normais");
    localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
  }
  // getBands(localidade = '', tipo_teste = '') {
  //   let filteredPostos = this.entityUsers.filter(posto => (posto.id_localidade == localidade) && (band.genre == filterGenre || filterGenre === ''));
  //
  //   return filteredPostos
  // }

}
