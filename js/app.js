import NavbarView from "./views/NavbarView.js";
import ProfileView from "./views/ProfileView.js";
import AdminUsersView from "./views/AdminUsersView.js";
import AdminProdutosView from "./views/AdminProdutosView.js";
import AutenticacaoView from "./views/AutenticacaoView.js";
import RegistoNormalView from "./views/RegistoNormalView.js";
import RegistoEntidadeView from "./views/RegistoEntidadeView.js";
import LojaView from "./views/LojaView.js";
import IndexView from "./views/IndexView.js";
//import PostosView from "./views/PostosView.js";
import EncomendasView from "./views/EncomendasView.js";

// Import de controllers para a 'dummy data' ficar mais legível e não muito extensa
import UserController from "./controllers/UserController.js";
import TestsController from "./controllers/TestsController.js";
import LocaleController from "./controllers/LocaleController.js";
import LojaController from "./controllers/LojaController.js";
import EncomendasController from "./controllers/EncomendasController.js";
import GamificacoesController from "./controllers/GamificacoesController.js";

class App {
  constructor() {
    this.routes = {
      '': [NavbarView, IndexView],
      'index': [NavbarView, IndexView],
      'default': [NavbarView, IndexView],
      'autenticacao': [NavbarView, AutenticacaoView],
      'registo-normal': [NavbarView, RegistoNormalView],
      'registo-entidade': [NavbarView, RegistoEntidadeView],
      'checkout-1': [NavbarView],
      'checkout-2': [NavbarView],
      'checkout-3': [NavbarView],
      'editar-perfil': [NavbarView, ProfileView],
      'marcacoes': [NavbarView],
      'encomendas': [NavbarView, EncomendasView],
      'notificacoes': [NavbarView],
      'loja': [NavbarView, LojaView],
      'postos': [NavbarView], // PostosView
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

    // Utilizadores
    this.userController = new UserController();
    this.localeController = new LocaleController();

    // Utilizadores normais
    if (!localStorage.utilizadores_normais) {
      // User 1: Geral
      this.userController.NormalUser_Register("Diogo", "Borges", "diogo@borges.pt", "123", "123456789", "001", new Date(), true);

      // User 2: Geral
      this.userController.NormalUser_Register("Gonçalo", "Gama", "goncalo@gama.pt", "123", "123456789", "003", new Date(), true);

      // User 3: Geral
      this.userController.NormalUser_Register("Diogo", "Oliveira", "diogo@oliveira.pt", "123", "123456789", "002", new Date(), false);

      // Transformar o user 1 em admin
      this.userController.ChangeUserType("goncalo@gama.pt", "admin");
    }

    if (!localStorage.enderecos_normal) {
      // User 2: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getNormalUserByEmail("goncalo@gama.pt").id, "Rua Nuno Álvares 87", "4420-024", 110, 41.14293268029151, -8.564717419708497, "Gondomar", true);

      // User 3: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getNormalUserByEmail("diogo@oliveira.pt").id, "Rua Oliveirinhas 98", "4420-330", 110, 41.140604, -8.525415799999999, "Gondomar", true);

      // User 1: Morada
      this.userController.NormalUser_RegisterAddress(
        this.userController.getNormalUserByEmail("diogo@borges.pt").id, "Rua da Âncora 100", "4400-297", 295, 37.080801, -8.307273199999999, "Gaia", true);
    }

    // Utilizadores entidades
    if (!localStorage.utilizadores_entidades) {
      this.userController.EntityUser_Register("Clínica da Venda Nova", "502747668", "vendanova@clinica.pt", "123", "vendanovaclinica.pt", "08:00", "20:00", "20", false, false, true);
      this.userController.EntityUser_Register("Centro Hospitalar Universitário de São João", "509821197", "saojoao@hospital.pt", null, null, "08:00", "20:00", "20", false, false, false);
      this.userController.EntityUser_Register("Vale Saúde", "514987472", "valesaude@clinica.pt", "123", "valesaude.pt", "08:00", "20:00", "20", false, true, true);
    }

    if (!localStorage.enderecos_entidade) {
      this.userController.EntityUser_RegisterAddress(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, "R. da Ferraria 96", "4435-250", 110, 41.1749771, -8.5462703);
      this.userController.EntityUser_RegisterAddress(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, "Alameda Prof. Hernâni Monteiro", "4200-319", 210, 41.18282823595165, -8.600261664418193);
      this.userController.EntityUser_RegisterAddress(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, "R. Dom João de Castro Nº 509", "4435-674", 110, 41.182707868135395, -8.5291363332414);
    }

    if (!localStorage.testes_entidade) {
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 1, "10", "00");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 2, "7", "50");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("vendanova@clinica.pt").id, 3, "15", "99");

      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, 1, "5", "00");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, 2, "5", "00");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("saojoao@hospital.pt").id, 3, "5", "00");

      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, 1, "10", "99");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, 2, "15", "50");
      this.userController.EntityUser_RegisterTest(this.userController.getEntityUserByEmail("valesaude@clinica.pt").id, 3, "25", "99");
    }

    if (!localStorage.produtos) {
      this.loja = new LojaController();
      this.loja.ProdutoAdd("Mascara 50uni", "Mascara 50uni para proteção diaria contra virus","6","https://i.ibb.co/2Z2swPF/icon.png");
      this.loja.ProdutoAdd("Mascara 50uni 2", "Mascara 50uni para proteção diaria contra virus","2","https://i.ibb.co/2Z2swPF/icon.png");
    }

    // Encomendas
    if (!localStorage.encomendas) {
      this.encomendasController = new EncomendasController();

      this.encomendasController.AddNewEncomenda(1, "12-01-2020", "12", "Rua 123","4213-234","Gondomar", "Paypal","912345678");
      this.encomendasController.AddNewEncomenda(2, "12-01-2020", "12", "Rua 345","4213-234","Gondomar", "MBWay","923456789");
    }

    // Detalhes encomenda
    if (!localStorage.detalhes_encomenda) {
      this.encomendasController = new EncomendasController();

      this.encomendasController.AddNewDetalhesEncomenda(1, 2, 1);
      this.encomendasController.AddNewDetalhesEncomenda(1, 1, 2);
      this.encomendasController.AddNewDetalhesEncomenda(2, 1, 2);
    }

    //Pontos
    if (!localStorage.pontos_encomenda) {
      this.gamificacoesController = new GamificacoesController();

      this.gamificacoesController.AddPontosEncomenda(100);
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
