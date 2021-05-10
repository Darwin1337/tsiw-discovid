const registar=document.querySelector("#pills-registar-tab")
const login=document.querySelector("#pills-login-tab")
registar.addEventListener("click",function(){
  registar.classList.remove("register-tab")
  registar.classList.add("login-tab")
  login.classList.remove("login-tab")
  login.classList.add("register-tab")
})
login.addEventListener("click",function(){
  registar.classList.remove("login-tab")
  registar.classList.add("register-tab")
  login.classList.remove("register-tab")
  login.classList.add("login-tab")
})