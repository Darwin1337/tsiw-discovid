import TestsController from '../controllers/TestsController.js';
import PostosController from '../controllers/PostosController.js';

export default class LojaView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    //this.testsController = new TestsController();
    this.postosController = new PostosController();
    this.MostrarPostos();
  }

  MostrarPostos(){
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
                            <button type="button" style="min-width: 115px;" class="btn btn-laranja" name="button">Detalhes&nbsp;<i style="font-size: .75rem" class="fas fa-chevron-right"></i></button>
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

}
