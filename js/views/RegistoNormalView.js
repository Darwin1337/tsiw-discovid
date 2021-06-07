import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'

export default class RegistoNormalView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Carregar os inputs para variáveis
    this.LoadInputs();

    // Event listener para quando a checkbox de "ver password" é checkada
    this.BindViewPasswordCheckbox("view-password-normal", "RegistoPASSWORD");

    // Adicionar as localidades presentes na localstorage ao select de localidades
    this.AddLocalesToSelect(".select-localidades");
    this.AddLocalesToSelect(".edit-select-localidades");

    // Event listener para quando o botão de adicionar morada é pressionado
    this.AddAddress();

    // Se o utilizador premir o botão "ceder localização" preencher automaticamente o formulário de morada
    this.GeoLocationAutoComplete();

    // Array que vai ficar com as moradas que o utilizador adicionar aquando o registo. O array é limpo sempre que o utilizador muda de tipo (normal ou entidade)
    this.normalUserAddresses = [];

    // Event listener para quando o botão de guardar edição de morada é pressionado
    this.SaveAddressEdit();

    // Event listener para quando o formulário de registo é submetido
    this.BindRegistrationSubmit();

    // O botão presente no formulário está escondido (id = RegistoSUBMIT) por isso o botão que está vísivel (id = href-submit), quando clicado irá simular o click no botão escondido.
    // O botão do forumlário está escondido para não ter que ser removido de dentro do formulário (por causa das moradas)
    // Como o event listener apenas simula o click acho que não vale a pena ter uma função própria
    document.getElementById("href-submit").addEventListener("click", event => {
      this.registoSUBMIT.click();
    });
  }

  LoadInputs() {
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
  }

  BindRegistrationSubmit() {
    this.registoFORM.addEventListener('submit', event => {
      event.preventDefault();
      try {
        // Verificar se há pelo menos 1 morada válida adicionada
        let usableAddresses = 0;
        for (let i = 0; i < this.normalUserAddresses.length; i++) {
          if (this.normalUserAddresses[i][4] == false) {
            usableAddresses++;
          }
        }
        if (usableAddresses > 0) {
          this.userController.NormalUser_Register(
            this.registoPNOME.value,
            this.registoUNOME.value,
            this.registoEMAIL.value,
            this.registoPASSWORD.value,
            this.registoTLM.value,
            this.registoNIF.value,
            this.registoDATANASC.value,
            this.registoCONSEMAIL.checked);

            // Verificar lat e long das moradas introduzidas
            // Os valores poderão ser null visto que dependemos da eficácia da API do GoogleMaps
            for (let i = 0; i < this.normalUserAddresses.length; i++) {
              if (!this.normalUserAddresses[i][4]) {
                let current = this.normalUserAddresses[i];
                // console.log("GMaps link: https://maps.googleapis.com/maps/api/geocode/json?address=" + this.normalUserAddresses[i][1].trim().split(" ").join("+").replace(",", "") + "+" + this.normalUserAddresses[i][2].trim().split(" ").join("+") + '+' + this.localeController.GetNameById(parseInt(this.normalUserAddresses[i][3])).nome.trim().split(" ").join("+") + "&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4");
                $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.normalUserAddresses[i][1].trim().split(" ").join("+").replace(",", "") + "+" + this.normalUserAddresses[i][2].trim().split(" ").join("+") + '+' + this.localeController.GetNameById(parseInt(this.normalUserAddresses[i][3])).nome.trim().split(" ").join("+") + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
                  let lng = null;
                  let lat = null;
                  // console.log("A procurar longitude e latitude para a morada de index " + i + ".")
                  // console.log("GMaps API status: " + data.status)
                  if (data.status == "OK") {
                    // console.log("Lat. e long. encontradas!")
                    lng = data.results[0].geometry.location.lng;
                    lat = data.results[0].geometry.location.lat;
                    // console.log("Latitude: " + lat);
                    // console.log("Longitude: " + lng);
                  } else {
                    // console.log("A API não conseguiu determinar a lat. e long. da morada em questão.")
                  }
                  // Como estamos num método async não temos acesso à instância da classe UserController portanto terá de ser instanciada uma para esse propósito
                  // A função geolocation.getCurrentPosition() é async portanto não há acesso às variáveis da classe
                  const specificUserController = new UserController();
                  const usersRegistados = specificUserController.getAllNormalUsers();

                  // Registar as moradas
                  const userID = usersRegistados[usersRegistados.length - 1].id;
                  specificUserController.NormalUser_RegisterAddress(userID, current[1], current[2], parseInt(current[3]), lat, lng, current[0], current[5]);
                });
              }
            }
            // https://maps.googleapis.com/maps/api/geocode/json?address=Lugar+do+pa%C3%A7o+fontelas&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4
          Swal.fire('Sucesso!', 'O registo foi concluído com sucesso!', 'success');
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          Swal.fire('Erro!', "Adicione pelo menos 1 morada!", 'error');
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

  GeoLocationAutoComplete() {
    document.getElementById("geolocation-fill").addEventListener("click", event => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.ApplyGeolocationData);
      } else {
        Swal.fire('Erro!', "A geolocalização não é suportada pelo seu navegador!", 'error');
      }
    });
  }

  ApplyGeolocationData(position) {
    // A função geolocation.getCurrentPosition() e $.getJSON são async portanto não há acesso às instâncias das classes
    const specificLocaleController = new LocaleController();
    try {
      // Uso do JQuery: https://stackoverflow.com/questions/4657287/what-is-the-difference-between-xmlhttprequest-jquery-ajax-jquery-post-jquery
      $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
        let municipio = null;
        let porta = null;
        let morada = null;
        let cod_postal = null;
        for (let i = 0; i < data.results.length; i++) {
          for (let j = 0; j < data.results[i].address_components.length; j++) {
            if (!morada && data.results[i].address_components[j].types[0] == "route") {
              morada = data.results[i].address_components[j].long_name;
            }
            if (!porta && data.results[i].address_components[j].types[0] == "street_number") {
              porta = data.results[i].address_components[j].long_name;
            }
            if (!cod_postal && data.results[i].address_components[j].types[0] == "postal_code") {
              cod_postal = data.results[i].address_components[j].long_name;
            }
            if (porta && morada && cod_postal) {
              break;
            }
          }
          if (data.results[i].types[0] == "administrative_area_level_2") {
            municipio = data.results[i].address_components[0].long_name;
            if (porta && morada && municipio && cod_postal) {
              break;
            }
          }
        }
        porta = (porta == null) ? "" : porta;
        morada = (morada == null) ? "" : morada;
        cod_postal = (cod_postal == null) ? "" : cod_postal;
        document.getElementById("morada-morada").value = morada + ", " + porta;
        document.getElementById("morada-codpostal").value = cod_postal;
        if (municipio) {
          // A livraria Select2 obriga ao uso do JQuery
          const selectVal = specificLocaleController.SearchLocaleByName(municipio);
          if (selectVal != undefined) {
            // Selecionar a opção por defeito do select
            // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
            $('.select-localidades').val(selectVal["id"]);
            $('.select-localidades').trigger('change');
          } else {
            Swal.fire('Erro!', "Não foi possível determinar o seu município.", 'error');
          }
        } else {
          Swal.fire('Erro!', "Não foi possível determinar o seu município.", 'error');
        }
      });
    } catch (e) {
      Swal.fire('Erro!', String(e).substring(7), 'error');
    }
  }

  AddAddress() {
    document.querySelector("#btn-add-morada").addEventListener("click", event => {
      event.preventDefault();

      // Verificar se a quantidade das moradas não eliminadas é superior a 5
      let usableAddresses = 0;
      for (let i = 0; i < this.normalUserAddresses.length; i++) {
        if (this.normalUserAddresses[i][4] == false) {
          usableAddresses++;
        }
      }

      if (usableAddresses < 5) {
        let etiqueta = document.getElementById("morada-etiqueta");
        let morada = document.getElementById("morada-morada");
        let codpostal = document.getElementById("morada-codpostal");
        let localidade_id = $('.select-localidades').find(':selected').val();
        let loc_default = document.getElementById("morada-default").checked;

        if (etiqueta.value && morada.value && codpostal.value && localidade_id != $('.select-localidades').find('option').first().val()) {
          if (this.normalUserAddresses.length == 0) {
            // Se não houver nenhuma morada adicionada limpar a mensagem a dizer "Não tem nenhuma morada adicionada"
            document.getElementById("moradas-content").innerHTML = "";
          }

          if (this.normalUserAddresses.length > 0) {
            if (loc_default) {
              // Verificar se já há alguma morada marcada como principal e mudar esse parâmetro
              for (let i = 0; i < this.normalUserAddresses.length; i++) {
                if (this.normalUserAddresses[i][4] == false) {
                  if (this.normalUserAddresses[i][5] == true) {
                    this.normalUserAddresses[i][5] = false;
                  }
                }
              }
              // Alterar o ícone no html
              for (const cartaMorada of document.getElementsByClassName("f-icon")) {
                cartaMorada.innerHTML = `<i class="far fa-diamond me-3 morada-default"></i>`;
              }
            } else {
              // Verificar se há alguma morada principal se não houver settar esta que está a ser criada
              let isAnyAddressDefault = false;
              for (let i = 0; i < this.normalUserAddresses.length; i++) {
                // Verificar se a morada no loop está ativa
                if (this.normalUserAddresses[i][4] == false) {
                  if (this.normalUserAddresses[i][5] == true) {
                    isAnyAddressDefault = true;
                    break;
                  }
                }
              }
              if (!isAnyAddressDefault) {
                loc_default = true;
              } // Else existe pelo menos 1 principal portanto não alterar nada e deixar simplesmente adicionar a morada
            }
          } else {
            loc_default = true;
          }

          let renderDefault = (loc_default) ? `<i class="fas fa-diamond me-3 morada-default"></i>` : `<i class="far fa-diamond me-3 morada-default"></i>`;

          // Guardar os dados no array de moradas
          this.normalUserAddresses.push([etiqueta.value, morada.value, codpostal.value, localidade_id, false, loc_default]);

          // Mostrar mudança no html
          document.getElementById("moradas-content").innerHTML += `
              <div class="d-flex mt-3 mb-4 card-morada align-items-center" id="card-${this.normalUserAddresses.length}">
                <div class="f-icon">${renderDefault}</div>
                <p class="m-0 p-0 etiqueta-${this.normalUserAddresses.length}">${etiqueta.value}</p>
                <div class="ms-auto">
                  <button type="button" class="m-edit" id="${this.normalUserAddresses.length}" data-bs-toggle="modal" data-bs-target="#edit-morada"><i class="fas fa-edit morada-edit me-3"></i></button>
                  <button type="button" class="m-remove" id="${this.normalUserAddresses.length}"><i class="fas fa-trash morada-remove"></i></button>
                </div>
              </div>`;

          // Event listeners para os botões de remover e editar
          this.EditAddress();
          this.RemoveAddress();

          // Fechar o modal
          // Uso do JQuery: https://www.tutorialrepublic.com/faq/how-to-close-a-bootstrap-modal-window-using-jquery.php
          $("#add-morada").modal('hide');

          // Limpar os campos do formulário
          etiqueta.value = "";
          morada.value = "";
          codpostal.value = "";
          loc_default = false;

          // Selecionar a opção por defeito do select
          // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
          $('.select-localidades').val(0);
          $('.select-localidades').trigger('change');
          Swal.fire('Sucesso!', 'A morada foi adicionada com sucesso!', 'success');
        } else {
          Swal.fire('Erro!', "Preencha todos os campos corretamente", 'error');
        }
      } else {
        Swal.fire('Erro!', "Só pode adicionar até 5 moradas!", 'error');
      }
    });
  }

  EditAddress() {
    for (const btnEdit of document.getElementsByClassName("m-edit")) {
      btnEdit.addEventListener("click", event => {
        // https://developer.mozilla.org/pt-BR/docs/Web/API/Event/currentTarget
        const id = event.currentTarget.id;

        // Carregar os dados da morada a editar
        document.getElementById("edit-morada-etiqueta").value = this.normalUserAddresses[id - 1][0];
        document.getElementById("edit-morada-morada").value = this.normalUserAddresses[id - 1][1];
        document.getElementById("edit-morada-codpostal").value = this.normalUserAddresses[id - 1][2];
        document.getElementById("edit-morada-default").checked = this.normalUserAddresses[id - 1][5];


        // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
        $('.edit-select-localidades').val(parseInt(this.normalUserAddresses[id - 1][3]));
        $('.edit-select-localidades').trigger('change');

        // Mandar o index do array para o botao de guardar
        document.querySelector("#btn-edit-morada").classList.add(id - 1);
      });
    }
  }

  SaveAddressEdit() {
    document.querySelector("#btn-edit-morada").addEventListener("click", event => {
      event.preventDefault();

      let etiqueta = document.getElementById("edit-morada-etiqueta");
      let morada = document.getElementById("edit-morada-morada");
      let codpostal = document.getElementById("edit-morada-codpostal");
      let m_default = document.getElementById("edit-morada-default").checked;
      let localidade_id = $('.edit-select-localidades');

      const arrIdx = parseInt(event.target.classList[parseInt(event.target.classList.length) - 1]);

      if (etiqueta.value && morada.value && codpostal.value && (localidade_id.find(':selected').val() != localidade_id.find('option').first().val())) {
        event.target.classList.remove(arrIdx);

        // Atualizar o array de moradas
        this.normalUserAddresses[arrIdx][0] = etiqueta.value;
        this.normalUserAddresses[arrIdx][1] = morada.value;
        this.normalUserAddresses[arrIdx][2] = codpostal.value;
        this.normalUserAddresses[arrIdx][3] = localidade_id.find(':selected').val();

        // Verificar se a morada a ser editada é a default
        if (this.normalUserAddresses[arrIdx][5] == true) {
          // Se esta não continuar a ser a morada default
          if (m_default != this.normalUserAddresses[arrIdx][5]) {
            // Verificar se há alguma morada que possa ser a default
            let wasAnotherPossibleAddressFound = null;
            for (let i = 0; i < this.normalUserAddresses.length; i++) {
              if (i != arrIdx) {
                // Se o index 4 for false quer dizer que a morada ainda é ativa e não foi eliminada
                if (this.normalUserAddresses[i][4] == false) {
                  // Encontrou uma morada que pode ser default
                  this.normalUserAddresses[i][5] = true;
                  this.normalUserAddresses[arrIdx][5] = false;
                  wasAnotherPossibleAddressFound = i;
                  break;
                }
              }
            }
            if (wasAnotherPossibleAddressFound != null) {
              // Alterar o html da que está a ser editada
              document.querySelector("#card-" + parseInt(arrIdx + 1) + " .morada-default").innerHTML = `<i class="far fa-diamond me-3 morada-default"></i>`;
              // Alterar o html da que passa a ser a morada principal
              document.querySelector("#card-" + parseInt(wasAnotherPossibleAddressFound + 1) + " .morada-default").innerHTML = `<i class="fas fa-diamond me-3 morada-default"></i>`;
            } // Else não foi encontrada mais nenhuma possibilidade portanto a morada fica na mesma a principal
          } // A morada principal continua a ser a mesma por opção do utilizador
        } else {
          // A morada a ser editada não é a default mas pode passar a ser
          if (m_default != this.normalUserAddresses[arrIdx][5]) {
            // O utilizador quer que esta passe a ser a morada principal
            // Encontrar a morada que está como default
            let previousDefault = null;
            for (let i = 0; i < this.normalUserAddresses.length; i++) {
              if (i != arrIdx) {
                if (this.normalUserAddresses[i][4] == false) {
                  if (this.normalUserAddresses[i][5] == true) {
                    // Morada default encontrada
                    previousDefault = i;
                    this.normalUserAddresses[i][5] = false;
                    this.normalUserAddresses[arrIdx][5] = true;
                    break;
                  }
                }
              }
            }
            if (previousDefault != null) {
              // Alterar html da morada que deixou de ser principal
              document.querySelector("#card-" + parseInt(previousDefault + 1) + " .morada-default").innerHTML = `<i class="far fa-diamond me-3 morada-default"></i>`;
              // Alterar o html da que passa a ser a morada principal
              document.querySelector("#card-" + parseInt(arrIdx + 1) + " .morada-default").innerHTML = `<i class="fas fa-diamond me-3 morada-default"></i>`;
            }
          }
        }

        // Atualizar html
        document.querySelector(".etiqueta-" + parseInt(arrIdx + 1)).innerHTML = etiqueta.value;

        // Fechar o modal
        // Uso do JQuery: https://www.tutorialrepublic.com/faq/how-to-close-a-bootstrap-modal-window-using-jquery.php
        $("#edit-morada").modal('hide');

        // Limpar os campos do formulário
        etiqueta.value = "";
        morada.value = "";
        codpostal.value = "";

        // Selecionar a opção por defeito do select
        // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
        localidade_id.val(0);
        localidade_id.trigger('change');
        Swal.fire('Sucesso!', 'A morada foi atualizada com sucesso!', 'success');
      } else {
        Swal.fire('Erro!', "Preencha todos os campos corretamente", 'error');
      }
    });
  }

  RemoveAddress() {
    for (const btnRemove of document.getElementsByClassName("m-remove")) {
      btnRemove.addEventListener("click", event => {
        // https://developer.mozilla.org/pt-BR/docs/Web/API/Event/currentTarget
        const id = event.currentTarget.id;

        Swal.fire({
          title: 'Tem a certeza que quer eliminar a morada?',
          showDenyButton: true,
          confirmButtonText: `Sim`,
          denyButtonText: `Cancelar`
        }).then((result) => {
          if (result.isConfirmed) {
            // Verificar a morada a ser removida é a principal
            if (this.normalUserAddresses[id - 1][5]) {
              // Verificar se existe outra morada que possa ser a principal
              let wasAnotherPossibleAddressFound = null;
              for (let i = 0; i < this.normalUserAddresses.length; i++) {
                if (i != (id - 1)) {
                  console.log(this.normalUserAddresses[i]);
                  // Se o index 4 for false quer dizer que a morada ainda é ativa e não foi eliminada
                  if (this.normalUserAddresses[i][4] == false) {
                    // Encontrou uma morada que pode ser default
                    this.normalUserAddresses[i][5] = true;
                    wasAnotherPossibleAddressFound = i;
                    break;
                  }
                }
              }
              if (wasAnotherPossibleAddressFound != null) {
                // Mudar o html da que passa a ser morada principal
                document.querySelector("#card-" + parseInt(wasAnotherPossibleAddressFound + 1) + " .morada-default").innerHTML = `<i class="fas fa-diamond me-3 morada-default"></i>`;
              } // Else não há nenhuma morada para ser a principal portanto deixam de haver moradas
            } // Else a morada é simplesmente removida
            // Atualizar o array
            // As moradas eliminadas ficarão com o index 4 a true - para no registo apenas as que tiverem a false serem enviadas para a localstorage
            this.normalUserAddresses[id - 1][4] = true;
            this.normalUserAddresses[id - 1][5] = false; // forçar a morada eliminada a não ser a principal

            // Atualizar html
            document.getElementById("card-" + id).remove();
            if (!this.normalUserAddresses.some(morada => morada[4] == false)) {
              document.getElementById("moradas-content").innerHTML = `<p style="font-weight: 500; color: var(--azul-pri);">Não tem moradas adicionadas</p>`;
            }
            Swal.fire('Sucesso!', 'A morada foi removida com sucesso!', 'success');
          }
        });
      });
    }
  }
}
