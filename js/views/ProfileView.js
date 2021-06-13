import UserController from '../controllers/UserController.js';
import LocaleController from '../controllers/LocaleController.js';
import TestsController from '../controllers/TestsController.js';

export default class NavbarView {
  constructor() {
    // Instanciar o UserController/PostoController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();
    this.localeController = new LocaleController();
    this.testsController = new TestsController();

    // Event listeners para quando o utilizador pretende editar o seu perfil e guardar as suas alterações
    this.BindEditButtons();

    // Event listeners para quando o utilizador pretende editar o seu perfil e guardar as suas alterações
    this.RenderForms();
  }

  BindEditButtons() {
    document.getElementById("ativar-campos").addEventListener("click", () => {
      for (const input of document.querySelectorAll("#campos-editar-perfil input")) {
        input.disabled = false;
      }
      for (const select of document.querySelectorAll("#campos-editar-perfil select")) {
        select.disabled = false;
      }

      document.getElementById("guardar-alteracoes").style.visibility = "visible";
      document.getElementById("ativar-campos").style.visibility = "hidden";
    });

    document.getElementById("guardar-alteracoes").addEventListener("click", () => {
      document.getElementById("guardar-alteracoes").style.visibility = "hidden";
      document.getElementById("ativar-campos").style.visibility = "visible";
      for (const input of document.querySelectorAll("#campos-editar-perfil input")) {
        input.disabled = true;
      }
      for (const select of document.querySelectorAll("#campos-editar-perfil select")) {
        select.disabled = true;
      }

      if (this.userController.getLoggedInUserType() == "posto") {
        this.UpdatePostosInfo()
      } else {
        this.UpdateUserInfo()
      }
    });
  }

  RenderForms(){
    const userInfo = this.userController.getLoggedInUserType();
    if (userInfo == "posto") {
      // Injetar o código HTML para a edição de perfil de utilizadores normais
      document.querySelector("#campos-editar-perfil").innerHTML = `
      <p class="color-laranja"><b>Informações gerais</b></p>
      <div class="col-md-6 mt-3">
        <span>Nome</span>
        <input type="text" class="input-login-registar" id="posto-nome" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>NIF</span>
        <p class="input-login-registar"  id="posto-nif"></p>
      </div>
      <div class="col-md-6 mt-3">
        <span>E-mail</span>
        <input type="text" class="input-login-registar" id="posto-email" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Palavra-Passe</span>
        <input type="text" class="input-login-registar"  id="posto-password" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Website</span>
        <input type="text" class="input-login-registar" id="posto-website" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Hora de abertura</span>
        <input type="time" class="input-login-registar" id="posto-horario-abertura" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Hora de fecho</span>
        <input type="time" class="input-login-registar" id="posto-horario-fecho" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Tempo de consulta</span>
        <input type="text" class="input-login-registar" id="posto-tempo-consulta" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Morada</span>
        <input type="text" class="input-login-registar" id="posto-morada" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Codigo Postal</span>
        <input type="text" class="input-login-registar" id="posto-cod_postal" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Localidade</span>
        <select class="select-localidades-postos" style="width: 100%; height: 40px;" disabled required>
          <option disabled="disabled" value="0" selected>Localidade</option>
        </select>
      </div>
      <div class="col-md-6 mt-3">
        <div class="d-flex align-items-center">
          <input type="checkbox" id="posto-drive" class="check-style" disabled>
          <label for="posto-drive" class="span-checkbox"><strong>Posto drive-thru</strong></label>
        </div>
      </div>
      <div class="col-md-6 mt-3">
        <div class="d-flex align-items-center">
          <input type="checkbox" id="posto-call" class="check-style" disabled>
          <label for="posto-call" class="span-checkbox"><strong>Permitir call-me</strong></label>
        </div>
      </div>`;

      // Renderizar os testes disponíveis da presente entidade
      document.getElementById("other-content").innerHTML = `<p class="color-laranja mt-4"><b>Testes disponíveis</b></p>`;

      for (let i = 0; i < this.userController.testesEntidade.length; i++) {
        if (parseInt(this.userController.testesEntidade[i].id_entidade) == parseInt(this.userController.getLoggedInUserData().id)) {
          document.getElementById("other-content").innerHTML += `
          <div class="d-flex mt-3 mb-4 card-morada align-items-center" id="card-${i}">
            <p class="m-0 p-0 etiqueta-${i}">${this.testsController.GetNameById(parseInt(this.userController.testesEntidade[i].id_teste)).nome_teste} | ${this.userController.testesEntidade[i].preco}€</p>
            <div class="ms-auto">
              <button type="button" class="m-remove" id="${i}"><i class="fas fa-trash morada-remove"></i></button>
            </div>
          </div>`;
        }
      }

      document.getElementById("other-content").innerHTML += `
      <div class="mb-3">
        <button type="button" id="add-teste" class="btn btn-azul-pri" data-bs-toggle="modal" data-bs-target="#add-teste-modal">Adicionar teste</button>
      </div>`;

      // Iniciar o select das localidades com a livraria Select2
      $('.select-localidades-postos').select2({
        searchInputPlaceholder: 'Pesquisar localidade...'
      });

      // Enviar todas as localidades para o select
      this.AddLocalesToSelect(".select-localidades-postos");

      // Enviar todos os testes disponíveis para o select
      this.AddTestsToSelect(".select-testes");

      // Event listener para o botão de adicionar testes
      this.AddTest();

      // Event listener para os botões de remover testes
      this.RemoveTest();

      // Settar as informações do user logado nos inputs
      this.SetProfileInfoPosto();
    } else {
      // Obter as moradas do utilizador
      let renderUserAddresses = ``;
      for (let i = 0; i < this.userController.endNormal.length; i++) {
        if (this.userController.endNormal[i].id_utilizador == this.userController.getLoggedInUserData().id) {
          let renderDefault = this.userController.endNormal[i].predefinido ? `<i class="fas fa-diamond me-3 morada-default"></i>` : `<i class="far fa-diamond me-3 morada-default"></i>`;
          renderUserAddresses += `
          <div class="d-flex mt-3 mb-3 card-morada align-items-center" id="card-${i}">
            <div class="f-icon">${renderDefault}</div>
            <p class="m-0 p-0 etiqueta-${i}">${this.userController.endNormal[i].etiqueta}</p>
            <div class="ms-auto">
              <button type="button" class="m-edit" id="${i}" data-bs-toggle="modal" data-bs-target="#edit-morada"><i class="fas fa-edit morada-edit me-3"></i></button>
              <button type="button" class="m-remove" id="${i}"><i class="fas fa-trash morada-remove"></i></button>
            </div>
          </div>`;
        }
      }

      // Injetar o código HTML para a edição de perfil de utilizadores normais
      document.querySelector("#campos-editar-perfil").innerHTML = `
      <p class="color-laranja"><b>Informações gerais:</b></p>
      <div class="col-md-12 d-flex flex-column align-items-center align-self-center">
        <img class="" id="avatar-profile">
        <input type="text" style="min-width: 285px;" class="mt-3" id="avatar-profile-text" disabled>
      </div>
      <div class="col-md-6 mt-3">
        <span>Primeiro Nome</span>
        <input type="text" class="input-login-registar" id="user-pnome" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>E-mail</span>
        <input type="email" class="input-login-registar"  id="user-email" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <span>Último Nome</span>
        <input type="text" class="input-login-registar" id="user-unome" disabled required>
      </div>
      <div class="col-md-6 mt-3">
        <div>
          <span>Palavra-passe</span>
          <input type="password" class="input-login-registar"  id="user-password" disabled required>
        </div>
        <div class="d-flex align-items-center my-2 ver-pw">
          <input type="checkbox" id="view-password-normal" class="check-style" disabled>
          <label for="view-password-normal" class="span-checkbox">Ver palavra-passe</label>
        </div>
      </div>
      <div class="col-md-6 mt-3">
        <span>Nº de telemóvel</span>
        <input type="text" class="input-login-registar" id="user-tlm" disabled required>
      </div>
      <p class="color-azul-princ mt-5"><b>Pontos conquistados: <span id="user-pontos"></span></b></p>
      <hr class="mt-4">
      <p class="color-laranja"><b>Moradas</b></p>
      ${renderUserAddresses}
      <button type="submit" class="btn btn-azul-pri mb-3" data-bs-toggle="modal" data-bs-target="#add-morada">Adicionar morada</button>`;

      // Event listener para adicionar morada
      this.AddAddress();

      // Settar as informações do user logado nos inputs
      this.SetProfileInfoNormal();

      // Adicionar as localidades presentes na localstorage ao select de localidades
      this.AddLocalesToSelect(".select-localidades");
      this.AddLocalesToSelect(".edit-select-localidades");

      // Event listener para a checkbox de ver password
      this.BindViewPasswordCheckbox("view-password-normal", "user-password");
    }
  }

  SetProfileInfoPosto() {
    const userInfo = this.userController.getLoggedInUserData();
    const userInfoEnderecos = this.userController.getAllEntityEnderecos();

    for (let i = 0; i < userInfoEnderecos.length; i++) {
      if (userInfo.id == userInfoEnderecos[i].id_entidade) {
        document.getElementById("posto-morada").value = userInfoEnderecos[i].morada;
        document.getElementById("posto-cod_postal").value = userInfoEnderecos[i].cod_postal;
        $('.select-localidades-postos').val(userInfoEnderecos[i].id_localidade);
        $('.select-localidades-postos').trigger('change');
        break;
      }
    }
    document.getElementById("posto-nome").value = userInfo.nome;
    document.getElementById("posto-email").value = userInfo.email;
    document.getElementById("posto-nif").innerHTML = userInfo.nif;
    document.getElementById("posto-password").value = userInfo.password;
    document.getElementById("posto-website").value = userInfo.website;
    document.getElementById("posto-horario-abertura").value = userInfo.horario_inicio;
    document.getElementById("posto-horario-fecho").value = userInfo.horario_fim;
    document.getElementById("posto-tempo-consulta").value = userInfo.intervalo_consulta;
    document.getElementById("posto-drive").checked = userInfo.drive_thru;
    document.getElementById("posto-call").checked = userInfo.call_me;
  }

  SetProfileInfoNormal() {
    const userInfo = this.userController.getLoggedInUserData();

    document.getElementById("avatar-profile").src = userInfo.avatar;
    document.getElementById("avatar-profile-text").value = userInfo.avatar;
    document.getElementById("user-pnome").value = userInfo.pnome;
    document.getElementById("user-email").value = userInfo.email;
    document.getElementById("user-unome").value = userInfo.unome;
    document.getElementById("user-password").value = userInfo.password;
    document.getElementById("user-tlm").value = userInfo.tlm;
  }

  UpdatePostosInfo() {
    if ($('.select-localidades-postos').find(':selected').val() != $('.select-localidades-postos').find('option').first().val()) {
      // Obter a latitude e longitude da nova morada
      $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + document.getElementById("posto-morada").value.trim().split(" ").join("+").replace(",", "") + "+" + document.getElementById("posto-cod_postal").value.trim().split(" ").join("+") + '+' + this.localeController.GetNameById(parseInt($('.select-localidades-postos').find(':selected').val())).nome.trim().split(" ").join("+") + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
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
            specificUserController.getLoggedInUserData().id,
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
            $('.select-localidades-postos').find(':selected').val(),
            lat,
            lng);
          Swal.fire('Sucesso!', "Os dados foram editados com sucesso!", 'success');
        } catch (e) {
          Swal.fire('Erro!', String(e).substring(7), 'error');
          document.querySelector("#ativar-campos").click();
        }
      });
    } else {
      Swal.fire('Erro!', "Escolha uma morada válida!", 'error');
    }
  }

  UpdateUserInfo() {
    try {
      console.log("Event listener a funcionar :)");
      // if ($("#TipoUser").val() == "Utilizador normal") {
      //   this.userController.NormalUser_Edit(
      //     this.registoPNOME.value,
      //     this.registoUNOME.value,
      //     this.registoEMAIL.value,
      //     this.registoPASSWORD.value,
      //     this.registoTLM.value,
      //     this.registoNIF.value,
      //     this.registoDATANASC.value,
      //     this.registoCONSEMAIL.checked);
      // } else {
      //   // pass
      // }
      // Swal.fire('Sucesso!', 'O registo foi concluído com sucesso!', 'success');
      // setTimeout(() => {
      //   location.reload();
      // }, 2000);
    } catch (e) {
      Swal.fire('Erro!', String(e).substring(7), 'error');
    }
  }

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

  // NÃO DEIXAR O UTILIZAR REMOVER A ÚLTIMA MORADA
  // NÃO DEIXAR O UTILIZAR REMOVER A ÚLTIMA MORADA
  // NÃO DEIXAR O UTILIZAR REMOVER A ÚLTIMA MORADA
  // NÃO DEIXAR O UTILIZAR REMOVER A ÚLTIMA MORADA
  // NÃO DEIXAR O UTILIZAR REMOVER A ÚLTIMA MORADA
  // NÃO DEIXAR O UTILIZAR REMOVER A ÚLTIMA MORADA
  AddAddress() {
    document.querySelector("#btn-add-morada").addEventListener("click", event => {
      event.preventDefault();
      // Verificar se o utilizador pode adicionar mais moradas
      let qntUserAddresses = 0;
      for (let i = 0; i < this.userController.endNormal.length; i++) {
        if (this.userController.endNormal[i].id_utilizador == this.userController.getLoggedInUserData().id) {
          qntUserAddresses++;
        }
      }

      if (qntUserAddresses < 5) {
        let etiqueta = document.getElementById("morada-etiqueta");
        let morada = document.getElementById("morada-morada");
        let codpostal = document.getElementById("morada-codpostal");
        let localidade_id = $('.select-localidades').find(':selected').val();
        let loc_default = document.getElementById("morada-default").checked;

        if (etiqueta.value && morada.value && codpostal.value && localidade_id != $('.select-localidades').find('option').first().val()) {
          if (loc_default) {
            // Verificar se já há alguma morada marcada como principal e mudar esse parâmetro
            for (let i = 0; i < this.userController.endNormal.length; i++) {
              if (this.userController.endNormal[i].id_utilizador == this.userController.getLoggedInUserData().id) {
                if (this.userController.endNormal[i].predefinido == true) {
                  this.userController.endNormal[i].predefinido = false;
                }
              }
            }
          } // Não está settada para ser principal portanto simplesmente adicionar
          // Fechar o modal
          // Uso do JQuery: https://www.tutorialrepublic.com/faq/how-to-close-a-bootstrap-modal-window-using-jquery.php
          $("#add-morada").modal('hide');
          // ( id_utilizador, morada, cod_postal, id_localidade, lat, long, etiqueta, predefinido) {
          this.userController.NormalUser_RegisterAddress(
            this.userController.getLoggedInUserData().id,
            morada.value,
            codpostal.value,
            localidade_id,
            1000,
            2000,
            etiqueta.value,
            loc_default);
          Swal.fire('Sucesso!', 'A morada foi adicionada com sucesso!', 'success');
          setTimeout(function(){ window.location.reload(); }, 1500);
        } else {
          Swal.fire('Erro!', "Preencha todos os campos corretamente", 'error');
        }
      } else {
        Swal.fire('Erro!', "Só pode adicionar até 5 moradas!", 'error');
      }
    });
  }

  AddTest() {
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
          if (parseInt(this.userController.testesEntidade[i].id_entidade) == parseInt(this.userController.getLoggedInUserData().id)) {
            if (parseInt(tipo.find(':selected').val()) == parseInt(this.userController.testesEntidade[i].id_teste)) {
              isTestAlreadyPresent = true;
              break;
            }
          }
        }

        if (!isTestAlreadyPresent) {
          this.userController.EntityUser_RegisterTest(
            this.userController.getLoggedInUserData().id,
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

  RemoveTest() {
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
                this.userController.getLoggedInUserData().id,
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
}
