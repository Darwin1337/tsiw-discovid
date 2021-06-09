import UserController from '../controllers/UserController.js'
import LocaleController from '../controllers/LocaleController.js'
import TestsController from '../controllers/TestsController.js'
import PostosController from '../controllers/PostosController.js';

export default class IndexView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Instanciar o TestsController para ser possível adicionar os testes aos selects
    this.testsController = new TestsController();

    // Instanciar o PostosController para ser possível adicionar os testes aos selects
    this.postosController = new PostosController();

    // Adicionar as localidades presentes na localstorage ao select de localidades
    this.AddLocalesToSelect(".select-localidades");

    // Adicionar os tipos de teste presentes na localstorage ao select dos testes
    this.AddTestsToSelect(".select-testes");

    this.currentPage = document.querySelector("body");
    if (this.currentPage.id=="index") {
      this.MostrarPostos();
      this.SetPostosInfo();
    }

    // Verificar se o utilizador estiver logado, se estiver, settar o select das localidades com a sua morada
    // this.user
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

  MostrarPostos(){
    //Mostrar postos na pagina inicial
    const x = this.postosController.GetAllPostos();
    const x1 = this.postosController.GetAllEnderecos();
    const x2 = this.postosController.GetAllLocalidades();
    for (let i = 0; i < x.length; i++) {
      for (let d = 0; d < x1.length; d++) {
        for (let s = 0; s < x2.length; s++) {
          if (x1[d].id_localidade==x2[s].id) {
            if (x1[d].id_entidade==x[i].id) {
              document.getElementById("postos-encontrados").innerHTML += `
                <div class="card-sta">
                  <div class="row" >     
                    <div class="col-md-5 col-xl-8">
                      <div class="card-text">
                        <div class="card-title">
                          <p>${x[i].nome}</p>
                        </div>
                        <div class="card-subtitle mb-3">
                          <p>${x1[d].morada}, ${x1[d].cod_postal}, ${x2[s].nome}</p>
                        </div>
                        <div class="card-description mb-1">
                          <p>5km • Diagnóstico | Antigénio | Serológico<i class="far fa-question-circle" style="margin-left: 5px;"></i></p>
                        </div>
                        <div class="card-rating">
                          <span class="">4,3 • </span>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-7 col-xl-4">
                      <div class="card-buttons d-flex">
                        <div class="row first-row">
                          <div class="col-4">
                            <span>~14€</span>
                          </div>
                          <div class="col-8">
                            <button type="button" style="min-width: 115px;" class="btn btn-laranja detalhes-posto" data-bs-toggle="modal" data-bs-target="#detalhes-posto-modal" id="${x[i].id}" name="button">Detalhes&nbsp;<i style="font-size: .75rem" class="fas fa-chevron-right"></i></button>
                          </div>
                        </div>
                        <div class="row second-row">
                          <div class="card-icons col d-flex justify-content-flex-end">
                            <span><i class="fas fa-car" data-toggle="tooltip" data-placement="top" title="Posto drive-thru"></i></span>
                            <span><i class="fas fa-phone" data-toggle="tooltip" data-placement="top" title="Call me disponível"></i></span>
                            <span><i class="fas fa-check-circle" data-toggle="tooltip" data-placement="top" title="Entidade confirmada"></i></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                `
            }
          }
        }
      }
    }
  }

  SetPostosInfo(){
    //Colocar informações sobre o posto selecionado
    for (const btnDetalhes of document.getElementsByClassName("detalhes-posto")) {
      btnDetalhes.addEventListener("click", () => {
        const x = this.postosController.GetAllPostos();
        const x1 = this.postosController.GetAllEnderecos();
        const x2 = this.postosController.GetAllLocalidades();
        for (let i = 0; i < x.length; i++) {
          for (let d = 0; d < x1.length; d++) {
            for (let s = 0; s < x2.length; s++) {
              if(btnDetalhes.id==x1[d].id_entidade){
                if (x1[d].id_localidade==x2[s].id) {
                  if (x1[d].id_entidade==x[i].id) {
                    document.getElementById("posto-morada").innerHTML = `${x1[i].morada}, ${x1[i].cod_postal}, ${x2[s].nome}`;
                    document.getElementById("posto-nome").innerHTML = x[i].nome;
                    document.getElementById("posto-distancia").innerHTML = "10Km";
                    document.getElementById("posto-horario").innerHTML = `${x[i].horario_inicio} - ${x[i].horario_fim}`;
                  }
                }
              }
            }
          }
        }
      });
    }
  }
}
