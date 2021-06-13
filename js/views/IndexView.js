import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'
import TestsController from '../controllers/TestsController.js'
import AvaliacoesController from '../controllers/AvaliacoesController.js'
import MarcacoesController from '../controllers/MarcacoesController.js'
import indexInstance from '../app.js'

export default class IndexView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Instanciar o TestsController para ser possível adicionar os testes aos selects
    this.testsController = new TestsController();

    // Instanciar a AvaliacoesController para ser possível aceder às avaliações dos utilizadores
    this.avaliacoesController = new AvaliacoesController();

    // Instanciar a MarcacoesController para ser possível aceder às marcações de cada entidade
    this.marcacoesController = new MarcacoesController();

    // Adicionar as localidades presentes na localstorage ao select de localidades
    this.AddLocalesToSelect(".select-localidades");

    // Adicionar as localidades presentes na localstorage ao select de localidades
    this.AddLocalesToSelect(".select-localidades-2");

    // Adicionar os tipos de teste presentes na localstorage ao select dos testes
    this.AddTestsToSelect(".select-testes");

    // Dar bind ao callback da API do GoogleMaps ao método da classe
    window.InitMap = this.InitMap.bind(this);

    // Adicionar o script à pagina HTML
    this.AddGoogleMapsScriptToHTML();

    // Event listener para o botão de aplicar filtros
    this.UpdateResultCards();

    // Event listener para o botão de ceder localização
    this.BindAllowGeolocation();

    // Array que ficará com os markers do mapa
    this.arrMapMarkers = []

    // Assim que o mapa tiver disponível mandar a info do user para os botões
    window.addEventListener("DOMContentLoaded", this.SelectUserLocale.bind(this));
  }

  SelectUserLocale() {
    // Verificar se o utilizador estiver logado, se estiver, settar o select das localidades com a sua morada
    if (this.userController.isAnyUserLoggedIn()) {
      if (this.userController.getLoggedInUserType() == "normal") {
        const usrAddress = this.userController.endNormal.find(morada => parseInt(morada.id_utilizador) == parseInt(this.userController.getLoggedInUserData().id));
        // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
        $('.select-localidades').val(usrAddress.id_localidade);
        $('.select-localidades').trigger('change');
        $('.select-localidades-2').val(usrAddress.id_localidade);
        $('.select-localidades-2').trigger('change');
      }
    }
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

  BindAllowGeolocation() {
    // Ir buscar a latitude e longitude do utilizador
    document.getElementById("ceder-localizacao").addEventListener("click", function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4', function(data) {
            for (var i = 0; i < data.results.length; i++) {
              if (data.results[i].types[0] == "administrative_area_level_2") {
                document.getElementById("localidade-resultados").innerHTML = `A mostrar resultados de: <span>${data.results[i].address_components[0].long_name}</span>`;
                // Instanciar a classe de localidades porque não temos acesso a ela neste $.getJSON
                const specificLocaleController = new LocaleController();
                const localidade = specificLocaleController.localidades.find(local => String(local.nome).toLowerCase() == String(data.results[i].address_components[0].long_name).toLowerCase());
                // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
                $('.select-localidades').val(localidade.id);
                $('.select-localidades').trigger('change');
                $('.select-localidades-2').val(localidade.id);
                $('.select-localidades-2').trigger('change');

                document.getElementById("btn-apply-filters").click();
                break;
              }
            }
          });
        });
      } else {
        Swal.fire('Erro!', "O seu navegador não suporta geolocalização!", 'error');
      }
    });
  }

  AddGoogleMapsScriptToHTML() {
    let s = document.createElement('script');
    s.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyBOFQ0OVgZsAodKndRbtDlnXhBvyCaOpQ4&callback=InitMap';
    s.type = 'text/javascript';
    s.defer = true;
    document.getElementsByTagName("head")[0].appendChild(s);
  }

  InitMap() {
    this.map = new google.maps.Map(document.getElementById("googleMap"), {
      zoom: 10,
      center: {
        lat: 41.1749771,
        lng: -8.5462703
      },
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      draggable: true,
      scrollwheel: false
    });
    this.geocoder = new google.maps.Geocoder();
    if (this.userController.isAnyUserLoggedIn() && this.userController.getLoggedInUserType() == "normal") { document.getElementById("btn-apply-filters").click(); }
  }

  UpdateResultCards() {
    document.getElementById("btn-apply-filters").addEventListener("click", () => {
      // Procurar postos com a localiade selecionada
      // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
      console.log(":)");

      // Eliminar os markers todas as vezes que o botão for carregado
      for (let i= 0; i < this.arrMapMarkers.length; i++) {
        this.arrMapMarkers[i].setMap(null);
      }

      const localidadeSelecionada = parseInt($('.select-localidades').find(':selected').val());
      if (localidadeSelecionada != parseInt($('.select-localidades').find('option').first().val())) {
        document.getElementById("localidade-resultados").innerHTML = `A mostrar resultados de: <span>${this.localeController.GetNameById(localidadeSelecionada).nome}</span>`
        let countResults = 0;
        document.getElementById("postos-encontrados").innerHTML = "";
        for (let i = 0; i < this.userController.endEntidade.length; i++) {
          if (parseInt(this.userController.endEntidade[i].id_localidade) == localidadeSelecionada) {
            countResults++;
            const entidadeData = this.userController.entityUsers.find(entidade => parseInt(entidade.id) == parseInt(this.userController.endEntidade[i].id_entidade));
            const isDriveThru = entidadeData.drive_thru ? `<span><i class="fas fa-car" data-toggle="tooltip" data-placement="top" title="Posto drive-thru"></i></span>` : ``;
            const allowsCallMe = entidadeData.call_me ? `<span><i class="fas fa-phone" data-toggle="tooltip" data-placement="top" title="Call me disponível"></i></span>` : ``;
            let lowestPrice = parseFloat("9999.99");
            let availableTests = [];
            // verificar a classificação da entidade
            let classi = 0.0;
            let quantClassi = 0;
            for (let j = 0; j < this.avaliacoesController.avaliacoes.length; j++) {
              if (parseInt(this.avaliacoesController.avaliacoes[j].id_entidade) == parseInt(entidadeData.id)) {
                classi += parseFloat(this.avaliacoesController.avaliacoes[j].avaliacao);
                quantClassi++;
              }
            }
            classi = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);
            let renderStars = classi == 0.0 ? "<span stlye='font-weight: 900;'>Sem classificação</span>" : "";
            for (let j = 0; j < Math.floor(classi); j++) {
              renderStars += `<i class="fas fa-star"></i>`;
            }
            for (let j = 0; j < this.userController.testesEntidade.length; j++) {
              if (parseInt(this.userController.testesEntidade[j].id_entidade) == parseInt(entidadeData.id)) {
                availableTests.push(this.testsController.GetNameById(parseInt(this.userController.testesEntidade[j].id_teste)).nome_teste);
                if (parseFloat(this.userController.testesEntidade[j].preco) <= parseFloat(lowestPrice)) {
                  lowestPrice = parseFloat(this.userController.testesEntidade[j].preco);
                }
              }
            }
            // Mostrar os cartões
            document.getElementById("postos-encontrados").innerHTML += `
              <div class="card-sta">
                <div class="row" >
                  <div class="col-md-5 col-xl-8">
                    <div class="card-text">
                      <div class="card-title">
                        <p>${entidadeData.nome}</p>
                      </div>
                      <div class="card-subtitle mb-3">
                        <p>${this.userController.endEntidade[i].morada}, ${this.userController.endEntidade[i].cod_postal}, ${this.localeController.GetNameById(parseInt(localidadeSelecionada)).nome}</p>
                      </div>
                      <div class="card-description mb-1">
                        <p>${availableTests.join(" | ")}<button class="btn-table" onclick="window.location.replace('./html/testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                      </div>
                      <div class="card-rating">
                        <span class="">${parseFloat(classi).toFixed(2)} • </span>
                        ${renderStars}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-7 col-xl-4">
                    <div class="card-buttons d-flex">
                      <div class="row first-row">
                        <div class="col-4">
                          <span>${lowestPrice.toFixed(2)}€</span>
                        </div>
                        <div class="col-8">
                          <button type="button" style="min-width: 115px;" class="btn btn-laranja detalhes-posto" data-bs-toggle="modal" data-bs-target="#detalhes-posto-modal" id="${entidadeData.id}" name="button">Detalhes&nbsp;<i style="font-size: .75rem" class="fas fa-chevron-right"></i></button>
                        </div>
                      </div>
                      <div class="row second-row">
                        <div class="card-icons col d-flex justify-content-flex-end">
                          ${isDriveThru}
                          ${allowsCallMe}
                          <span><i class="fas fa-check-circle" data-toggle="tooltip" data-placement="top" title="Entidade confirmada"></i></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;

            // Adicionar markers das localizações ao mapa
            const map = this.map
            const myLatLng = { lat: this.userController.endEntidade[i].lat, lng: this.userController.endEntidade[i].long };
            this.arrMapMarkers.push(
              new google.maps.Marker({
                position: myLatLng,
                map
              })
            );
          }
        }
        if (countResults == 0) {
          document.getElementById("postos-encontrados").innerHTML = "<b>Não foram encontrados resultados para os termos pesquisados.</b>"
          document.getElementById("qnt-resultados").innerHTML = "(0 resultado(s))"
        } else {
          // Ativar as tooltips dos cartões
          $(function () { $('[data-toggle="tooltip"]').tooltip() });
          document.getElementById("qnt-resultados").innerHTML = "(" + countResults + " resultado(s))"
          // Event listener de informações do posto
          this.SetModalInfo();
        }
      } else {
        Swal.fire('Erro!', "Selecione uma localidade válida!", 'error');
      }
    });
  }

  SetModalInfo() {
    for (const btnDetalhes of document.getElementsByClassName("detalhes-posto")) {
      btnDetalhes.addEventListener("click", () => {
        const dataEntidade = this.userController.entityUsers.find(entidade => parseInt(entidade.id) == parseInt(btnDetalhes.id));
        const moradaEntidade = this.userController.endEntidade.find(entidade => parseInt(entidade.id_entidade) == parseInt(btnDetalhes.id));
        document.getElementById("posto-morada").innerHTML = `${moradaEntidade.morada}<br>${moradaEntidade.cod_postal} - ${this.localeController.GetNameById(moradaEntidade.id_localidade).nome}`;
        document.getElementById("posto-nome").innerHTML = dataEntidade.nome;
        document.getElementById("posto-horario").innerHTML = `Horário: ${dataEntidade.horario_inicio} - ${dataEntidade.horario_fim}`;
        // verificar a classificação da entidade
        let classi = 0.0;
        let quantClassi = 0;
        for (let j = 0; j < this.avaliacoesController.avaliacoes.length; j++) {
          if (parseInt(this.avaliacoesController.avaliacoes[j].id_entidade) == parseInt(btnDetalhes.id)) {
            quantClassi++;
            classi += parseFloat(this.avaliacoesController.avaliacoes[j].avaliacao);
            // Mostrar os comentários do utilizador
            const dadosUser = this.userController.normalUsers.find(user => parseInt(user.id) == parseInt(this.avaliacoesController.avaliacoes[j].id_utilizador));
            let renderUserReview = "";
            for (let p = 0; p < parseInt(this.avaliacoesController.avaliacoes[j].avaliacao); p++) {
              renderUserReview += `<img src="..\\img\\star.png">`;
            }
            const stringsClassi = ["Muito Mau", "Mau", "Razoável", "Bom", "Excelente"];
            document.getElementById("content-avaliacoes").innerHTML += `
              <div class="bg-pd-br d-flex mb-4">
                <div class="col-md-2 d-flex flex-wrap justify-center align-center me-3">
                  <img src="${dadosUser.avatar}" class="w-75">
                  <p class="text-center">${dadosUser.pnome}</p>
                </div>
                <div class="col-md-8 text-start avaliacao-entidade">
                  <h6 class="color-laranja w-100">${stringsClassi[parseInt(this.avaliacoesController.avaliacoes[j].avaliacao) - 1]}</h6>
                  ${renderUserReview}
                  <p class="color-azul-princ mt-3">${this.avaliacoesController.avaliacoes[j].comentario}</p>
                </div>
                <div class="col-md-2 d-flex  align-items-end">
                  <p class="color-azul-princ">${new Date(this.avaliacoesController.avaliacoes[j].data).toLocaleDateString()}</p>
                </div>
              </div>`;
          }
        }

        // let usedDates = []
        // for (let j = 0; j < this.marcacoesController.marcacoes.length; j++) {
        //   if (parseInt(btnDetalhes.id) == parseInt(this.marcacoesController.marcacoes[j].id_entidade)) {
        //     const curData = new Date(this.marcacoesController.marcacoes[j].data_marcacao);
        //     usedDates.append(
        //       {
        //         "dia": curData.getDay(),
        //         "mes": curData.getMonth(),
        //         "ano": curData.getYear(),
        //         "ho"
        //       }
        //     );
        //   }
        // }

        document.getElementById("quant-avaliacoes").innerHTML = `Avaliações <span>(${quantClassi} classificação/ções)</span>`;
        classi = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);
        document.getElementById("pontuacao").innerHTML = String(parseFloat(classi).toFixed(2)).replace(".", ",");
        let renderStars = "";
        for (let j = 0; j < Math.floor(classi); j++) {
          renderStars += `<img src="..\\img\\star.png">`;
        }
        document.getElementById("render-stars").innerHTML = classi == 0.0 ? "<b>Sem classificação</b>" : `${renderStars}`;
        // Pintar a tira que corresponde oa número na classificação
        if (Math.floor(classi) > 0) {
          document.getElementsByClassName("span-" + parseInt(Math.floor(classi)) + "estrelas")[0].style.backgroundColor = "green";
        } else {
          for (let k = 1; k <= 5; k++) {
            document.getElementsByClassName("span-" + k + "estrelas")[0].style.backgroundColor = "#C8C8C8";
          }
        }
      });
    }
  }
}
