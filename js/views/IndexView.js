import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'
import TestsController from '../controllers/TestsController.js'

export default class IndexView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Instanciar o TestsController para ser possível adicionar os testes aos selects
    this.testsController = new TestsController();

    // Adicionar as localidades presentes na localstorage ao select de localidades
    this.AddLocalesToSelect(".select-localidades");

    // Adicionar os tipos de teste presentes na localstorage ao select dos testes
    this.AddTestsToSelect(".select-testes");

    // Verificar se o utilizador estiver logado, se estiver, settar o select das localidades com a sua morada
    // this.user
  }

  AddLocalesToSelect(target) {
    const localidades = this.localeController.GetAllLocales();
    const select = document.querySelector(target);
    for (const localidade of localidades) {
      select.innerHTML += `<option value="${localidade['id']}">${localidade['nome']}</option>`;
    }
  }

  AddTestsToSelect(target) {
    const tests = this.testsController.GetAllTests();
    const select = document.querySelector(target);
    for (const test of tests) {
      select.innerHTML += `<option value="${test['id_teste']}">${test['nome_teste']}</option>`;
    }
  }
}
