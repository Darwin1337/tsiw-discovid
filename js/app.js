import UserView from "./views/UserView.js";
import NavbarView from "./views/NavbarView.js";
import UserController from "./controllers/UserController.js";

class App {
  constructor() {
    this.routes = {
      '': [NavbarView],
      'default': [NavbarView],
      'autenticacao': [NavbarView, UserView]
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
      if (view != NavbarView) {
        new view();
      }
    }
  }

  #getViews(route) {
    return typeof this.routes[route] === 'undefined' ? [] : this.routes[route];
  }
}

new App();
const NavbarInstance = new NavbarView();
export default NavbarInstance;
