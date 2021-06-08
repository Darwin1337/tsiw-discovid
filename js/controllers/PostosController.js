import { UtilizadorEntidadeModel, EnderecoEntidadeModel, TesteEntidadeModel } from "../models/PostosModel.js"

export default class PostosController {
  constructor() {
    this.postos = localStorage.utilizadores_entidades ? JSON.parse(localStorage.utilizadores_entidades) : [];
    this.enderecos = localStorage.enderecos_entidade ? JSON.parse(localStorage.enderecos_entidade) : [];
    this.localidades = localStorage.localidades ? JSON.parse(localStorage.localidades) : [];
  }

  GetAllPostos() {
    return this.postos;
  }
  GetAllEnderecos() {
    return this.enderecos;
  }
  GetAllLocalidades() {
    return this.localidades;
  }

  EditPosto(id, nome, email, password, website, horario_inicio, horario_fim, intervalo_consulta, morada, cod_postal, drive_thru, call_me){
    let x=true
    // console.log(id)
    // console.log(nome)
    // console.log(nif)
    // console.log(email)
    // console.log(password)
    // console.log(website)
    // console.log(horario_inicio)
    // console.log(horario_fim)
    // console.log(intervalo_consulta)
    // console.log(drive_thru)
    // console.log(call_me)
    for (let i = 0; i < this.postos.length; i++) {
      if (this.postos[i]["id"]==id) {
        x=false
      }
      if (x==false) {
        this.postos[i].nome = nome;
        //this.postos[i].nif = nif;
        this.postos[i].email = email;
        this.postos[i].password = password;
        this.postos[i].website = website;
        this.postos[i].horario_inicio = horario_inicio;
        this.postos[i].horario_fim = horario_fim;
        this.postos[i].intervalo_consulta = intervalo_consulta;
        this.postos[i].drive_thru = drive_thru;
        this.postos[i].call_me = call_me;
        break;
      }
    }

    if(x==false){
      for (let i = 0; i < this.enderecos.length; i++) {
        if (id==this.enderecos[i]["id_entidade"]) {
          this.enderecos[i].morada=morada;
          this.enderecos[i].cod_postal=cod_postal;
        }
      }
      localStorage.removeItem("enderecos_entidade");
      localStorage.setItem("enderecos_entidade", JSON.stringify(this.enderecos));
      localStorage.removeItem("utilizadores_entidades");
      localStorage.setItem("utilizadores_entidades", JSON.stringify(this.postos));
      Swal.fire('Sucesso!', 'O posto foi alterado com sucesso!', 'success');
      event.preventDefault()
      setTimeout(function(){location.reload()},1500);
    }
}

  // AddTest(nome) {
  //   const newId = this.testes.length > 0 ? this.testes[this.testes.length - 1].id_teste + 1 : 1;
  //   this.testes.push(new Postos(newId, nome));
  //   localStorage.setItem("testes", JSON.stringify(this.testes));
  // }
}
