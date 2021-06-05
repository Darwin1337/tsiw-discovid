import AutenticacaoView from "./views/AutenticacaoView.js";
import NavbarView from "./views/NavbarView.js";
import ProfileView from "./views/ProfileView.js";
import AdminUsersView from "./views/AdminUsersView.js";

// Import de controllers para a 'dummy data' ficar mais legível e não muito extensa
import UserController from "./controllers/UserController.js";

class App {
  constructor() {
    this.routes = {
      '': [NavbarView],
      'index': [NavbarView],
      'default': [NavbarView],
      'autenticacao': [NavbarView, AutenticacaoView],
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
      'admin-utilizadores': [AdminUsersView]
      // 'admin-produtos': [AdminView],
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

    // Utilizadores
    if (!localStorage.users) {
      this.userController = new UserController();
      this.userController.NormalUser_Register("Diogo", "Borges", "diogo@borges.pt", "123", "123456789", "001", new Date(), true);
      this.userController.NormalUser_Register("Diogo", "Oliveira", "diogo@oliveira.pt", "123", "123456789", "002", new Date(), false);
      this.userController.NormalUser_Register("Gonçalo", "Gama", "goncalo@gama.pt", "123", "123456789", "003", new Date(), true);
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
