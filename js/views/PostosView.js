import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'
import TestsController from '../controllers/TestsController.js'
import AvaliacoesController from '../controllers/AvaliacoesController.js'
import MarcacoesController from '../controllers/MarcacoesController.js'
import GamificacoesController from '../controllers/GamificacoesController.js'
import EncomendasController from '../controllers/EncomendasController.js'

export default class LojaView {
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

    // Instanciar o GamificacoesController para ser possível aceder às percentagens da rifa
    this.gamificacoesController = new GamificacoesController();

    // Instanciar o EncomendasController para ser possível aceder adicionar a rifa ao utilizador
    this.encomendasController = new EncomendasController();

    // Adicionar as localidades presentes na localstorage ao select de localidades
    this.AddLocalesToSelect(".select-localidades");

    // Adicionar os tipos de teste presentes na localstorage ao select dos testes
    this.AddTestsToSelect(".select-testes");

    // Mostrar todos os postos
    this.MostrarTodosOsPostos();

    // Bind ao botão de aplicar filtros
    this.BindApplyFilters();

    // Event listener do botão de fazer marcação
    this.FinalizeAppointment();
  }

  MostrarTodosOsPostos() {
    let finalArray = this.userController.entityUsers;

    const testeSelecionado = parseInt($('.select-testes').find(':selected').val());
    let minPrice = parseFloat(document.getElementById("preco_min").value);
    let maxPrice = parseFloat(document.getElementById("preco_max").value);

    if (testeSelecionado != parseInt($('.select-testes').find('option').first().val())) {
      const filtroLocalidade = this.userController.endEntidade;
      const arrayFiltros = []
      for (let j = 0; j < filtroLocalidade.length; j++) {
        arrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(filtroLocalidade[j].id_entidade)));
      }
      let scndArrayFiltros = [];
      // Verificar se alguma entidade do arrayFiltros tem o teste selecionado
      for (let a = 0; a < arrayFiltros.length; a++) {
        const testesEntidadeFiltros = this.userController.testesEntidade.filter(teste => parseInt(teste.id_entidade) == parseInt(arrayFiltros[a].id));
        for (let b = 0; b < testesEntidadeFiltros.length; b++) {
          if (parseInt(testesEntidadeFiltros[b].id_teste) == testeSelecionado) {
            if (testesEntidadeFiltros.some(teste => parseFloat(teste.preco) >= minPrice && parseFloat(teste.preco) <= maxPrice)) {
              scndArrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(testesEntidadeFiltros[b].id_entidade)));
              break;
            }
          }
        }
      }
      finalArray = scndArrayFiltros;
    } else {
      const filtroLocalidade = this.userController.endEntidade;
      const arrayFiltros = []
      for (let j = 0; j < filtroLocalidade.length; j++) {
        arrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(filtroLocalidade[j].id_entidade)));
      }
      let scndArrayFiltros = [];
      // Verificar se alguma entidade do arrayFiltros tem o teste selecionado
      for (let a = 0; a < arrayFiltros.length; a++) {
        const testesEntidadeFiltros = this.userController.testesEntidade.filter(teste => parseInt(teste.id_entidade) == parseInt(arrayFiltros[a].id));
        for (let b = 0; b < testesEntidadeFiltros.length; b++) {
          if (testesEntidadeFiltros.some(teste => parseFloat(teste.preco) >= minPrice && parseFloat(teste.preco) <= maxPrice)) {
            scndArrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(testesEntidadeFiltros[b].id_entidade)));
            break;
          }
        }
      }
      finalArray = scndArrayFiltros;
    }

    if (document.getElementById("drive-thru").checked) { finalArray = finalArray.filter(posto => posto.drive_thru == true); }
    if (document.getElementById("call-me").checked) { finalArray = finalArray.filter(posto => posto.call_me == true); }

    if (document.getElementById("schedules-high").checked) {
      for (let g = 0; g < finalArray.length; g++) {
        finalArray[g].quantMarcacoes = 0;
      }
      for (let g = 0; g < this.marcacoesController.marcacoes.length; g++) {
        try {
          let idx = finalArray.findIndex(posto => parseInt(posto.id) == parseInt(this.marcacoesController.marcacoes[g].id_entidade));
          finalArray[idx].quantMarcacoes += 1;
        } catch (e) {
          // A entidade da marcação nao pertence à localidade selecionada
          continue;
        }
      }
      finalArray.sort(this.#CompararMarcacoes);
    }

    if (document.getElementById("schedules-low").checked) {
      for (let g = 0; g < finalArray.length; g++) {
        finalArray[g].quantMarcacoes = 0;
      }
      for (let g = 0; g < this.marcacoesController.marcacoes.length; g++) {
        try {
          let idx = finalArray.findIndex(posto => parseInt(posto.id) == parseInt(this.marcacoesController.marcacoes[g].id_entidade));
          finalArray[idx].quantMarcacoes += 1;
        } catch (e) {
          // A entidade da marcação nao pertence à localidade selecionada
          continue;
        }
      }
      finalArray.reverse(this.#CompararMarcacoes);
    }

    if (document.getElementById("rating-high").checked) {
      for (let g = 0; g < finalArray.length; g++) {
        finalArray[g].rating = 0;
      }
      for (let r = 0; r < finalArray.length; r++) {
        let classi = 0.0;
        let quantClassi = 0;
        for (let i = 0; i < this.avaliacoesController.avaliacoes.length; i++) {
          if (parseInt(this.avaliacoesController.avaliacoes[i].id_entidade) == parseInt(finalArray[r].id)) {
            classi += parseFloat(this.avaliacoesController.avaliacoes[i].avaliacao);
            quantClassi++;
          }
        }
        finalArray[r].rating = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);
      }
      finalArray.sort(this.#CompararRating)
    }

    if (document.getElementById("rating-low").checked) {
      for (let g = 0; g < finalArray.length; g++) {
        finalArray[g].rating = 0;
      }
      for (let r = 0; r < finalArray.length; r++) {
        let classi = 0.0;
        let quantClassi = 0;
        for (let i = 0; i < this.avaliacoesController.avaliacoes.length; i++) {
          if (parseInt(this.avaliacoesController.avaliacoes[i].id_entidade) == parseInt(finalArray[r].id)) {
            classi += parseFloat(this.avaliacoesController.avaliacoes[i].avaliacao);
            quantClassi++;
          }
        }
        finalArray[r].rating = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);
      }
      finalArray.reverse(this.#CompararRating)
    }

    this.countResults = 0;
    document.getElementById("postos-encontrados").innerHTML = "";
    for (let i = 0; i < finalArray.length; i++) {
      this.RenderCard(finalArray[i], this.userController.entityUsers.findIndex(posto => parseInt(posto.id) == parseInt(finalArray[i].id)));
    }

    if (this.countResults == 0) {
      document.getElementById("qnt-resultados").innerHTML = "(0 resultado(s))"
      document.getElementById("postos-encontrados").innerHTML = "<b>Não foram encontrados resultados para os termos pesquisados.</b>"
    } else {
      // Ativar as tooltips dos cartões
      // JQuery porque é função do bootstrap
      $(function () { $('[data-toggle="tooltip"]').tooltip() });
      document.getElementById("qnt-resultados").innerHTML = "(" + this.countResults + " resultado(s))"
      // Event listener de informações do posto
      this.SetModalInfo();
    }
  }

  BindApplyFilters() {
    document.getElementById("apply-filters").addEventListener("click", () => {
      document.getElementById("postos-encontrados").innerHTML = "";


      const localidadeSelecionada = parseInt($('.select-localidades').find(':selected').val());
      const testeSelecionado = parseInt($('.select-testes').find(':selected').val());
      let minPrice = parseFloat(document.getElementById("preco_min").value);
      let maxPrice = parseFloat(document.getElementById("preco_max").value);
      let finalArray = []

      if (localidadeSelecionada != parseInt($('.select-localidades').find('option').first().val())) {
        if (testeSelecionado != parseInt($('.select-testes').find('option').first().val())) {
          const filtroLocalidade = this.userController.endEntidade.filter(morada_posto => morada_posto.id_localidade == localidadeSelecionada);
          const arrayFiltros = []
          for (let j = 0; j < filtroLocalidade.length; j++) {
            arrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(filtroLocalidade[j].id_entidade)));
          }
          let scndArrayFiltros = [];
          // Verificar se alguma entidade do arrayFiltros tem o teste selecionado
          for (let a = 0; a < arrayFiltros.length; a++) {
            const testesEntidadeFiltros = this.userController.testesEntidade.filter(teste => parseInt(teste.id_entidade) == parseInt(arrayFiltros[a].id));
            for (let b = 0; b < testesEntidadeFiltros.length; b++) {
              if (parseInt(testesEntidadeFiltros[b].id_teste) == testeSelecionado) {
                if (testesEntidadeFiltros.some(teste => parseFloat(teste.preco) >= minPrice && parseFloat(teste.preco) <= maxPrice)) {
                  scndArrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(testesEntidadeFiltros[b].id_entidade)));
                  break;
                }
              }
            }
          }
          finalArray = scndArrayFiltros;
        } else {
          const filtroLocalidade = this.userController.endEntidade.filter(morada_posto => morada_posto.id_localidade == localidadeSelecionada);
          const arrayFiltros = []
          for (let j = 0; j < filtroLocalidade.length; j++) {
            arrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(filtroLocalidade[j].id_entidade)));
          }
          let scndArrayFiltros = [];
          // Verificar se alguma entidade do arrayFiltros tem o teste selecionado
          for (let a = 0; a < arrayFiltros.length; a++) {
            const testesEntidadeFiltros = this.userController.testesEntidade.filter(teste => parseInt(teste.id_entidade) == parseInt(arrayFiltros[a].id));
            for (let b = 0; b < testesEntidadeFiltros.length; b++) {
              if (testesEntidadeFiltros.some(teste => parseFloat(teste.preco) >= minPrice && parseFloat(teste.preco) <= maxPrice)) {
                scndArrayFiltros.push(this.userController.entityUsers.find(posto => parseInt(posto.id) == parseInt(testesEntidadeFiltros[b].id_entidade)));
                break;
              }
            }
          }
          finalArray = scndArrayFiltros;
        }

        if (document.getElementById("drive-thru").checked) { finalArray = finalArray.filter(posto => posto.drive_thru == true); }
        if (document.getElementById("call-me").checked) { finalArray = finalArray.filter(posto => posto.call_me == true); }

        if (document.getElementById("schedules-high").checked) {
          for (let g = 0; g < finalArray.length; g++) {
            finalArray[g].quantMarcacoes = 0;
          }
          for (let g = 0; g < this.marcacoesController.marcacoes.length; g++) {
            try {
              let idx = finalArray.findIndex(posto => parseInt(posto.id) == parseInt(this.marcacoesController.marcacoes[g].id_entidade));
              finalArray[idx].quantMarcacoes += 1;
            } catch (e) {
              // A entidade da marcação nao pertence à localidade selecionada
              continue;
            }
          }
          finalArray.sort(this.#CompararMarcacoes);
        }

        if (document.getElementById("schedules-low").checked) {
          for (let g = 0; g < finalArray.length; g++) {
            finalArray[g].quantMarcacoes = 0;
          }
          for (let g = 0; g < this.marcacoesController.marcacoes.length; g++) {
            try {
              let idx = finalArray.findIndex(posto => parseInt(posto.id) == parseInt(this.marcacoesController.marcacoes[g].id_entidade));
              finalArray[idx].quantMarcacoes += 1;
            } catch (e) {
              // A entidade da marcação nao pertence à localidade selecionada
              continue;
            }
          }
          finalArray.reverse(this.#CompararMarcacoes);
        }

        if (document.getElementById("rating-high").checked) {
          for (let g = 0; g < finalArray.length; g++) {
            finalArray[g].rating = 0.0;
          }
          for (let r = 0; r < finalArray.length; r++) {
            let classi = 0.0;
            let quantClassi = 0;
            for (let i = 0; i < this.avaliacoesController.avaliacoes.length; i++) {
              if (parseInt(this.avaliacoesController.avaliacoes[i].id_entidade) == parseInt(finalArray[r].id)) {
                classi += parseFloat(this.avaliacoesController.avaliacoes[i].avaliacao);
                quantClassi++;
              }
            }
            finalArray[r].rating = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);
          }
          finalArray.sort(this.#CompararRating)
        }

        if (document.getElementById("rating-low").checked) {
          for (let g = 0; g < finalArray.length; g++) {
            finalArray[g].rating = 0.0;
          }
          for (let r = 0; r < finalArray.length; r++) {
            let classi = 0.0;
            let quantClassi = 0;
            for (let i = 0; i < this.avaliacoesController.avaliacoes.length; i++) {
              if (parseInt(this.avaliacoesController.avaliacoes[i].id_entidade) == parseInt(finalArray[r].id)) {
                classi += parseFloat(this.avaliacoesController.avaliacoes[i].avaliacao);
                quantClassi++;
              }
            }
            finalArray[r].rating = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);
          }
          finalArray.reverse(this.#CompararRating)
        }



        this.countResults = 0;
        for (let i = 0; i < finalArray.length; i++) {
          this.RenderCard(finalArray[i], this.userController.entityUsers.findIndex(posto => parseInt(posto.id) == parseInt(finalArray[i].id)));
        }

        if (this.countResults == 0) {
          document.getElementById("qnt-resultados").innerHTML = "(0 resultado(s))";
          document.getElementById("postos-encontrados").innerHTML = "<b>Não foram encontrados resultados para os termos pesquisados.</b>"
        } else {
          // Ativar as tooltips dos cartões
          // JQuery porque é função do bootstrap
          $(function () { $('[data-toggle="tooltip"]').tooltip() });
          document.getElementById("qnt-resultados").innerHTML = "(" + this.countResults + " resultado(s))"
          // Event listener de informações do posto
          this.SetModalInfo();
        }
      } else {
        this.MostrarTodosOsPostos();
      }
    });
  }

  #CompararMarcacoes(a, b) {
    if (a.quantMarcacoes < b.quantMarcacoes)
        return 1;
    if (a.quantMarcacoes > b.quantMarcacoes)
        return -1;
    return 0;
  }

  #CompararRating(a, b) {
    if (parseFloat(a.rating) < parseFloat(b.rating))
        return 1;
    if (parseFloat(a.rating) > parseFloat(b.rating))
        return -1;
    return 0;
  }

  RenderCard(entidadeData, i) {
    this.countResults++;
    const localidadeSelecionada = parseInt($('.select-localidades').find(':selected').val());
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
                <p>${this.userController.endEntidade[i].morada}, ${this.userController.endEntidade[i].cod_postal}, ${this.localeController.GetNameById(parseInt(this.userController.endEntidade[i].id_localidade)).nome}</p>
              </div>
              <div class="card-description mb-1">
                <p>${availableTests.join(" | ")}<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
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

  SetModalInfo() {
    for (const btnDetalhes of document.getElementsByClassName("detalhes-posto")) {
      btnDetalhes.addEventListener("click", () => {
        // Limpar algumas coisas primeiro
        document.getElementById("content-avaliacoes").innerHTML = "";
        document.getElementById("btn-call-me").innerHTML = "";
        document.getElementById("preco-total").innerHTML = "Selecione todos dados necessários...";
        document.getElementById("quant-avaliacoes").innerHTML = "";
        document.getElementById("mar-id").innerHTML = "";

        const dataEntidade = this.userController.entityUsers.find(entidade => parseInt(entidade.id) == parseInt(btnDetalhes.id));
        const moradaEntidade = this.userController.endEntidade.find(entidade => parseInt(entidade.id_entidade) == parseInt(btnDetalhes.id));
        let isDriveThru = dataEntidade.drive_thru ? `<br><b>Este posto é drive-thru!</b>` : ``;
        document.getElementById("posto-morada").innerHTML = `${moradaEntidade.morada}<br>${moradaEntidade.cod_postal} - ${this.localeController.GetNameById(moradaEntidade.id_localidade).nome}${isDriveThru}`;
        document.getElementById("mar-id").innerHTML += `${btnDetalhes.id}`;
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
                <div class="col-md-2 d-flex flex-column align-items-center me-3">
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
        const dataHoje = new Date();
        let usedDates = []
        for (let j = 0; j < this.marcacoesController.marcacoes.length; j++) {
          if (parseInt(btnDetalhes.id) == parseInt(this.marcacoesController.marcacoes[j].id_entidade)) {
            const curData = new Date(this.marcacoesController.marcacoes[j].data_marcacao);
            // Se as marcações forem numa data e hora superior ao presente adicionar às datas disponíveis
            if (curData > dataHoje) {
              /// verificar se a marcação não está cancelada
              if (this.marcacoesController.marcacoes[j].id_estado != 4) {
                usedDates.push(
                  {
                    "dia": curData.getDate(),
                    "mes": curData.getMonth(),
                    "ano": curData.getFullYear(),
                    "hora": curData.getHours(),
                    "min": curData.getMinutes()
                  }
                );
              }
            }
          }
        }

        const diasMeses = [31, 28, 30, 31, 30, 30, 31, 31, 30, 31, 30, 31];
        let thisMonth = parseInt(dataHoje.getMonth()) + 1
        let thisMonthTotalDays = diasMeses[thisMonth - 1];
        let firstDay = parseInt(dataHoje.getDate()) + 1 > thisMonthTotalDays ? 1 : parseInt(dataHoje.getDate()) + 1;
        document.querySelector(".select-dia").innerHTML = `<option disabled="disabled" value="0" selected>Escolha um dia...</option>`;
        for (let j = 0; j < 14; j++) {
          document.querySelector(".select-dia").innerHTML += `<option value="${firstDay}/${thisMonth}/${dataHoje.getFullYear()}">${firstDay}/${thisMonth}</option>`;
          firstDay++;
          if (firstDay > thisMonthTotalDays) {
            thisMonth++;
            firstDay = 1;
          }
        }

        // Uso do JQuery: https://select2.org/programmatic-control/events
        // Gerar as horas disponíveis para cada dia
        $('.select-dia').on('select2:select', function (e) {
          // É imperativo a data de abertura e a data de fecho serem horas certas (por ex: 08:00h ou 14:00h)
          document.querySelector(".select-hora").innerHTML = `<option disabled="disabled" value="0" selected>Escolha uma hora...</option>`;
          const minAbertura = parseInt(dataEntidade.horario_inicio.split(":")[0]) * 60;
          const minFecho = parseInt(dataEntidade.horario_fim.split(":")[0]) * 60;
          const minAbertos = minAbertura == minFecho ? 1140 : minFecho - minAbertura;
          const quantTestesPorDia = Math.floor(minAbertos / parseInt(dataEntidade.intervalo_consulta));
          const selectedDay = $('.select-dia').find(':selected').val();
          let horaInicial = new Date(selectedDay.split("/")[2] + "-" + ('0' + selectedDay.split("/")[1]).slice(-2) + "-" + selectedDay.split("/")[0] + "T" + dataEntidade.horario_inicio + ":00.000+01:00")

          for (let j = 0; j < quantTestesPorDia; j++) {
            let wasDateAlreadyUsed = false
            for (let z = 0; z < usedDates.length; z++) {
              if (horaInicial.getFullYear() == usedDates[z].ano && horaInicial.getMonth() == usedDates[z].mes && horaInicial.getDate() == usedDates[z].dia && horaInicial.getHours() == usedDates[z].hora && horaInicial.getMinutes() == usedDates[z].min) {
                document.querySelector(".select-hora").innerHTML += `<option disabled value="${('0' + horaInicial.getHours()).slice(-2)}:${('0' + horaInicial.getMinutes()).slice(-2)}">${('0' + horaInicial.getHours()).slice(-2)}:${('0' + horaInicial.getMinutes()).slice(-2)}h</option>`;
                wasDateAlreadyUsed = true;
              }
            }
            if (!wasDateAlreadyUsed) {
              document.querySelector(".select-hora").innerHTML += `<option value="${('0' + horaInicial.getHours()).slice(-2)}:${('0' + horaInicial.getMinutes()).slice(-2)}">${('0' + horaInicial.getHours()).slice(-2)}:${('0' + horaInicial.getMinutes()).slice(-2)}h</option>`;
            }
            horaInicial = new Date(horaInicial.getTime() + parseInt(dataEntidade.intervalo_consulta) * 60000);
          }
        });

        // Uso do JQuery: https://select2.org/programmatic-control/events
        // Mostrar testes e o preço de cada
        document.querySelector(".select-testes-modal").innerHTML = `<option disabled="disabled" value="0" selected>Tipo de teste</option>`;
        for (let z = 0; z < this.userController.testesEntidade.length; z++) {
          if (parseInt(this.userController.testesEntidade[z].id_entidade) == parseInt(dataEntidade.id)) {
            document.getElementsByClassName("select-testes-modal")[0].innerHTML += `<option value="${this.userController.testesEntidade[z].id_teste}">${this.testsController.GetNameById(parseInt(this.userController.testesEntidade[z].id_teste)).nome_teste}</option>`;
          }
        }
        const allEntityTests = this.userController.testesEntidade;
        $('.select-testes-modal').on('select2:select', function (e) {
          for (let z = 0; z < allEntityTests.length; z++) {
            if (parseInt(allEntityTests[z].id_entidade) == parseInt(dataEntidade.id)) {
              if (parseInt(allEntityTests[z].id_teste) == parseInt($('.select-testes-modal').find(':selected').val())) {
                document.getElementById("preco-total").innerHTML = "Valor: " + allEntityTests[z].preco + "€";
                break;
              }
            }
          }
        });

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
        if (dataEntidade.call_me) {
          document.getElementById("btn-call-me").innerHTML = `<button class="btn btn-azul-pri w-100">Pedir para me ligar</button>`;
          this.FinalizeAppointmentCallMe();
        }
      });
    }
  }

  FinalizeAppointment() {
    document.getElementById("btn-realizar-marcacao").addEventListener("click", () => {
      // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
      const tipo_teste = $('.select-testes-modal');
      const data = $('.select-dia');
      const hora = $('.select-hora');

      if (this.userController.getLoggedInUserType() == "normal") {
        const moradaUser = this.userController.endNormal.find(morada => parseInt(morada.id_utilizador) == parseInt(this.userController.getLoggedInUserData().id));

        if ((tipo_teste.find(':selected').val() != tipo_teste.find('option').first().val()) && (data.find(':selected').val() != data.find('option').first().val()) && (hora.find(':selected').val() != hora.find('option').first().val())) {
          try {
            this.marcacoesController.AddNewMarcacao(
              this.userController.getLoggedInUserData().id,
              parseInt(document.getElementById("mar-id").innerHTML),
              new Date(data.find(':selected').val().split("/")[2] + "-" + ('0' + data.find(':selected').val().split("/")[1]).slice(-2) + "-" + data.find(':selected').val().split("/")[0] + "T" + hora.find(':selected').val() + ":00.000+01:00"),
              parseInt(tipo_teste.find(':selected').val()),
              false,
              parseFloat(document.getElementById("preco-total").innerHTML.split("Valor: ")[1].split("€")[0].trim()).toFixed(2)
            );
            this.userController.AdicionarMarcacao(parseInt(this.userController.getLoggedInUserData().id));
            if (parseInt(this.userController.getLoggedInUserData().quant_marcacoes) == parseInt(this.gamificacoesController.quantidade_para_teste_gratis[0].quantidade)) {
              this.userController.RemoveAllMarcacoes(parseInt(this.userController.getLoggedInUserData().id));
              Swal.fire("Parabéns, esta marcação é gratuita!");
            } else {
              Swal.fire('Sucesso!', 'A marcação foi feita com sucesso!', 'success');
            }

            // Verificar se o utilizador ganhou a rifa
            const gen_num = Math.floor(Math.random() * 100);
            if (gen_num <= parseInt(this.gamificacoesController.percentagem_premio[0].percentagem) - 1) {
              // Ganhou!!
              this.encomendasController.AddNewEncomenda(
                parseInt(this.userController.getLoggedInUserData().id),
                new Date(),
                0.00,
                moradaUser.morada,
                moradaUser.cod_postal,
                this.localeController.GetNameById(moradaUser.id_localidade).nome,
                "Gratuito",
                this.userController.getLoggedInUserData().tlm
              );
              const produtosAOferecer = this.gamificacoesController.percentagem_premio[0].produtos_oferta.split(",");
              for (let y = 0; y < produtosAOferecer.length; y++) {
                this.encomendasController.AddNewDetalhesEncomenda(
                  this.encomendasController.encomendas.length,
                  parseInt(produtosAOferecer[y]),
                  1
                );
              }
              Swal.fire("Parabéns, A marcação foi concluída com sucesso e ganhou um kit de prevenção à COVID-19!");
              setTimeout(() => { }, 3000);
            }
            setTimeout(() => {
              location.replace("./marcacoes.html");
            }, 2000);
          } catch (e) {
            Swal.fire('Erro!', String(e).substring(7), 'error');
          }
        } else {
          Swal.fire('Erro!', "Escolha uma opção de todas as informações!", 'error');
        }
      } else {
        Swal.fire('Erro!', "O seu tipo de utilizador não pode fazer marcações!", 'error');
      }
    });
  }

  FinalizeAppointmentCallMe() {
    document.getElementById("btn-call-me").addEventListener("click", () => {
      // Uso do JQuery: https://select2.org/programmatic-control/add-select-clear-items
      const tipo_teste = $('.select-testes-modal');
      const data = $('.select-dia');
      const hora = $('.select-hora');

      if (this.userController.getLoggedInUserType() == "normal") {
        const moradaUser = this.userController.endNormal.find(morada => parseInt(morada.id_utilizador) == parseInt(this.userController.getLoggedInUserData().id));

        if ((tipo_teste.find(':selected').val() != tipo_teste.find('option').first().val()) && (data.find(':selected').val() != data.find('option').first().val()) && (hora.find(':selected').val() != hora.find('option').first().val())) {
          try {
            this.marcacoesController.AddNewMarcacao(
              this.userController.getLoggedInUserData().id,
              parseInt(document.getElementById("mar-id").innerHTML),
              new Date(data.find(':selected').val().split("/")[2] + "-" + ('0' + data.find(':selected').val().split("/")[1]).slice(-2) + "-" + data.find(':selected').val().split("/")[0] + "T" + hora.find(':selected').val() + ":00.000+01:00"),
              parseInt(tipo_teste.find(':selected').val()),
              true,
              parseFloat(document.getElementById("preco-total").innerHTML.split("Valor: ")[1].split("€")[0].trim()).toFixed(2)
            );
            this.userController.AdicionarMarcacao(parseInt(this.userController.getLoggedInUserData().id));
            if (parseInt(this.userController.getLoggedInUserData().quant_marcacoes) == parseInt(this.gamificacoesController.quantidade_para_teste_gratis[0].quantidade)) {
              this.userController.RemoveAllMarcacoes(parseInt(this.userController.getLoggedInUserData().id));
              Swal.fire("Parabéns, esta marcação é gratuita!");
            } else {
              Swal.fire('Sucesso!', 'A marcação foi feita com sucesso!', 'success');
            }

            // Verificar se o utilizador ganhou a rifa
            const gen_num = Math.floor(Math.random() * 100);
            if (gen_num <= parseInt(this.gamificacoesController.percentagem_premio[0].percentagem) - 1) {
              // Ganhou!!
              this.encomendasController.AddNewEncomenda(
                parseInt(this.userController.getLoggedInUserData().id),
                new Date(),
                0.00,
                moradaUser.morada,
                moradaUser.cod_postal,
                this.localeController.GetNameById(moradaUser.id_localidade).nome,
                "Gratuito",
                this.userController.getLoggedInUserData().tlm
              );
              const produtosAOferecer = this.gamificacoesController.percentagem_premio[0].produtos_oferta.split(",");
              for (let y = 0; y < produtosAOferecer.length; y++) {
                this.encomendasController.AddNewDetalhesEncomenda(
                  this.encomendasController.encomendas.length,
                  parseInt(produtosAOferecer[y]),
                  1
                );
              }
              Swal.fire("Parabéns, A marcação foi concluída com sucesso e ganhou um kit de prevenção à COVID-19!");
              setTimeout(() => { }, 3000);
            }
            setTimeout(() => {
              location.replace("./marcacoes.html");
            }, 2000);
          } catch (e) {
            Swal.fire('Erro!', String(e).substring(7), 'error');
          }
        } else {
          Swal.fire('Erro!', "Escolha uma opção de todas as informações!", 'error');
        }
      } else {
        Swal.fire('Erro!', "O seu tipo de utilizador não pode fazer marcações!", 'error');
      }
    });
  }
}
