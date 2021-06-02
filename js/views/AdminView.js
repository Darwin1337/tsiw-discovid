import UserController from '../controllers/UserController.js';

export default class AdminView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Página atual - todos os .html têm um id na tag body que descreve o nome da página
    this.currentPage = document.querySelector("body");

    // Se o utilizador for administrador mostrar página normalmente
    if (this.userController.isLoggedUserAnAdmin()) {
      // Verifica se a largura da window corresponde a mobile ou a desktop
      this.isDisplayMobile = (window.innerWidth >= 992) ? false : true;

      // Aplica a devida navbar (ApplyMobileNavbar ou ApplyDesktopNavbar)
      // Se o argumento "true" for enviado o método irá ignorar a resolução da window e irá aplicar a navbar de acordo com o estado da variável this.isDisplayMobile
      this.VerifyScreenResolution(true);

      // Verifica mudanças na resolução e aplica a devida navbar (ApplyMobileNavbar ou ApplyDesktopNavbar)
      window.addEventListener('resize', this.VerifyScreenResolution.bind(this));
    } else if (!this.userController.isLoggedUserAnAdmin() || this.userController.isLoggedUserAnAdmin() == null) {
      // Se não for administrador mostrar uma mensagem de erro
      this.currentPage.innerHTML = `
        <div class="container text-center d-flex justify-content-center flex-column" style="min-height: 100vh;">
          <div style="font-size: 3rem;">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h1>A página requisitada não está disponível</h1>
          <div>
            <button class="btn btn-laranja">Página Inicial</button>
          </div>
        </div>`;

      document.querySelector("button").addEventListener('click', event => {
        window.location.replace("..\\..\\");
      });
    }
  }

  VerifyScreenResolution(ignore) {
    // Verifica se a largura da window corresponde a mobile ou a desktop e aplica as devidas funções
    // Se o argumento "true" for enviado o método irá ignorar a resolução da window e irá aplicar a navbar de acordo com o estado da variável this.isDisplayMobile
    ignore = (ignore == true) ? true : false;
    if ((!ignore && window.innerWidth < 992 && !this.isDisplayMobile) || (ignore && this.isDisplayMobile)) {
      this.isDisplayMobile = true;
      this.ApplyMobileNavbar();
    } else if ((!ignore && window.innerWidth >= 992 && this.isDisplayMobile) || (ignore && !this.isDisplayMobile)) {
      this.isDisplayMobile = false;
      this.ApplyDesktopNavbar();
    }
  }

  ApplyDesktopNavbar() {
    // Injeta o código da navbar
    document.getElementsByClassName("nav-area")[0].innerHTML = `
      <nav class="navbar navbar-expand-lg justify-content-center">
        <div class="container">
          <a class="navbar-brand d-flex w-50 me-auto">
            <img id="navbar-logo" src="..\\img\\logo_admin.svg" class="d-inline-block align-top" onclick="window.location.href = '..\';" alt="Logótipo Discovid">
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="navbar-collapse collapse w-100" id="collapsingNavbar">
              <ul class="main-nav navbar-nav w-100 justify-content-center">
                  <li id="admin-postos" class="nav-item">
                      <a class="nav-link" href="admin-entidades.html"><i class="fas fa-building"></i>  Postos</a>
                  </li>
                  <li id="admin-produtos" class="nav-item">
                      <a class="nav-link" href="admin-produtos.html"><i class="fas fa-shopping-cart"></i>  Produtos</a>
                  </li>
                  <li id="admin-utilizadores" class="nav-item">
                      <a class="nav-link" href="admin-utilizadores.html"><i class="fas fa-users-cog"></i>  Utilizadores</a>
                  </li>
                  <li id="admin-geral" class="nav-item">
                      <a class="nav-link" href="admin-gamificacoes.html"><i class="fas fa-treasure-chest"></i>  Geral</a>
                  </li>
              </ul>
              <ul class="nav navbar-nav ms-auto w-50 justify-content-end">
                  <li class="nav-item dropdown user">
                      <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="..\\img\\user-icon.svg" width="30" height="30" class="d-inline-block align-top me-1">
                        <span><b>${this.userController.getLoggedInUserData().pnome.charAt(0).toUpperCase() + this.userController.getLoggedInUserData().pnome.slice(1)}</b></span>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarScrollingDropdown">
                          <li><a class="dropdown-item" href="..\\..\\">Sair de admin</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item" id="logout-button">Terminar sessão</a></li>
                      </ul>
                  </li>
              </ul>
          </div>
        </div>
      </nav>`;

    // Acionar event listener do botão de logout
    this.BindLogoutButton();

    // Atualizar o link ativo da navbar de desktop
    this.UpdateDesktopActiveLink()
  }

  ApplyMobileNavbar() {
    // Injeta o código da navbar
    document.getElementsByClassName("nav-area")[0].innerHTML = `
      <nav class="navbar navbar-expand-lg">
        <div class="mobile container">
          <button id="nav-toggler" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsingNavbar">
              <span class="navbar-toggler-icon"></span>
          </button>
          <a class="navbar-brand">
            <img id="navbar-logo" src="..\\img\\logo-mobile.svg" class="d-inline-block align-top" onclick="window.location.href = '..\';" alt="Logótipo Discovid">
          </a>
          <div class="navbar-collapse collapse w-100" id="collapsingNavbar">
              <ul class="main-nav navbar-nav w-100 justify-content-start">
                  <li><hr class="dropdown-divider"></li>
                  <li id="admin-postos" class="nav-item active"><a class="nav-link" href="../html/admin-entidades.html"><i class="fas fa-chevron-right"></i>  POSTOS</a></li>
                  <li id="admin-produtos" class="nav-item"><a class="nav-link" href="../html/admin-produtos.html">PRODUTOS</a></li>
                  <li id="admin-utilizadores" class="nav-item"><a class="nav-link" href="../html/admin-utilizadores.html">UTILIZADORES</a></li>
                  <li id="admin-geral" class="nav-item"><a class="nav-link" href="../html/admin-gamificacoes.html">GERAL</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <div class="logged-user-info">
                    <img src="..\\img\\user-icon.svg" width="60" height="60">
                      <li class="nav-item logged-user"><a>BEM-VINDO, <span class="text-uppercase"><b>${this.userController.getLoggedInUserData().pnome}</b></span></a></li>
                  </div>
                  <li id="testes" class="nav-item"><a class="nav-link" href="..\\..\\">SAIR DE ADMIN</a></li>
                  <li id="testes" class="nav-item"><a class="nav-link" id="logout-button">TERMINAR SESSÃO</a></li>
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
        navLogo.setAttribute("src", "..\\img\\menu-logo-mobile.svg");
        navLogo.style.marginRight = "0px";
        navLogo.style.marginTop = "0px";
      } else {
        navLogo.setAttribute("src", "..\\img\\logo-mobile.svg");
        navLogo.style.marginRight = "0px";
        navLogo.style.marginTop = "0px";
      }
    });

    // Atualizar o link ativo da navbar de mobile
    this.UpdateMobileActiveLink()
  }

  UpdateDesktopActiveLink() {
    const lis = document.querySelectorAll(".main-nav li");

    // Verifica todos os itens da navbar e vê qual corresponde à pág. atual através do id do body
    for (const li of lis) {
      if (li.id) {
        if (li.id == this.currentPage.id) {
          if (!li.classList.contains("active")) {
            li.classList.add("active");
          }
        } else {
          if (li.classList.contains("active")) {
            li.classList.remove("active");
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
            this.userController.logout();
            setTimeout(() => { location.replace("../../") }, 1000);
          }
        });
      });
    }
  }
}
