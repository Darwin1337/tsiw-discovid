import UserView from "./views/UserView.js";
import NavbarView from "./views/NavbarView.js";

class App {
  constructor() {
    this.routes = {
      '': [NavbarView],
      'default': [NavbarView],
      'autenticacao': [NavbarView, UserView]
    };

    // import dummy data for testing purposes
    //this.#importDataFixtures();

    // instantiate the views mapped in the routes object
    this.#instantiateViews();
  }

  #importDataFixtures() {
    // const users = [
    //     {
    //         id: 1,
    //         username: 'user1',
    //         password: 'pass1'
    //     },
    //     {
    //         id: 2,
    //         username: 'user2',
    //         password: 'pass2'
    //     }
    // ];
    //
    // // Load the fixtures in case there is no data in the local storage
    // if (!localStorage.users) {
    //     localStorage.setItem('users', JSON.stringify(users));
    // }
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
