import {
  UtilizadorNormalModel,
  UtilizadorEntidadeModel
} from "../models/UserModel.js"

export default class UserController {
  constructor() {
    this.users = localStorage.users ? JSON.parse(localStorage.users) : []
  }

  register(a, b, c, d, e, f, g, h) {
    try {
      const newId = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1
      this.users.push(new UtilizadorNormalModel(newId, a, b, c, d, e, f, g, h));
      let teste = new UtilizadorEntidadeModel();
      localStorage.setItem('users', JSON.stringify(this.users));
    } catch (e) {
      alert("Erro! " + e)
    }
  }
}
