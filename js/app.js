import NavbarView from "./views/NavbarView.js";
import ProfileView from "./views/ProfileView.js";
import AdminUsersView from "./views/AdminUsersView.js";
import AdminProdutosView from "./views/AdminProdutosView.js";
import AutenticacaoView from "./views/AutenticacaoView.js";
import RegistoNormalView from "./views/RegistoNormalView.js";
import RegistoEntidadeView from "./views/RegistoEntidadeView.js";
import LojaView from "./views/LojaView.js";

// Import de controllers para a 'dummy data' ficar mais legível e não muito extensa
import UserController from "./controllers/UserController.js";
import TestsController from "./controllers/TestsController.js";
import LocaleController from "./controllers/LocaleController.js";

class App {
  constructor() {
    this.routes = {
      '': [NavbarView],
      'index': [NavbarView],
      'default': [NavbarView],
      'autenticacao': [NavbarView, AutenticacaoView],
      'registo-normal': [NavbarView, RegistoNormalView],
      'registo-entidade': [NavbarView, RegistoEntidadeView],
      'checkout-1': [NavbarView],
      'checkout-2': [NavbarView],
      'checkout-3': [NavbarView],
      'editar-perfil': [NavbarView, ProfileView],
      'marcacoes': [NavbarView],
      'encomendas': [NavbarView],
      'notificacoes': [NavbarView],
      'loja': [NavbarView],
      'postos': [NavbarView],
      'sintomas': [NavbarView],
      'testes': [NavbarView],
      'tracking': [NavbarView],
      'admin-entidades': [AdminUsersView],
      'admin-utilizadores': [AdminUsersView],
      'admin-produtos': [AdminUsersView, AdminProdutosView]
      // 'admin-gamificacoes': [AdminView]
    };

    this.#importDataFixtures();
    this.#instantiateViews();
  }

  #importDataFixtures() {
    // Localidades - aqui é usado JQuery para evitar as burocracias do plain javascript (XMLHttpRequest)
    if (!localStorage.localidades) {
      $.getJSON("../data/localidades.json", function(nome) {
        localStorage.setItem("localidades", JSON.stringify(nome))
      });
    }

    // Testes
    if (!localStorage.testes) {
      this.testsController = new TestsController();
      this.testsController.AddTest("Serológico");
      this.testsController.AddTest("Antigénio");
      this.testsController.AddTest("RT-PCR");
    }

    // Utilizadores normais
    if (!localStorage.utilizadores_normais) {
      this.userController = new UserController();
      this.localeController = new LocaleController();

      // User 1: Geral
      this.userController.NormalUser_Register("Diogo", "Borges", "diogo@borges.pt", "123", "123456789", "001", new Date(), true);
      // User 1: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getUserByEmail("diogo@borges.pt").id, "Rua da Âncora 100", "4400-297", 295, 37.080801, -8.307273199999999, "Gaia", true);

      // User 2: Geral
      this.userController.NormalUser_Register("Gonçalo", "Gama", "goncalo@gama.pt", "123", "123456789", "003", new Date(), true);
      // User 2: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getUserByEmail("goncalo@gama.pt").id, "Rua Nuno Álvares 87", "4420-024", 110, 41.14293268029151, -8.564717419708497, "Gondomar", true);

      // User 3: Geral
      this.userController.NormalUser_Register("Diogo", "Oliveira", "diogo@oliveira.pt", "123", "123456789", "002", new Date(), false);
      // User 3: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getUserByEmail("diogo@oliveira.pt").id, "Rua Oliveirinhas 98", "4420-330", 110, 41.140604, -8.525415799999999, "Gondomar", true);

      // Transformar o user 1 em admin
      this.userController.ChangeUserType("goncalo@gama.pt", "admin");
    }
  }

  #instantiateViews() {
    const path = window.location.pathname;
    let route = path;

    try {
      route.split("//");
      route.split("\\");
      route = path.substr(path.lastIndexOf('/') + 1);
      if (route.indexOf(".") > -1) {
        route = route.split('.')[0];
      }
    } catch {
      route = "default";
    }
    const views = this.#getViews(route);
    for (const view of views) {
      new view();
    }
  }

  #getViews(route) {
    return typeof this.routes[route] === 'undefined' ? [] : this.routes[route];
  }
}

new App();
