import UtilizadorNormalModel from "../models/UserModel.js"
import UtilizadorEntidadeModel from "../models/PostosModel.js"

export default class UserController {
  constructor() {
    this.users = localStorage.users ? JSON.parse(localStorage.users) : [];
  }

  changeUserType(email, tipo) {
    const userIdx = this.users.findIndex(user => user.email === email);
    if (tipo == "admin") {
      this.users[userIdx]["admin"] = true;
    } else if (tipo == "user") {
      this.users[userIdx]["admin"] = false;
    }
    localStorage.removeItem("users");
    localStorage.setItem("users", JSON.stringify(this.users))
  }

  register(a, b, c, d, e, f, g, h) {
    if (!this.users.some(user => user.email === c) && !this.users.some(user => user.nif === f)) {
      const newId = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
      this.users.push(new UtilizadorNormalModel(newId, a, b, c, d, e, f, g, h));
      let teste = new UtilizadorEntidadeModel();
      localStorage.setItem('users', JSON.stringify(this.users));
      let loggedInUserInfo = {
        'id': newId
      };
    } else {
      throw Error("Os dados introduzidos já estão registados na plataforma.");
    }
  }

  login(a, b) {
    if (this.users.some(user => user.email === a && user.password === b)) {
      let user = this.users.find(user => user.email === a && user.password === b);
      let loggedInUserInfo = {
        'id': user.id
      };
      sessionStorage.setItem('loggedInUserInfo', JSON.stringify(loggedInUserInfo));
    } else {
        throw Error("Os dados introduzidos são inválidos");
    }
  }

  logout() {
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
}
