import UserView from "./views/UserView.js";
import NavbarView from "./views/NavbarView.js";
import AdminView from "./views/AdminView.js";

// Import do controller para a 'dummy data' ficar mais legível e não muito extensa
import UserController from "./controllers/UserController.js";

class App {
  constructor() {
    this.routes = {
      '': [NavbarView],
      'default': [NavbarView],
      'autenticacao': [NavbarView, UserView],
      'checkout-1': [NavbarView],
      'checkout-2': [NavbarView],
      'checkout-3': [NavbarView],
      'editar-perfil': [NavbarView],
      'loja': [NavbarView],
      'postos': [NavbarView],
      'sintomas': [NavbarView],
      'testes': [NavbarView],
      'tracking': [NavbarView],
      'admin-entidades': [AdminView],
      'admin-utilizadores': [AdminView],
      'admin-produtos': [AdminView],
      'admin-gamificacoes': [AdminView]
    };

    this.#importDataFixtures();
    this.#instantiateViews();
  }

  #importDataFixtures() {
    this.userController = new UserController();
    if (!localStorage.users) {
      this.userController.register("Diogo", "Borges", "diogo@borges.pt", "123", "123456789", "001", new Date(), true);
      this.userController.register("Diogo", "Oliveira", "diogo@oliveira.pt", "123", "123456789", "002", new Date(), false);
      this.userController.register("Gonçalo", "Gama", "goncalo@gama.pt", "123", "123456789", "003", new Date(), true);
    }
    this.userController.changeUserType("goncalo@gama.pt", "admin");
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
