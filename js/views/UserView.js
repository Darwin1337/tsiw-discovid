import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'

export default class UserView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Como o login é por defeito o primeiro formulário a aparecer os campos são logo binded a variáveis
    this.LoadLoginInputs();

    // Event listener para quando a checkbox de "ver password" é checkada
    this.BindViewPasswordCheckbox("view-password", "loginPASSWORD");

    // A possibilidade de efeutar registo é possível portanto é necessário um event listener para o botão de troca
    this.BindTypeButtons();

    // Adicionar as localidades presentes na localstorage ao select (que é comum a todos os formulários - login - registo normal/entidade)
    this.AddLocalesToSelect();

    // Se o utilizador premir o botão "ceder localização" preencher automaticamente o formulário de morada
    this.GeoLocationAutoComplete();
  }

  LoadNormalRegisterInputs() {
    // Liga todos os inputs do registo a variáveis
    this.registoFORM = document.getElementById("form-reg-normal");
    this.registoPNOME = document.getElementById("RegistoPNOME");
    this.registoUNOME = document.getElementById("RegistoUNOME");
    this.registoEMAIL = document.getElementById("RegistoEMAIL");
    this.registoPASSWORD = document.getElementById("RegistoPASSWORD");
    this.registoNIF = document.getElementById("RegistoNIF");
    this.registoTLM = document.getElementById("RegistoTLM");
    this.registoDATANASC = document.getElementById("RegistoDATANASC");
    this.registoCONSEMAIL = document.getElementById("RegistoCONSEMAIL");
    this.registoSUBMIT = document.getElementById("RegistoSUBMIT");

    // Event listener para quando o formulário de registo é submetido
    this.BindRegisterSubmit();
  }

  LoadPostoRegisterInputs() {
    // pass
  }

  LoadLoginInputs() {
    // Liga todos os inputs do login a variáveis
    this.loginFORM = document.getElementById("form-login");
    this.loginEMAIL = document.getElementById("loginEMAIL");
    this.loginPASSWORD = document.getElementById("loginPASSWORD");

    // Event listener para quando o formulário de login é submetido
    this.BindLoginSubmit();
  }

  BindRegisterSubmit() {
    this.registoFORM.addEventListener('submit', event => {
      event.preventDefault();
      try {
        if ($("#TipoUser").val() == "Utilizador normal") {
          this.userController.register(
            this.registoPNOME.value,
            this.registoUNOME.value,
            this.registoEMAIL.value,
            this.registoPASSWORD.value,
            this.registoTLM.value,
            this.registoNIF.value,
            this.registoDATANASC.value,
            this.registoCONSEMAIL.checked);
        } else {
          // pass
        }
        Swal.fire('Sucesso!', 'O registo foi concluído com sucesso!', 'success');
        setTimeout(() => { location.reload(); }, 2000);
      } catch (e) {
        Swal.fire('Erro!', String(e).substring(7), 'error');
      }
    });
  }

  BindLoginSubmit() {
    this.loginFORM.addEventListener('submit', event => {
      event.preventDefault();
      try {
        this.userController.login(this.loginEMAIL.value, this.loginPASSWORD.value);
        Swal.fire('Sucesso!', 'A sessão foi iniciada com sucesso!', 'success');
        setTimeout(() => { location.replace("../../") }, 2000);
      } catch (e) {
        Swal.fire('Erro!', String(e).substring(7), 'error');
      }
    });
  }

  BindTypeButtons() {
    document.querySelector("#TipoUser").addEventListener("change", () => {
      if (document.querySelector("#TipoUser").value == "Utilizador normal") {
        // Injeta o formulário de registo do utilizador normal
        document.getElementsByClassName("change-type")[0].innerHTML = `
          <form id="form-reg-normal">
            <p style="font-weight: 500; color: var(--laranja);">Informações gerais</p>
            <div class="row">
              <div class="col-md-6 mb-2">
                <input id="RegistoPNOME" type="text" class="input-login-registar" name="p_nome" placeholder="Primeiro nome" value="" required>
              </div>
              <div class="col-md-6 mb-2">
                <input id="RegistoUNOME" type="text" class="input-login-registar" name="u_nome" placeholder="Último nome" value="" required>
              </div>
            </div>
            <div class="mb-2">
              <input id="RegistoEMAIL" type="email" class="input-login-registar" name="email" placeholder="Endereço de e-mail" value="" required>
            </div>
            <div class="mb-2">
              <input id="RegistoPASSWORD" type="text" class="input-login-registar" name="password" placeholder="Password" value="" required>
            </div>
            <div class="d-flex align-items-center mb-3 ver-pw">
              <input type="checkbox" id="view-password-normal" class="check-style">
              <label for="view-password-normal" class="span-checkbox">Ver palavra-passe</label>
            </div>
            <div class="row">
              <div class="col-md-6 mb-2">
                <input id="RegistoNIF" type="number" class="input-login-registar" name="nif" placeholder="NIF" value="" required>
              </div>
              <div class="col-md-6 mb-2">
                <input id="RegistoTLM" type="number" class="input-login-registar" name="tlm" placeholder="N.º de telemóvel" value="" required>
              </div>
            </div>
            <div class="mb-3">
              <span>Data de nascimento</span>
              <input id="RegistoDATANASC" type="date" class="input-login-registar" name="data_nasc" placeholder="Data de nascimento" value="" required>
            </div>
            <div class="d-flex align-items-center mb-2 ver-pw">
              <input type="checkbox" id="RegistoCONSEMAIL" class="check-style">
              <label for="RegistoCONSEMAIL" class="span-checkbox">Consinto a utilização do meu e-mail</label>
            </div>
            <div>
              <button id="RegistoSUBMIT" style="display: none;" type="sumbit" class="btn-login text-center">Efetuar registo</button>
            </div>
          </form>
          <hr class="my-4">
          <div>
            <p style="font-weight: 500; color: var(--laranja);">Moradas</p>
            <div id="moradas-content">
              <p style="font-weight: 500; color: var(--azul-pri);">Não tem moradas adicionadas</p>
            </div>
            <div>
              <button type="submit" class="btn btn-laranja" data-bs-toggle="modal" data-bs-target="#add-morada">Adicionar morada</button>
            </div>
          </div>`;

        // Ativar a checbox de ver a password
        this.BindViewPasswordCheckbox("view-password-normal", "RegistoPASSWORD");

        // Dar bind aos inputs do registo do utilizador normal
        this.LoadNormalRegisterInputs();
      } else {
        $(".change-type").html(`<div class="mb-2">
          <input id="EntidadeNome" type="text" class="input-login-registar" name="nome_entidade" placeholder="Nome Entidade" value="">
          </div>
          <div class="mb-2">
            <input id="EntidadeNIF" type="text" class="input-login-registar" name="nif" placeholder="NIF" value="">
          </div>
          <div class="mb-2">
            <input id="EntidadeEmail" type="email" class="input-login-registar" name="email" placeholder="Endereço de e-mail" value="">
          </div>
          <div class="mb-2">
            <input id="RegistoPASSWORD" type="password" class="input-login-registar" name="password" placeholder="Password" value="">
          </div>
          <div class="mb-2">
            <input id="EntidadeWebsite" type="link" class="input-login-registar" name="website" placeholder="Website" value="">
          </div>
          <div class="mb-2">
            <span>Documento</span>
            <input id="EntidadeDocumento" type="file" class="input-login-registar" name="documento" placeholder="Documento" value="">
          </div>
          <div class="mb-2">
            <span>Testes disponiveis</span>
            <select class="js-example-basic-multiple input-login-registar" name="states[]" multiple="multiple" required>
              <option>Teste PCR</option>
              <option>Teste Rápido Antigénio</option>
              <option>Teste Pesquisa Anticorpos</option>
            </select>
          </div>
          <div class="mb-2">
            <span>Hora de Abertura</span>
            <input id="HoraAbertura" type="time" class="input-login-registar" name="hora_abertura" value="">
          </div>
          <div class="mb-2">
            <span>Hora de Fecho</span>
            <input id="HoraFecho" type="time" class="input-login-registar">
          </div>
          <div class="mb-2">
            <span>Tempo estimado de cada teste (Ex: 00:20 para 20 minutos)</span>
            <input id="TempoTeste" type="time" class="input-login-registar">
          </div>
          <div class="mb-2">
            <span>Drive Thru</span>
            <input id="HoraFecho" type="checkbox" class="">
          </div>
          <div class="mb-2">
            <span>Aceita receber pedidos "call me"?</span>
            <input id="HoraFecho" type="checkbox" class="">
          </div>
          <div>
            <button id="RegistoSUBMIT" type="sumbit" class="btn-login text-center">Efetuar registo</button>
          </div>`);
        $('.js-example-basic-multiple').select2();
        $(".change-type").attr("id", "form-reg-entidade");
        new UserView().loadPostoDOM();
      }
    });
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

  AddLocalesToSelect() {
    const localidades = this.localeController.GetAllLocales();
    const select = document.querySelector(".select-localidades");
    for (const localidade of localidades) {
      select.innerHTML += `<option value="${localidade['id']}">${localidade['nome']}</option>`;
    }
  }

  GeoLocationAutoComplete() {
    document.getElementById("geolocation-fill").addEventListener('click', event => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.ApplyGeolocationData);
      } else {
        Swal.fire('Erro!', "A geolocalização não é suportada pelo seu navegador!", 'error');
      }
    });
  }

  ApplyGeolocationData(position) {
    // A função geolocation.getCurrentPosition() é async portanto não há acesso às variáveis da classe
    const specificLocaleController = new LocaleController();
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
      document.getElementById("morada-morada").value = data.results[0].address_components[1].long_name + ", " + data.results[0].address_components[0].long_name;
      document.getElementById("morada-codpostal").value = data.results[0].address_components[5].long_name;
      let municipio = null;
      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].types[0] == "administrative_area_level_2") {
          municipio = data.results[i].address_components[0].long_name;
          break;
        }
      }
      if (municipio) {
        // A livraria Select2 obriga ao uso do JQuery
        const selectVal = specificLocaleController.SearchLocaleByName(municipio);
        if (selectVal != undefined) {
          $('.select-localidades').val(selectVal["id"]);
          $('.select-localidades').trigger('change');
        } else {
          Swal.fire('Erro!', "Não foi possível determinar o seu município.", 'error');
        }
      } else {
        Swal.fire('Erro!', "Não foi possível determinar o seu município.", 'error');
      }
    });
  }
}
