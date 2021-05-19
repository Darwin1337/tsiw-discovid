let isDisplayMobile = false;
let imgPath = "..\\"

$(document).ready(function() {
  if ($("body").attr("id") == "index") {
    imgPath = "";
  }

  if (CheckResolution()) {
    isDisplayMobile = true;
    ApplyMobileNavbar();
  } else {
    ApplyDesktopNavbar();
  }
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
      <a class="navbar-brand d-flex w-50 me-auto">
        <img id="navbar-logo" src="${imgPath}img\\logo.svg" class="d-inline-block align-top" onclick="window.location.href = '..\';" alt="Logótipo Discovid">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse w-100" id="collapsingNavbar">
          <ul class="main-nav navbar-nav w-100 justify-content-center">
              <li id="postos" class="nav-item">
                  <a class="nav-link" href="../html/postos"><i class="fas fa-map-marker"></i>  Postos</a>
              </li>
              <li id="loja" class="nav-item">
                  <a class="nav-link" href="../html/loja"><i class="fas fa-shopping-cart"></i>  Loja</a>
              </li>
              <li id="covid" class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-syringe"></i>  COVID-19</a>
                  <ul class="covid-drop dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
                      <li id="sintomas"><a class="dropdown-item" href="../html/sintomas"><i class="fas fa-exclamation-circle"></i>  Sintomas</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li id="tracking"><a class="dropdown-item" href="../html/tracking"><i class="fas fa-chart-line"></i>  Tracking</a></li>
                  </ul>
              </li>
              <li id="testes" class="nav-item">
                  <a class="nav-link" href="../html/testes"><i class="fas fa-info"></i>  Testes</a>
              </li>
          </ul>
          <ul class="nav navbar-nav ms-auto w-50 justify-content-end">
              <li class="nav-item dropdown user">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="${imgPath}img\\user-icon.svg" width="30" height="30" class="d-inline-block align-top" style="margin-right: 5px;">Diogo
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
                      <li><a class="dropdown-item" href="#">Terminar sessão</a></li>
                  </ul>
              </li>
          </ul>
      </div>
    </div>
  </nav>`);
  UpdateDesktopActiveLink();
}

function ApplyMobileNavbar() {
  $(".nav-area").html(`
    <nav class="navbar navbar-expand-lg">
      <div class="mobile container">
        <button id="nav-toggler" onclick="ChangeIcon();" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand">
          <img id="navbar-logo" src="${imgPath}img\\logo-mobile.svg" class="d-inline-block align-top" onclick="window.location.href = '..\';" alt="Logótipo Discovid">
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
                <div class="logged-user-info">
                  <img src="${imgPath}img\\user-icon.svg" width="60" height="60">
                  <li class="nav-item logged-user"><a>BEM-VINDO, DIOGO</a></li>
                </div>
                <li class="nav-item"><a class="nav-link" href="../html/editar-perfil" id="editar-perfil-redirect">EDITAR PERFIL</a></li>
                <li class="nav-item"><a class="nav-link" href="../html/editar-perfil">AS MINHAS MARCAÇÕES</a></li>
                <li class="nav-item"><a class="nav-link" href="../html/editar-perfil">AS MINHAS ENCOMENDAS</a></li>
                <li class="nav-item"><a class="nav-link" href="../html/editar-perfil">NOTIFICAÇÕES</a></li>
                <li class="nav-item"><a class="nav-link">TERMINAR SESSÃO</a></li>
            </ul>
        </div>
      </div>
    </nav>`);
    UpdateMobileActiveLink();
}

function UpdateDesktopActiveLink() {
  $('.main-nav li').each(function(i){
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
  $('.main-nav li').each(function(i){
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

// Mudar a cor das pills ao clicar e corrige o erro das pills deixarem de funcionar

$(".btn-pills").click(function(event) {
  for (let i = 0; i < $(".btn-pills").length; i++) {
    if ($(".btn-pills")[i] != event.target) {
      if ($(".btn-pills")[i].classList.contains("active-tab")) {
        $(".btn-pills")[i].classList.remove("active-tab");
      }
      if (!$(".btn-pills")[i].classList.contains("unactive-tab")) {
        $(".btn-pills")[i].classList.add("unactive-tab");
      }
    }
  }
  event.target.classList.remove("unactive-tab");
  event.target.classList.add("active-tab");
  for (tab of $(".tab-pane")) {
    if (tab.classList.contains("show")) {
      tab.classList.remove("show");
    }
    if (tab.classList.contains("active")) {
      tab.classList.remove("active");
    }
  }
  if (!$($(this).attr("data-bs-target")).hasClass("show")) {
    $($(this).attr("data-bs-target")).addClass("show");
  }
  if (!$($(this).attr("data-bs-target")).hasClass("active")) {
    $($(this).attr("data-bs-target")).addClass("active");
  }
});

function updateRange(a, b) {
  if (a == "currentMinPriceValue") {
    $("#" + a).html("<b>" + parseFloat(b).toFixed(2) + "€" + "</b>");
    $("#preco_max").attr("min", parseFloat(b).toFixed(2));
    let sthg = ((parseFloat(200) + parseFloat(parseFloat(b).toFixed(2))));
    if (String(sthg).indexOf(".") > -1) {
      sthg = parseInt(String(sthg).split(".")[0]);
    }
    $("#preco_max").attr("value", sthg/2);
    $("#preco_max").val(sthg/2);
    $("#maxMinPrice").html(parseFloat(b).toFixed(2) + "€");
    $("#currentMaxPriceValue").html("<b>" + parseFloat(sthg/2).toFixed(2) + "€</b>");
  } else if (a == "currentDistanceValue") {
    $("#" + a).html("<b>" + b + "km" + "</b>");
  } else if (a == "currentMaxPriceValue") {
    $("#" + a).html("<b>" + parseFloat(b).toFixed(2) + "€</b>");
  }

}
