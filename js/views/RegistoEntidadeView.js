import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'
import TestsController from '../controllers/TestsController.js'

export default class RegistoEntidadeView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Instanciar o TestsController para ser possível adicionar os testes aos selects
    this.testsController = new TestsController();

    // Carregar os inputs para variáveis
    this.LoadInputs();

    
    // Event listener para o submit do forumlário
    if (this.userController.getLoggedInUserData()!=null) {
      Swal.fire('Erro!', "Já se encontra logado", 'error');
      setTimeout(() => {
        location.replace("../../")
      }, 2000);
    }
    else{
      this.BindRegistrationSubmit();
    }
    

    // Event listener para quando a checkbox de "ver password" é checkada
    this.BindViewPasswordCheckbox("view-password", "RegistoPASSWORD");

    // Adicionar as localidades presentes na localstorage ao select de localidades
    this.AddLocalesToSelect(".select-localidades");

    // Adicionar os testes presentes na localstorage ao select de testes
    this.AddTestsToSelect(".select-testes");

    // Event listener do botão de adicionar testes
    this.AddTest();

    // Array que vai ficar com os testes que a entidade vai dispor
    this.availableTests = [];
  }

  LoadInputs() {
    // Liga todos os inputs do registo a variáveis
    this.registoFORM = document.getElementById("form-reg-entidade");
    this.registoNOME = document.getElementById("EntidadeNome");
    this.registoNIF = document.getElementById("EntidadeNIF");
    this.registoEMAIL = document.getElementById("EntidadeEmail");
    this.registoPASSWORD = document.getElementById("RegistoPASSWORD");
    this.registoMORADA = document.getElementById("morada-morada");
    this.registoCODPOSTAL = document.getElementById("morada-codpostal");
    // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
    this.registoLOCALIDADE = $('.select-localidades');
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
    this.registoFORM.addEventListener("submit", event => {
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
          if (this.registoMORADA.value && this.registoCODPOSTAL.value && this.registoLOCALIDADE.find(':selected').val() != this.registoLOCALIDADE.find('option').first().val()) {
            $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.registoMORADA.value.trim().split(" ").join("+").replace(",", "") + "+" + this.registoCODPOSTAL.value.trim().split(" ").join("+") + '+' + this.localeController.GetNameById(parseInt(this.registoLOCALIDADE.find(':selected').val())).nome.trim().split(" ").join("+") + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', data => {
              let coords = [null, null];
              if (data.status == "OK") {
                coords[0] = data.results[0].geometry.location.lat;
                coords[1] = data.results[0].geometry.location.lng;
              }
              // Como estamos num método async não temos acesso à instância da classe UserController portanto terá de ser instanciada uma para esse propósito
              const specificUserController = new UserController();

              // Registar a entidade
              specificUserController.EntityUser_Register(
                this.registoNOME.value,
                this.registoNIF.value,
                this.registoEMAIL.value,
                this.registoPASSWORD.value,
                this.registoWEBSITE.value,
                this.registoHABERTURA.value,
                this.registoHFECHO.value,
                this.registoTTESTE.value,
                this.registoDRIVETHRU.checked,
                this.registoCALLME.checked,
                true);

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
              specificUserController.EntityUser_RegisterAddress(userID, this.registoMORADA.value, this.registoCODPOSTAL.value, parseInt(this.registoLOCALIDADE.find(':selected').val()), coords[0], coords[1]);
              Swal.fire('Sucesso!', 'O registo foi concluído com sucesso!', 'success');
              setTimeout(() => {
                location.replace("autenticacao.html");
              }, 2000);
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

  AddTest() {
    document.getElementById("teste-form").addEventListener('submit', event => {
      event.preventDefault();

      // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
      const tipo = $('.select-testes');
      const preco_euros = document.getElementById("teste-preco-euros");
      const preco_centimos = document.getElementById("teste-preco-centimos");


      // Verificar se o select tem algo selecionado...
      if ((tipo.find(':selected').val() != 0) && (preco_euros.value > 0) && (preco_centimos.value < 100)) {
        // Verificar se o tipo selecionado já está presente no array
        if (!this.availableTests.some(teste => parseInt(teste[0]) == parseInt(tipo.find(':selected').val()) && teste[3] == false)) {
          this.availableTests.push([tipo.find(':selected').val(), preco_euros.value, preco_centimos.value, false]);
          document.getElementById("tests-content").innerHTML += `
            <div class="d-flex mt-3 mb-4 card-morada align-items-center" id="card-${this.availableTests.length}">
              <p class="m-0 p-0 etiqueta-${this.availableTests.length}">${this.testsController.GetNameById(parseInt(tipo.find(':selected').val())).nome_teste} | ${parseFloat(preco_euros.value + "." + preco_centimos.value).toFixed(2)}€</p>
              <div class="ms-auto">
                <button type="button" class="m-remove" id="${this.availableTests.length}"><i class="fas fa-trash morada-remove"></i></button>
              </div>
            </div>`;

            // Event listener para o botão de remover
            this.RemoveTest();

            // Fechar o modal
            // Uso do JQuery: https://www.tutorialrepublic.com/faq/how-to-close-a-bootstrap-modal-window-using-jquery.php
            $("#add-teste-modal").modal('hide');

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
}
