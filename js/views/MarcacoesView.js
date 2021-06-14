import UserController from '../controllers/UserController.js';
import MarcacoesController from '../controllers/MarcacoesController.js';
import LocaleController from '../controllers/LocaleController.js';
import TestsController from '../controllers/TestsController.js';
import AvaliacoesController from '../controllers/AvaliacoesController.js';

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

    this.currentPage = document.querySelector("body");
    if (this.currentPage.id=="marcacoes") {
      if(this.userController.getLoggedInUserType()=="posto"){
        //Caso seja posto
      }
      else{
        //Caso seja user normal
        this.MostrarMarcacoes(1);
      }
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

          let data=new Date(marcacoes[i].data_marcacao.slice(0,-1) + "+01:00")
          data=data.toLocaleDateString()
          let horas=new Date(marcacoes[i].data_marcacao.slice(0,-1) + "+01:00")
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
                    <p>${marcacoes[i].preco}</p>
                    <p class="descricao-marcacao">Marcação realizada em: ${data} às ${horas} | Teste ${testes.nome_teste} &nbsp;&nbsp;<i class="far fa-question-circle"></i></p>
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
                    <p>${marcacoes[i].preco}</p>
                    <p class="descricao-marcacao">Marcação realizada em: ${data} às ${horas} | Teste ${testes.nome_teste} &nbsp;&nbsp;<i class="far fa-question-circle"></i></p>
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


          let data=new Date(marcacoes[i].data_marcacao.slice(0,-1) + "+01:00")
          data=data.toLocaleDateString()
          let horas=new Date(marcacoes[i].data_marcacao.slice(0,-1) + "+01:00")
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
                    <p>${marcacoes[i].preco}</p>
                    <p class="descricao-marcacao">Marcação realizada em: ${data} às ${horas} | Teste ${testes.nome_teste} &nbsp;&nbsp;<i class="far fa-question-circle"></i></p>
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
                    <p>${marcacoes[i].preco}</p>
                    <p class="descricao-marcacao">Marcação realizada em: ${data} às ${horas} | Teste ${testes.nome_teste} &nbsp;&nbsp;<i class="far fa-question-circle"></i></p>
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

  SetInfoEncomenda(){
    //Atribuir os valores do localstorage aos campos
    for (const btnVerMarcacao of document.getElementsByClassName("ver-marcacao")) {
      btnVerMarcacao.addEventListener("click", () => {
        const marcacoes = this.marcacaoController.GetAllMarcacoes();
        //limpar div botao avaliar
        document.getElementById("info-marcacao").innerHTML=""
        for (let i = 0; i < marcacoes.length; i++) {
          if(btnVerMarcacao.id==marcacoes[i].id_marcacao){
            let moradasUser=this.userController.endNormal.find(morada => morada.id_utilizador==marcacoes[i].id_utilizador)
            let moradas=this.userController.endEntidade.find(morada => morada.id_entidade==marcacoes[i].id_entidade)
            let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)
            let testes=this.testsController.testes.find(teste => teste.id_teste==marcacoes[i].id_teste)
            let avaliacoes=this.avaliacoesController.avaliacoes.find(avaliacao => avaliacao.id_entidade==marcacoes[i].id_entidade)

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
            let data=new Date(marcacoes[i].data_marcacao.slice(0,-1) + "+01:00")
            data=data.toLocaleDateString()
            let horas=new Date(marcacoes[i].data_marcacao.slice(0,-1) + "+01:00")
            if (horas.getMinutes()<10) {
              horas=horas.getHours()+":0"+horas.getMinutes()
            }
            else{
              horas=horas.getHours()+":"+horas.getMinutes()
            }

            

            document.getElementById("nome-posto").innerHTML = `${postoData.nome}`;
            document.getElementById("morada-posto").innerHTML = `${moradas.morada}, ${moradas.cod_postal}, ${this.localeController.GetNameById(moradas.id_localidade).nome} `;
            document.getElementById("horario-posto").innerHTML = `${postoData.horario_inicio} - ${postoData.horario_fim}`;
            document.getElementById("classificacao-posto").innerHTML = `${classi}`;
            document.getElementById("tipo-teste").innerHTML = `${testes.nome_teste}`;
            document.getElementById("hora-teste").innerHTML = `${data} ${horas}`;
            document.getElementById("valor-teste").innerHTML = `${marcacoes[i].preco}`;
            document.getElementById("nome-user-nif").innerHTML = `${this.userController.getLoggedInUserData().pnome} ${this.userController.getLoggedInUserData().unome} | NIF: ${this.userController.getLoggedInUserData().nif}`;
            document.getElementById("morada-user").innerHTML = `${moradasUser.morada}, ${moradasUser.cod_postal}, ${this.localeController.GetNameById(moradasUser.id_localidade).nome}`;
            document.getElementById("contacto-user-email").innerHTML = `${this.userController.getLoggedInUserData().tlm} | ${this.userController.getLoggedInUserData().email}`;

            if (avaliacoes==undefined && marcacoes[i].id_estado==5) {
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
            }
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
    document.getElementById("avaliar-form").addEventListener("submit", ()=>{
      this.avaliacoesController.RegisterReview(this.userController.getLoggedInUserData().id,id_entidade,id_marcacao,document.getElementById("avaliacao-a-dar").value,document.getElementById("comentario-a-dar").value)
      Swal.fire('Sucesso!', 'O seu comentario foi registado com sucesso!', 'success');
      setTimeout(function(){location.reload()},2000);
    })
  }

  UpdateEstadosResultados(){
    const marcacoes = this.marcacaoController.GetAllMarcacoes();
    for (let i = 0; i <marcacoes.length; i++) {
      if (marcacoes[i].id_utilizador==this.userController.getLoggedInUserData().id) {
        
        let postoData=this.userController.entityUsers.find(posto => posto.id==marcacoes[i].id_entidade)

        const d=new Date(marcacoes[i].data_marcacao)
        const a=new Date()   


        if (postoData.registado==false) {
          if (marcacoes[i].id_estado!=2) {
            this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,2)
          }
          if (marcacoes[i].id_resultado!=2) {
            this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,2)
          }
        }
        if (postoData.registado==true && d>a) {
          if (marcacoes[i].id_estado!=3) {
            this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,3)
          }
          if (marcacoes[i].id_resultado!=1) {
            this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,1)
          }
        }
        if (postoData.registado==true && a>d) {
          if (marcacoes[i].id_estado<4) {
            this.marcacaoController.UpdateEstadoMarcacao(marcacoes[i].id_marcacao,1)
          }
          if (marcacoes[i].id_resultado<3) {
            this.marcacaoController.UpdateResultadoMarcacao(marcacoes[i].id_marcacao,1)
          }
        }
        
      }
    }
  }
}
