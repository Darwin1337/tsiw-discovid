import UserController from '../controllers/UserController.js';

export default class NavbarView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();
    this.BindEditButton()

  }
  BindEditButton(){
    document.getElementById("ativar-campos").addEventListener("click", () => {
      for(const input of document.querySelectorAll("#campos-editar-perfil input")){
        input.disabled=false
      }

      document.getElementById("guardar-alteracoes").style.visibility="visible"
      document.getElementById("ativar-campos").style.visibility="hidden"
    });
    document.getElementById("guardar-alteracoes").addEventListener("click", () => {
      document.getElementById("guardar-alteracoes").style.visibility="hidden"
      document.getElementById("ativar-campos").style.visibility="visible"
      for(const input of document.querySelectorAll("#campos-editar-perfil input")){
        input.disabled=true
      }
    });
  }
}
