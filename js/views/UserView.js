import UserController from '../controllers/UserController.js'

export default class UserView {
    constructor() {
        this.userController = new UserController();

        // Verificar se o utilizador é normal ou entidade

        this.registoPNOME = document.getElementById("RegistoPNOME");
        this.registoUNOME = document.getElementById("RegistoUNOME");
        this.registoEMAIL = document.getElementById("RegistoEMAIL");
        this.registoPASSWORD = document.getElementById("RegistoPASSWORD");
        this.registoNIF = document.getElementById("RegistoNIF");
        this.registoTLM = document.getElementById("RegistoTLM");
        this.registoDATANASC = document.getElementById("RegistoDATANASC");
        this.tempRegistoCONSEMAIL = document.getElementById("RegistoCONSEMAIL");
        this.registoSUBMIT = document.getElementById("RegistoSUBMIT");
        this.registoCONSEMAIL = this.tempRegistoCONSEMAIL.value == "on" ? true : false;
        this.bindRegisterForm();
    }

    bindRegisterForm() {
      this.registoSUBMIT.addEventListener('click', () => {
        try {
          this.userController.register(
            this.registoPNOME.value,
            this.registoUNOME.value,
            this.registoEMAIL.value,
            this.registoPASSWORD.value,
            this.registoTLM.value,
            this.registoNIF.value,
            this.registoDATANASC.value,
            this.registoCONSEMAIL);
          alert("Utilizador registado com sucesso!");
        } catch (e) {
          alert("Erro!" + e);
        }
      });
    }
}
