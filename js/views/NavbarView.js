import UserController from '../controllers/UserController.js';

export default class NavbarView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Página atual - todos os .html têm um id na tag body que descreve o nome da página
    this.currentPage = document.querySelector("body");

    // Prefixo dos urls, se a página for o index o url não tem que vir para trás, por ex.: "img/my_img.png"
    // Se a página estiver dentro da pasta html o url terá de vir para trás, por ex.: "../img/my_img.png"
    this.imgPath = (this.currentPage.id == "index") ? "" : "..\\";

    // Verifica se a largura da window corresponde a mobile ou a desktop
    this.isDisplayMobile = (window.innerWidth >= 992) ? false : true;

    // Aplica a devida navbar (ApplyMobileNavbar ou ApplyDesktopNavbar)
    // Se o argumento "true" for enviado o método irá ignorar a resolução da window e irá aplicar a navbar de acordo com o estado da variável this.isDisplayMobile
    this.VerifyScreenResolution(true);

    // Verifica mudanças na resolução e aplica a devida navbar (ApplyMobileNavbar ou ApplyDesktopNavbar)
    window.addEventListener('resize', this.VerifyScreenResolution.bind(this));

    // Event listener para pills
    this.UpdatePills();

    // Funções especificas para certas páginas
    if (this.currentPage.id == "index" || this.currentPage.id == "postos") {
      document.getElementById("distancia").addEventListener("input", this.UpdateRange.bind(this));
      document.getElementById("distancia").addEventListener("change", this.UpdateRange.bind(this));

      document.getElementById("preco_min").addEventListener("input", this.UpdateRange.bind(this));
      document.getElementById("preco_min").addEventListener("change", this.UpdateRange.bind(this));

      document.getElementById("preco_max").addEventListener("input", this.UpdateRange.bind(this));
      document.getElementById("preco_max").addEventListener("change", this.UpdateRange.bind(this));
    } else if (this.currentPage.id == "sintomas") {
      this.PreventMultipleChoice();
    }
  }

  UpdateRange() {
    let a = null;
    let b = null;
    if (event.target.id == "distancia") {
      a = "currentDistanceValue";
      b = event.target.value;
    } else if (event.target.id == "preco_min") {
      a = "currentMinPriceValue";
      b = event.target.value;
    } else if (event.target.id == "preco_max") {
      a = "currentMaxPriceValue";
      b = event.target.value;
    }
    if (a == "currentMinPriceValue") {
      document.getElementById(a).innerHTML = `<b>${parseFloat(b).toFixed(2)}€</b>`;
      document.getElementById("preco_max").setAttribute("min", parseFloat(b).toFixed(2));
      let sthg = ((parseFloat(200) + parseFloat(parseFloat(b).toFixed(2))));
      if (String(sthg).indexOf(".") > -1) {
        sthg = parseInt(String(sthg).split(".")[0]);
      }
      document.getElementById("preco_max").setAttribute("value", sthg / 2);
      document.getElementById("preco_max").value = sthg / 2;
      document.getElementById("maxMinPrice").innerHTML = `${parseFloat(b).toFixed(2)}€`;
      document.getElementById("currentMaxPriceValue").innerHTML = `<b>${parseFloat(sthg / 2).toFixed(2)}€</b>`;
    } else if (a == "currentDistanceValue") {
      document.getElementById(a).innerHTML = `<b>${b}km</b>`;
    } else if (a == "currentMaxPriceValue") {
      document.getElementById(a).innerHTML = `<b>${parseFloat(b).toFixed(2)}€</b>`;
    }
  }

  VerifyScreenResolution(ignore) {

    // Verifica se a largura da window corresponde a mobile ou a desktop e aplica as devidas funções
    // Se o argumento "true" for enviado o método irá ignorar a resolução da window e irá aplicar a navbar de acordo com o estado da variável this.isDisplayMobile
    ignore = (ignore == true) ? true : false;
    if ((!ignore && window.innerWidth < 992 && !this.isDisplayMobile) || (ignore && this.isDisplayMobile)) {
      this.isDisplayMobile = true;
      this.ApplyMobileNavbar();

      // Se estiver na página "testes" em mobile aplicamos a versão mobile do carrossel
      if (this.currentPage.id == "testes") { this.ApplyMobileCarousel(); }

      // Se estivermos em modo mobile mudamos a imagem da navbar
      document.getElementById("navbar-logo").setAttribute("src", this.imgPath + "img\\logo-mobile.svg");
    } else if ((!ignore && window.innerWidth >= 992 && this.isDisplayMobile) || (ignore && !this.isDisplayMobile)) {
      this.isDisplayMobile = false;
      this.ApplyDesktopNavbar();

      // Se estiver na página "testes" em desktop aplicamos a versão desktop do carrossel
      if (this.currentPage.id == "testes") { this.ApplyDesktopCarousel(); }

      // Se estivermos em modo desktop mudamos a imagem da navbar
      document.getElementById("navbar-logo").setAttribute("src", this.imgPath + "img\\logo.svg");
    }
  }

  ApplyDesktopNavbar() {
    // Verifica se o utilizador está logado, se estiver a porção do HTML que renderizará as informações na navbar ficaram nas seguintes variáveis
    // Se não houver um utilizado logado as variáveis ficaram vazias ou com o código default da navbar
    let renderAuthentication = ``;
    let renderAdminNavItems = ``;
    let renderNome = "";

    if (this.userController.isAnyUserLoggedIn()) {
      if (this.userController.isLoggedUserAnAdmin()) {
        renderAdminNavItems = `
          <li><a class="dropdown-item" href="../html/admin-entidades.html" id="admin">Modo administrador</a></li>
          <li><hr class="dropdown-divider"></li>`;
      }

      if (this.userController.getLoggedInUserType() == "normal") {
        renderNome = this.userController.getLoggedInUserData().pnome.charAt(0).toUpperCase() + this.userController.getLoggedInUserData().pnome.slice(1);
      } else if (this.userController.getLoggedInUserType() == "posto") {
          renderNome += this.userController.getLoggedInUserData().nome.split(" ")[0].charAt(0).toUpperCase() + this.userController.getLoggedInUserData().nome.split(" ")[0].slice(1) + " ";
      }

      renderAuthentication = `
      <li class="nav-item dropdown user">
          <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${this.userController.getLoggedInUserData().avatar}" width="30" height="30" class="d-inline-block align-top" style="margin-right: 5px;"><span><b>${renderNome}</b></span>
          </a>
          <ul class="logged-ddmenu dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
              ${renderAdminNavItems}
              <li id="editar-perfil"><a class="dropdown-item" href="../html/editar-perfil.html">Editar perfil</a></li>
              <li><hr class="dropdown-divider"></li>
              <li id="marcacoes"><a class="dropdown-item" href="../html/marcacoes.html">As minhas marcações</a></li>
              <li><hr class="dropdown-divider"></li>
              <li id="encomendas"><a class="dropdown-item" href="../html/encomendas.html">As minhas encomendas</a></li>
              <li><hr class="dropdown-divider"></li>
              <li id="notificacoes"><a class="dropdown-item" href="../html/notificacoes.html">Notificações</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" id="logout-button">Terminar sessão</a></li>
          </ul>
      </li>`;
    } else {
      renderAuthentication = `
        <li id="autenticacao" class="nav-item">
          <a class="nav-link" href="../html/autenticacao.html"><i class="fas fa-sign-in-alt"></i>  Autenticação</a>
        </li>`;
    }

    // Injeta o código da navbar
    document.querySelector(".nav-area").innerHTML = `
      <nav class="navbar navbar-expand-lg justify-content-center">
        <div class="container">
          <a class="navbar-brand d-flex w-50 me-auto">
            <img id="navbar-logo" src="${this.imgPath}img\\logo.svg" class="d-inline-block align-top" onclick="window.location.href = '..\';" alt="Logótipo Discovid">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="navbar-collapse collapse w-100" id="collapsingNavbar">
              <ul class="main-nav navbar-nav w-100 justify-content-center">
                  <li id="postos" class="nav-item">
                      <a class="nav-link" href="../html/postos.html"><i class="fas fa-map-marker-alt"></i>  Postos</a>
                  </li>
                  <li id="loja" class="nav-item">
                      <a class="nav-link" href="../html/loja.html"><i class="fas fa-shopping-cart"></i>  Loja</a>
                  </li>
                  <li id="covid" class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-syringe"></i>  COVID-19</a>
                      <ul class="covid-drop dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
                          <li id="sintomas"><a class="dropdown-item" href="../html/sintomas.html"><i class="fas fa-head-side-cough"></i>  Sintomas</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li id="tracking"><a class="dropdown-item" href="../html/tracking.html"><i class="fas fa-analytics"></i>  Tracking</a></li>
                      </ul>
                  </li>
                  <li id="testes" class="nav-item">
                      <a class="nav-link" href="../html/testes.html"><i class="fas fa-info-circle"></i>  Testes</a>
                  </li>
              </ul>
              <ul class="try nav navbar-nav ms-auto w-50 justify-content-end">
                ${renderAuthentication}
              </ul>
          </div>
        </div>
      </nav>`;

    // Acionar event listener do botão de logout
    this.BindLogoutButton();

    // Atualizar o link ativo da navbar de desktop
    this.UpdateDesktopActiveLink();
  }

  ApplyMobileNavbar() {
    // Verifica se o utilizador está logado, se estiver a porção do HTML que renderizará as informações na navbar ficaram nas seguintes variáveis
    // Se não houver um utilizado logado as variáveis ficaram vazias ou com o código default da navbar
    let renderAuthentication = ``;
    let renderAdminNavItems = ``;
    let renderNome = "";

    if (this.userController.isAnyUserLoggedIn()) {
      if (this.userController.isLoggedUserAnAdmin()) {
        renderAdminNavItems = `
          <li class="nav-item"><a class="nav-link" href="../html/admin-entidades.html" id="admin">MODO ADMINISTRADOR</a></li>`;
      }

      if (this.userController.getLoggedInUserType() == "normal") {
        renderNome = this.userController.getLoggedInUserData().pnome.charAt(0).toUpperCase() + this.userController.getLoggedInUserData().pnome.slice(1);
      } else if (this.userController.getLoggedInUserType() == "posto") {
          renderNome += this.userController.getLoggedInUserData().nome.split(" ")[0].charAt(0).toUpperCase() + this.userController.getLoggedInUserData().nome.split(" ")[0].slice(1) + " ";
      }

      renderAuthentication = `
        <div class="logged-user-info">
          <img src="${this.userController.getLoggedInUserData().avatar}" width="60" height="60">
            <li class="nav-item logged-user"><a>BEM-VINDO, <span class="text-uppercase"><b>${renderNome}</b></span></a></li>
        </div>
        ${renderAdminNavItems}
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil.html" id="editar-perfil-redirect">EDITAR PERFIL</a></li>
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil.html">AS MINHAS MARCAÇÕES</a></li>
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil.html">AS MINHAS ENCOMENDAS</a></li>
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil.html">NOTIFICAÇÕES</a></li>
        <li class="nav-item"><a class="nav-link" id="logout-button">TERMINAR SESSÃO</a></li>`;
    } else {
      renderAuthentication = `
        <li id="autenticacao" class="nav-item"><a class="nav-link" href="../html/autenticacao.html">AUTENTICAÇÃO</a></li>`;
    }

    // Injeta o código da navbar
    document.querySelector(".nav-area").innerHTML = `
        <nav class="navbar navbar-expand-lg">
          <div class="mobile container">
            <button id="nav-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand">
              <img id="navbar-logo" src="${this.imgPath}img\\logo-mobile.svg" class="d-inline-block align-top" onclick="window.location.href = '..\';" alt="Logótipo Discovid">
            </a>
            <div class="navbar-collapse collapse w-100" id="collapsingNavbar">
                <ul class="main-nav navbar-nav w-100 justify-content-start">
                    <li><hr class="dropdown-divider"></li>
                    <li id="postos" class="nav-item active"><a class="nav-link" href="../html/postos.html"><i class="fas fa-chevron-right"></i>  POSTOS</a></li>
                    <li id="loja" class="nav-item"><a class="nav-link" href="../html/loja.html">LOJA</a></li>
                    <li id="sintomas" class="nav-item"><a class="nav-link" href="../html/sintomas.html">SINTOMAS</a></li>
                    <li id="tracking" class="nav-item"><a class="nav-link" href="../html/tracking.html">TRACKING</a></li>
                    <li id="testes" class="nav-item"><a class="nav-link" href="../html/testes.html">INFO. TESTES</a></li>
                    <li><hr class="dropdown-divider"></li>
                    ${renderAuthentication}
                </ul>
            </div>
          </div>
        </nav>`;

    // Acionar event listener do botão de logout
    this.BindLogoutButton();

    // Quando o botão de abertura da navbar for cliclado mudar a imagem
    document.getElementById("nav-toggler").addEventListener("click", () => {
      const navLogo = document.getElementById("navbar-logo");
      if (!document.getElementById("nav-toggler").classList.contains("collapsed")) {
        navLogo.setAttribute("src", this.imgPath + "img\\menu-logo-mobile.svg");
        navLogo.style.marginRight = "0px";
        navLogo.style.marginTop = "0px";
      } else {
        navLogo.setAttribute("src", this.imgPath + "img\\logo-mobile.svg");
        navLogo.style.marginRight = "0px";
        navLogo.style.marginTop = "0px";
      }
    });

    // Atualizar o link ativo da navbar de mobile
    this.UpdateMobileActiveLink();
  }

  UpdateDesktopActiveLink() {
    const liList = [document.querySelectorAll(".main-nav li"), document.querySelectorAll(".logged-ddmenu li"), document.querySelectorAll(".try li")]
    const dropdownItems = ["sintomas", "tracking", "encomendas", "editar-perfil", "notificacoes", "marcacoes"]

    // Verifica todos os itens da navbar e vê qual corresponde à pág. atual através do id do body
    for (let i = 0; i < liList.length; i++) {
      let lis = liList[i];
      for (const li of lis) {
        if (li.id) {
          if (li.id == this.currentPage.id) {
            if (!li.classList.contains("active")) {
              li.classList.add("active");
            }
            if (dropdownItems.some(page => page == this.currentPage.id)) {
              if (!li.parentNode.parentNode.classList.contains("active")) {
                li.parentNode.parentNode.classList.add("active");
              }
            }
          } else {
            if (li.classList.contains("active")) {
              li.classList.remove("active");
            }
          }
        }
      }
    }
  }

  UpdateMobileActiveLink() {
    const lis = document.querySelectorAll(".main-nav li");

    // Verifica todos os itens da navbar e vê qual corresponde à pág. atual através do id do body
    for (const li of lis) {
      if (li.id) {
        if (li.id == this.currentPage.id) {
          if (!li.classList.contains("active")) {
            li.classList.add("active");
          }
          if (li.firstChild.innerHTML.indexOf('<i class="fas fa-chevron-right"></i>') == -1) {
            const savedText = li.firstChild.innerHTML;
            li.firstChild.innerHTML = `<i class="fas fa-chevron-right"></i>  ${savedText}`;
          }
        } else {
          if (li.classList.contains("active")) {
            li.classList.remove("active");
          }
          if (li.firstChild.innerHTML.indexOf('<i class="fas fa-chevron-right"></i>') > -1) {
            li.firstChild.innerHTML = li.firstChild.innerHTML.split('<i class="fas fa-chevron-right"></i>')[1].trim();
          }
        }
      }
    }
  }

  BindLogoutButton() {
    // Termina a sessão do utilizador
    if (this.userController.isAnyUserLoggedIn()) {
      document.getElementById("logout-button").addEventListener("click", () => {
        Swal.fire({
          title: 'Tem a certeza que quer terminar sessão?',
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `Cancelar`
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Sessão terminada com sucesso!', '', 'success')
            this.userController.UserLogout();
            setTimeout(() => { location.replace("../../") }, 1000);
          }
        });
      });
    }
  }

  ApplyMobileCarousel() {
    document.querySelector(".cards-testes").innerHTML = `
      <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div id="rt-pcr" style="margin: 0 auto;" class="d-block card-tes">
              <div style="min-height: 400px;" class="card-tes d-flex justify-content-center align-items-center">
                <h2>Testes RT-PCR</h2>
              </div>
              <div class="teste-button text-center">
                <input type="button" onclick="window.location.replace('#conteudo-rtpcr')" class="btn btn-azul-pri" value="Saiba mais">
              </div>
            </div>
          </div>
          <div class="carousel-item">
            <div id="antigenio" style="margin: 0 auto;" class="d-block card-tes">
              <div style="min-height: 400px;" class="card-tes d-flex justify-content-center align-items-center">
                <h2 class="text-center">Testes de Antigénio</h2>
              </div>
              <div class="teste-button text-center">
                <input type="button" onclick="window.location.replace('#conteudo-antigenio')" class="btn btn-azul-pri" value="Saiba mais">
              </div>
            </div>
          </div>
          <div class="carousel-item">
            <div id="serologicos" style="margin: 0 auto;" class="d-block card-tes">
              <div style="min-height: 400px;" class="card-tes d-flex justify-content-center align-items-center">
                <h2>Testes Serológicos</h2>
              </div>
              <div class="teste-button text-center">
                <input type="button" onclick="window.location.replace('#conteudo-serologicos')" class="btn" value="Saiba mais">
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>`;
  }

  ApplyDesktopCarousel() {
    document.querySelector(".cards-testes").innerHTML = `
      <div class="cards-testes">
        <div class="row">
          <div class="col-sm-4 d-flex justify-content-center">
            <div id="rt-pcr" class="card-tes">
              <div class="h-100 d-flex justify-content-center align-items-center">
                <h2>Testes RT-PCR</h2>
              </div>
              <div class="teste-button text-center">
                <input type="button" onclick="window.location.replace('#conteudo-rtpcr')" class="btn btn-azul-pri" value="Saiba mais">
              </div>
            </div>
          </div>
          <div class="col-sm-4 d-flex justify-content-center">
            <div id="antigenio" class="card-tes">
              <div class="h-100 d-flex justify-content-center align-items-center">
                <h2 class="text-center">Testes de Antigénio</h2>
              </div>
              <div class="teste-button text-center">
                <input type="button" onclick="window.location.replace('#conteudo-antigenio')" class="btn btn-azul-pri" value="Saiba mais">
              </div>
            </div>
          </div>
          <div class="col-sm-4 d-flex justify-content-center">
            <div id="serologicos" class="card-tes">
              <div class="h-100 d-flex justify-content-center align-items-center">
                <h2>Testes Serológicos</h2>
              </div>
              <div class="teste-button text-center">
                <input type="button" onclick="window.location.replace('#conteudo-serologicos')" class="btn" value="Saiba mais">
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  UpdatePills() {
    try {
      for (const btn of document.getElementsByClassName("btn-pills")) {
        btn.addEventListener("click", () => {
          for (const pill of document.getElementsByClassName("btn-pills")) {
            if (pill != event.target) {
              if (pill.classList.contains("active-tab")) {
                pill.classList.remove("active-tab");
              }
              if (!pill.classList.contains("unactive-tab")) {
                pill.classList.add("unactive-tab");
              }
            }
          }

          event.target.classList.remove("unactive-tab");
          event.target.classList.add("active-tab");

          for (const tab of document.getElementsByClassName("tab-pane")) {
            if (tab.classList.contains("show")) {
              tab.classList.remove("show");
            }
            if (tab.classList.contains("active")) {
              tab.classList.remove("active");
            }
          }

          if (!document.getElementById(event.target.getAttribute("data-bs-target").split("#")[1]).classList.contains("show")) {
            document.getElementById(event.target.getAttribute("data-bs-target").split("#")[1]).classList.add("show");
          }
          if (!document.getElementById(event.target.getAttribute("data-bs-target").split("#")[1]).classList.contains("active")) {
            document.getElementById(event.target.getAttribute("data-bs-target").split("#")[1]).classList.add("active");
          }
        });
      }
    } catch {
      // Não há pills portanto n dá
    }
  }

  PreventMultipleChoice() {
    document.getElementsByClassName("b")[0].addEventListener("click", event => {
      for (const sintoma of document.getElementsByClassName("a")) {
        sintoma.disabled = document.getElementsByClassName("b")[0].checked;
      }
    });

    for (const sintoma of document.getElementsByClassName("a")) {
      sintoma.addEventListener("click", event => {
        let isAnyChecked = Array.from(document.getElementsByClassName("a")).some(sin => sin.checked == true);
        if (isAnyChecked) {
          document.getElementsByClassName("b")[0].disabled = true;
        } else {
          document.getElementsByClassName("b")[0].disabled = false;
        }
      });
    }
  }
}
