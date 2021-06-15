import UserController from '../controllers/UserController.js'

export default class AutenticacaoView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    // Carregar os inputs para variáveis
    this.LoadLoginInputs();

    // Event listener para quando o formulário de login é submetido
    if (this.userController.getLoggedInUserData()!=null) {
      Swal.fire('Erro!', "Já se encontra logado", 'error');
      setTimeout(() => {
        location.replace("../../")
      }, 2000);
    }
    else{
      this.BindLoginSubmit();
    }

    // Event listener para quando a checkbox de "ver password" é checkada
    this.BindViewPasswordCheckbox("view-password", "loginPASSWORD");
  }

  LoadLoginInputs() {
    // Liga todos os inputs do login a variáveis
    this.loginFORM = document.getElementById("form-login");
    this.loginEMAIL = document.getElementById("loginEMAIL");
    this.loginPASSWORD = document.getElementById("loginPASSWORD");
  }

  BindLoginSubmit() {
    this.loginFORM.addEventListener('submit', event => {
      event.preventDefault();
      const users=this.userController.getAllNormalUsers();
      for(let i=0; i<users.length;i++){
        if (this.loginEMAIL.value==users[i].email) {
          if (users[i].bloqueado==false) {
            try {
              this.userController.UserLogin(this.loginEMAIL.value, this.loginPASSWORD.value);
              Swal.fire('Sucesso!', 'A sessão foi iniciada com sucesso!', 'success');
              setTimeout(() => {
                location.replace("../../")
              }, 2000);
            } catch (e) {
              Swal.fire('Erro!', String(e).substring(7), 'error');
            }
          }
          else{
            Swal.fire('Erro!', "O utilizador está bloqueado", 'error');
          }
        }
      }
      
    });
  }

  BindViewPasswordCheckbox(checkbox, target) {
    // Ativa a checbox de "ver password" dos formulários do login e do registo
    document.getElementById(checkbox).addEventListener("click", () => {
      if (document.getElementById(checkbox).checked == true) {
        document.getElementById(target).setAttribute("type", "text");
      } else {
        document.getElementById(target).setAttribute("type", "password");
      }
    });
  }
}
