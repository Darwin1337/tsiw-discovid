import { UtilizadorNormalModel, EnderecoNormalModel } from "../models/UserModel.js"
import UtilizadorEntidadeModel from "../models/PostosModel.js"

export default class UserController {
  constructor() {
    this.users = localStorage.users ? JSON.parse(localStorage.users) : [];
    this.enderecos_normal = localStorage.enderecos_normal ? JSON.parse(localStorage.enderecos_normal) : [];
  }

  ChangeUserType(email, tipo) {
    const userIdx = this.users.findIndex(user => user.email === email);
    if (tipo == "admin") {
      this.users[userIdx]["admin"] = true;
    } else if (tipo == "user") {
      this.users[userIdx]["admin"] = false;
    }
    localStorage.removeItem("users");
    localStorage.setItem("users", JSON.stringify(this.users))
  }

  NormalUser_Register(pnome, unome, email, password, tlm, nif, data_nasc, consentimento_email) {
    if (!this.users.some(user => user.email === email) && !this.users.some(user => user.nif === nif)) {
      const newId = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
      this.users.push(new UtilizadorNormalModel(newId, pnome, unome, email, password, tlm, nif, data_nasc, consentimento_email));
      localStorage.setItem("users", JSON.stringify(this.users));
      let loggedInUserInfo = {
        'id': newId
      };
    } else {
      throw Error("Os dados introduzidos já estão registados na plataforma.");
    }
  }

  NormalUser_RegisterAddress(id_utilizador, morada, cod_postal, id_localidade, lat, long, etiqueta, predefinido) {
    const newId = this.enderecos_normal.length > 0 ? this.enderecos_normal[this.enderecos_normal.length - 1].id_endereco + 1 : 1;
    console.log("A instanciar morada:");
    console.log("user_id: " + id_utilizador);
    console.log("morada: " + morada);
    console.log("cod_postal: " + cod_postal)
    console.log("id_localidade" + id_localidade);
    console.log("lat: " + lat);
    console.log("long: " + long);
    console.log("etiqueta: " + etiqueta);
    console.log("predefinido: " + predefinido);
    this.enderecos_normal.push(new EnderecoNormalModel(newId, id_utilizador, morada, cod_postal, id_localidade, lat, long, etiqueta, predefinido));
    localStorage.setItem("enderecos_normal", JSON.stringify(this.enderecos_normal));
  }

  UserLogin(email, password) {
    if (this.users.some(user => user.email === email && user.password === password)) {
      let user = this.users.find(user => user.email === email && user.password === password);
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
      return this.users.find(user => parseInt(user.id) === parseInt(JSON.parse(sessionStorage.getItem('loggedInUserInfo'))["id"]));
    }
    return null;
  }

  getAllNormalUsers() {
    return this.users;
  }

  atualizar(a, b, c, d, e, f, g, h) {
    if (this.users.some(user => user.id === this.getLoggedInUserData.id)) {
      alert("aaa")
      // const newId = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
      // this.users.push(new UtilizadorNormalModel(newId, a, b, c, d, e, f, g, h));
      // let teste = new UtilizadorEntidadeModel();
      // localStorage.setItem('users', JSON.stringify(this.users));
      // let loggedInUserInfo = {
      //   'id': newId
      // };
    } else {
      throw Error("Os dados introduzidos já estão registados na plataforma.");
    }
  }
}
