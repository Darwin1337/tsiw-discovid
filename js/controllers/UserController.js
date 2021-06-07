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

  getLoggedInUserData() {
    if (this.isAnyUserLoggedIn()) {
      return this.normalUsers.find(user => parseInt(user.id) === parseInt(JSON.parse(sessionStorage.getItem('loggedInUserInfo'))["id"]));
    }
    return null;
  }

  getUserByEmail(email) {
    const userIdx = this.normalUsers.findIndex(user => user.email === email);
    if (userIdx != -1) {
      return this.normalUsers[userIdx];
    } else {
      return null;
    }
  }

  Atualizar(id, avatar, pnome, unome, email, password, tlm, morada, cep) {
   for (let i = 0; i < this.normalUsers.length; i++) {
     if (this.normalUsers[i]["id"] == id) {
       if (avatar!="https://i.ibb.co/BZTyP4Z/icon.png") {
         this.normalUsers[i].avatar_mudado = true;
       }
       this.normalUsers[i].avatar = avatar;
       this.normalUsers[i].pnome = pnome;
       this.normalUsers[i].unome = unome;
       this.normalUsers[i].email = email;
       this.normalUsers[i].password = password;
       this.normalUsers[i].tlm = tlm;
       break;
     }
   }
   for (let i = 0; i < this.endNormal.length; i++) {
     if (this.endNormal[i]["id_utilizador"] == id) {
       this.endNormal[i].cod_postal = cep;
       this.endNormal[i].morada = morada;
       break;
     }
   }

   localStorage.removeItem("enderecos_normal");
   localStorage.setItem("enderecos_normal", JSON.stringify(this.endNormal));
   localStorage.removeItem("utilizadores_normais");
   localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
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

  NormalUser_Register(pnome, unome, email, password, tlm, nif, data_nasc, consentimento_email) {
    if (!this.normalUsers.some(user => user.email == email) && !this.normalUsers.some(user => user.nif == nif)) {
      const newId = this.normalUsers.length > 0 ? this.normalUsers[this.normalUsers.length - 1].id + 1 : 1;
      this.normalUsers.push(new UtilizadorNormalModel(newId, pnome, unome, email, password, tlm, nif, data_nasc, consentimento_email));
      localStorage.setItem("utilizadores_normais", JSON.stringify(this.normalUsers));
    } else {
      throw Error("Os dados introduzidos já estão registados na plataforma.");
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

  EntityUser_Register(nome, nif, email, password, website, horario_inicio, horario_fim, intervalo_consulta, drive_thru, call_me) {
    if (!this.entityUsers.some(user => user.email == email) && !this.entityUsers.some(user => user.nif == nif)) {
      const newId = this.entityUsers.length > 0 ? this.entityUsers[this.entityUsers.length - 1].id + 1 : 1;
      this.entityUsers.push(new UtilizadorEntidadeModel(newId, nome, nif, email, password, website, horario_inicio, horario_fim, intervalo_consulta, drive_thru, call_me));
      localStorage.setItem("utilizadores_entidades", JSON.stringify(this.entityUsers));
    } else {
      throw Error("Os dados introduzidos já estão registados na plataforma.");
    }
  }

  EntityUser_RegisterTest(id_entidade, id_teste, preco_euros, preco_centimos) {
    const preco = parseFloat(String(preco_euros) + "." + String(preco_centimos)).toFixed(2);
    this.testesEntidade.push(new TesteEntidadeModel(id_entidade, id_teste, preco));
    localStorage.setItem("testes_entidade", JSON.stringify(this.testesEntidade));
  }

  UserLogin(email, password) {
    // Adicionar possibilidade das entidades darem login também
    if (this.normalUsers.some(user => user.email === email && user.password === password)) {
      let user = this.normalUsers.find(user => user.email === email && user.password === password);
      let loggedInUserInfo = {
        'id': user.id
      };
      sessionStorage.setItem('loggedInUserInfo', JSON.stringify(loggedInUserInfo));
    } else {
        throw Error("Os dados introduzidos são inválidos");
    }
  }

  UserLogout() {
    if (this.isAnyUserLoggedIn()) {
      sessionStorage.removeItem('loggedInUserInfo');
    }
  }
}
