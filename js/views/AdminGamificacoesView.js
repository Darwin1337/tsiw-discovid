import GamificacoesController from '../controllers/GamificacoesController.js';

export default class AdminGamificacoesView {
  constructor() {
    // Instanciar o GamificacoesController
    this.gamificacoesController = new GamificacoesController();
    this.ListAllGamificacoesEncomenda()
    this.ListAllGamificacoesAvatar()
    this.ListAllGamificacoesAvaliacao()
    this.ListAllGamificacoesPremio()
    this.ListAllGamificacoesTesteGratis()

    this.SetAllGamificacoesEncomendaInfo()
    this.SetAllGamificacoesAvatarInfo()
    this.SetAllGamificacoesAvaliacaoInfo()
    this.SetAllGamificacoesPremioInfo()
    this.SetAllGamificacoesTesteGratis()
  }

  //Encomenda
  ListAllGamificacoesEncomenda() {
    // Lista todos os utilizadores registados
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("tabela-gamificacoes").innerHTML += `
    <tr class="align-middle text-center">
      <td>Pontos Encomenda</td>
      <td>${x[0][0].pontos} Pontos</td>
      <td><span class="icon-remover-edit" id="edit-pontos-encomenda"><i class="far fa-edit"></i></span></td>
    </tr>`;
    this.SetAllGamificacoesEncomendaInfo()
  }

  SetAllGamificacoesEncomendaInfo(){
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("edit-pontos-encomenda").addEventListener("click", ()=>{
      $("#admin-edit-gamificao-encomenda").modal("show")
      document.getElementById("pontos-quantidade").value=x[0][0].pontos
      document.getElementById("gamificacao-encomenda-form").addEventListener("submit", (event)=>{
        event.preventDefault();
        this.EditGamificacaoEncomenda();
        Swal.fire('Sucesso!', "Alteração efetuada com sucesso!", 'success');
        setTimeout(() => {
          location.reload()
        }, 2000);
      })
    })
  }

  EditGamificacaoEncomenda(){
    this.gamificacoesController.EditPontosEncomenda(parseInt(document.getElementById("pontos-quantidade").value))
  }

  //Avatar
  ListAllGamificacoesAvatar() {
    // Lista todos os utilizadores registados
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("tabela-gamificacoes").innerHTML += `
    <tr class="align-middle text-center">
      <td>Pontos Avatar</td>
      <td>${x[1][0].pontos} Pontos</td>
      <td><span class="icon-remover-edit" data-bs-toggle="modal" data-bs-target="#admin-edit-gamificao-avatar" id="edit-pontos-avatar"><i class="far fa-edit"></i></span></td>
    </tr>`;
  }

  SetAllGamificacoesAvatarInfo(){
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("edit-pontos-avatar").addEventListener("click", ()=>{
      document.getElementById("pontos-quantidade-avatar").value=x[1][0].pontos
      document.getElementById("gamificacao-avatar-form").addEventListener("submit", (event)=>{
        event.preventDefault();
        this.EditGamificacaoAvatar();
        Swal.fire('Sucesso!', "Alteração efetuada com sucesso!", 'success');
        setTimeout(() => {
          location.reload()
        }, 2000);
      })
    })
  }

  EditGamificacaoAvatar(){
    this.gamificacoesController.EditPontosAvatar(parseInt(document.getElementById("pontos-quantidade-avatar").value))
  }

  //Avaliação
  ListAllGamificacoesAvaliacao() {
    // Lista todos os utilizadores registados
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("tabela-gamificacoes").innerHTML += `
    <tr class="align-middle text-center">
      <td>Pontos Avaliação</td>
      <td>${x[2][0].pontos} Pontos</td>
      <td><span class="icon-remover-edit" data-bs-toggle="modal" data-bs-target="#admin-edit-gamificao-avaliacao" id="edit-pontos-avaliacao"><i class="far fa-edit"></i></span></td>
    </tr>`;
  }

  SetAllGamificacoesAvaliacaoInfo(){
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("edit-pontos-avaliacao").addEventListener("click", ()=>{
      document.getElementById("pontos-quantidade-avaliacao").value=x[2][0].pontos
      document.getElementById("gamificacao-avaliacao-form").addEventListener("submit", (event)=>{
        event.preventDefault();
        this.EditGamificacaoAvaliacao();
        Swal.fire('Sucesso!', "Alteração efetuada com sucesso!", 'success');
        setTimeout(() => {
          location.reload()
        }, 2000);
      })
    })
  }

  EditGamificacaoAvaliacao(){
    this.gamificacoesController.EditPontosAvaliacao(parseInt(document.getElementById("pontos-quantidade-avaliacao").value))
  }

  //Premio
  ListAllGamificacoesPremio() {
    // Lista todos os utilizadores registados
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("tabela-gamificacoes").innerHTML += `
    <tr class="align-middle text-center">
      <td>Percentagem Premio</td>
      <td>${x[3][0].percentagem}% | ${x[3][0].produtos_oferta}</td>
      <td><span class="icon-remover-edit" data-bs-toggle="modal" data-bs-target="#admin-edit-gamificao-premio" id="edit-pontos-premio"><i class="far fa-edit"></i></span></td>
    </tr>`;
  }

  SetAllGamificacoesPremioInfo(){
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("edit-pontos-premio").addEventListener("click", ()=>{
      document.getElementById("percentagem-premio").value=x[3][0].percentagem
      document.getElementById("artigos-premio").value=x[3][0].produtos_oferta
      document.getElementById("gamificacao-premio-form").addEventListener("submit", (event)=>{
        event.preventDefault();
        this.EditGamificacaoPremio();
        Swal.fire('Sucesso!', "Alteração efetuada com sucesso!", 'success');
        setTimeout(() => {
          location.reload()
        }, 2000);
      })
    })
  }

  EditGamificacaoPremio(){
    this.gamificacoesController.EditPercentagemPremio(parseFloat(document.getElementById("percentagem-premio").value),document.getElementById("artigos-premio").value)
  }

  //Teste Gratis
  ListAllGamificacoesTesteGratis() {
    // Lista todos os utilizadores registados
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("tabela-gamificacoes").innerHTML += `
    <tr class="align-middle text-center">
      <td>Teste Grátis</td>
      <td>${x[4][0].quantidade} Testes</td>
      <td><span class="icon-remover-edit" data-bs-toggle="modal" data-bs-target="#admin-edit-gamificao-teste-gratis" id="edit-teste-gratis"><i class="far fa-edit"></i></span></td>
    </tr>`;
  }

  SetAllGamificacoesTesteGratis(){
    const x = this.gamificacoesController.GetAllGamificacoes();
    document.getElementById("edit-teste-gratis").addEventListener("click", ()=>{
      document.getElementById("quantidade-teste-gratis").value=x[4][0].quantidade
      document.getElementById("gamificacao-teste-gratis-form").addEventListener("submit", (event)=>{
        event.preventDefault();
        this.EditGamificacaoTesteGratis();
        Swal.fire('Sucesso!', "Alteração efetuada com sucesso!", 'success');
        setTimeout(() => {
          location.reload()
        }, 2000);
      })
    })
  }

  EditGamificacaoTesteGratis(){
    this.gamificacoesController.EditTesteGratis(parseInt(document.getElementById("quantidade-teste-gratis").value))
  }

}
