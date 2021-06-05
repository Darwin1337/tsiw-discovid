import UserController from '../controllers/UserController.js';

export default class NavbarView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Event listeners para quando o utilizador pretende editar o seu perfil e guardar as suas alterações
    this.BindEditButtons();

    this.SetProfileInfo();

  }
  BindEditButtons(){
    document.getElementById("ativar-campos").addEventListener("click", () => {
      for (const input of document.querySelectorAll("#campos-editar-perfil input")) {
        input.disabled = false;
      }
      document.getElementById("guardar-alteracoes").style.visibility = "visible";
      document.getElementById("ativar-campos").style.visibility = "hidden";
    });

    document.getElementById("guardar-alteracoes").addEventListener("click", () => {
      document.getElementById("guardar-alteracoes").style.visibility = "hidden";
      document.getElementById("ativar-campos").style.visibility = "visible";
      for (const input of document.querySelectorAll("#campos-editar-perfil input")) {
        input.disabled = true;
      }
      this.UpdateUserInfo()
      
    });
  }
  
  //Inserir dados nas input boxes
  SetProfileInfo(){
    document.getElementById("user-id").value=this.userController.getLoggedInUserData().id
    document.getElementById("user-pnome").value=this.userController.getLoggedInUserData().pnome
    document.getElementById("user-email").value=this.userController.getLoggedInUserData().email
    document.getElementById("user-unome").value=this.userController.getLoggedInUserData().unome
    document.getElementById("user-password").value=this.userController.getLoggedInUserData().password
    document.getElementById("user-tlm").value=this.userController.getLoggedInUserData().tlm
    document.getElementById("user-pontos").innerHTML=this.userController.getLoggedInUserData().pontos
    //document.getElementById("user-cep").value=this.userController.getLoggedInUserData().email
  }

  //falta aqui!!!!!!
  UpdateUserInfo(){
    try {
      if ($("#TipoUser").val() == "Utilizador normal") {
        this.userController.atualizar(
          this.registoPNOME.value,
          this.registoUNOME.value,
          this.registoEMAIL.value,
          this.registoPASSWORD.value,
          this.registoTLM.value,
          this.registoNIF.value,
          this.registoDATANASC.value,
          this.registoCONSEMAIL.checked);
      } else {
        // pass
      }
      Swal.fire('Sucesso!', 'O registo foi concluído com sucesso!', 'success');
      setTimeout(() => { location.reload(); }, 2000);
    } catch (e) {
      Swal.fire('Erro!', String(e).substring(7), 'error');
    }
  }

}
