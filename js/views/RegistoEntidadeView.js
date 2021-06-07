import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'

export default class RegistoEntidadeView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Carregar os inputs para variáveis
    this.LoadInputs();

    // Event listener da checkbox de ignorar a verificação do NIF
    this.IgnoreNIFVerification();

    // Event listener para o botão de verificar NIF
    this.VerifyNIF();

    // Event listener para quando a checkbox de "ver password" é checkada
    this.BindViewPasswordCheckbox("view-password", "RegistoPASSWORD");
  }

  LoadInputs() {
    // Liga todos os inputs do registo a variáveis
    this.registoFORM = document.getElementById("form-reg-entidade");
    this.registoNOME = document.getElementById("EntidadeNome");
    this.registoNIF = document.getElementById("EntidadeNIF");
    this.registoEMAIL = document.getElementById("EntidadeEmail");
    this.registoPASSWORD = document.getElementById("RegistoPASSWORD");
    this.registoWEBSITE = document.getElementById("EntidadeWebsite");
    this.registoTESTES = document.getElementById("EntidadeTestes");
    this.registoHABERTURA = document.getElementById("HoraAbertura");
    this.registoHFECHO = document.getElementById("HoraFecho");
    this.registoTTESTE = document.getElementById("TempoTeste");
    this.registoDRIVETHRU = document.getElementById("drive-thru");
    this.registoCALLME = document.getElementById("call-me-enable");
    this.registoSUBMIT = document.getElementById("RegistoSUBMIT");
  }

  BindRegistrationSubmit() {
    this.registoFORM.addEventListener('submit', event => {
      event.preventDefault();
      console.log("Botão de registo carregado :)");
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

  IgnoreNIFVerification() {
    document.getElementById("ignore-nif-verifier").addEventListener("click", event => {
      if (event.target.checked == true) {
        document.getElementById("verificar-nif").disabled = true;

        document.getElementById("result-nif").innerHTML = `
        <div class="mb-3">
          <hr>
          <p class="color-azul-princ"><b>Morada</b></p>
          <div class="mb-3">
            <input type="text" id="morada-etiqueta" class="input-login-registar" placeholder="Etiqueta" required>
          </div>
          <div class="mb-3">
            <input type="text" id="morada-morada" class="input-login-registar" placeholder="Morada" required>
          </div>
          <div class="row">
            <div class="col-md-6 mb-2">
              <div>
                <input type="text" id="morada-codpostal" class="input-login-registar" placeholder="Cód. postal" required>
              </div>
            </div>
            <div class="col-md-6 mb-2 modal-select">
              <select class="select-localidades" style="width: 100%; height: 40px;" required>
                <option disabled="disabled" value="0" selected>Localidade</option>
              </select>
            </div>
          </div>
        </div>
        <hr class="mt-3">`;

        $('.select-localidades').select2({
          searchInputPlaceholder: 'Pesquisar localidade...'
        });
      } else {
        document.getElementById("verificar-nif").disabled = false;
        document.getElementById("result-nif").innerHTML = "";
      }
    });
  }

  VerifyNIF() {
    document.getElementById("verificar-nif").addEventListener("click", () => {
      const isOnlyNumbers = /^\d+$/.test(this.registoNIF.value);
      if (isOnlyNumbers == true && this.registoNIF.value.length == 9 && document.getElementById("ignore-nif-verifier").checked == false) {
        const URL = "http://www.nif.pt/?json=1&q=" + this.registoNIF.value + "&key=1849de6e9e8a647eb92027b45d643961";

        $.ajax({
            url: URL,
            type: 'GET',
            success: function(response){
                console.log(response);
            },
            error: function(error){
                console.log(error);
            }
        });

        // $.ajax({
        //   url: "http://www.nif.pt/?json=1&q=" + this.registoNIF.value + "&key=1849de6e9e8a647eb92027b45d643961",
        //   dataType: 'json',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   success: function(data) {
        //     console.log("sucesso :)");
        //     console.log(data);
        //     console.log(data.records[this.registoNIF.value].city);
        //   },
        //   error: function() {
        //     Swal.fire('Erro!', "Não foi possível determinar a morada, por favor introduza-a manualmente", 'error');
        //     document.getElementById("result-nif").innerHTML = `
        //     <div class="mb-3">
        //       <hr>
        //       <p class="color-azul-princ"><b>Morada</b></p>
        //       <div class="mb-3">
        //         <input type="text" id="morada-etiqueta" class="input-login-registar" placeholder="Etiqueta" required>
        //       </div>
        //       <div class="mb-3">
        //         <input type="text" id="morada-morada" class="input-login-registar" placeholder="Morada" required>
        //       </div>
        //       <div class="row">
        //         <div class="col-md-6 mb-2">
        //           <div>
        //             <input type="text" id="morada-codpostal" class="input-login-registar" placeholder="Cód. postal" required>
        //           </div>
        //         </div>
        //         <div class="col-md-6 mb-2 modal-select">
        //           <select class="select-localidades" style="width: 100%; height: 40px;" required>
        //             <option disabled="disabled" value="0" selected>Localidade</option>
        //           </select>
        //         </div>
        //       </div>
        //     </div>
        //     <hr class="mt-3">`;
        //
        //     $('.select-localidades').select2({
        //       searchInputPlaceholder: 'Pesquisar localidade...'
        //     });
        //   }
        // });

        // $.getJSON("http://www.nif.pt/?json=1&q=" + this.registoNIF.value + "&key=1849de6e9e8a647eb92027b45d643961&callback=?", function(data) {
        //   if (data.result == "success") {
        //     console.log("sucesso :)");
        //     console.log(data.records[this.registoNIF.value].city);
        //   } else {
        //     Swal.fire('Erro!', "Não foi possível determinar a morada, por favor introduza-a manualmente", 'error');
        //     document.getElementById("result-nif").innerHTML = `
        //     <div class="mb-3">
        //       <hr>
        //       <p class="color-azul-princ"><b>Morada</b></p>
        //       <div class="mb-3">
        //         <input type="text" id="morada-etiqueta" class="input-login-registar" placeholder="Etiqueta" required>
        //       </div>
        //       <div class="mb-3">
        //         <input type="text" id="morada-morada" class="input-login-registar" placeholder="Morada" required>
        //       </div>
        //       <div class="row">
        //         <div class="col-md-6 mb-2">
        //           <div>
        //             <input type="text" id="morada-codpostal" class="input-login-registar" placeholder="Cód. postal" required>
        //           </div>
        //         </div>
        //         <div class="col-md-6 mb-2 modal-select">
        //           <select class="select-localidades" style="width: 100%; height: 40px;" required>
        //             <option disabled="disabled" value="0" selected>Localidade</option>
        //           </select>
        //         </div>
        //       </div>
        //     </div>
        //     <hr class="mt-3">`;
        //
        //     $('.select-localidades').select2({
        //       searchInputPlaceholder: 'Pesquisar localidade...'
        //     });
        //   }
        // });
      } else {
        Swal.fire('Erro!', "Introduza um NIF válido!", 'error');
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
}
