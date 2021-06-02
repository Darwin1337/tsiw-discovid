import NavbarController from '../controllers/NavbarController.js';
import UserController from '../controllers/UserController.js';
import NavbarInstance from '../app.js';

export default class NavbarView {
  constructor() {
    this.isDisplayMobile = false;
    this.imgPath = "..\\"
    this.navbarController = new NavbarController();
    this.userController = new UserController();

    if ($("body").attr("id") == "index") {
      this.imgPath = "";
    }

    if (this.CheckResolution()) {
      this.isDisplayMobile = true;
      this.ApplyMobileNavbar();
      if ($("body").attr("id") == "testes") {
        this.ApplyMobileCarousel();
      }
    } else {
      this.ApplyDesktopNavbar();
      if ($("body").attr("id") == "testes") {
        this.ApplyDesktopCarousel();
      }
    }
  }

  CheckResolution() {
    if (window.innerWidth < 992) {
      if (!this.isDisplayMobile) {
        this.ApplyMobileNavbar();
        if ($("body").attr("id") == "testes") {
          this.ApplyMobileCarousel();
        }
        $("#navbar-logo").attr("src", this.imgPath + "img\\logo-mobile.svg");
      }
      return true;
    } else {
      if (this.isDisplayMobile) {
        this.ApplyDesktopNavbar();
        if ($("body").attr("id") == "testes") {
          this.ApplyDesktopCarousel();
        }
        $("#navbar-logo").attr("src", this.imgPath + "img\\logo.svg");
      }
    }
    return false;
  }

  ApplyDesktopNavbar() {
    let RenderAuthentication = null;

    if (this.userController.isAnyUserLoggedIn()) {
      RenderAuthentication = `
      <li class="nav-item dropdown user">
          <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="${this.imgPath}img\\user-icon.svg" width="30" height="30" class="d-inline-block align-top" style="margin-right: 5px;"><span id="loggedUserName"><b>${this.userController.getLoggedInUsername().pnome}</b></span>
          </a>
          <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
              <li><a class="dropdown-item" href="../html/editar-perfil" id="editar-perfil-redirect">Editar perfil</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="../html/editar-perfil">As minhas marcações</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="../html/editar-perfil">As minhas encomendas</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="../html/editar-perfil">Notificações</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" id="logout-button">Terminar sessão</a></li>
          </ul>
      </li>`
    } else {
      RenderAuthentication = `
        <li id="autenticacao" class="nav-item">
          <a class="nav-link" href="../html/autenticacao"><i class="fas fa-sign-in-alt"></i>  Autenticação</a>
        </li>`
    }

    $(".nav-area").html(
      `<nav class="navbar navbar-expand-lg justify-content-center">
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
                      <a class="nav-link" href="../html/postos"><i class="fas fa-map-marker-alt"></i>  Postos</a>
                  </li>
                  <li id="loja" class="nav-item">
                      <a class="nav-link" href="../html/loja"><i class="fas fa-shopping-cart"></i>  Loja</a>
                  </li>
                  <li id="covid" class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-syringe"></i>  COVID-19</a>
                      <ul class="covid-drop dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
                          <li id="sintomas"><a class="dropdown-item" href="../html/sintomas"><i class="fas fa-head-side-cough"></i>  Sintomas</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li id="tracking"><a class="dropdown-item" href="../html/tracking"><i class="fas fa-analytics"></i>  Tracking</a></li>
                      </ul>
                  </li>
                  <li id="testes" class="nav-item">
                      <a class="nav-link" href="../html/testes"><i class="fas fa-info-circle"></i>  Testes</a>
                  </li>
              </ul>
              <ul class="nav navbar-nav ms-auto w-50 justify-content-end">
                ${RenderAuthentication}
              </ul>
          </div>
        </div>
      </nav>`);

    if (this.userController.isAnyUserLoggedIn()) {
      document.getElementById("logout-button").addEventListener("click", () => {
        Swal.fire({
          title: 'Tem a certeza que quer terminar sessão?',
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Sessão terminada com sucesso!', '', 'success')
            this.userController.logout();
            setTimeout(() => { location.replace("../../") }, 1000);
          }
        });
      });
    }

    UpdateDesktopActiveLink();
  }

  ApplyMobileNavbar() {
    let RenderAuthentication = null;
    if (this.userController.isAnyUserLoggedIn()) {
      RenderAuthentication = `
        <div class="logged-user-info">
          <img src="${this.imgPath}img\\user-icon.svg" width="60" height="60">
            <li class="nav-item logged-user"><a>BEM-VINDO, <span class="text-uppercase"><b>${this.userController.getLoggedInUsername().pnome}</b></span></a></li>
        </div>
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil" id="editar-perfil-redirect">EDITAR PERFIL</a></li>
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil">AS MINHAS MARCAÇÕES</a></li>
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil">AS MINHAS ENCOMENDAS</a></li>
        <li class="nav-item"><a class="nav-link" href="../html/editar-perfil">NOTIFICAÇÕES</a></li>
        <li class="nav-item"><a class="nav-link" id="logout-button">TERMINAR SESSÃO</a></li>`
    } else {
      RenderAuthentication = `
        <li id="autenticacao" class="nav-item"><a class="nav-link" href="../html/autenticacao">AUTENTICAÇÃO</a></li>`
    }

    $(".nav-area").html(`
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
                    <li id="postos" class="nav-item active"><a class="nav-link" href="../html/postos"><i class="fas fa-chevron-right"></i>  POSTOS</a></li>
                    <li id="loja" class="nav-item"><a class="nav-link" href="../html/loja">LOJA</a></li>
                    <li id="sintomas" class="nav-item"><a class="nav-link" href="../html/sintomas">SINTOMAS</a></li>
                    <li id="tracking" class="nav-item"><a class="nav-link" href="../html/tracking">TRACKING</a></li>
                    <li id="testes" class="nav-item"><a class="nav-link" href="../html/testes">INFO. TESTES</a></li>
                    <li><hr class="dropdown-divider"></li>
                    ${RenderAuthentication}
                </ul>
            </div>
          </div>
        </nav>`);

    document.getElementById("nav-toggler").addEventListener("click", () => {
      // "this" não acessível dentro da classe por causa do JQuery (visto que é um event listener)
      // portanto o evento tem de ser feito em JavaScript ou a instância da Navbar (NavbarInstance) tem que ser usada
      if (!$("#nav-toggler").hasClass("collapsed")) {
        $("#navbar-logo").attr("src", this.imgPath + "img\\menu-logo-mobile.svg");
        $("#navbar-logo").css("margin-right", "0px");
        $("#navbar-logo").css("margin-top", "0px");
      } else {
        $("#navbar-logo").attr("src", this.imgPath + "img\\logo-mobile.svg");
        $("#navbar-logo").css("margin-right", "22px");
        $("#navbar-logo").css("margin-top", "4px");
      }
    });

    if (this.userController.isAnyUserLoggedIn()) {
      document.getElementById("logout-button").addEventListener("click", () => {
        Swal.fire({
          title: 'Tem a certeza que quer terminar sessão?',
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Sessão terminada com sucesso!', '', 'success')
            this.userController.logout();
            setTimeout(() => { location.replace("../../") }, 1000);
          }
        });
      });
    }

    UpdateMobileActiveLink();
  }

  ApplyMobileCarousel() {
    $(".cards-testes").html(`<div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
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
    </div>`)
  }

  ApplyDesktopCarousel() {
    $(".cards-testes").html(`<div class="cards-testes">
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
    </div>`)
  }
}

$(window).resize(function() {
  if (!NavbarInstance.isDisplayMobile && NavbarInstance.CheckResolution()) {
    NavbarInstance.isDisplayMobile = true;
  } else if (NavbarInstance.isDisplayMobile && !NavbarInstance.CheckResolution()) {
    NavbarInstance.isDisplayMobile = false;
  }
});

function UpdateDesktopActiveLink() {
  $('.main-nav li').each(function(i) {
    if ($(this).attr("id") != undefined) {
      if ($("body").attr("id") == $(this).attr("id")) {
        if (!$(this).hasClass("active")) {
          $(this).addClass("active");
        }
        if ($("body").attr("id") == "sintomas" || $("body").attr("id") == "tracking") {
          if (!$(this).parent().parent().hasClass("active")) {
            $(this).parent().parent().addClass("active");
          }
        }
      } else {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
        }
      }
    }
  });
}

function UpdateMobileActiveLink() {
  $('.main-nav li').each(function(i) {
    if ($(this).attr("id") != undefined) {
      if ($("body").attr("id") == $(this).attr("id")) {

        if (!$(this).hasClass("active")) {
          $(this).addClass("active");
        }

        if ($(this).children().html().indexOf('<i class="fas fa-chevron-right"></i>') == -1) {
          let savedText = $(this).children().html();
          $(this).children().html(`<i class="fas fa-chevron-right"></i>  ${savedText}`);
        }

      } else {
        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
        }
        if ($(this).children().html().indexOf('<i class="fas fa-chevron-right"></i>') > -1) {
          $(this).children().html($(this).children().html().split('<i class="fas fa-chevron-right"></i>')[1].trim());
        }
      }
    }
  });
}
