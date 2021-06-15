import UserController from '../controllers/UserController.js';
import MarcacoesController from '../controllers/MarcacoesController.js';
import LocaleController from '../controllers/LocaleController.js';
import TestsController from '../controllers/TestsController.js';
import AvaliacoesController from '../controllers/AvaliacoesController.js';
import GamificacoesController from '../controllers/GamificacoesController.js';

export default class EncomendasView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();
    // Instanciar o MarcacoesController para ser possível aceder ao métodos dos utilizadores
    this.marcacaoController = new MarcacoesController();
    // Instanciar o LocalesController para ser possível aceder ao métodos dos utilizadores
    this.localeController = new LocaleController();
    // Instanciar o TestsController para ser possível aceder ao métodos dos utilizadores
    this.testsController = new TestsController();
    // Instanciar o AvaliacoesController para ser possível aceder ao métodos dos utilizadores
    this.avaliacoesController = new AvaliacoesController();
    // Instanciar o GamificacoesController para ser possível adicionar pontos ao utilizador
    this.gamificacoesController = new GamificacoesController();

    this.currentPage = document.querySelector("body");
    if (this.currentPage.id=="marcacoes") {
      if(this.userController.getLoggedInUserType()=="posto"){
        //Caso seja posto
        this.MostrarMarcacoesPosto(1);
      }
      else{
        //Caso seja user normal
        this.MostrarMarcacoes(1);
      }
    }
  }

  AddEstadosToSelect(target,id) {
    const estados = this.marcacaoController.GetAllEstados();
    const select = document.querySelector(target);
    for (const estado of estados) {
      if (estado.id_estado==id) {
        select.innerHTML += `<option selected="selected" value="${estado.id_estado}">${estado['nome']}</option>`;
      }
      else{
        select.innerHTML += `<option value="${estado.id_estado}">${estado['nome']}</option>`;
      }
    }
  }

  AddResultadosToSelect(target,id) {
    const resultados = this.marcacaoController.GetAllResultados();
    const select = document.querySelector(target);
    for (const resultado of resultados) {
      if (resultado.id_resultado==id) {
        select.innerHTML += `<option selected="selected" value="${resultado.id_resultado}">${resultado['nome']}</option>`;
      }
      else{
        select.innerHTML += `<option value="${resultado.id_resultado}">${resultado['nome']}</option>`;
      }
    }
  }

  MostrarMarcacoesPosto(ordem){
    this.UpdateEstadosResultados()
    document.getElementById("pills-marcacoes").innerHTML=""
    const marcacoes = this.marcacaoController.GetAllMarcacoes();
    let aux=true
    let first=true
    if (ordem==1) {
      for (let i = 0; i <marcacoes.length; i++) {
        if (marcacoes[i].id_entidade==this.userController.getLoggedInUserData().id) {
          aux=false
          let estadoData=this.marcacaoController.estados.find(estado => estado.id_estado==marcacoes[i].id_estado)
          let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)
          let moradas=this.userController.endEntidade.find(morada => morada.id_entidade==marcacoes[i].id_entidade)
          let testes=this.testsController.testes.find(teste => teste.id_teste==marcacoes[i].id_teste)
          let resultado=this.marcacaoController.resultados.find(resultado => resultado.id_resultado==marcacoes[i].id_resultado)

          const d=new Date(marcacoes[i].data_marcacao)
          const a=new Date()

          let data=new Date(marcacoes[i].data_marcacao)
          data=data.toLocaleDateString()
          let horas=new Date(marcacoes[i].data_marcacao)
          if (horas.getMinutes()<10) {
            horas=horas.getHours()+":0"+horas.getMinutes()
          }
          else{
            horas=horas.getHours()+":"+horas.getMinutes()
          }

          if (first==true) {
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: <select id="estado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                    <p><b>Resultado: <select id="resultado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">
                    <button class="editar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Editar marcação <span><i class="fad fa-edit"></i></span> </button>
                    <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
              <div class="col-md-3 color-azul-princ" ">
                <h5 class="color-laranja">Ordenar por data</h5>
                <div class="d-flex align-items-center pt-3">
                  <input type="radio" id="ordem-1" name="ordem" class="check-style"><span class="span-checkbox">Mais recente para mais antigo</span>
                </div>
                <div class="d-flex align-items-center pt-3 pb-3" >
                  <input type="radio" id="ordem-2"  name="ordem" checked class="check-style"><span class="span-checkbox">Mais antigo para mais recente</span>
                </div>
              </div>
            </div>
            `

            this.AddEstadosToSelect(`#estado-marcacao-${marcacoes[i].id_marcacao}`, estadoData.id_estado)
            this.AddResultadosToSelect(`#resultado-marcacao-${marcacoes[i].id_marcacao}`, resultado.id_resultado)

            first=false

          }
          else{
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row mt-3">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: <select id="estado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                    <p><b>Resultado: <select id="resultado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">
                    <button class="editar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Editar marcação <span><i class="fad fa-edit"></i></span> </button>
                    <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
            </div>
              `
            this.AddEstadosToSelect(`#estado-marcacao-${marcacoes[i].id_marcacao}`, estadoData.id_estado)
            this.AddResultadosToSelect(`#resultado-marcacao-${marcacoes[i].id_marcacao}`, resultado.id_resultado)

          }
        }
      }
    }
    else{
      for (let i = parseInt(marcacoes.length)-1; i >=0; i--) {
        if (marcacoes[i].id_entidade==this.userController.getLoggedInUserData().id) {
          aux=false
          let estadoData=this.marcacaoController.estados.find(estado => estado.id_estado==marcacoes[i].id_estado)
          let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)
          let moradas=this.userController.endEntidade.find(morada => morada.id_entidade==marcacoes[i].id_entidade)
          let testes=this.testsController.testes.find(teste => teste.id_teste==marcacoes[i].id_teste)
          let resultado=this.marcacaoController.resultados.find(resultado => resultado.id_resultado==marcacoes[i].id_resultado)

          const d=new Date(marcacoes[i].data_marcacao)
          const a=new Date()

          let data=new Date(marcacoes[i].data_marcacao)
          data=data.toLocaleDateString()
          let horas=new Date(marcacoes[i].data_marcacao)
          if (horas.getMinutes()<10) {
            horas=horas.getHours()+":0"+horas.getMinutes()
          }
          else{
            horas=horas.getHours()+":"+horas.getMinutes()
          }

          if (first==true) {
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: <select id="estado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                    <p><b>Resultado: <select id="resultado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">
                    <button class="editar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Editar marcação <span><i class="fad fa-edit"></i></span> </button>
                    <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
              <div class="col-md-3 color-azul-princ" ">
                <h5 class="color-laranja">Ordenar por data</h5>
                <div class="d-flex align-items-center pt-3">
                  <input type="radio" id="ordem-1" name="ordem" class="check-style"><span class="span-checkbox">Mais recente para mais antigo</span>
                </div>
                <div class="d-flex align-items-center pt-3 pb-3" >
                  <input type="radio" id="ordem-2"  name="ordem" checked class="check-style"><span class="span-checkbox">Mais antigo para mais recente</span>
                </div>
              </div>
            </div>
            `

            this.AddEstadosToSelect(`#estado-marcacao-${marcacoes[i].id_marcacao}`, estadoData.id_estado)
            this.AddResultadosToSelect(`#resultado-marcacao-${marcacoes[i].id_marcacao}`, resultado.id_resultado)

            first=false

          }
          else{
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row mt-3">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: <select id="estado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                    <p><b>Resultado: <select id="resultado-marcacao-${marcacoes[i].id_marcacao}"></select> </b></p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">
                    <button class="editar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Editar marcação <span><i class="fad fa-edit"></i></span> </button>
                    <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
                  </div>
                </div>
              </div>
            </div>
              `
            this.AddEstadosToSelect(`#estado-marcacao-${marcacoes[i].id_marcacao}`, estadoData.id_estado)
            this.AddResultadosToSelect(`#resultado-marcacao-${marcacoes[i].id_marcacao}`, resultado.id_resultado)

          }
        }
      }
    }

    if (aux==true) {
      document.getElementById("pills-marcacoes").innerHTML=`
      <h1 class="text-center">Não tem marcações feitas</h1>
      `
    }
    else{
      this.OrdenarMarcacoesPostos()
      this.SetInfoEncomendaPosto()
      this.EditarMarcacaoEstadoPosto()
    }

  }

  EditarMarcacaoEstadoPosto(){

    for (const btnEditarMarcacao of document.getElementsByClassName("editar-marcacao")) {
      btnEditarMarcacao.addEventListener("click", () => {
      this.marcacaoController.UpdateResultadoMarcacao(parseInt(btnEditarMarcacao.id), parseInt(document.getElementById(`resultado-marcacao-${btnEditarMarcacao.id}`).value))
      this.marcacaoController.UpdateEstadoMarcacao(parseInt(btnEditarMarcacao.id), parseInt(document.getElementById(`estado-marcacao-${btnEditarMarcacao.id}`).value))
      Swal.fire('Sucesso!', 'A marcação foi alterada com sucesso!', 'success');
      setTimeout(function(){location.reload()},2000);
      });
    }
  }

  MostrarMarcacoes(ordem){
    this.UpdateEstadosResultados()
    document.getElementById("pills-marcacoes").innerHTML=""
    const marcacoes = this.marcacaoController.GetAllMarcacoes();
    let aux=true
    let first=true
    if (ordem==1) {
      for (let i = 0; i <marcacoes.length; i++) {
        if (marcacoes[i].id_utilizador==this.userController.getLoggedInUserData().id) {
          aux=false
          let estadoData=this.marcacaoController.estados.find(estado => estado.id_estado==marcacoes[i].id_estado)
          let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)
          let moradas=this.userController.endEntidade.find(morada => morada.id_entidade==marcacoes[i].id_entidade)
          let testes=this.testsController.testes.find(teste => teste.id_teste==marcacoes[i].id_teste)
          let resultado=this.marcacaoController.resultados.find(resultado => resultado.id_resultado==marcacoes[i].id_resultado)

          const d=new Date(marcacoes[i].data_marcacao)
          const a=new Date()

          let data=new Date(marcacoes[i].data_marcacao)
          data=data.toLocaleDateString()
          let horas=new Date(marcacoes[i].data_marcacao)
          if (horas.getMinutes()<10) {
            horas=horas.getHours()+":0"+horas.getMinutes()
          }
          else{
            horas=horas.getHours()+":"+horas.getMinutes()
          }

          if (first==true) {
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>${estadoData.nome}</p>
                    <p><b>Resultado: </b>${resultado.nome}</p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">

                  </div>
                </div>
              </div>
              <div class="col-md-3 color-azul-princ" ">
                <h5 class="color-laranja">Ordenar por data</h5>
                <div class="d-flex align-items-center pt-3">
                  <input type="radio" id="ordem-1" name="ordem" class="check-style"><span class="span-checkbox">Mais recente para mais antigo</span>
                </div>
                <div class="d-flex align-items-center pt-3 pb-3" >
                  <input type="radio" id="ordem-2"  name="ordem" checked class="check-style"><span class="span-checkbox">Mais antigo para mais recente</span>
                </div>
              </div>
            </div>
            `

            if (estadoData.id_estado!=4 && d>a) {
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="cancelar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Cancelar <span><i class="fas fa-times"></i></span> </button>
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
            else{
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
            first=false

          }
          else{
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row mt-3">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste em: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>${estadoData.nome}</p>
                    <p><b>Resultado: </b>${resultado.nome}</p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">
                  </div>
                </div>
              </div>
            </div>
              `

            if (estadoData.id_estado!=4 && d>a) {
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="cancelar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Cancelar <span><i class="fas fa-times"></i></span> </button>
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
            else{
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
          }
        }
      }
    }
    else{
      for (let i = parseInt(marcacoes.length)-1; i >=0; i--) {
        if (marcacoes[i].id_utilizador==this.userController.getLoggedInUserData().id) {
          aux=false
          let estadoData=this.marcacaoController.estados.find(estado => estado.id_estado==marcacoes[i].id_estado)
          let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)
          let moradas=this.userController.endEntidade.find(morada => morada.id_entidade==marcacoes[i].id_entidade)
          let testes=this.testsController.testes.find(teste => teste.id_teste==marcacoes[i].id_teste)
          let resultado=this.marcacaoController.resultados.find(resultado => resultado.id_resultado==marcacoes[i].id_resultado)


          const d=new Date(marcacoes[i].data_marcacao)
          const a=new Date()


          let data=new Date(marcacoes[i].data_marcacao)
          data=data.toLocaleDateString()
          let horas=new Date(marcacoes[i].data_marcacao)
          if (horas.getMinutes()<10) {
            horas=horas.getHours()+":0"+horas.getMinutes()
          }
          else{
            horas=horas.getHours()+":"+horas.getMinutes()
          }

          if (first==true) {
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste em: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>${estadoData.nome}</p>
                    <p><b>Resultado: </b>${resultado.nome}</p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">
                  </div>
                </div>
              </div>
              <div class="col-md-3 color-azul-princ ">
                <h5 class="color-laranja">Ordenar por data</h5>
                <div class="d-flex align-items-center pt-3">
                  <input type="radio" id="ordem-1" name="ordem" class="check-style"><span class="span-checkbox">Mais recente para mais antigo</span>
                </div>
                <div class="d-flex align-items-center pt-3 pb-3">
                  <input type="radio" id="ordem-2"  name="ordem" checked class="check-style"><span class="span-checkbox">Mais antigo para mais recente</span>
                </div>
              </div>
            </div>
            `

            if (estadoData.id_estado!=4 && d>a ) {
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="cancelar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Cancelar <span><i class="fas fa-times"></i></span> </button>
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
            else{
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
            first=false

          }
          else{
            document.getElementById("pills-marcacoes").innerHTML += `
            <div class="row flex-column-reverse flex-md-row mt-3">
              <div class="col-md-9 marcacao">
                <div class="row d-flex align-items-center">
                  <div class="col-md-6 color-azul-princ">
                    <h5 class="color-laranja">${postoData.nome}</h5>
                    <p class="pt-4 mb-1">${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} </p>
                    <p>${marcacoes[i].preco_teste}€</p>
                    <p class="descricao-marcacao">Data do teste em: ${data} às ${horas}h | Teste ${testes.nome_teste} &nbsp;&nbsp;<button class="btn-table" onclick="window.location.replace('./testes.html');" style="color: var(--cinza-escuro)"><i class="far fa-question-circle" style="margin-left: 5px;"></i></button></p>
                  </div>
                  <div class="col-md-3 color-azul-princ ">
                    <p><b>Estado: </b>${estadoData.nome}</p>
                    <p><b>Resultado: </b>${resultado.nome}</p>
                  </div>
                  <div class="col-md-3 text-center" id="cancelar-ver-${marcacoes[i].id_marcacao}">
                  </div>
                </div>
              </div>
            </div>
              `


            if (estadoData.id_estado!=4 && d>a ) {
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="cancelar-marcacao mb-4" id="${marcacoes[i].id_marcacao}">Cancelar <span><i class="fas fa-times"></i></span> </button>
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
            else{
              document.getElementById(`cancelar-ver-${marcacoes[i].id_marcacao}`).innerHTML+=`
              <button class="ver-marcacao" id="${marcacoes[i].id_marcacao}" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Detalhes <span><i class="fas fa-arrow-right"></i></span> </button>
              `
            }
          }
        }
      }
    }
    if (aux==true) {
      document.getElementById("pills-marcacoes").innerHTML=`
      <h1 class="text-center">Não tem marcações feitas</h1>
      `
    }
    else{
      this.OrdenarMarcacoes()
      this.SetInfoEncomenda()
      this.CancelarMarcacao()
    }

  }

  SetInfoEncomendaPosto(){
    //Atribuir os valores do localstorage aos campos
    for (const btnVerMarcacao of document.getElementsByClassName("ver-marcacao")) {
      btnVerMarcacao.addEventListener("click", () => {
        const marcacoes = this.marcacaoController.GetAllMarcacoes();
        let test=null
        document.getElementById("render-stars").innerHTML = "";
        document.getElementById("content-avaliacoes").innerHTML = "";
        //limpar div botao avaliar
        document.getElementById("info-marcacao").innerHTML = "";
        for (let i = 0; i < marcacoes.length; i++) {
          if(btnVerMarcacao.id==marcacoes[i].id_marcacao){
            test=marcacoes[i].id_entidade
            let moradasUser=this.userController.endNormal.find(morada => morada.id_utilizador==marcacoes[i].id_utilizador)
            let moradas=this.userController.endEntidade.find(morada => morada.id_entidade==marcacoes[i].id_entidade)
            let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)
            let userData=this.userController.normalUsers.find(user => user.id==marcacoes[i].id_utilizador)
            let testes=this.testsController.testes.find(teste => teste.id_teste==marcacoes[i].id_teste)


            // //Ir buscar a classificação media do posto
            // let classi = 0.0;
            // let quantClassi = 0;
            // for (let j = 0; j < this.avaliacoesController.avaliacoes.length; j++) {
            //   if (parseInt(this.avaliacoesController.avaliacoes[j].id_entidade) == parseInt(postoData.id)) {
            //     classi += parseFloat(this.avaliacoesController.avaliacoes[j].avaliacao);
            //     quantClassi++;
            //   }
            // }
            // classi = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);

            //Ir buscar a data e a hora da marcação
            let data=new Date(marcacoes[i].data_marcacao)
            data=data.toLocaleDateString()
            let horas=new Date(marcacoes[i].data_marcacao)
            if (horas.getMinutes()<10) {
              horas=horas.getHours()+":0"+horas.getMinutes()
            }
            else{
              horas=horas.getHours()+":"+horas.getMinutes()
            }

            // document.getElementById("nome-posto").innerHTML = `${postoData.nome}`;
            // document.getElementById("morada-posto").innerHTML = `${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} `;
            // document.getElementById("horario-posto").innerHTML = `${postoData.horario_inicio} - ${postoData.horario_fim}`;
            // document.getElementById("classificacao-posto").innerHTML = `${classi}`;
            document.getElementById("tipo-teste").innerHTML = `${testes.nome_teste}`;
            document.getElementById("hora-teste").innerHTML = `${data} ${horas}`;
            document.getElementById("valor-teste").innerHTML = `${marcacoes[i].preco_teste}€`;
            document.getElementById("nome-user-nif").innerHTML = `${userData.pnome} ${userData.unome} | NIF: ${userData.nif}`;
            document.getElementById("morada-user").innerHTML = `${moradasUser.morada}, ${moradasUser.cod_postal}, ${this.localeController.GetNameById(moradasUser.id_localidade).nome}`;
            document.getElementById("contacto-user-email").innerHTML = `${userData.tlm} | ${userData.email}`;

            let j=null;
            for (let d = 0; d < this.avaliacoesController.avaliacoes.length; d++) {
              if (parseInt(this.avaliacoesController.avaliacoes[d].id_marcacao)==parseInt(btnVerMarcacao.id)) {
                j=d;
                break;
              }
            }

            if (j!=null) {
              document.getElementById("comentario-marcacao").innerHTML=`
                <div >
                  <h4 class="color-azul-princ mt-4 mb-2">Avaliação do cliente</h4>
                  <div class="bg-pd-br">
                    <div class="row">
                      <div class="col-md-4 d-flex flex-column align-items-center">
                        <img src="${userData.avatar}">
                        <p>${userData.pnome}</p>
                      </div>
                      <div class="col-md-8 d-flex flex-column justify-content-around">
                      <span> ${this.avaliacoesController.avaliacoes[j].avaliacao} Estrelas </span>
                      <span> ${this.avaliacoesController.avaliacoes[j].comentario}</span>
                      </div>
                    </div>
                  </div>
                </div>
              `
            }
            else{
              document.getElementById("comentario-marcacao").innerHTML="O utilizador ainda não fez comentário"
            }
          }
        }
        // verificar a classificação da entidade
        let classi = 0.0;
        let quantClassi = 0;
        for (let f = 0; f < this.avaliacoesController.avaliacoes.length; f++) {
          if (parseInt(this.avaliacoesController.avaliacoes[f].id_entidade) == test) {
            quantClassi++;
            classi += parseFloat(this.avaliacoesController.avaliacoes[f].avaliacao);
            // Mostrar os comentários do utilizador
            const dadosUser = this.userController.normalUsers.find(user => parseInt(user.id) == parseInt(this.avaliacoesController.avaliacoes[f].id_utilizador));
            let renderUserReview = "";
            for (let p = 0; p < parseInt(this.avaliacoesController.avaliacoes[f].avaliacao); p++) {
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
                  <h6 class="color-laranja w-100">${stringsClassi[parseInt(this.avaliacoesController.avaliacoes[f].avaliacao) - 1]}</h6>
                  ${renderUserReview}
                  <p class="color-azul-princ mt-3">${this.avaliacoesController.avaliacoes[f].comentario}</p>
                </div>
                <div class="col-md-2 d-flex  align-items-end">
                  <p class="color-azul-princ">${new Date(this.avaliacoesController.avaliacoes[f].data).toLocaleDateString()}</p>
                </div>
              </div>`;
          }
        }

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

  SetInfoEncomenda(){
    //Atribuir os valores do localstorage aos campos
    for (const btnVerMarcacao of document.getElementsByClassName("ver-marcacao")) {
      btnVerMarcacao.addEventListener("click", () => {
        document.getElementById("content-avaliacoes").innerHTML = "";
        document.getElementById("render-stars").innerHTML = "";

        const dataEntidade = this.userController.entityUsers.find(entidade => parseInt(entidade.id) == parseInt(btnVerMarcacao.id));
        const moradaEntidade = this.userController.endEntidade.find(entidade => parseInt(entidade.id_entidade) == parseInt(btnVerMarcacao.id));
        const marcacoes = this.marcacaoController.GetAllMarcacoes();
        let test=null
        //limpar div botao avaliar
        document.getElementById("info-marcacao").innerHTML=""
        for (let i = 0; i < marcacoes.length; i++) {
          if(btnVerMarcacao.id==marcacoes[i].id_marcacao){
            test=marcacoes[i].id_entidade
            let moradasUser=this.userController.endNormal.find(morada => morada.id_utilizador==marcacoes[i].id_utilizador)
            let moradas=this.userController.endEntidade.find(morada => morada.id_entidade==marcacoes[i].id_entidade)
            let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)
            let testes=this.testsController.testes.find(teste => teste.id_teste==marcacoes[i].id_teste)


            //Ir buscar a classificação media do posto
            let classi = 0.0;
            let quantClassi = 0;
            for (let j = 0; j < this.avaliacoesController.avaliacoes.length; j++) {
              if (parseInt(this.avaliacoesController.avaliacoes[j].id_entidade) == parseInt(postoData.id)) {
                classi += parseFloat(this.avaliacoesController.avaliacoes[j].avaliacao);
                quantClassi++;
              }
            }
            classi = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);

            //Ir buscar a data e a hora da marcação
            let data=new Date(marcacoes[i].data_marcacao)
            data=data.toLocaleDateString()
            let horas=new Date(marcacoes[i].data_marcacao)
            if (horas.getMinutes()<10) {
              horas=horas.getHours()+":0"+horas.getMinutes()
            }
            else{
              horas=horas.getHours()+":"+horas.getMinutes()
            }

            document.getElementById("posto-morada").innerHTML = `${moradas.morada}<br>${moradas.cod_postal} - ${this.localeController.GetNameById(moradas.id_localidade).nome}`;
            document.getElementById("mar-id").innerHTML += `${btnVerMarcacao.id}`;
            document.getElementById("posto-nome").innerHTML = postoData.nome;
            document.getElementById("posto-horario").innerHTML = `Horário: ${postoData.horario_inicio} - ${postoData.horario_fim}`;
            document.getElementById("pontuacao").innerHTML = `${classi}`;
            document.getElementById("tipo-teste").innerHTML = `${testes.nome_teste}`;
            document.getElementById("hora-teste").innerHTML = `${data} ${horas}`;
            document.getElementById("valor-teste").innerHTML = `${marcacoes[i].preco_teste}€`;
            document.getElementById("nome-user-nif").innerHTML = `${this.userController.getLoggedInUserData().pnome} ${this.userController.getLoggedInUserData().unome} | NIF: ${this.userController.getLoggedInUserData().nif}`;
            document.getElementById("morada-user").innerHTML = `${moradasUser.morada}, ${moradasUser.cod_postal}, ${this.localeController.GetNameById(moradasUser.id_localidade).nome}`;
            document.getElementById("contacto-user-email").innerHTML = `${this.userController.getLoggedInUserData().tlm} | ${this.userController.getLoggedInUserData().email}`;


            document.getElementById("comentario-marcacao").innerHTML=""

            let j=null;
            for (let d = 0; d < this.avaliacoesController.avaliacoes.length; d++) {
              if (parseInt(this.avaliacoesController.avaliacoes[d].id_marcacao)==parseInt(btnVerMarcacao.id)) {
                j=d;
                break;
              }
            }
            if (j!=null) {
                document.getElementById("comentario-marcacao").innerHTML=`
                  <div >
                    <h4 class="color-azul-princ mt-4 mb-2">Avaliação do cliente</h4>
                    <div class="bg-pd-br">
                      <div class="row">
                        <div class="col-md-4 d-flex flex-column align-items-center">
                          <img src="${this.userController.getLoggedInUserData().avatar}">
                          <p>${this.userController.getLoggedInUserData().pnome}</p>
                        </div>
                        <div class="col-md-8 d-flex flex-column justify-content-around">
                        <span> ${this.avaliacoesController.avaliacoes[j].avaliacao} Estrelas </span>
                        <span> ${this.avaliacoesController.avaliacoes[j].comentario}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                `
            }
            else{
              if (marcacoes[i].id_estado==5) {
                document.getElementById("info-marcacao").innerHTML+=`
              <form id="avaliar-form">
              <h3 class="mt-3">Avaliar</h3>
                <div class="row">
                  <div class="col-12 d-flex flex-direction-column">
                    <span>Estrelas a atribuir</span>
                    <input type="number" min="1" max="5" id="avaliacao-a-dar" required>
                  </div>
                </div>
                <div class="row d-flex ">
                  <div class="col-12 d-flex flex-direction-column">
                    <span>Comentário</span>
                    <input type="text" id="comentario-a-dar" required>
                  </div>
                </div>
                <button class="w-100 avaliar-posto mt-3" id="avaliar-posto">Avaliar posto</button>
              </form>
                `
              this.AvaliarPosto(postoData.id,marcacoes[i].id_marcacao)
              this.AtribuirPontosAvaliacao()
              break
              }

            }
          }
        }
        // verificar a classificação da entidade
        let classi = 0.0;
        let quantClassi = 0;
        for (let f = 0; f < this.avaliacoesController.avaliacoes.length; f++) {
          if (parseInt(this.avaliacoesController.avaliacoes[f].id_entidade) == test) {
            quantClassi++;
            classi += parseFloat(this.avaliacoesController.avaliacoes[f].avaliacao);
            // Mostrar os comentários do utilizador
            const dadosUser = this.userController.normalUsers.find(user => parseInt(user.id) == parseInt(this.avaliacoesController.avaliacoes[f].id_utilizador));
            let renderUserReview = "";
            for (let p = 0; p < parseInt(this.avaliacoesController.avaliacoes[f].avaliacao); p++) {
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
                  <h6 class="color-laranja w-100">${stringsClassi[parseInt(this.avaliacoesController.avaliacoes[f].avaliacao) - 1]}</h6>
                  ${renderUserReview}
                  <p class="color-azul-princ mt-3">${this.avaliacoesController.avaliacoes[f].comentario}</p>
                </div>
                <div class="col-md-2 d-flex  align-items-end">
                  <p class="color-azul-princ">${new Date(this.avaliacoesController.avaliacoes[f].data).toLocaleDateString()}</p>
                </div>
              </div>`;
          }
        }

        document.getElementById("quant-avaliacoes").innerHTML = `Avaliações <span>(${quantClassi} classificação/ções)</span>`;
        classi = quantClassi > 0 ? parseFloat(classi / quantClassi).toFixed(2) : parseFloat(0.0).toFixed(2);
        document.getElementById("pontuacao").innerHTML = String(parseFloat(classi).toFixed(2)).replace(".", ",");
        let renderStars = "";
        for (let j = 0; j < Math.floor(classi); j++) {
          renderStars += `<img src="..\\img\\star.png">`;
        }
        document.getElementById("render-stars").innerHTML = classi == 0.0 ? "<b>Sem classificação</b>" : `${renderStars}`;
        // Pintar a tira que corresponde oa número na classificação
        for (let k = 1; k <= 5; k++) {
          document.getElementsByClassName("span-" + k + "estrelas")[0].style.backgroundColor = "#C8C8C8";
        }
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

  OrdenarMarcacoes(){
    //Ordenar marcacoes por data
    document.getElementById("ordem-1").addEventListener("click",()=>{
      this.MostrarMarcacoes(2)
      document.getElementById("ordem-1").checked=true
    })
    document.getElementById("ordem-2").addEventListener("click",()=>{
      this.MostrarMarcacoes(1)
      document.getElementById("ordem-2").checked=true
    })
  }

  OrdenarMarcacoesPostos(){
    //Ordenar marcacoes por data
    document.getElementById("ordem-1").addEventListener("click",()=>{
      this.MostrarMarcacoesPosto(2)
      document.getElementById("ordem-1").checked=true
    })
    document.getElementById("ordem-2").addEventListener("click",()=>{
      this.MostrarMarcacoesPosto(1)
      document.getElementById("ordem-2").checked=true
    })
  }

  CancelarMarcacao(){
    for (const btnCancelarMarcacao of document.getElementsByClassName("cancelar-marcacao")) {
      btnCancelarMarcacao.addEventListener("click", () => {
        this.marcacaoController.CancelarMarcacao(btnCancelarMarcacao.id)
        Swal.fire('Sucesso!', 'A sua marcação foi cancelada com sucesso!', 'success');
        setTimeout(function(){location.reload()},2000);
      });
    }
  }

  AvaliarPosto(id_entidade,id_marcacao){
    document.getElementById("avaliar-form").addEventListener("submit", event=>{
      event.preventDefault();
      this.avaliacoesController.RegisterReview(this.userController.getLoggedInUserData().id,id_entidade,id_marcacao,document.getElementById("avaliacao-a-dar").value,document.getElementById("comentario-a-dar").value)
      Swal.fire('Sucesso!', 'O seu comentario foi registado com sucesso!', 'success');
      setTimeout(function(){location.reload()},2000);
    })
  }

  AtribuirPontosAvaliacao(){
    document.getElementById("avaliar-posto").addEventListener("click", ()=>{
      this.userController.UpdateUserPoints(this.gamificacoesController.pontos_avaliacao[0].pontos)
    })
  }

  UpdateEstadosResultados(){
    const marcacoes = this.marcacaoController.GetAllMarcacoes();
    for (let i = 0; i <marcacoes.length; i++) {
      //Para user posto

      if (this.userController.getLoggedInUserType()=="posto") {
        if(marcacoes[i].id_entidade==this.userController.getLoggedInUserData().id){
          let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)

          const d=new Date(marcacoes[i].data_marcacao)
          const a=new Date()

          if (marcacoes[i].id_estado==4) {
            this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,2)
          }
          else if(marcacoes[i].id_estado!=5){
            if(d>a){
              if (marcacoes[i].id_estado!=1) {
                this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,1)
              }
              if (marcacoes[i].id_resultado!=1 && marcacoes[i].id_resultado!=2) {
                this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,1)
              }
            }
            else if(a>d){
              this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,3)
            }

          }
          else if(d>a && marcacoes[i].id_estado==5){
            this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,3)
            this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,1)
          }

        }
      }
      else{
        if (marcacoes[i].id_utilizador==this.userController.getLoggedInUserData().id) {

          let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)

          const d=new Date(marcacoes[i].data_marcacao)
          const a=new Date()

          if (postoData.registado==true) {
            if (marcacoes[i].id_estado==4) {
              this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,2)
            }
            else if(marcacoes[i].id_estado!=5){
              if(d>a){
                if (marcacoes[i].id_estado!=1) {
                  this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,1)
                }
                if (marcacoes[i].id_resultado!=1 && marcacoes[i].id_resultado!=2) {
                  this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,1)
                }
              }
              else if(a>d){
                this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,3)
              }

            }
            else if(d>a && marcacoes[i].id_estado==5){
              this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,3)
              this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,1)
            }
          }
          else{
            if (marcacoes[i].id_estado!=2 && marcacoes[i].id_estado!=4) {
                this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,2)
              }
            if (marcacoes[i].id_resultado!=2) {
              this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,2)
            }
          }
        }
      }
    }
  }
}
