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


const userType=document.querySelector("#TipoUser")
const form=document.querySelector("form")
userType.addEventListener("change", ()=>{
  if(userType.value=="Utilizador normal"){
    form.innerHTML=`<div class="mb-2">
    <input id="RegistoPNOME" type="text" class="input-login-registar" name="p_nome" placeholder="Primeiro nome" value="">
  </div>
  <div class="mb-2">
    <input id="RegistoUNOME" type="text" class="input-login-registar" name="u_nome" placeholder="Último nome" value="">
  </div>
  <div class="mb-2">
    <input id="RegistoEMAIL" type="email" class="input-login-registar" name="email" placeholder="Endereço de e-mail" value="">
  </div>
  <div class="mb-2">
    <input id="RegistoPASSWORD" type="text" class="input-login-registar" name="password" placeholder="Password" value="">
  </div>
  <div class="mb-2">
    <input id="RegistoNIF" type="number" class="input-login-registar" name="nif" placeholder="NIF" value="">
  </div>
  <div class="mb-2">
    <input id="RegistoTLM" type="number" class="input-login-registar" name="tlm" placeholder="N.º de telemóvel" value="">
  </div>
  <div class="mb-2">
    <span>Data de nascimento</span>
    <input id="RegistoDATANASC" type="date" class="input-login-registar" name="data_nasc" placeholder="Data de nascimento" value="">
  </div>
  <div class="mb-2">
    <input id="RegistoCONSEMAIL" type="checkbox" class="check-style"><span class="span-checkbox">Consinto a utilização do meu e-mail</span>
  </div>
  <div>
    <input id="RegistoSUBMIT" type="sumbit" class="btn-login text-center" value="Efetuar registo">
  </div>`
  }
  else{
    $(document).ready(function() {
      $('.js-example-basic-multiple').select2();
    });
    form.innerHTML=`<div class="mb-2">
    <input id="EntidadeNome" type="text" class="input-login-registar" name="nome_entidade" placeholder="Nome Entidade" value="">
  </div>
  <div class="mb-2">
    <input id="EntidadeNIF" type="text" class="input-login-registar" name="nif" placeholder="NIF" value="">
  </div>
  <div class="mb-2">
    <input id="EntidadeEmail" type="email" class="input-login-registar" name="email" placeholder="Endereço de e-mail" value="">
  </div>
  <div class="mb-2">
    <input id="RegistoPASSWORD" type="password" class="input-login-registar" name="password" placeholder="Password" value="">
  </div>
  <div class="mb-2">
    <input id="EntidadeWebsite" type="link" class="input-login-registar" name="website" placeholder="Website" value="">
  </div>
  <div class="mb-2">
    <span>Documento</span>
    <input id="EntidadeDocumento" type="file" class="input-login-registar" name="documento" placeholder="Documento" value="">
  </div>
  <div class="mb-2">
    <span>Testes disponiveis</span>  
    <select class="js-example-basic-multiple input-login-registar" name="states[]" multiple="multiple" required>
      <option>Teste PCR</option>
      <option>Teste Rápido Antigénio</option>
      <option>Teste Pesquisa Anticorpos</option>
    </select>
  </div>
  <div class="mb-2">
    <span>Hora de Abertura</span>
    <input id="HoraAbertura" type="time" class="input-login-registar" name="hora_abertura" value="">
  </div>
  <div class="mb-2">
    <span>Hora de Fecho</span>
    <input id="HoraFecho" type="time" class="input-login-registar">
  </div>
  <div class="mb-2">
    <span>Tempo estimado de cada teste (Ex: 00:20 para 20 minutos)</span>
    <input id="TempoTeste" type="time" class="input-login-registar">
  </div>
  <div class="mb-2">
    <span>Drive Thru</span>
    <input id="HoraFecho" type="checkbox" class="">
  </div>
  <div class="mb-2">
    <span>Aceita receber pedidos "call me"?</span>
    <input id="HoraFecho" type="checkbox" class="">
  </div>
  <div>
    <button id="RegistoSUBMIT" type="sumbit" class="btn-login text-center">Efetuar registo</button>
  </div>`
  }
})
