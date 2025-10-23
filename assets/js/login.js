(function () {
  "use strict";

  const form = document.getElementById("formLogin");
  const btnLogin = document.getElementById("btnLogin");
  const carregando = document.getElementById("carregando");
  const textoBotao = document.getElementById("textoBotao");
  const mostrarSenha = document.getElementById("mostrarSenha");
  const campoSenha = document.getElementById("senha");

  // Validação em tempo real
  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      // Mostrar loading
      btnLogin.disabled = true;
      carregando.classList.remove("d-none");
      textoBotao.textContent = "Entrando...";
    }
    form.classList.add("was-validated");
  });

  // Mostrar/Esconder senha
  mostrarSenha.addEventListener("change", function () {
    campoSenha.type = this.checked ? "text" : "password";
  });

  // Auto-focus no primeiro campo
  document.getElementById("usuario").focus();

  // Limpar mensagens de erro após 5 segundos
  setTimeout(function () {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach(function (alert) {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    });
  }, 5000);
})();

let formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

    let formData = new FormData(formLogin);

  try {
    let response = await fetch("http://162.240.111.208:5000/api/v1/login", {
      method: "POST",
      body: formData
    });

    let data = await response.json();
    if (data.response) {   
        localStorage.setItem("acessToken", data.token);
        localStorage.setItem("id", data.id);
        localStorage.setItem("usuario", data.userName);
        if (localStorage.getItem('acessToken')) {
            window.location.href = "pages/inicial.html";
        }
    } else {
        let alertDiv = document.createElement("div");
        alertDiv.classList.add("alert", "alert-danger", "mt-3");
        alertDiv.textContent = data.status;
        formLogin.appendChild(alertDiv);
        document.querySelector("button[type='submit']").disabled = false;
        carregando.classList.add("d-none");
        textoBotao.textContent = "Entrar";
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro. Por favor, tente novamente.");
  }
});
