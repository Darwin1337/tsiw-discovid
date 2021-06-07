import Test from "../models/TestsModel.js"

export default class TestsController {
  constructor() {
    this.testes = localStorage.testes ? JSON.parse(localStorage.testes) : [];
  }

  GetAllTests() {
    return this.testes;
  }

  GetNameById(id) {
    return this.testes.find(teste => teste.id_teste == id);
  }

  AddTest(nome) {
    const newId = this.testes.length > 0 ? this.testes[this.testes.length - 1].id_teste + 1 : 1;
    this.testes.push(new Test(newId, nome));
    localStorage.setItem("testes", JSON.stringify(this.testes));
  }
}
