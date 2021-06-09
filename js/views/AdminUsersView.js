import UserController from '../controllers/UserController.js';
import PostoController from '../controllers/PostosController.js';
import LocaleController from '../controllers/LocaleController.js';

export default class AdminUsersView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    this.postoController = new PostoController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Página atual - todos os .html têm um id na tag body que descreve o nome da página
    this.currentPage = document.querySelector("body");

    // Se o utilizador for administrador mostrar página normalmente
    if (this.userController.isLoggedUserAnAdmin()) {
      // Verifica se a largura da window corresponde a mobile ou a desktop
      this.isDisplayMobile = (window.innerWidth >= 992) ? false : true;

      // Aplica a devida navbar (ApplyMobileNavbar ou ApplyDesktopNavbar)
      // Se o argumento "true" for enviado o método irá ignorar a resolução da window e irá aplicar a navbar de acordo com o estado da variável this.isDisplayMobile
      this.VerifyScreenResolution(true);

      // Carregar os dados dos utilizadores para a tabela
      
      // Se estivermos na página de utilizadores
      if (this.currentPage.id == "admin-entidades") {
        this.ListAllPostos();
        this.SetPostosInfo();
        this.AtualizarDadosPosto();
        this.AddNewPosto();
        
        // Adicionar as localidades presentes na localstorage ao select de localidades
        this.AddLocalesToSelect(".select-localidades");
        this.AddLocalesToSelect(".select-localidades-edit");
        this.BindViewPasswordCheckbox("view-password","posto-password-edit");
      } else if (this.currentPage.id == "admin-utilizadores") {
        this.ListAllUsers();
        this.SetProfileInfo();
        this.AtualizarDadosUser();
      }

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
    console.log("resized");
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
            this.userController.UserLogout();
            setTimeout(() => {
              location.replace("../../")
            }, 1000);
          }
        });
      });
    }
  }

  //Users
  ListAllUsers() {
    // Lista todos os utilizadores registados
    const x = this.userController.getAllNormalUsers();
    for (let i = 0; i < x.length; i++) {
      document.getElementById("tabela-users").innerHTML += `
      <tr class="align-middle text-center">
        <td scope="row"><img style="width:3rem" src="${x[i].avatar}"></td>
        <td>${x[i].id}</td>
        <td>${x[i].pnome}</td>
        <td>${x[i].unome}</td>
        <td>${x[i].email}</td>
        <td><span class="icon-remover-user"><i class="fas fa-trash"></i></span><button type="submit" data-bs-toggle="modal" data-bs-target="#admin-edit-perfil" class="aaaa" style="color:black" id="${x[i].id}"><span class="icon-remover-edit"><i class="far fa-edit"></i></span></button></td>
      </tr>`;
    }
  }

  SetProfileInfo() {
   for (const btnEdit of document.getElementsByClassName("aaaa")) {
     btnEdit.addEventListener("click", () => {
       const x = this.userController.getAllNormalUsers();
       const x1 = this.userController.getAllNormalEnderecos();
       for (let i = 0; i < x1.length; i++) {
         if(btnEdit.id==x1[i].id_utilizador){
           document.getElementById("user-morada").value = x1[i].morada;
           document.getElementById("user-cep").value = x1[i].cod_postal;
         }
         else{
           document.getElementById("user-morada").value = "";
           document.getElementById("user-cep").value = "";
         }
       }
       for (let i = 0; i < x.length; i++) {
         if(x[i].id==btnEdit.id){
           document.getElementById("nome-user-a-editar").innerHTML = x[i].pnome + " "+x[i].unome;
           document.getElementById("avatar-profile").src = x[i].avatar;
           document.getElementById("avatar-profile-edit").value = x[i].avatar;
           document.getElementById("user-id").value = x[i].id;
           document.getElementById("user-pnome").value = x[i].pnome;
           document.getElementById("user-email").value = x[i].email;
           document.getElementById("user-unome").value = x[i].unome;
           document.getElementById("user-password").value = x[i].password;
           document.getElementById("user-tlm").value = x[i].tlm;
           document.getElementById("user-pontos").innerHTML = x[i].pontos;
         }
       }
     });
   }
  }

  AtualizarDadosUser(){
   document.querySelector("#avatar-profile-edit").addEventListener("change", ()=>{
     document.getElementById("avatar-profile").src=document.getElementById("avatar-profile-edit").value
   })
   document.querySelector("#btn-update-user").addEventListener("click", () => {
     this.userController.Atualizar(
       document.getElementById("user-id").value,
       document.getElementById("avatar-profile-edit").value,
       document.getElementById("user-pnome").value,
       document.getElementById("user-unome").value,
       document.getElementById("user-email").value,
       document.getElementById("user-password").value,
       document.getElementById("user-tlm").value,
       document.getElementById("user-morada").value,
       document.getElementById("user-cep").value
       );
   });
  }
  //Postos
  ListAllPostos(){
    const x = this.userController.getAllEntityUsers();
    let a="";
    for (let i = 0; i < x.length; i++) {
      if(x[i].verificado==false){
        a="Não"
      }
      else{
        a="Sim"
      }
      document.getElementById("tabela-postos").innerHTML += `
      <tr class="align-middle text-center">
        <td>${x[i].id}</td>
        <td>${x[i].nome}</td>
        <td>${x[i].nif}</td>
        <td>${x[i].email}</td>
        <td>${a}</td>
        <td><span class="icon-naoVerificar"><i class="fas fa-times-circle"></i></span><span class="icon-verificar"><i class="fas fa-check-double"></i></span></td>
        <td><span class="icon-remover-user"><i class="fas fa-trash"></i></span><span data-bs-toggle="modal" data-bs-target="#admin-edit-postos" class="icon-remover-posto" id="${x[i].id}"><i class="far fa-edit"></i></span></td>
      </tr>`;
    }
  }

  SetPostosInfo() {
    for (const btnEdit of document.getElementsByClassName("icon-remover-posto")) {
      btnEdit.addEventListener("click", () => {
        const x = this.userController.getAllEntityUsers();
        const x1 = this.userController.getAllEntityEnderecos();
        for (let i = 0; i < x1.length; i++) {
          if(btnEdit.id==x1[i].id_entidade){
            document.getElementById("posto-morada-edit").value = x1[i].morada;
            document.getElementById("posto-cod_postal-edit").value = x1[i].cod_postal;
            $('.select-localidades-edit').val([x1[i].id_localidade]);
            $('.select-localidades-edit').trigger('change');
          }
        }
        for (let i = 0; i < x.length; i++) {
          if(x[i].id==btnEdit.id){
            document.getElementById("nome-posto-a-editar").innerHTML = ` (${x[i].nome})`;
            document.getElementById("posto-nome-edit").value = x[i].nome;
            document.getElementById("posto-email-edit").value = x[i].email;
            document.getElementById("posto-password-edit").value = x[i].password;
            document.getElementById("posto-website-edit").value = x[i].website;
            document.getElementById("posto-horario-abertura-edit").value = x[i].horario_inicio;
            document.getElementById("posto-horario-fecho-edit").value = x[i].horario_fim;
            document.getElementById("posto-tempo-consulta-edit").value = x[i].intervalo_consulta;
            document.getElementById("posto-drive-edit").checked = x[i].drive_thru;
            document.getElementById("posto-call-edit").checked = x[i].call_me;
            document.querySelector(".editar-posto").id = x[i].id;
          }
        }
      });
    }
    
  }

  AtualizarDadosPosto(){
    document.querySelector("#posto-form-edit").addEventListener("submit", () => {
      this.postoController.EditPosto(
        document.querySelector(".editar-posto").id,
        document.getElementById("posto-nome-edit").value,
        document.getElementById("posto-email-edit").value,
        document.getElementById("posto-password-edit").value,
        document.getElementById("posto-website-edit").value,
        document.getElementById("posto-horario-abertura-edit").value,
        document.getElementById("posto-horario-fecho-edit").value,
        document.getElementById("posto-tempo-consulta-edit").value,
        document.getElementById("posto-morada-edit").value,
        document.getElementById("posto-cod_postal-edit").value,
        document.getElementById("posto-drive-edit").checked,
        document.getElementById("posto-call-edit").checked
        );
    });
   }

  AddLocalesToSelect(target) {
    const localidades = this.localeController.GetAllLocales();
    const select = document.querySelector(target);
    for (const localidade of localidades) {
      select.innerHTML += `<option value="${localidade['id']}">${localidade['nome']}</option>`;
    }
  }
  
  AddNewPosto(){
    document.querySelector("#posto-form-criar").addEventListener("submit", () => {  
      this.BindViewPasswordCheckbox("view-password-criar", "posto-password-criar");
      if ( $('.select-localidades').find(':selected').val() != $('.select-localidades').find('option').first().val()) {
        console.log($('.select-localidades').find(':selected').val())
      this.postoController.AddTest(
        document.getElementById("posto-nome-criar").value,
        document.getElementById("posto-nif-criar").value,
        document.getElementById("posto-email-criar").value,
        document.getElementById("posto-password-criar").value,
        document.getElementById("posto-website-criar").value,
        document.getElementById("posto-horario-abertura-criar").value,
        document.getElementById("posto-horario-fecho-criar").value,
        document.getElementById("posto-tempo-consulta-criar").value,
        document.getElementById("posto-morada-criar").value,
        document.getElementById("posto-cod_postal-criar").value,
        $('.select-localidades').find(':selected').val(),
        document.getElementById("posto-drive-criar").checked,
        document.getElementById("posto-call-criar").checked
        )
      }
    });
  }
  
  //Ver palavra-passe
  BindViewPasswordCheckbox(checkbox, target) {
    // Ativa a checbox de "ver password" dos formulários do login e do registo
    document.getElementById(checkbox).addEventListener("click", () => {
      if (document.getElementById(checkbox).checked == true) {
        document.getElementById(target).setAttribute("type", "text");
      } else {
        document.getElementById(target).setAttribute("type", "password");
      }
    });
  }
}
