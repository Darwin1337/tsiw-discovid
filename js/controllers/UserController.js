import {
  UtilizadorNormalModel,
  UtilizadorEntidadeModel
} from "../models/UserModel.js"

export default class UserController {
  constructor() {
    this.users = localStorage.users ? JSON.parse(localStorage.users) : [];
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

  isAnyUserLoggedIn() {
    return sessionStorage.getItem('loggedInUserInfo') !== null ? true : false;
  }

  getLoggedInUsername() {
    if (this.isAnyUserLoggedIn()) {
      return this.users.find(user => parseInt(user.id) === parseInt(JSON.parse(sessionStorage.getItem('loggedInUserInfo'))["id"]));
    }
  }
}
