let isDisplayMobile = false;
let imgPath = "..\\"

$(document).ready(function() {
    if (CheckResolution()) {
      isDisplayMobile = true;
      ApplyMobileNavbar();
      UpdateActiveLink();
    } else {
      ApplyDesktopNavbar();
    }
    if ($("body").attr("id") == "index") { imgPath = "" }
});

$(window).resize(function() {
  if (!isDisplayMobile && CheckResolution()) {
    isDisplayMobile = true;
  } else if (isDisplayMobile && !CheckResolution()) {
    isDisplayMobile = false;
  }
});

function ChangeIcon() {
  if (!$("#nav-toggler").hasClass("collapsed")) {
    $("#navbar-logo").attr("src", imgPath + "img\\menu-logo-mobile.svg");
    $("#navbar-logo").css("margin-right", "0px");
    $("#navbar-logo").css("margin-top", "0px");
  } else {
    $("#navbar-logo").attr("src", imgPath + "img\\logo-mobile.svg");
    $("#navbar-logo").css("margin-right", "22px");
    $("#navbar-logo").css("margin-top", "4px");
  }
}

function CheckResolution() {
  if ($(window).width() < 992) {
    if (!isDisplayMobile) {
      ApplyMobileNavbar();
      $("#navbar-logo").attr("src", imgPath + "img\\logo-mobile.svg");
    }
    return true;
  } else {
    if (isDisplayMobile) {
      ApplyDesktopNavbar();
      $("#navbar-logo").attr("src", imgPath + "img\\logo.svg");
    }
  }
  return false;
}

function ApplyDesktopNavbar() {
  $(".nav-area").html(
    `<nav class="navbar navbar-expand-lg justify-content-center">
    <div class="container">
      <a href="/" class="navbar-brand d-flex w-50 me-auto">
        <img id="navbar-logo" src="${imgPath}img\\logo.svg" class="d-inline-block align-top" alt="Logótipo Discovid">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse w-100" id="collapsingNavbar">
          <ul class="navbar-nav w-100 justify-content-center">
              <li class="nav-item active">
                  <a class="nav-link" href="#"><i class="fas fa-map-marker"></i>  Postos</a>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="#"><i class="fas fa-shopping-cart"></i>  Loja</a>
              </li>
              <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-syringe"></i>  COVID-19</a>
                  <ul class="covid-drop dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
                      <li><a class="dropdown-item" href="#"><i class="fas fa-exclamation-circle"></i>  Sintomas</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#"><i class="fas fa-chart-line"></i>  Tracking</a></li>
                  </ul>
              </li>
              <li class="nav-item">
                  <a class="nav-link" href="#"><i class="fas fa-info"></i>  Testes</a>
              </li>
          </ul>
          <ul class="nav navbar-nav ms-auto w-50 justify-content-end">
              <li class="nav-item dropdown user">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="${imgPath}img\\user-icon.svg" width="30" height="30" class="d-inline-block align-top" alt="">&nbsp;&nbsp;Diogo
                  </a>
                  <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
                      <li><a class="dropdown-item" href="#">Editar perfil</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">As minhas marcações</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">As minhas encomendas</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">Notificações</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">Terminar sessão</a></li>
                  </ul>
              </li>
          </ul>
      </div>
    </div>
  </nav>`);
}

function ApplyMobileNavbar() {
  $(".nav-area").html(`
    <nav class="navbar navbar-expand-lg">
      <div class="mobile container">
        <button id="nav-toggler" onclick="ChangeIcon();" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a href="/" class="navbar-brand">
          <img id="navbar-logo" src="${imgPath}img\\logo-mobile.svg" class="d-inline-block align-top" alt="Logótipo Discovid">
        </a>
        <div class="navbar-collapse collapse w-100" id="collapsingNavbar">
            <ul class="navbar-nav w-100 justify-content-start">
                <li><hr class="dropdown-divider"></li>
                <li class="nav-item active"><a class="nav-link" href="#"><i class="fas fa-chevron-right"></i>  POSTOS</a></li>
                <li class="nav-item"><a class="nav-link" href="#">LOJA</a></li>
                <li class="nav-item"><a class="nav-link" href="#">SINTOMAS</a></li>
                <li class="nav-item"><a class="nav-link" href="#">TRACKING</a></li>
                <li class="nav-item"><a class="nav-link" href="#">INFO. TESTES</a></li>
                <li><hr class="dropdown-divider"></li>
                <div class="logged-user-info">
                  <img src="${imgPath}img\\user-icon.svg" width="60" height="60">
                  <li class="nav-item logged-user"><a>BEM-VINDO, DIOGO</a></li>
                </div>
                <li class="nav-item"><a class="nav-link" href="#">EDITAR PERFIL</a></li>
                <li class="nav-item"><a class="nav-link" href="#">AS MINHAS MARCAÇÕES</a></li>
                <li class="nav-item"><a class="nav-link" href="#">AS MINHAS ENCOMENDAS</a></li>
                <li class="nav-item"><a class="nav-link" href="#">NOTIFICAÇÕES</a></li>
                <li class="nav-item"><a class="nav-link" href="#">TERMINAR SESSÃO</a></li>
            </ul>
        </div>
      </div>
    </nav>`);
}

function UpdateActiveLink() {
  // Complete this
}
