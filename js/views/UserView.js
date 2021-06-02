import UserController from '../controllers/UserController.js'

export default class UserView {
  constructor() {
    this.userController = new UserController();
    this.loadLoginDOM();
    this.bindTypeButtons();
  }

  loadNormalDOM() {
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
    this.bindRegisterForm();
  }

  loadPostoDOM() {
    // pass
  }

  loadLoginDOM() {
    this.loginFORM = document.getElementById("form-login");
    this.loginEMAIL = document.getElementById("loginEMAIL");
    this.loginPASSWORD = document.getElementById("loginPASSWORD");
    this.bindLoginForm();
  }

  bindRegisterForm() {
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
        setTimeout(() => { location.replace("../../") }, 2000);
      } catch (e) {
        Swal.fire('Erro!', String(e).substring(7), 'error');
      }
    });
  }

  bindLoginForm() {
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

  bindTypeButtons() {
    document.querySelector("#TipoUser").addEventListener("change", () => {
      if (document.querySelector("#TipoUser").value == "Utilizador normal") {
        $(".change-type").html(`<div class="mb-2">
          <input id="RegistoPNOME" type="text" class="input-login-registar" name="p_nome" placeholder="Primeiro nome" value="" required>
          </div>
          <div class="mb-2">
            <input id="RegistoUNOME" type="text" class="input-login-registar" name="u_nome" placeholder="Último nome" value="" required>
          </div>
          <div class="mb-2">
            <input id="RegistoEMAIL" type="email" class="input-login-registar" name="email" placeholder="Endereço de e-mail" value="" required>
          </div>
          <div class="mb-2">
            <input id="RegistoPASSWORD" type="text" class="input-login-registar" name="password" placeholder="Password" value="" required>
          </div>
          <div class="mb-2">
            <input id="RegistoNIF" type="number" class="input-login-registar" name="nif" placeholder="NIF" value="" required>
          </div>
          <div class="mb-2">
            <input id="RegistoTLM" type="number" class="input-login-registar" name="tlm" placeholder="N.º de telemóvel" value="" required>
          </div>
          <div class="mb-2">
            <span>Data de nascimento</span>
            <input id="RegistoDATANASC" type="date" class="input-login-registar" name="data_nasc" placeholder="Data de nascimento" value="" required>
          </div>
          <div class="mb-2">
            <input id="RegistoCONSEMAIL" type="checkbox" class="check-style"><span class="span-checkbox">Consinto a utilização do meu e-mail</span>
          </div>
          <div>
            <button id="RegistoSUBMIT" type="sumbit" class="btn-login text-center">Efetuar registo</button>
          </div>`);
        $(".change-type").attr("id", "form-reg-normal");
        new UserView().loadNormalDOM();
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
}
