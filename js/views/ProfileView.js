import UserController from '../controllers/UserController.js';
import PostoController from '../controllers/PostosController.js';
import LocaleController from '../controllers/LocaleController.js';

export default class NavbarView {
  constructor() {
    // Instanciar o UserController para ser possível aceder ao métodos dos utilizadores
    this.userController = new UserController();

    this.postoController = new PostoController();

    // Instanciar o LocaleController para ser possível adicionar as localidades aos selects
    this.localeController = new LocaleController();

    // Event listeners para quando o utilizador pretende editar o seu perfil e guardar as suas alterações
    this.BindEditButtons();

    

    this.currentPage = document.querySelector("body");
    if (this.currentPage.id == "editar-perfil") {
      this.VerificarTipoEMostrar();
      
      
    }
  }

  AddLocalesToSelect(target) {
    const localidades = this.localeController.GetAllLocales();
    const select = document.querySelector(target);
    for (const localidade of localidades) {
      select.innerHTML += `<option value="${localidade['id']}">${localidade['nome']}</option>`;
    }
  }

  VerificarTipoEMostrar(){
    const userInfo = this.userController.getLoggedInUserType();
    if (userInfo=="posto") {
      document.querySelector("#campos-editar-perfil").innerHTML=`
      <div class="row">
        <div class="col-md-6 mt-3">
          <span>Nome</span>
          <input type="text" class="input-login-registar" id="posto-nome" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>E-mail</span>
          <input type="text" class="input-login-registar" id="posto-email" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Palavra-Passe</span>
          <input type="text" class="input-login-registar"  id="posto-password" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Website</span>
          <input type="text" class="input-login-registar" id="posto-website" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Hora de abertura</span>
          <input type="time" class="input-login-registar" id="posto-horario-abertura" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Hora de fecho</span>
          <input type="time" class="input-login-registar" id="posto-horario-fecho" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Tempo de consulta</span>
          <input type="text" class="input-login-registar" id="posto-tempo-consulta" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Morada</span>
          <input type="text" class="input-login-registar" id="posto-morada" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Codigo Postal</span>
          <input type="text" class="input-login-registar" id="posto-cod_postal" disabled value="">
        </div>
        <div class="col-md-6 mt-3">
          <span>Localidade</span>
          <select class="select-localidades-edit" style="width: 100%; height: 40px;" disabled required>
            <option disabled="disabled" value="0" selected>Localidade</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 mt-3">
          <span>Drive</span>
          <input type="checkbox" class="input-login-registar" id="posto-drive" disabled value="">
        </div>
        <div class="col-md-3 mt-3">
          <span>Call Me</span>
          <input type="checkbox" class="input-login-registar" id="posto-call" disabled value="">
        </div>
      </div>
      `
      $('.select-localidades-edit').select2({
        searchInputPlaceholder: 'Pesquisar localidade...'
      });
      // Carregar a informação para os inputs;
      this.AddLocalesToSelect(".select-localidades-edit");
      this.SetProfileInfoPosto();
      
    }
    else{
      document.querySelector("#campos-editar-perfil").innerHTML=`
      <div class="col-md-12 d-flex flex-column align-items-center align-self-center">
        <img class="" id="avatar-profile">
        <input type="text" class="mt-3" id="avatar-profile-text" disabled>
      </div>
      <div class="col-md-6 mt-3">
        <span>Primeiro Nome</span>
        <input type="text" class="input-login-registar" id="user-pnome" disabled value="">
      </div>
      <div class="col-md-6 mt-3">
        <span>E-mail</span>
        <input type="text" class="input-login-registar"  id="user-email" disabled value="">
      </div>
      <div class="col-md-6 mt-3">
        <span>Ultimo Nome</span>
        <input type="text" class="input-login-registar" id="user-unome" disabled value="">
      </div>
      <div class="col-md-6 mt-3">
        <span>Palavra-Passe</span>
        <input type="text" class="input-login-registar"  id="user-password" disabled value="">
      </div>
      <div class="col-md-6 mt-3">
        <span>Morada</span>
        <input type="text" class="input-login-registar" id="user-morada" disabled value="">
      </div>
      <div class="col-md-6 mt-3">
        <span>Nº Telemovel</span>
        <input type="text" class="input-login-registar" id="user-tlm" disabled value="">
      </div>
      <div class="col-md-6 mt-3">
        <span>CEP</span>
        <input type="text" class="input-login-registar" id="user-cep" disabled value="">
      </div>
      <div class="col-md-6 mt-3">
        <span>Pontos Conquistados: <span id="user-pontos"></span></span>
      </div>
      `
      this.SetProfileInfoNormal();
    }
  }

  BindEditButtons() {
    document.getElementById("ativar-campos").addEventListener("click", () => {
      for (const input of document.querySelectorAll("#campos-editar-perfil input")) {
        input.disabled = false;
        
      }
      for (const select of document.querySelectorAll("#campos-editar-perfil select")) {
        select.disabled = false;
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
      for (const select of document.querySelectorAll("#campos-editar-perfil select")) {
        select.disabled = true;
      }
      const userInfo = this.userController.getLoggedInUserType();
      if (userInfo=="posto") {
        this.UpdatePostosInfo()
      }
      else{
        this.UpdateUserInfo()
      }
    });
  }

  SetProfileInfoPosto() {
    const userInfo = this.userController.getLoggedInUserData();
    const userInfoEnderecos = this.userController.getAllEntityEnderecos();
    for (let i = 0; i < userInfoEnderecos.length; i++) {
      if (userInfo.id==userInfoEnderecos[i].id_entidade) {
        document.getElementById("posto-morada").value = userInfoEnderecos[i].morada;
        document.getElementById("posto-cod_postal").value = userInfoEnderecos[i].cod_postal;
        console.log(userInfoEnderecos[i].id_localidade)
        console.log($('.select-localidades-edit').val(userInfoEnderecos[i].id_localidade))
        $('.select-localidades-edit').val(userInfoEnderecos[i].id_localidade);
        $('.select-localidades-edit').trigger('change');
        break
      }
    }
    document.getElementById("posto-nome").value = userInfo.nome;
    document.getElementById("posto-email").value = userInfo.email;
    document.getElementById("posto-password").value = userInfo.password;
    document.getElementById("posto-website").value = userInfo.website;
    document.getElementById("posto-horario-abertura").value = userInfo.horario_inicio;
    document.getElementById("posto-horario-fecho").value = userInfo.horario_fim;
    document.getElementById("posto-tempo-consulta").value = userInfo.intervalo_consulta;
    document.getElementById("posto-drive").checked = userInfo.drive_thru;
    document.getElementById("posto-call").checked = userInfo.call_me;
  }

  SetProfileInfoNormal() {
    const userInfo = this.userController.getLoggedInUserData();
    document.getElementById("avatar-profile").src = userInfo.avatar;
    document.getElementById("avatar-profile-text").value = userInfo.avatar;
    document.getElementById("user-pnome").value = userInfo.pnome;
    document.getElementById("user-email").value = userInfo.email;
    document.getElementById("user-unome").value = userInfo.unome;
    document.getElementById("user-password").value = userInfo.password;
    // document.getElementById("posto-website").value = userInfo.website;
    // document.getElementById("posto-horario-abertura").value = userInfo.horario_inicio;
    // document.getElementById("posto-horario-fecho").value = userInfo.horario_fim;
    // document.getElementById("posto-tempo-consulta").value = userInfo.intervalo_consulta;
    // document.getElementById("posto-drive").checked = userInfo.drive_thru;
    // document.getElementById("posto-call").checked = userInfo.call_me;
    
    //document.getElementById("user-cep").value=this.userController.getLoggedInUserData().email;
  }

  //Editar postos no editar perfil
  UpdatePostosInfo() {
    try {
      const userInfo = this.userController.getLoggedInUserData();
      //enviar dados para PostosController -> EditPostos
      this.postoController.EditPosto(
        userInfo.id,
        document.getElementById("posto-nome").value,
        document.getElementById("posto-email").value,
        document.getElementById("posto-password").value,
        document.getElementById("posto-website").value,
        document.getElementById("posto-horario-abertura").value,
        document.getElementById("posto-horario-fecho").value,
        document.getElementById("posto-tempo-consulta").value,
        document.getElementById("posto-morada").value,
        document.getElementById("posto-cod_postal").value,
        $('.select-localidades-edit').val(),
        document.getElementById("posto-drive").checked,
        document.getElementById("posto-call").checked
        )
    } catch (e) {
      Swal.fire('Erro!', String(e).substring(7), 'error');
    }
  }

  //falta aqui!!!!!!
  UpdateUserInfo() {
    try {
      console.log("Event listener a funcionar :)");
      // if ($("#TipoUser").val() == "Utilizador normal") {
      //   this.userController.atualizar(
      //     this.registoPNOME.value,
      //     this.registoUNOME.value,
      //     this.registoEMAIL.value,
      //     this.registoPASSWORD.value,
      //     this.registoTLM.value,
      //     this.registoNIF.value,
      //     this.registoDATANASC.value,
      //     this.registoCONSEMAIL.checked);
      // } else {
      //   // pass
      // }
      // Swal.fire('Sucesso!', 'O registo foi concluído com sucesso!', 'success');
      // setTimeout(() => {
      //   location.reload();
      // }, 2000);
    } catch (e) {
      Swal.fire('Erro!', String(e).substring(7), 'error');
    }
  }
}
