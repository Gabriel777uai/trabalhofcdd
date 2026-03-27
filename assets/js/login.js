(function () {
  "use strict";
  const mostrarSenha = document.getElementById("mostrarSenha");
  const campoSenha = document.getElementById("validationCustom02");

  // Mostrar/Esconder senha
  mostrarSenha.addEventListener("change", function () {
    campoSenha.type = this.checked ? "text" : "password";
  });
  if (localStorage.getItem("acessToken")) {
    window.location.href = "pages/inicial.html";
  }
})();

let formLogin = document.getElementById("form-login");
let url_base;
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("Testes em Desenvolvimento");

  url_base = "http://localhost/";
} else {
  console.log("Rodando em Produção");
  url_base = "https://trabalhofcdd-backend.onrender.com/";
}
formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  let formData = new FormData(formLogin);

  try {
    let response = await fetch(`${url_base}api/v1/login`, {
      method: "POST",
      body: formData,
    });

    let data = await response.json();
    if (data.response) {
      localStorage.setItem("acessToken", data.token);
      localStorage.setItem("id", data.id);
      localStorage.setItem("usuario", data.userName);
      localStorage.setItem("role", data.role);
      if (localStorage.getItem("role") === "vendedor") {
        window.location.href = "pages/vender.html";
        return;
      }
      if (localStorage.getItem("acessToken")) {
        window.location.href = "pages/inicial.html";
      }
    } else {
      let redirect_recuperacao = document.createElement("a");
      redirect_recuperacao.href = "recuperation.html";
      redirect_recuperacao.textContent = "Esqueci minha senha";
      redirect_recuperacao.classList.add("mt-3");
      redirect_recuperacao.id = "recuperaton_link";
      if (!document.getElementById("recuperaton_link")) {
        formLogin.appendChild(redirect_recuperacao);
      }

      document.querySelector("button[type='submit']").disabled = false;

      localStorage.setItem("userErrorPassword", formData.get("login"));

      Swal.fire({
        icon: "error",
        title: "Erro ao fazer login",
        text: data.status,
        confirmButtonColor: "#4a90e2",
      });
    }
  } catch (error) {
    console.error("Erro:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Credenciais inválidas",
      confirmButtonColor: "#4a90e2",
    });
  }
});

let form_of_testing = document.getElementById("form-of-testign");
let btn = document.getElementById("send-btn");

form_of_testing.addEventListener("submit", async (e) => {
  e.preventDefault();
  btn.innerHTML = `<div class="spinner-border" role="status">
    <span class="visually-hidden">Aguarde...</span>
  </div>`;
  form_test_data = new FormData(form_of_testing);
  console.log("Enviado com sucesso");
  try {
    const response = await fetch(
      "https://n8n-3dg1.onrender.com/webhook/605cfe06-1915-4739-b60c-d43b776dc2b10",
      {
        method: "POST",
        body: form_test_data,
      },
    );
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-success");
    btn.innerHTML = `<i class="bi bi-check2-all"></i>`;
    btn.disabled;
    const data = await response.json();

    if (data.sucess) {
      Swal.fire({
        icon: "success",
        title: "Sua conta está sendo validada!",
        text: `${data.response}, em breve um email irá chegar no seu email!`,
        confirmButtonColor: "#4a90e2",
      });
    } else {
      throw console.log(data.response);
    }
  } catch (e) {
    console.error(e);
    Swal.fire({
      icon: "error",
      title: "Falha ao enviar dados!",
      text: `Ocorreu um erro ao enviar os dados para nosso servidor, entre em contato com um desenvolvedor!`,
      confirmButtonColor: "#4a90e2",
    });
  }
});
