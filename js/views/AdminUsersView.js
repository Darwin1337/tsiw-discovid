import UserController from '../controllers/UserController.js';
import LocaleController from '../controllers/LocaleController.js';
import TestsController from '../controllers/TestsController.js';

export default class AdminUsersView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.testsController = new TestsController();

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
        // Listar as entidades na tabela
        this.ListAllPostos();
        // Adicionar as localidades presentes na localstorage ao select de localidades
        this.AddLocalesToSelect(".select-localidades");
        this.AddLocalesToSelect(".select-localidades-edit");
        // Adicionar os tipos de teste da localstorage ao select
        this.AddTestsToSelect(".select-testes");
        this.AddTestsToSelect(".select-testes-nova-entidade");
        // Colocar as informações nos inputs
        this.SetPostosInfo();
        // Event listener para o botão de editar informações
        this.AtualizarDadosPosto();
        // Event listener para o botão de adicionar posto
        this.AddNewPosto();
        // Array que vai ficar com os testes adicionados caso seja instanciada uma entidade
        this.availableTests = [];
        // Event listener para o botão de adicionar testes no forumlário de adicionar postos
        this.PostosAdd_AddTest();
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
                  <li id="admin-entidades" class="nav-item">
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
                  <li id="admin-entidades" class="nav-item active"><a class="nav-link" href="../html/admin-entidades.html"><i class="fas fa-chevron-right"></i>  POSTOS</a></li>
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
          if (btnEdit.id == x1[i].id_utilizador) {
            document.getElementById("user-morada").value = x1[i].morada;
            document.getElementById("user-cep").value = x1[i].cod_postal;
          } else {
            document.getElementById("user-morada").value = "";
            document.getElementById("user-cep").value = "";
          }
        }
        for (let i = 0; i < x.length; i++) {
          if (x[i].id == btnEdit.id) {
            document.getElementById("nome-user-a-editar").innerHTML = x[i].pnome + " " + x[i].unome;
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

  AtualizarDadosUser() {
    document.querySelector("#avatar-profile-edit").addEventListener("change", () => {
      document.getElementById("avatar-profile").src = document.getElementById("avatar-profile-edit").value
    })
    document.querySelector("#btn-update-user").addEventListener("click", () => {
      //EDITAR ISTO
      //EDITAR ISTO
      //EDITAR ISTO
      //EDITAR ISTO
      //EDITAR ISTO
      //EDITAR ISTO
      this.userController.EntityUser_Edit(
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
  ListAllPostos() {
    const user = this.userController.getAllEntityUsers();

    for (let i = 0; i < user.length; i++) {
      let isVerified = !user[i].verificado ? "Não" : "Sim";
      let getNif = !user[i].registado ? "Indisponível" : user[i].nif;
      let isBlocked = !user[i].bloqueado ? `<button class="btn-table btn-ban" style="color: red;" id="${user[i].id}"><i class="fas fa-ban"></i></button>` : `<button class="btn-table btn-unban" style="color: red;" id="${user[i].id}"><i class="fas fa-unlock"></i></button>`;
      document.getElementById("tabela-postos").innerHTML += `
        <tr class="align-middle text-center">
          <td>${user[i].id}</td>
          <td>${user[i].nome}</td>
          <td>${getNif}</td>
          <td>${user[i].email}</td>
          <td>${isVerified}</td>
          <td>
            <button class="btn-table btn-unverificar" style="color: red;" id="${user[i].id}"><i class="fas fa-times-circle"></i></button>
            <button class="btn-table btn-verificar" style="color: green;" id="${user[i].id}"><i class="fas fa-check-circle"></i></i></button>
          </td>
          <td>
            ${isBlocked}
            <button class="btn-table btn-edit" style="color: darkblue;" id="${user[i].id}" data-bs-toggle="modal" data-bs-target="#admin-edit-postos"><i class="fas fa-edit"></i></button>
          </td>
        </tr>`;
      // Event listener para as ações
      this.VerificarPosto();
      this.RemoverVerificacaoPosto();
      this.BloquearPosto();
      this.AtivarPosto();
    }
  }

  SetPostosInfo() {
    for (const btnEdit of document.getElementsByClassName("btn-edit")) {
      btnEdit.addEventListener("click", () => {
        const userInfo = this.userController.entityUsers.find(user => parseInt(user.id) == parseInt(btnEdit.id));

        for (let i = 0; i < this.userController.endEntidade.length; i++) {
          if (userInfo.id == this.userController.endEntidade[i].id_entidade) {
            document.getElementById("posto-morada").value = this.userController.endEntidade[i].morada;
            document.getElementById("posto-cod_postal").value = this.userController.endEntidade[i].cod_postal;
            $('.select-localidades-edit').val(this.userController.endEntidade[i].id_localidade);
            $('.select-localidades-edit').trigger('change');
            break;
          }
        }

        const getNif = !userInfo.registado ? "Indisponível" : userInfo.nif;
        document.getElementById("id-posto").innerHTML = userInfo.id;
        document.getElementById("posto-nome").value = userInfo.nome;
        document.getElementById("posto-email").value = userInfo.email;
        document.getElementById("posto-nif").innerHTML = getNif;
        document.getElementById("posto-password").value = userInfo.password;
        document.getElementById("posto-website").value = userInfo.website;
        document.getElementById("posto-horario-abertura").value = userInfo.horario_inicio;
        document.getElementById("posto-horario-fecho").value = userInfo.horario_fim;
        document.getElementById("posto-tempo-consulta").value = userInfo.intervalo_consulta;
        document.getElementById("posto-drive").checked = userInfo.drive_thru;
        document.getElementById("posto-call").checked = userInfo.call_me;
        document.getElementById("testes-conteudo").innerHTML = "";

        for (let i = 0; i < this.userController.testesEntidade.length; i++) {
          if (userInfo.id == this.userController.testesEntidade[i].id_entidade) {
            document.getElementById("testes-conteudo").innerHTML += `
            <div style="background-color: var(--cinza-claro);" class="d-flex mt-3 mb-4 card-morada align-items-center" id="card-${i}">
              <p class="m-0 p-0 etiqueta-${i}">${this.testsController.GetNameById(parseInt(this.userController.testesEntidade[i].id_teste)).nome_teste} | ${this.userController.testesEntidade[i].preco}€</p>
              <div class="ms-auto">
                <button type="button" class="m-remove" id="${i}"><i class="fas fa-trash morada-remove"></i></button>
              </div>
            </div>`;
          }
        }
        document.getElementById("testes-conteudo").innerHTML += `
          <div class="mb-3">
            <button type="button" id="add-teste" class="btn btn-azul-pri" data-bs-toggle="modal" data-bs-target="#add-teste-modal">Adicionar teste</button>
          </div>`;
        // Event listener para o botão de adicionar/remover teste
        this.PostosEdit_AddTest();
        this.PostosEdit_RemoveTest();
      });
    }
  }

  AtualizarDadosPosto() {
    document.querySelector("#posto-form-edit").addEventListener("submit", event => {
      event.preventDefault();
      if ($('.select-localidades-edit').find(':selected').val() != $('.select-localidades-edit').find('option').first().val()) {
        // Obter a latitude e longitude da nova morada
        $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + document.getElementById("posto-morada").value.trim().split(" ").join("+").replace(",", "") + "+" + document.getElementById("posto-cod_postal").value.trim().split(" ").join("+") + '+' + this.localeController.GetNameById(parseInt($('.select-localidades-edit').find(':selected').val())).nome.trim().split(" ").join("+") + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
          let lng = null;
          let lat = null;
          if (data.status == "OK") {
            lng = data.results[0].geometry.location.lng;
            lat = data.results[0].geometry.location.lat;
          }
          // Como estamos num método async não temos acesso à instância da classe UserController portanto terá de ser instanciada uma para esse propósito
          const specificUserController = new UserController();
          try {
            specificUserController.EntityUser_Edit(
              parseInt(document.getElementById("id-posto").innerHTML),
              document.getElementById("posto-nome").value,
              document.getElementById("posto-email").value,
              document.getElementById("posto-password").value,
              document.getElementById("posto-website").value,
              document.getElementById("posto-horario-abertura").value,
              document.getElementById("posto-horario-fecho").value,
              document.getElementById("posto-tempo-consulta").value,
              document.getElementById("posto-drive").checked,
              document.getElementById("posto-call").checked,
              document.getElementById("posto-morada").value,
              document.getElementById("posto-cod_postal").value,
              $('.select-localidades-edit').find(':selected').val(),
              lat,
              lng);
            Swal.fire('Sucesso!', "Os dados foram editados com sucesso!", 'success');
            setTimeout(function(){ window.location.reload(); }, 1500);
          } catch (e) {
            Swal.fire('Erro!', String(e).substring(7), 'error');
          }
        });
      } else {
        Swal.fire('Erro!', "Escolha uma morada válida!", 'error');
      }
    });
  }

  AddNewPosto() {
    document.querySelector("#posto-form-criar").addEventListener("submit", event => {
      event.preventDefault();
      try {
        // Verificar se há pelo menos 1 teste válido adicionado
        let usableTests = 0;
        for (let i = 0; i < this.availableTests.length; i++) {
          if (this.availableTests[i][3] == false) {
            usableTests++;
          }
        }
        if (usableTests > 0) {
          // Verificar morada
          if (document.getElementById("posto-morada-criar").value && document.getElementById("posto-cod_postal-criar").value && $('.select-localidades').find(':selected').val() != $('.select-localidades').find('option').first().val()) {
            $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + document.getElementById("posto-morada-criar").value.trim().split(" ").join("+").replace(",", "") + "+" + document.getElementById("posto-cod_postal-criar").value.trim().split(" ").join("+") + '+' + this.localeController.GetNameById(parseInt($('.select-localidades').find(':selected').val())).nome.trim().split(" ").join("+") + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', data => {
              let coords = [null, null];
              if (data.status == "OK") {
                coords[0] = data.results[0].geometry.location.lat;
                coords[1] = data.results[0].geometry.location.lng;
              }
              // Como estamos num método async não temos acesso à instância da classe UserController portanto terá de ser instanciada uma para esse propósito
              const specificUserController = new UserController();

              // Registar a entidade
              specificUserController.EntityUser_Register(
                document.getElementById("posto-nome-criar").value,
                null,
                document.getElementById("posto-email-criar").value,
                null,
                null,
                document.getElementById("posto-horario-abertura-criar").value,
                document.getElementById("posto-horario-fecho-criar").value,
                document.getElementById("posto-tempo-consulta-criar").value,
                document.getElementById("posto-drive-criar").checked,
                document.getElementById("posto-call-criar").checked,
                false);

              const usersRegistados = specificUserController.getAllEntityUsers();
              const userID = usersRegistados[usersRegistados.length - 1].id;

              // Registar os tipos de teste
              for (let i = 0; i < this.availableTests.length; i++) {
                if (this.availableTests[i][3] == false) {
                  this.userController.EntityUser_RegisterTest(
                    userID,
                    parseInt(this.availableTests[i][0]),
                    this.availableTests[i][1],
                    this.availableTests[i][2]);
                }
              }

              // Registar as moradas
              specificUserController.EntityUser_RegisterAddress(userID, document.getElementById("posto-morada-criar").value, document.getElementById("posto-cod_postal-criar").value, parseInt($('.select-localidades').find(':selected').val()), coords[0], coords[1]);
              Swal.fire('Sucesso!', 'O registo foi concluído com sucesso!', 'success');
              this.availableTests = [];
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            });
          } else {
            Swal.fire('Erro!', "Verifique a morada introduzida", 'error');
          }
        } else {
          Swal.fire('Erro!', "Adicione pelo menos 1 teste!", 'error');
        }
      } catch (e) {
        Swal.fire('Erro!', String(e).substring(7), 'error');
      }
    });
  }

  PostosAdd_AddTest() {
    document.getElementById("teste-form-nova-entidade").addEventListener('submit', event => {
      event.preventDefault();

      // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
      const tipo = $('.select-testes-nova-entidade');
      const preco_euros = document.getElementById("teste-preco-euros-nova-entidade");
      const preco_centimos = document.getElementById("teste-preco-centimos-nova-entidade");


      // Verificar se o select tem algo selecionado...
      if ((tipo.find(':selected').val() != 0) && (preco_euros.value > 0) && (preco_centimos.value < 100)) {
        // Verificar se o tipo selecionado já está presente no array
        if (!this.availableTests.some(teste => parseInt(teste[0]) == parseInt(tipo.find(':selected').val()) && teste[3] == false)) {
          this.availableTests.push([tipo.find(':selected').val(), preco_euros.value, preco_centimos.value, false]);
          document.getElementById("tests-content").innerHTML += `
            <div class="d-flex mt-3 mb-4 card-morada align-items-center" style="background-color: var(--cinza-claro);" id="card-${this.availableTests.length}">
              <p class="m-0 p-0 etiqueta-${this.availableTests.length}">${this.testsController.GetNameById(parseInt(tipo.find(':selected').val())).nome_teste} | ${parseFloat(preco_euros.value + "." + preco_centimos.value).toFixed(2)}€</p>
              <div class="ms-auto">
                <button type="button" class="m-remove-new-entidade" id="${this.availableTests.length}"><i class="fas fa-trash morada-remove"></i></button>
              </div>
            </div>`;

            // Event listener para o botão de remover
            this.PostosAdd_RemoveTest();

            // Fechar o modal
            // Uso do JQuery: https://www.tutorialrepublic.com/faq/how-to-close-a-bootstrap-modal-window-using-jquery.php
            $("#add-teste-modal-nova-entidade").modal('hide');

            // Limpar os campos do formulário
            preco_euros.value = "";
            preco_centimos.value = "";

            // Selecionar a opção por defeito do select
            // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
            tipo.val(0);
            tipo.trigger('change');
            Swal.fire('Sucesso!', 'O teste foi adicionado com sucesso!', 'success');
        } else {
          Swal.fire('Erro!', "O tipo de teste já se encontra adicionado!", 'error');
        }
      } else {
        Swal.fire('Erro!', "Verifique os dados introduzidos", 'error');
      }
    });
  }

  PostosAdd_RemoveTest() {
    for (const btnRemove of document.getElementsByClassName("m-remove-new-entidade")) {
      btnRemove.addEventListener("click", event => {
        // https://developer.mozilla.org/pt-BR/docs/Web/API/Event/currentTarget
        const id = event.currentTarget.id;

        Swal.fire({
          title: 'Tem a certeza que quer eliminar o teste?',
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `Cancelar`
        }).then((result) => {
          if (result.isConfirmed) {
            // Trocar o index 3 do array para true
            this.availableTests[id - 1][3] = true;

            // Elimnar do html
            document.getElementById("card-" + id).remove();
            if (!this.availableTests.some(teste => teste[3] == false)) {
              document.getElementById("tests-content").innerHTML = `<p style="font-weight: 500; color: var(--azul-pri);">Não tem testes adicionados</p>`;
            }
            Swal.fire('Sucesso!', 'O teste foi removido com sucesso!', 'success');
          }
        });
      });
    }
  }

  PostosEdit_AddTest() {
    document.getElementById("teste-form").addEventListener('submit', event => {
      event.preventDefault();

      // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
      const tipo = $('.select-testes');
      const preco_euros = document.getElementById("teste-preco-euros");
      const preco_centimos = document.getElementById("teste-preco-centimos");


      // Verificar se o select tem algo selecionado...
      if ((tipo.find(':selected').val() != 0) && (preco_euros.value > 0) && (preco_centimos.value < 100)) {
        // Verificar se o tipo selecionado já está presente na entidade
        let isTestAlreadyPresent = false;
        for (let i = 0; i < this.userController.testesEntidade.length; i++) {
          if (parseInt(this.userController.testesEntidade[i].id_entidade) == parseInt(document.getElementById("id-posto").innerHTML)) {
            if (parseInt(tipo.find(':selected').val()) == parseInt(this.userController.testesEntidade[i].id_teste)) {
              isTestAlreadyPresent = true;
              break;
            }
          }
        }

        if (!isTestAlreadyPresent) {
          this.userController.EntityUser_RegisterTest(
            parseInt(document.getElementById("id-posto").innerHTML),
            parseInt(tipo.find(':selected').val()),
            preco_euros.value,
            preco_centimos.value
          );

          // Fechar o modal
          // Uso do JQuery: https://www.tutorialrepublic.com/faq/how-to-close-a-bootstrap-modal-window-using-jquery.php
          $("#add-teste-modal").modal('hide');
          Swal.fire('Sucesso!', 'O teste foi adicionado com sucesso!', 'success');
          setTimeout(function(){ window.location.reload(); }, 1500);
        } else {
          Swal.fire('Erro!', "O tipo de teste já se encontra adicionado!", 'error');
        }
      } else {
        Swal.fire('Erro!', "Verifique os dados introduzidos", 'error');
      }
    });
  }

  PostosEdit_RemoveTest() {
    for (const btnRemove of document.getElementsByClassName("m-remove")) {
      btnRemove.addEventListener("click", event => {
        // https://developer.mozilla.org/pt-BR/docs/Web/API/Event/currentTarget
        const id = event.currentTarget.id;

        Swal.fire({
          title: 'Tem a certeza que quer eliminar o teste?',
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `Cancelar`
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              this.userController.EntityUser_RemoveTest(
                parseInt(document.getElementById("id-posto").innerHTML),
                this.userController.testesEntidade[id].id_teste
              );
              Swal.fire('Sucesso!', 'O teste foi removido com sucesso!', 'success');
              setTimeout(function(){ window.location.reload(); }, 1500);
            } catch (e) {
              Swal.fire('Erro!', String(e).substring(7), 'error');
            }
          }
        });
      });
    }
  }

  BloquearPosto() {
    for (const btnBan of document.getElementsByClassName("btn-ban")) {
      btnBan.addEventListener("click", () => {
        try {
          this.userController.EntityUser_Block(btnBan.id);
          window.location.reload();
        } catch (e) {
          Swal.fire('Erro!', String(e).substring(7), 'error');
        }
      });
    }
  }

  AtivarPosto() {
    for (const btnUnban of document.getElementsByClassName("btn-unban")) {
      btnUnban.addEventListener("click", () => {
        try {
          this.userController.EntityUser_Unblock(btnUnban.id);
          window.location.reload();
        } catch (e) {
          Swal.fire('Erro!', String(e).substring(7), 'error');
        }
      });
    }
  }

  VerificarPosto() {
    for (const btnVerify of document.getElementsByClassName("btn-verificar")) {
      btnVerify.addEventListener("click", () => {
        try {
          this.userController.EntityUser_Verify(
            this.userController.getLoggedInUserData().id,
            btnVerify.id
          );
          window.location.reload();
        } catch (e) {
          Swal.fire('Erro!', String(e).substring(7), 'error');
        }
      });
    }
  }

  RemoverVerificacaoPosto() {
    for (const btnUnverify of document.getElementsByClassName("btn-unverificar")) {
      btnUnverify.addEventListener("click", () => {
        try {
          this.userController.EntityUser_Unverify(
            this.userController.getLoggedInUserData().id,
            btnUnverify.id
          );
          window.location.reload();
        } catch (e) {
          Swal.fire('Erro!', String(e).substring(7), 'error');
        }
      });
    }
  }

  // Misc
  AddLocalesToSelect(target) {
    const localidades = this.localeController.GetAllLocales();
    const select = document.querySelector(target);
    for (const localidade of localidades) {
      select.innerHTML += `<option value="${localidade['id']}">${localidade['nome']}</option>`;
    }
  }

  AddTestsToSelect(target) {
    const tests = this.testsController.GetAllTests();
    const select = document.querySelector(target);
    for (const test of tests) {
      select.innerHTML += `<option value="${test['id_teste']}">${test['nome_teste']}</option>`;
    }
  }
}
